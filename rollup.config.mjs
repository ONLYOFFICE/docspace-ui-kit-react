import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const terserOptions = {
	compress: {
		drop_console: true,
		drop_debugger: true,
		pure_funcs: ["console.log", "console.info", "console.debug"],
		passes: 3,
		toplevel: true,
		unsafe: true,
		unsafe_arrows: true,
		unsafe_methods: true,
	},
	mangle: {
		toplevel: true,
		properties: {
			regex: /^_/,
		},
	},
	format: {
		comments: false,
	},
};

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
			}),
			svgr(),
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
			terser(terserOptions),
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
