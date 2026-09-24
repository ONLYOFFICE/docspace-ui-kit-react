// Writes the prop tables of the component READMEs, between the `props:start` /
// `props:end` and `enums:start` / `enums:end` markers.
//
//   pnpm readme:props --write                      every component
//   pnpm readme:props --write --only button        one, folder name or path
//   pnpm readme:props:check                        fails when a table is stale
//
// The tables are generated because the hand-written ones drifted: Button's
// omitted `accent`, Section's listed six props against roughly 129 in the type,
// Selector's 58 against 360. A description therefore has exactly one home --
// the JSDoc on the prop -- which is also what Storybook's autodocs reads, so
// the README and the story can no longer disagree.
//
// What a block should say is decided in `lib/readme-tables.mjs`, which
// `check-readme.mjs` calls too.

import fs from "node:fs";
import path from "node:path";

import {
  ROOT,
  componentFolders,
  createReadmeProgram,
} from "./lib/readme-program.mjs";
import {
  PROPS_BLOCK,
  formatMarkdown,
  renderBlocks,
  resolveBlocks,
} from "./lib/readme-tables.mjs";

const usage = () => {
  console.error(
    "usage: node scripts/readme-props.mjs (--write | --check) [--only <folder>...]",
  );
  process.exit(2);
};

const parseArgs = (argv) => {
  const options = { write: false, check: false, only: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--write") options.write = true;
    else if (arg === "--check") options.check = true;
    else if (arg === "--only") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        options.only.push(argv[(i += 1)]);
      }
    } else usage();
  }

  if (options.write === options.check) usage();
  return options;
};

/** `button`, `components/button` and `components\button` all name the folder. */
const normaliseFolder = (input) => {
  const posix = input.replaceAll("\\", "/").replace(/\/$/, "");
  return posix.startsWith("components/") ? posix : `components/${posix}`;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const folders =
    options.only.length > 0
      ? options.only.map(normaliseFolder)
      : componentFolders();

  const withReadme = folders.filter((folder) =>
    fs.existsSync(path.join(ROOT, folder, "README.md")),
  );

  // Every component, whatever `--only` asked for: the program is what the
  // tables are derived from, and narrowing it changes them. With text-input
  // alone the type printed `Ref<HTMLInputElement>` and counted 285 inherited
  // React props; with all 99 loaded, `React.Ref<HTMLInputElement>` and 299. A
  // pre-push `--only` run would then write a table CI reports as stale. The
  // whole program costs about three seconds.
  const kit = createReadmeProgram();

  const stale = [];
  const failed = [];
  let written = 0;

  for (const folder of withReadme) {
    const file = path.join(ROOT, folder, "README.md");
    const readme = fs.readFileSync(file, "utf8");

    if (!PROPS_BLOCK.test(readme)) continue;
    PROPS_BLOCK.lastIndex = 0;

    let blocks;
    try {
      blocks = resolveBlocks(kit, folder, readme);
    } catch (error) {
      failed.push(`${folder}: ${error.message}`);
      continue;
    }

    const formatted = await formatMarkdown(renderBlocks(readme, blocks), file);
    if (formatted === readme) continue;

    if (options.write) {
      fs.writeFileSync(file, formatted, "utf8");
      written += 1;
      console.log(`wrote ${folder}/README.md`);
    } else {
      stale.push(folder);
    }
  }

  for (const message of failed) console.error(`error  ${message}`);

  if (options.check && stale.length > 0) {
    console.error(
      `\n${stale.length} README prop table(s) are out of date:\n` +
        stale.map((folder) => `  ${folder}/README.md`).join("\n") +
        "\n\nRun `pnpm readme:props --write` and commit the result. Do not edit " +
        "between the markers by hand -- change the JSDoc on the prop instead.",
    );
    process.exit(1);
  }

  if (failed.length > 0) process.exit(2);

  console.log(
    options.write
      ? `${written} README(s) updated, ${withReadme.length - written} already current.`
      : `${withReadme.length} README(s) checked, every prop table is current.`,
  );
};

await main();
