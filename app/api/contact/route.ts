import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { emailHtml, infoBox, quoteBlock } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    description,
    competencies,
    startDate,
    duration,
    workMode,
    scope,
    language,
    nearshore,
    email,
    fileUrl,
    maxRate,
    land,
  } = body;

  // Gem i database
  await supabase.from("requests").insert({
    email,
    description,
    competencies,
    start_date: startDate || null,
    duration,
    work_mode: workMode,
    scope,
    language,
    nearshore,
    land: land || null,
    status: "Ny",
    file_url: fileUrl || null,
    max_rate: maxRate || null,
  });

  // Byg info-rækker
  const rows = [
    { label: "Email",               value: email },
    { label: "Land",                value: land           ?? "—" },
    { label: "Opstart",             value: startDate      ?? "—" },
    { label: "Varighed",            value: duration       ?? "—" },
    { label: "Arbejdsform",         value: workMode       ?? "—" },
    { label: "Omfang",              value: scope          ?? "—" },
    { label: "Sprog",               value: language       ?? "—" },
    { label: "Nearshore/Offshore",  value: nearshore      ?? "—" },
    { label: "Kompetencer",         value: competencies?.join(", ") ?? "—" },
  ];
  if (maxRate) rows.push({ label: "Maks. timepris", value: `${maxRate}/time` });

  try {
    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: "hej@finditkonsulenter.dk",
      subject: `Ny IT-konsulent forespørgsel fra ${email}`,
      html: emailHtml({
        title: `Ny forespørgsel fra ${email}`,
        body: `
          ${quoteBlock(description)}
          ${infoBox(rows)}
          ${fileUrl
            ? `<p style="font-size:13px;"><strong>📎 Vedhæftet fil:</strong> <a href="${fileUrl}" style="color:#e8632a;">${fileUrl}</a></p>`
            : ""}
        `,
        ctaLabel: "Åbn i admin panel",
        ctaUrl: "https://finditconsultants.com/admin/afventer",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
