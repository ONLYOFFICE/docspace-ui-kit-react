// `export * from "./x"` carries every named export of `x` and silently drops
// its default. Ten component folders export their component only by default;
// six of them were re-exported by name and four -- section, filter, navigation,
// status-message -- were not, so the component was missing from the root barrel,
// and therefore from the plugin API, while tsc, the build and every other check
// passed. This test holds the rule for all folders at once.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const COMPONENTS = path.resolve(__dirname);
const BARREL = path.join(COMPONENTS, "index.ts");

const folderIndex = (dir: string) =>
  ["index.ts", "index.tsx"]
    .map((file) => path.join(COMPONENTS, dir, file))
    .find((file) => fs.existsSync(file));

const folders = fs
  .readdirSync(COMPONENTS, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ dir: entry.name, index: folderIndex(entry.name) }))
  .filter((folder): folder is { dir: string; index: string } =>
    Boolean(folder.index),
  );

const load = () => {
  const root = path.resolve(COMPONENTS, "..");
  const configPath = ts.findConfigFile(
    root,
    ts.sys.fileExists,
    "tsconfig.json",
  );
  if (!configPath) throw new Error("tsconfig.json not found");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);

  const program = ts.createProgram({
    rootNames: [BARREL, ...folders.map((folder) => folder.index)],
    options: { ...parsed.options, noEmit: true, skipLibCheck: true },
  });
  const checker = program.getTypeChecker();

  const moduleOf = (file: string) => {
    const source = program.getSourceFile(file);
    const symbol = source && checker.getSymbolAtLocation(source);
    if (!symbol) throw new Error(`${file} resolved to no module`);
    return symbol;
  };

  const resolve = (symbol: ts.Symbol) =>
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;

  const reachable = new Set(
    checker.getExportsOfModule(moduleOf(BARREL)).map(resolve),
  );

  const defaultOf = (file: string) => {
    const symbol = checker
      .getExportsOfModule(moduleOf(file))
      .find((exported) => exported.escapedName === "default");
    return symbol && resolve(symbol);
  };

  return { reachable, defaultOf };
};

describe("components/index.ts", () => {
  it("re-exports the default export of every component folder by some name", () => {
    const { reachable, defaultOf } = load();

    const dropped = folders
      .filter((folder) => {
        const target = defaultOf(folder.index);
        return target && !reachable.has(target);
      })
      .map((folder) => folder.dir);

    // Fix with `export { default as Name } from "./<dir>";` next to the
    // `export *` line, which still carries the folder's named exports.
    expect(dropped).toEqual([]);
  }, 60_000);
});
