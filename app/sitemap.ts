import { MetadataRoute } from "next";

const BASE_URL = "https://finditconsultants.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const konsulenterSlugs = [
    "ai",
    "azure",
    "cybersecurity",
    "data-warehouse",
    "digital-strategi",
    "erp-crm",
    "infrastruktur",
    "it-konsulent",
    "it-projektleder",
    "nearshore",
    "power-bi",
    "sharepoint",
    "softwareudvikling",
    "support",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...konsulenterSlugs.map((slug) => ({
      url: `${BASE_URL}/konsulenter/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
