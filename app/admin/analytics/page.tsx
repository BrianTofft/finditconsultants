"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Oversætter rå referrer-URL til et menneskevenligt kildernavn
function parseSource(referrer: string | null): string {
  if (!referrer) return "Direkte";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.startsWith("google.")) return "Google";
    if (host === "bing.com") return "Bing";
    if (host === "linkedin.com") return "LinkedIn";
    if (host === "facebook.com" || host === "fb.com") return "Facebook";
    if (host === "instagram.com") return "Instagram";
    if (host === "twitter.com" || host === "t.co" || host === "x.com") return "Twitter / X";
    if (host === "finditconsultants.com") return "Intern";
    return host;
  } catch {
    return "Direkte";
  }
}

type TrafficData = {
  today: number;
  week: number;
  month: number;
  uniqueMonth: number;
  topPages: { path: string; count: number }[];
  dailyLast30: { date: string; count: number }[];
  topSources: { source: string; count: number }[];
};

const speedUrl       = process.env.NEXT_PUBLIC_VERCEL_SPEED_URL ?? "";
const deploymentsUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENTS_URL ?? "";

export default function AnalyticsPage() {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const now = new Date();
      const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
      const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now); startOfMonth.setDate(now.getDate() - 30);

      const [todayRes, weekRes, monthRes] = await Promise.all([
        supabase.from("page_events").select("id", { count: "exact", head: true })
          .eq("event_type", "pageview").gte("recorded_at", startOfToday.toISOString()),
        supabase.from("page_events").select("id", { count: "exact", head: true })
          .eq("event_type", "pageview").gte("recorded_at", startOfWeek.toISOString()),
        supabase.from("page_events").select("device_id, path, recorded_at, referrer")
          .eq("event_type", "pageview").gte("recorded_at", startOfMonth.toISOString()),
      ]);

      const monthRows = monthRes.data ?? [];
      const uniqueMonth = new Set(monthRows.map(r => r.device_id).filter(Boolean)).size;

      // Top sider
      const pathCounts: Record<string, number> = {};
      for (const r of monthRows) {
        if (r.path) pathCounts[r.path] = (pathCounts[r.path] ?? 0) + 1;
      }
      const topPages = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([path, count]) => ({ path, count }));

      // Daglige sidevisninger (seneste 30 dage)
      const dailyCounts: Record<string, number> = {};
      for (const r of monthRows) {
        const day = r.recorded_at.slice(0, 10);
        dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
      }
      const dailyLast30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toISOString().slice(0, 10);
        return { date: dateStr, count: dailyCounts[dateStr] ?? 0 };
      });

      // Trafikkilder
      const sourceCounts: Record<string, number> = {};
      for (const r of monthRows) {
        const src = parseSource((r as any).referrer ?? null);
        sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
      }
      const topSources = Object.entries(sourceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([source, count]) => ({ source, count }));

      setTraffic({
        today: todayRes.count ?? 0,
        week: weekRes.count ?? 0,
        month: monthRows.length,
        uniqueMonth,
        topPages,
        dailyLast30,
        topSources,
      });
      setLoading(false);
    };
    load();
  }, []);

  const maxDay = traffic ? Math.max(...traffic.dailyLast30.map(d => d.count), 1) : 1;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-xl text-charcoal">Analytics</h1>
        <p className="text-xs text-charcoal/45 mt-0.5">Webtrafik via Vercel Log Drain → Supabase</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-charcoal/8 rounded-xl" />)}
          </div>
          <div className="h-40 bg-charcoal/8 rounded-xl" />
        </div>
      ) : traffic && traffic.month === 0 ? (
        <div className="bg-orange/5 border border-orange/20 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">📡</p>
          <p className="font-bold text-charcoal mb-1">Ingen data endnu</p>
          <p className="text-xs text-charcoal/50">Log Drain er opsat — data vises her når der er trafik på finditconsultants.com</p>
        </div>
      ) : traffic ? (
        <div className="space-y-6">

          {/* ── Tal-oversigt ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "I dag",           value: traffic.today,       icon: "📅" },
              { label: "Seneste 7 dage",  value: traffic.week,        icon: "📆" },
              { label: "Seneste 30 dage", value: traffic.month,       icon: "📊" },
              { label: "Unikke bes. (30d)", value: traffic.uniqueMonth, icon: "👤" },
            ].map(item => (
              <div key={item.label} className="bg-white border border-[#ede9e3] rounded-xl px-4 py-4">
                <p className="text-xs text-charcoal/40 mb-1">{item.icon} {item.label}</p>
                <p className="text-2xl font-black text-charcoal">{item.value.toLocaleString("da-DK")}</p>
              </div>
            ))}
          </div>

          {/* ── Dagligt søjlediagram ── */}
          <div className="bg-white border border-[#ede9e3] rounded-xl px-5 pt-5 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40 mb-4">Sidevisninger per dag — seneste 30 dage</p>
            <div className="flex items-end gap-0.5 h-28">
              {traffic.dailyLast30.map(({ date, count }) => {
                const h = Math.round((count / maxDay) * 100);
                const isToday = date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className={`w-full rounded-t-sm transition-all ${isToday ? "bg-orange" : "bg-orange/30 group-hover:bg-orange/60"}`}
                      style={{ height: `${Math.max(h, count > 0 ? 4 : 0)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {new Date(date).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}: {count}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-charcoal/30 mt-1">
              <span>{new Date(traffic.dailyLast30[0].date).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}</span>
              <span>I dag</span>
            </div>
          </div>

          {/* ── Top sider + Trafikkilder side om side ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {traffic.topPages.length > 0 && (
              <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40 mb-4">Top sider — seneste 30 dage</p>
                <div className="space-y-2.5">
                  {traffic.topPages.map(({ path, count }) => {
                    const pct = Math.round((count / traffic.topPages[0].count) * 100);
                    const share = traffic.month > 0 ? Math.round((count / traffic.month) * 100) : 0;
                    return (
                      <div key={path} className="flex items-center gap-3">
                        <span className="text-[12px] text-charcoal/70 font-mono w-32 truncate shrink-0">{path || "/"}</span>
                        <div className="flex-1 bg-charcoal/6 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-orange rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-charcoal w-8 text-right shrink-0">{count}</span>
                        <span className="text-[11px] text-charcoal/35 w-9 text-right shrink-0">{share}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {traffic.topSources.length > 0 && (
              <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40 mb-4">Trafikkilder — seneste 30 dage</p>
                <div className="space-y-2.5">
                  {traffic.topSources.map(({ source, count }) => {
                    const pct = Math.round((count / traffic.topSources[0].count) * 100);
                    const share = traffic.month > 0 ? Math.round((count / traffic.month) * 100) : 0;
                    const icon =
                      source === "Google"      ? "🔍" :
                      source === "LinkedIn"    ? "💼" :
                      source === "Facebook"    ? "📘" :
                      source === "Instagram"   ? "📸" :
                      source === "Twitter / X" ? "🐦" :
                      source === "Bing"        ? "🔎" :
                      source === "Direkte"     ? "🔗" :
                      source === "Intern"      ? "🏠" : "🌐";
                    return (
                      <div key={source} className="flex items-center gap-3">
                        <span className="text-[12px] text-charcoal/70 w-32 truncate shrink-0 flex items-center gap-1.5">
                          <span>{icon}</span>{source}
                        </span>
                        <div className="flex-1 bg-charcoal/6 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-green rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-charcoal w-8 text-right shrink-0">{count}</span>
                        <span className="text-[11px] text-charcoal/35 w-9 text-right shrink-0">{share}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : null}

      {/* ── Links til Vercel ── */}
      <div className="mt-8 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-charcoal/30">Åbn i Vercel</p>
        {[
          speedUrl       && { label: "Speed Insights",  icon: "⚡", url: speedUrl,       desc: "Core Web Vitals — LCP, CLS, FID og TTFB" },
          deploymentsUrl && { label: "Deployments",      icon: "🚀", url: deploymentsUrl, desc: "Byggestatus og log for seneste deployments" },
        ].filter(Boolean).map((link: any) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border border-[#ede9e3] rounded-xl p-4 hover:border-orange/30 hover:shadow-sm transition-all group">
            <span className="text-xl">{link.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-charcoal group-hover:text-orange transition-colors">{link.label}</p>
              <p className="text-xs text-charcoal/40">{link.desc}</p>
            </div>
            <span className="text-charcoal/25 group-hover:text-orange transition-colors">↗</span>
          </a>
        ))}
      </div>

    </div>
  );
}
