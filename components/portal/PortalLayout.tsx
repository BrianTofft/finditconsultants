"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem { href: string; label: string; icon: string; badge?: number; }
interface Props {
  user: { name: string; company: string; initials: string; };
  navItems: NavItem[];
  children: React.ReactNode;
  portalType: "customer" | "supplier";
}

export default function PortalLayout({ user, navItems, children, portalType }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const accentColor = portalType === "customer" ? "text-orange" : "text-blue-400";
  const basePath = `/${portalType}`;

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#2d2c2c] flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/">
            <img src="/logo-white.png" alt="FindIT" className="w-36 h-auto" />
          </Link>
          <div className="mt-3 text-[10px] font-extrabold tracking-widest uppercase text-white/30">
            {portalType === "customer" ? "Kundeportal" : "Leverandørportal"}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? "bg-orange text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-orange text-white"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-xs font-black text-white flex-shrink-0">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-bold truncate">{user.name}</div>
              <div className="text-white/40 text-xs truncate">{user.company}</div>
            </div>
            <Link href={`${basePath}/login`} className="text-white/30 hover:text-white transition-colors text-xs" title="Log ud">⏻</Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-[#e8e5e0] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button className="lg:hidden text-charcoal p-1" onClick={() => setMobileOpen(true)}>
            <div className="w-5 h-0.5 bg-charcoal mb-1" />
            <div className="w-5 h-0.5 bg-charcoal mb-1" />
            <div className="w-5 h-0.5 bg-charcoal" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <span className="font-bold text-charcoal text-sm">
              {portalType === "customer" ? "Kundeportal" : "Leverandørportal"}
            </span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <button className="relative text-charcoal/50 hover:text-charcoal transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full text-[9px] font-black text-white flex items-center justify-center">2</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-xs font-black text-white">
                {user.initials}
              </div>
              <span className="hidden md:block text-sm font-semibold text-charcoal">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
