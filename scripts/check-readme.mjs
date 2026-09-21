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
// Not checked here yet: the order of the `##` sections. `README_TEMPLATE.md`
// and `.claude/rules/component-authoring.md` currently describe two different
// README shapes, and encoding either one in a gate settles that question by
// accident. It lands with the decision, not before.

import fs from "node:fs";
import path from "node:path";

import * as ts from "typescript";

import {
  ROOT,
  componentFolders,
  createExampleProgram,
  createReadmeProgram,
} from "./lib/readme-program.mjs";
import { parseMetadata, validateMetadata } from "./lib/readme-meta.mjs";
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
  return posix.startsWith("components/") ? posix : `components/${posix}`;
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
const extractExamples = (folder, readme) => {
  const dir = path.join(CACHE, folder.replaceAll("/", "__"));
  fs.mkdirSync(dir, { recursive: true });

  return codeBlocks(readme)
    .filter((block) => block.language === "tsx")
    .map((block, index) => {
      const file = path.join(dir, `${index}.tsx`);
      fs.writeFileSync(file, block.body, "utf8");

      // The fence sits on `block.line`, so the first line of code is the next
      // one, and a diagnostic reported on line 1 belongs to it.
      return { folder, file, firstLine: block.line + 1 };
    });
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const allowlist = readAllowlist();
  const all = componentFolders();

  // A folder named explicitly is checked even while it is on the allowlist:
  // the rewrite procedure is "run this until it is clean, then take the folder
  // off the list", which a silent skip would make vacuous.
  const named = options.only.length > 0;
  const folders = named
    ? options.only.map(normaliseFolder)
    : all.filter((folder) => !allowlist.has(folder));

  const findings = [];
  const report = (severity, code, folder, line, message) =>
    findings.push({
      severity,
      code,
      file: `${folder}/README.md`,
      line,
      message,
    });

  const error = (...args) => report("error", ...args);
  const warn = (...args) => report("warning", ...args);

  // The whole program, never only the folders asked for: what the checker
  // prints depends on which files are loaded, so a narrowed run would compare
  // the README against a different truth than CI does.
  const kit = createReadmeProgram();
  const barrel = kit.barrelFolders();
  const examples = [];

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

    const exports = kit.folderExports(folder);
    const inBarrel = barrel.has(folder);

    if (meta.import?.barrel !== inBarrel) {
      error(
        "E_META_BARREL",
        folder,
        1,
        `\`import.barrel\` says ${meta.import?.barrel}; \`components/index.ts\` ${inBarrel ? "does" : "does not"} re-export this folder`,
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
      const target = path.join(ROOT, "components", related, "README.md");
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
    } else {
      PROPS_BLOCK.lastIndex = 0;
      error(
        "E_PROPS_MARKER",
        folder,
        1,
        "no `props:start` / `props:end` block",
      );
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
            `\`${prop.name}\` has no JSDoc in ${prop.declaredFile}; it is a blank cell here and in Storybook`,
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

      const saysBarrel = /root barrel/i.test(readme);

      if (saysBarrel !== inBarrel) {
        error(
          "E_IMPORT_LINE",
          folder,
          1,
          inBarrel
            ? "this folder is in the root barrel and the README does not say so"
            : "this folder is not in the root barrel, but the README says it is",
        );
      }
    }

    if (options.compile) examples.push(...extractExamples(folder, readme));
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

      error(
        "E_TSX_COMPILE",
        example.folder,
        example.firstLine + line,
        ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
      );
    }
  }

  const errors = findings.filter((finding) => finding.severity === "error");

  if (options.json) {
    console.log(JSON.stringify({ checked: folders.length, findings }, null, 2));
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

    console.log(
      `\n${folders.length} README(s) checked${skipped}: ` +
        `${errors.length} error(s), ${findings.length - errors.length} warning(s).`,
    );
  }

  process.exit(errors.length > 0 ? 1 : 0);
};

await main();
