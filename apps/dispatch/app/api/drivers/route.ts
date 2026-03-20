import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: drivers, error } = await supabase
      .from("drivers")
      .select("id, full_name, phone, is_active")
      .eq("is_active", true)
      .order("full_name");

    if (error) throw error;

    return NextResponse.json(drivers || []);
  } catch (err: any) {
    console.error("Failed to fetch drivers:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}
