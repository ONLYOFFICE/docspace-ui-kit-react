// Checks the component READMEs against the contract in `README_TEMPLATE.md`.
//
//   pnpm check:readme                     every component
//   pnpm check:readme --only button       one, folder name or path
//   pnpm check:readme --json              machine-readable findings
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
// The section list and its order come from `README_TEMPLATE.md`, which is the
// source of truth for what a component's documentation says; the authoring rule
// and the `component-docs` skill were rewritten to match rather than the other
// way round.

import fs from "node:fs";
import path from "node:path";

import * as ts from "typescript";

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
    "usage: node scripts/check-readme.mjs [--only <folder>...] [--compile] [--json]",
  );
  process.exit(2);
};

const parseArgs = (argv) => {
  const options = { only: [], json: false, compile: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") options.json = true;
    else if (arg === "--compile") options.compile = true;
    else if (arg === "--only") {
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

// The `##` sections, in the order `README_TEMPLATE.md` puts them. `when` is
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
 * `README_TEMPLATE.md`, a contributor document `files` does not carry. Only
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

  // The whole program, never only the folders asked for: what the checker
  // prints depends on which files are loaded, so a narrowed run would compare
  // the README against a different truth than CI does.
  const kit = createReadmeProgram();
  const barrel = kit.barrelFolders();
  const examples = [];
  const shipped = shippedMatchers();

  // Every name `import { X } from "@onlyoffice/apps-ui-kit"` resolves to. The
  // barrel re-exports its folders with `export *`, which carries their named
  // exports transitively and drops their defaults -- so a folder being listed
  // there says nothing about whether its component arrived. `AsideHeader` is in
  // the barrel through `components/aside`, and `Section` is not in it at all.
  const barrelNames = new Set();
  for (const folder of [...barrel, ...kit.barrelFolders("providers")]) {
    for (const name of kit.folderExports(folder).names) barrelNames.add(name);
  }

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

    if (
      lead &&
      typeof meta.summary === "string" &&
      !lead.startsWith(meta.summary)
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
    // by name? A folder being listed in `components/index.ts` does not answer
    // it: `export *` carries named exports and drops defaults, so a component
    // that is only a default export is unreachable from the barrel however
    // plainly its folder is re-exported there. A folder whose own name is not
    // one of its exports -- `table`, `rows`, `tiles` document a family -- is
    // judged by the names it does export.
    const defaultOnly =
      exports.hasDefault && !exports.names.includes(meta.name ?? "");
    const documented = (meta.exports ?? []).filter(
      (name) => name !== "default",
    );
    const inBarrel =
      !defaultOnly &&
      documented.length > 0 &&
      documented.every((name) => barrelNames.has(name));

    if (meta.import?.barrel !== inBarrel) {
      error(
        "E_META_BARREL",
        folder,
        1,
        `\`import.barrel\` says ${meta.import?.barrel}; ${defaultOnly ? `\`${meta.name}\` is a default export, and \`export *\` in \`components/index.ts\` does not carry it` : `the root barrel ${inBarrel ? "exports" : "does not export"} every name this README documents`}`,
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

  const errors = findings.filter((finding) => finding.severity === "error");

  if (options.json) {
    console.log(
      JSON.stringify(
        { checked: folders.length, pages: pages.length, findings },
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
  }

  process.exit(errors.length > 0 ? 1 : 0);
};

await main();
