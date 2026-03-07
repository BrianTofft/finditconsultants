import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { emailHtml, infoBox } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Velkommen til FindITconsultants — din opgave er godkendt",
    html: emailHtml({
      title: "Din opgave er godkendt ✓",
      body: `
        <p>Vi har gennemgået din forespørgsel og er klar til at gå i gang med at finde den rette konsulent til dig.</p>
        <p>Du har fået adgang til vores kundeportal, hvor du kan følge processen:</p>
        ${infoBox([
          { label: "Login",                value: email },
          { label: "Midlertidigt password", value: `<code style="background:#fff;padding:2px 6px;border-radius:4px;border:1px solid #ddd;">${password}</code>` },
        ])}
      `,
      ctaLabel: "Log ind på kundeportalen",
      ctaUrl: "https://finditconsultants.com/portal/login",
      note: "Vi anbefaler at du skifter dit password første gang du logger ind.",
    }),
  });

  return NextResponse.json({ success: true });
}
