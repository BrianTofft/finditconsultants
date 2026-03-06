import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { company_names } = await req.json() as { company_names: string[] };

  if (!company_names?.length) return NextResponse.json({ matchedNames: [] });

  // Fetch all suppliers and compare case-insensitively
  const { data } = await supabaseAdmin
    .from("suppliers")
    .select("company_name");

  const existing = new Set(
    (data ?? []).map((r: { company_name: string }) => r.company_name?.toLowerCase() ?? "")
  );

  const matchedNames = company_names.filter(n => existing.has(n.toLowerCase()));

  return NextResponse.json({ matchedNames });
}
