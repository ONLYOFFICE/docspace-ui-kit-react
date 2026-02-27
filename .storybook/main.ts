import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../errors/**/*.stories.@(js|jsx|ts|tsx)",
    "../providers/**/*.stories.@(js|jsx|ts|tsx)",
    "../document-editor/**/*.stories.@(js|jsx|ts|tsx)",
    "../**/*.mdx",
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

    return config;
  },
};

export default config;
