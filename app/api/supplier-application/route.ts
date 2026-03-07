import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { emailHtml, infoBox } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // Gem ansøgning i databasen
  const { error } = await supabase.from("supplier_applications").insert({
    company_name:       body.company_name,
    first_name:         body.first_name,
    last_name:          body.last_name,
    email:              body.email,
    phone:              body.phone,
    company_type:       body.company_type,
    competencies:       body.competencies,
    extra_competencies: body.extra_competencies,
    language:           body.language,
    status:             "Afventer",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Advis admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `Ny leverandøransøgning: ${body.company_name}`,
    html: emailHtml({
      title: `Ny leverandøransøgning: ${body.company_name}`,
      body: infoBox([
        { label: "Virksomhed",  value: body.company_name },
        { label: "Kontakt",     value: `${body.first_name} ${body.last_name}` },
        { label: "Email",       value: body.email },
        { label: "Telefon",     value: body.phone              ?? "—" },
        { label: "Type",        value: body.company_type       ?? "—" },
        { label: "Kompetencer", value: body.competencies?.join(", ") ?? "—" },
        { label: "Yderligere",  value: body.extra_competencies ?? "—" },
        { label: "Sprog",       value: body.language           ?? "—" },
      ]),
      ctaLabel: "Se ansøgning i admin panel",
      ctaUrl: "https://finditconsultants.com/admin/ans%C3%B8gninger",
    }),
  });

  return NextResponse.json({ success: true });
}
