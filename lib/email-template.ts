/**
 * Shared branded email template for FindITconsultants.com
 *
 * Logo file: /public/logo.png  →  https://finditconsultants.com/logo.png
 */

const LOGO_URL = "https://finditconsultants.com/logo.png";
const ORANGE   = "#e8632a";
const CHARCOAL = "#2d2c2c";
const BG       = "#f8f6f3";
const BORDER   = "#ede9e3";

/** Renders a highlighted info-box with key/value rows */
export function infoBox(rows: { label: string; value: string }[]) {
  return `
    <div style="background:${BG};border:1px solid ${BORDER};border-radius:8px;padding:16px 20px;margin:20px 0;">
      ${rows
        .map(
          ({ label, value }) =>
            `<p style="margin:0 0 8px;font-size:13px;color:${CHARCOAL};"><strong>${label}:</strong> ${value}</p>`
        )
        .join("")}
    </div>`;
}

/** Renders a quoted description block with an orange left-border */
export function quoteBlock(text: string) {
  return `<p style="background:${BG};border-left:3px solid ${ORANGE};padding:12px 16px;border-radius:0 8px 8px 0;font-style:italic;color:#555;font-size:13px;margin:16px 0;">${text}</p>`;
}

/** Wraps content in the branded FindITconsultants email shell */
export function emailHtml({
  title,
  body,
  ctaLabel,
  ctaUrl,
  note,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  note?: string;
}) {
  const cta =
    ctaLabel && ctaUrl
      ? `<div style="margin:28px 0;">
           <a href="${ctaUrl}"
              style="display:inline-block;background:${ORANGE};color:#fff;font-weight:700;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:15px;">
             ${ctaLabel} →
           </a>
         </div>`
      : "";

  const noteHtml = note
    ? `<p style="color:#999;font-size:12px;margin-top:20px;">${note}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Logo header -->
    <div style="background:#fff;border-radius:12px 12px 0 0;padding:24px 40px;text-align:center;border:1px solid ${BORDER};border-bottom:none;">
      <img
        src="${LOGO_URL}"
        alt="FindITconsultants.com — Your IT multi-sourcing partner"
        width="260"
        style="width:260px;max-width:100%;height:auto;display:block;margin:0 auto;"
      />
    </div>

    <!-- Orange accent line -->
    <div style="height:3px;background:${ORANGE};"></div>

    <!-- Content card -->
    <div style="background:#fff;padding:36px 40px;border:1px solid ${BORDER};border-top:none;border-bottom:none;">
      <h2 style="margin:0 0 20px;font-size:20px;color:${CHARCOAL};font-weight:700;">${title}</h2>
      <div style="font-size:14px;line-height:1.7;color:#444;">
        ${body}
      </div>
      ${cta}
      ${noteHtml}
    </div>

    <!-- Footer -->
    <div style="background:${BG};border-radius:0 0 12px 12px;padding:20px 40px;border:1px solid ${BORDER};border-top:none;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">
        Med venlig hilsen &nbsp;·&nbsp;
        <strong style="color:${CHARCOAL};">FindITconsultants.com</strong><br>
        <a href="https://finditconsultants.com" style="color:${ORANGE};text-decoration:none;font-size:11px;">
          finditconsultants.com
        </a>
      </p>
    </div>

  </div>
</body>
</html>`;
}
