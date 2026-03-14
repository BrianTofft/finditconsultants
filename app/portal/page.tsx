"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import MarketPulse from "@/components/MarketPulse";

type Submission = {
  id: string;
  request_id: string;
  created_at: string;
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
  interview_location: string | null;
  interview_address: string | null;
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
  start_date?: string | null;
  duration?: string | null;
  work_mode?: string | null;
  scope?: string | null;
  language?: string | null;
  nearshore?: string | null;
  max_rate?: number | null;
  file_url?: string | null;
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

type Tab = "requests" | "profile" | "messages" | "leverance";

type ContractData = {
  id: string;
  request_id: string;
  consultant_name: string;
  consultant_email: string | null;
  consultant_phone: string | null;
  rate: number;
  start_date: string | null;
  end_date: string | null;
  score: number | null;
  score_comment: string | null;
  suppliers: { company_name: string; contact_name: string | null; email: string; phone: string | null } | null;
  requests: { description: string; reference_number?: string | null } | null;
};

type DeliveryHoursData = {
  contract_id: string; year: number; month: number; hours: number;
};

function generateMonths(startDate: string, endDate: string | null) {
  const months: { year: number; month: number }[] = [];
  const start = new Date(startDate); start.setDate(1);
  const end = endDate ? new Date(endDate) : new Date(); end.setDate(1);
  const cur = new Date(start);
  while (cur <= end) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() + 1 });
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

const MONTH_NAMES = ["Januar","Februar","Marts","April","Maj","Juni",
                     "Juli","August","September","Oktober","November","December"];

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
    { tab: "requests",  label: "Forespørgsler", icon: "📋" },
    { tab: "leverance", label: "Leverance",     icon: "📦" },
    { tab: "messages",  label: "Beskeder",      icon: "💬" },
    { tab: "profile",   label: "Min profil",    icon: "⚙️" },
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
function LocationPicker({
  location,
  address,
  onLocationChange,
  onAddressChange,
  bgClass = "bg-[#f8f6f3]",
}: {
  location: string;
  address: string;
  onLocationChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  bgClass?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">Sted</label>
      <div className="flex gap-2 mb-1.5">
        <button
          type="button"
          onClick={() => onLocationChange("online")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
            location === "online"
              ? "bg-orange text-white border-orange"
              : "bg-white text-charcoal/60 border-[#e8e5e0] hover:border-orange/50"
          }`}
        >
          💻 Online
        </button>
        <button
          type="button"
          onClick={() => onLocationChange("physical")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
            location === "physical"
              ? "bg-orange text-white border-orange"
              : "bg-white text-charcoal/60 border-[#e8e5e0] hover:border-orange/50"
          }`}
        >
          📍 Fysisk
        </button>
      </div>
      {location === "physical" && (
        <input
          type="text"
          placeholder="Adresse (f.eks. Østergade 12, 2100 København)"
          className={`w-full rounded-xl border border-[#e8e5e0] ${bgClass} px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-orange transition-all`}
          value={address}
          onChange={e => onAddressChange(e.target.value)}
        />
      )}
    </div>
  );
}

function fmtLocation(loc: string | null, addr: string | null) {
  if (!loc) return null;
  return loc === "online" ? "💻 Online" : `📍 ${addr || "Fysisk møde"}`;
}

function ConsultantCard({
  s,
  interviewDate,
  onDateChange,
  interviewLocation,
  onLocationChange,
  interviewAddress,
  onAddressChange,
  onDecision,
  deciding,
  counterDate,
  onCounterDateChange,
  counterLocation,
  onCounterLocationChange,
  counterAddress,
  onCounterAddressChange,
  onCustomerResponse,
}: {
  s: Submission;
  interviewDate: string;
  onDateChange: (val: string) => void;
  interviewLocation: string;
  onLocationChange: (val: string) => void;
  interviewAddress: string;
  onAddressChange: (val: string) => void;
  onDecision: (decision: "interview" | "afvist") => void;
  deciding: boolean;
  counterDate: string;
  onCounterDateChange: (val: string) => void;
  counterLocation: string;
  onCounterLocationChange: (val: string) => void;
  counterAddress: string;
  onCounterAddressChange: (val: string) => void;
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
          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-1">
                Foreslå interviewtidspunkt
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-orange transition-all"
                value={interviewDate}
                onChange={e => onDateChange(e.target.value)}
              />
            </div>
            <LocationPicker
              location={interviewLocation}
              address={interviewAddress}
              onLocationChange={onLocationChange}
              onAddressChange={onAddressChange}
            />
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => onDecision("interview")}
                disabled={deciding || !interviewDate || !interviewLocation || (interviewLocation === "physical" && !interviewAddress)}
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
              <p className="text-xs text-blue-700 font-semibold">{fmtDate(s.interview_datetime)}</p>
            )}
            {fmtLocation(s.interview_location, s.interview_address) && (
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{fmtLocation(s.interview_location, s.interview_address)}</p>
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
              <p className="text-xs text-charcoal font-bold">{fmtDate(s.interview_datetime)}</p>
            )}
            {fmtLocation(s.interview_location, s.interview_address) && (
              <p className="text-xs text-charcoal/60 font-semibold">{fmtLocation(s.interview_location, s.interview_address)}</p>
            )}
            <button
              onClick={() => onCustomerResponse("accept")}
              disabled={deciding}
              className="w-full bg-green-500 text-white font-bold rounded-full py-2.5 text-xs hover:bg-green-600 transition-all disabled:opacity-50">
              {deciding ? "Bekræfter…" : "✓ Acceptér tidspunkt"}
            </button>
            <div className="pt-1 space-y-2">
              <div>
                <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">
                  Foreslå andet tidspunkt
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-[#e8e5e0] bg-white px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-orange transition-all"
                  value={counterDate}
                  onChange={e => onCounterDateChange(e.target.value)}
                />
              </div>
              <LocationPicker
                location={counterLocation}
                address={counterAddress}
                onLocationChange={onCounterLocationChange}
                onAddressChange={onCounterAddressChange}
                bgClass="bg-white"
              />
              <button
                onClick={() => onCustomerResponse("counter", counterDate)}
                disabled={deciding || !counterDate || !counterLocation || (counterLocation === "physical" && !counterAddress)}
                className="w-full bg-charcoal text-white font-bold rounded-full py-2.5 text-xs hover:bg-charcoal/80 transition-all disabled:opacity-40">
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
              <p className="text-xs text-green-700 font-bold">{fmtDate(s.interview_datetime)}</p>
            )}
            {fmtLocation(s.interview_location, s.interview_address) && (
              <p className="text-xs text-green-600 font-semibold mt-0.5">{fmtLocation(s.interview_location, s.interview_address)}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Status-tidslinje ───────────────────────────────────────── */
function RequestTimeline({ request, hasContract }: { request: Request; hasContract: boolean }) {
  const subs = request.submissions ?? [];
  const hasCandidates = subs.length > 0;
  const hasInterview = subs.some(s => s.customer_decision === "interview");
  const isDone = request.status === "Afsluttet" || hasContract;
  const isStarted = request.status === "I gang" || hasCandidates || hasInterview || isDone;

  const steps = [
    { label: "Modtaget",   done: true },
    { label: "Igangsat",   done: isStarted },
    { label: "Kandidater", done: hasCandidates || hasInterview || isDone },
    { label: "Interview",  done: hasInterview || isDone },
    { label: "Afsluttet",  done: isDone },
  ];

  let currentIdx = 0;
  steps.forEach((s, i) => { if (s.done) currentIdx = i; });

  return (
    <div className="mt-3 pt-3 border-t border-[#f5f2ee]">
      <div className="flex items-start">
        {steps.map((step, i) => (
          <div key={i} className={`flex items-start ${i < steps.length - 1 ? "flex-1" : "flex-shrink-0"}`}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                step.done ? "bg-orange" : "bg-charcoal/15"
              } ${i === currentIdx ? "ring-[3px] ring-orange/20" : ""}`} />
              <span className={`text-[9px] font-bold mt-1 whitespace-nowrap ${step.done ? "text-orange/70" : "text-charcoal/25"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mt-[5px] ${steps[i + 1].done ? "bg-orange/40" : "bg-charcoal/10"}`} />
            )}
          </div>
        ))}
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
  const [interviewLocations, setInterviewLocations] = useState<Record<string, string>>({});
  const [interviewAddresses, setInterviewAddresses] = useState<Record<string, string>>({});
  const [counterDateMap, setCounterDateMap] = useState<Record<string, string>>({});
  const [counterLocations, setCounterLocations] = useState<Record<string, string>>({});
  const [counterAddresses, setCounterAddresses] = useState<Record<string, string>>({});
  const [deciding, setDeciding] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamRequests, setTeamRequests] = useState<Request[]>([]);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [deliveryHours, setDeliveryHours] = useState<DeliveryHoursData[]>([]);
  const [msgThread, setMsgThread] = useState<string | null>(null); // null = Generel
  const [compareMode, setCompareMode] = useState(false);
  const [marketAvgRate, setMarketAvgRate] = useState<number | null>(null);
  const [supplierCompCounts, setSupplierCompCounts] = useState<Record<string, number>>({});
  const [allReqStats, setAllReqStats] = useState<{ competencies: string[]; status: string }[]>([]);

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

      const allReqs = reqDataAll ?? [];
      setRequests(allReqs.map(r => ({
        ...r,
        submissions: (subData ?? []).filter(s => s.request_id === r.id),
      })));

      // K1: Markedsgennemsnit for timepris
      const { data: mktRates } = await supabase
        .from("consultant_submissions").select("rate").eq("status", "Godkendt");
      const rateVals = (mktRates ?? []).map((s: { rate: number }) => s.rate).filter((r): r is number => r != null && r > 0);
      if (rateVals.length > 0) setMarketAvgRate(Math.round(rateVals.reduce((a, b) => a + b, 0) / rateVals.length));

      // K4: Leverandør-antal pr. kompetence
      const { data: suppData } = await supabase.from("suppliers").select("competencies");
      const compCounts: Record<string, number> = {};
      for (const s of suppData ?? []) for (const c of (s.competencies ?? [])) compCounts[c] = (compCounts[c] ?? 0) + 1;
      setSupplierCompCounts(compCounts);

      // K5: Alle accepterede forespørgsler til succesrate-beregning
      const { data: statsReqs } = await supabase
        .from("requests").select("competencies, status").eq("admin_status", "accepted");
      setAllReqStats(statsReqs ?? []);

      // Hent kontrakter + leverancetimer
      if (allReqs.length > 0) {
        const { data: contractData } = await supabase
          .from("contracts")
          .select("id, request_id, consultant_name, consultant_email, consultant_phone, rate, start_date, end_date, score, score_comment, suppliers(company_name, contact_name, email, phone), requests(description, reference_number)")
          .in("request_id", allReqs.map(r => r.id));
        const ctrs = contractData ?? [];
        setContracts(ctrs as unknown as ContractData[]);
        if (ctrs.length > 0) {
          const { data: hoursData } = await supabase
            .from("delivery_hours").select("*")
            .in("contract_id", ctrs.map(c => c.id));
          setDeliveryHours(hoursData ?? []);
        }
      }

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
    const loc = interviewLocations[submissionId] ?? null;
    const addr = loc === "physical" ? (interviewAddresses[submissionId] ?? null) : null;
    const updates: Record<string, unknown> = { customer_decision: decision };
    if (decision === "interview") {
      updates.interview_proposed_by = "customer";
      if (isoDate) updates.interview_datetime = isoDate;
      if (loc) updates.interview_location = loc;
      if (addr) updates.interview_address = addr;
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
          ? { ...s, customer_decision: decision, interview_datetime: isoDate, interview_proposed_by: decision === "interview" ? "customer" : null, interview_location: loc, interview_address: addr }
          : s
      ),
    })));
    setDeciding(null);
  };

  const handleCustomerResponse = async (submissionId: string, action: "accept" | "counter", newDate?: string) => {
    setDeciding(submissionId);
    const isoDate = newDate ? new Date(newDate).toISOString() : null;
    const loc = counterLocations[submissionId] ?? null;
    const addr = loc === "physical" ? (counterAddresses[submissionId] ?? null) : null;
    const updates: Record<string, unknown> = {};
    if (action === "accept") {
      updates.interview_confirmed = true;
    } else {
      updates.interview_proposed_by = "customer";
      updates.interview_confirmed = false;
      if (isoDate) updates.interview_datetime = isoDate;
      if (loc) updates.interview_location = loc;
      if (addr) updates.interview_address = addr;
    }
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);

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
              interview_location: action === "accept" ? s.interview_location : (loc ?? s.interview_location),
              interview_address: action === "accept" ? s.interview_address : (addr ?? s.interview_address),
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
    // Sync til HubSpot med opdaterede profiloplysninger (fire-and-forget)
    const nameParts = profile.contact_name?.split(" ") ?? [];
    fetch("/api/sync-hubspot-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        firstname: nameParts[0] ?? "",
        lastname: nameParts.slice(1).join(" ") ?? "",
        phone: profile.phone,
        company_name: profile.company_name,
        role: "customer",
      }),
    }).catch(() => {});
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
    leverance: "Leverance",
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
          <span className="font-bold text-sm text-charcoal">FindITconsultants.com</span>
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

        <MarketPulse />

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

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-charcoal">Dine forespørgsler</h2>
              <a
                href="https://finditconsultants.com/#hero-form"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-orange text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-orange/90 transition-colors shadow-sm"
              >
                + Ny opgave
              </a>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-charcoal/50 text-sm font-semibold mb-4">Du har ingen forespørgsler endnu.</p>
                <a
                  href="https://finditconsultants.com/#hero-form"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-orange text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-orange/90 transition-colors shadow-sm"
                >
                  + Indsend din første opgave
                </a>
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
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {r.competencies?.map(c => (
                              <span key={c} className="bg-charcoal/8 text-charcoal/55 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-charcoal/40 font-semibold">
                            {r.start_date && <span>📅 {r.start_date}</span>}
                            {r.duration && <span>⏱ {r.duration}</span>}
                            {r.work_mode && <span>📍 {r.work_mode}</span>}
                            {r.scope && <span>🕐 {r.scope}</span>}
                            {r.land && <span>🗺️ {r.land}</span>}
                            {r.language && <span>🌐 {r.language}</span>}
                            {r.nearshore && <span>🌍 Nearshore: {r.nearshore}</span>}
                            {r.max_rate && <span>💰 Maks. {r.max_rate} DKK/t</span>}
                            {/* K4: Kompetence-tilgængelighed */}
                            {(r.competencies?.length ?? 0) > 0 && Object.keys(supplierCompCounts).length > 0 && (() => {
                              const min = Math.min(...r.competencies.map(c => supplierCompCounts[c] ?? 0));
                              return <span className={min === 0 ? "text-orange" : "text-charcoal/35"}>🏢 {min === 0 ? "Begrænset leverandørdækning" : `${min}+ leverandør${min !== 1 ? "er" : ""} matcher`}</span>;
                            })()}
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <p className="text-charcoal/30 text-xs">{new Date(r.created_at).toLocaleDateString("da-DK")}</p>
                          <span className="text-orange text-xs font-bold group-hover:translate-x-0.5 transition-transform">Se kandidater →</span>
                        </div>
                      </div>
                      <RequestTimeline request={r} hasContract={contracts.some(c => c.request_id === r.id)} />
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
                        <div className="flex flex-wrap gap-3 text-xs text-charcoal/35 font-semibold mb-1.5">
                          {r.start_date && <span>📅 {r.start_date}</span>}
                          {r.duration && <span>⏱ {r.duration}</span>}
                          {r.work_mode && <span>📍 {r.work_mode}</span>}
                          {r.scope && <span>🕐 {r.scope}</span>}
                          {r.land && <span>🗺️ {r.land}</span>}
                          {r.language && <span>🌐 {r.language}</span>}
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
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedRequest.competencies?.map(c => (
                      <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-charcoal/45 font-semibold">
                    {selectedRequest.start_date && <span>📅 {selectedRequest.start_date}</span>}
                    {selectedRequest.duration && <span>⏱ {selectedRequest.duration}</span>}
                    {selectedRequest.work_mode && <span>📍 {selectedRequest.work_mode}</span>}
                    {selectedRequest.scope && <span>🕐 {selectedRequest.scope}</span>}
                    {selectedRequest.language && <span>🌐 {selectedRequest.language}</span>}
                    {selectedRequest.nearshore && <span>🌍 Nearshore: {selectedRequest.nearshore}</span>}
                    {selectedRequest.max_rate && <span>💰 Maks. {selectedRequest.max_rate} DKK/t</span>}
                    {selectedRequest.file_url && (
                      <a href={selectedRequest.file_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange hover:underline">
                        📎 Se vedhæftet fil
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-charcoal/30 text-xs shrink-0">{new Date(selectedRequest.created_at).toLocaleDateString("da-DK")}</p>
              </div>

              {(selectedRequest.submissions?.length ?? 0) > 0 && (() => {
                const subs = selectedRequest.submissions ?? [];
                const interviewCount = subs.filter(s => s.customer_decision === "interview").length;
                const afvistCount = subs.filter(s => s.customer_decision === "afvist").length;
                const afventerCount = subs.filter(s => !s.customer_decision).length;

                // K2: Hastighed-til-tilbud
                const firstSub = subs.slice().sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
                const diffH = Math.round((new Date(firstSub.created_at).getTime() - new Date(selectedRequest.created_at).getTime()) / (1000 * 60 * 60));
                const timeToFirst = diffH < 48 ? `${diffH} timer` : `${Math.round(diffH / 24)} dage`;

                // K1: Markedspris-benchmark
                const rates = subs.map(s => s.rate).filter((r): r is number => r != null && r > 0);
                const bestRate = rates.length > 0 ? Math.min(...rates) : null;
                const priceDelta = bestRate && marketAvgRate ? Math.round(((bestRate - marketAvgRate) / marketAvgRate) * 100) : null;

                return (
                  <div className="mt-4 pt-4 border-t border-[#f0ede8] space-y-2">
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/50">
                        <span className="w-5 h-5 bg-orange text-white rounded-full flex items-center justify-center text-[10px] font-black">{subs.length}</span>
                        kandidater
                      </div>
                      {afventerCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/40"><span className="w-2 h-2 rounded-full bg-charcoal/20" />{afventerCount} afventer</div>}
                      {interviewCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-green-600"><span className="w-2 h-2 rounded-full bg-green-400" />{interviewCount} til interview</div>}
                      {afvistCount > 0 && <div className="flex items-center gap-1.5 text-xs font-bold text-red-400"><span className="w-2 h-2 rounded-full bg-red-300" />{afvistCount} afvist</div>}
                    </div>
                    {/* K2 + K1 */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-charcoal/40">
                      <span>⚡ Første profil modtaget efter <strong className="text-charcoal/60">{timeToFirst}</strong></span>
                      {priceDelta != null && (
                        <span>
                          💰 Bedste timepris: <strong className="text-charcoal/60">{bestRate!.toLocaleString("da-DK")} DKK/t</strong>
                          {" "}
                          <span className={priceDelta <= 0 ? "text-green-600 font-bold" : "text-orange font-bold"}>
                            ({priceDelta > 0 ? "+" : ""}{priceDelta}% ift. markedet)
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* K5: Historisk succesrate */}
              {allReqStats.length >= 3 && (selectedRequest.competencies?.length ?? 0) > 0 && (() => {
                const similar = allReqStats.filter(r =>
                  (r.competencies ?? []).some(c => selectedRequest.competencies.includes(c))
                );
                if (similar.length < 2) return null;
                const besat = similar.filter(r => r.status === "Afsluttet").length;
                const pct = Math.round((besat / similar.length) * 100);
                return (
                  <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[#f8f6f3] rounded-lg">
                    <span className="text-base">📊</span>
                    <p className="text-xs text-charcoal/50">
                      <strong className="text-charcoal/70">{pct}% af lignende opgaver</strong> er blevet besat
                      <span className="text-charcoal/35"> ({besat} af {similar.length} med samme kompetencer)</span>
                    </p>
                  </div>
                );
              })()}
              <RequestTimeline request={selectedRequest} hasContract={contracts.some(c => c.request_id === selectedRequest.id)} />
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-charcoal flex items-center gap-2">
                Kandidater
                <span className="text-xs bg-orange text-white font-bold px-2.5 py-1 rounded-full">{selectedRequest.submissions?.length ?? 0}</span>
              </h3>
              {(selectedRequest.submissions?.length ?? 0) >= 2 && (
                <div className="flex rounded-lg overflow-hidden border border-[#ede9e3] text-xs font-bold">
                  <button
                    onClick={() => setCompareMode(false)}
                    className={`px-3 py-1.5 transition-colors ${!compareMode ? "bg-charcoal text-white" : "bg-white text-charcoal/50 hover:bg-[#f8f6f3]"}`}
                  >
                    ▦ Kort
                  </button>
                  <button
                    onClick={() => setCompareMode(true)}
                    className={`px-3 py-1.5 transition-colors ${compareMode ? "bg-charcoal text-white" : "bg-white text-charcoal/50 hover:bg-[#f8f6f3]"}`}
                  >
                    ⇔ Sammenlign
                  </button>
                </div>
              )}
            </div>

            {(selectedRequest.submissions?.length ?? 0) === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 text-center">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-charcoal/50 text-sm font-semibold">Ingen godkendte kandidater endnu</p>
                <p className="text-charcoal/35 text-xs mt-1">Vi arbejder på at finde de bedste profiler til dig.</p>
              </div>
            ) : compareMode ? (
              /* ── SAMMENLIGNINGS-TABEL ── */
              <div className="bg-white rounded-2xl border border-[#ede9e3] overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#ede9e3]">
                      <th className="text-left text-xs font-extrabold uppercase tracking-wider text-charcoal/35 px-4 py-3 w-32 bg-[#f8f6f3]">Felt</th>
                      {selectedRequest.submissions?.map(s => (
                        <th key={s.id} className="text-left px-4 py-3 min-w-[180px]">
                          <p className="font-bold text-charcoal text-sm leading-tight">{s.name}</p>
                          <p className="text-charcoal/40 text-xs font-normal">{s.title}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Timepris */}
                    <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">💰 Timepris</td>
                      {selectedRequest.submissions?.map(s => {
                        const best = Math.min(...(selectedRequest.submissions?.map(x => x.rate).filter(Boolean) as number[]));
                        const isBest = s.rate === best;
                        return (
                          <td key={s.id} className="px-4 py-3">
                            <span className={`font-bold ${isBest ? "text-green-600" : "text-charcoal"}`}>
                              {s.rate ? `${s.rate.toLocaleString("da-DK")} DKK/t` : "–"}
                              {isBest && <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-black">Lavest</span>}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                    {/* AI-score */}
                    <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">🤖 AI-score</td>
                      {selectedRequest.submissions?.map(s => {
                        const score = s.ai_rating;
                        const color = score == null ? "text-charcoal/30" : score >= 8 ? "text-green-600" : score >= 5 ? "text-orange" : "text-red-400";
                        return (
                          <td key={s.id} className="px-4 py-3">
                            {score != null ? (
                              <div>
                                <span className={`font-black text-base ${color}`}>{score}<span className="text-xs font-normal text-charcoal/30">/10</span></span>
                                {s.ai_summary && <p className="text-charcoal/40 text-xs mt-0.5 line-clamp-2">{s.ai_summary}</p>}
                              </div>
                            ) : <span className="text-charcoal/30 text-xs">Ikke vurderet</span>}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Tilgængelighed */}
                    <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">📅 Tilgængelighed</td>
                      {selectedRequest.submissions?.map(s => (
                        <td key={s.id} className="px-4 py-3 text-charcoal text-xs">{s.availability || "–"}</td>
                      ))}
                    </tr>
                    {/* Kompetencer */}
                    <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">🛠 Kompetencer</td>
                      {selectedRequest.submissions?.map(s => (
                        <td key={s.id} className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(s.skills ?? []).slice(0, 6).map(sk => (
                              <span key={sk} className="text-[10px] bg-orange/10 text-orange font-bold px-2 py-0.5 rounded-full">{sk}</span>
                            ))}
                            {(s.skills ?? []).length > 6 && <span className="text-[10px] text-charcoal/30">+{s.skills.length - 6}</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                    {/* Status */}
                    <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">📋 Status</td>
                      {selectedRequest.submissions?.map(s => (
                        <td key={s.id} className="px-4 py-3">
                          {s.customer_decision === "interview"
                            ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅ Til interview</span>
                            : s.customer_decision === "afvist"
                            ? <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">❌ Afvist</span>
                            : <span className="text-xs font-bold text-charcoal/40 bg-charcoal/5 px-2 py-0.5 rounded-full">⏳ Afventer</span>}
                        </td>
                      ))}
                    </tr>
                    {/* CV */}
                    <tr className="hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 text-xs font-bold text-charcoal/40 bg-[#f8f6f3]">📄 CV</td>
                      {selectedRequest.submissions?.map(s => (
                        <td key={s.id} className="px-4 py-3">
                          {s.cv_url
                            ? <a href={s.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange font-bold hover:underline">Download CV ↗</a>
                            : <span className="text-xs text-charcoal/30">Ikke vedhæftet</span>}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* ── KORT-VISNING (standard) ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedRequest.submissions?.map(s => (
                  <ConsultantCard
                    key={s.id}
                    s={s}
                    interviewDate={interviewDates[s.id] ?? ""}
                    onDateChange={val => setInterviewDates(prev => ({ ...prev, [s.id]: val }))}
                    interviewLocation={interviewLocations[s.id] ?? ""}
                    onLocationChange={val => setInterviewLocations(prev => ({ ...prev, [s.id]: val }))}
                    interviewAddress={interviewAddresses[s.id] ?? ""}
                    onAddressChange={val => setInterviewAddresses(prev => ({ ...prev, [s.id]: val }))}
                    onDecision={decision => handleDecision(s.id, decision)}
                    deciding={deciding === s.id}
                    counterDate={counterDateMap[s.id] ?? ""}
                    onCounterDateChange={val => setCounterDateMap(prev => ({ ...prev, [s.id]: val }))}
                    counterLocation={counterLocations[s.id] ?? ""}
                    onCounterLocationChange={val => setCounterLocations(prev => ({ ...prev, [s.id]: val }))}
                    counterAddress={counterAddresses[s.id] ?? ""}
                    onCounterAddressChange={val => setCounterAddresses(prev => ({ ...prev, [s.id]: val }))}
                    onCustomerResponse={(action, newDate) => handleCustomerResponse(s.id, action, newDate)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: LEVERANCE ══ */}
        {tab === "leverance" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Leverance</h2>

            {/* K6: Tidligere konsulenter */}
            {contracts.length > 0 && (
              <div className="bg-white border border-[#ede9e3] rounded-xl px-5 py-4 mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40 mb-3">⭐ Jeres konsulenter</p>
                <div className="space-y-2">
                  {contracts.map(c => (
                    <div key={c.id} className="flex items-center justify-between gap-4 py-2 border-b border-[#f0ede8] last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-charcoal">{c.consultant_name}</p>
                        <p className="text-xs text-charcoal/40">
                          {c.suppliers?.company_name && <span>{c.suppliers.company_name} · </span>}
                          {c.requests?.reference_number && <span className="text-orange font-bold">{c.requests.reference_number}</span>}
                          {c.start_date && <span className="ml-1">· {new Date(c.start_date).getFullYear()}</span>}
                        </p>
                        {c.score_comment && <p className="text-xs text-charcoal/35 mt-0.5 italic">&ldquo;{c.score_comment}&rdquo;</p>}
                      </div>
                      <div className="shrink-0 text-right">
                        {c.score != null ? (
                          <div>
                            <span className="text-sm font-black text-charcoal">{c.score}</span>
                            <span className="text-xs text-charcoal/30">/5</span>
                            <div className="flex gap-0.5 mt-0.5 justify-end">
                              {[1,2,3,4,5].map(i => (
                                <span key={i} className={`text-xs ${i <= c.score! ? "text-orange" : "text-charcoal/15"}`}>★</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal/30">Ikke vurderet</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {contracts.filter(c => c.score != null).length > 0 && (
                  <p className="text-xs text-charcoal/35 mt-3">
                    Gns. tilfredshed:{" "}
                    <strong className="text-charcoal/55">
                      {(contracts.filter(c => c.score != null).reduce((sum, c) => sum + c.score!, 0) /
                        contracts.filter(c => c.score != null).length).toFixed(1)}/5
                    </strong>
                  </p>
                )}
              </div>
            )}

            {contracts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-charcoal/40 text-sm">Ingen aktive leverancer endnu</p>
                <p className="text-charcoal/30 text-xs mt-1">Leverancer vises her, når en kontrakt er oprettet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map(c => {
                  const hours = deliveryHours.filter(h => h.contract_id === c.id);
                  const months = c.start_date ? generateMonths(c.start_date, c.end_date) : [];
                  const total = hours.reduce((sum, h) => sum + Number(h.hours), 0);
                  return (
                    <div key={c.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-bold text-charcoal">{c.consultant_name}</p>
                          {c.requests?.reference_number && (
                            <span className="text-xs font-black text-orange bg-orange/10 px-2 py-0.5 rounded-full tracking-wide mr-2">{c.requests.reference_number}</span>
                          )}
                          {c.requests?.description && (
                            <p className="text-xs text-charcoal/45 mt-1 line-clamp-1">{c.requests.description}</p>
                          )}
                        </div>
                        <div className="text-right text-xs">
                          {c.rate && <p className="font-bold text-orange">{c.rate.toLocaleString("da-DK")} DKK/t</p>}
                          {c.start_date && <p className="text-charcoal/45 mt-0.5">📅 {new Date(c.start_date).toLocaleDateString("da-DK")}{c.end_date ? ` → ${new Date(c.end_date).toLocaleDateString("da-DK")}` : ""}</p>}
                        </div>
                      </div>

                      {/* Supplier + consultant contact */}
                      <div className="bg-[#f8f6f3] rounded-xl p-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">Leverandør</p>
                          {c.suppliers?.company_name && <p className="font-semibold text-charcoal">{c.suppliers.company_name}</p>}
                          {c.suppliers?.contact_name && <p className="text-charcoal/60 mt-0.5">{c.suppliers.contact_name}</p>}
                          {c.suppliers?.email && <p className="text-charcoal/60">{c.suppliers.email}</p>}
                          {c.suppliers?.phone && <p className="text-charcoal/60">{c.suppliers.phone}</p>}
                        </div>
                        <div>
                          <p className="font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">Konsulent</p>
                          <p className="font-semibold text-charcoal">{c.consultant_name}</p>
                          {c.consultant_email && <p className="text-charcoal/60 mt-0.5">{c.consultant_email}</p>}
                          {c.consultant_phone && <p className="text-charcoal/60">{c.consultant_phone}</p>}
                        </div>
                      </div>

                      {/* Hours table — read-only */}
                      {months.length > 0 ? (
                        <div>
                          <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Timer per måned</p>
                          <div className="border border-[#ede9e3] rounded-xl overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-[#f8f6f3] border-b border-[#ede9e3]">
                                  <th className="text-left px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40">Måned</th>
                                  <th className="text-right px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40">Timer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {months.map(({ year, month }) => {
                                  const row = hours.find(h => h.year === year && h.month === month);
                                  return (
                                    <tr key={`${year}-${month}`} className="border-b border-[#f5f2ee] last:border-0">
                                      <td className="px-4 py-2.5 text-charcoal/70 font-semibold">{MONTH_NAMES[month-1]} {year}</td>
                                      <td className="px-4 py-2.5 text-right font-bold text-charcoal">
                                        {row && Number(row.hours) > 0 ? Number(row.hours).toLocaleString("da-DK") : <span className="text-charcoal/25">—</span>}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="bg-[#f8f6f3] border-t border-[#ede9e3]">
                                  <td className="px-4 py-2.5 font-extrabold text-charcoal/60 uppercase tracking-widest text-[10px]">Total</td>
                                  <td className="px-4 py-2.5 text-right font-black text-charcoal">{total.toLocaleString("da-DK")} t</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-charcoal/35 italic">Månedsoversigt vises, når start- og slutdato er angivet</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: BESKEDER ══ */}
        {tab === "messages" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Beskeder</h2>
            {/* Tråd-faner */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setMsgThread(null)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                  msgThread === null
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-charcoal/50 border-[#e8e5e0] hover:border-charcoal/30"
                }`}
              >
                💬 Generel
              </button>
              {requests.map(r => (
                <button
                  key={r.id}
                  onClick={() => setMsgThread(r.id)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                    msgThread === r.id
                      ? "bg-orange text-white border-orange"
                      : "bg-white text-charcoal/50 border-[#e8e5e0] hover:border-orange/30"
                  }`}
                >
                  📋 {r.reference_number || r.id.slice(0, 8)}
                </button>
              ))}
            </div>
            {/* ChatWindow for valgt tråd */}
            <ChatWindow
              userId={userId}
              userType="customer"
              userName={profile.contact_name || profile.company_name || profile.email}
              requestId={msgThread ?? undefined}
              title={msgThread
                ? (requests.find(r => r.id === msgThread)?.reference_number ?? "Forespørgsel")
                : undefined}
              subtitle={msgThread
                ? requests.find(r => r.id === msgThread)?.description?.slice(0, 60)
                : undefined}
            />
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
