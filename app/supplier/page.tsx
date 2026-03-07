"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { COMPETENCIES } from "@/app/data";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";

type Request = {
  id: string;
  created_at: string;
  description: string;
  competencies: string[];
  status: string;
  duration: string;
  work_mode: string;
  start_date: string;
  scope?: string | null;
  language?: string | null;
  nearshore?: string | null;
  file_url?: string | null;
  max_rate?: number | null;
  admin_note?: string | null;
  reference_number?: string | null;
};

type Submission = {
  id: string;
  request_id: string;
  name: string;
  title: string;
  rate: number | null;
  skills: string[] | null;
  status: string;
  customer_decision: string | null;
  interview_datetime: string | null;
  interview_confirmed: boolean;
  interview_proposed_by: string | null;
  interview_location: string | null;
  interview_address: string | null;
  requests: {
    description: string;
    reference_number?: string | null;
    competencies?: string[];
    status?: string;
  } | null;
};

type Profile = {
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_type: string;
  competencies: string[];
  extra_competencies: string;
  language: string;
};

type SupplierTeamMember = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

type Tab = "requests" | "submissions" | "messages" | "profile" | "leverance";

type ContractData = {
  id: string;
  request_id: string;
  consultant_name: string;
  consultant_email: string | null;
  consultant_phone: string | null;
  rate: number;
  start_date: string | null;
  end_date: string | null;
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
    { tab: "requests",    label: "Forespørgsler", icon: "📋" },
    { tab: "submissions", label: "Konsulenter",   icon: "👤" },
    { tab: "leverance",   label: "Leverance",     icon: "📦" },
    { tab: "messages",    label: "Beskeder",      icon: "💬" },
    { tab: "profile",     label: "Min profil",    icon: "⚙️" },
  ];

  const handleTab = (t: Tab) => { setTab(t); onClose(); };

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
            <p className="text-charcoal/40 text-[10px] font-semibold tracking-wide uppercase">Leverandørportal</p>
          </div>
        </div>
        {companyLabel && (
          <p className="text-charcoal/30 text-[11px] font-semibold mt-2 truncate">{companyLabel}</p>
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
                : "text-charcoal/50 hover:text-charcoal hover:bg-orange/8"
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
    setPassword("");
    setConfirm("");
    setError("");
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

/* ─── Hjælpere til sted-visning ──────────────────────────────── */
function fmtLocation(loc: string | null, addr: string | null) {
  return loc === "online" ? "💻 Online" : `📍 ${addr || "Fysisk møde"}`;
}

function LocationPicker({
  location, address, onLocationChange, onAddressChange, bgClass = "bg-[#f8f6f3]"
}: {
  location: string; address: string;
  onLocationChange: (v: string) => void; onAddressChange: (v: string) => void;
  bgClass?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Sted</label>
      <div className="flex gap-1.5">
        {[{ value: "online", label: "💻 Online" }, { value: "physical", label: "📍 Fysisk" }].map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onLocationChange(opt.value)}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
              location === opt.value
                ? "bg-orange text-white border-orange"
                : `${bgClass} border-[#e8e5e0] text-charcoal/60 hover:border-orange/40`
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {location === "physical" && (
        <input
          type="text"
          placeholder="Adresse, by..."
          className="w-full rounded-xl border border-[#e8e5e0] bg-white px-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-orange transition-all mt-1"
          value={address}
          onChange={e => onAddressChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ─── Konsulent-kort (leverandørvisning) ─────────────────────── */
function SubmissionCard({
  s,
  interviewDate,
  onDateChange,
  counterLocation,
  onCounterLocationChange,
  counterAddress,
  onCounterAddressChange,
  onSupplierResponse,
  confirming,
}: {
  s: Submission;
  interviewDate: string;
  onDateChange: (val: string) => void;
  counterLocation: string;
  onCounterLocationChange: (val: string) => void;
  counterAddress: string;
  onCounterAddressChange: (val: string) => void;
  onSupplierResponse: (action: "accept" | "counter", newDate?: string) => void;
  confirming: boolean;
}) {
  const statusColor: Record<string, string> = {
    "Indsendt": "bg-blue-100 text-blue-700",
    "Godkendt": "bg-green-100 text-green-700",
    "Valgt":    "bg-orange/15 text-orange",
    "Afvist":   "bg-red-100 text-red-600",
  };
  const statusLabel: Record<string, string> = {
    "Indsendt": "Afventer",
    "Godkendt": "Godkendt",
    "Valgt":    "Præsenteret",
    "Afvist":   "Afvist",
  };

  const fmtDate = (iso: string | null) => iso
    ? new Date(iso).toLocaleString("da-DK", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`bg-white rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-md ${
      s.interview_confirmed                                       ? "border-green-300 hover:border-green-400" :
      s.customer_decision === "interview" && s.interview_proposed_by === "customer" ? "border-orange/40 hover:border-orange/60" :
      s.customer_decision === "afvist"                            ? "border-red-200 hover:border-red-300" :
      s.status === "Valgt"                                        ? "border-orange/30 hover:border-orange/50" :
                                                                    "border-[#ede9e3] hover:border-orange/20"
    }`}>

      {/* ── Header ── */}
      <div className="p-4 border-b border-[#f5f2ee]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-charcoal truncate">{s.name}</p>
            <p className="text-xs text-charcoal/50 truncate mt-0.5">{s.title}</p>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${statusColor[s.status] ?? "bg-gray-100 text-gray-600"}`}>
            {statusLabel[s.status] ?? s.status}
          </span>
        </div>

        {s.skills && s.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {s.skills.map(skill => (
              <span key={skill} className="bg-orange/10 text-orange text-[11px] font-bold px-2 py-0.5 rounded-full">{skill}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        {s.rate && (
          <p className="font-extrabold text-orange text-sm">{s.rate.toLocaleString("da-DK")} DKK/t</p>
        )}

        {s.status === "Valgt" && !s.customer_decision && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange">
            <span>★</span> Præsenteret for kunden
          </div>
        )}

        {/* Afvist */}
        {s.customer_decision === "afvist" && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
            <span>✗</span> Afvist af kunde
          </div>
        )}

        {/* State 1: Kunde foreslår tidspunkt — leverandør skal svare */}
        {s.customer_decision === "interview" && s.interview_proposed_by === "customer" && !s.interview_confirmed && (
          <div className="bg-orange/5 border border-orange/20 rounded-xl p-3 space-y-2">
            <p className="text-xs font-extrabold tracking-widest uppercase text-orange mb-0.5">
              📅 Kunde ønsker interview
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-charcoal font-bold">{fmtDate(s.interview_datetime)}</p>
            )}
            {s.interview_location && (
              <p className="text-xs text-charcoal/70 font-semibold">{fmtLocation(s.interview_location, s.interview_address)}</p>
            )}
            <button
              onClick={() => onSupplierResponse("accept")}
              disabled={confirming}
              className="w-full bg-green-500 text-white font-bold rounded-full py-2.5 text-xs hover:bg-green-600 transition-all disabled:opacity-50">
              {confirming ? "Bekræfter…" : "✓ Acceptér tidspunkt"}
            </button>
            <div className="pt-1 space-y-1.5">
              <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">
                Foreslå andet tidspunkt
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#e8e5e0] bg-white px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-orange transition-all"
                value={interviewDate}
                onChange={e => onDateChange(e.target.value)}
              />
              <LocationPicker
                location={counterLocation}
                address={counterAddress}
                onLocationChange={onCounterLocationChange}
                onAddressChange={onCounterAddressChange}
              />
              <button
                onClick={() => onSupplierResponse("counter", interviewDate || undefined)}
                disabled={confirming || !interviewDate || !counterLocation || (counterLocation === "physical" && !counterAddress)}
                className="w-full mt-1 bg-charcoal text-white font-bold rounded-full py-2 text-xs hover:bg-charcoal/80 transition-all disabled:opacity-40">
                Foreslå nyt tidspunkt →
              </button>
            </div>
          </div>
        )}

        {/* State 2: Leverandør har foreslået — afventer kunde */}
        {s.customer_decision === "interview" && s.interview_proposed_by === "supplier" && !s.interview_confirmed && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1">
              ⏳ Dit forslag afventer kundegodkendelse
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-blue-700 font-semibold">{fmtDate(s.interview_datetime)}</p>
            )}
            {s.interview_location && (
              <p className="text-xs text-blue-600/70 font-semibold">{fmtLocation(s.interview_location, s.interview_address)}</p>
            )}
          </div>
        )}

        {/* State 3: Bekræftet */}
        {s.interview_confirmed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">
              ✅ Interview bekræftet
            </p>
            {s.interview_datetime && (
              <p className="text-xs text-green-700 font-bold">{fmtDate(s.interview_datetime)}</p>
            )}
            {s.interview_location && (
              <p className="text-xs text-green-600/70 font-semibold">{fmtLocation(s.interview_location, s.interview_address)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Hoved-komponent ────────────────────────────────────────── */
export default function SupplierPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplierId, setSupplierId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [form, setForm] = useState({ name: "", title: "", experience_years: "", rate: "", skills: "", bio: "", availability: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interviewDates, setInterviewDates] = useState<Record<string, string>>({});
  const [counterSupplierLocations, setCounterSupplierLocations] = useState<Record<string, string>>({});
  const [counterSupplierAddresses, setCounterSupplierAddresses] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [tab, setTab] = useState<Tab>("requests");
  const [profile, setProfile] = useState<Profile>({ company_name: "", first_name: "", last_name: "", email: "", phone: "", company_type: "", competencies: [], extra_competencies: "", language: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [teamMembers, setTeamMembers] = useState<SupplierTeamMember[]>([]);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [deliveryHours, setDeliveryHours] = useState<DeliveryHoursData[]>([]);
  const [localHoursMap, setLocalHoursMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/supplier/login"); return; }

      const { data: supplierData } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!supplierData) { router.push("/supplier/login"); return; }
      setSupplierId(user.id);

      setProfile({
        company_name: supplierData.company_name ?? "",
        first_name: supplierData.first_name ?? "",
        last_name: supplierData.last_name ?? "",
        email: supplierData.email ?? user.email ?? "",
        phone: supplierData.phone ?? "",
        company_type: supplierData.company_type ?? "",
        competencies: supplierData.competencies ?? [],
        extra_competencies: supplierData.extra_competencies ?? "",
        language: supplierData.language ?? "",
      });

      const { data: rsData } = await supabase
        .from("request_suppliers")
        .select("request_id")
        .eq("supplier_id", user.id);

      const requestIds = (rsData ?? []).map(rs => rs.request_id);

      const { data: reqData } = requestIds.length > 0
        ? await supabase.from("requests").select("*").in("id", requestIds).order("created_at", { ascending: false })
        : { data: [] };

      const { data: subData } = await supabase
        .from("consultant_submissions")
        .select("*, requests(description, reference_number, competencies, status)")
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false });

      setRequests(reqData ?? []);
      setSubmissions(subData ?? []);

      // Hent kontrakter for denne leverandør + leverancetimer
      const { data: contractData } = await supabase
        .from("contracts")
        .select("id, request_id, consultant_name, consultant_email, consultant_phone, rate, start_date, end_date, requests(description, reference_number)")
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false });
      const ctrs = contractData ?? [];
      setContracts(ctrs as unknown as ContractData[]);
      if (ctrs.length > 0) {
        const { data: hoursData } = await supabase
          .from("delivery_hours").select("*")
          .in("contract_id", ctrs.map(c => c.id));
        const hrs = hoursData ?? [];
        setDeliveryHours(hrs);
        const initMap: Record<string, string> = {};
        for (const h of hrs) {
          initMap[`${h.contract_id}-${h.year}-${h.month}`] = String(h.hours);
        }
        setLocalHoursMap(initMap);
      }

      setLoading(false);

      if (supplierData.company_name) {
        const { data: teamData } = await supabase
          .from("suppliers")
          .select("id, email, first_name, last_name, phone")
          .eq("company_name", supplierData.company_name)
          .neq("id", user.id);
        setTeamMembers(teamData ?? []);
      }

      if (!supplierData.company_name) {
        setTab("profile");
      }
    };
    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSubmitting(true);
    let cv_url = null;
    if (cvFile) {
      const fileName = `${supplierId}/${Date.now()}_${cvFile.name}`;
      await supabase.storage.from("CVS").upload(fileName, cvFile);
      const { data: urlData } = supabase.storage.from("CVS").getPublicUrl(fileName);
      cv_url = urlData.publicUrl;
    }

    await supabase.from("consultant_submissions").insert({
      request_id: selectedRequest.id,
      supplier_id: supplierId,
      name: form.name,
      title: form.title,
      language: form.experience_years,
      rate: parseInt(form.rate),
      skills: form.skills.split(",").map(s => s.trim()),
      bio: form.bio,
      availability: form.availability,
      status: "Indsendt",
      cv_url,
    });

    await fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_name: profile.company_name || profile.email,
        consultant_name: form.name,
        request_description: selectedRequest.description,
      }),
    });

    setSubmitted(true);
    setSubmitting(false);
    setSelectedRequest(null);
    setForm({ name: "", title: "", experience_years: "", rate: "", skills: "", bio: "", availability: "" });

    const { data: subData } = await supabase
      .from("consultant_submissions")
      .select("*, requests(description, reference_number, competencies, status)")
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false });
    setSubmissions(subData ?? []);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await supabase.from("suppliers").upsert({
      id: supplierId,
      email: profile.email,
      company_name: profile.company_name,
      first_name: profile.first_name,
      last_name: profile.last_name,
      contact_name: `${profile.first_name} ${profile.last_name}`.trim(),
      phone: profile.phone,
      company_type: profile.company_type,
      competencies: profile.competencies,
      extra_competencies: profile.extra_competencies,
      language: profile.language,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSupplierResponse = async (submissionId: string, action: "accept" | "counter", newDatetime?: string) => {
    setConfirming(submissionId);
    const isoDate = newDatetime ? new Date(newDatetime).toISOString() : null;
    const counterLoc = counterSupplierLocations[submissionId] ?? null;
    const counterAddr = counterLoc === "physical" ? (counterSupplierAddresses[submissionId] ?? null) : null;
    const updates: Record<string, unknown> = {};
    if (action === "accept") {
      updates.interview_confirmed = true;
    } else {
      updates.interview_proposed_by = "supplier";
      updates.interview_confirmed = false;
      if (isoDate) updates.interview_datetime = isoDate;
      if (counterLoc) updates.interview_location = counterLoc;
      updates.interview_address = counterLoc === "physical" ? counterAddr : null;
    }
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);

    // Notify customer + admin
    const submission = submissions.find(s => s.id === submissionId);
    await fetch("/api/notify-customer-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_id: submissionId,
        action: action === "accept" ? "accepted" : "counter",
        new_datetime: isoDate ?? submission?.interview_datetime ?? null,
      }),
    });

    setSubmissions(prev => prev.map(s =>
      s.id === submissionId
        ? {
            ...s,
            interview_confirmed: action === "accept" ? true : false,
            interview_proposed_by: action === "accept" ? s.interview_proposed_by : "supplier",
            interview_datetime: isoDate ?? s.interview_datetime,
            interview_location: action === "accept" ? s.interview_location : (counterLoc ?? s.interview_location),
            interview_address: action === "accept" ? s.interview_address : (counterAddr ?? s.interview_address),
          }
        : s
    ));
    setConfirming(null);
  };

  const handleLogout = () => {
    supabase.auth.signOut().then(() => { window.location.href = "https://finditconsultants.com"; });
  };

  const handleUpsertHours = async (contractId: string, year: number, month: number, value: string) => {
    const hours = parseFloat(value) || 0;
    await supabase.from("delivery_hours").upsert(
      { contract_id: contractId, year, month, hours, updated_at: new Date().toISOString() },
      { onConflict: "contract_id,year,month" }
    );
  };

  /* ── Gruppér indsendte konsulenter per forespørgsel ── */
  type SubGroup = {
    request_id: string;
    description: string;
    reference_number?: string | null;
    competencies?: string[];
    request_status?: string;
    submissions: Submission[];
  };

  const subGroups: SubGroup[] = [];
  const subGroupMap: Record<string, SubGroup> = {};
  for (const s of submissions) {
    const rid = s.request_id ?? "none";
    if (!subGroupMap[rid]) {
      subGroupMap[rid] = {
        request_id: rid,
        description: s.requests?.description ?? "Ukendt opgave",
        reference_number: s.requests?.reference_number ?? null,
        competencies: s.requests?.competencies ?? [],
        request_status: s.requests?.status,
        submissions: [],
      };
      subGroups.push(subGroupMap[rid]);
    }
    subGroupMap[rid].submissions.push(s);
  }

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  const reqStatusColor: Record<string, string> = {
    "Ny": "bg-blue-100 text-blue-700",
    "I gang": "bg-orange/15 text-orange",
    "Afsluttet": "bg-green-100 text-green-700",
  };

  const tabLabels: Record<Tab, string> = {
    requests: "Forespørgsler",
    submissions: "Konsulenter",
    leverance: "Leverance",
    messages: "Beskeder",
    profile: "Min profil",
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <p className="text-charcoal/50 font-semibold">Henter data…</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f6f3] overflow-hidden">

      {/* ── Mobil backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <PortalSidebar
        tab={tab}
        setTab={t => { setTab(t); }}
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
        <span className="text-xs text-charcoal/45 font-semibold ml-auto truncate max-w-[120px]">
          {tabLabels[tab]}
        </span>
      </div>

      <main className="flex-1 md:ml-56 overflow-y-auto pt-14 md:pt-0 p-4 md:p-8">

        {/* ══════════════════════════════════════════════
            TAB: FORESPØRGSLER
        ══════════════════════════════════════════════ */}
        {tab === "requests" && (
          <div className="space-y-6">
            {/* Statistik */}
            {(() => {
              const stats = [
                { label: "Modtagne opgaver",     value: requests.length,                                           icon: "📋" },
                { label: "Indsendte konsulenter", value: submissions.length,                                        icon: "👤" },
                { label: "Præsenterede",          value: submissions.filter(s => s.status === "Valgt").length,     icon: "⭐" },
                { label: "Interviews",            value: submissions.filter(s => s.customer_decision === "interview").length, icon: "🗓️" },
              ];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Forespørgselsliste */}
              <div>
                <h2 className="font-bold text-lg text-charcoal mb-4">Forespørgsler</h2>
                {requests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-charcoal/45 text-sm">Ingen forespørgsler endnu</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...requests]
                      .sort((a, b) => (a.status === "Afsluttet" ? 1 : 0) - (b.status === "Afsluttet" ? 1 : 0))
                      .map(r => {
                        const isCompleted = r.status === "Afsluttet";
                        return (
                          <div key={r.id}
                            onClick={() => { if (!isCompleted) { setSelectedRequest(r); setSubmitted(false); } }}
                            className={`bg-white rounded-2xl border p-4 transition-all ${
                              isCompleted
                                ? "border-[#ede9e3] opacity-60 cursor-default"
                                : selectedRequest?.id === r.id
                                  ? "border-orange shadow-md cursor-pointer"
                                  : "border-[#ede9e3] hover:border-orange/50 hover:shadow-sm cursor-pointer"
                            }`}>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              {r.reference_number && (
                                <span className="text-xs font-black text-orange bg-orange/10 px-2 py-0.5 rounded-full tracking-wide">{r.reference_number}</span>
                              )}
                              {r.status && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reqStatusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                                  {r.status}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm font-semibold line-clamp-2 mb-2 ${isCompleted ? "text-charcoal/50" : "text-charcoal"}`}>
                              {r.description || "Ingen beskrivelse"}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {r.competencies?.map(c => (
                                <span key={c} className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCompleted ? "bg-charcoal/8 text-charcoal/40" : "bg-orange/10 text-orange"}`}>{c}</span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-charcoal/40 font-semibold">
                              {r.start_date && <span>📅 {r.start_date}</span>}
                              {r.duration && <span>⏱ {r.duration}</span>}
                              {r.work_mode && <span>📍 {r.work_mode}</span>}
                              {r.scope && <span>🕐 {r.scope}</span>}
                              {r.language && <span>🌐 {r.language}</span>}
                              {r.nearshore && <span>🌍 Nearshore: {r.nearshore}</span>}
                              {r.max_rate && <span className={isCompleted ? "" : "text-green font-bold"}>💰 Maks. {r.max_rate} DKK/t</span>}
                            </div>
                            {r.file_url && (
                              <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-orange hover:underline">
                                📎 Se opgavebeskrivelse
                              </a>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Indsend konsulentprofil */}
              <div>
                <h2 className="font-bold text-lg text-charcoal mb-4">
                  {selectedRequest ? "Indsend konsulentprofil" : "Vælg en forespørgsel"}
                </h2>
                {selectedRequest ? (
                  submitted ? (
                    <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                      <div className="text-4xl mb-3">✅</div>
                      <h3 className="font-bold text-charcoal mb-1">Profil indsendt!</h3>
                      <p className="text-charcoal/50 text-sm mb-4">Vi behandler din profil hurtigst muligt.</p>
                      <button onClick={() => setSelectedRequest(null)} className="text-orange font-bold text-sm hover:underline">← Tilbage</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#ede9e3] p-5 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-charcoal/50 font-semibold">Forespørgsel valgt</p>
                        <button type="button" onClick={() => setSelectedRequest(null)} className="text-charcoal/40 hover:text-charcoal text-xs">× Annuller</button>
                      </div>
                      {/* Opgave-context */}
                      <div className="bg-[#f8f6f3] rounded-xl p-3 mb-1 space-y-2">
                        <div className="flex flex-wrap gap-3 text-xs font-semibold text-charcoal/55">
                          {selectedRequest.start_date && <span>📅 {selectedRequest.start_date}</span>}
                          {selectedRequest.duration && <span>⏱ {selectedRequest.duration}</span>}
                          {selectedRequest.work_mode && <span>📍 {selectedRequest.work_mode}</span>}
                          {selectedRequest.scope && <span>🕐 {selectedRequest.scope}</span>}
                          {selectedRequest.language && <span>🌐 {selectedRequest.language}</span>}
                          {selectedRequest.nearshore && <span>🌍 Nearshore: {selectedRequest.nearshore}</span>}
                          {selectedRequest.max_rate && (
                            <span className="text-green font-bold">💰 Maks. {selectedRequest.max_rate} DKK/time</span>
                          )}
                          {selectedRequest.file_url && (
                            <a href={selectedRequest.file_url} target="_blank" rel="noopener noreferrer"
                              className="text-orange font-bold hover:underline">
                              📎 Se opgavebeskrivelse
                            </a>
                          )}
                        </div>
                        {selectedRequest.admin_note && (
                          <div className="border-t border-[#ede9e3] pt-2">
                            <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Note fra FindIT</p>
                            <p className="text-xs text-charcoal/70 font-medium">{selectedRequest.admin_note}</p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Navn</label>
                          <input required className={inp} placeholder="Konsulentens navn" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lbl}>Titel</label>
                          <input required className={inp} placeholder="F.eks. Senior Developer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lbl}>Sprog</label>
                          <select className={inp} value={form.experience_years} onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))}>
                            <option value="">Vælg…</option>
                            <option>Dansk</option>
                            <option>Engelsk</option>
                            <option>Dansk & Engelsk</option>
                            <option>Andet</option>
                          </select>
                        </div>
                        <div>
                          <label className={lbl}>Timepris (DKK)</label>
                          <input type="number" required className={inp} placeholder="F.eks. 1200" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Kompetencer</label>
                        <div className="flex flex-wrap gap-2">
                          {COMPETENCIES.map(c => {
                            const selected = form.skills.split(",").map(s => s.trim()).filter(Boolean).includes(c);
                            return (
                              <button type="button" key={c}
                                onClick={() => {
                                  const current = form.skills.split(",").map(s => s.trim()).filter(Boolean);
                                  const updated = selected ? current.filter(s => s !== c) : [...current, c];
                                  setForm(f => ({ ...f, skills: updated.join(", ") }));
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selected ? "bg-orange text-white border-orange" : "bg-white text-charcoal border-[#e8e5e0] hover:border-orange/50"}`}>
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Upload CV <span className="normal-case font-normal">(valgfrit)</span></label>
                        <label className="flex items-center gap-3 w-full rounded-xl border border-dashed border-[#d4cfc8] bg-[#f8f6f3] px-4 py-2.5 cursor-pointer hover:border-orange transition-all">
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
                          <span className="text-base">📎</span>
                          <div>
                            <div className="text-xs font-bold text-charcoal">Klik for at uploade CV</div>
                            {cvFile
                              ? <div className="text-xs text-orange font-bold mt-0.5">✓ {cvFile.name}</div>
                              : <div className="text-xs text-charcoal/40 mt-0.5">PDF eller Word</div>
                            }
                          </div>
                        </label>
                      </div>
                      <div>
                        <label className={lbl}>Tilgængelighed fra</label>
                        <input type="date" required className={inp} value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} />
                      </div>
                      <div>
                        <label className={lbl}>Kort beskrivelse</label>
                        <textarea required className={`${inp} resize-none`} rows={3} placeholder="Beskriv konsulentens erfaring og styrker…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="w-full bg-orange text-white font-bold rounded-full px-8 py-3 text-sm hover:bg-orange-dark transition-all disabled:opacity-50">
                        {submitting ? "Indsender…" : "Indsend profil →"}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                    <div className="text-3xl mb-2">👆</div>
                    <p className="text-charcoal/45 text-sm">Klik på en forespørgsel for at indsende en konsulentprofil</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: KONSULENTER
        ══════════════════════════════════════════════ */}
        {tab === "submissions" && (
          <>
            <h2 className="font-bold text-lg text-charcoal mb-6">Mine konsulenter</h2>

            {subGroups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 text-center">
                <div className="text-4xl mb-3">👤</div>
                <p className="text-charcoal/50 text-sm font-semibold">Du har ikke indsendt nogen konsulenter endnu</p>
                <p className="text-charcoal/35 text-xs mt-1">Gå til Forespørgsler for at indsende en profil.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {subGroups.map(group => (
                  <div key={group.request_id}>

                    {/* ── Forespørgselshoved ── */}
                    <div className="bg-white rounded-2xl border border-[#ede9e3] p-4 mb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {group.reference_number && (
                              <span className="text-xs font-black text-orange bg-orange/10 px-2.5 py-0.5 rounded-full tracking-wide">{group.reference_number}</span>
                            )}
                            {group.request_status && (
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${reqStatusColor[group.request_status] ?? "bg-gray-100 text-gray-600"}`}>
                                {group.request_status}
                              </span>
                            )}
                            <span className="text-xs font-bold bg-charcoal/8 text-charcoal/50 px-2.5 py-0.5 rounded-full">
                              {group.submissions.length} konsulent{group.submissions.length !== 1 ? "er" : ""}
                            </span>
                          </div>
                          <p className="text-sm text-charcoal font-semibold line-clamp-2">{group.description}</p>
                          {group.competencies && group.competencies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {group.competencies.map(c => (
                                <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Mini-stat */}
                        <div className="shrink-0 text-right space-y-1">
                          {group.submissions.filter(s => s.customer_decision === "interview").length > 0 && (
                            <div className="text-xs font-bold text-green-600">
                              ✓ {group.submissions.filter(s => s.customer_decision === "interview").length} interview
                            </div>
                          )}
                          {group.submissions.filter(s => s.status === "Valgt" && !s.customer_decision).length > 0 && (
                            <div className="text-xs font-bold text-orange">
                              ★ {group.submissions.filter(s => s.status === "Valgt" && !s.customer_decision).length} præsenteret
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── Konsulent-kort ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {group.submissions.map(s => (
                        <SubmissionCard
                          key={s.id}
                          s={s}
                          interviewDate={interviewDates[s.id] ?? ""}
                          onDateChange={val => setInterviewDates(prev => ({ ...prev, [s.id]: val }))}
                          counterLocation={counterSupplierLocations[s.id] ?? ""}
                          onCounterLocationChange={val => setCounterSupplierLocations(prev => ({ ...prev, [s.id]: val }))}
                          counterAddress={counterSupplierAddresses[s.id] ?? ""}
                          onCounterAddressChange={val => setCounterSupplierAddresses(prev => ({ ...prev, [s.id]: val }))}
                          onSupplierResponse={(action, newDate) => handleSupplierResponse(s.id, action, newDate)}
                          confirming={confirming === s.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════
            TAB: LEVERANCE
        ══════════════════════════════════════════════ */}
        {tab === "leverance" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Leverance</h2>
            {contracts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-charcoal/40 text-sm">Ingen aktive leverancer endnu</p>
                <p className="text-charcoal/30 text-xs mt-1">Leverancer vises her, når en kontrakt er oprettet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map(c => {
                  const months = c.start_date ? generateMonths(c.start_date, c.end_date) : [];
                  const total = months.reduce((sum, { year, month }) => {
                    return sum + (parseFloat(localHoursMap[`${c.id}-${year}-${month}`] ?? "0") || 0);
                  }, 0);
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

                      {/* Consultant contact */}
                      {(c.consultant_email || c.consultant_phone) && (
                        <div className="bg-[#f8f6f3] rounded-xl p-3 text-xs">
                          <p className="font-extrabold tracking-widest uppercase text-charcoal/35 mb-1.5">Konsulent</p>
                          <p className="font-semibold text-charcoal">{c.consultant_name}</p>
                          {c.consultant_email && <p className="text-charcoal/60 mt-0.5">{c.consultant_email}</p>}
                          {c.consultant_phone && <p className="text-charcoal/60">{c.consultant_phone}</p>}
                        </div>
                      )}

                      {/* Hours table — editable */}
                      {months.length > 0 ? (
                        <div>
                          <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Timer per måned — registrér faktiske timer</p>
                          <div className="border border-[#ede9e3] rounded-xl overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-[#f8f6f3] border-b border-[#ede9e3]">
                                  <th className="text-left px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40">Måned</th>
                                  <th className="text-right px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40 w-32">Timer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {months.map(({ year, month }) => {
                                  const key = `${c.id}-${year}-${month}`;
                                  return (
                                    <tr key={key} className="border-b border-[#f5f2ee] last:border-0">
                                      <td className="px-4 py-2 text-charcoal/70 font-semibold">{MONTH_NAMES[month-1]} {year}</td>
                                      <td className="px-2 py-1.5 text-right">
                                        <input
                                          type="number"
                                          step="0.5"
                                          min="0"
                                          className="w-24 rounded-lg border border-[#e8e5e0] bg-white px-2 py-1 text-xs text-right text-charcoal focus:outline-none focus:border-orange transition-all"
                                          value={localHoursMap[key] ?? ""}
                                          placeholder="0"
                                          onChange={e => setLocalHoursMap(prev => ({ ...prev, [key]: e.target.value }))}
                                          onBlur={e => handleUpsertHours(c.id, year, month, e.target.value)}
                                        />
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
                          <p className="text-[10px] text-charcoal/35 mt-1.5">Timer gemmes automatisk, når du klikker uden for feltet</p>
                        </div>
                      ) : (
                        <p className="text-xs text-charcoal/35 italic">Månedsoversigt vises, når start- og slutdato er angivet af admin</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: BESKEDER
        ══════════════════════════════════════════════ */}
        {tab === "messages" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Beskeder</h2>
            <ChatWindow
              userId={supplierId}
              userType="supplier"
              userName={`${profile.first_name} ${profile.last_name}`.trim() || profile.company_name || profile.email}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: MIN PROFIL
        ══════════════════════════════════════════════ */}
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
                  <input className={inp} placeholder="Fornavn" value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Efternavn</label>
                  <input className={inp} placeholder="Efternavn" value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={lbl}>Email <span className="normal-case font-normal text-charcoal/30">(kan ikke ændres)</span></label>
                <input className={inp} disabled value={profile.email} />
              </div>
              <div>
                <label className={lbl}>Telefon</label>
                <input className={inp} placeholder="+45 12 34 56 78" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Virksomhedstype</label>
                <select className={inp} value={profile.company_type} onChange={e => setProfile(p => ({ ...p, company_type: e.target.value }))}>
                  <option value="">Vælg…</option>
                  <option>Konsulenthus (egne konsulenter)</option>
                  <option>Konsulentformidler (freelancers)</option>
                  <option>Selvstændig (freelancer)</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Kompetencer</label>
                <div className="flex flex-wrap gap-2">
                  {COMPETENCIES.map(c => {
                    const selected = profile.competencies.includes(c);
                    return (
                      <button type="button" key={c}
                        onClick={() => {
                          const updated = selected
                            ? profile.competencies.filter(x => x !== c)
                            : [...profile.competencies, c];
                          setProfile(p => ({ ...p, competencies: updated }));
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selected ? "bg-orange text-white border-orange" : "bg-white text-charcoal border-[#e8e5e0] hover:border-orange/50"}`}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={lbl}>Yderligere kompetencer</label>
                <input className={inp} placeholder="F.eks. specifikke teknologier eller brancher…" value={profile.extra_competencies} onChange={e => setProfile(p => ({ ...p, extra_competencies: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Sprog</label>
                <select className={inp} value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}>
                  <option value="">Vælg…</option>
                  <option>Dansk</option>
                  <option>Engelsk</option>
                  <option>Dansk og engelsk</option>
                </select>
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full bg-orange text-white font-bold rounded-full px-8 py-3 text-sm hover:bg-orange-dark transition-all disabled:opacity-50">
                {saved ? "Gemt ✓" : saving ? "Gemmer…" : "Gem profil"}
              </button>
              {teamMembers.length > 0 && (
                <div className="border-t border-[#f0ede8] pt-4 mt-2">
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">
                    👥 Kollegaer fra {profile.company_name}
                  </p>
                  <div className="space-y-2">
                    {teamMembers.map(m => (
                      <div key={m.id} className="flex items-center justify-between bg-[#f8f6f3] rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-charcoal">
                            {[m.first_name, m.last_name].filter(Boolean).join(" ") || m.email}
                          </p>
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
