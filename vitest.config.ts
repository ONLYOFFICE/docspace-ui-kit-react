import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@docspace\/shared\/(.*)/,
        replacement: path.resolve(__dirname, "../../packages/shared/$1"),
      },
      {
        // `react-svg` uses `@tanem/svg-injector`, which schedules timers that
        // can fire after the test environment is torn down. Mock it to avoid
        // the resulting "SVGSVGElement is not defined" unhandled errors.
        find: /^react-svg$/,
        replacement: path.resolve(
          __dirname,
          "./test/__mocks__/reactSvgMock.tsx",
        ),
      },
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
