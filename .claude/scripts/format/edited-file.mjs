#!/usr/bin/env node
/**
 * PostToolUse hook: runs Prettier over the file Claude just wrote.
 *
 * Claude Code hands the hook its JSON payload on stdin. The file is formatted
 * with the repository's own Prettier and configuration, so a file Claude writes
 * is byte-identical to one a developer saved in VS Code or ran `pnpm format:fix`
 * over -- which is the point: without this the editor and the pre-commit hook
 * keep correcting Claude's output, and every diff carries formatting noise that
 * hides the real change.
 *
 * Node, not a shell pipeline: this repository's gate runs on Windows too (see
 * .claude/rules/cross-platform.md), and `jq` is not there. Prettier is invoked
 * through process.execPath and its own .cjs entry point rather than the
 * node_modules/.bin shim, which is a shell script on POSIX and a .cmd on
 * Windows.
 *
 * It never fails the tool call: a file Prettier cannot parse -- mid-edit, or a
 * language it has no parser for -- is left exactly as Claude wrote it.
 */

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/** The repository root: this file is at .claude/scripts/format/ within it. */
const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../../../..");

/** Reads the whole of stdin. Returns "" when the hook is run with none. */
function readStdin() {
  const chunks = [];
  const buffer = Buffer.alloc(65536);
  const fd = 0;
  const fs = createRequire(import.meta.url)("node:fs");

  while (true) {
    let read = 0;
    try {
      read = fs.readSync(fd, buffer, 0, buffer.length, null);
    } catch (error) {
      // EAGAIN on a non-blocking pipe, EOF on some platforms.
      if (error.code === "EAGAIN") continue;
      break;
    }
    if (read === 0) break;
    chunks.push(Buffer.from(buffer.subarray(0, read)));
  }

  return Buffer.concat(chunks).toString("utf8");
}

const raw = readStdin().trim();
if (!raw) process.exit(0);

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0);
}

// Write and Edit report the path they touched in slightly different places.
const target =
  payload?.tool_response?.filePath ??
  payload?.tool_input?.file_path ??
  payload?.tool_input?.notebook_path;

if (typeof target !== "string" || target.length === 0) process.exit(0);

const absolute = path.resolve(repoRoot, target);

// Only ever format inside this repository. Claude can edit files elsewhere --
// another checkout, a scratch directory -- and those are not ours to rewrite.
const relative = path.relative(repoRoot, absolute);
if (relative.startsWith("..") || path.isAbsolute(relative)) process.exit(0);

let prettierBin;
try {
  prettierBin = createRequire(import.meta.url).resolve(
    "prettier/bin/prettier.cjs",
  );
} catch {
  // Dependencies are not installed; nothing to do and nothing to complain about.
  process.exit(0);
}

// --ignore-unknown covers the extensions Prettier has no parser for (.svg,
// images, .txt). .prettierignore is read by Prettier itself, so pnpm-lock.yaml,
// locales/, css/ and *.mdx are skipped here exactly as `pnpm format` skips them.
spawnSync(
  process.execPath,
  [prettierBin, "--write", "--ignore-unknown", absolute],
  { cwd: repoRoot, stdio: "ignore" },
);

process.exit(0);
