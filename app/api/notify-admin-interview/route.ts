import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { emailHtml, infoBox } from "@/lib/email-template";

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

  const formattedDatetime = interview_datetime
    ? new Date(interview_datetime).toLocaleString("da-DK", {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : null;

  // Send til leverandør
  if (supplier && decision === "interview") {
    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: supplier.email,
      subject: `Interview ønsket: ${submission.name}`,
      html: emailHtml({
        title: `Interview ønsket: ${submission.name}`,
        body: `
          <p>Hej ${supplier.company_name ?? supplier.email},</p>
          <p><strong>${customer_name}</strong> ønsker at invitere <strong>${submission.name}</strong> til interview.</p>
          ${formattedDatetime
            ? infoBox([{ label: "Foreslået tidspunkt", value: formattedDatetime }])
            : `<p style="color:#888;font-size:13px;">Kunden har ikke foreslået et tidspunkt endnu.</p>`
          }
        `,
        ctaLabel: "Bekræft i leverandørportalen",
        ctaUrl: "https://finditconsultants.com/supplier",
      }),
    });
  }

  // Advisering til admin
  const adminRows = [
    { label: "Kandidat",   value: `${submission.name}${submission.title ? ` — ${submission.title}` : ""}` },
    { label: "Beslutning", value: decision === "interview" ? "Interview ønsket" : "Afvist" },
    { label: "Kunde",      value: customer_name },
  ];
  if (formattedDatetime) {
    adminRows.push({ label: "Foreslået tidspunkt", value: formattedDatetime });
  }

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: decision === "interview"
      ? `Interview ønsket: ${submission.name}`
      : `Kandidat afvist: ${submission.name}`,
    html: emailHtml({
      title: `Beslutning fra ${customer_name}`,
      body: infoBox(adminRows),
      ctaLabel: "Se i admin panel",
      ctaUrl: "https://finditconsultants.com/admin/konsulenter",
    }),
  });

  return NextResponse.json({ success: true });
}
