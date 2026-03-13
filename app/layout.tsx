import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import daMessages from "@/messages/da.json";

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
// NextIntlClientProvider here ensures static pages outside [locale] (e.g. /konsulenter/*) have DA translations.
// [locale]/layout.tsx overrides this with the correct locale for locale-aware pages.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="da" messages={daMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
