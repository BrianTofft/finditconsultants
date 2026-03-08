"use client";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "customer";
  const portalPath = role === "supplier" ? "/supplier" : "/portal";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Adgangskoden skal være mindst 8 tegn");
      return;
    }
    if (password !== confirm) {
      setError("Adgangskoderne matcher ikke");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { must_change_password: false },
    });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    router.push(portalPath);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#ede9e3] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] px-8 pt-8 pb-6 border-b-4 border-orange">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">FI</span>
            </div>
            <span className="text-white font-bold text-sm">FindITconsultants.com</span>
          </div>
          <h1 className="font-bold text-2xl text-white mb-1">Vælg dit password</h1>
          <p className="text-white/55 text-sm leading-relaxed">
            Du er logget ind med et midlertidigt password.<br />
            Vælg dit eget for at fortsætte.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">
                Nyt password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoFocus
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
              <p className="text-red-500 text-sm text-center font-semibold">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all disabled:opacity-50"
            >
              {loading ? "Gemmer…" : "Gem og fortsæt →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  );
}
