import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailHtml, infoBox, quoteBlock } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { submission_id } = await req.json();
  if (!submission_id) return NextResponse.json({ error: "Mangler submission_id" }, { status: 400 });

  // Hent submission inkl. request og leverandørinfo
  const { data: submission } = await supabase
    .from("consultant_submissions")
    .select("*, requests(description, email), suppliers(company_name)")
    .eq("id", submission_id)
    .single();

  if (!submission || !submission.requests) {
    return NextResponse.json({ error: "Submission ikke fundet" }, { status: 400 });
  }

  const customerEmail  = submission.requests.email;
  const requestSnippet = submission.requests.description?.slice(0, 150) ?? "";

  // Byg kandidat-info rækker
  const rows = [
    { label: "Konsulent", value: submission.name },
    { label: "Titel",     value: submission.title ?? "—" },
  ];
  if (submission.rate)              rows.push({ label: "Timepris",       value: `${submission.rate} DKK/t` });
  if (submission.availability)      rows.push({ label: "Tilgængelighed", value: submission.availability });
  if (submission.skills?.length)    rows.push({ label: "Kompetencer",    value: submission.skills.join(", ") });

  // Send email til kunden
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: customerEmail,
    subject: "Vi har fundet en kandidat til din opgave",
    html: emailHtml({
      title: "Vi har fundet en kandidat til dig 🎯",
      body: `
        <p>Vi har matchet en konsulentprofil til din forespørgsel:</p>
        ${quoteBlock(`"${requestSnippet}…"`)}
        ${infoBox(rows)}
        ${submission.bio
          ? `<p style="font-size:13px;color:#555;margin-top:8px;"><strong>Profil:</strong> ${submission.bio}</p>`
          : ""}
      `,
      ctaLabel: "Se kandidaten i kundeportalen",
      ctaUrl: "https://finditconsultants.com/portal",
    }),
  });

  // Kopi til admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `Kandidat præsenteret: ${submission.name} → ${customerEmail}`,
    html: emailHtml({
      title: "Kandidat præsenteret for kunde",
      body: infoBox([
        { label: "Kandidat", value: `${submission.name}${submission.title ? ` — ${submission.title}` : ""}` },
        { label: "Kunde",    value: customerEmail },
        { label: "Opgave",   value: `${requestSnippet}…` },
      ]),
    }),
  });

  return NextResponse.json({ success: true });
}
