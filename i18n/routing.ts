import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["da", "en", "no", "sv"],
  defaultLocale: "da",
});
