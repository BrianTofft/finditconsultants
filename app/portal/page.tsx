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
};

type Request = {
  id: string;
  created_at: string;
  description: string;
  competencies: string[];
  status: string;
  email: string;
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

type PortalSidebarProps = {
  tab: Tab;
  setTab: (t: Tab) => void;
  companyLabel: string;
  onLogout: () => void;
};

function PortalSidebar({ tab, setTab, companyLabel, onLogout }: PortalSidebarProps) {
  const navItems: { tab: Tab; label: string; icon: string }[] = [
    { tab: "requests", label: "Forespørgsler", icon: "📋" },
    { tab: "messages", label: "Beskeder",      icon: "💬" },
    { tab: "profile",  label: "Min profil",    icon: "⚙️" },
  ];

  return (
    <aside className="w-56 bg-[#2d2c2c] flex flex-col fixed h-full z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">FI</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">FindITconsultants</p>
            <p className="text-white/40 text-[10px] font-semibold tracking-wide uppercase">Kundeportal</p>
          </div>
        </div>
        {companyLabel && (
          <p className="text-white/30 text-[11px] font-semibold mt-2 truncate">{companyLabel}</p>
        )}
      </div>
      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.tab}
            onClick={() => setTab(item.tab)}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all mb-0.5 text-left ${
              tab === item.tab
                ? "bg-orange text-white shadow-sm"
                : "text-white/55 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full text-left text-white/40 hover:text-white/80 text-xs font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
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

export default function PortalPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("requests");
  const [userId, setUserId] = useState("");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ company_name: "", contact_name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interviewDates, setInterviewDates] = useState<Record<string, string>>({});
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

        // Find kollegaer fra samme virksomhed
        if (customerData.company_name) {
          const { data: teamData } = await supabase
            .from("customers")
            .select("id, email, contact_name, phone")
            .eq("company_name", customerData.company_name)
            .neq("id", user.id);

          if (teamData && teamData.length > 0) {
            setTeamMembers(teamData);
            // Hent deres forespørgsler
            const { data: teamReqAll } = await supabase
              .from("requests")
              .select("*")
              .in("email", teamData.map((m: TeamMember) => m.email))
              .order("created_at", { ascending: false });
            const { data: teamSubData } = await supabase
              .from("consultant_submissions")
              .select("*")
              .eq("status", "Valgt")
              .in("request_id", (teamReqAll ?? []).map(r => r.id));
            const teamMerged = (teamReqAll ?? []).map(r => ({
              ...r,
              submissions: (teamSubData ?? []).filter(s => s.request_id === r.id),
            }));
            setTeamRequests(teamMerged);
          }
        }
      } else {
        setProfile(p => ({ ...p, email: user.email ?? "" }));
      }

      const { data: reqDataAll } = await supabase
        .from("requests")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      const { data: subData } = await supabase
        .from("consultant_submissions")
        .select("*")
        .eq("status", "Valgt")
        .in("request_id", (reqDataAll ?? []).map(r => r.id));

      const merged = (reqDataAll ?? []).map(r => ({
        ...r,
        submissions: (subData ?? []).filter(s => s.request_id === r.id),
      }));

      setRequests(merged);
      setLoading(false);

      if (!customerData?.company_name) setTab("profile");
    };
    init();
  }, [router]);

  const handleDecision = async (submissionId: string, decision: "interview" | "afvist") => {
    setDeciding(submissionId);
    const updates: Record<string, unknown> = { customer_decision: decision };
    if (decision === "interview" && interviewDates[submissionId]) {
      updates.interview_datetime = new Date(interviewDates[submissionId]).toISOString();
    }
    await supabase.from("consultant_submissions").update(updates).eq("id", submissionId);

    // Advis admin
    await fetch("/api/notify-admin-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision,
        submission_id: submissionId,
        interview_datetime: interviewDates[submissionId] ?? null,
        customer_name: profile.company_name || profile.email,
      }),
    });

    setRequests(prev => prev.map(r => ({
      ...r,
      submissions: r.submissions?.map(s =>
        s.id === submissionId ? { ...s, customer_decision: decision, interview_datetime: interviewDates[submissionId] ?? null } : s
      ),
    })));
    setDeciding(null);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await supabase.from("customers").upsert({
      id: userId,
      email: profile.email,
      company_name: profile.company_name,
      contact_name: profile.contact_name,
      phone: profile.phone,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    supabase.auth.signOut().then(() => { window.location.href = "https://finditconsultants.com"; });
  };

  const statusColor: Record<string, string> = {
    "Ny": "bg-blue-100 text-blue-700",
    "I gang": "bg-orange-100 text-orange-700",
    "Afsluttet": "bg-green-100 text-green-700",
  };

  const decisionColor: Record<string, string> = {
    "interview": "bg-green-100 text-green-700",
    "afvist": "bg-red-100 text-red-700",
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <p className="text-charcoal/50 font-semibold">Henter data…</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f6f3] overflow-hidden">
      <PortalSidebar
        tab={tab}
        setTab={setTab}
        companyLabel={profile.company_name || profile.email}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-56 overflow-y-auto p-8">
        {tab === "requests" && (
          <>
            {/* Statistik */}
            {requests.length > 0 && (() => {
              const allSubs = requests.flatMap(r => r.submissions ?? []);
              const stats = [
                { label: "Forespørgsler", value: requests.length, icon: "📋" },
                { label: "Modtagne kandidater", value: allSubs.length, icon: "👤" },
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
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
                <p className="text-charcoal/45 text-sm">Du har ingen forespørgsler endnu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
                    <div className="p-5 cursor-pointer hover:bg-[#faf9f7] transition-colors"
                      onClick={() => setExpandedRequest(expandedRequest === r.id ? null : r.id)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-charcoal font-semibold line-clamp-2">{r.description || "Ingen beskrivelse"}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {r.competencies?.map(c => (
                              <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                            ))}
                          </div>
                          <p className="text-charcoal/40 text-xs mt-2">{new Date(r.created_at).toLocaleDateString("da-DK")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(r.submissions?.length ?? 0) > 0 && (
                            <span className="bg-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {r.submissions?.length} kandidat{(r.submissions?.length ?? 0) > 1 ? "er" : ""}
                            </span>
                          )}
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {r.status}
                          </span>
                          <svg className={`w-4 h-4 text-charcoal/30 transition-transform ${expandedRequest === r.id ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {expandedRequest === r.id && (
                      <div className="border-t border-[#ede9e3] bg-[#faf9f7] p-5">
                        {(r.submissions?.length ?? 0) === 0 ? (
                          <p className="text-charcoal/45 text-sm text-center py-4">Ingen godkendte kandidater endnu — vi arbejder på det!</p>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40">Kandidater</h3>
                            {r.submissions?.map(s => (
                              <div key={s.id} className="bg-white rounded-xl border border-[#ede9e3] p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                      <p className="font-bold text-sm text-charcoal">{s.name}</p>
                                      {s.cv_url && (
                                        <a href={s.cv_url} target="_blank" rel="noopener noreferrer"
                                          className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                                          📄 CV
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-xs text-charcoal/50 mb-2">{s.title}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {s.skills?.map(skill => (
                                        <span key={skill} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{skill}</span>
                                      ))}
                                    </div>
                                    {s.bio && <p className="text-xs text-charcoal/60 line-clamp-3">{s.bio}</p>}
                                  </div>
                                  <div className="text-right shrink-0">
                                    {s.rate && <p className="font-bold text-sm text-orange">{s.rate} DKK/t</p>}
                                    {s.experience_years && <p className="text-xs text-charcoal/40">{s.experience_years} års erfaring</p>}
                                    {s.availability && <p className="text-xs text-charcoal/40 mt-1">📅 {new Date(s.availability).toLocaleDateString("da-DK")}</p>}
                                  </div>
                                </div>

                                {s.customer_decision ? (
                                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${decisionColor[s.customer_decision] ?? "bg-gray-100 text-gray-600"}`}>
                                    {s.customer_decision === "interview" ? "✓ Indkaldt til interview" : "✗ Afvist"}
                                    {s.interview_datetime && (
                                      <span className="font-normal">— {new Date(s.interview_datetime).toLocaleString("da-DK")}</span>
                                    )}
                                    {s.interview_confirmed && <span className="ml-auto">✓ Bekræftet</span>}
                                  </div>
                                ) : (
                                  <div className="border-t border-[#f0ede8] pt-3 mt-2">
                                    <div className="flex flex-wrap gap-2 items-end">
                                      <div className="flex-1 min-w-[180px]">
                                        <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Interview dato/tid (valgfrit)</label>
                                        <input type="datetime-local" className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
                                          value={interviewDates[s.id] ?? ""}
                                          onChange={e => setInterviewDates(prev => ({ ...prev, [s.id]: e.target.value }))} />
                                      </div>
                                      <button
                                        onClick={() => handleDecision(s.id, "interview")}
                                        disabled={deciding === s.id}
                                        className="bg-green-500 text-white font-bold rounded-full px-4 py-2 text-xs hover:bg-green-600 transition-all disabled:opacity-50">
                                        Indkald til interview
                                      </button>
                                      <button
                                        onClick={() => handleDecision(s.id, "afvist")}
                                        disabled={deciding === s.id}
                                        className="bg-red-500 text-white font-bold rounded-full px-4 py-2 text-xs hover:bg-red-600 transition-all disabled:opacity-50">
                                        Afvis
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Team-forespørgsler */}
            {teamRequests.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-lg text-charcoal">Forespørgsler fra {profile.company_name}</h2>
                  <span className="text-xs bg-charcoal/10 text-charcoal/50 font-bold px-2 py-0.5 rounded-full">{teamRequests.length} fra kollegaer</span>
                </div>
                <div className="space-y-3">
                  {teamRequests.map(r => {
                    const owner = teamMembers.find(m => m.email === r.email);
                    return (
                      <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] p-4 opacity-85">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-charcoal font-semibold line-clamp-2">{r.description || "Ingen beskrivelse"}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {r.competencies?.map(c => (
                                <span key={c} className="bg-charcoal/10 text-charcoal/60 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                              ))}
                            </div>
                            <p className="text-charcoal/35 text-xs mt-2">
                              👤 {owner?.contact_name || owner?.email || "Kollega"} · {new Date(r.created_at).toLocaleDateString("da-DK")}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
       )}

        {tab === "messages" && (
          <div>
            <h2 className="font-bold text-lg text-charcoal mb-4">Beskeder</h2>
            <ChatWindow
              userId={userId}
              userType="customer"
              userName={profile.contact_name || profile.company_name || profile.email}
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
                  <input className={inp} placeholder="Fornavn" value={(profile.contact_name ?? "").split(" ")[0] ?? ""} onChange={e => {
                    const parts = (profile.contact_name ?? "").split(" ");
                    parts[0] = e.target.value;
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
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-3">
                    👥 Kollegaer fra {profile.company_name}
                  </p>
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