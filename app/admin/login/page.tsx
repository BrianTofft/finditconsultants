"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function ForgotPassword() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleReset = async () => {
    setSending(true);
    await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setSending(false);
  };

  if (!show) return (
    <button onClick={() => setShow(true)} className="text-charcoal/40 hover:text-charcoal text-xs font-semibold mt-3 w-full text-center transition-colors">
      Glemt password?
    </button>
  );

  return (
    <div className="mt-4 border-t border-[#f0ede8] pt-4">
      {sent ? (
        <p className="text-green-600 text-xs font-bold text-center">✓ Reset email sendt — tjek din indbakke</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-charcoal/50 font-semibold">Indtast din email for at få tilsendt et reset link</p>
          <input
            className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all"
            placeholder="din@email.dk" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={handleReset} disabled={sending || !email}
            className="w-full bg-charcoal text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-charcoal/80 transition-all disabled:opacity-40">
            {sending ? "Sender…" : "Send reset link"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setError("Forkert email eller adgangskode");
      setLoading(false);
      return;
    }
    const { data: adminData } = await supabase
      .from("admins")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!adminData) {
      setError("Du har ikke adgang til admin panelet");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    router.push("/admin");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#ede9e3] w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] px-8 pt-8 pb-6 border-b-4 border-orange">
          <h1 className="font-bold text-2xl text-white mb-1">Admin Login</h1>
          <p className="text-white/50 text-sm">Kun for administratorer</p>
        </div>
        <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
              placeholder="admin@finditconsultants.com" />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Adgangskode</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
              placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all disabled:opacity-50">
            {loading ? "Logger ind…" : "Log ind →"}
          </button>
          <ForgotPassword />
        </form>
      </div>
    </div>
  );
}
