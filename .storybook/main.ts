// This file has been automatically migrated to valid ESM format by Storybook.
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";
import remarkGfm from "remark-gfm";

import { aiChatMock } from "./ai-chat-mock.ts";
import { oauthAppProxy } from "./oauth-app-proxy.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    // Scoped per directory rather than "../**/*.mdx": the recursive form also
    // matches dist/, storybook-static/ and node_modules/, and every .mdx in
    // this package lives under one of the directories listed below.
    // components/ has none: a component's Docs page is its README, rendered
    // by .storybook/blocks/DocsPage.tsx, and a glob matching nothing only
    // prints "No story files found" on every start.
    "../docs/**/*.mdx",
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

  // `public/` is served at the root, next to iframe.html, for pages a story
  // needs a real URL for -- today the OAuth redirect URI of the legal-practice
  // samples, `oauth-callback.html`, and the `serve.json` that keeps
  // `pnpm storybook-serve` from rewriting it. Resolved relative to the
  // preview, so it works under a path prefix as well.
  staticDirs: [
    { from: "../assets", to: "/static" },
    { from: "./public", to: "/" },
  ],

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
    {
      // MDX ships with CommonMark only, so a Markdown table renders as a line
      // of literal pipes and dashes -- which is what every table in docs/*.mdx
      // did until this was added. remark-gfm is already in the tree as one of
      // ai-agent's optional peers, so this costs no new dependency.
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    // .storybook/ is outside tsconfig.json and holds no component with props,
    // so docgen skipped each of its files with a warning on every start.
    // Setting `exclude` replaces the plugin's default, hence the stories.
    reactDocgenTypescriptOptions: {
      exclude: ["**/*.stories.tsx", "**/.storybook/**"],
    },
  },

  async viteFinal(config, { configType }) {
    // A static build inlines every `import.meta.env.VITE_*` it reads, so a
    // portal key sitting in the builder's `.env` would ship in plain text in
    // `assets/iframe-*.js` -- verified with a canary key, and the published
    // Storybook is exactly such a build. Blank both out for production: the
    // published pages start in demo mode, and a reader connects their own
    // portal from the toolbar, which keeps the key in their browser only.
    if (configType === "PRODUCTION") {
      config.define = {
        ...config.define,
        "import.meta.env.VITE_PROVIDER_API_URL": JSON.stringify(""),
        "import.meta.env.VITE_PROVIDER_API_KEY": JSON.stringify(""),
      };
    }

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

    // `@onlyoffice/ai-chat` declares most of its dependencies as optional
    // peers, and this package installs only the ones it needs (see the
    // `//devDependencies` note in package.json). The widget still imports the
    // rest unconditionally, so every one of them has to resolve to something.
    //
    // `storybook dev` tolerated that on its own -- Vite leaves an unresolved
    // optional peer to fail lazily -- but `storybook build` does not: rolldown
    // resolves those imports against an empty placeholder module and stops with
    // MISSING_EXPORT for each name. So each absent peer is aliased to a stub
    // under `stubs/`, which throws only if something actually reaches it.
    //
    // Aliased twice, because the ids have to resolve in two places:
    // `resolve.alias` for the module graph, and the dependency optimizer, which
    // prebundles `@onlyoffice/ai-chat` with its own rolldown resolver and does
    // not read `resolve.alias` -- without the second one the prebundle emits a
    // chunk that throws "Could not resolve react-shiki" the moment it is
    // imported.
    const stub = (file: string) => path.resolve(__dirname, "stubs", file);

    const missingAiChatPeers = {
      "react-shiki": stub("react-shiki.mjs"),
      openai: stub("openai.mjs"),
      "@anthropic-ai/sdk": stub("anthropic-sdk.mjs"),
      "@google/genai": stub("google-genai.mjs"),
      "@mistralai/mistralai": stub("mistralai.mjs"),
      codemirror: stub("codemirror.mjs"),
      "@codemirror/state": stub("codemirror-state.mjs"),
      "@codemirror/lang-json": stub("codemirror-lang-json.mjs"),
    };

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...missingAiChatPeers,
    };

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.rolldownOptions = {
      ...config.optimizeDeps.rolldownOptions,
      resolve: {
        ...config.optimizeDeps.rolldownOptions?.resolve,
        alias: { ...missingAiChatPeers },
      },
    };

    // The AI chat widget talks to `/api/2.0/ai` on the page's own origin;
    // in local Storybook that is this dev server. Without an answer the
    // widget's stores never initialise and the panel renders empty. Inert
    // behind nginx (`STORYBOOK_PROXY`), where those calls reach the portal.
    config.plugins.push(aiChatMock());

    // The legal-practice samples' "Create the OAuth app" button: two portal
    // calls the browser cannot make cross-origin. Dev server only.
    config.plugins.push(oauthAppProxy());

    return config;
  },
};

export default config;
