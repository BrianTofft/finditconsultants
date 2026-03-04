"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";

type Submission = {
  id: string;
  name: string;
  title: string;
  experience_years: number;
  rate: number;
  skills: string[];
  bio: string;
  availability: string;
  cv_url: string | null;
  customer_decision: string | null;
  interview_datetime: string | null;
  interview_confirmed: boolean;
  interview_proposed_by: string | null;
  ai_rating: number | null;
  ai_summary: string | null;
};

type Request = {
  id: string;
  created_at: string;
  description: string;
  competencies: string[];
  status: string;
  email: string;
  reference_number?: string | null;
  submissions?: Submission[];
};

type Profile = {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
};

type TeamMember = {
  id: string;
  email: string;
  contact_name: string;
  phone: string;
};

type Tab = "requests" | "profile" | "messages";

/* ─── Sidebar ────────────────────────────────────────────────── */
type PortalSidebarProps = {
  tab: Tab;
  setTab: (t: Tab) => void;
  companyLabel: string;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
};

function PortalSidebar({ tab, setTab, companyLabel, onLogout, open, onClose }: PortalSidebarProps) {
  const navItems: { tab: Tab; label: string; icon: string }[] = [
    { tab: "requests", label: "Forespørgsler", icon: "📋" },
    { tab: "messages", label: "Beskeder",      icon: "💬" },
    { tab: "profile",  label: "Min profil",    icon: "⚙️" },
  ];

  const handleTab = (t: Tab) => {
    setTab(t);
    onClose();
  };

  return (
    <aside className={`
      w-64 md:w-56 bg-white border-r border-[#ede9e3] flex flex-col fixed h-full z-50
      transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#ede9e3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">FI</span>
          </div>
          <div>
            <p className="text-charcoal font-bold text-sm leading-tight">FindITconsultants</p>
            <p className="text-charcoal/40 text-[10px] font-semibold tracking-wide uppercase">Kundeportal</p>
          </div>
        </div>
        {companyLabel && (
          <p className="text-charcoal/40 text-[11px] font-semibold mt-2 truncate">{companyLabel}</p>
        )}
      </div>
      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.tab}
            onClick={() => handleTab(item.tab)}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all mb-0.5 text-left ${
              tab === item.tab
                ? "bg-orange text-white shadow-sm"
                : "text-charcoal/55 hover:text-charcoal hover:bg-orange/8"
            }`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      {/* Logout */}
      <div className="px-4 py-4 border-t border-[#ede9e3]">
        <button
          onClick={onLogout}
          className="w-full text-left text-charcoal/35 hover:text-charcoal/70 text-xs font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-charcoal/5"
        >
          Log ud →
        </button>
      </div>
    </aside>
  );
}

/* ─── Skift password ─────────────────────────────────────────── */
function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async () => {
    if (password !== confirm) { setError("Passwords matcher ikke"); return; }
    if (password.length < 6) { setError("Mindst 6 tegn"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setSaving(false); return; }
    setSaved(true);
    setPassword(""); setConfirm(""); setError("");
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";

  return (
    <div className="space-y-2">
      <input type="password" className={inp} placeholder="Nyt password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
      <input type="password" className={inp} placeholder="Bekræft password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }} />
      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
      <button onClick={handleChange} disabled={saving || !password || !confirm}
        className="w-full bg-charcoal text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-charcoal/80 transition-all disabled:opacity-40">
        {saved ? "Gemt ✓" : saving ? "Gemmer…" : "Skift password"}
      </button>
    </div>
  );
}

/* ─── Konsulent-kort ─────────────────────────────────────────── */
function ConsultantCard({
  s,
  interviewDate,
  onDateChange,
  onDecision,
  deciding,
  counterDate,
  onCounterDateChange,
  onCustomerResponse,
}: {
  s: Submission;
  interviewDate: string;
  onDateChange: (val: string) => void;
  onDecision: (decision: "interview" | "afvist") => void;
  deciding: boolean;
  counterDate: string;
  onCounterDateChange: (val: string) => void;
  onCustomerResponse: (action: "accept" | "counter", newDate?: string) => void;
}) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const fmtDate = (iso: string | null) => iso
    ? new Date(iso).toLocaleString("da-DK", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden hover:shadow-md hover:border-orange/20 transition-all">

      {/* Header */}
      <div className="p-4 border-b border-[#f5f2ee]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-charcoal truncate">{s.name}</p>
            <p className="text-xs text-charcoal/50 truncate">{s.title}</p>
          </div>
          {s.cv_url && (
            <a href={s.cv_url} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 text-[11px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors">
              📄 CV
            </a>
          )}
        </div>
        {s.ai_rating && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-0.5">
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <span key={i} className={`text-sm ${i <= s.ai_rating! ? "text-orange" : "text-charcoal/12"}`}>★</span>
              ))}
            </div>
            <span className="text-[10px] font-extrabold text-orange/70 tracking-wide">{s.ai_rating}/10</span>
            <span className="text-[10px] font-bold text-charcoal/30 tracking-widest uppercase">FindIT</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {s.rate && <span className="font-extrabold text-orange">{s.rate.toLocaleString("da-DK")} DKK/t</span>}
          {s.experience_years && <span className="text-charcoal/40">{s.experience_years} års erfaring</span>}
          {s.availability && <span className="text-charcoal/40 ml-auto">📅 {new Date(s.availability).toLocaleDateString("da-DK")}</span>}
        </div>

        {s.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {s.skills.map(skill => (
              <span key={skill} className="bg-orange/10 text-orange text-[11px] font-bold px-2 py-0.5 rounded-full">{skill}</span>
            ))}
          </div>
        )}

        {s.bio && (
          <div>
            <p className={`text-xs text-charcoal/60 leading-relaxed ${showFullBio ? "" : "line-clamp-3"}`}>{s.bio}</p>
            {s.bio.length > 160 && (
              <button onClick={() => setShowFullBio(v => !v)} className="text-[10px] font-bold text-orange/70 hover:text-orange mt-0.5 transition-colors">
                {showFullBio ? "Vis mindre ↑" : "Læs mere →"}
              </button>
            )}
          </div>
        )}

        {s.ai_summary && (
          <div className="bg-orange/5 border border-orange/15 rounded-xl p-3">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-orange/60 mb-1.5">FindIT vurdering</p>
            <p className={`text-xs text-charcoal/60 leading-relaxed ${showFullSummary ? "" : "line-clamp-3"}`}>{s.ai_summary}</p>
            {s.ai_summary.length > 180 && (
              <button onClick={() => setShowFullSummary(v => !v)} className="text-[10px] font-bold text-orange/70 hover:text-orange mt-0.5 transition-colors">
                {showFullSummary ? "Vis mindre ↑" : "Læs mere →"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer — interview state machine */}
      <div className="p-4 border-t border-[#f5f2ee]">

        {/* State 0: Afvist */}
        {s.customer_decision === "afvist" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200">
            ✗ Afvist
          </div>
        )}

        {/* State 1: Ingen beslutning endnu */}
        {!s.customer_decision && (
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-1">
              Foreslå interviewtidspunkt
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-orange transition-all"
              value={interviewDate}
              onChange={e => onDateChange(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => onDecision("interview")}
                disabled={deciding || !interviewDate}
                className="flex-1 bg-green-500 text-white font-bold rounded-full py-2.5 text-xs hover:bg-green-600 transition-all disabled:opacity-40">
                {deciding ? "Sender…" : "Interview →"}
              </button>
              <button
                onClick={() => onDecision("afvist")}
                disabled={deciding}
                className="flex-shrink-0 bg-red-100 text-red-600 font-bold rounded-full px-4 py-2.5 text-xs hover:bg-red-200 transition-all disabled:opacity-50">
                Afvis
              </button>
            </div>
          </div>
        )}

        {/* State 2: Kunde har foreslået — afventer leverandør */}
        {s.customer_decision === "interview" && s.interview_proposed_by === "customer" && !s.interview_confirmed && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1">
              ⏳ Foreslået — afventer leverandør
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-blue-700 font-semibold">
                {fmtDate(s.interview_datetime)}
              </p>
            )}
          </div>
        )}

        {/* State 3: Leverandør foreslår nyt tidspunkt — kunde skal svare */}
        {s.customer_decision === "interview" && s.interview_proposed_by === "supplier" && !s.interview_confirmed && (
          <div className="bg-orange/5 border border-orange/20 rounded-xl p-3 space-y-2">
            <p className="text-xs font-extrabold tracking-widest uppercase text-orange mb-0.5">
              📅 Leverandør foreslår nyt tidspunkt
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-charcoal font-bold">
                {fmtDate(s.interview_datetime)}
              </p>
            )}
            <button
              onClick={() => onCustomerResponse("accept")}
              disabled={deciding}
              className="w-full bg-green-500 text-white font-bold rounded-full py-2.5 text-xs hover:bg-green-600 transition-all disabled:opacity-50">
              {deciding ? "Bekræfter…" : "✓ Acceptér tidspunkt"}
            </button>
            <div className="pt-1">
              <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">
                Foreslå andet tidspunkt
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#e8e5e0] bg-white px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-orange transition-all"
                value={counterDate}
                onChange={e => onCounterDateChange(e.target.value)}
              />
              <button
                onClick={() => onCustomerResponse("counter", counterDate)}
                disabled={deciding || !counterDate}
                className="w-full mt-1.5 bg-charcoal text-white font-bold rounded-full py-2.5 text-xs hover:bg-charcoal/80 transition-all disabled:opacity-40">
                Foreslå nyt tidspunkt →
              </button>
            </div>
          </div>
        )}

        {/* State 4: Bekræftet */}
        {s.interview_confirmed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">
              ✅ Interview bekræftet
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-green-700 font-bold">
                {fmtDate(s.interview_datetime)}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Hoved-komponent ────────────────────────────────────────── */
export default function PortalPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("requests");
  const [userId, setUserId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ company_name: "", contact_name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interviewDates, setInterviewDates] = useState<Record<string, string>>({});
  const [counterDateMap, setCounterDateMap] = useState<Record<string, string>>({});
  const [deciding, setDeciding] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamRequests, setTeamRequests] = useState<Request[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/portal/login"); return; }
      setUserId(user.id);

      const { data: customerData } = await supabase
        .from("customers").select("*").eq("id", user.id).single();

      if (customerData) {
        setProfile({
          company_name: customerData.company_name ?? "",
          contact_name: customerData.contact_name ?? "",
          phone: customerData.phone ?? "",
          email: customerData.email ?? user.email ?? "",
        });

        if (customerData.company_name) {
          const { data: teamData } = await supabase
            .from("customers")
            .select("id, email, contact_name, phone")
            .eq("company_name", customerData.company_name)
            .neq("id", user.id);

          if (teamData && teamData.length > 0) {
            setTeamMembers(teamData);
            const { data: teamReqAll } = await supabase
              .from("requests").select("*")
              .in("email", teamData.map((m: TeamMember) => m.email))
              .order("created_at", { ascending: false });
            const { data: teamSubData } = await supabase
              .from("consultant_submissions").select("*")
              .eq("status", "Valgt")
              .in("request_id", (teamReqAll ?? []).map(r => r.id));
            setTeamRequests((teamReqAll ?? []).map(r => ({
              ...r,
              submissions: (teamSubData ?? []).filter(s => s.request_id === r.id),
            })));
          }
        }
      } else {
        setProfile(p => ({ ...p, email: user.email ?? "" }));
      }

      const { data: reqDataAll } = await supabase
        .from("requests").select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      const { data: subData } = await supabase
        .from("consultant_submissions").select("*")
        .eq("status", "Valgt")
        .in("request_id", (reqDataAll ?? []).map(r => r.id));

      setRequests((reqDataAll ?? []).map(r => ({
        ...r,
        submissions: (subData ?? []).filter(s => s.request_id === r.id),
      })));
      setLoading(false);

      if (!customerData?.company_name) setTab("profile");
    };
    init();
  }, [router]);

  const handleDecision = async (submissionId: string, decision: "interview" | "afvist") => {
    setDeciding(submissionId);
    const isoDate = decision === "interview" && interviewDates[submissionId]
      ? new Date(interviewDates[submissionId]).toISOString()
      : null;
    const updates: Record<string, unknown> = { customer_decision: decision };
    if (decision === "interview") {
      updates.interview_proposed_by = "customer";
      if (isoDate) updates.interview_datetime = isoDate;
    }
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);
    await fetch("/api/notify-admin-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision, submission_id: submissionId,
        interview_datetime: isoDate,
        customer_name: profile.company_name || profile.email,
      }),
    });
    setRequests(prev => prev.map(r => ({
      ...r,
      submissions: r.submissions?.map(s =>
        s.id === submissionId
          ? { ...s, customer_decision: decision, interview_datetime: isoDate, interview_proposed_by: decision === "interview" ? "customer" : null }
          : s
      ),
    })));
    setDeciding(null);
  };

  const handleCustomerResponse = async (submissionId: string, action: "accept" | "counter", newDate?: string) => {
    setDeciding(submissionId);
    const isoDate = newDate ? new Date(newDate).toISOString() : null;
    const updates: Record<string, unknown> = {};
    if (action === "accept") {
      updates.interview_confirmed = true;
    } else {
      updates.interview_proposed_by = "customer";
      updates.interview_confirmed = false;
      if (isoDate) updates.interview_datetime = isoDate;
    }
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);

    // Notify supplier + admin
    const submission = requests.flatMap(r => r.submissions ?? []).find(s => s.id === submissionId);
    await fetch("/api/notify-customer-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_id: submissionId,
        action: action === "accept" ? "accepted" : "counter",
        new_datetime: isoDate ?? submission?.interview_datetime ?? null,
      }),
    });

    setRequests(prev => prev.map(r => ({
      ...r,
      submissions: r.submissions?.map(s =>
        s.id === submissionId
          ? {
              ...s,
              interview_confirmed: action === "accept" ? true : false,
              interview_proposed_by: action === "accept" ? s.interview_proposed_by : "customer",
              interview_datetime: isoDate ?? s.interview_datetime,
            }
          : s
      ),
    })));
    setDeciding(null);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await supabase.from("customers").upsert({
      id: userId, email: profile.email,
      company_name: profile.company_name,
      contact_name: profile.contact_name,
      phone: profile.phone,
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    supabase.auth.signOut().then(() => { window.location.href = "https://finditconsultants.com"; });
  };

  const statusColor: Record<string, string> = {
    "Ny": "bg-blue-100 text-blue-700",
    "I gang": "bg-orange/15 text-orange",
    "Afsluttet": "bg-green-100 text-green-700",
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  const tabLabels: Record<Tab, string> = {
    requests: selectedRequestId ? "← Kandidater" : "Forespørgsler",
    messages: "Beskeder",
    profile: "Min profil",
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <p className="text-charcoal/50 font-semibold">Henter data…</p>
    </div>
  );

  const selectedRequest = selectedRequestId ? requests.find(r => r.id === selectedRequestId) : null;

  return (
    <div className="flex h-screen bg-[#f8f6f3] overflow-hidden">

      {/* ── Mobil backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <PortalSidebar
        tab={tab}
        setTab={t => { setTab(t); setSelectedRequestId(null); }}
        companyLabel={profile.company_name || profile.email}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Mobil topbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#ede9e3] z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-charcoal/8 transition-colors flex-shrink-0"
          aria-label="Menu"
        >
          <span className="text-charcoal font-bold text-lg leading-none">{sidebarOpen ? "✕" : "☰"}</span>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-orange rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">FI</span>
          </div>
          <span className="font-bold text-sm text-charcoal">FindIT</span>
        </div>
        <span className="text-xs text-charcoal/45 font-semibold ml-auto truncate max-w-[140px]">
          {tabLabels[tab]}
        </span>
        {tab === "requests" && selectedRequestId && (
          <button
            onClick={() => setSelectedRequestId(null)}
            className="text-xs font-bold text-orange ml-1 flex-shrink-0"
          >
            ← Tilbage
          </button>
        )}
      </div>

      {/* ── Hovedindhold ── */}
      <main className="flex-1 md:ml-56 overflow-y-auto pt-14 md:pt-0 p-4 md:p-8">

        {/* ══ TAB: FORESPØRGSLER — LISTE ══ */}
        {tab === "requests" && !selectedRequest && (
          <>
            {requests.length > 0 && (() => {
              const allSubs = requests.flatMap(r => r.submissions ?? []);
              const stats = [
                { label: "Forespørgsler", value: requests.length, icon: "📋" },
                { label: "Kandidater", value: allSubs.length, icon: "👤" },
                { label: "Interviews", value: allSubs.filter(s => s.customer_decision === "interview").length, icon: "🗓️" },
                { label: "Igangværende", value: requests.filter(r => r.status === "I gang").length, icon: "⚡" },
              ];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-[#ede9e3] p-4 text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="font-bold text-2xl text-charcoal">{s.value}</div>
                      <div className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <h2 className="font-bold text-lg text-charcoal mb-4">Dine forespørgsler</h2>

            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-charcoal/50 text-sm font-semibold">Du har ingen forespørgsler endnu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(r => {
                  const candidateCount = r.submissions?.length ?? 0;
                  const interviewCount = r.submissions?.filter(s => s.customer_decision === "interview").length ?? 0;
                  return (
                    <div key={r.id} onClick={() => setSelectedRequestId(r.id)}
                      className="bg-white rounded-2xl border border-[#ede9e3] p-5 cursor-pointer hover:border-orange/30 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {r.reference_number && (
                              <span className="text-xs font-black text-orange bg-orange/10 px-2.5 py-0.5 rounded-full tracking-wide">{r.reference_number}</span>
                            )}
                            <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>{r.status}</span>
                            {candidateCount > 0 && (
                              <span className="text-xs font-bold bg-orange text-white px-2.5 py-0.5 rounded-full">
                                {candidateCount} kandidat{candidateCount !== 1 ? "er" : ""}
                              </span>
                            )}
                            {interviewCount > 0 && (
                              <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
                                {interviewCount} interview{interviewCount !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-charcoal font-semibold line-clamp-2 mb-2">{r.description || "Ingen beskrivelse"}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {r.competencies?.map(c => (
                              <span key={c} className="bg-charcoal/8 text-charcoal/55 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <p className="text-charcoal/30 text-xs">{new Date(r.created_at).toLocaleDateString("da-DK")}</p>
                          <span className="text-orange text-xs font-bold group-hover:translate-x-0.5 transition-transform">Se kandidater →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {teamRequests.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-lg text-charcoal">Fra {profile.company_name}</h2>
                  <span className="text-xs bg-charcoal/10 text-charcoal/50 font-bold px-2 py-0.5 rounded-full">{teamRequests.length} kollegaer</span>
                </div>
                <div className="space-y-3">
                  {teamRequests.map(r => {
                    const owner = teamMembers.find(m => m.email === r.email);
                    return (
                      <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] p-4 opacity-80">
                        <p className="text-sm text-charcoal font-semibold line-clamp-2 mb-2">{r.description || "Ingen beskrivelse"}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {r.competencies?.map(c => (
                            <span key={c} className="bg-charcoal/8 text-charcoal/55 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                        <p className="text-charcoal/35 text-xs">👤 {owner?.contact_name || owner?.email || "Kollega"} · {new Date(r.created_at).toLocaleDateString("da-DK")}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ TAB: FORESPØRGSLER — DETALJESIDE ══ */}
        {tab === "requests" && selectedRequest && (
          <div>
            {/* Tilbage (desktop) */}
            <button onClick={() => setSelectedRequestId(null)}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-charcoal/45 hover:text-charcoal transition-colors mb-6 group">
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Tilbage til forespørgsler
            </button>

            {/* Forespørgselshoved */}
            <div className="bg-white rounded-2xl border border-[#ede9e3] p-5 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {selectedRequest.reference_number && (
                      <span className="text-xs font-black text-orange bg-orange/10 px-2.5 py-0.5 rounded-full tracking-wide">{selectedRequest.reference_number}</span>
                    )}
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${statusColor[selectedRequest.status] ?? "bg-gray-100 text-gray-600"}`}>{selectedRequest.status}</span>
                  </div>
                  <p className="text-sm text-charcoal font-semibold mb-3">{selectedRequest.description || "Ingen beskrivelse"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.competencies?.map(c => (
                      <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
                <p className="text-charcoal/30 text-xs shrink-0">{new Date(selectedRequest.created_at).toLocaleDateString("da-DK")}</p>
              </div>

              {(selectedRequest.submissions?.length ?? 0) > 0 && (() => {
                const subs = selectedRequest.submissions ?? [];
                const interviewCount = subs.filter(s => s.customer_decision === "interview").length;
                const afvistCount = subs.filter(s => s.customer_decision === "afvist").length;
                const afventerCount = subs.filter(s => !s.customer_decision).length;
                return (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-[#f0ede8] flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/50">
                      <span className="w-5 h-5 bg-orange text-white rounded-full flex items-center justify-center text-[10px] font-black">{subs.length}</span>
                      kandidater
                    </div>
                    {afventerCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/40"><span className="w-2 h-2 rounded-full bg-charcoal/20" />{afventerCount} afventer</div>}
                    {interviewCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-green-600"><span className="w-2 h-2 rounded-full bg-green-400" />{interviewCount} til interview</div>}
                    {afvistCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-red-400"><span className="w-2 h-2 rounded-full bg-red-300" />{afvistCount} afvist</div>}
                  </div>
                );
              })()}
            </div>

            <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
              Kandidater
              <span className="text-xs bg-orange text-white font-bold px-2.5 py-1 rounded-full">{selectedRequest.submissions?.length ?? 0}</span>
            </h3>

            {(selectedRequest.submissions?.length ?? 0) === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 text-center">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-charcoal/50 text-sm font-semibold">Ingen godkendte kandidater endnu</p>
                <p className="text-charcoal/35 text-xs mt-1">Vi arbejder på at finde de bedste profiler til dig.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedRequest.submissions?.map(s => (
                  <ConsultantCard
                    key={s.id}
                    s={s}
                    interviewDate={interviewDates[s.id] ?? ""}
                    onDateChange={val => setInterviewDates(prev => ({ ...prev, [s.id]: val }))}
                    onDecision={decision => handleDecision(s.id, decision)}
                    deciding={deciding === s.id}
                    counterDate={counterDateMap[s.id] ?? ""}
                    onCounterDateChange={val => setCounterDateMap(prev => ({ ...prev, [s.id]: val }))}
                    onCustomerResponse={(action, newDate) => handleCustomerResponse(s.id, action, newDate)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: BESKEDER ══ */}
        {tab === "messages" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Beskeder</h2>
            <ChatWindow userId={userId} userType="customer"
              userName={profile.contact_name || profile.company_name || profile.email} />
          </div>
        )}

        {/* ══ TAB: MIN PROFIL ══ */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl border border-[#ede9e3] p-6 max-w-lg">
            <h2 className="font-bold text-lg text-charcoal mb-5">Min profil</h2>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Virksomhed</label>
                <input className={inp} placeholder="Firma A/S" value={profile.company_name} onChange={e => setProfile(p => ({ ...p, company_name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Fornavn</label>
                  <input className={inp} placeholder="Fornavn" value={(profile.contact_name ?? "").split(" ")[0] ?? ""} onChange={e => {
                    const parts = (profile.contact_name ?? "").split(" "); parts[0] = e.target.value;
                    setProfile(p => ({ ...p, contact_name: parts.join(" ").trim() }));
                  }} />
                </div>
                <div>
                  <label className={lbl}>Efternavn</label>
                  <input className={inp} placeholder="Efternavn" value={(profile.contact_name ?? "").split(" ").slice(1).join(" ")} onChange={e => {
                    const first = (profile.contact_name ?? "").split(" ")[0] ?? "";
                    setProfile(p => ({ ...p, contact_name: `${first} ${e.target.value}`.trim() }));
                  }} />
                </div>
              </div>
              <div>
                <label className={lbl}>Telefon</label>
                <input className={inp} placeholder="+45 12 34 56 78" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Email <span className="normal-case font-normal text-charcoal/30">(kan ikke ændres)</span></label>
                <input className={inp} disabled value={profile.email} />
              </div>
              <div>
                <label className={lbl}>Type</label>
                <div className="w-full rounded-xl border border-[#e8e5e0] bg-[#f0ede8] px-4 py-2.5 text-sm text-charcoal/60">Kunde</div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full bg-orange text-white font-bold rounded-full px-8 py-3 text-sm hover:bg-orange-dark transition-all disabled:opacity-50">
                {saved ? "Gemt ✓" : saving ? "Gemmer…" : "Gem profil"}
              </button>
              {teamMembers.length > 0 && (
                <div className="border-t border-[#f0ede8] pt-4 mt-2">
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">👥 Kollegaer fra {profile.company_name}</p>
                  <div className="space-y-2">
                    {teamMembers.map(m => (
                      <div key={m.id} className="flex items-center justify-between bg-[#f8f6f3] rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{m.contact_name || m.email}</p>
                          <p className="text-xs text-charcoal/45">{m.email}</p>
                        </div>
                        {m.phone && <p className="text-xs text-charcoal/45">{m.phone}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-[#f0ede8] pt-4 mt-2">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">Skift password</p>
                <ChangePassword />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
