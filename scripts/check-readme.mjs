// Checks the component READMEs against the contract in `COMPONENT_README_TEMPLATE.md`.
//
//   pnpm check:readme                     every component
//   pnpm check:readme --only button       one, folder name or path
//   pnpm check:readme --json              machine-readable findings
//   pnpm check:readme --style-all         style warnings for every folder
//   pnpm check:readme --base HEAD^1       style warnings for what changed since a ref
//
// Everything it checks is something a reader of the README would otherwise get
// wrong. The metadata block is derived truth wherever it can be: whether the
// folder is in the barrel, whether its index has a default export, which names
// it really exports, and -- the one that started this -- which prop shows and
// hides the component. The kit calls that prop `visible`, `isVisible`, `isOpen`
// and `open` in different folders, and a reader who guesses wrong gets an
// ignored prop and no error at all, so `state.visibility` is checked against
// the resolved props rather than believed.
//
// The section list and its order come from `COMPONENT_README_TEMPLATE.md`, which is the
// source of truth for what a component's documentation says; the authoring rule
// and the `component-docs` skill were rewritten to match rather than the other
// way round.
//
// The style warnings -- W_LONG_SENTENCE, W_LONG_TEXT, W_TAUTOLOGICAL_PROP,
// W_LIVE_ONLY_TEXT --
// measure the prose against `.claude/rules/doc-writing.md`. Most of the library
// predates that rule, so by default they are printed only for the folders the
// branch changed, and the rest are counted in one line: text is brought within
// the limits when its component is touched, not in one sweep.
//
// Where the branch began is found from the long-lived branches on origin, which
// a CI checkout does not have. `--base` names the branch it left instead -- CI
// passes the pull request's target, `origin/<base_ref>` -- and the scope starts
// at their merge base. That holds whether the checkout is the pull request's
// head (Gitea) or a merge commit (GitHub), and after a merge from the target.

import fs from "node:fs";
import path from "node:path";

import * as ts from "typescript";

import {
  LIMITS,
  excerpt,
  isTautological,
  liveOnlyPhrase,
  longSentences,
  markdownProse,
  storyTexts,
  wordCount,
} from "./lib/doc-style.mjs";
import {
  baseAgainst,
  changesSince,
  findBranchBase,
  isCommit,
} from "./lib/push-base.mjs";
import {
  ROOT,
  createExampleProgram,
  createReadmeProgram,
  documentedFolders,
} from "./lib/readme-program.mjs";
import {
  isProvider,
  parseMetadata,
  validateMetadata,
} from "./lib/readme-meta.mjs";
import {
  PROPS_BLOCK,
  formatMarkdown,
  renderBlocks,
  resolveBlocks,
} from "./lib/readme-tables.mjs";

const PACKAGE = "@onlyoffice/apps-ui-kit";

const ALLOWLIST = path.join(ROOT, "scripts", "readme-allowlist.json");

// Outside the repository tree, so nothing has to be added to `.gitignore` and
// no stale extraction can be mistaken for a source file.
const CACHE = path.join(ROOT, "node_modules", ".cache", "readme-check");

// A specifier only a consumer's bundler resolves. Without a declaration for it
// every example that imports an icon fails to compile here for a reason that
// says nothing about the example.
const CONSUMER_AMBIENT = `declare module "*.svg?react" {
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
`;

// Text that cannot appear in a README a consumer reads. Each is something that
// resolves only inside DocSpace-client, or names a package or a technology this
// one no longer ships.
const FORBIDDEN = [
  {
    pattern: /PUBLIC_DIR/,
    message:
      "`PUBLIC_DIR` is a DocSpace-client webpack alias and does not resolve for a consumer; use the consumer's own SVG or an asset subpath",
  },
  {
    pattern: /@docspace\/ui-kit/,
    message: `\`@docspace/ui-kit\` is the old name of this package; it is \`${PACKAGE}\``,
  },
  {
    pattern: /libs\/ui-kit/,
    message:
      "`libs/ui-kit` is a path inside DocSpace-client, not of this package",
  },
  {
    pattern: /styled-components/,
    message:
      "styled-components is not used by this package; styling is CSS modules and custom properties",
  },
  {
    pattern: new RegExp(`${PACKAGE.replace("/", "\\/")}\\/dist\\/`),
    message:
      "never document a path into `dist/`; the `exports` map is the public surface",
  },
];

const usage = () => {
  console.error(
    "usage: node scripts/check-readme.mjs [--only <folder>...] [--compile] [--json] [--style-all] [--base <ref>]",
  );
  process.exit(2);
};

const parseArgs = (argv) => {
  const options = {
    only: [],
    json: false,
    compile: false,
    styleAll: false,
    base: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") options.json = true;
    else if (arg === "--compile") options.compile = true;
    else if (arg === "--style-all") options.styleAll = true;
    else if (arg === "--base") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) usage();
      options.base = argv[(i += 1)];
    } else if (arg === "--only") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        options.only.push(argv[(i += 1)]);
      }
    } else usage();
  }

  return options;
};

const normaliseFolder = (input) => {
  const posix = input.replaceAll("\\", "/").replace(/\/$/, "");
  // A bare name is a component, which is what `--only button` has always meant;
  // a provider has to be named with its root, as `--only providers/theme`.
  return /^(components|providers)\//.test(posix)
    ? posix
    : `components/${posix}`;
};

const readAllowlist = () => {
  if (!fs.existsSync(ALLOWLIST)) return new Set();

  return new Set(JSON.parse(fs.readFileSync(ALLOWLIST, "utf8")));
};

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/** The `# Heading` and the paragraph under it. */
const headingAndLead = (readme) => {
  const match = /^#\s+(.+?)\s*$\n+([\s\S]*?)(?=\n\s*\n|\n##\s)/m.exec(readme);
  if (!match) return { heading: null, lead: null };

  return { heading: match[1], lead: match[2].replace(/\s+/g, " ").trim() };
};

// The `##` sections, in the order `COMPONENT_README_TEMPLATE.md` puts them. `when` is
// what makes a conditional section required and forbidden otherwise; a section
// without it is mandatory.
const SECTIONS = [
  { title: "Use this when / not when" },
  { title: "Import" },
  { title: "Minimal example" },
  {
    title: "Props",
    when: (meta) => meta.propsType !== null,
    because: "the component has props of its own",
  },
  { title: "Recipes" },
  { title: "Behaviour the types don't state" },
  {
    title: "Sub-components",
    when: (meta) => (meta.subComponents ?? []).length > 0,
    because: "`subComponents` in the metadata is not empty",
  },
  { title: "CSS variables", optional: true },
  { title: "Accessibility" },
  {
    title: "Test ids",
    when: (meta) => !isProvider(meta),
    because: "a component renders an element that a test has to find",
  },
  { title: "Related" },
];

// Story titles map to categories rather than defining them: the titles carry
// thirteen variants today, including two spellings of the same section, and the
// story is the side that is wrong more often -- hence a warning.
const CATEGORY_OF_STORY_SECTION = new Map([
  ["Interactive elements", "Interactive elements"],
  ["Form controls", "Form controls"],
  ["Overlays", "Overlays"],
  ["Data display", "Data display"],
  ["Table", "Data display"],
  ["Tiles", "Data display"],
  ["Rows", "Data display"],
  ["Layout", "Layout"],
  ["Layout components", "Layout"],
  ["Navigation", "Navigation"],
  ["Feedback", "Feedback"],
  ["Status components", "Feedback"],
  ["Skeletons", "Feedback"],
]);

/** The category a folder's story title maps to, or null when there is none. */
const categoryFromStory = (folder) => {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) return null;

  const story = fs
    .readdirSync(dir)
    .find((name) => name.endsWith(".stories.tsx"));
  if (!story) return null;

  const match = /title:\s*"UI\/([^/"]+)/.exec(
    fs.readFileSync(path.join(dir, story), "utf8"),
  );

  return match ? (CATEGORY_OF_STORY_SECTION.get(match[1]) ?? null) : null;
};

// The README is the Docs page of every story file in its own folder
// (.storybook/blocks/DocsPage.tsx), so a description written in one of those
// files is a second copy of it -- the one that went stale first, every time
// the two were compared. These are the two shapes that copy took.
const STORY_DUPLICATES = [
  {
    pattern: /description:\s*\{\s*component:\s*[`"']/,
    message:
      "the story sets `parameters.docs.description.component`; the Docs page renders this README instead, so move what it says that the README lacks into the README and delete it",
  },
  {
    pattern: /CSS Custom Properties for external customization/,
    message:
      "`CssCustomization` lists the variables again; the README's `## CSS variables` is the table the Docs page shows, so keep the demo and drop the list",
  },
];

/** Where a story file beside this README repeats it, as `{ file, line, message }`. */
const storyDuplicates = (folder) => {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".stories.tsx"))
    .flatMap((name) => {
      const text = fs.readFileSync(path.join(dir, name), "utf8");
      return STORY_DUPLICATES.flatMap(({ pattern, message }) => {
        const match = pattern.exec(text);
        return match
          ? [
              {
                file: `${folder}/${name}`,
                line: lineOf(text, match.index),
                message,
              },
            ]
          : [];
      });
    });
};

/** The `##` headings of a README, with the line each sits on. */
const sectionsOf = (readme) =>
  [...readme.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => ({
    title: match[1],
    line: lineOf(readme, match.index),
  }));

/** Every fenced code block, with the line it starts on. */
const codeBlocks = (readme) =>
  [...readme.matchAll(/```(\w[\w-]*)?\r?\n([\s\S]*?)```/g)].map((match) => ({
    language: match[1] ?? "",
    body: match[2],
    line: lineOf(readme, match.index),
  }));

/**
 * Writes every ```tsx block to the cache directory, one file per block, with
 * nothing added above the code so that a diagnostic's line number maps back to
 * the README by a single addition.
 *
 * ```tsx-snippet is deliberately not extracted: that fence is how a README says
 * "this fragment illustrates, it does not compile", and the template forbids it
 * where a reader copies code -- the minimal example and the recipes.
 */
const extractExamples = (source, readme, label = `${source}/README.md`) => {
  const dir = path.join(CACHE, source.replaceAll("/", "__"));
  fs.mkdirSync(dir, { recursive: true });

  return codeBlocks(readme)
    .filter((block) => block.language === "tsx")
    .map((block, index) => {
      const file = path.join(dir, `${index}.tsx`);
      fs.writeFileSync(file, block.body, "utf8");

      // The fence sits on `block.line`, so the first line of code is the next
      // one, and a diagnostic reported on line 1 belongs to it.
      return { label, file, firstLine: block.line + 1 };
    });
};

/**
 * The pages under `docs/`. They carry no metadata block and no section
 * contract -- they are prose -- but their code has to compile and their text is
 * read by the same people, so the forbidden-text rules and the ```tsx pass
 * apply to them as they do to a README.
 *
 * `.mdx` is left out: it is Storybook's, it is not synced downstream, and its
 * blocks are rendered rather than copied.
 */
const DOCS_DIR = "docs";

const docPages = () => {
  const dir = path.join(ROOT, DOCS_DIR);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => `${DOCS_DIR}/${name}`);
};

/**
 * Every path `package.json`'s `files` puts in the tarball, as matchers.
 *
 * A bare entry is a directory and covers everything under it; `**` spans
 * directories and `*` does not, which is how npm reads them.
 */
const shippedMatchers = () => {
  const { files = [] } = JSON.parse(
    fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
  );

  return files.map((entry) => {
    const body = entry
      .split("/")
      .map((part) =>
        part === "**"
          ? "(?:.+)"
          : part.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*"),
      )
      .join("/");

    // A directory entry ships its contents, so it also matches anything below it.
    return new RegExp(`^${body}(?:/.*)?$`);
  });
};

/**
 * Relative links in a page that ships, pointing at a file that does not.
 *
 * These read as working links here and are dead in the tarball, which is the
 * copy most people have: a published `docs/` page shipped a link to
 * `COMPONENT_README_TEMPLATE.md`, a contributor document `files` does not carry. Only
 * pages that ship are worth checking, and only links that resolve inside the
 * repository -- a link to a file that does not exist at all is a different
 * fault, and one the repository's own reader hits first.
 */
const unshippedLinks = (text, from, shipped) => {
  // A page that does not ship cannot carry a link that is dead in the tarball.
  if (!shipped.some((matcher) => matcher.test(from))) return [];

  const dir = path.posix.dirname(from);
  const found = [];

  for (const match of text.matchAll(/\]\((\.[^)\s#]*)(?:#[^)\s]*)?\)/g)) {
    const target = path.posix.normalize(path.posix.join(dir, match[1]));
    if (target.startsWith("..")) continue;
    if (!fs.existsSync(path.join(ROOT, target))) continue;
    if (shipped.some((matcher) => matcher.test(target))) continue;
    found.push({ target, index: match.index });
  }

  return found;
};

// Inline code that a line break splits in two. Storybook renders a README
// with markdown-to-jsx, and its code component takes a span holding a newline
// for a block: the result is a <pre> inside the paragraph's <p>, which React
// reports as invalid nesting on the component's Docs page. Prettier does not
// join such lines (`proseWrap: preserve`), so nothing else would catch it.
// Returns the line each such span opens on, outside fenced blocks and tables.
const wrappedInlineCode = (readme) => {
  const lines = readme.split("\n");
  const found = [];
  let inFence = false;
  let paragraph = [];
  let start = 0;

  const scan = () => {
    const text = paragraph.join("\n");
    for (const match of text.matchAll(/(?<!`)`([^`]+)`(?!`)/g)) {
      if (match[1].includes("\n")) {
        found.push(start + text.slice(0, match.index).split("\n").length);
      }
    }
    paragraph = [];
  };

  lines.forEach((line, index) => {
    if (line.trimStart().startsWith("```")) {
      if (!inFence) scan();
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (
      line.trim() === "" ||
      line.trimStart().startsWith("|") ||
      line.startsWith("#")
    ) {
      scan();
      return;
    }
    if (paragraph.length === 0) start = index;
    paragraph.push(line);
  });
  scan();

  return found;
};

// The README blocks a ceiling applies to, from `.claude/rules/doc-writing.md`.
// A block no entry matches is still checked sentence by sentence.
const PROSE_LIMITS = [
  {
    applies: (block) => block.section === null && block.kind === "paragraph",
    limit: LIMITS.lead,
    what: "the lead paragraph",
  },
  {
    applies: (block) =>
      block.section === "Use this when / not when" && block.kind === "bullet",
    limit: LIMITS.whenBullet,
    what: "a “Use this when” bullet",
  },
  {
    applies: (block) =>
      block.section === "Behaviour the types don't state" &&
      block.kind === "bullet",
    limit: LIMITS.behaviourBullet,
    what: "a behaviour bullet",
  },
  {
    applies: (block) => block.section === "Accessibility",
    limit: LIMITS.accessibility,
    what: "an accessibility bullet",
  },
  {
    applies: (block) => block.kind === "cell",
    limit: LIMITS.cssEffect,
    what: "a CSS variable's Effect",
  },
];

const sentenceFindings = (text, file, line) =>
  longSentences(text).map(({ sentence, words }) => ({
    code: "W_LONG_SENTENCE",
    file,
    line,
    message: `a sentence of ${words} words, over ${LIMITS.sentence}: “${excerpt(sentence)}”`,
  }));

const lengthFinding = (text, limit, what, file, line) => {
  const words = wordCount(text);
  return words > limit
    ? [
        {
          code: "W_LONG_TEXT",
          file,
          line,
          message: `${what} runs ${words} words, over ${limit}`,
        },
      ]
    : [];
};

/** A story description that asks for a live Storybook, which the site is not. */
const liveOnlyFinding = (owner, text, file, line) => {
  const phrase = liveOnlyPhrase(text);
  return phrase
    ? [
        {
          code: "W_LIVE_ONLY_TEXT",
          file,
          line,
          message: `\`${owner}\`'s story description needs a live Storybook (“${excerpt(phrase)}”); the API site prints it under a still picture, so say what happens instead`,
        },
      ]
    : [];
};

/** Style findings for a README's own prose. */
const readmeStyle = (folder, readme) => {
  const file = `${folder}/README.md`;

  return markdownProse(readme).flatMap((block) => {
    const rule = PROSE_LIMITS.find((entry) => entry.applies(block));
    return [
      ...(rule
        ? lengthFinding(block.text, rule.limit, rule.what, file, block.line)
        : []),
      ...sentenceFindings(block.text, file, block.line),
    ];
  });
};

/** Style findings for one prop's JSDoc, reported where the JSDoc is written. */
const propStyle = (prop, component) => {
  const { description: text, declaredFile: file, declaredLine: line } = prop;
  if (!text) return [];

  return [
    ...lengthFinding(text, LIMITS.prop, `\`${prop.name}\`'s JSDoc`, file, line),
    ...sentenceFindings(text, file, line),
    ...(isTautological(prop.name, text, component)
      ? [
          {
            code: "W_TAUTOLOGICAL_PROP",
            file,
            line,
            message: `\`${prop.name}\`'s JSDoc restates its name; say what the value changes, where a valid one comes from, or what both values of a boolean do`,
          },
        ]
      : []),
  ];
};

/**
 * The story files a README documents: its own folder's and those of every
 * subfolder without a README of its own -- the table's parts and the
 * skeletons keep theirs a level or two down. A subfolder with a README is a
 * documented folder of its own and is checked as one.
 */
const storyFilesOf = (folder) => {
  const found = [];

  const walk = (relative) => {
    const dir = path.join(ROOT, relative);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`;
      if (entry.isDirectory()) {
        if (!fs.existsSync(path.join(ROOT, child, "README.md"))) walk(child);
      } else if (entry.name.endsWith(".stories.tsx")) {
        found.push(child);
      }
    }
  };

  if (fs.existsSync(path.join(ROOT, folder))) walk(folder);
  return found;
};

/** Style findings for the story files a README documents. */
const storyStyle = (folder, component) =>
  storyFilesOf(folder).flatMap((file) => {
    const source = fs.readFileSync(path.join(ROOT, file), "utf8");

    return storyTexts(source, path.posix.basename(file)).flatMap(
      ({ kind, name: owner, text, line }) =>
        kind === "story"
          ? [
              ...lengthFinding(
                text,
                LIMITS.story,
                `\`${owner}\`'s story description`,
                file,
                line,
              ),
              ...sentenceFindings(text, file, line),
              ...liveOnlyFinding(owner, text, file, line),
            ]
          : [
              ...lengthFinding(
                text,
                LIMITS.argType,
                `the \`${owner}\` argTypes description`,
                file,
                line,
              ),
              ...sentenceFindings(text, file, line),
              ...(owner && isTautological(owner, text, component)
                ? [
                    {
                      code: "W_TAUTOLOGICAL_PROP",
                      file,
                      line,
                      message: `the \`${owner}\` argTypes description restates the prop's name`,
                    },
                  ]
                : []),
            ],
    );
  });

/**
 * The documented folders the branch changed, each file credited to the deepest
 * folder holding it -- `rows/row` rather than `rows`. Null when the start of
 * the branch is not in the history at hand -- no parent among the origin
 * branches, or a shallow CI checkout that stops short of the merge base: the
 * summary line then says so rather than call every folder unchanged. A
 * `--base` that names no commit at all is a broken invocation, not a short
 * history, and stops the run: CI would otherwise hide the warnings for good.
 */
const touchedFolders = (folders, baseRef) => {
  if (baseRef && !isCommit(ROOT, baseRef)) {
    console.error(
      `--base ${baseRef}: no such branch or commit here; CI has to fetch the target branch first`,
    );
    process.exit(2);
  }

  const base = baseRef ? baseAgainst(ROOT, baseRef) : findBranchBase(ROOT);
  const changed = base ? changesSince(ROOT, base.sha) : null;

  if (!changed) return null;

  const deepestFirst = [...folders].sort((a, b) => b.length - a.length);
  const touched = new Set();

  for (const file of changed) {
    const owner = deepestFirst.find((folder) => file.startsWith(`${folder}/`));
    if (owner) touched.add(owner);
  }

  return touched;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const allowlist = readAllowlist();
  const all = documentedFolders();

  // A folder named explicitly is checked even while it is on the allowlist:
  // the rewrite procedure is "run this until it is clean, then take the folder
  // off the list", which a silent skip would make vacuous.
  const named = options.only.length > 0;
  const folders = named
    ? options.only.map(normaliseFolder)
    : all.filter((folder) => !allowlist.has(folder));

  const findings = [];
  const reportFile = (severity, code, file, line, message) =>
    findings.push({ severity, code, file, line, message });

  const report = (severity, code, folder, line, message) =>
    reportFile(severity, code, `${folder}/README.md`, line, message);

  const error = (...args) => report("error", ...args);
  const warn = (...args) => report("warning", ...args);

  // Held apart from `findings` until the end, when the scope is known.
  const style = [];
  const seenProps = new Set();

  // The whole program, never only the folders asked for: what the checker
  // prints depends on which files are loaded, so a narrowed run would compare
  // the README against a different truth than CI does.
  const kit = createReadmeProgram();
  const examples = [];
  const shipped = shippedMatchers();

  // Every name `import { X } from "@onlyoffice/apps-ui-kit"` resolves to, from
  // the checker rather than rebuilt from the folders: see `barrelNames()`.
  const barrelNames = kit.barrelNames();

  if (options.compile) fs.rmSync(CACHE, { recursive: true, force: true });

  for (const folder of folders) {
    const file = path.join(ROOT, folder, "README.md");

    if (!fs.existsSync(file)) {
      error(
        "E_README_MISSING",
        folder,
        0,
        `${folder} has an index module but no README`,
      );
      continue;
    }

    const readme = fs.readFileSync(file, "utf8");
    const { meta, error: metaError } = parseMetadata(readme);

    if (metaError) {
      error("E_META_MISSING", folder, 1, metaError);
      continue;
    }

    for (const problem of validateMetadata(meta)) {
      error("E_META_SCHEMA", folder, 1, problem);
    }

    for (const line of wrappedInlineCode(readme)) {
      error(
        "E_INLINE_CODE_WRAPPED",
        folder,
        line,
        "inline code is split across two lines; the Docs page renders it as a code block inside the paragraph. Break the line before the opening backtick instead",
      );
    }

    // --- derived truth: the metadata against the source ---

    const { heading, lead } = headingAndLead(readme);

    if (heading !== meta.name) {
      error(
        "E_META_NAME",
        folder,
        lineOf(readme, readme.indexOf("\n# ") + 1),
        `the heading is \`${heading}\` and \`name\` is \`${meta.name}\``,
      );
    }

    if (meta.folder !== folder) {
      error("E_META_FOLDER", folder, 1, `\`folder\` says \`${meta.folder}\``);
    }

    // The summary is the lead's whole first sentence: a prefix of the lead that
    // ends a sentence and is followed by nothing or by whitespace. A bare
    // `startsWith` passed half a sentence, or a word cut in the middle.
    const summary = typeof meta.summary === "string" ? meta.summary : null;
    if (
      lead &&
      summary !== null &&
      !(
        lead.startsWith(summary) &&
        /[.!?]$/.test(summary) &&
        (lead.length === summary.length || /\s/.test(lead[summary.length]))
      )
    ) {
      error(
        "E_META_SUMMARY",
        folder,
        1,
        "`summary` must be the first sentence under the heading, word for word",
      );
    }

    const storyCategory = categoryFromStory(folder);

    // A provider has no category to disagree with: it appears in no section of
    // the catalogue, and its story sits under `Providers/`, which maps to none.
    if (!isProvider(meta) && storyCategory && storyCategory !== meta.category) {
      warn(
        "W_CATEGORY_STORY",
        folder,
        1,
        `\`category\` is \`${meta.category}\` and the story's title puts it under \`${storyCategory}\``,
      );
    }

    for (const { file: story, line, message } of storyDuplicates(folder)) {
      reportFile("error", "E_STORY_DUPLICATE", story, line, message);
    }

    // --- the sections, and their order ---

    const present = sectionsOf(readme);
    const known = new Set(SECTIONS.map((section) => section.title));

    for (const section of present) {
      if (!known.has(section.title)) {
        error(
          "E_SECTIONS",
          folder,
          section.line,
          `\`## ${section.title}\` is not a section of the template; the free headings go under \`## Recipes\` as \`###\``,
        );
      }
    }

    const expected = SECTIONS.filter(
      (section) => !section.optional && (!section.when || section.when(meta)),
    );

    for (const section of expected) {
      if (!present.some((found) => found.title === section.title)) {
        error(
          "E_SECTIONS",
          folder,
          1,
          section.when
            ? `\`## ${section.title}\` is required because ${section.because}`
            : `\`## ${section.title}\` is missing`,
        );
      }
    }

    for (const section of SECTIONS) {
      if (
        section.when &&
        !section.when(meta) &&
        present.some((found) => found.title === section.title)
      ) {
        error(
          "E_SECTIONS",
          folder,
          1,
          `\`## ${section.title}\` is there but the condition for it does not hold`,
        );
      }
    }

    const order = present
      .filter((found) => known.has(found.title))
      .map((found) => SECTIONS.findIndex((s) => s.title === found.title));

    if (order.some((index, at) => at > 0 && index < order[at - 1])) {
      error(
        "E_SECTIONS",
        folder,
        present[0]?.line ?? 1,
        `the sections are out of order; the template's order is ${SECTIONS.map((s) => s.title).join(" → ")}`,
      );
    }

    const exports = kit.folderExports(folder);
    // Can the component this README documents be imported from the root barrel
    // by name? Its own name being among the barrel's exports answers it,
    // whichever way it got there -- `export *` for a named export, an explicit
    // `export { default as Section }` for a default one. A folder whose own name
    // is not an export -- `table`, `rows`, `tiles` document a family -- is
    // judged by the names it does document.
    const documented = (meta.exports ?? []).filter(
      (name) => name !== "default",
    );
    const inBarrel =
      barrelNames.has(meta.name ?? "") ||
      (!exports.hasDefault &&
        documented.length > 0 &&
        documented.every((name) => barrelNames.has(name)));

    if (meta.import?.barrel !== inBarrel) {
      error(
        "E_META_BARREL",
        folder,
        1,
        `\`import.barrel\` says ${meta.import?.barrel}; \`import { ${meta.name} } from "${PACKAGE}"\` ${inBarrel ? "resolves" : "does not resolve"}`,
      );
    }

    if (meta.import?.default !== exports.hasDefault) {
      error(
        "E_META_DEFAULT",
        folder,
        1,
        `\`import.default\` says ${meta.import?.default}; the folder's index ${exports.hasDefault ? "has" : "has no"} default export`,
      );
    }

    if (meta.import?.subpath !== folder) {
      error(
        "E_META_SUBPATH",
        folder,
        1,
        `\`import.subpath\` must be \`${folder}\`, the path the exports map guarantees`,
      );
    }

    for (const name of meta.exports ?? []) {
      if (
        !exports.names.includes(name) &&
        !(name === "default" && exports.hasDefault)
      ) {
        error(
          "E_META_EXPORTS",
          folder,
          1,
          `\`${name}\` is not exported by the folder's index`,
        );
      }
    }

    for (const related of meta.related ?? []) {
      // Everything is relative to `components/` unless it names another root:
      // `tiles/room-tile` is a nested component, `providers/theme` is not a
      // component at all. Only a leading root switches the base.
      const target = path.join(
        ROOT,
        /^providers\//.test(related)
          ? related
          : path.join("components", related),
        "README.md",
      );
      if (!fs.existsSync(target)) {
        error(
          "E_META_RELATED",
          folder,
          1,
          `\`related\` names \`${related}\`, which has no README`,
        );
      }
    }

    for (const testId of meta.testIds ?? []) {
      if (!readme.includes(testId)) {
        error(
          "E_META_TESTIDS",
          folder,
          1,
          `\`${testId}\` is not mentioned anywhere in the README`,
        );
      }
    }

    // --- derived truth: the props ---

    let blocks = null;

    if (PROPS_BLOCK.test(readme)) {
      PROPS_BLOCK.lastIndex = 0;

      try {
        blocks = resolveBlocks(kit, folder, readme);
      } catch (resolveError) {
        error("E_PROPS_TYPE_NOT_FOUND", folder, 1, resolveError.message);
      }
    } else if (meta.propsType !== null) {
      PROPS_BLOCK.lastIndex = 0;
      error(
        "E_PROPS_MARKER",
        folder,
        1,
        "no `props:start` / `props:end` block",
      );
    } else {
      PROPS_BLOCK.lastIndex = 0;
    }

    if (blocks) {
      const props = blocks.flatMap((block) => [
        ...block.baseProps,
        ...block.wrapperProps,
      ]);
      const names = new Set(props.map((prop) => prop.name));

      for (const [key, value] of Object.entries(meta.state ?? {})) {
        if (typeof value === "string" && !names.has(value)) {
          error(
            "E_META_STATE",
            folder,
            1,
            `\`state.${key}\` names \`${value}\`, which is not a prop of this component`,
          );
        }
      }

      for (const prop of props) {
        if (prop.origin !== "external" && prop.description === "") {
          error(
            "E_PROP_NO_DOC",
            folder,
            1,
            prop.origin === "picked"
              ? `\`${prop.name}\` is picked out of a foreign type that does not document it. Declare it in the folder's own props type with a JSDoc line; a picked prop is a blank cell here and in Storybook.`
              : `\`${prop.name}\` has no JSDoc in ${prop.declaredFile}; it is a blank cell here and in Storybook`,
          );
        }

        // A prop shared by several blocks or folders is judged once, where
        // its JSDoc is written.
        const key = `${prop.declaredFile}:${prop.declaredLine}`;
        if (prop.origin === "own" && !seenProps.has(key)) {
          seenProps.add(key);
          for (const finding of propStyle(prop, meta.name ?? "")) {
            style.push({ folder, ...finding });
          }
        }

        if (prop.defaultConflict) {
          warn(
            "W_DEFAULT_MISMATCH",
            folder,
            1,
            `\`${prop.name}\`: \`@default ${prop.defaultConflict.tagged}\` but the component destructures \`${prop.defaultConflict.destructured}\``,
          );
        }
      }

      // Both sides are formatted, so that a README which merely needs
      // `pnpm format` is not reported as a stale table. Prettier formats the
      // code inside a ```tsx fence too, so comparing a formatted rendering
      // against an unformatted file blamed the generator for a long line.
      const [expected, actual] = await Promise.all([
        formatMarkdown(renderBlocks(readme, blocks), file),
        formatMarkdown(readme, file),
      ]);

      if (expected !== actual) {
        error(
          "E_PROPS_SYNC",
          folder,
          1,
          "the generated block is out of date; run `pnpm readme:props --write`",
        );
      }
    }

    // --- the text a consumer reads ---

    for (const { pattern, message } of FORBIDDEN) {
      const match = pattern.exec(readme);
      if (match) {
        error("E_FORBIDDEN_TEXT", folder, lineOf(readme, match.index), message);
      }
    }

    for (const finding of [
      ...readmeStyle(folder, readme),
      ...storyStyle(folder, meta.name ?? ""),
    ]) {
      style.push({ folder, ...finding });
    }

    for (const link of unshippedLinks(readme, `${folder}/README.md`, shipped)) {
      error(
        "E_LINK_NOT_SHIPPED",
        folder,
        lineOf(readme, link.index),
        `links to \`${link.target}\`, which \`package.json\`'s \`files\` does not publish — the link is dead in the tarball`,
      );
    }

    const importBlock = codeBlocks(readme).find((block) =>
      block.body.includes(PACKAGE),
    );

    if (!importBlock) {
      error(
        "E_IMPORT_LINE",
        folder,
        1,
        `no code block imports from \`${PACKAGE}\``,
      );
    } else {
      const expected = `${PACKAGE}/${folder}`;
      const specifiers = [
        ...importBlock.body.matchAll(/from\s+"([^"]+)"/g),
      ].map((m) => m[1]);

      if (!specifiers.includes(expected)) {
        error(
          "E_IMPORT_LINE",
          folder,
          importBlock.line,
          `the first import block must import from \`${expected}\`; it imports ${specifiers.map((s) => `\`${s}\``).join(", ") || "nothing"}`,
        );
      }

      const line = importBlock.body
        .split("\n")
        .find((text) => text.includes(expected) && text.includes("import"));

      if (line) {
        const isDefault = /import\s+[A-Za-z_$][\w$]*\s*(,|from)/.test(line);

        if (isDefault !== Boolean(meta.import?.default)) {
          error(
            "E_IMPORT_LINE",
            folder,
            importBlock.line,
            meta.import?.default
              ? "the folder's index has a default export; the example must use it"
              : "the folder's index has no default export; the example must use a named import",
          );
        }
      }

      // A component the barrel does not carry is the case a reader is most
      // likely to get wrong, so the denial is spelled the same way everywhere
      // and checked literally -- prose that merely mentions the barrel while
      // explaining why it is empty would otherwise read as a promise.
      const saysBarrel = /root barrel/i.test(readme);
      const saysNotInBarrel = /\*\*not in the root barrel\*\*/i.test(readme);

      if (inBarrel ? !saysBarrel || saysNotInBarrel : !saysNotInBarrel) {
        error(
          "E_IMPORT_LINE",
          folder,
          1,
          inBarrel
            ? `\`${meta.name}\` is exported from the root barrel and the README does not say so`
            : `\`${meta.name}\` is not exported from the root barrel; the README must say so, in the words "**not in the root barrel**"`,
        );
      }
    }

    if (options.compile) examples.push(...extractExamples(folder, readme));
  }

  // --- the pages under docs/ ---

  // Only when the whole set is checked: `--only` names component folders, and
  // narrowing to one of them should not drag the docs in with it.
  const pages = named ? [] : docPages();

  for (const page of pages) {
    const text = fs.readFileSync(path.join(ROOT, page), "utf8");

    for (const { pattern, message } of FORBIDDEN) {
      const match = pattern.exec(text);
      if (match) {
        reportFile(
          "error",
          "E_FORBIDDEN_TEXT",
          page,
          lineOf(text, match.index),
          message,
        );
      }
    }

    for (const link of unshippedLinks(text, page, shipped)) {
      reportFile(
        "error",
        "E_LINK_NOT_SHIPPED",
        page,
        lineOf(text, link.index),
        `links to \`${link.target}\`, which \`package.json\`'s \`files\` does not publish — the link is dead in the tarball`,
      );
    }

    if (options.compile) {
      examples.push(...extractExamples(page.replace(/\.md$/, ""), text, page));
    }
  }

  // --- the examples compile ---

  if (options.compile && examples.length > 0) {
    const ambient = path.join(CACHE, "consumer-ambient.d.ts");
    fs.writeFileSync(ambient, CONSUMER_AMBIENT, "utf8");

    const program = createExampleProgram([
      ambient,
      ...examples.map((example) => example.file),
    ]);

    const byFile = new Map(
      examples.map((example) => [path.resolve(example.file), example]),
    );

    for (const diagnostic of program
      .getSemanticDiagnostics()
      .concat(program.getSyntacticDiagnostics())) {
      const source = diagnostic.file && path.resolve(diagnostic.file.fileName);
      const example = source && byFile.get(source);
      if (!example) continue;

      const { line } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start ?? 0,
      );

      reportFile(
        "error",
        "E_TSX_COMPILE",
        example.label,
        example.firstLine + line,
        ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
      );
    }
  }

  // --- the style warnings, for the folders in scope ---

  // Every folder is in scope when asked for; otherwise the branch's folders,
  // and none when the branch's parent could not be found (`touched` is null).
  const scoped = !(options.styleAll || named);
  const touched = scoped ? touchedFolders(folders, options.base) : null;
  const inScope = (finding) =>
    !scoped || (touched?.has(finding.folder) ?? false);
  const hidden = style.filter((finding) => !inScope(finding));

  for (const { folder: _folder, ...finding } of style.filter(inScope)) {
    findings.push({ severity: "warning", ...finding });
  }

  const errors = findings.filter((finding) => finding.severity === "error");

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          checked: folders.length,
          pages: pages.length,
          findings,
          styleHidden: hidden.length,
        },
        null,
        2,
      ),
    );
  } else {
    for (const finding of findings) {
      const where = `${finding.file}${finding.line ? `:${finding.line}` : ""}`;
      console[finding.severity === "error" ? "error" : "warn"](
        `${finding.severity === "error" ? "ERROR  " : "warning"}  ${where}  ${finding.code}  ${finding.message}`,
      );
    }

    const skipped =
      !named && allowlist.size > 0
        ? `, ${allowlist.size} on the legacy format skipped`
        : "";

    const docs = pages.length > 0 ? ` and ${pages.length} docs page(s)` : "";

    console.log(
      `\n${folders.length} README(s)${docs} checked${skipped}: ` +
        `${errors.length} error(s), ${findings.length - errors.length} warning(s).`,
    );

    if (hidden.length > 0) {
      const others = new Set(hidden.map((finding) => finding.folder)).size;
      console.log(
        touched === null
          ? `${hidden.length} style warning(s) in ${others} folder(s) not shown: ` +
              (options.base
                ? `no common commit with \`${options.base}\` in the history at hand, so what the branch changed is unknown -- a shallow checkout may stop short of it; `
                : "the branch's parent was not found, so what it changed is unknown; `--base <branch>` names it, ") +
              "`--style-all` lists them all (.claude/rules/doc-writing.md)."
          : `${hidden.length} style warning(s) in ${others} folder(s) this branch did not change; ` +
              "`--style-all` lists them (.claude/rules/doc-writing.md).",
      );
    }
  }

  process.exit(errors.length > 0 ? 1 : 0);
};

await main();
