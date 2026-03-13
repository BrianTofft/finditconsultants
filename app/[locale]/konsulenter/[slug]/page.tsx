import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ConsultantPage from "@/components/ConsultantPage";
import { consultantPages as daPages } from "@/app/data/consultant-pages";
import { consultantPages as enPages } from "@/app/data/consultant-pages-en";
import { consultantPages as noPages } from "@/app/data/consultant-pages-no";
import { consultantPages as svPages } from "@/app/data/consultant-pages-sv";

const pagesByLocale: Record<string, typeof daPages> = {
  da: daPages,
  en: enPages,
  no: noPages,
  sv: svPages,
};

const slugs = daPages.map(p => p.slug);

export function generateStaticParams() {
  const locales = ["da", "en", "no", "sv"];
  return locales.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pages = pagesByLocale[locale] ?? daPages;
  const page = pages.find(p => p.slug === slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    alternates: {
      canonical: `https://finditconsultants.com/${locale}/konsulenter/${slug}`,
    },
  };
}

export default async function LocaleConsultantPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pages = pagesByLocale[locale] ?? daPages;
  const page = pages.find(p => p.slug === slug);
  if (!page) notFound();

  return (
    <ConsultantPage
      title={page.title}
      eyebrow={page.eyebrow}
      hero={page.title}
      intro={page.intro}
      price={page.price}
      graphic={page.graphic}
      sections={page.sections}
      faq={page.faq}
      resources={page.resources}
    />
  );
}
