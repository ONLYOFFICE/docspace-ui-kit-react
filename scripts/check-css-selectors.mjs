#!/usr/bin/env node
/**
 * Fails when a stylesheet matches on the `class` or `style` attribute --
 * `[class*="buttonsContainer"]`, `[style*="display: none"]` -- outside the
 * baseline. `.claude/rules/css-selectors.md` says why: such a selector turns
 * any change below it into a restyle of every element that has a class, and two
 * of them cost a scrolled list most of its frame time.
 *
 * `scripts/css-selectors-allowlist.json` holds the places that still do it, as
 * file -> how many lines. It must only ever shrink: a file with more lines than
 * it allows fails, and so does one with fewer, until the count is lowered, so a
 * fix cannot leave room for the next one to slip in.
 *
 * Tracked files only (`git ls-files`), so dist/, node_modules/ and anything
 * generated are out of it without a list of exclusions.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { findSlowSelectors } from "./lib/css-selectors.mjs";

const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
const allowlistPath = path.join(
  repoRoot,
  "scripts/css-selectors-allowlist.json",
);
const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));

const files = execFileSync("git", ["ls-files", "-z", "--", "*.scss", "*.css"], {
  cwd: repoRoot,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const found = new Map();
for (const file of files) {
  const hits = findSlowSelectors(
    fs.readFileSync(path.join(repoRoot, file), "utf8"),
  );
  if (hits.length) found.set(file, hits);
}

const problems = [];
for (const [file, hits] of found) {
  const allowed = allowlist[file] ?? 0;
  if (hits.length > allowed) {
    problems.push(
      `${file}: ${hits.length} line(s) match on class or style, ${allowed} allowed\n` +
        hits.map(({ line, text }) => `    ${line}: ${text}`).join("\n"),
    );
  }
}
for (const [file, allowed] of Object.entries(allowlist)) {
  const count = found.get(file)?.length ?? 0;
  if (count < allowed) {
    problems.push(
      `${file}: ${count} line(s) left of ${allowed} allowed -- lower it in ` +
        `scripts/css-selectors-allowlist.json (remove the entry at 0)`,
    );
  }
}

if (problems.length) {
  console.error(
    "Selectors on the class or style attribute restyle every element with a " +
      "class on each change below them. Give the element a class of its own " +
      "and match that (.claude/rules/css-selectors.md).\n\n" +
      problems.join("\n\n"),
  );
  process.exit(1);
}

console.log(
  `${files.length} stylesheet(s) checked: no new selector on class or style ` +
    `(${Object.keys(allowlist).length} file(s) in the baseline).`,
);
