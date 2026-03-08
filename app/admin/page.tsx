"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import MarketPulse from "@/components/MarketPulse";

type TrafficData = {
  today: number;
  week: number;
  month: number;
  uniqueMonth: number;
  topPages: { path: string; count: number }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0, accepted: 0, submissions: 0,
    contracts: 0, applications: 0, users: 0, unread: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);

  useEffect(() => {
    const load = async () => {
      const [pendingRes, acceptedRes, subRes, contractRes, appRes, userRes, msgRes, recentReqRes, recentSubRes] =
        await Promise.all([
          supabase.from("requests").select("*", { count: "exact", head: true }).or("admin_status.is.null,admin_status.eq.pending"),
          supabase.from("requests").select("*", { count: "exact", head: true }).eq("admin_status", "accepted").neq("status", "Afsluttet"),
          supabase.from("consultant_submissions").select("*", { count: "exact", head: true }),
          supabase.from("contracts").select("*", { count: "exact", head: true }),
          supabase.from("supplier_applications").select("*", { count: "exact", head: true }).eq("status", "Afventer"),
          supabase.from("user_roles").select("*", { count: "exact", head: true }),
          supabase.from("chat_messages").select("*", { count: "exact", head: true }).eq("read_by_admin", false).neq("sender_type", "admin"),
          supabase.from("requests").select("*").order("created_at", { ascending: false }).limit(6),
          supabase.from("consultant_submissions").select("*, requests(description, email)").order("created_at", { ascending: false }).limit(4),
        ]);

      setStats({
        pending: pendingRes.count ?? 0,
        accepted: acceptedRes.count ?? 0,
        submissions: subRes.count ?? 0,
        contracts: contractRes.count ?? 0,
        applications: appRes.count ?? 0,
        users: userRes.count ?? 0,
        unread: msgRes.count ?? 0,
      });
      setRecentRequests(recentReqRes.data ?? []);
      setRecentSubmissions(recentSubRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const loadTraffic = async () => {
      const now = new Date();
      const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
      const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now); startOfMonth.setDate(now.getDate() - 30);

      const [todayRes, weekRes, monthRes] = await Promise.all([
        supabase.from("page_events").select("id", { count: "exact", head: true })
          .eq("event_type", "pageview").gte("recorded_at", startOfToday.toISOString()),
        supabase.from("page_events").select("id", { count: "exact", head: true })
          .eq("event_type", "pageview").gte("recorded_at", startOfWeek.toISOString()),
        supabase.from("page_events").select("device_id")
          .eq("event_type", "pageview").gte("recorded_at", startOfMonth.toISOString()),
      ]);

      const monthRows = monthRes.data ?? [];
      const uniqueMonth = new Set(monthRows.map(r => r.device_id).filter(Boolean)).size;

      // Top sider (seneste 30 dage)
      const { data: pathRows } = await supabase
        .from("page_events").select("path")
        .eq("event_type", "pageview").gte("recorded_at", startOfMonth.toISOString())
        .not("path", "is", null);

      const pathCounts: Record<string, number> = {};
      for (const r of pathRows ?? []) {
        if (r.path) pathCounts[r.path] = (pathCounts[r.path] ?? 0) + 1;
      }
      const topPages = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));

      setTraffic({
        today: todayRes.count ?? 0,
        week: weekRes.count ?? 0,
        month: monthRows.length,
        uniqueMonth,
        topPages,
      });
    };
    loadTraffic();
  }, []);

  if (loading) return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-7 bg-charcoal/10 rounded w-40" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-charcoal/10 rounded-2xl" />)}
      </div>
    </div>
  );

  const alertCards = [
    {
      label: "Afventer godkendelse",
      value: stats.pending,
      href: "/admin/afventer",
      icon: "🕐",
      colorClass: "text-amber-600",
      bgClass: stats.pending > 0 ? "border-amber-300 bg-amber-50" : "border-[#ede9e3] bg-white",
      urgent: stats.pending > 0,
    },
    {
      label: "Nye ansøgninger",
      value: stats.applications,
      href: "/admin/ansøgninger",
      icon: "📋",
      colorClass: "text-blue-600",
      bgClass: stats.applications > 0 ? "border-blue-300 bg-blue-50" : "border-[#ede9e3] bg-white",
      urgent: stats.applications > 0,
    },
    {
      label: "Ulæste beskeder",
      value: stats.unread,
      href: "/admin/beskeder",
      icon: "💬",
      colorClass: "text-green-600",
      bgClass: stats.unread > 0 ? "border-green-300 bg-green-50" : "border-[#ede9e3] bg-white",
      urgent: stats.unread > 0,
    },
  ];

  const infoCards = [
    { label: "Aktive forespørgsler", value: stats.accepted, href: "/admin/forspørgsler", icon: "✅", colorClass: "text-orange" },
    { label: "Konsulentprofiler", value: stats.submissions, href: "/admin/konsulenter", icon: "👤", colorClass: "text-purple-600" },
    { label: "Kontrakter", value: stats.contracts, href: "/admin/kontrakter", icon: "📄", colorClass: "text-charcoal" },
  ];

  const statusLabel = (r: any) => {
    if (!r.admin_status || r.admin_status === "pending") return { label: "Afventer", cls: "bg-amber-100 text-amber-700" };
    if (r.admin_status === "accepted") return { label: "Godkendt", cls: "bg-green-100 text-green-700" };
    return { label: "Afvist", cls: "bg-red-100 text-red-700" };
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Overblik</h1>
        <p className="text-charcoal/45 text-sm">{stats.users} brugere registreret i systemet</p>
      </div>

      {/* Alert cards — actions required */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {alertCards.map(card => (
          <Link key={card.href} href={card.href}
            className={`rounded-2xl border-2 p-5 hover:shadow-md transition-all group ${card.bgClass}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {card.urgent && <span className="text-[9px] font-black tracking-widest uppercase text-orange bg-orange/10 px-2 py-0.5 rounded-full">Handling</span>}
            </div>
            <p className={`text-3xl font-black mb-1 ${card.colorClass}`}>{card.value}</p>
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {infoCards.map(card => (
          <Link key={card.href} href={card.href}
            className="bg-white rounded-2xl border border-[#ede9e3] p-5 hover:shadow-sm hover:border-orange/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-charcoal/20 text-xs group-hover:text-orange transition-colors">→</span>
            </div>
            <p className={`text-3xl font-black mb-1 ${card.colorClass}`}>{card.value}</p>
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">{card.label}</p>
          </Link>
        ))}
      </div>

      <MarketPulse />

      {/* Trafik fra Log Drain */}
      <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40">🌐 Webtrafik</p>
          {traffic === null && <span className="text-xs text-charcoal/30 animate-pulse">Henter...</span>}
        </div>
        {traffic !== null && traffic.month === 0 ? (
          <p className="text-xs text-charcoal/35 italic">
            Ingen data endnu — Log Drain er endnu ikke opsat eller har ikke modtaget events.
          </p>
        ) : traffic !== null ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs text-charcoal/40 mb-1">Sidevisninger</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-xl font-black text-charcoal">{traffic.today.toLocaleString("da-DK")}</p>
                  <p className="text-[10px] text-charcoal/35 uppercase tracking-wider font-bold">i dag</p>
                </div>
                <div>
                  <p className="text-xl font-black text-charcoal">{traffic.week.toLocaleString("da-DK")}</p>
                  <p className="text-[10px] text-charcoal/35 uppercase tracking-wider font-bold">7 dage</p>
                </div>
                <div>
                  <p className="text-xl font-black text-charcoal">{traffic.month.toLocaleString("da-DK")}</p>
                  <p className="text-[10px] text-charcoal/35 uppercase tracking-wider font-bold">30 dage</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-charcoal/40 mb-1">Unikke besøgende</p>
              <p className="text-xl font-black text-charcoal">{traffic.uniqueMonth.toLocaleString("da-DK")}</p>
              <p className="text-[10px] text-charcoal/35 uppercase tracking-wider font-bold">30 dage</p>
            </div>
            {traffic.topPages.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs text-charcoal/40 mb-2">Top sider (30 dage)</p>
                <div className="space-y-1.5">
                  {traffic.topPages.map(({ path, count }) => {
                    const pct = Math.round((count / traffic.topPages[0].count) * 100);
                    return (
                      <div key={path} className="flex items-center gap-2">
                        <span className="text-[11px] text-charcoal/60 font-mono w-32 truncate shrink-0">{path}</span>
                        <div className="flex-1 bg-charcoal/6 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-orange rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-charcoal/40 w-8 text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-charcoal/8 rounded" />)}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-charcoal">Seneste forespørgsler</h2>
            <Link href="/admin/afventer" className="text-orange text-xs font-bold hover:underline">Se alle →</Link>
          </div>
          <div className="space-y-2">
            {recentRequests.length === 0 && (
              <div className="bg-white rounded-xl border border-[#ede9e3] p-6 text-center">
                <p className="text-charcoal/40 text-sm">Ingen forespørgsler endnu</p>
              </div>
            )}
            {recentRequests.map(r => {
              const s = statusLabel(r);
              return (
                <div key={r.id} className="bg-white rounded-xl border border-[#ede9e3] p-4 hover:border-orange/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-charcoal truncate">{r.email}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.cls}`}>{s.label}</span>
                  </div>
                  <p className="text-xs text-charcoal/60 line-clamp-1 mb-1">{r.description || "Ingen beskrivelse"}</p>
                  <p className="text-[10px] text-charcoal/30">{new Date(r.created_at).toLocaleDateString("da-DK")}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent submissions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-charcoal">Seneste konsulentprofiler</h2>
            <Link href="/admin/konsulenter" className="text-orange text-xs font-bold hover:underline">Se alle →</Link>
          </div>
          <div className="space-y-2">
            {recentSubmissions.length === 0 && (
              <div className="bg-white rounded-xl border border-[#ede9e3] p-6 text-center">
                <p className="text-charcoal/40 text-sm">Ingen profiler endnu</p>
              </div>
            )}
            {recentSubmissions.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-[#ede9e3] p-4 hover:border-orange/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-charcoal">{s.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    s.status === "Indsendt" ? "bg-blue-100 text-blue-700" :
                    s.status === "Godkendt" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>{s.status}</span>
                </div>
                <p className="text-xs text-charcoal/60">{s.title}{s.rate ? ` · ${s.rate} DKK/t` : ""}</p>
                {s.requests && (
                  <p className="text-[10px] text-charcoal/30 mt-1 line-clamp-1">📋 {s.requests.description?.slice(0, 55)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
