import { NextRequest, NextResponse } from "next/server";
import { syncUserToHubspot } from "@/lib/hubspot";

export async function POST(req: NextRequest) {
  const { email, firstname, lastname, phone, company_name, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "Mangler email eller role" }, { status: 400 });

  // Fire-and-forget internt — returnér straks så portalen ikke venter
  syncUserToHubspot({ email, firstname, lastname, phone, company_name, role }).catch(() => {});

  return NextResponse.json({ success: true });
}
