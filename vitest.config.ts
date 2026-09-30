import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: [
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
              replacement: path.resolve(
                __dirname,
                "./test/__mocks__/svgMock.tsx",
              ),
            },
            {
              find: /^(.*)\.svg$/,
              replacement: path.resolve(
                __dirname,
                "./test/__mocks__/svgMock.tsx",
              ),
            },
            {
              find: "react-svg",
              replacement: path.resolve(
                __dirname,
                "./test/__mocks__/reactSvgMock.tsx",
              ),
            },
          ],
        },
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./test/setup.ts"],
          include: [
            "components/**/*.test.{ts,tsx}",
            "selectors/**/*.test.{ts,tsx}",
            "ai-agent/**/*.test.{ts,tsx}",
            "errors/**/*.test.{ts,tsx}",
            "ui/**/*.test.{ts,tsx}",
            "utils/**/*.test.{ts,tsx}",
            "context/**/*.test.{ts,tsx}",
            "providers/**/*.test.{ts,tsx}",
            "hooks/**/*.test.{ts,tsx}",
            "scripts/**/*.test.{ts,mjs}",
            // The legal-practice samples carry real logic -- PKCE, role mapping --
            // that readers copy into applications, so it is tested like the kit.
            "docs/**/*.test.{ts,tsx}",
          ],
          css: {
            modules: {
              classNameStrategy: "non-scoped",
            },
          },
        },
      },
      {
        // Every story as a browser test: it must render, and its play function,
        // if any, must pass. The Vite setup comes from .storybook/main.ts, not
        // from the project above -- the SVG mocks there would replace the real
        // icons a browser can draw.
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, ".storybook"),
            storybookScript: "pnpm storybook --no-open",
          }),
        ],
        // staticDirs maps .storybook/public to the root; the demo portal's
        // mockServiceWorker.js has to be served from there here too.
        publicDir: ".storybook/public",
        // Stories render with no portal, as on the published Storybook. A key in
        // a developer's .env would otherwise send the tests to a live portal.
        define: {
          "import.meta.env.VITE_PROVIDER_API_URL": JSON.stringify(""),
          "import.meta.env.VITE_PROVIDER_API_KEY": JSON.stringify(""),
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
