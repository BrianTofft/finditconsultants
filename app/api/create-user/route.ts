import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password, role, company_name, contact_name, phone, first_name, last_name, company_type } = await req.json();

  // Opret bruger i Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
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
    });
  } else if (role === "customer") {
    await supabaseAdmin.from("customers").insert({ id: userId, email, company_name, contact_name, phone });
  }

  return NextResponse.json({ success: true, userId });
}