import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, first_name, company_name } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Tak for din tilmelding som leverandør",
    html: `
      <h2>Hej ${first_name}</h2>
      <p>Tak for at ${company_name} har tilmeldt sig som leverandør hos FindITconsultants.com.</p>
      <p>Du hører fra os, når der er opgaver der matcher jeres profil.</p>
      <hr/>
      <p>Med venlig hilsen<br/>FindITconsultants.com</p>
    `,
  });

  return NextResponse.json({ success: true });
}