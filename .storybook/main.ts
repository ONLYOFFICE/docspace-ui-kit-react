import path from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
	stories: [
		"../components/**/*.stories.@(js|jsx|ts|tsx)",
		"../errors/**/*.stories.@(js|jsx|ts|tsx)",
		"../providers/**/*.stories.@(js|jsx|ts|tsx)",
		"../selectors/**/*.stories.@(js|jsx|ts|tsx)",
		"../document-editor/**/*.stories.@(js|jsx|ts|tsx)",
	],

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
		// Vite matches aliases against the raw import specifier, so use a regex
		// to catch any import of utils/image-helpers regardless of relative depth.
		// The real file uses Webpack require() with ?url queries which are not
		// available in Vite — redirect to a stub that returns empty Maps.
		const existingAlias = config.resolve.alias ?? [];
		const aliasArray = Array.isArray(existingAlias)
			? existingAlias
			: Object.entries(existingAlias).map(([find, replacement]) => ({
					find,
					replacement,
				}));
		config.resolve.alias = [
			...aliasArray,
			{
				find: /.*\/utils\/image-helpers(\/index\.ts)?$/,
				replacement: path.resolve(__dirname, "./mocks/image-helpers.ts"),
			},
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
