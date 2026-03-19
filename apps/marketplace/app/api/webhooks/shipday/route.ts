import { NextRequest, NextResponse } from "next/server";
import {
  updateOrderStatus,
  createDeliveryAssignment,
  updateDeliveryAssignment,
  getDeliveryAssignmentByOrderId,
  upsertDriverFromShipday,
  createTipRecord,
  logDispatchEvent,
} from "@rwc/db";

// Shipday webhook events
// Shipday sends POST with JSON body containing order status updates.
// Unlike Onfleet, Shipday does not use HMAC signatures — we verify via
// a shared webhook secret passed as a query parameter or header.

export async function POST(request: NextRequest) {
  // Verify webhook authenticity via shared secret
  const secret = process.env.SHIPDAY_WEBHOOK_SECRET;
  if (secret) {
    const providedSecret =
      request.nextUrl.searchParams.get("secret") ??
      request.headers.get("X-Shipday-Secret") ??
      "";
    if (providedSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Shipday webhook payload shape:
  // { orderId, orderNumber, status, carrier: { id, name, phone, latitude, longitude },
  //   trackingLink, deliveryPhoto, orderMetadata: { order_id, zone_id, batch_id } }

  const orderId = payload.orderMetadata?.order_id ?? null;
  if (!orderId) {
    // Not one of our orders, acknowledge
    return NextResponse.json({ ok: true });
  }

  const status = payload.status?.toUpperCase();

  try {
    switch (status) {
      case "ASSIGNED": {
        // Driver assigned to delivery
        const carrier = payload.carrier;
        if (carrier) {
          const driverId = await upsertDriverFromShipday(
            String(carrier.id),
            carrier.name,
            carrier.phone || ""
          );

          await createDeliveryAssignment(
            orderId,
            driverId,
            payload.orderId ? String(payload.orderId) : null
          );

          await updateOrderStatus(orderId, "driver_assigned");

          // Store tracking URL and driver location
          const assignment = await getDeliveryAssignmentByOrderId(orderId);
          if (assignment) {
            const updates: Record<string, any> = {};
            if (payload.trackingLink) updates.tracking_url = payload.trackingLink;
            if (carrier.latitude != null && carrier.longitude != null) {
              updates.driver_lat = carrier.latitude;
              updates.driver_lng = carrier.longitude;
            }
            if (Object.keys(updates).length > 0) {
              await updateDeliveryAssignment(assignment.id, updates);
            }
          }
        }

        await logDispatchEvent(orderId, "driver_assigned", "shipday", {
          shipday_order_id: payload.orderId,
          carrier_id: payload.carrier?.id,
          carrier_name: payload.carrier?.name,
          tracking_link: payload.trackingLink,
        });
        break;
      }

      case "STARTED":
      case "PICKED_UP": {
        // Driver picked up the order — en route to customer
        await updateOrderStatus(orderId, "en_route");

        const assignment = await getDeliveryAssignmentByOrderId(orderId);
        if (assignment) {
          const updates: Record<string, any> = {
            picked_up_at: new Date().toISOString(),
          };
          if (payload.carrier?.latitude != null) {
            updates.driver_lat = payload.carrier.latitude;
            updates.driver_lng = payload.carrier.longitude;
          }
          await updateDeliveryAssignment(assignment.id, updates);
        }

        await logDispatchEvent(orderId, "picked_up", "shipday", {
          shipday_order_id: payload.orderId,
        });
        break;
      }

      case "IN_TRANSIT": {
        // Driver location update while en route
        const assignment = await getDeliveryAssignmentByOrderId(orderId);
        if (assignment && payload.carrier?.latitude != null) {
          await updateDeliveryAssignment(assignment.id, {
            driver_lat: payload.carrier.latitude,
            driver_lng: payload.carrier.longitude,
          });
        }
        break;
      }

      case "DELIVERED": {
        // Delivery completed
        await updateOrderStatus(orderId, "delivered");

        const assignment = await getDeliveryAssignmentByOrderId(orderId);
        if (assignment) {
          const updates: Record<string, any> = {
            delivered_at: new Date().toISOString(),
          };
          if (payload.deliveryPhoto) {
            updates.delivery_photo_url = payload.deliveryPhoto;
          }
          await updateDeliveryAssignment(assignment.id, updates);

          // Create tip record
          const { createServerClient } = await import("@rwc/db");
          const supabase = createServerClient();
          const { data: order } = await supabase
            .from("orders")
            .select("tip")
            .eq("id", orderId)
            .single();

          if (order && order.tip > 0) {
            await createTipRecord(
              orderId,
              assignment.id,
              assignment.driver_id,
              order.tip
            );
          }
        }

        await logDispatchEvent(orderId, "delivered", "shipday", {
          shipday_order_id: payload.orderId,
          delivery_photo: payload.deliveryPhoto ?? null,
        });
        break;
      }

      case "FAILED":
      case "CANCELLED": {
        await logDispatchEvent(orderId, "delivery_failed", "shipday", {
          shipday_order_id: payload.orderId,
          status,
          reason: payload.failureReason ?? null,
        });
        break;
      }

      default: {
        // Location update or unknown event — log it
        if (payload.carrier?.latitude != null) {
          const assignment = await getDeliveryAssignmentByOrderId(orderId);
          if (assignment) {
            await updateDeliveryAssignment(assignment.id, {
              driver_lat: payload.carrier.latitude,
              driver_lng: payload.carrier.longitude,
            });
          }
        }
        await logDispatchEvent(orderId, `shipday_${status || "unknown"}`, "shipday", payload);
      }
    }
  } catch (err) {
    console.error(`Shipday webhook error for status ${status}:`, err);
    await logDispatchEvent(orderId, "webhook_error", "shipday", {
      status,
      error: String(err),
    }).catch(() => {});

    // Return 200 to prevent Shipday from retrying
    return NextResponse.json({ ok: true, error: "handled" });
  }

  return NextResponse.json({ ok: true });
}
