import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import nodePolyfills from "rollup-plugin-polyfill-node";
import url from "@rollup/plugin-url";
import alias from "@rollup/plugin-alias";
import { glob } from "glob";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../../public");

const ignorePatterns = [
  "**/*.test.{ts,tsx}",
  "**/*.spec.{ts,tsx}",
  "**/*.stories.{ts,tsx}",
  "**/*.d.ts",
];

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// Derive entry points from package.json exports — single source of truth
const allEntries = [
  ...new Set(
    Object.values(pkg.exports).flatMap((entry) => {
      const source = entry.source?.replace(/^\.\//, "");
      if (!source) return [];
      if (source.includes("*")) {
        return glob.sync(source, { ignore: ignorePatterns });
      }
      return [source];
    }),
  ),
];

export default [
  {
    input: allEntries,
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
      alias({
        entries: [{ find: "PUBLIC_DIR", replacement: publicDir }],
      }),
      peerDepsExternal(),
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        browser: true,
        preferBuiltins: false,
      }),
      nodePolyfills(),
      url({
        include: [
          "**/*.png",
          "**/*.jpg",
          "**/*.jpeg",
          "**/*.gif",
          "**/*.webp",
          "**/*.ico",
        ],
      }),
      svgr(),
      json(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: false,
        declarationDir: undefined,
      }),
      terser(),
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
  {
    input: allEntries,
    output: {
      dir: "dist/types",
      preserveModules: true,
      preserveModulesRoot: ".",
    },
    plugins: [
      url(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: true,
        declarationDir: "dist/types",
        emitDeclarationOnly: true,
        outDir: "dist/types",
      }),
      // Custom plugin to keep only .d.ts files
      {
        name: "keep-only-dts-files",
        generateBundle(options, bundle) {
          for (const fileName in bundle) {
            if (!fileName.endsWith(".d.ts")) {
              delete bundle[fileName];
            }
          }
        },
      },
    ],
    external: [/\.scss$/, /\.css$/, /\.svg$/, /\.ico$/, /node_modules/],
  },
];
