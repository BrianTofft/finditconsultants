import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { supplier_name, consultant_name, request_description } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditconsultants.com",
    subject: `Ny kandidat indsendt: ${consultant_name}`,
    html: `
      <h2>Ny kandidat indsendt</h2>
      <p><strong>Leverandør:</strong> ${supplier_name}</p>
      <p><strong>Kandidat:</strong> ${consultant_name}</p>
      <p><strong>Opgave:</strong> ${request_description}</p>
      <hr/>
      <p>Log ind på <a href="https://finditconsultants.com/admin">admin panelet</a> for at godkende eller afvise kandidaten.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
