import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Velkommen til FindITconsultants — din opgave er godkendt",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2d2c2c;">Din opgave er godkendt ✓</h2>
        <p>Vi har gennemgået din forespørgsel og er klar til at gå i gang med at finde den rette konsulent til dig.</p>
        <p>Du har fået adgang til vores kundeportal, hvor du kan følge processen:</p>
        <div style="background: #f8f6f3; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Login:</strong> ${email}</p>
          <p style="margin: 8px 0 0;"><strong>Midlertidigt password:</strong> ${password}</p>
        </div>
        <a href="https://finditconsultants.dk/portal/login" 
          style="display: inline-block; background: #e8632a; color: white; font-weight: bold; padding: 12px 24px; border-radius: 99px; text-decoration: none;">
          Log ind på kundeportalen →
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Vi anbefaler at du skifter dit password første gang du logger ind.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}