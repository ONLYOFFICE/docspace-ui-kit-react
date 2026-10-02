// The marker import has to survive the round trip on every platform. On
// Windows a module id carries backslashes, `JSON.stringify` doubles them on
// the way into the chunk, and reading them back gave a different string than
// the map was keyed by -- the build failed on the first stylesheet it reached.
// CI runs on Linux, where no backslash exists, so only a test can hold this.
import { describe, expect, it } from "vitest";

import { perModuleCss } from "./per-module-css.mjs";

/**
 * Drives the plugin the way rollup does, with ids in the shape a platform
 * produces. The fixture is a `.module.css`: the plugin compiles `.scss` by
 * reading it off disk, and a Windows-shaped path cannot exist on a POSIX
 * machine -- CSS takes the code it is handed, which is all this test needs.
 */
const run = async ({ sep }) => {
  const root = sep === "\\" ? "C:\\repo" : "/repo";
  const id = [root, "components", "button", "Button.module.css"].join(sep);

  const plugin = perModuleCss({ generateScopedName: "dsui-[local]", root });
  const transformed = await plugin.transform.call(
    {
      addWatchFile() {},
      error: (m) => {
        throw new Error(m);
      },
    },
    ".button { color: red }",
    id,
  );

  const chunk = {
    type: "chunk",
    fileName: "components/button/Button.module.css/index.js",
    code: transformed.code,
  };
  const emitted = [];

  plugin.generateBundle.call(
    {
      emitFile: (file) => emitted.push(file),
      error: (m) => {
        throw new Error(m);
      },
    },
    {},
    { [chunk.fileName]: chunk },
  );

  return { chunk, emitted };
};

describe("perModuleCss", () => {
  it.each([
    ["posix ids", "/"],
    ["windows ids", "\\"],
  ])(
    "emits the stylesheet and rewrites the import for %s",
    async (_name, sep) => {
      const { chunk, emitted } = await run({ sep });

      expect(emitted).toHaveLength(1);
      expect(emitted[0].fileName).toBe(
        "components/button/Button.module.css/index.css",
      );
      expect(emitted[0].source).toContain("color: red");
      expect(chunk.code).toMatch(/^import "\.\/index\.css";/);
      expect(chunk.code).not.toContain("per-module-css:");
    },
  );
});
