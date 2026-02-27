import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindITconsultants.com — Free IT consultant matching via multi-sourcing",
  description: "Free and non-binding multi-sourcing service. We activate 70+ suppliers and present you with 4–9 relevant IT consultants within 3 business days.",
  keywords: "IT consultant, multi-sourcing, IT recruitment, Denmark",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FindITconsultants.com",
    description: "Free IT consultant matching — 70+ partners — response within 3 days",
    url: "https://finditconsultants.com",
    locale: "da_DK",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
