import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

// .mts, not .ts: the source package.json says "type": "commonjs", so a .ts
// config written in ESM made Vite warn on every run that `configLoader:
// 'native'` -- its future default -- cannot load it. Hence import.meta.dirname
// rather than __dirname below.
const root = import.meta.dirname;

// Packages pre-bundled into one file for the unit project. Every test file runs
// in a fresh worker, so an unbundled dependency is read from disk module by
// module once per file. @onlyoffice/docspace-api-sdk is 882 modules -- reached
// through the enums re-exported from enums/, types/ and utils/common -- and cost
// about 7 seconds in each of the 99 files that load it, 721 of the 1044 seconds
// the suite spent importing. jest-dom is loaded by every file, through
// test/setup.ts.
const PREBUNDLED = [
  "@onlyoffice/docspace-api-sdk",
  "@testing-library/jest-dom",
];

export default defineConfig({
  test: {
    // `pnpm test:changed` runs only the tests whose import graph reaches a
    // changed file. The setup file, the mocks and the English strings reach
    // every test without being imported by any, so a change to them runs the
    // whole suite. A root-only option: set inside a project it is ignored.
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      "**/test/**",
      "**/locales/en/**",
    ],
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
                root,
                "./test/__mocks__/reactSvgMock.tsx",
              ),
            },
            {
              find: /^(.*)\.react\.svg$/,
              replacement: path.resolve(root, "./test/__mocks__/svgMock.tsx"),
            },
            {
              find: /^(.*)\.svg$/,
              replacement: path.resolve(root, "./test/__mocks__/svgMock.tsx"),
            },
            {
              find: "react-svg",
              replacement: path.resolve(
                root,
                "./test/__mocks__/reactSvgMock.tsx",
              ),
            },
          ],
          // The SDK's `main` is CommonJS. Pre-bundled from there it needs interop,
          // every named import is then read off `.default`, and the vi.mock
          // factories in providers/ -- which return named exports only -- fail
          // with 'No "default" export is defined'. Its `module` entry is ESM.
          mainFields: ["module", "jsnext:main", "jsnext", "main"],
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
            "uploader/**/*.test.{ts,tsx}",
            "context/**/*.test.{ts,tsx}",
            "providers/**/*.test.{ts,tsx}",
            "hooks/**/*.test.{ts,tsx}",
            "billing/**/*.test.{ts,tsx}",
            "scripts/**/*.test.{ts,mjs}",
            // The legal-practice samples carry real logic -- PKCE, role mapping --
            // that readers copy into applications, so it is tested like the kit.
            "docs/**/*.test.{ts,tsx}",
          ],
          // Threads start faster than forked processes, on Windows most of all:
          // 124 seconds with forks, 75 with threads, before the pre-bundling
          // below. Fewer workers than the default was slower still (92 with 12).
          // `isolate: false` is not an option -- tests leak state into each other.
          pool: "threads",
          deps: {
            optimizer: {
              client: {
                enabled: true,
                include: [
                  "@onlyoffice/docspace-api-sdk",
                  "@testing-library/jest-dom/vitest",
                ],
                // axios stays external: bundled for the browser, its Node
                // dependencies fail with "util.inherits is not a function".
                exclude: ["axios", "vitest"],
              },
            },
          },
          server: { deps: { inline: PREBUNDLED } },
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
            configDir: path.join(root, ".storybook"),
            storybookScript: "pnpm storybook --no-open",
          }),
        ],
        // staticDirs maps .storybook/public to the root; serve it from there
        // here too.
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
