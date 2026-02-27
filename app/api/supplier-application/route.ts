import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // Gem ansøgning i databasen
  const { error } = await supabase.from("supplier_applications").insert({
    company_name: body.company_name,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    company_type: body.company_type,
    competencies: body.competencies,
    extra_competencies: body.extra_competencies,
    language: body.language,
    status: "Afventer",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Advis admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `Ny leverandør ansøgning: ${body.company_name}`,
    html: `
      <h2>Ny leverandør ansøgning</h2>
      <p><strong>Virksomhed:</strong> ${body.company_name}</p>
      <p><strong>Kontakt:</strong> ${body.first_name} ${body.last_name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Telefon:</strong> ${body.phone}</p>
      <p><strong>Type:</strong> ${body.company_type}</p>
      <p><strong>Kompetencer:</strong> ${body.competencies?.join(", ")}</p>
      <p><strong>Yderligere:</strong> ${body.extra_competencies}</p>
      <p><strong>Sprog:</strong> ${body.language}</p>
      <hr/>
      <p>Log ind på <a href="https://finditconsultants.com/admin">admin panelet</a> for at godkende eller afslå ansøgningen.</p>
    `,
  });

  return NextResponse.json({ success: true });
}