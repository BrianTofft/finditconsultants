"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "../types";

const rolleColor: Record<string, string> = {
  "Admin": "bg-purple-100 text-purple-700",
  "Leverandør": "bg-blue-100 text-blue-700",
  "Kunde": "bg-green-100 text-green-700",
  "Ingen rolle": "bg-gray-100 text-gray-500",
};

const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all";
const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";
const roReadonly = "w-full rounded-xl border border-[#e8e5e0] bg-[#f0ede8] px-4 py-2.5 text-sm text-charcoal/60";

type EditData = {
  contact_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  company_type: string;
  company_name: string;
};

export default function BrugerePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "customer", company_name: "", contact_name: "", phone: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [groupByCompany, setGroupByCompany] = useState(false);

  // Edit state — kun én bruger kan være expanded ad gangen
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditData>({ contact_name: "", first_name: "", last_name: "", phone: "", company_type: "", company_name: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savedEdit, setSavedEdit] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("user_roles").select("*");
      setUsers(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleCreateUser = async () => {
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (data.error) {
      setCreateError(data.error);
    } else {
      setCreateSuccess(true);
      setNewUser({ email: "", password: "", role: "customer", company_name: "", contact_name: "", phone: "" });
      const { data: userData } = await supabase.from("user_roles").select("*");
      setUsers(userData ?? []);
      setTimeout(() => { setCreateSuccess(false); setShowCreateForm(false); }, 2000);
    }
    setCreating(false);
  };

  const handleResetPassword = async (email: string) => {
    await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    alert(`Reset email sendt til ${email}`);
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Er du sikker på at du vil slette ${email}?`)) return;
    await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setUsers(prev => prev.filter(u => u.id !== id));
    if (expandedUser === id) setExpandedUser(null);
  };

  const handleExpand = async (u: User) => {
    if (expandedUser === u.id) { setExpandedUser(null); return; }
    setExpandedUser(u.id);
    setSavedEdit(false);
    setLoadingEdit(true);

    if (u.rolle === "Kunde") {
      const { data } = await supabase.from("customers").select("*").eq("id", u.id).single();
      setEditData({
        contact_name: data?.contact_name ?? u.contact_name ?? "",
        first_name: "",
        last_name: "",
        phone: data?.phone ?? u.phone ?? "",
        company_type: "",
        company_name: data?.company_name ?? u.company_name ?? "",
      });
    } else if (u.rolle === "Leverandør") {
      const { data } = await supabase.from("suppliers").select("*").eq("id", u.id).single();
      setEditData({
        contact_name: "",
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        phone: data?.phone ?? u.phone ?? "",
        company_type: data?.company_type ?? "",
        company_name: data?.company_name ?? u.supplier_company ?? u.company_name ?? "",
      });
    } else if (u.rolle === "Admin") {
      const { data } = await supabase.from("admins").select("*").eq("id", u.id).single();
      setEditData({
        contact_name: "",
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        phone: data?.phone ?? u.phone ?? "",
        company_type: "",
        company_name: "",
      });
    } else {
      setEditData({ contact_name: "", first_name: "", last_name: "", phone: u.phone ?? "", company_type: "", company_name: "" });
    }

    setLoadingEdit(false);
  };

  const handleSaveEdit = async (u: User) => {
    setSavingEdit(true);
    if (u.rolle === "Kunde") {
      await supabase.from("customers").update({
        contact_name: editData.contact_name,
        phone: editData.phone,
        company_name: editData.company_name,
      }).eq("id", u.id);
    } else if (u.rolle === "Leverandør") {
      await supabase.from("suppliers").update({
        first_name: editData.first_name,
        last_name: editData.last_name,
        contact_name: `${editData.first_name} ${editData.last_name}`.trim(),
        phone: editData.phone,
        company_type: editData.company_type,
        company_name: editData.company_name,
      }).eq("id", u.id);
    } else if (u.rolle === "Admin") {
      await supabase.from("admins").update({
        first_name: editData.first_name,
        last_name: editData.last_name,
        phone: editData.phone,
      }).eq("id", u.id);
    }
    setSavingEdit(false);
    setSavedEdit(true);
    setTimeout(() => setSavedEdit(false), 2500);
    // Genindlæs brugerlisten
    const { data: userData } = await supabase.from("user_roles").select("*");
    setUsers(userData ?? []);
  };

  const field = (id: string, label: string, value: string, onChange: (v: string) => void, placeholder = "") => (
    <div>
      <label htmlFor={id} className={lbl}>{label}</label>
      <input id={id} className={inp} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </div>
  );

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.email?.toLowerCase().includes(q)
      || u.company_name?.toLowerCase().includes(q)
      || u.contact_name?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-40 mb-6" />
      {[1,2,3,4].map(i => <div key={i} className="h-20 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-bold text-2xl text-charcoal mb-1">Brugere</h1>
          <p className="text-charcoal/45 text-sm">{users.length} bruger{users.length !== 1 ? "e" : ""} i alt</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGroupByCompany(g => !g)}
            className={`font-bold rounded-full px-5 py-2.5 text-sm transition-all border ${groupByCompany ? "bg-charcoal text-white border-charcoal" : "bg-white text-charcoal/60 border-[#e8e5e0] hover:border-charcoal/30"}`}
          >
            🏢 Grupér pr. firma
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-orange text-white font-bold rounded-full px-5 py-2.5 text-sm hover:bg-orange-dark transition-all"
          >
            + Opret bruger
          </button>
        </div>
      </div>

      {/* Create user form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-6 mb-6">
          <h3 className="font-bold text-charcoal mb-4">Opret ny bruger</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className={lbl}>Email</label><input className={inp} type="email" placeholder="email@firma.dk" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} /></div>
            <div><label className={lbl}>Password</label><input className={inp} type="password" placeholder="Midlertidigt password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} /></div>
            <div>
              <label className={lbl}>Rolle</label>
              <select className={inp} value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}>
                <option value="customer">Kunde</option>
                <option value="supplier">Leverandør</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div><label className={lbl}>Firmanavn</label><input className={inp} placeholder="Firma A/S" value={newUser.company_name} onChange={e => setNewUser(u => ({ ...u, company_name: e.target.value }))} /></div>
            <div><label className={lbl}>Kontaktperson</label><input className={inp} placeholder="Navn Efternavn" value={newUser.contact_name} onChange={e => setNewUser(u => ({ ...u, contact_name: e.target.value }))} /></div>
            <div><label className={lbl}>Telefon</label><input className={inp} placeholder="+45 12 34 56 78" value={newUser.phone} onChange={e => setNewUser(u => ({ ...u, phone: e.target.value }))} /></div>
          </div>
          {createError && <p className="text-red-500 text-xs font-bold mb-3">{createError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleCreateUser}
              disabled={creating || !newUser.email || !newUser.password}
              className="bg-orange text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-orange-dark transition-all disabled:opacity-40"
            >
              {creating ? "Opretter…" : createSuccess ? "Oprettet ✓" : "Opret bruger"}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-charcoal/50 font-bold rounded-full px-6 py-2.5 text-sm hover:text-charcoal transition-colors"
            >
              Annuller
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
          placeholder="Søg på email, firma eller kontaktperson…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Firma-gruperet visning */}
      {groupByCompany && (() => {
        const groups: Record<string, typeof filtered> = {};
        for (const u of filtered) {
          const key = (u.rolle === "Leverandør" ? u.supplier_company : u.company_name) || u.email;
          if (!groups[key]) groups[key] = [];
          groups[key].push(u);
        }
        const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "da"));
        return (
          <div className="space-y-4">
            {sorted.map(([company, members]) => (
              <div key={company} className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
                <div className="px-5 py-3 bg-[#f8f6f3] border-b border-[#ede9e3] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal">🏢 {company}</span>
                    {members.length > 1 && (
                      <span className="text-xs bg-orange/15 text-orange font-bold px-2 py-0.5 rounded-full">{members.length} brugere</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[...new Set(members.map(m => m.rolle))].map(r => (
                      <span key={r} className={`text-xs font-bold px-2 py-0.5 rounded-full ${rolleColor[r] ?? "bg-gray-100 text-gray-500"}`}>{r}</span>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-[#f5f2ee]">
                  {members.map(u => (
                    <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#faf9f7] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-charcoal">{u.contact_name || u.email}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rolleColor[u.rolle] ?? "bg-gray-100 text-gray-500"}`}>{u.rolle}</span>
                        </div>
                        <p className="text-xs text-charcoal/45 mt-0.5">{u.email}{u.phone ? ` · ${u.phone}` : ""}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleExpand(u)} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${expandedUser === u.id ? "bg-orange text-white" : "bg-orange/10 text-orange hover:bg-orange/20"}`}>
                          {expandedUser === u.id ? "Luk ↑" : "Rediger ✎"}
                        </button>
                        <button onClick={() => handleResetPassword(u.email)} className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">Reset pw</button>
                        <button onClick={() => handleDeleteUser(u.id, u.email)} className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full hover:bg-red-100 transition-colors">Slet</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Flad liste */}
      <div className={`space-y-2 ${groupByCompany ? "hidden" : ""}`}>
        {filtered.map(u => (
          <div key={u.id} className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
            {/* Bruger-række */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-sm text-charcoal">
                      {u.rolle === "Leverandør"
                        ? (u.supplier_company || u.company_name || u.email)
                        : (u.company_name || u.email)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rolleColor[u.rolle] ?? "bg-gray-100 text-gray-500"}`}>{u.rolle}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                    {u.contact_name && (
                      <p className="text-xs text-charcoal/60">
                        <span className="font-semibold text-charcoal/40 mr-1">Kontakt</span>{u.contact_name}
                      </p>
                    )}
                    <p className="text-xs text-charcoal/55">
                      <span className="font-semibold text-charcoal/40 mr-1">Email</span>{u.email}
                    </p>
                    {u.phone && (
                      <p className="text-xs text-charcoal/55">
                        <span className="font-semibold text-charcoal/40 mr-1">Tlf.</span>{u.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <p className="text-[10px] text-charcoal/30">{new Date(u.created_at).toLocaleDateString("da-DK")}</p>
                  <button
                    onClick={() => handleExpand(u)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      expandedUser === u.id
                        ? "bg-orange text-white"
                        : "bg-orange/10 text-orange hover:bg-orange/20"
                    }`}
                  >
                    {expandedUser === u.id ? "Luk ↑" : "Rediger ✎"}
                  </button>
                  <button
                    onClick={() => handleResetPassword(u.email)}
                    className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Reset pw
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id, u.email)}
                    className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    Slet
                  </button>
                </div>
              </div>
            </div>

            {/* Udvidet redigeringssektion */}
            {expandedUser === u.id && (
              <div className="border-t border-[#f0ede8] bg-[#faf9f7] px-5 py-4">
                {loadingEdit ? (
                  <p className="text-charcoal/40 text-sm animate-pulse">Henter profil…</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-3">
                      Rediger profil — {u.rolle}
                    </p>

                    {/* Email — altid read-only */}
                    <div>
                      <label className={lbl}>Email (kan ikke ændres)</label>
                      <div className={roReadonly}>{u.email}</div>
                    </div>

                    {/* Kunde-felter */}
                    {u.rolle === "Kunde" && (
                      <>
                        {field(`company-${u.id}`, "Firmanavn", editData.company_name,
                          v => setEditData(d => ({ ...d, company_name: v })), "Firma A/S")}
                        <div className="grid grid-cols-2 gap-3">
                          {field(`contact-${u.id}`, "Kontaktperson", editData.contact_name,
                            v => setEditData(d => ({ ...d, contact_name: v })), "Navn Efternavn")}
                          {field(`phone-${u.id}`, "Telefon", editData.phone,
                            v => setEditData(d => ({ ...d, phone: v })), "+45 12 34 56 78")}
                        </div>
                      </>
                    )}

                    {/* Leverandør-felter */}
                    {u.rolle === "Leverandør" && (
                      <>
                        {field(`company-${u.id}`, "Virksomhed", editData.company_name,
                          v => setEditData(d => ({ ...d, company_name: v })), "Firma A/S")}
                        <div className="grid grid-cols-2 gap-3">
                          {field(`fname-${u.id}`, "Fornavn", editData.first_name,
                            v => setEditData(d => ({ ...d, first_name: v })), "Fornavn")}
                          {field(`lname-${u.id}`, "Efternavn", editData.last_name,
                            v => setEditData(d => ({ ...d, last_name: v })), "Efternavn")}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {field(`phone-${u.id}`, "Telefon", editData.phone,
                            v => setEditData(d => ({ ...d, phone: v })), "+45 12 34 56 78")}
                          <div>
                            <label htmlFor={`ctype-${u.id}`} className={lbl}>Virksomhedstype</label>
                            <select id={`ctype-${u.id}`} className={inp} value={editData.company_type} onChange={e => setEditData(d => ({ ...d, company_type: e.target.value }))}>
                              <option value="">Vælg…</option>
                              <option>Konsulenthus (egne konsulenter)</option>
                              <option>Konsulentformidler (freelancers)</option>
                              <option>Selvstændig (freelancer)</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Admin-felter */}
                    {u.rolle === "Admin" && (
                      <div className="grid grid-cols-2 gap-3">
                        {field(`fname-${u.id}`, "Fornavn", editData.first_name,
                          v => setEditData(d => ({ ...d, first_name: v })), "Fornavn")}
                        {field(`lname-${u.id}`, "Efternavn", editData.last_name,
                          v => setEditData(d => ({ ...d, last_name: v })), "Efternavn")}
                        {field(`phone-${u.id}`, "Telefon", editData.phone,
                          v => setEditData(d => ({ ...d, phone: v })), "+45 12 34 56 78")}
                      </div>
                    )}

                    {u.rolle === "Ingen rolle" && (
                      <p className="text-charcoal/40 text-sm italic">Brugeren har ingen rolle og kan ikke redigeres.</p>
                    )}

                    {u.rolle !== "Ingen rolle" && (
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => handleSaveEdit(u)}
                          disabled={savingEdit}
                          className="bg-orange text-white font-bold rounded-full px-6 py-2 text-sm hover:bg-orange-dark transition-all disabled:opacity-50"
                        >
                          {savingEdit ? "Gemmer…" : "Gem ændringer"}
                        </button>
                        {savedEdit && <span className="text-green-600 text-sm font-bold">✓ Gemt</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#ede9e3] p-8 text-center">
            <p className="text-charcoal/40 text-sm">{search ? `Ingen brugere matcher "${search}"` : "Ingen brugere endnu"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

