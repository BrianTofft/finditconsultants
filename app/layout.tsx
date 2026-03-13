import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://finditconsultants.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FindITconsultants.com — Gratis IT-konsulent matching | 70+ leverandører",
    template: "%s | FindITconsultants.com",
  },
  description:
    "Gratis og uforpligtende multi-sourcing service. Beskriv dit IT-behov — vi aktiverer 70+ konsulenthuse og præsenterer 4–9 screenede profiler inden for 3 arbejdsdage.",
  keywords: [
    "IT konsulent",
    "IT konsulenter Danmark",
    "gratis IT konsulent",
    "freelance IT konsulent",
    "multi-sourcing",
    "IT rekruttering Danmark",
    "konsulenthus",
    "IT rådgivning",
    "IT leverandør",
    "konsulentformidling",
    "FindITkonsulenter",
  ],
  authors: [{ name: "FindITconsultants.com", url: BASE_URL }],
  creator: "FindITconsultants.com",
  publisher: "FindITconsultants.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: "/favicon.ico" },
};

// Root layout — html/body provided by app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
