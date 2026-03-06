import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface UpdateItem {
  company_name: string;
  competencies: string[];
  extra_competencies: string;
  company_type: string;
  phone: string;
}

interface UpdateResult {
  company_name: string;
  status: "opdateret" | "ikke fundet" | "fejl";
  error?: string;
}

export async function POST(req: Request) {
  const { updates } = await req.json() as { updates: UpdateItem[] };

  if (!updates?.length) return NextResponse.json({ results: [] });

  const results: UpdateResult[] = [];

  for (const u of updates) {
    try {
      // Find supplier by company_name (case-insensitive)
      const { data: matches } = await supabaseAdmin
        .from("suppliers")
        .select("id")
        .ilike("company_name", u.company_name);

      if (!matches || matches.length === 0) {
        results.push({ company_name: u.company_name, status: "ikke fundet" });
        continue;
      }

      // Only update fields that have values — don't overwrite with empty
      const updateObj: Record<string, unknown> = {};
      if (u.competencies.length > 0)    updateObj.competencies       = u.competencies;
      if (u.extra_competencies.trim()) updateObj.extra_competencies = u.extra_competencies.trim();
      if (u.company_type.trim())       updateObj.company_type       = u.company_type.trim();
      if (u.phone.trim())              updateObj.phone              = u.phone.trim();

      if (Object.keys(updateObj).length === 0) {
        results.push({ company_name: u.company_name, status: "opdateret" });
        continue;
      }

      const { error } = await supabaseAdmin
        .from("suppliers")
        .update(updateObj)
        .ilike("company_name", u.company_name);

      if (error) {
        results.push({ company_name: u.company_name, status: "fejl", error: error.message });
      } else {
        results.push({ company_name: u.company_name, status: "opdateret" });
      }
    } catch (err) {
      results.push({ company_name: u.company_name, status: "fejl", error: String(err) });
    }
  }

  return NextResponse.json({ results });
}
