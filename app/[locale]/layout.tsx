import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://finditconsultants.com";

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
    availableLanguage: ["Danish", "English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  },
  areaServed: [
    { "@type": "Country", name: "Denmark" },
    { "@type": "Country", name: "Norway" },
    { "@type": "Country", name: "Sweden" },
  ],
  knowsLanguage: ["da", "en", "no", "sv"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FindITconsultants.com",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/#hero-form`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "da" | "en" | "no" | "sv")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
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
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
