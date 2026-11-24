// Reads the kit's SCSS and records every declaration with where it is, so
// the design system's tokens can be taken from what the code really uses -
// nothing picked, named or rounded by hand.
//
// scanScss(repo) -> { palette, decls }
//   palette: Map<name, {value, line}> from styles/variables/_colors.scss
//   decls:   [{file, line, prop, raw, value, refs, dark, block}] for every
//            declaration in SOURCE_DIRS (custom properties
//            included); `value` has palette and file-local Sass variables
//            substituted, `refs` lists the palette names it used, `dark` is
//            true inside a `.dark` block.
import fs from "node:fs";
import path from "node:path";

const COLORS = path.join("styles", "variables", "_colors.scss");
// Every folder whose code ships in the package.
export const SOURCE_DIRS = [
  "components",
  "styles",
  "errors",
  "selectors",
  "ai-agent",
  "billing",
  "uploader",
  "document-editor",
];

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".scss") && !e.name.includes(".stories."))
      out.push(p);
  }
  return out;
};

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// Blank out comments but keep offsets, so line numbers stay true.
const stripComments = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - 1));

const readVars = (text) => {
  const vars = new Map();
  for (const m of text.matchAll(/^\$([a-z0-9_-]+):\s*([^;]+);/gim))
    vars.set(m[1], { value: m[2].trim(), line: lineOf(text, m.index) });
  return vars;
};

export function scanScss(repo) {
  const colorsText = stripComments(
    fs.readFileSync(path.join(repo, COLORS), "utf8"),
  );
  const palette = readVars(colorsText);
  // A palette entry may name another one.
  for (const [, v] of palette)
    v.value = v.value.replace(
      /\$([a-z0-9_-]+)/gi,
      (m, n) => palette.get(n)?.value ?? m,
    );

  const files = SOURCE_DIRS.filter((d) => fs.existsSync(path.join(repo, d)))
    .flatMap((d) => walk(path.join(repo, d)))
    .filter((f) => path.relative(repo, f) !== COLORS);

  const decls = [];
  for (const abs of files) {
    const file = path.relative(repo, abs).split(path.sep).join("/");
    const text = stripComments(fs.readFileSync(abs, "utf8"));
    const local = readVars(text);
    const resolve = (raw) => {
      const refs = [];
      let value = raw;
      for (let i = 0; i < 5 && /\$[a-z]/i.test(value); i++)
        value = value.replace(
          /#\{\s*(?:[a-z]+\.)?\$([a-z0-9_-]+)\s*\}|(?:[a-z]+\.)?\$([a-z0-9_-]+)/gi,
          (m, a, b) => {
            const n = a || b;
            if (palette.has(n)) {
              refs.push(n);
              return palette.get(n).value;
            }
            if (local.has(n)) return local.get(n).value;
            return m;
          },
        );
      return { value: value.replace(/#\{([^}]*)\}/g, "$1"), refs };
    };

    const stack = [];
    let blockId = 0;
    const ids = [];
    let start = 0;
    let depthParen = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === "(") depthParen++;
      else if (ch === ")") depthParen--;
      else if (depthParen > 0) continue;
      else if (ch === "{" && text[i - 1] !== "#") {
        stack.push(text.slice(start, i).trim());
        ids.push(++blockId);
        start = i + 1;
      } else if (ch === "}") {
        if (text[i - 1] === "#" || /#\{[^}]*$/.test(text.slice(start, i)))
          continue;
        flush(text.slice(start, i), start);
        stack.pop();
        ids.pop();
        start = i + 1;
      } else if (ch === ";") {
        flush(text.slice(start, i), start);
        start = i + 1;
      }
    }

    function flush(chunk, at) {
      const m = /^\s*([a-z-][a-z0-9-]*)\s*:\s*([\s\S]+?)\s*$/i.exec(chunk);
      if (!m || m[1].startsWith("@") || stack.length === 0) return;
      const { value, refs } = resolve(m[2].replace(/\s+/g, " "));
      decls.push({
        file,
        line: lineOf(text, at + chunk.search(/\S/)),
        prop: m[1].toLowerCase(),
        raw: m[2].replace(/\s+/g, " "),
        value,
        refs,
        block: `${file}#${ids.at(-1)}`,
        dark: stack.some((s) => /(^|[\s,(.])\.?dark\b|\.dark\b/.test(s)),
      });
    }
  }
  return { palette, decls };
}
