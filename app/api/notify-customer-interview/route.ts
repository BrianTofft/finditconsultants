import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { submission_id, action, new_datetime } = await req.json();
  // action: 'accepted' | 'counter'

  const { data: submission } = await supabase
    .from("consultant_submissions")
    .select("name, title, supplier_id, request_id")
    .eq("id", submission_id)
    .single();

  if (!submission) return NextResponse.json({ success: false }, { status: 400 });

  // Hent kundens email via request
  const { data: request } = await supabase
    .from("requests")
    .select("email")
    .eq("id", submission.request_id)
    .single();

  // Hent leverandørens firmanavn
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("company_name, email")
    .eq("id", submission.supplier_id)
    .single();

  const supplierName = supplier?.company_name ?? supplier?.email ?? "Leverandøren";
  const formattedDate = new_datetime
    ? new Date(new_datetime).toLocaleString("da-DK", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  // Send email til kunden
  if (request?.email) {
    const subject = action === "accepted"
      ? `Interview bekræftet: ${submission.name}`
      : `Nyt foreslået interviewtidspunkt: ${submission.name}`;

    const html = action === "accepted"
      ? `
        <h2>Interview bekræftet ✓</h2>
        <p><strong>${supplierName}</strong> har bekræftet interviewet med <strong>${submission.name}</strong> (${submission.title}).</p>
        ${formattedDate ? `<p><strong>Tidspunkt:</strong> ${formattedDate}</p>` : ""}
        <hr/>
        <p>Log ind på <a href="https://finditconsultants.com/portal">kundeportalen</a> for at se detaljer.</p>
      `
      : `
        <h2>Nyt interviewtidspunkt foreslået</h2>
        <p><strong>${supplierName}</strong> foreslår et nyt tidspunkt for interview med <strong>${submission.name}</strong> (${submission.title}).</p>
        ${formattedDate ? `<p><strong>Foreslået tidspunkt:</strong> ${formattedDate}</p>` : ""}
        <hr/>
        <p>Log ind på <a href="https://finditconsultants.com/portal">kundeportalen</a> for at acceptere eller foreslå et andet tidspunkt.</p>
      `;

    await resend.emails.send({
      from: "FindITconsultants <noreply@finditconsultants.com>",
      to: request.email,
      subject,
      html,
    });
  }

  // Notificer admin
  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: action === "accepted"
      ? `Interview bekræftet af leverandør: ${submission.name}`
      : `Leverandør foreslår nyt interviewtidspunkt: ${submission.name}`,
    html: `
      <h2>Opdatering fra ${supplierName}</h2>
      <p><strong>Kandidat:</strong> ${submission.name} — ${submission.title}</p>
      <p><strong>Handling:</strong> ${action === "accepted" ? "Interview accepteret" : "Nyt tidspunkt foreslået"}</p>
      ${formattedDate ? `<p><strong>Tidspunkt:</strong> ${formattedDate}</p>` : ""}
    `,
  });

  return NextResponse.json({ success: true });
}
