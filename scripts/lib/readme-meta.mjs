// Parses and validates the `ui-kit-doc` metadata block a component README
// carries on its first line.
//
// The block is an HTML comment rather than YAML frontmatter because it has to
// be invisible everywhere the README is read: GitHub renders frontmatter as a
// table above the file and npm prints it as raw text. A comment is invisible in
// both, and in Storybook, while still being trivially machine-readable -- which
// is the point, because the catalogue and the downstream `ui-kit` agent skill
// are built from these blocks.
//
// Only the field-level rules live here. Whether `import.barrel` is *true* is
// not a question this file can answer -- that is derived from the barrel by
// `check-readme.mjs`, which has the TypeScript program.

export const META_PATTERN = /^<!-- ui-kit-doc\s*(\{[\s\S]*?\})\s*-->/;

export const CATEGORIES = [
  "Interactive elements",
  "Form controls",
  "Overlays",
  "Data display",
  "Layout",
  "Navigation",
  "Feedback",
];

export const KINDS = ["component", "sub-component", "compound"];

export const STATUSES = ["public", "portal-internal"];

export const PROVIDERS = ["ThemeProvider", "TranslationProvider"];

export const STATE_KEYS = ["visibility", "close", "loading", "disabled"];

const REQUIRED_FIELDS = [
  "schema",
  "name",
  "folder",
  "kind",
  "category",
  "status",
  "summary",
  "import",
  "exports",
  "providers",
  "state",
  "related",
  "subComponents",
  "testIds",
];

const OPTIONAL_FIELDS = ["parent", "propsType"];

const SUMMARY_LIMIT = 160;

/**
 * The metadata block of a README, or the reason there is none.
 *
 * Returns `{ meta }` on success and `{ error }` otherwise. The block must be
 * the very first thing in the file: anything above it would render above the
 * heading on npm.
 */
export const parseMetadata = (readme) => {
  const match = META_PATTERN.exec(readme);

  if (!match) {
    return {
      error: readme.includes("<!-- ui-kit-doc")
        ? "the `ui-kit-doc` block is not the first thing in the file"
        : "no `ui-kit-doc` metadata block on line 1",
    };
  }

  try {
    return { meta: JSON.parse(match[1]) };
  } catch (error) {
    return {
      error: `the \`ui-kit-doc\` block is not valid JSON: ${error.message}`,
    };
  }
};

const isStringArray = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

/** Field-level problems with a parsed block, as a list of sentences. */
export const validateMetadata = (meta) => {
  const problems = [];
  const say = (message) => problems.push(message);

  for (const field of REQUIRED_FIELDS) {
    if (!(field in meta)) say(`\`${field}\` is missing`);
  }

  for (const field of Object.keys(meta)) {
    if (!REQUIRED_FIELDS.includes(field) && !OPTIONAL_FIELDS.includes(field)) {
      say(`\`${field}\` is not a field of schema 1`);
    }
  }

  if (meta.schema !== 1) say("`schema` must be `1`");

  if (typeof meta.name !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(meta.name)) {
    say("`name` must be the component's PascalCase name");
  }

  if (!KINDS.includes(meta.kind)) {
    say(`\`kind\` must be one of ${KINDS.join(", ")}`);
  }

  if (meta.kind === "sub-component" && typeof meta.parent !== "string") {
    say("`parent` is required when `kind` is `sub-component`");
  }

  if (meta.kind !== "sub-component" && "parent" in meta) {
    say("`parent` belongs only to a `sub-component`");
  }

  // The only permitted value is `null`, which says "this folder has no props of
  // its own" -- a barrel over other components, or a service with no element.
  // A *name* would belong in the marker, next to the table it resolves.
  if ("propsType" in meta && meta.propsType !== null) {
    say(
      "`propsType` may only be `null`; name a type in the `props:start` marker",
    );
  }

  if (!CATEGORIES.includes(meta.category)) {
    say(`\`category\` must be one of ${CATEGORIES.join(", ")}`);
  }

  if (!STATUSES.includes(meta.status)) {
    say(`\`status\` must be one of ${STATUSES.join(", ")}`);
  }

  if (typeof meta.summary !== "string" || meta.summary.trim() === "") {
    say("`summary` must be one sentence");
  } else if (meta.summary.length > SUMMARY_LIMIT) {
    say(
      `\`summary\` is ${meta.summary.length} characters; the catalogue shows at most ${SUMMARY_LIMIT}`,
    );
  }

  const importMeta = meta.import;

  if (typeof importMeta !== "object" || importMeta === null) {
    say("`import` must be an object");
  } else {
    if (typeof importMeta.subpath !== "string") {
      say("`import.subpath` must be the folder's subpath");
    }

    for (const flag of ["barrel", "default"]) {
      if (typeof importMeta[flag] !== "boolean") {
        say(`\`import.${flag}\` must be a boolean`);
      }
    }
  }

  if (!isStringArray(meta.exports) || meta.exports.length === 0) {
    say("`exports` must list every name a consumer can import");
  }

  if (!isStringArray(meta.providers)) {
    say("`providers` must be an array");
  } else {
    for (const provider of meta.providers) {
      if (!PROVIDERS.includes(provider)) {
        say(`\`providers\` may only contain ${PROVIDERS.join(" and ")}`);
      }
    }
  }

  if (typeof meta.state !== "object" || meta.state === null) {
    say("`state` must be an object");
  } else {
    for (const key of STATE_KEYS) {
      if (!(key in meta.state)) say(`\`state.${key}\` is missing`);
    }

    for (const [key, value] of Object.entries(meta.state)) {
      if (!STATE_KEYS.includes(key)) {
        say(`\`state.${key}\` is not a field of schema 1`);
      } else if (value !== null && typeof value !== "string") {
        say(`\`state.${key}\` must be a prop name or \`null\``);
      }
    }
  }

  for (const field of ["related", "subComponents", "testIds"]) {
    if (!isStringArray(meta[field]))
      say(`\`${field}\` must be an array of strings`);
  }

  return problems;
};
