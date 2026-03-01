import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, first_name, company_name, password } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Velkommen som leverandør hos FindITconsultants.com ✓",
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #2d2c2c;">
        <div style="background: #2d2c2c; padding: 28px 32px; border-radius: 12px 12px 0 0; border-bottom: 4px solid #e28100;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">FindITconsultants.com</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #ede9e3; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 18px; margin: 0 0 16px;">Hej ${first_name} ✓</h2>
          <p style="margin: 0 0 12px; color: #555;">${company_name} er nu godkendt som leverandør hos FindITconsultants.com.</p>
          <p style="margin: 0 0 20px; color: #555;">Du kan straks logge ind på leverandørportalen med nedenstående oplysninger:</p>

          <div style="background: #f8f6f3; border: 1px solid #ede9e3; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 13px;"><strong>Login (email):</strong> ${email}</p>
            <p style="margin: 0; font-size: 13px;"><strong>Midlertidigt password:</strong> <code style="background:#fff;padding:2px 6px;border-radius:4px;border:1px solid #ddd;">${password}</code></p>
          </div>

          <a href="https://finditconsultants.com/supplier/login"
             style="display: inline-block; background: #e28100; color: #fff; font-weight: bold; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-size: 15px; margin-bottom: 24px;">
            Log ind på leverandørportalen →
          </a>

          <p style="margin: 0 0 8px; color: #777; font-size: 13px;">Husk at skifte dit password ved første login under "Min profil" i portalen.</p>
          <p style="margin: 0 0 8px; color: #777; font-size: 13px;">Du modtager en besked, når der er forespørgsler der matcher jeres kompetenceprofil.</p>
          <hr style="border: none; border-top: 1px solid #ede9e3; margin: 24px 0;" />
          <p style="margin: 0; color: #999; font-size: 12px;">Med venlig hilsen<br/><strong>FindITconsultants.com</strong></p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}