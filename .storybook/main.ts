// This file has been automatically migrated to valid ESM format by Storybook.
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

import { aiChatMock } from "./ai-chat-mock.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    // Scoped per directory rather than "../**/*.mdx": the recursive form also
    // matches dist/, storybook-static/ and node_modules/, and every .mdx in
    // this package lives under one of the directories listed below.
    "../docs/**/*.mdx",
    "../components/**/*.mdx",
    "../errors/**/*.mdx",
    "../providers/**/*.mdx",
    "../selectors/**/*.mdx",
    "../document-editor/**/*.mdx",
    "../uploader/**/*.mdx",
    "../ai-agent/**/*.mdx",
    "../billing/**/*.mdx",
    "../docs/**/*.stories.@(js|jsx|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../errors/**/*.stories.@(js|jsx|ts|tsx)",
    "../providers/**/*.stories.@(js|jsx|ts|tsx)",
    "../selectors/**/*.stories.@(js|jsx|ts|tsx)",
    "../document-editor/**/*.stories.@(js|jsx|ts|tsx)",
    "../uploader/**/*.stories.@(js|jsx|ts|tsx)",
    "../ai-agent/**/*.stories.@(js|jsx|ts|tsx)",
    "../billing/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  staticDirs: [{ from: "../assets", to: "/static" }],

  // Opening the manager without a `path` leaves the selection to Storybook,
  // which lands on the first leaf of the index -- an autodocs page of whatever
  // sorts first, not the introduction. Pin the entry point to the Welcome page
  // instead. Only a bare URL is rewritten, so every deep link still resolves,
  // and the rewrite keeps the current pathname, which is what makes it work
  // behind the `/storybook/` proxy as well.
  managerHead: (head) => `${head}
    <script>
      (function () {
        var url = new URL(window.location.href);
        if (url.searchParams.has("path")) return;
        url.searchParams.set("path", "/docs/getting-started-welcome--docs");
        window.location.replace(url.toString());
      })();
    </script>`,

  addons: [
    "@storybook/addon-links",
    "@vueless/storybook-dark-mode",
    "@storybook/addon-docs",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  async viteFinal(config) {
    // When proxied behind nginx at /storybook/, Vite must transform all
    // JS import paths to include the prefix. Nginx strips the prefix before
    // forwarding to Storybook, and sub_filter handles HTML script tags.
    // Usage: STORYBOOK_PROXY=1 pnpm storybook
    if (process.env.STORYBOOK_PROXY) {
      config.base = "/storybook/";
    }

    config.plugins = config.plugins || [];

    // Insert SVGR plugin before other plugins to handle SVG imports as React components
    config.plugins.unshift(
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    );

    // `@onlyoffice/ai-chat` imports `react-shiki` from its markdown renderer.
    // It is an optional peer that this package does not install, so the import
    // is unresolved and the first assistant answer crashes the story. Point it
    // at a stub that keeps the widget's own unhighlighted fallback.
    //
    // Twice, because the id has to resolve in two places: `resolve.alias` for
    // the module graph, and the dependency optimizer, which prebundles
    // `@onlyoffice/ai-chat` with its own rolldown resolver and does not read
    // `resolve.alias` -- without the second one the prebundle emits a chunk
    // that throws "Could not resolve react-shiki" the moment it is imported.
    const reactShikiStub = path.resolve(__dirname, "stubs/react-shiki.mjs");

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-shiki": reactShikiStub,
    };

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.rolldownOptions = {
      ...config.optimizeDeps.rolldownOptions,
      resolve: {
        ...config.optimizeDeps.rolldownOptions?.resolve,
        alias: { "react-shiki": reactShikiStub },
      },
    };

    // The AI chat widget talks to `/api/2.0/ai` on the page's own origin;
    // in local Storybook that is this dev server. Without an answer the
    // widget's stores never initialise and the panel renders empty. Inert
    // behind nginx (`STORYBOOK_PROXY`), where those calls reach the portal.
    config.plugins.push(aiChatMock());

    return config;
  },
};

export default config;
