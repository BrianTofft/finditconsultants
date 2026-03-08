"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PulseData = {
  activeRequests: number;
  avgRate: number | null;
  topCompetency: string | null;
  avgDaysToMatch: number | null;
};

export default function MarketPulse() {
  const [data, setData] = useState<PulseData | null>(null);

  useEffect(() => {
    async function load() {
      // 1. Aktive forespørgsler
      const { count: activeRequests } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("admin_status", "accepted")
        .neq("status", "Afsluttet");

      // 2. Gns. timepris fra godkendte konsulentprofiler
      const { data: subs } = await supabase
        .from("consultant_submissions")
        .select("rate, created_at, request_id")
        .eq("status", "Godkendt");

      const rates = (subs ?? []).map(s => s.rate).filter(Boolean) as number[];
      const avgRate =
        rates.length > 0
          ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
          : null;

      // 3. Mest efterspurgte kompetence (seneste 30 godkendte forespørgsler)
      const { data: reqs } = await supabase
        .from("requests")
        .select("competencies")
        .eq("admin_status", "accepted")
        .order("created_at", { ascending: false })
        .limit(30);

      const compCounts: Record<string, number> = {};
      for (const r of reqs ?? []) {
        for (const c of r.competencies ?? []) {
          compCounts[c] = (compCounts[c] ?? 0) + 1;
        }
      }
      const topCompetency =
        Object.entries(compCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      // 4. Gns. dage fra forespørgsel til første konsulentprofil
      const { data: allSubs } = await supabase
        .from("consultant_submissions")
        .select("request_id, created_at");

      const firstSubByRequest: Record<string, string> = {};
      for (const s of allSubs ?? []) {
        if (
          !firstSubByRequest[s.request_id] ||
          s.created_at < firstSubByRequest[s.request_id]
        ) {
          firstSubByRequest[s.request_id] = s.created_at;
        }
      }

      const reqIds = Object.keys(firstSubByRequest);
      let avgDaysToMatch: number | null = null;

      if (reqIds.length > 0) {
        const { data: matchedReqs } = await supabase
          .from("requests")
          .select("id, created_at")
          .in("id", reqIds.slice(0, 100));

        const diffs: number[] = [];
        for (const r of matchedReqs ?? []) {
          const firstSub = firstSubByRequest[r.id];
          if (firstSub) {
            const diffDays =
              (new Date(firstSub).getTime() - new Date(r.created_at).getTime()) /
              (1000 * 60 * 60 * 24);
            if (diffDays >= 0 && diffDays < 365) diffs.push(diffDays);
          }
        }
        if (diffs.length > 0) {
          avgDaysToMatch =
            Math.round(
              (diffs.reduce((a, b) => a + b, 0) / diffs.length) * 10
            ) / 10;
        }
      }

      setData({
        activeRequests: activeRequests ?? 0,
        avgRate,
        topCompetency,
        avgDaysToMatch,
      });
    }

    load();
  }, []);

  const month = new Intl.DateTimeFormat("da-DK", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Skeleton mens data hentes
  if (!data) {
    return (
      <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-4 mb-6 animate-pulse">
        <div className="h-3 bg-charcoal/10 rounded w-32 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-2.5 bg-charcoal/10 rounded mb-2 w-20" />
              <div className="h-5 bg-charcoal/10 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = [
    {
      label: "Aktive forespørgsler",
      value: data.activeRequests.toString(),
      icon: "📋",
    },
    {
      label: "Gns. timepris",
      value: data.avgRate
        ? `DKK ${data.avgRate.toLocaleString("da-DK")}`
        : "–",
      icon: "💰",
    },
    {
      label: "Mest efterspurgt",
      value: data.topCompetency ?? "–",
      icon: "🔥",
    },
    {
      label: "Gns. tid til match",
      value:
        data.avgDaysToMatch != null ? `${data.avgDaysToMatch} dage` : "–",
      icon: "⚡",
    },
  ];

  return (
    <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
          📊 Markedspuls
        </span>
        <span className="text-xs text-charcoal/30 capitalize">{month}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.label}>
            <div className="text-xs text-charcoal/40 mb-0.5">{item.label}</div>
            <div className="text-sm font-bold text-charcoal">
              {item.icon} {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
