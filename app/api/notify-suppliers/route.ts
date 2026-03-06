import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { request_id, supplier_ids } = await req.json();

  // Hent opgave detaljer
  const { data: request } = await supabase
    .from("requests")
    .select("*")
    .eq("id", request_id)
    .single();

  // Hent leverandør emails
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, email, company_name")
    .in("id", supplier_ids);

  if (!request || !suppliers) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Gem kobling i databasen
  await supabase.from("request_suppliers").insert(
    supplier_ids.map((id: string) => ({
      request_id,
      supplier_id: id,
      notified_at: new Date().toISOString(),
    }))
  );

  // Send email til hver leverandør
  for (const supplier of suppliers) {
    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: supplier.email,
      subject: `Ny IT-opgave tilgængelig`,
      html: `
        <h2>Hej ${supplier.company_name ?? supplier.email}</h2>
        <p>Der er en ny IT-opgave som matcher jeres profil.</p>
        <h3>Opgavebeskrivelse:</h3>
        <p>${request.description}</p>
        <p><strong>Kompetencer:</strong> ${request.competencies?.join(", ")}</p>
        <p><strong>Varighed:</strong> ${request.duration}</p>
        <p><strong>Arbejdsform:</strong> ${request.work_mode}</p>
        <p><strong>Opstart:</strong> ${request.start_date}</p>
        ${request.admin_note ? `<h3>Note fra FindITconsultants:</h3><p>${request.admin_note}</p>` : ""}
        <hr/>
        <p>Log ind på <a href="https://finditconsultants.com/supplier">leverandørportalen</a> for at indsende kandidater.</p>
      `,
    });
  }

  return NextResponse.json({ success: true });
}
