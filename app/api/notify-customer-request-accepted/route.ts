import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { emailHtml, quoteBlock } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, description } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Din nye forespørgsel er modtaget og godkendt",
    html: emailHtml({
      title: "Vi er gået i gang 🚀",
      body: `
        <p>Vi har modtaget og godkendt din nye forespørgsel:</p>
        ${description ? quoteBlock(description) : ""}
        <p>Vi aktiverer nu vores netværk af IT-konsulenthuse og vender tilbage med screenede kandidatprofiler hurtigst muligt — typisk inden for <strong>3 arbejdsdage</strong>.</p>
        <p>Du kan følge status og se kandidater i din kundeportal.</p>
      `,
      ctaLabel: "Gå til kundeportalen",
      ctaUrl: "https://finditconsultants.com/portal/login",
    }),
  });

  return NextResponse.json({ success: true });
}
