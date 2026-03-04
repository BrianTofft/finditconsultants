"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { BadgeCounts } from "./types";

function Sidebar({ counts, onLogout, open, onClose }: { counts: BadgeCounts; onLogout: () => void; open: boolean; onClose: () => void }) {
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
    <aside className={`
      w-64 md:w-56 bg-white border-r border-[#ede9e3] flex flex-col fixed h-full z-50
      transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#ede9e3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">FI</span>
          </div>
          <div>
            <p className="text-charcoal font-bold text-sm leading-tight">FindITconsultants</p>
            <p className="text-charcoal/40 text-[10px] font-semibold tracking-wide uppercase">Admin</p>
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
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all mb-0.5 ${
                isActive
                  ? "bg-orange text-white shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal hover:bg-orange/8"
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
      <div className="px-4 py-4 border-t border-[#ede9e3]">
        <button
          onClick={onLogout}
          className="w-full text-left text-charcoal/35 hover:text-charcoal/70 text-xs font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-charcoal/5"
        >
          Log ud →
        </button>
      </div>
    </aside>
  );
}

const pageLabels: Record<string, string> = {
  "/admin":               "Overblik",
  "/admin/afventer":      "Afventer",
  "/admin/forspørgsler":  "Forespørgsler",
  "/admin/konsulenter":   "Konsulenter",
  "/admin/kontrakter":    "Kontrakter",
  "/admin/ansøgninger":   "Ansøgninger",
  "/admin/brugere":       "Brugere",
  "/admin/beskeder":      "Beskeder",
  "/admin/profil":        "Min profil",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [counts, setCounts] = useState<BadgeCounts>({ pending: 0, applications: 0, messages: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const currentPageLabel = pageLabels[pathname ?? ""] ?? "Admin";

  return (
    <div className="flex h-screen bg-[#f8f6f3] overflow-hidden">

      {/* ── Mobil backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar counts={counts} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Mobil topbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#ede9e3] z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-charcoal/8 transition-colors flex-shrink-0"
          aria-label="Menu"
        >
          <span className="text-charcoal font-bold text-lg leading-none">{sidebarOpen ? "✕" : "☰"}</span>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-orange rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">FI</span>
          </div>
          <span className="font-bold text-sm text-charcoal">FindITconsultants.com</span>
        </div>
        <span className="text-xs text-charcoal/45 font-semibold ml-auto truncate max-w-[120px]">
          {currentPageLabel}
        </span>
      </div>

      <main className="flex-1 md:ml-56 overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
