import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^(.*)\.react\.svg$/,
        replacement: path.resolve(__dirname, "./test/__mocks__/svgMock.tsx"),
      },
      {
        find: /^(.*)\.svg$/,
        replacement: path.resolve(__dirname, "./test/__mocks__/svgMock.tsx"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: [
      "components/**/*.test.{ts,tsx}",
      "ai-agent/**/*.test.{ts,tsx}",
      "errors/**/*.test.{ts,tsx}",
      "ui/**/*.test.{ts,tsx}",
      "utils/**/*.test.{ts,tsx}",
      "context/**/*.test.{ts,tsx}",
      "providers/**/*.test.{ts,tsx}",
      "hooks/**/*.test.{ts,tsx}",
    ],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
