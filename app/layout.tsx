import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const BASE_URL = "https://finditconsultants.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FindITconsultants.com — Gratis IT-konsulent matching | 70+ leverandører",
    template: "%s | FindITkonsulenter.dk",
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
  openGraph: {
    title: "FindITconsultants.com — Gratis IT-konsulent matching",
    description:
      "Gratis IT-konsulent matching — 70+ leverandører — 4–9 kandidater inden for 3 arbejdsdage.",
    url: BASE_URL,
    siteName: "FindITconsultants.com",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FindITconsultants.com — Gratis IT-konsulent matching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FindITconsultants.com — Gratis IT-konsulent matching",
    description: "Gratis multi-sourcing — 70+ leverandører — 4–9 kandidater inden for 3 dage.",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FindITconsultants.com",
  url: BASE_URL,
  logo: `${BASE_URL}/logo-white.png`,
  description:
    "Gratis og uforpligtende multi-sourcing service til IT-konsulenter i Danmark. Vi aktiverer 70+ leverandører og præsenterer screenede profiler inden for 3 arbejdsdage.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Industrivej 21",
    addressLocality: "Roskilde",
    postalCode: "4000",
    addressCountry: "DK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+45-2834-0907",
    email: "hej@finditconsultants.com",
    contactType: "customer service",
    availableLanguage: "Danish",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  },
  areaServed: { "@type": "Country", name: "Denmark" },
  knowsLanguage: "da",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FindITconsultants.com",
  url: BASE_URL,
  inLanguage: "da",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/#hero-form`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
