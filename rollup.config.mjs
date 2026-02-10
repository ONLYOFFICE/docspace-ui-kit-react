import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import dts from "rollup-plugin-dts";
import nodePolyfills from "rollup-plugin-polyfill-node";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

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
					generateScopedName: "[hash:base64:5]",
				},
				inject: true,
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
		external: ["react", "react-dom", "react/jsx-runtime"],
	},
	// Type definitions
	{
		input: "index.ts",
		output: {
			dir: "dist/types",
			format: "esm",
		},
		plugins: [
			dts({
				tsconfig: "./tsconfig.json",
			}),
		],
		external: [/\.scss$/, /\.css$/, /\.svg$/],
	},
];
