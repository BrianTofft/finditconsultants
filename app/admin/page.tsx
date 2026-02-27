"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Request = {
  id: string;
  created_at: string;
  email: string;
  description: string;
  competencies: string[];
  status: string;
  duration: string;
  work_mode: string;
  start_date: string;
  admin_note?: string;
};

type Submission = {
  id: string;
  created_at: string;
  request_id: string;
  name: string;
  title: string;
  rate: number;
  skills: string[];
  bio: string;
  availability: string;
  status: string;
  customer_decision: string | null;
  interview_datetime: string | null;
  interview_confirmed: boolean;
  cv_url: string | null;
  requests: { description: string; email: string } | null;
};

type Supplier = {
  id: string;
  email: string;
  company_name: string;
};

type User = {
  id: string;
  email: string;
  created_at: string;
  rolle: string;
  company_name: string;
  contact_name: string;
  phone: string;
  supplier_company: string;
};

type Contract = {
  id: string;
  created_at: string;
  request_id: string;
  supplier_id: string;
  consultant_name: string;
  rate: number;
  duration: string;
  start_date: string;
  score: number | null;
  score_comment: string | null;
  requests: { description: string; email: string } | null;
  suppliers: { company_name: string; email: string } | null;
};

type SupplierApplication = {
  id: string;
  created_at: string;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_type: string;
  competencies: string[];
  extra_competencies: string;
  language: string;
  status: string;
};

type Tab = "requests" | "submissions" | "contracts" | "applications" | "users" | "messages";
const STATUSES = ["Ny", "I gang", "Afsluttet"];

function ContractCard({ contract: c, onUpdateScore }: { contract: Contract; onUpdateScore: (id: string, score: number, comment: string) => void }) {
  const [score, setScore] = useState(c.score ?? 0);
  const [comment, setComment] = useState(c.score_comment ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="font-bold text-charcoal">{c.consultant_name}</p>
          <p className="text-xs text-charcoal/50">{c.suppliers?.company_name || c.suppliers?.email}</p>
          {c.requests && <p className="text-xs text-charcoal/40 mt-1">📋 {c.requests.description?.slice(0, 60)}…</p>}
        </div>
        <div className="text-right">
          {c.rate && <p className="font-bold text-orange">{c.rate} DKK/t</p>}
          {c.duration && <p className="text-xs text-charcoal/50">{c.duration}</p>}
          {c.start_date && <p className="text-xs text-charcoal/40">📅 {new Date(c.start_date).toLocaleDateString("da-DK")}</p>}
        </div>
      </div>
      <div className="border-t border-[#f0ede8] pt-4">
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Score ved endt opgave</p>
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setScore(n)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${score >= n ? "bg-orange text-white" : "bg-[#f8f6f3] text-charcoal/40 hover:bg-orange/20"}`}>
              {n}
            </button>
          ))}
        </div>
        <input className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-orange transition-all mb-2"
          placeholder="Kommentar til score…" value={comment} onChange={e => setComment(e.target.value)} />
        <button onClick={async () => { setSaving(true); await onUpdateScore(c.id, score, comment); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          disabled={saving || score === 0}
          className="bg-orange text-white font-bold rounded-full px-5 py-2 text-xs hover:bg-orange-dark transition-all disabled:opacity-40">
          {saved ? "Gemt ✓" : saving ? "Gemmer…" : "Gem score"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("requests");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, Set<string>>>({});
  const [notifying, setNotifying] = useState<string | null>(null);
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [notifiedSuppliers, setNotifiedSuppliers] = useState<Record<string, string[]>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showContractForm, setShowContractForm] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" });
  const [savingContract, setSavingContract] = useState(false);
  const [applications, setApplications] = useState<SupplierApplication[]>([]);
  const [appProcessing, setAppProcessing] = useState<string | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "customer", company_name: "", contact_name: "", phone: "" });
  const [creatingUser, setCreatingUser] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [adminId, setAdminId] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [createUserError, setCreateUserError] = useState("");
  const [createUserSuccess, setCreateUserSuccess] = useState(false);
  
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }

      const { data: adminData } = await supabase.from("admins").select("id").eq("id", user.id).single();
      if (!adminData) { router.push("/admin/login"); return; }

      const [reqRes, subRes, userRes, supRes, rsRes, contractRes, appRes] = await Promise.all([
        supabase.from("requests").select("*").order("created_at", { ascending: false }),
        supabase.from("consultant_submissions").select("*, requests(description, email)").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
        supabase.from("suppliers").select("id, email, company_name"),
        supabase.from("request_suppliers").select("request_id, supplier_id"),
        supabase.from("contracts").select("*, requests(description, email), suppliers(company_name, email)").order("created_at", { ascending: false }),
supabase.from("supplier_applications").select("*").order("created_at", { ascending: false }),
      ]);

      setRequests(reqRes.data ?? []);
      setSubmissions(subRes.data ?? []);
      setUsers(userRes.data ?? []);
      setSuppliers(supRes.data ?? []);
      setContracts(contractRes.data ?? []);
      setApplications(appRes.data ?? []);

      const nsMap: Record<string, string[]> = {};
      for (const rs of (rsRes.data ?? [])) {
        if (!nsMap[rs.request_id]) nsMap[rs.request_id] = [];
        nsMap[rs.request_id].push(rs.supplier_id);
      }

      setNotifiedSuppliers(nsMap);

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (adminUser) setAdminId(adminUser.id);

      const { data: allChats } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false });

      const byUser: Record<string, any> = {};
      for (const msg of allChats ?? []) {
        if (msg.sender_type === "admin") continue;
        const uid = msg.sender_id;
        if (!byUser[uid]) byUser[uid] = { sender_id: uid, sender_name: msg.sender_name, sender_type: msg.sender_type, latest: msg.created_at, unread: 0 };
        if (!msg.read_by_admin) byUser[uid].unread++;
      }
      setChatUsers(Object.values(byUser));

      setLoading(false);
    };
    init();
  }, [router]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    await supabase.from("consultant_submissions").update({ status }).eq("id", id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const toggleSupplier = (requestId: string, supplierId: string) => {
    setSelectedSuppliers(prev => {
      const current = new Set(prev[requestId] ?? []);
      current.has(supplierId) ? current.delete(supplierId) : current.add(supplierId);
      return { ...prev, [requestId]: current };
    });
  };

  const notifySuppliers = async (requestId: string) => {
    const selected = Array.from(selectedSuppliers[requestId] ?? []);
    if (selected.length === 0) return;
    setNotifying(requestId);
    await fetch("/api/notify-suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, supplier_ids: selected }),
    });
    setNotified(prev => ({ ...prev, [requestId]: true }));
    setNotifiedSuppliers(prev => ({ ...prev, [requestId]: [...(prev[requestId] ?? []), ...selected] }));
    setNotifying(null);
    setTimeout(() => setNotified(prev => ({ ...prev, [requestId]: false })), 3000);
  };

  const createContract = async (requestId: string) => {
    setSavingContract(true);
    const { data } = await supabase.from("contracts").insert({
      request_id: requestId,
      supplier_id: contractForm.supplier_id,
      consultant_name: contractForm.consultant_name,
      rate: parseInt(contractForm.rate),
      duration: contractForm.duration,
      start_date: contractForm.start_date || null,
    }).select("*, requests(description, email), suppliers(company_name, email)").single();

    if (data) setContracts(prev => [data, ...prev]);
    setShowContractForm(null);
    setContractForm({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" });
    setSavingContract(false);
    await supabase.from("requests").update({ status: "Afsluttet" }).eq("id", requestId);
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Afsluttet" } : r));
  };

  const updateScore = async (contractId: string, score: number, comment: string) => {
    await supabase.from("contracts").update({ score, score_comment: comment }).eq("id", contractId);
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, score, score_comment: comment } : c));
  };

  const handleCreateUser = async () => {
    setCreatingUser(true);
    setCreateUserError("");
    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (data.error) {
      setCreateUserError(data.error);
    } else {
      setCreateUserSuccess(true);
      setNewUser({ email: "", password: "", role: "customer", company_name: "", contact_name: "", phone: "" });
      setTimeout(() => { setCreateUserSuccess(false); setShowCreateUser(false); }, 2000);
      // Genindlæs brugerlisten
      const { data: userData } = await supabase.from("user_roles").select("*");
      setUsers(userData ?? []);
    }
    setCreatingUser(false);
  };

  const handleApplication = async (app: SupplierApplication, decision: "accepted" | "rejected") => {
  setAppProcessing(app.id);

  if (decision === "accepted") {
    // Opret bruger
    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: app.email,
        password: Math.random().toString(36).slice(-10),
        role: "supplier",
        company_name: app.company_name,
        contact_name: `${app.first_name} ${app.last_name}`,
        phone: app.phone,
      }),
    });
    const data = await res.json();

    if (data.userId) {
      // Gem ekstra felter
      await supabase.from("suppliers").update({
        first_name: app.first_name,
        last_name: app.last_name,
        company_type: app.company_type,
        competencies: app.competencies,
        extra_competencies: app.extra_competencies,
        language: app.language,
      }).eq("id", data.userId);
    }

    // Send velkomst email
    await fetch("/api/notify-supplier-approved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: app.email, first_name: app.first_name, company_name: app.company_name }),
    });
  }

  // Opdater status
  await supabase.from("supplier_applications").update({ status: decision === "accepted" ? "Godkendt" : "Afvist" }).eq("id", app.id);
  setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: decision === "accepted" ? "Godkendt" : "Afvist" } : a));
  setAppProcessing(null);
};

  const handleAdminResetPassword = async (email: string) => {
    await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    alert(`Reset email sendt til ${email}`);
  };

  const loadChat = async (senderId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${senderId},and(sender_type.eq.admin,request_id.is.null)`)
      .order("created_at", { ascending: true });
    setChatMessages(data ?? []);
    await supabase.from("chat_messages").update({ read_by_admin: true }).eq("sender_id", senderId);
    setChatUsers(prev => prev.map(u => u.sender_id === senderId ? { ...u, unread: 0 } : u));
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sendAdminMessage = async () => {
    if (!chatInput.trim() || !selectedChatUser) return;
    const content = chatInput.trim();
    setChatInput("");
    await supabase.from("chat_messages").insert({
      sender_type: "admin",
      sender_id: adminId,
      sender_name: "FindIT-teamet",
      content,
      read_by_admin: true,
      read_by_user: false,
    });
    loadChat(selectedChatUser.sender_id);
  };

  const statusColor: Record<string, string> = {
    "Ny": "bg-blue-100 text-blue-700",
    "I gang": "bg-orange-100 text-orange-700",
    "Afsluttet": "bg-green-100 text-green-700",
  };

  const submissionStatusColor: Record<string, string> = {
    "Indsendt": "bg-blue-100 text-blue-700",
    "Godkendt": "bg-green-100 text-green-700",
    "Afvist": "bg-red-100 text-red-700",
  };

  const rolleColor: Record<string, string> = {
    "Admin": "bg-purple-100 text-purple-700",
    "Leverandør": "bg-blue-100 text-blue-700",
    "Kunde": "bg-green-100 text-green-700",
    "Ingen rolle": "bg-gray-100 text-gray-500",
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-purple-400 transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <p className="text-charcoal/50 font-semibold">Henter data…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] border-b-4 border-orange">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-white">Admin Panel</h1>
            <p className="text-white/50 text-xs mt-0.5">{requests.length} forespørgsler · {submissions.length} profiler · {users.length} brugere</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="text-white/50 hover:text-white text-sm font-semibold transition-colors">Log ud →</button>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-1 pb-0">
          {(["requests", "submissions", "contracts", "applications", "users", "messages"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${tab === t ? "bg-[#f8f6f3] text-charcoal" : "text-white/50 hover:text-white"}`}>
              {t === "requests" ? "Forespørgsler" : t === "submissions" ? "Konsulenter" : t === "contracts" ? "Kontrakter" : t === "applications" ? `Ansøgninger${applications.filter(a => a.status === "Afventer").length > 0 ? ` (${applications.filter(a => a.status === "Afventer").length})` : ""}` : t === "messages" ? "Beskeder" : "Brugere"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {tab === "requests" && (
          <>
            <p className="text-charcoal/50 text-sm mb-4">{requests.length} forespørgsler i alt</p>
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
                  <div className="p-5 cursor-pointer hover:bg-[#faf9f7] transition-colors"
                    onClick={() => setExpandedRequest(expandedRequest === r.id ? null : r.id)}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-charcoal">{r.email}</span>
                          <span className="text-charcoal/30 text-xs">{new Date(r.created_at).toLocaleDateString("da-DK")}</span>
                        </div>
                        <p className="text-sm text-charcoal/70 line-clamp-2 mb-2">{r.description || "Ingen beskrivelse"}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.competencies?.map(c => (
                            <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-charcoal/40 font-semibold">
                          {r.duration && <span>⏱ {r.duration}</span>}
                          {r.work_mode && <span>📍 {r.work_mode}</span>}
                          {r.start_date && <span>📅 {r.start_date}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.status}
                        </span>
                        <select value={r.status} onChange={e => { e.stopPropagation(); updateStatus(r.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          className="text-xs border border-[#e8e5e0] rounded-lg px-2 py-1 text-charcoal bg-[#f8f6f3] focus:outline-none focus:border-orange">
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={e => { e.stopPropagation(); setShowContractForm(showContractForm === r.id ? null : r.id); setContractForm({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" }); }}
                          className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                          + Kontrakt
                        </button>
                        {(notifiedSuppliers[r.id]?.length ?? 0) > 0 ? (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            ✓ Sendt til {notifiedSuppliers[r.id].length} leverandør(er)
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            Ikke videresendt
                          </span>
                        )}
                        <svg className={`w-4 h-4 text-charcoal/30 transition-transform ${expandedRequest === r.id ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {expandedRequest === r.id && (
                    <div className="border-t border-[#ede9e3] bg-[#faf9f7] p-5">
                      <h3 className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">Note til leverandører</h3>
                      <textarea
                        className="w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all resize-none mb-4"
                        rows={3}
                        placeholder="Tilføj ekstra context eller specifikke krav til leverandørerne…"
                        value={adminNotes[r.id] ?? r.admin_note ?? ""}
                        onChange={e => setAdminNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                        onBlur={async () => {
                          await supabase.from("requests").update({ admin_note: adminNotes[r.id] }).eq("id", r.id);
                        }}
                      />
                      <h3 className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">Vælg leverandører</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        {suppliers.map(s => {
                          const alreadyNotified = notifiedSuppliers[r.id]?.includes(s.id);
                          const isSelected = selectedSuppliers[r.id]?.has(s.id);
                          return (
                            <div key={s.id}
                              onClick={() => !alreadyNotified && toggleSupplier(r.id, s.id)}
                              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm font-semibold
                                ${alreadyNotified ? "border-green-200 bg-green-50 text-green-700 cursor-default" :
                                  isSelected ? "border-orange bg-orange/5 text-charcoal" :
                                  "border-[#e8e5e0] bg-white hover:border-orange/50 text-charcoal"}`}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors
                                ${alreadyNotified ? "bg-green-500 border-green-500" :
                                  isSelected ? "bg-orange border-orange" : "border-[#d4cfc8]"}`}>
                                {(alreadyNotified || isSelected) && (
                                  <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                )}
                              </div>
                              <span className="truncate">{s.company_name || s.email}</span>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => notifySuppliers(r.id)}
                        disabled={!selectedSuppliers[r.id]?.size || notifying === r.id}
                        className="bg-orange text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-orange-dark transition-all disabled:opacity-40">
                        {notifying === r.id ? "Sender…" : notified[r.id] ? "Sendt ✓" : `Send til ${selectedSuppliers[r.id]?.size ?? 0} leverandør(er)`}
                      </button>
                    </div>
                  )}

                  {showContractForm === r.id && (
                    <div className="border-t border-[#ede9e3] bg-purple-50 p-5">
                      <h3 className="text-xs font-extrabold tracking-widest uppercase text-purple-600 mb-3">Opret kontrakt</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={lbl}>Konsulentnavn</label>
                          <input className={inp} placeholder="Navn" value={contractForm.consultant_name}
                            onChange={e => setContractForm(f => ({ ...f, consultant_name: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lbl}>Leverandør</label>
                          <select className={inp} value={contractForm.supplier_id}
                            onChange={e => setContractForm(f => ({ ...f, supplier_id: e.target.value }))}>
                            <option value="">Vælg leverandør…</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name || s.email}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={lbl}>Timepris (DKK)</label>
                          <input type="number" className={inp} placeholder="F.eks. 1200" value={contractForm.rate}
                            onChange={e => setContractForm(f => ({ ...f, rate: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lbl}>Varighed</label>
                          <input className={inp} placeholder="F.eks. 6 mdr." value={contractForm.duration}
                            onChange={e => setContractForm(f => ({ ...f, duration: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lbl}>Startdato</label>
                          <input type="date" className={inp} value={contractForm.start_date}
                            onChange={e => setContractForm(f => ({ ...f, start_date: e.target.value }))} />
                        </div>
                      </div>
                      <button onClick={() => createContract(r.id)} disabled={savingContract || !contractForm.consultant_name || !contractForm.supplier_id}
                        className="bg-purple-600 text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-purple-700 transition-all disabled:opacity-40">
                        {savingContract ? "Gemmer…" : "Opret kontrakt"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "submissions" && (
          <>
            <p className="text-charcoal/50 text-sm mb-4">{submissions.length} konsulenter i alt</p>
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                  <p className="text-charcoal/45 text-sm">Ingen indsendte profiler endnu</p>
                </div>
              ) : submissions.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-charcoal">{s.name}</span>
                        <span className="text-charcoal/50 text-xs">{s.title}</span>
                        {s.cv_url && (
                          <a href={s.cv_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                            📄 CV
                          </a>
                        )}
                      </div>
                      {s.requests && (
                        <p className="text-xs text-charcoal/50 mb-2">📋 {s.requests.description?.slice(0, 60)}…</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {s.skills?.map(skill => (
                          <span key={skill} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{skill}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs text-charcoal/40 font-semibold">
                        {s.rate && <span>💰 {s.rate} DKK/t</span>}
                        {s.availability && <span>📅 {s.availability}</span>}
                      </div>
                      {s.bio && <p className="text-xs text-charcoal/60 mt-2 line-clamp-2">{s.bio}</p>}
                      {s.customer_decision === "interview" && (
                        <div className="mt-3 border-t border-[#f0ede8] pt-3">
                          <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">✓ Kunde ønsker interview</p>
                          {s.interview_datetime && (
                            <p className="text-xs text-charcoal/50">Tidspunkt: {new Date(s.interview_datetime).toLocaleString("da-DK")}</p>
                          )}
                          {s.interview_confirmed
                            ? <p className="text-xs text-green-600 font-bold mt-1">✓ Bekræftet af leverandør</p>
                            : <p className="text-xs text-orange font-bold mt-1">⏳ Afventer svar fra leverandør</p>
                          }
                        </div>
                      )}
                      {s.customer_decision === "afvist" && (
                        <p className="mt-2 text-xs text-red-500 font-bold">✗ Afvist af kunde</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${submissionStatusColor[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {s.status}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => updateSubmissionStatus(s.id, "Godkendt")}
                          className="text-xs bg-green-500 text-white font-bold px-3 py-1 rounded-lg hover:bg-green-600 transition-colors">
                          Godkend
                        </button>
                        <button onClick={() => updateSubmissionStatus(s.id, "Afvist")}
                          className="text-xs bg-red-500 text-white font-bold px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">
                          Afvis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "contracts" && (
          <>
            <p className="text-charcoal/50 text-sm mb-4">{contracts.length} kontrakter i alt</p>
            <div className="space-y-3">
              {contracts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                  <p className="text-charcoal/45 text-sm">Ingen kontrakter endnu</p>
                </div>
              ) : contracts.map(c => (
                <ContractCard key={c.id} contract={c} onUpdateScore={updateScore} />
              ))}
            </div>
          </>
        )}

        {tab === "applications" && (
          <>
            <p className="text-charcoal/50 text-sm mb-4">{applications.length} ansøgninger i alt</p>
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                  <p className="text-charcoal/45 text-sm">Ingen ansøgninger endnu</p>
                </div>
              ) : applications.map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-charcoal">{a.company_name}</span>
                        {a.company_type && <span className="text-xs text-charcoal/40 font-semibold">{a.company_type}</span>}
                      </div>
                      <p className="text-xs text-charcoal/60">👤 {a.first_name} {a.last_name}</p>
                      <p className="text-xs text-charcoal/50 mt-0.5">✉️ {a.email}</p>
                      {a.phone && <p className="text-xs text-charcoal/50 mt-0.5">📞 {a.phone}</p>}
                      {a.language && <p className="text-xs text-charcoal/50 mt-0.5">🌐 {a.language}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {a.competencies?.map(c => (
                          <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                      {a.extra_competencies && <p className="text-xs text-charcoal/50 mt-1">+ {a.extra_competencies}</p>}
                      <p className="text-xs text-charcoal/30 mt-2">{new Date(a.created_at).toLocaleDateString("da-DK")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {a.status === "Afventer" ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleApplication(a, "accepted")}
                            disabled={appProcessing === a.id}
                            className="text-xs bg-green-500 text-white font-bold px-4 py-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50">
                            {appProcessing === a.id ? "…" : "Godkend"}
                          </button>
                          <button onClick={() => handleApplication(a, "rejected")}
                            disabled={appProcessing === a.id}
                            className="text-xs bg-red-500 text-white font-bold px-4 py-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50">
                            Afslå
                          </button>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.status === "Godkendt" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {a.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-charcoal/50 text-sm">{users.length} brugere i alt</p>
              <button onClick={() => setShowCreateUser(!showCreateUser)}
                className="bg-orange text-white font-bold rounded-full px-5 py-2 text-sm hover:bg-orange-dark transition-all">
                + Opret bruger
              </button>
            </div>

            {showCreateUser && (
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-6 mb-4">
                <h3 className="font-bold text-charcoal mb-4">Opret ny bruger</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Email</label>
                    <input className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      placeholder="email@firma.dk" value={newUser.email}
                      onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Password</label>
                    <input type="password" className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      placeholder="Midlertidigt password" value={newUser.password}
                      onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Rolle</label>
                    <select className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}>
                      <option value="customer">Kunde</option>
                      <option value="supplier">Leverandør</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Firmanavn</label>
                    <input className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      placeholder="Firma A/S" value={newUser.company_name}
                      onChange={e => setNewUser(u => ({ ...u, company_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Kontaktperson</label>
                    <input className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      placeholder="Navn Efternavn" value={newUser.contact_name}
                      onChange={e => setNewUser(u => ({ ...u, contact_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Telefon</label>
                    <input className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                      placeholder="+45 12 34 56 78" value={newUser.phone}
                      onChange={e => setNewUser(u => ({ ...u, phone: e.target.value }))} />
                  </div>
                </div>
                {createUserError && <p className="text-red-500 text-xs font-bold mb-3">{createUserError}</p>}
                <div className="flex gap-2">
                  <button onClick={handleCreateUser} disabled={creatingUser || !newUser.email || !newUser.password}
                    className="bg-orange text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-orange-dark transition-all disabled:opacity-40">
                    {creatingUser ? "Opretter…" : createUserSuccess ? "Oprettet ✓" : "Opret bruger"}
                  </button>
                  <button onClick={() => setShowCreateUser(false)}
                    className="text-charcoal/50 font-bold rounded-full px-6 py-2.5 text-sm hover:text-charcoal transition-all">
                    Annuller
                  </button>
                </div>
              </div>
            )}

    <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-charcoal">{u.company_name || u.supplier_company || u.email}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rolleColor[u.rolle] ?? "bg-gray-100 text-gray-500"}`}>{u.rolle}</span>
                      </div>
                      {u.contact_name && <p className="text-xs text-charcoal/60">👤 {u.contact_name}</p>}
                      <p className="text-xs text-charcoal/50 mt-0.5">✉️ {u.email}</p>
                      {u.phone && <p className="text-xs text-charcoal/50 mt-0.5">📞 {u.phone}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xs text-charcoal/30">{new Date(u.created_at).toLocaleDateString("da-DK")}</p>
                      <button onClick={() => handleAdminResetPassword(u.email)}
                        className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                        Reset password
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6" style={{ height: "calc(100vh - 220px)" }}>
            {/* Bruger-liste */}
            <div className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-[#f0ede8] text-xs font-extrabold tracking-widest uppercase text-charcoal/40">Samtaler</div>
              <div className="flex-1 overflow-y-auto">
                {chatUsers.length === 0 && (
                  <p className="text-charcoal/30 text-sm text-center py-8">Ingen beskeder endnu</p>
                )}
                {chatUsers.map(u => (
                  <div key={u.sender_id}
                    onClick={() => { setSelectedChatUser(u); loadChat(u.sender_id); }}
                    className={`px-4 py-3.5 cursor-pointer border-b border-[#f8f6f3] transition-colors flex items-center gap-3 ${selectedChatUser?.sender_id === u.sender_id ? "bg-orange-light border-l-2 border-l-orange" : "hover:bg-[#fafaf8]"}`}>
                    <div className="w-8 h-8 rounded-full bg-[#2d2c2c] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                      {u.sender_name?.slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-charcoal truncate">{u.sender_name}</div>
                      <div className="text-xs text-charcoal/40">{u.sender_type === "customer" ? "Kunde" : "Leverandør"}</div>
                    </div>
                    {u.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-orange text-white text-[10px] font-black flex items-center justify-center">{u.unread}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat vindue */}
            {selectedChatUser ? (
              <div className="bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2d2c2c] flex items-center justify-center text-sm font-black text-white">
                    {selectedChatUser.sender_name?.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-charcoal text-sm">{selectedChatUser.sender_name}</div>
                    <div className="text-xs text-charcoal/40">{selectedChatUser.sender_type === "customer" ? "Kunde" : "Leverandør"}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map(msg => {
                    const isAdmin = msg.sender_type === "admin";
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${isAdmin ? "bg-orange text-white" : "bg-[#2d2c2c] text-white"}`}>
                          {isAdmin ? "FI" : msg.sender_name?.slice(0,2).toUpperCase()}
                        </div>
                        <div className={`max-w-[70%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                          <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAdmin ? "bg-orange text-white rounded-tr-sm" : "bg-[#f8f6f3] text-charcoal rounded-tl-sm"}`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-charcoal/35 px-1">
                            {new Date(msg.created_at).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>
                <div className="px-4 py-4 border-t border-[#f0ede8] flex gap-3">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAdminMessage(); }}}
                    placeholder="Skriv svar til bruger…"
                    className="flex-1 border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange transition-all bg-[#f8f6f3]"
                  />
                  <button onClick={sendAdminMessage} disabled={!chatInput.trim()}
                    className="bg-orange hover:bg-orange-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors disabled:opacity-40">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#ede9e3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-charcoal/40 text-sm font-semibold">Vælg en samtale til venstre</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
