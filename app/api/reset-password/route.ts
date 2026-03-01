import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  // Generér reset-link via Supabase Admin (ingen email sendes herfra)
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: "https://finditconsultants.com/reset-password",
    },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message ?? "Kunne ikke generere reset-link" }, { status: 400 });
  }

  const resetLink = data.properties.action_link;

  // Send branded email via Resend
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Nulstil dit password — FindITconsultants",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2d2c2c;">Nulstil dit password</h2>
        <p style="color: #555;">Vi har modtaget en anmodning om at nulstille passwordet til din konto på FindITconsultants.</p>
        <p style="color: #555;">Klik på knappen nedenfor for at vælge et nyt password. Linket er gyldigt i 24 timer.</p>
        <div style="margin: 28px 0;">
          <a href="${resetLink}"
            style="display: inline-block; background: #e8632a; color: white; font-weight: bold; padding: 14px 28px; border-radius: 99px; text-decoration: none; font-size: 15px;">
            Nulstil password →
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">Hvis du ikke har anmodet om dette, kan du se bort fra denne email — dit password er uændret.</p>
        <hr style="border: none; border-top: 1px solid #ede9e3; margin: 24px 0;" />
        <p style="color: #bbb; font-size: 11px;">FindITconsultants · finditconsultants.com</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
