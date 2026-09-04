import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import nodePolyfills from "rollup-plugin-polyfill-node";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

import { builtinModules } from "node:module";
import { readFileSync } from "node:fs";
// A bare filename: rollup rejects absolute or relative asset names, so the
// plugin emits one stylesheet per output format and a post-build step promotes
// a single copy to dist/styles.css.
const STYLESHEET = "styles.css";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));

// Every declared package is external. Bundling them instead is what broke the
// build (rollup tripped over the CJS/ESM interop inside react-transition-group
// -> prop-types) and what would have shipped a second copy of each dependency
// alongside the one npm installs from `dependencies` -- fatal for anything with
// module state, such as i18next or mobx.
const declaredPackages = [
	...Object.keys(pkg.dependencies ?? {}),
	...Object.keys(pkg.peerDependencies ?? {}),
];

const nodeBuiltins = new Set([
	...builtinModules,
	...builtinModules.map((m) => `node:${m}`),
]);

const isExternal = (id) =>
	nodeBuiltins.has(id) ||
	declaredPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default [
	{
		input: "index.ts",
		output: [
			{
				dir: "dist/esm",
				format: "esm",
				sourcemap: false,
				preserveModules: true,
				preserveModulesRoot: ".",
			},
			{
				dir: "dist/cjs",
				format: "cjs",
				sourcemap: false,
				preserveModules: true,
				preserveModulesRoot: ".",
			},
		],
		plugins: [
			peerDepsExternal(),
			resolve({
				extensions: [".ts", ".tsx", ".js", ".jsx"],
				browser: true,
				preferBuiltins: false,
			}),
			nodePolyfills(),
			svgr(),
			json(),
			commonjs(),
			typescript({
				tsconfig: "./tsconfig.json",
				declaration: false,
				declarationDir: undefined,
			}),
			postcss({
				modules: {
					// Readable, greppable and overridable by consumers. A bare
					// hash makes a reported style bug untraceable to a component.
					generateScopedName: "dsui-[name]__[local]--[hash:base64:5]",
				},
				// One stylesheet, not styles injected by JS at import time.
				// Injection has no SSR story -- four of the monorepo apps are
				// Next.js -- and it is what pulled `style-inject` into dist.
				// Consumers import "@onlyoffice/docspace-ui-kit/styles.css".
				extract: STYLESHEET,
				minimize: true,
				use: [
					[
						"sass",
						{
							silenceDeprecations: ["legacy-js-api"],
						},
					],
				],
			}),
		],
		external: isExternal,
	},
	// Declarations are emitted by `tsc -p tsconfig.build.json`, not bundled by
	// rollup-plugin-dts. The bundled form collapsed the whole library into a
	// single dist/types/index.d.ts, so a deep import such as
	// "@onlyoffice/docspace-ui-kit/components/text" resolved JavaScript but no
	// types at all. tsc mirrors the source tree instead, matching the
	// preserveModules layout the JS output already uses.
];
