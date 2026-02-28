import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const customerEmail = submission.requests.email;
  const requestSnippet = submission.requests.description?.slice(0, 120) ?? "";

  // Send email til kunden
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: customerEmail,
    subject: `Vi har fundet en kandidat til din opgave`,
    html: `
      <h2>Vi har fundet en kandidat til dig 🎯</h2>
      <p>Vi har matchet en konsulentprofil til din forespørgsel:</p>
      <p style="color:#888;font-size:13px;font-style:italic;">"${requestSnippet}…"</p>
      <hr/>
      <h3 style="margin-bottom:4px;">${submission.name}</h3>
      <p style="margin:0;color:#555;">${submission.title ?? ""}</p>
      ${submission.rate ? `<p><strong>Timepris:</strong> ${submission.rate} DKK/t</p>` : ""}
      ${submission.availability ? `<p><strong>Tilgængelighed:</strong> ${submission.availability}</p>` : ""}
      ${submission.skills?.length ? `<p><strong>Kompetencer:</strong> ${submission.skills.join(", ")}</p>` : ""}
      ${submission.bio ? `<p><strong>Profil:</strong> ${submission.bio}</p>` : ""}
      <hr/>
      <p>Log ind på <a href="https://finditconsultants.com/portal">kundeportalen</a> for at se den fulde profil og tage stilling til kandidaten.</p>
    `,
  });

  // Kopi til admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `Kandidat præsenteret: ${submission.name} → ${customerEmail}`,
    html: `
      <p><strong>Kandidat præsenteret for kunde</strong></p>
      <p><strong>Kandidat:</strong> ${submission.name} — ${submission.title}</p>
      <p><strong>Kunde:</strong> ${customerEmail}</p>
      <p><strong>Opgave:</strong> ${requestSnippet}…</p>
    `,
  });

  return NextResponse.json({ success: true });
}
