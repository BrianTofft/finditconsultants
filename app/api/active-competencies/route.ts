import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 120; // cache i 2 minutter

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .select("competencies")
    .eq("admin_status", "accepted")
    .neq("status", "Afsluttet");

  if (error || !data) {
    return NextResponse.json({ competencies: [], count: 0 });
  }

  // Tæl forekomster pr. kompetence
  const freq: Record<string, number> = {};
  for (const row of data) {
    for (const c of row.competencies ?? []) {
      freq[c] = (freq[c] ?? 0) + 1;
    }
  }

  // Sorter og returnér top 8 + antal aktive forespørgsler
  const competencies = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({ competencies, requestCount: data.length });
}
