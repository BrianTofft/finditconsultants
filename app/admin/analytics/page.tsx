"use client";

/* ─────────────────────────────────────────────────────────────────
   Sæt NEXT_PUBLIC_VERCEL_ANALYTICS_URL i Vercel Environment Variables
   til fx: https://vercel.com/DIT-TEAM/finditconsultants/analytics
   ───────────────────────────────────────────────────────────────── */

const analyticsUrl  = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL ?? "";
const speedUrl      = process.env.NEXT_PUBLIC_VERCEL_SPEED_URL ?? "";
const deploymentsUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENTS_URL ?? "";

const configured = !!analyticsUrl;

const links = [
  {
    label:   "Web Analytics",
    icon:    "📊",
    url:     analyticsUrl,
    desc:    "Sidevisninger, unikke besøgende, top-sider og trafikkilder",
    color:   "bg-orange",
  },
  {
    label:   "Speed Insights",
    icon:    "⚡",
    url:     speedUrl,
    desc:    "Core Web Vitals — LCP, CLS, FID og TTFB per side",
    color:   "bg-charcoal",
  },
  {
    label:   "Deployments",
    icon:    "🚀",
    url:     deploymentsUrl,
    desc:    "Byggestatus og log for seneste Vercel-deployments",
    color:   "bg-green",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl">

      <div className="mb-8">
        <h1 className="font-bold text-xl text-charcoal">Analytics</h1>
        <p className="text-xs text-charcoal/45 mt-0.5">Drevet af Vercel Web Analytics</p>
      </div>

      {/* ── Links til Vercel ── */}
      <div className="space-y-3 mb-10">
        {links.map(link => (
          link.url ? (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border border-[#ede9e3] rounded-2xl p-5 hover:border-orange/30 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 ${link.color} rounded-xl flex items-center justify-center flex-shrink-0 text-xl`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-charcoal group-hover:text-orange transition-colors">{link.label}</p>
                <p className="text-xs text-charcoal/45 mt-0.5">{link.desc}</p>
              </div>
              <span className="text-charcoal/25 group-hover:text-orange text-sm transition-colors flex-shrink-0">↗</span>
            </a>
          ) : null
        ))}
      </div>

      {/* ── Setup-guide hvis env vars mangler ── */}
      {!configured && (
        <div className="bg-orange/5 border border-orange/20 rounded-2xl p-6">
          <p className="font-bold text-sm text-charcoal mb-1">⚙️ Opsætning mangler</p>
          <p className="text-xs text-charcoal/60 mb-5 leading-relaxed">
            Tilføj disse tre miljøvariabler i dit Vercel-projekt for at aktivere linkene ovenfor.
          </p>

          <ol className="space-y-4 text-xs">
            <li>
              <p className="font-bold text-charcoal/70 mb-1">1. Find din Vercel Analytics URL</p>
              <p className="text-charcoal/50 mb-1.5">
                Log ind på <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange underline">vercel.com</a>{" "}
                → vælg projektet <strong>finditconsultants</strong> → klik på <strong>Analytics</strong>.
                Kopiér URL'en fra browseren — den ligner:
              </p>
              <code className="block bg-charcoal text-white rounded-xl px-4 py-2.5 font-mono text-[11px] break-all">
                https://vercel.com/DIT-TEAM/finditconsultants/analytics
              </code>
            </li>

            <li>
              <p className="font-bold text-charcoal/70 mb-1">2. Gå til Project Settings → Environment Variables</p>
              <p className="text-charcoal/50 mb-2">Tilføj disse tre variabler (alle med scope: <em>Production</em>):</p>
              <div className="space-y-2">
                {[
                  { key: "NEXT_PUBLIC_VERCEL_ANALYTICS_URL",   suffix: "/analytics" },
                  { key: "NEXT_PUBLIC_VERCEL_SPEED_URL",        suffix: "/speed-insights" },
                  { key: "NEXT_PUBLIC_VERCEL_DEPLOYMENTS_URL",  suffix: "/deployments" },
                ].map(v => (
                  <div key={v.key} className="bg-white border border-[#ede9e3] rounded-xl px-4 py-2.5">
                    <p className="font-mono font-bold text-orange text-[11px]">{v.key}</p>
                    <p className="text-charcoal/40 text-[11px] mt-0.5 font-mono">
                      https://vercel.com/DIT-TEAM/finditconsultants{v.suffix}
                    </p>
                  </div>
                ))}
              </div>
            </li>

            <li>
              <p className="font-bold text-charcoal/70 mb-1">3. Redeploy</p>
              <p className="text-charcoal/50">
                Push en tom commit eller klik <strong>Redeploy</strong> i Vercel for at aktivere de nye variabler.
              </p>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
