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

export default function BrugerePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "customer", company_name: "", contact_name: "", phone: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [search, setSearch] = useState("");

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
  };

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
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-orange text-white font-bold rounded-full px-5 py-2.5 text-sm hover:bg-orange-dark transition-all"
        >
          + Opret bruger
        </button>
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

      <div className="space-y-2">
        {filtered.map(u => (
          <div key={u.id} className="bg-white rounded-2xl border border-[#ede9e3] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-charcoal">{u.company_name || u.supplier_company || u.email}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rolleColor[u.rolle] ?? "bg-gray-100 text-gray-500"}`}>{u.rolle}</span>
                </div>
                {u.contact_name && <p className="text-xs text-charcoal/60">👤 {u.contact_name}</p>}
                <p className="text-xs text-charcoal/50 mt-0.5">✉️ {u.email}</p>
                {u.phone && <p className="text-xs text-charcoal/50 mt-0.5">📞 {u.phone}</p>}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <p className="text-[10px] text-charcoal/30">{new Date(u.created_at).toLocaleDateString("da-DK")}</p>
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
