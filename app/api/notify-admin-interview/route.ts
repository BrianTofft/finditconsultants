import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { decision, submission_id, interview_datetime, customer_name } = await req.json();

  const { data: submission } = await supabase
    .from("consultant_submissions")
    .select("name, title, supplier_id")
    .eq("id", submission_id)
    .single();

  if (!submission) return NextResponse.json({ success: false }, { status: 400 });

  // Hent leverandør email
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("email, company_name")
    .eq("id", submission.supplier_id)
    .single();

  // Send til leverandør
  if (supplier && decision === "interview") {
    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: supplier.email,
      subject: `Interview ønsket: ${submission.name}`,
      html: `
        <h2>Hej ${supplier.company_name ?? supplier.email}</h2>
        <p><strong>${customer_name}</strong> ønsker at invitere <strong>${submission.name}</strong> til interview.</p>
        ${interview_datetime ? `<p><strong>Foreslået tidspunkt:</strong> ${new Date(interview_datetime).toLocaleString("da-DK")}</p>` : "<p>Kunden har ikke foreslået et tidspunkt endnu.</p>"}
        <hr/>
        <p>Log ind på <a href="https://finditconsultants.com/supplier">leverandørportalen</a> for at bekræfte eller foreslå nyt tidspunkt.</p>
      `,
    });
  }

  // Send også advisering til admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: decision === "interview" ? `Interview ønsket: ${submission.name}` : `Kandidat afvist: ${submission.name}`,
    html: `
      <h2>Beslutning fra ${customer_name}</h2>
      <p><strong>Kandidat:</strong> ${submission.name} — ${submission.title}</p>
      <p><strong>Beslutning:</strong> ${decision === "interview" ? "Interview ønsket" : "Afvist"}</p>
      ${interview_datetime ? `<p><strong>Foreslået tidspunkt:</strong> ${new Date(interview_datetime).toLocaleString("da-DK")}</p>` : ""}
    `,
  });

  return NextResponse.json({ success: true });
}