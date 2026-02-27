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
};

type Submission = {
  id: string;
  request_id: string;
  name: string;
  title: string;
  status: string;
  customer_decision: string | null;
  interview_datetime: string | null;
  interview_confirmed: boolean;
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

type Tab = "requests" | "submissions" | "messages" | "profile";

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
  const [interviewDates, setInterviewDates] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [tab, setTab] = useState<Tab>("requests");
  const [profile, setProfile] = useState<Profile>({ company_name: "", first_name: "", last_name: "", email: "", phone: "", company_type: "", competencies: [], extra_competencies: "", language: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        .select("*")
        .eq("supplier_id", user.id);

      setRequests(reqData ?? []);
      setSubmissions(subData ?? []);
      setLoading(false);

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
      await supabase.storage.from("cvs").upload(fileName, cvFile);
      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(fileName);
      cv_url = urlData.publicUrl;
    };

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

    // Advis admin
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
      .select("*")
      .eq("supplier_id", supplierId);
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

  const confirmInterview = async (submissionId: string, newDatetime?: string) => {
    setConfirming(submissionId);
    const updates: Record<string, unknown> = { interview_confirmed: true };
    if (newDatetime) updates.interview_datetime = new Date(newDatetime).toISOString();
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, interview_confirmed: true, interview_datetime: newDatetime ?? s.interview_datetime } : s));
    setConfirming(null);
  };

  const statusColor: Record<string, string> = {
    "Indsendt": "bg-blue-100 text-blue-700",
    "Accepteret": "bg-green-100 text-green-700",
    "Afvist": "bg-red-100 text-red-700",
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <p className="text-charcoal/50 font-semibold">Henter data…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] border-b-4 border-orange">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-white">Leverandørportal</h1>
            <p className="text-white/50 text-xs mt-0.5">{profile.company_name || profile.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="text-white/50 hover:text-white text-sm font-semibold transition-colors">
            Log ud →
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-0">
          {(["requests", "submissions", "messages", "profile"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${tab === t ? "bg-[#f8f6f3] text-charcoal" : "text-white/50 hover:text-white"}`}>
              {t === "requests" ? "Forespørgsler" : t === "submissions" ? "Mine profiler" : t === "messages" ? "Beskeder" : "Min profil"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "requests" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-lg text-charcoal mb-4">Aktive forespørgsler</h2>
              {requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                  <p className="text-charcoal/45 text-sm">Ingen aktive forespørgsler</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map(r => (
                    <div key={r.id}
                      onClick={() => { setSelectedRequest(r); setSubmitted(false); }}
                      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${selectedRequest?.id === r.id ? "border-orange shadow-md" : "border-[#ede9e3] hover:border-orange/50"}`}>
                      <p className="text-sm font-semibold text-charcoal line-clamp-2 mb-2">{r.description || "Ingen beskrivelse"}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {r.competencies?.map(c => (
                          <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-xs text-charcoal/40 font-semibold">
                        {r.duration && <span>⏱ {r.duration}</span>}
                        {r.work_mode && <span>📍 {r.work_mode}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-charcoal/50 font-semibold">Forespørgsel valgt</p>
                      <button type="button" onClick={() => setSelectedRequest(null)} className="text-charcoal/40 hover:text-charcoal text-xs">× Annuller</button>
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
                      <div className="col-span-2">
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
                    <div className="col-span-2">
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
                      <label className={lbl}>Tilgængelighed</label>
                      <input required className={inp} placeholder="F.eks. 1. marts 2026" value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} />
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
                  <p className="text-charcoal/45 text-sm">Klik på en forespørgsel for at indsende en konsulentprofil</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "submissions" && (
          <>
            <h2 className="font-bold text-lg text-charcoal mb-4">Mine indsendte profiler</h2>
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                  <p className="text-charcoal/45 text-sm">Du har ikke indsendt nogen profiler endnu</p>
                </div>
              ) : submissions.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-[#ede9e3] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-charcoal">{s.name}</p>
                      <p className="text-xs text-charcoal/50">{s.title}</p>
                      {s.customer_decision === "interview" && (
                        <div className="mt-3 border-t border-[#f0ede8] pt-3">
                          <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-2">
                            ✓ Kunde ønsker interview
                            {s.interview_datetime && ` — ${new Date(s.interview_datetime).toLocaleString("da-DK")}`}
                          </p>
                          {s.interview_confirmed ? (
                            <p className="text-xs text-green-600 font-bold">✓ Interview bekræftet</p>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex gap-2 items-end flex-wrap">
                                <div>
                                  <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Bekræft eller foreslå nyt tidspunkt</label>
                                  <input type="datetime-local"
                                    className="rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                                    value={interviewDates[s.id] ?? ""}
                                    onChange={e => setInterviewDates(prev => ({ ...prev, [s.id]: e.target.value }))} />
                                </div>
                                <button
                                  onClick={() => confirmInterview(s.id, interviewDates[s.id])}
                                  disabled={confirming === s.id}
                                  className="bg-green-500 text-white font-bold rounded-full px-4 py-2 text-xs hover:bg-green-600 transition-all disabled:opacity-50">
                                  {confirming === s.id ? "Bekræfter…" : "Bekræft interview"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {s.customer_decision === "afvist" && (
                        <p className="mt-2 text-xs text-red-500 font-bold">✗ Afvist af kunde</p>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
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
                <label className={lbl}>Email</label>
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
              <div className="border-t border-[#f0ede8] pt-4 mt-2">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">Skift password</p>
                <ChangePassword />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
