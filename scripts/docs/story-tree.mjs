// The Storybook sidebar, rebuilt from source without starting Storybook: the
// `title` of every CSF file and `<Meta title>` of every MDX page, ordered by
// the `storySort.order` literal in `.storybook/preview.tsx`.
//
// Reading source rather than a built `index.json` keeps `pnpm docs` a
// seconds-long step with no Vite in it. The price is that a title Storybook
// could compute and this cannot -- a variable, a template with a substitution,
// an auto-title from the path -- is reported instead of guessed.

import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

import { toPosix, walk } from "../lib/fs-ids.mjs";

const STORY_FILE = /\.stories\.(js|jsx|ts|tsx)$/;
const SKIP_DIRS = new Set(["node_modules", "dist", "storybook-static"]);

const unwrap = (node) => {
  let current = node;
  while (
    current &&
    (ts.isSatisfiesExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
};

const stringOf = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;

const findVariable = (source, name) => {
  let found;
  const visit = (node) => {
    if (found) return;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      found = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
};

/**
 * The `title` of a CSF file's default export, `undefined` when the file has
 * no default export, and `null` when it has one whose title is not a literal.
 */
export const csfTitle = (text, fileName = "story.tsx") => {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX,
  );

  const exported = source.statements.find(
    (statement) =>
      ts.isExportAssignment(statement) && !statement.isExportEquals,
  );
  if (!exported) return undefined;

  let meta = unwrap(exported.expression);
  if (meta && ts.isIdentifier(meta)) {
    meta = unwrap(findVariable(source, meta.text));
  }
  if (!meta || !ts.isObjectLiteralExpression(meta)) return null;

  const title = meta.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === "title",
  );

  return stringOf(title?.initializer) ?? null;
};

/** The `<Meta title="...">` of an MDX page, or `undefined` for `<Meta of={...}>`. */
export const mdxTitle = (text) =>
  /<Meta\s+title=(?:"([^"]+)"|'([^']+)'|\{\s*["'`]([^"'`]+)["'`]\s*\})/
    .exec(text)
    ?.slice(1)
    .find(Boolean);

const findProperty = (node, name) => {
  let found;
  const visit = (current) => {
    if (found) return;
    if (
      ts.isPropertyAssignment(current) &&
      (ts.isIdentifier(current.name) || ts.isStringLiteral(current.name)) &&
      current.name.text === name
    ) {
      found = current.initializer;
      return;
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return found;
};

/**
 * Evaluates `storySort.order` in the preview: strings, nested arrays, nothing
 * else -- the same restriction Storybook's own static read imposes.
 */
export const readStoryOrder = (text, fileName = "preview.tsx") => {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const storySort = unwrap(findProperty(source, "storySort"));
  const init =
    storySort && ts.isObjectLiteralExpression(storySort)
      ? unwrap(findProperty(storySort, "order"))
      : undefined;

  const evaluate = (node) => {
    const value = unwrap(node);
    const string = stringOf(value);
    if (string !== undefined) return string;
    if (value && ts.isArrayLiteralExpression(value)) {
      return value.elements.map(evaluate);
    }
    throw new Error(
      `${fileName}: storySort.order may hold only strings and arrays, found "${node.getText(source)}"`,
    );
  };

  if (!init) throw new Error(`${fileName}: no storySort.order`);
  return evaluate(init);
};

/**
 * Every Storybook entry under `dirs`: `{ title, file, dir, kind }`, with
 * `file` and `dir` POSIX paths relative to `root`.
 */
export const collectStories = (root, dirs, warn) => {
  const entries = [];

  for (const dir of dirs) {
    const base = path.join(root, dir);
    if (!fs.existsSync(base)) continue;

    for (const entry of walk(base, {
      sort: true,
      enterDir: (dirent) => !SKIP_DIRS.has(dirent.name),
    })) {
      if (entry.isDir) continue;
      const isStory = STORY_FILE.test(entry.name);
      const isMdx = entry.name.endsWith(".mdx");
      if (!isStory && !isMdx) continue;

      const file = toPosix(path.posix.join(dir, entry.id));
      const text = fs.readFileSync(entry.full, "utf8");
      const title = isStory ? csfTitle(text, entry.name) : mdxTitle(text);

      if (title === null) {
        warn(`${file}: the story title is not a string literal`);
        continue;
      }
      if (title === undefined) continue;

      entries.push({
        title,
        file,
        dir: path.posix.dirname(file),
        kind: isStory ? "story" : "mdx",
      });
    }
  }

  // Storybook's index order: the file paths in byte order, which puts
  // `aside/Aside.stories.tsx` before `aside/aside-header/` and
  // `rows/row-container/` before `rows/row/`.
  return entries.sort((a, b) =>
    a.file < b.file ? -1 : a.file > b.file ? 1 : 0,
  );
};

/**
 * Storybook's `storySort.order` semantics for one level: listed names first,
 * in the listed order, a `"*"` marking where unlisted ones go (the end when
 * absent); unlisted names keep the order they are given in.
 *
 * Returns the ordered names and, per name, the order of its children.
 */
export const orderLevel = (names, order = []) => {
  const listed = [];
  const children = new Map();

  for (let index = 0; index < order.length; index += 1) {
    const item = order[index];
    if (typeof item !== "string") continue;
    listed.push(item);
    if (Array.isArray(order[index + 1])) children.set(item, order[index + 1]);
  }

  const rest = names.filter((name) => !listed.includes(name));
  const present = listed.filter((name) => name !== "*" && names.includes(name));
  const star = listed.indexOf("*");
  let ordered;
  if (star === -1) {
    ordered = [...present, ...rest];
  } else {
    const before = listed.slice(0, star).filter((n) => names.includes(n));
    const after = listed.slice(star + 1).filter((n) => names.includes(n));
    ordered = [...before, ...rest, ...after];
  }

  return { ordered, children };
};

/** Storybook's id for a title: `UI/Form controls/Button` -> `ui-form-controls-button`. */
export const storyId = (title) =>
  title
    .split("/")
    .map((part) =>
      part
        .toLowerCase()
        .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .join("-");
