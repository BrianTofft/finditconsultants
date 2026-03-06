import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { emails, role } = await req.json() as { emails: string[]; role: "customer" | "supplier" };

  if (!emails?.length) return NextResponse.json({ existingEmails: [] });

  const table = role === "customer" ? "customers" : "suppliers";

  const { data } = await supabaseAdmin
    .from(table)
    .select("email")
    .in("email", emails);

  const existingEmails = (data ?? []).map((r: { email: string }) => r.email);

  return NextResponse.json({ existingEmails });
}
