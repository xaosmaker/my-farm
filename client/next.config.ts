import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const test = process.env.NODE_ENV === "test";
const pack = test ? { transpilePackages: ["next-intl", "use-intl"] } : {};
const nextConfig: NextConfig = {
  ...pack,
  /* config options here */
  // serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
