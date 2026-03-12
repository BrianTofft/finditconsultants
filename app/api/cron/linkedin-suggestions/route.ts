import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel kalder cron-routes med denne header for at bevise det er Vercel selv
function isAuthorized(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

function postBox(num: number, format: string, tema: string, content: string) {
  const lines = content.trim().split("\n").map(l =>
    `<p style="margin:0 0 6px;font-size:14px;line-height:1.7;color:#333;">${l}</p>`
  ).join("");

  return `
    <div style="margin:0 0 28px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="background:#e8632a;color:#fff;font-weight:800;font-size:11px;
                     padding:3px 10px;border-radius:20px;text-transform:uppercase;
                     letter-spacing:.5px;">Post ${num}</span>
        <span style="font-size:12px;color:#888;font-weight:600;">${format} · ${tema}</span>
      </div>
      <div style="background:#f8f6f3;border-left:3px solid #e8632a;border-radius:0 8px 8px 0;
                  padding:16px 20px;">
        ${lines}
      </div>
      <p style="margin:8px 0 0;font-size:11px;color:#bbb;">
        Klik, kopiér og scheduler på LinkedIn →
      </p>
    </div>`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Hent ugedag og dato til prompt-kontekst
  const now = new Date();
  const dateStr = now.toLocaleDateString("da-DK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // Generér 4 posts med Claude
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Du er marketing-assistent for FindITconsultants (finditconsultants.com) — en dansk IT-konsulent multi-sourcing platform.

Dagens dato: ${dateStr}

Skriv 4 LinkedIn post-forslag på DANSK til IT-beslutningstagere (CTO, IT-chef, indkøbschef) i danske virksomheder.

Brug datoen til at vælge relevante vinkler (budgetseason, årsafslutning, ferieperioder, teknologitendenser osv.)

FORMAT — ét JSON-objekt med 4 posts:
{
  "posts": [
    { "format": "Kort & provokerende", "tema": "...", "content": "..." },
    { "format": "Data / benchmark",    "tema": "...", "content": "..." },
    { "format": "Mini-story",          "tema": "...", "content": "..." },
    { "format": "Thought leadership",  "tema": "...", "content": "..." }
  ]
}

REGLER:
- Naturlig, direkte dansk — ikke corporate-sprog
- Linjeskift mellem afsnit (\n)
- Slut hver post med en blød CTA mod finditconsultants.com
- Ingen hashtags (maks 2 hvis meget relevante)
- Post 1: maks 6 linjer
- Post 2: brug realistiske DK-priser (850–1.500 kr/t)
- Post 3: 40–70 ord, en situation IT-chefen genkender
- Post 4: en klar holdning om IT-sourcing, nearshoring, leverandørstyring eller AI

Svar KUN med det rå JSON-objekt, ingen markdown-blokke.`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const { posts } = JSON.parse(raw) as {
    posts: { format: string; tema: string; content: string }[];
  };

  // Byg HTML-email
  const postsHtml = posts.map((p, i) =>
    postBox(i + 1, p.format, p.tema, p.content)
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="da">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">

    <div style="background:#fff;border-radius:12px 12px 0 0;padding:24px 40px;text-align:center;border:1px solid #ede9e3;border-bottom:none;">
      <img src="https://finditconsultants.com/logo.png" width="220" style="width:220px;max-width:100%;" alt="FindITconsultants" />
    </div>
    <div style="height:3px;background:#e8632a;"></div>

    <div style="background:#fff;padding:36px 40px;border:1px solid #ede9e3;border-top:none;border-bottom:none;">
      <h2 style="margin:0 0 6px;font-size:20px;color:#2d2c2c;font-weight:800;">
        📋 Ugens LinkedIn-forslag
      </h2>
      <p style="margin:0 0 28px;font-size:13px;color:#999;">
        ${dateStr} · Vælg 2 favoritter og scheduler på LinkedIn
      </p>

      ${postsHtml}

      <div style="background:#f8f6f3;border:1px solid #ede9e3;border-radius:8px;padding:16px 20px;margin-top:8px;">
        <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
          💡 <strong>Tip:</strong> Varier formaterne — post ikke to af samme type samme uge.
          Bedste posttidspunkter på LinkedIn: <strong>Tirsdag–torsdag kl. 8–9</strong> eller <strong>12–13</strong>.
        </p>
      </div>
    </div>

    <div style="background:#f8f6f3;border-radius:0 0 12px 12px;padding:20px 40px;border:1px solid #ede9e3;border-top:none;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">
        FindITconsultants.com · <a href="https://finditconsultants.com" style="color:#e8632a;text-decoration:none;">finditconsultants.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;

  await resend.emails.send({
    from: "FindITconsultants <noreply@finditconsultants.com>",
    to: "hej@finditkonsulenter.dk",
    subject: `📋 Ugens LinkedIn-forslag — ${now.toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`,
    html,
  });

  return NextResponse.json({ success: true, posts: posts.length });
}
