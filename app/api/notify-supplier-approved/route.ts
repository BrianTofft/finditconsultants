import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailHtml, infoBox } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, first_name, company_name, password } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Velkommen som leverandør hos FindITconsultants.com ✓",
    html: emailHtml({
      title: `Hej ${first_name} — velkommen ✓`,
      body: `
        <p><strong>${company_name}</strong> er nu godkendt som leverandør hos FindITconsultants.com.</p>
        <p>Du kan straks logge ind på leverandørportalen med nedenstående oplysninger:</p>
        ${infoBox([
          { label: "Login (email)",         value: email },
          { label: "Midlertidigt password", value: `<code style="background:#fff;padding:2px 6px;border-radius:4px;border:1px solid #ddd;">${password}</code>` },
        ])}
        <p style="font-size:13px;color:#666;">Du modtager en besked, når der er forespørgsler der matcher jeres kompetenceprofil.</p>
      `,
      ctaLabel: "Log ind på leverandørportalen",
      ctaUrl: "https://finditconsultants.com/supplier/login",
      note: 'Husk at skifte dit password ved første login under "Min profil" i portalen.',
    }),
  });

  return NextResponse.json({ success: true });
}
