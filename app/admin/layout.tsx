"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { BadgeCounts } from "./types";

function Sidebar({ counts, onLogout }: { counts: BadgeCounts; onLogout: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Overblik", icon: "📊", exact: true },
    { href: "/admin/afventer", label: "Afventer", icon: "🕐", badge: counts.pending },
    { href: "/admin/forspørgsler", label: "Forespørgsler", icon: "✅" },
    { href: "/admin/konsulenter", label: "Konsulenter", icon: "👤" },
    { href: "/admin/kontrakter", label: "Kontrakter", icon: "📄" },
    { href: "/admin/ansøgninger", label: "Ansøgninger", icon: "📋", badge: counts.applications },
    { href: "/admin/brugere", label: "Brugere", icon: "👥" },
    { href: "/admin/beskeder", label: "Beskeder", icon: "💬", badge: counts.messages },
    { href: "/admin/profil", label: "Min profil", icon: "⚙️" },
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
            <p className="text-white/40 text-[10px] font-semibold tracking-wide uppercase">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all mb-0.5 ${
                isActive
                  ? "bg-orange text-white shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight ${
                  isActive ? "bg-white/25 text-white" : "bg-orange text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [counts, setCounts] = useState<BadgeCounts>({ pending: 0, applications: 0, messages: 0 });

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }

      const { data: adminData } = await supabase
        .from("admins").select("id").eq("id", user.id).single();
      if (!adminData) { router.push("/admin/login"); return; }

      setIsAdmin(true);
      setAuthChecked(true);

      // Fetch badge counts for sidebar
      const [pendingRes, appsRes, msgRes] = await Promise.all([
        supabase.from("requests")
          .select("*", { count: "exact", head: true })
          .or("admin_status.is.null,admin_status.eq.pending"),
        supabase.from("supplier_applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "Afventer"),
        supabase.from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("read_by_admin", false)
          .neq("sender_type", "admin"),
      ]);

      setCounts({
        pending: pendingRes.count ?? 0,
        applications: appsRes.count ?? 0,
        messages: msgRes.count ?? 0,
      });
    };

    check();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "https://finditconsultants.com";
  };

  // Login page renders without sidebar
  if (isLoginPage) return <>{children}</>;

  // Auth loading state
  if (!authChecked) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <span className="text-white font-black text-sm">FI</span>
        </div>
        <p className="text-charcoal/40 text-sm font-semibold">Verificerer adgang…</p>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-[#f8f6f3] overflow-hidden">
      <Sidebar counts={counts} onLogout={handleLogout} />
      <main className="flex-1 ml-56 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
