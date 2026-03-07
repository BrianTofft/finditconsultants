import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailHtml } from "@/lib/email-template";

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

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: email,
    subject: "Nulstil dit password — FindITconsultants",
    html: emailHtml({
      title: "Nulstil dit password",
      body: `
        <p>Vi har modtaget en anmodning om at nulstille passwordet til din konto på FindITconsultants.</p>
        <p>Klik på knappen nedenfor for at vælge et nyt password. Linket er gyldigt i 24 timer.</p>
      `,
      ctaLabel: "Nulstil password",
      ctaUrl: resetLink,
      note: "Hvis du ikke har anmodet om dette, kan du se bort fra denne email — dit password er uændret.",
    }),
  });

  return NextResponse.json({ success: true });
}
