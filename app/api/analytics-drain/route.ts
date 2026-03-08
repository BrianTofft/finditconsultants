import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

// Modtager Vercel Web Analytics Log Drain events og gemmer dem i page_events
// Vercel sender: POST med JSON-array af events + x-vercel-signature header
export async function POST(req: Request) {
  // Valider secret token i URL
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== process.env.ANALYTICS_DRAIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = Array.isArray(body) ? body : [body];

  const rows = events
    .filter((e: any) => e.eventType === "pageview" || e.eventType === "event")
    .map((e: any) => ({
      event_timestamp: e.timestamp ?? null,
      path: e.path ?? null,
      session_id: e.sessionId ?? null,
      device_id: e.deviceId ?? null,
      event_type: e.eventType ?? "pageview",
      referrer: e.referrer ?? null,
    }));

  if (rows.length > 0) {
    const { error } = await supabase.from("page_events").insert(rows);
    if (error) {
      console.error("analytics-drain insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: rows.length });
}
