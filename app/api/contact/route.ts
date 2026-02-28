import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    status: "Ny",
  });

  // Send email
  try {
    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: "hej@finditkonsulenter.dk",
      subject: `Ny IT-konsulent forespørgsel fra ${email}`,
      html: `
        <h2>Ny forespørgsel via finditconsultants.com</h2>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Opgavebeskrivelse:</strong><br/>${description}</p>
        <p><strong>Kompetencer:</strong> ${competencies?.join(", ")}</p>
        <hr />
        <p><strong>Opstart:</strong> ${startDate}</p>
        <p><strong>Varighed:</strong> ${duration}</p>
        <p><strong>Arbejdsform:</strong> ${workMode}</p>
        <p><strong>Omfang:</strong> ${scope}</p>
        <p><strong>Sprog:</strong> ${language}</p>
        <p><strong>Nearshore:</strong> ${nearshore}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
