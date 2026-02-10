// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "nuxt-i18n-micro",
  ],
  i18n: {
    locales: [
      { code: "en", iso: "en-US", dir: "ltr" },
      { code: "el", iso: "el-GR", dir: "ltr" },
    ],
    defaultLocale: "en",
    fallbackLocale: "en",
    strategy: "prefix_except_default",
    redirects: true,
    autoDetectLanguage: true,
    localeCookie: "my-farm-lang",
  },
});
