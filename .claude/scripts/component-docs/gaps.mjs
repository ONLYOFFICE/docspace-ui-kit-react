// Which components are missing the documentation the package ships.
//
// `files` in package.json publishes components/**/README.md, so a missing
// README is a gap in the artifact, not just in this checkout. A missing story
// is a component nobody can look at. Neither is checked by anything.
//
//   node .claude/scripts/component-docs/gaps.mjs
//   node .claude/scripts/component-docs/gaps.mjs --json
//
// Exit 1 when anything is missing. Stories are searched recursively: table,
// rows and tiles keep theirs in subdirectories.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const COMPONENTS = path.join(ROOT, "components");

const anyFile = (dir, predicate) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (anyFile(path.join(dir, entry.name), predicate)) return true;
    } else if (predicate(entry.name)) {
      return true;
    }
  }
  return false;
};

const rows = [];
for (const entry of fs.readdirSync(COMPONENTS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(COMPONENTS, entry.name);

  rows.push({
    name: entry.name,
    readme: fs.existsSync(path.join(dir, "README.md")),
    story: anyFile(dir, (f) => f.endsWith(".stories.tsx")),
    test: anyFile(dir, (f) => /\.test\.tsx?$/i.test(f)),
    // A README that is only a heading is a gap wearing a filename.
    thin:
      fs.existsSync(path.join(dir, "README.md")) &&
      fs.readFileSync(path.join(dir, "README.md"), "utf8").trim().split("\n")
        .length < 5,
  });
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const missing = (key) => rows.filter((r) => !r[key]).map((r) => r.name);

const noReadme = missing("readme");
const noStory = missing("story");
const noTest = missing("test");
const thin = rows.filter((r) => r.thin).map((r) => r.name);

console.log(`${rows.length} components`);
console.log(
  `  ${rows.length - noReadme.length} with a README, ` +
    `${rows.length - noStory.length} with a story, ` +
    `${rows.length - noTest.length} with a test`,
);

const list = (title, names, note) => {
  if (!names.length) return;
  console.log(`\n${title} (${names.length}):`);
  for (const name of names) console.log(`  components/${name}/`);
  if (note) console.log(`  ${note}`);
};

list(
  "No README -- these ship in the package with no documentation",
  noReadme,
  "package.json publishes components/**/README.md.",
);
list("README shorter than five lines", thin);
list("No story", noStory, "Every component needs one; stories carry the docs.");
list(
  "No test",
  noTest,
  "Tolerated. An untested change to interactive logic is not.",
);

process.exit(noReadme.length || noStory.length ? 1 : 0);
