import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  test: {
    environment: "jsdom",

    setupFiles: ["./tests/setup/vitest.setup.ts"],

    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/components/**/*.test.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
    ],

    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
});
