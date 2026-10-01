// The shape of a Storybook MDX page: its imports, what `<Meta>` points at,
// and every JSX element at the top level, which is what the site cannot
// render and photographs instead.

import { splitLines } from "./markdown.mjs";

const IMPORT = /^import\s+([\s\S]*?)\s+from\s+["']([^"']+)["'];?\s*$/;

/**
 * @typedef {Object} Block
 * @property {string} tag        the element's name
 * @property {string} [of]       the `of={X.Y}` expression's text
 * @property {Record<string,string>} attrs  string attributes
 * @property {Record<string,string>} expressions  `name={identifier}` attributes
 * @property {number} start      first line (0-based)
 * @property {number} end        last line, inclusive
 */

/**
 * Parses a page into `{ imports, metaOf, metaTitle, blocks, lines }`:
 * `imports` maps a local name to its module, `metaOf` is the local name
 * `<Meta of={…}>` uses, `metaTitle` the `<Meta title>`, and `blocks` every
 * top-level JSX element in order, fenced code left alone.
 */
export const parseMdx = (text) => {
  const lines = splitLines(text);
  const imports = new Map();
  const blocks = [];
  let metaOf;
  let metaTitle;

  for (let index = 0; index < lines.length; index += 1) {
    const { text: line, code } = lines[index];
    if (code) continue;

    if (/^import\s/.test(line)) {
      let statement = line;
      let last = index;
      while (
        !/\bfrom\s+["'][^"']+["'];?\s*$/.test(statement) &&
        last + 1 < lines.length
      ) {
        last += 1;
        statement += `\n${lines[last].text}`;
      }
      const match = IMPORT.exec(statement);
      if (match) {
        const [, clause, module] = match;
        const star = /\*\s+as\s+(\w+)/.exec(clause);
        if (star) imports.set(star[1], module);
        const def = /^(\w+)\s*(?:,|$)/.exec(clause.trim());
        if (def) imports.set(def[1], module);
        const named = /\{([^}]*)\}/.exec(clause);
        if (named) {
          for (const part of named[1].split(",")) {
            const name = part
              .trim()
              .split(/\s+as\s+/)
              .at(-1);
            if (name) imports.set(name, module);
          }
        }
      }
      blocks.push({ tag: "import", attrs: {}, start: index, end: last });
      index = last;
      continue;
    }

    // A React element, or an HTML element with a JSX expression in it --
    // `<img src={walkthrough} />` -- which the site cannot evaluate either.
    const open = /^<([A-Za-z][\w.]*)(\s|\/?>|$)/.exec(line);
    if (!open) continue;
    if (/^[a-z]/.test(open[1]) && !/=\{/.test(line) && />/.test(line)) continue;

    // The element ends where its depth returns to zero: `<X` opens, `/>`
    // and `</X>` close. Attributes do not contain `<` on these pages.
    let depth = 0;
    let last = index;
    let source = "";
    for (let cursor = index; cursor < lines.length; cursor += 1) {
      const current = lines[cursor].text;
      source += `${cursor === index ? "" : "\n"}${current}`;
      for (const token of current.matchAll(/<\/?[A-Za-z][\w.]*|\/>|>/g)) {
        if (token[0].startsWith("</")) depth -= 1;
        else if (token[0].startsWith("<")) depth += 1;
        else if (token[0] === "/>") depth -= 1;
      }
      last = cursor;
      if (depth <= 0) break;
    }

    const tag = open[1];
    const attrs = {};
    for (const attr of source.matchAll(/(\w[\w-]*)=(?:"([^"]*)"|'([^']*)')/g)) {
      attrs[attr[1]] = attr[2] ?? attr[3];
    }
    const of = /\bof=\{\s*([\w.]+)\s*\}/.exec(source)?.[1];
    const expressions = {};
    for (const attr of source.matchAll(/(\w[\w-]*)=\{\s*([\w.]+)\s*\}/g)) {
      expressions[attr[1]] = attr[2];
    }

    if (tag === "Meta") {
      metaOf = of;
      metaTitle = attrs.title;
    }
    blocks.push({ tag, of, attrs, expressions, start: index, end: last });
    index = last;
  }

  return { imports, metaOf, metaTitle, blocks, lines };
};
