import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import nodePolyfills from "rollup-plugin-polyfill-node";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

import { builtinModules, createRequire } from "node:module";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
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

// The JS build is entry-point driven, and the root barrel does not export
// ai-agent, api or document-editor -- so rollup never compiled them, while tsc
// emitted declarations for the whole tree. The result was types promising 31
// portal subpaths of which only 1 resolved to JavaScript. Every index module
// under a shipping directory is therefore an entry point, collected here rather
// than listed by hand so it cannot drift as modules are added.
//
// `docs/public-api.md` decides which directories ship; only the public/internal
// *contract* is curated, not the package contents.
const SHIPPING_DIRS = [
	"components",
	"utils",
	"hooks",
	"context",
	"enums",
	"constants",
	"types",
	"errors",
	"providers",
	"ai-agent",
	"api",
	"billing",
	"selectors",
	"uploader",
	"document-editor",
];

const collectEntries = (dir, found = []) => {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (entry.name === "node_modules" || entry.name === "dist") continue;
			collectEntries(full, found);
			continue;
		}

		if (!/\.tsx?$/.test(entry.name) || entry.name.endsWith(".d.ts")) continue;
		if (NON_SOURCE.test(full)) continue;
		if (!VALUE_EXPORT.test(readFileSync(full, "utf8"))) continue;

		found.push(full);
	}

	return found;
};

// Files that are not library modules: test and story support, and anything
// exporting only types (which produces no JavaScript by definition).
const NON_SOURCE = /(\.(test|spec|stories)\.|story\.helper|stories\.utils|storybook-helpers)/;
const VALUE_EXPORT = /^export\s+(?!type\b|interface\b)/m;

// Entry points rollup cannot build. Empty: selectors/MCPServers used to be
// here because it imported assets/favicon.ico, which nothing in this config
// can parse. It now uses the canonical utils/ai/getServerIcon instead, so the
// binary import is gone and the subpath builds like any other.
const UNBUILDABLE = [];

const entryPoints = [
	"index.ts",
	...SHIPPING_DIRS.filter((d) => existsSync(d))
		.flatMap((d) => collectEntries(d))
		.filter(
			(entry) =>
				!UNBUILDABLE.some((skip) => entry.replace(/\\/g, "/").startsWith(skip)),
		),
];

const isExternal = (id) =>
	nodeBuiltins.has(id) ||
	declaredPackages.some((name) => id === name || id.startsWith(`${name}/`));

// Node's strict ESM resolver never guesses an extension for a bare specifier
// -- that fallback only exists for CJS `require`. A deep import into a
// package with no `exports` field (`lodash/throttle`, `fast-deep-equal/react`,
// `react-syntax-highlighter/dist/cjs/styles/prism`) therefore only resolves
// under `require()`, and breaks `import` once this package is actually
// installed rather than symlinked into a bundler-resolved workspace. This
// only matters for the ESM output -- CJS already works, and adding `.js`
// there would be wrong syntax for a `require()` callsite in some loaders.
//
// A package that ships a real `exports` map (`react-dom/client`) must be left
// alone: appending `.js` there produces a specifier (`react-dom/client.js`)
// the map does not define, breaking a subpath that already resolves
// correctly. So the rule is keyed on whether the *package root* declares
// `exports`, not on the subpath's own file extension.
const packageHasExportsMap = new Map();

const hasExportsMap = (packageName) => {
	if (packageHasExportsMap.has(packageName)) {
		return packageHasExportsMap.get(packageName);
	}

	let result = false;

	try {
		const pkgJsonPath = require.resolve(`${packageName}/package.json`);
		result = "exports" in JSON.parse(readFileSync(pkgJsonPath, "utf8"));
	} catch {
		// Package without its own package.json entry (e.g. a Node builtin
		// reached through a non-builtin name) -- treat as no exports map.
	}

	packageHasExportsMap.set(packageName, result);

	return result;
};

const HAS_EXTENSION = /\.[a-zA-Z0-9]+$/;

// Only rewrites a deep import (`pkg/sub/path`) into a *declared* dependency
// that has no `exports` map and no extension yet. Bare package roots
// (`import x from "lodash"`) and Node builtins are untouched.
const addJsExtensionToDeepImports = () => ({
	name: "add-js-extension-to-deep-imports",
	renderChunk(code, chunk, outputOptions) {
		// Rollup normalises the "esm" format alias to "es" by the time it
		// reaches a plugin hook -- the output config below still says "esm".
		if (outputOptions.format !== "es") return null;

		let changed = false;

		const nextCode = code.replace(
			/(from\s+["'])([^"']+)(["'])/g,
			(full, prefix, id, suffix) => {
				const pkgMatch = declaredPackages.find(
					(name) => id.startsWith(`${name}/`) && id !== name,
				);

				if (!pkgMatch || HAS_EXTENSION.test(id) || hasExportsMap(pkgMatch)) {
					return full;
				}

				changed = true;

				return `${prefix}${id}.js${suffix}`;
			},
		);

		return changed ? { code: nextCode, map: null } : null;
	},
});

// Rollup strips module-level directives while bundling ("Module level
// directives cause errors when bundled"), so all 56 "use client" markers in
// the source vanished from dist. Every Next.js App Router consumer -- four of
// the six monorepo apps -- then breaks on the first interactive component.
//
// preserveModules keeps a 1:1 module mapping, so the directive is restored per
// chunk from the directive rollup already parsed off its own source module.
// Reading `chunk.moduleIds` rather than re-scanning files keeps this correct
// for re-exported modules: a chunk earns the directive when any module that
// composes it declared one.
const preserveUseClient = () => ({
	name: "preserve-use-client",
	renderChunk(code, chunk, outputOptions) {
		const needsDirective = chunk.moduleIds.some((id) => {
			const info = this.getModuleInfo(id);
			return info?.meta?.hasUseClient === true;
		});

		if (!needsDirective || /^\s*["']use client["']/.test(code)) return null;

		// Must be the very first statement in both formats to be honoured by
		// consuming bundlers, ahead of any CJS interop preamble.
		return { code: `"use client";\n${code}`, map: null };
	},
});

// The directive has to be recorded at transform time: by renderChunk the
// original source is gone. This runs before the typescript plugin strips it.
//
// Many source files still open with a long copyright comment, so the directive
// is not at byte 0 -- leading comments and blank lines are skipped before
// looking for it. It must still precede any real statement to count.
//
// Scanned line by line rather than with one regex over the whole file: the
// obvious pattern for "leading comments, then the directive" nests a quantifier
// inside a quantified group, which backtracks catastrophically on a 25-line
// header and hangs the build instead of failing.
const hasUseClient = (code) => {
	let inBlockComment = false;

	for (const rawLine of code.split("\n")) {
		const line = rawLine.trim();

		if (inBlockComment) {
			const end = line.indexOf("*/");
			if (end === -1) continue;
			inBlockComment = false;
			// Anything after the close on the same line still has to be checked.
			const rest = line.slice(end + 2).trim();
			if (rest === "") continue;
			return /^["']use client["']/.test(rest);
		}

		if (line === "" || line.startsWith("//")) continue;

		if (line.startsWith("/*")) {
			if (!line.includes("*/")) inBlockComment = true;
			continue;
		}

		// First line that is neither blank nor a comment decides it.
		return /^["']use client["']/.test(line);
	}

	return false;
};

const detectUseClient = () => ({
	name: "detect-use-client",
	transform(code) {
		if (hasUseClient(code)) {
			return { code, map: null, meta: { hasUseClient: true } };
		}

		return null;
	},
});

// Two warning codes are expected on every build of this package and drown out
// anything new -- 55 + 1 lines of the ~380 the build prints. Both are answered
// by the config itself, so they are suppressed by code (never blanket-muted)
// and everything else still reaches the log.
//
// MODULE_LEVEL_DIRECTIVE: rollup strips "use client" while bundling and says
// so once per file. `preserveUseClient` above puts the directive back per
// chunk, and `scripts/check-dist.mjs` (run by `pnpm build`) compares the
// source and dist counts -- so the warning reports a step this build
// deliberately undoes, and the real regression would be a check-dist warning.
//
// MIXED_EXPORTS: 19 entry modules export a default next to named exports, the
// normal shape for a component index. The fix rollup suggests --
// `output.exports: "named"` -- is wrong here: with preserveModules it also
// rewrites every default-ONLY module (each *.module.scss proxy, every icon)
// from `module.exports = x` to `exports.default = x`, so
// `require(".../components/text")` would start returning `{ default: ... }`.
// That is a breaking change to the published CJS surface, so keep rollup's
// current per-module interop and silence the notice.
const SILENCED_WARNINGS = new Set([
	"MODULE_LEVEL_DIRECTIVE",
	"MIXED_EXPORTS",
]);

const onwarn = (warning, warn) => {
	if (SILENCED_WARNINGS.has(warning.code)) return;
	warn(warning);
};

export default [
	{
		input: entryPoints,
		onwarn,
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
			detectUseClient(),
			preserveUseClient(),
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
				// Consumers import "@onlyoffice/apps-ui-kit/styles.css".
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
			addJsExtensionToDeepImports(),
		],
		external: isExternal,
	},
	// Declarations are emitted by `tsc -p tsconfig.build.json`, not bundled by
	// rollup-plugin-dts. The bundled form collapsed the whole library into a
	// single dist/types/index.d.ts, so a deep import such as
	// "@onlyoffice/apps-ui-kit/components/text" resolved JavaScript but no
	// types at all. tsc mirrors the source tree instead, matching the
	// preserveModules layout the JS output already uses.
];
