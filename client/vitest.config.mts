import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ["./__tests__/authSetupEnv.ts"],
    coverage: {
      provider: "v8",
      reporter: "text",
      enabled: true,
    },
    environment: "jsdom",
  },
});
