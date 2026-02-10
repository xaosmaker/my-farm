// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "nuxt-i18n-micro",
    "shadcn-nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss() as any],
  },
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
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
});

