import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { syncUserToHubspot } from "@/lib/hubspot";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password, role, company_name, contact_name, phone, first_name, last_name, company_type, competencies, extra_competencies } = await req.json();

  // Opret bruger i Supabase Auth
  // Kunder og leverandører skal vælge deres eget password ved første login
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: role !== "admin" ? { must_change_password: true } : {},
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? "Kunne ikke oprette bruger" }, { status: 400 });
  }

  const userId = authData.user.id;

  // Tilføj til den rigtige tabel
  if (role === "admin") {
    await supabaseAdmin.from("admins").insert({
      id: userId, email,
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      phone: phone ?? "",
    });
  } else if (role === "supplier") {
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || contact_name || "";
    await supabaseAdmin.from("suppliers").insert({
      id: userId, email, company_name, phone,
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      contact_name: fullName,
      company_type: company_type ?? "",
      competencies: competencies ?? [],
      extra_competencies: extra_competencies ?? "",
    });
  } else if (role === "customer") {
    const customerName = [first_name, last_name].filter(Boolean).join(" ").trim() || contact_name || "";
    await supabaseAdmin.from("customers").insert({ id: userId, email, company_name, contact_name: customerName, phone });
  }

  // Sync til HubSpot (non-blocking — fejler aldrig brugeroprettelsen)
  if (role === "customer" || role === "supplier") {
    syncUserToHubspot({
      email,
      firstname: first_name || contact_name?.split(" ")[0],
      lastname: last_name || contact_name?.split(" ").slice(1).join(" "),
      phone,
      company_name,
      role,
    }).catch(() => {}); // fire-and-forget
  }

  return NextResponse.json({ success: true, userId });
}
