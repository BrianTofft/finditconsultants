import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailHtml, infoBox } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { supplier_name, consultant_name, request_description } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `Ny kandidat indsendt: ${consultant_name}`,
    html: emailHtml({
      title: "Ny kandidat indsendt",
      body: `
        <p>En leverandør har indsendt en ny kandidat til gennemgang.</p>
        ${infoBox([
          { label: "Leverandør",  value: supplier_name },
          { label: "Kandidat",    value: consultant_name },
          { label: "Opgave",      value: request_description },
        ])}
      `,
      ctaLabel: "Åbn admin panel",
      ctaUrl: "https://finditconsultants.com/admin/konsulenter",
    }),
  });

  return NextResponse.json({ success: true });
}
