import { NextRequest, NextResponse } from "next/server";
import {
  updateOrderStatus,
  createDeliveryAssignment,
  updateDeliveryAssignment,
  getDeliveryAssignmentByOrderId,
  upsertDriverFromShipday,
  createTipRecord,
  logDispatchEvent,
  getOrder,
} from "@rwc/db";

// Simulated driver for demo mode
const DEMO_DRIVER = {
  shipday_id: "demo-driver-1",
  name: "Carlos M.",
  phone: "(650) 555-0201",
};

// Simulated GPS waypoints (restaurant → customer in Redwood City)
const WAYPOINTS = [
  { lat: 37.4863, lng: -122.2275 }, // restaurant area
  { lat: 37.4855, lng: -122.2260 },
  { lat: 37.4845, lng: -122.2245 },
  { lat: 37.4838, lng: -122.2230 },
  { lat: 37.4830, lng: -122.2220 }, // customer area
];

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id: orderId } = await params;

  // Verify order exists and is ready
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (
    order.status !== "ready_for_pickup" &&
    order.status !== "confirmed" &&
    order.status !== "preparing"
  ) {
    return NextResponse.json(
      { error: `Cannot simulate delivery from status "${order.status}"` },
      { status: 400 }
    );
  }

  // If not already ready_for_pickup, move it there first
  if (order.status !== "ready_for_pickup") {
    await updateOrderStatus(orderId, "ready_for_pickup");
    await sleep(500);
  }

  try {
    // Step 1: Driver assigned
    const driverId = await upsertDriverFromShipday(
      DEMO_DRIVER.shipday_id,
      DEMO_DRIVER.name,
      DEMO_DRIVER.phone
    );

    const assignmentId = await createDeliveryAssignment(
      orderId,
      driverId,
      `demo-shipday-${Date.now()}`
    );

    await updateDeliveryAssignment(assignmentId, {
      tracking_url: `https://track.shipday.com/demo/${orderId}`,
    });

    await updateOrderStatus(orderId, "driver_assigned");
    await logDispatchEvent(orderId, "driver_assigned", "demo", {
      driver_name: DEMO_DRIVER.name,
    });

    // Step 2: After delay, driver picks up (en_route)
    await sleep(6000);

    await updateDeliveryAssignment(assignmentId, {
      picked_up_at: new Date().toISOString(),
      driver_lat: WAYPOINTS[0].lat,
      driver_lng: WAYPOINTS[0].lng,
    });
    await updateOrderStatus(orderId, "en_route");
    await logDispatchEvent(orderId, "picked_up", "demo", {});

    // Step 3: Simulate driver moving through waypoints
    for (let i = 1; i < WAYPOINTS.length - 1; i++) {
      await sleep(6000);
      await updateDeliveryAssignment(assignmentId, {
        driver_lat: WAYPOINTS[i].lat,
        driver_lng: WAYPOINTS[i].lng,
      });
    }

    // Step 4: Delivered
    await sleep(6000);
    await updateDeliveryAssignment(assignmentId, {
      delivered_at: new Date().toISOString(),
      driver_lat: WAYPOINTS[WAYPOINTS.length - 1].lat,
      driver_lng: WAYPOINTS[WAYPOINTS.length - 1].lng,
    });
    await updateOrderStatus(orderId, "delivered");
    await logDispatchEvent(orderId, "delivered", "demo", {});

    // Create tip record if there's a tip
    if (order.tip > 0) {
      await createTipRecord(orderId, assignmentId, driverId, order.tip);
    }

    return NextResponse.json({ success: true, steps: "assigned → en_route → delivered" });
  } catch (err: any) {
    console.error("Simulate delivery failed:", err);
    return NextResponse.json(
      { error: err.message || "Simulation failed" },
      { status: 500 }
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
