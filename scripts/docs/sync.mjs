// `pnpm docs:sync`: replaces the section in an api.onlyoffice.com checkout with
// the pages `pnpm docs` wrote. A local copy into that repository, not a
// deploy -- the result is reviewed and committed there.
//
// The checkout is expected beside this one; API_SITE_ROOT overrides that.

import fs from "node:fs";
import path from "node:path";

import {
  OUT_DIR,
  ROOT,
  SIDEBAR_FILE,
  SITE_SECTION,
  siteRoot,
} from "./config.mjs";

const source = path.join(ROOT, OUT_DIR);
const site = siteRoot();
const target = path.join(site, "site", ...SITE_SECTION.split("/"));

if (!fs.existsSync(path.join(source, SIDEBAR_FILE))) {
  console.error(
    `${OUT_DIR}/ is missing or incomplete -- run \`pnpm docs\` first`,
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(site, ".git"))) {
  console.error(
    `api.onlyoffice.com checkout not found at ${site} -- clone it beside this ` +
      "repository or point API_SITE_ROOT at it",
  );
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log(`Docs synced to ${path.relative(ROOT, target) || target}`);
