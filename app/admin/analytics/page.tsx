"use client";
import { useState } from "react";

/* ── Vercel Analytics URL ─────────────────────────────────────── */
const VERCEL_ANALYTICS_URL =
  "https://vercel.com/briantofft/finditconsultants/analytics";

const VERCEL_SPEED_URL =
  "https://vercel.com/briantofft/finditconsultants/speed-insights";

const VERCEL_DEPLOYMENTS_URL =
  "https://vercel.com/briantofft/finditconsultants/deployments";

type View = "analytics" | "speed";

export default function AnalyticsPage() {
  const [view, setView] = useState<View>("analytics");
  const [iframeBlocked, setIframeBlocked] = useState(false);

  const currentUrl =
    view === "analytics" ? VERCEL_ANALYTICS_URL : VERCEL_SPEED_URL;

  return (
    <div className="p-4 md:p-8 flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h1 className="font-bold text-xl text-charcoal">Analytics</h1>
          <p className="text-xs text-charcoal/45 mt-0.5">
            Drevet af Vercel Web Analytics
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#ede9e3] rounded-xl p-1">
          <button
            onClick={() => { setView("analytics"); setIframeBlocked(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === "analytics"
                ? "bg-orange text-white shadow-sm"
                : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            📊 Trafik
          </button>
          <button
            onClick={() => { setView("speed"); setIframeBlocked(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === "speed"
                ? "bg-orange text-white shadow-sm"
                : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            ⚡ Speed
          </button>
        </div>

        {/* Open in Vercel button */}
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-charcoal text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-charcoal/80 transition-colors"
        >
          Åbn i Vercel ↗
        </a>
      </div>

      {/* Quick-links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: "Web Analytics", icon: "📊", url: VERCEL_ANALYTICS_URL, desc: "Sidevisninger & besøgende" },
          { label: "Speed Insights", icon: "⚡", url: VERCEL_SPEED_URL, desc: "Core Web Vitals & ydeevne" },
          { label: "Deployments", icon: "🚀", url: VERCEL_DEPLOYMENTS_URL, desc: "Seneste Vercel-deployments" },
        ].map(card => (
          <a
            key={card.label}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-[#ede9e3] rounded-2xl p-4 hover:border-orange/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{card.icon}</span>
              <span className="font-bold text-sm text-charcoal group-hover:text-orange transition-colors">
                {card.label}
              </span>
              <span className="ml-auto text-charcoal/25 group-hover:text-orange text-xs transition-colors">↗</span>
            </div>
            <p className="text-xs text-charcoal/45">{card.desc}</p>
          </a>
        ))}
      </div>

      {/* iframe embed */}
      <div className="flex-1 bg-white border border-[#ede9e3] rounded-2xl overflow-hidden min-h-[500px] relative">
        {!iframeBlocked ? (
          <>
            <iframe
              key={view}
              src={currentUrl}
              className="w-full h-full min-h-[600px] border-0"
              title="Vercel Analytics"
              onError={() => setIframeBlocked(true)}
              /* Vercel may block iframe — onLoad check below */
              onLoad={e => {
                try {
                  // If the iframe loaded a Vercel login/block page, detect it
                  const doc = (e.target as HTMLIFrameElement).contentDocument;
                  if (doc && doc.title && doc.title.toLowerCase().includes("sign in")) {
                    setIframeBlocked(true);
                  }
                } catch {
                  // Cross-origin — Vercel blocked the embed
                  setIframeBlocked(true);
                }
              }}
            />
            {/* Overlay hint */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              💡 Log ind på Vercel hvis dashboardet er blankt
            </div>
          </>
        ) : (
          /* Fallback når iframe er blokeret */
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="text-6xl mb-6">📈</div>
            <h2 className="font-bold text-xl text-charcoal mb-2">
              Åbn Vercel Analytics
            </h2>
            <p className="text-sm text-charcoal/50 mb-6 max-w-sm">
              Vercel tillader ikke iframe-visning af dashboardet af sikkerhedshensyn.
              Åbn det direkte i Vercel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={VERCEL_ANALYTICS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
              >
                📊 Web Analytics ↗
              </a>
              <a
                href={VERCEL_SPEED_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-charcoal text-white font-bold px-6 py-3 rounded-full hover:bg-charcoal/80 transition-colors"
              >
                ⚡ Speed Insights ↗
              </a>
            </div>
            <p className="text-xs text-charcoal/35 mt-6">
              Tip: Du skal være logget ind på{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange">
                vercel.com
              </a>{" "}
              for at se data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
