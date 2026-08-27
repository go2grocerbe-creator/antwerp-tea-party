import type { MetadataRoute } from "next";
import { localePath, locales } from "@/i18n";

const baseUrl = "https://antwerp-tea-party.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}${localePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "nl" ? 1 : 0.9,
    alternates: {
      languages: {
        nl: `${baseUrl}${localePath("nl")}`,
        fr: `${baseUrl}${localePath("fr")}`,
        en: `${baseUrl}${localePath("en")}`,
      },
    },
  }));
}
