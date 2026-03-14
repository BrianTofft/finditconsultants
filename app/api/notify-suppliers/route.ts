import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { emailHtml, infoBox, quoteBlock } from "@/lib/email-template";

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
    const rows = [
      { label: "Land",        value: request.land       ?? "—" },
      { label: "Varighed",    value: request.duration   ?? "—" },
      { label: "Arbejdsform", value: request.work_mode  ?? "—" },
      { label: "Opstart",     value: request.start_date ?? "—" },
      { label: "Kompetencer", value: request.competencies?.join(", ") ?? "—" },
    ];
    if (request.admin_note) {
      rows.push({ label: "Note fra FindITconsultants", value: request.admin_note });
    }

    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: supplier.email,
      subject: "Ny IT-opgave tilgængelig",
      html: emailHtml({
        title: "Ny IT-opgave tilgængelig",
        body: `
          <p>Hej ${supplier.company_name ?? supplier.email},</p>
          <p>Der er en ny IT-opgave som matcher jeres profil.</p>
          ${quoteBlock(request.description)}
          ${infoBox(rows)}
        `,
        ctaLabel: "Log ind og indsend kandidater",
        ctaUrl: "https://finditconsultants.com/supplier",
      }),
    });
  }

  return NextResponse.json({ success: true });
}
