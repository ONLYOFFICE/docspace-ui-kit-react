import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { glob } from "glob";

// get all index.ts files from subfolders
const ignorePatterns = [
  "**/*.test.{ts,tsx}",
  "**/*.spec.{ts,tsx}",
  "**/*.stories.{ts,tsx}",
];

const componentEntries = glob.sync("components/*/index.ts", {
  ignore: ignorePatterns,
});
const hookEntries = glob.sync("hooks/*/index.ts", { ignore: ignorePatterns });
const providerEntries = glob.sync("providers/*/index.ts", {
  ignore: ignorePatterns,
});
const utilEntries = glob.sync("utils/*/index.ts", { ignore: ignorePatterns });
const contextEntries = glob.sync("context/*/index.ts", {
  ignore: ignorePatterns,
});
const enumEntries = glob.sync("enums/*/index.ts", { ignore: ignorePatterns });
const constantEntries = glob.sync("constants/*/index.ts", {
  ignore: ignorePatterns,
});
const typeEntries = glob.sync("types/*/index.ts", { ignore: ignorePatterns });
const errorEntries = glob.sync("errors/*/index.ts", { ignore: ignorePatterns });

// merge all entry points
const allEntries = [
  "index.ts",
  "components/index.ts",
  "hooks/index.ts",
  "providers/index.ts",
  "utils/index.ts",
  "context/index.ts",
  "enums/index.ts",
  "constants/index.ts",
  "types/index.ts",
  "errors/index.ts",
  ...componentEntries,
  ...hookEntries,
  ...providerEntries,
  ...utilEntries,
  ...contextEntries,
  ...enumEntries,
  ...constantEntries,
  ...typeEntries,
  ...errorEntries,
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
    external: [/\.scss$/, /\.css$/, /\.svg$/, /node_modules/],
  },
];
