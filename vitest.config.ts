import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^(.*)\.react\.svg$/,
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
      "ui/**/*.test.{ts,tsx}",
      "utils/**/*.test.{ts,tsx}",
    ],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
