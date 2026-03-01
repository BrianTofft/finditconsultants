"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AdminProfile = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) { setMsg({ type: "err", text: "Password skal være mindst 8 tegn" }); return; }
    if (next !== confirm) { setMsg({ type: "err", text: "De to passwords matcher ikke" }); return; }
    setSaving(true);
    // Verify current password by re-signing in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setMsg({ type: "err", text: "Bruger ikke fundet" }); setSaving(false); return; }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (signInError) { setMsg({ type: "err", text: "Nuværende password er forkert" }); setSaving(false); return; }
    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      setMsg({ type: "err", text: error.message });
    } else {
      setMsg({ type: "ok", text: "Password ændret" });
      setCurrent(""); setNext(""); setConfirm("");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleChange} className="space-y-3">
      {(["current", "next", "confirm"] as const).map((field) => {
        const labels = { current: "Nuværende password", next: "Nyt password", confirm: "Bekræft nyt password" };
        const values = { current, next, confirm };
        const setters = { current: setCurrent, next: setNext, confirm: setConfirm };
        return (
          <div key={field}>
            <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">
              {labels[field]}
            </label>
            <input
              type="password"
              required
              value={values[field]}
              onChange={e => setters[field](e.target.value)}
              className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
              placeholder="••••••••"
            />
          </div>
        );
      })}
      {msg && (
        <p className={`text-sm font-semibold ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
          {msg.type === "ok" ? "✓ " : "⚠ "}{msg.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="bg-charcoal text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-charcoal/80 transition-all disabled:opacity-50"
      >
        {saving ? "Gemmer…" : "Skift password"}
      </button>
    </form>
  );
}

export default function AdminProfilPage() {
  const [profile, setProfile] = useState<AdminProfile>({ email: "", first_name: "", last_name: "", phone: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("admins")
        .select("email, first_name, last_name, phone")
        .eq("id", user.id)
        .single();

      setProfile({
        email: user.email ?? "",
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        phone: data?.phone ?? "",
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    await supabase.from("admins").update({
      first_name: profile.first_name,
      last_name:  profile.last_name,
      phone:      profile.phone,
      email:      profile.email,
    }).eq("id", userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3 max-w-2xl">
      <div className="h-6 bg-charcoal/10 rounded w-40 mb-6" />
      {[1,2,3].map(i => <div key={i} className="h-12 bg-charcoal/10 rounded-xl" />)}
    </div>
  );

  const Field = ({ label, value, onChange, readOnly = false }: {
    label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean;
  }) => (
    <div>
      <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">
        {label}
      </label>
      {readOnly ? (
        <div className="w-full rounded-xl border border-[#e8e5e0] bg-[#f0ede8] px-4 py-2.5 text-sm text-charcoal/60">
          {value || <span className="text-charcoal/30 italic">Ikke udfyldt</span>}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Min profil</h1>
        <p className="text-charcoal/45 text-sm">Dine stamoplysninger som admin</p>
      </div>

      {/* Stamdata */}
      <div className="bg-white rounded-2xl border border-[#ede9e3] p-6 mb-4">
        <h2 className="font-bold text-sm text-charcoal mb-4 uppercase tracking-wider">Stamoplysninger</h2>
        <div className="space-y-4">
          <Field label="E-mail" value={profile.email} readOnly />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Fornavn"
              value={profile.first_name}
              onChange={v => setProfile(p => ({ ...p, first_name: v }))}
            />
            <Field
              label="Efternavn"
              value={profile.last_name}
              onChange={v => setProfile(p => ({ ...p, last_name: v }))}
            />
          </div>
          <Field
            label="Telefon"
            value={profile.phone}
            onChange={v => setProfile(p => ({ ...p, phone: v }))}
          />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-orange-dark transition-all disabled:opacity-50"
          >
            {saving ? "Gemmer…" : "Gem ændringer"}
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-bold animate-in fade-in">✓ Gemt</span>
          )}
        </div>
      </div>

      {/* Skift password */}
      <div className="bg-white rounded-2xl border border-[#ede9e3] p-6">
        <h2 className="font-bold text-sm text-charcoal mb-4 uppercase tracking-wider">Skift password</h2>
        <ChangePassword />
      </div>
    </div>
  );
}
