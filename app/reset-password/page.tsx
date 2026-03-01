"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase v2 automatically exchanges the token from the URL hash
  // We listen for the AUTH_TOKEN_HASH_DETECTED / PASSWORD_RECOVERY event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password skal være mindst 8 tegn");
      return;
    }
    if (password !== confirm) {
      setError("Adgangskoderne matcher ikke");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#ede9e3] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] px-8 pt-8 pb-6 border-b-4 border-orange">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">FI</span>
            </div>
            <span className="text-white font-bold text-sm">FindITconsultants.com</span>
          </div>
          <h1 className="font-bold text-2xl text-white mb-1">Nyt password</h1>
          <p className="text-white/50 text-sm">Vælg et nyt password til din konto</p>
        </div>

        <div className="px-8 py-6">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="font-bold text-charcoal text-lg mb-2">Password opdateret</h2>
              <p className="text-charcoal/50 text-sm mb-6">
                Du kan nu logge ind med dit nye password.
              </p>
              <div className="space-y-2">
                <Link href="/portal/login"
                  className="block w-full text-center bg-orange text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-orange-dark transition-all">
                  Kundeportal →
                </Link>
                <Link href="/supplier/login"
                  className="block w-full text-center bg-charcoal text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-charcoal/80 transition-all">
                  Leverandørportal →
                </Link>
                <Link href="/admin/login"
                  className="block w-full text-center text-charcoal/40 text-sm hover:text-charcoal transition-colors py-2">
                  Admin panel
                </Link>
              </div>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-charcoal/50 text-sm">Verificerer reset-link…</p>
              <p className="text-charcoal/30 text-xs mt-2">
                Klik på linket i din email for at aktivere password-reset.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">
                  Nyt password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
                  placeholder="Mindst 8 tegn"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">
                  Bekræft password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all disabled:opacity-50"
              >
                {loading ? "Gemmer…" : "Gem nyt password →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
