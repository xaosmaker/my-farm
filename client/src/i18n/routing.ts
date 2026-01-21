import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "gr"],
  defaultLocale: "en",
  localeDetection: true,
  localePrefix: "as-needed",
});
