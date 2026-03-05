import path from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../**/*.mdx",
    "../docs/**/*.stories.@(js|jsx|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../errors/**/*.stories.@(js|jsx|ts|tsx)",
    "../providers/**/*.stories.@(js|jsx|ts|tsx)",
    "../selectors/**/*.stories.@(js|jsx|ts|tsx)",
    "../document-editor/**/*.stories.@(js|jsx|ts|tsx)",
    "../ai-agent/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  staticDirs: [{ from: "../../../public", to: "/static" }],

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

    config.resolve = config.resolve || {};
    const existingAlias = config.resolve.alias ?? [];
    const aliasArray = Array.isArray(existingAlias)
      ? existingAlias
      : Object.entries(existingAlias).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    config.resolve.alias = [
      ...aliasArray,
      // PUBLIC_DIR is a Webpack alias pointing to the repo root /public directory.
      // Vite/Storybook does not know about it, so resolve it here.
      {
        find: "PUBLIC_DIR",
        replacement: path.resolve(__dirname, "../../../public"),
      },
    ];

    return config;
  },
};

export default config;
