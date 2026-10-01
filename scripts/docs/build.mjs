// `pnpm docs:build`: everything the site needs, in one run -- the static
// Storybook, Playwright's Chromium if it is missing, the component pictures,
// then the pages. `pnpm docs:sync` adds the copy into the site checkout.
//
//   node scripts/docs/build.mjs [--reuse-storybook] [--sync]
//
// --reuse-storybook  keep an existing storybook-static instead of rebuilding
// --sync             copy site-docs/ into the api.onlyoffice.com checkout

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { ROOT } from "./config.mjs";

const args = process.argv.slice(2);
const known = ["--reuse-storybook", "--sync"];
const unknown = args.filter((arg) => !known.includes(arg));
if (unknown.length > 0) {
  console.error(
    `unknown option ${unknown.join(", ")}\nusage: node scripts/docs/build.mjs [${known.join("] [")}]`,
  );
  process.exit(2);
}

const STORYBOOK_INDEX = path.join(ROOT, "storybook-static", "index.json");

const run = (title, command, argv) => {
  console.log(`\n== ${title}\n`);
  execFileSync(command, argv, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
};

const started = Date.now();

if (args.includes("--reuse-storybook") && fs.existsSync(STORYBOOK_INDEX)) {
  console.log("== Storybook: reusing storybook-static");
} else {
  run("Storybook", "pnpm", ["storybook-build", "--quiet"]);
}

// Idempotent: a present browser is a no-op. --with-deps installs the system
// libraries a bare CI image lacks; it needs root, which a developer's
// machine does not give it.
run("Chromium", "pnpm", [
  "exec",
  "playwright",
  "install",
  ...(process.env.CI ? ["--with-deps"] : []),
  "chromium",
]);

run("Pictures", "node", ["scripts/docs/screenshots.mjs"]);
run("Pages", "node", ["scripts/docs/index.mjs", "--strict"]);
if (args.includes("--sync")) run("Sync", "node", ["scripts/docs/sync.mjs"]);

console.log(`\nDone in ${Math.round((Date.now() - started) / 1000)}s.`);
