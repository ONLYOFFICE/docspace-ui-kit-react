// Scaffolds a component folder in this package's shape, and registers it.
//
// The shape is not arbitrary: the barrel is what the root `index.ts` picks up,
// and the root barrel is the DocSpace plugin UI API (.claude/rules/plugin-api.md).
// A component that is not registered is invisible to plugins; one registered
// with a name that collides is worse.
//
//   node .claude/scripts/new-component/scaffold.mjs <kebab-name> [--dry-run]
//   node .claude/scripts/new-component/scaffold.mjs status-chip --enums
//
// --enums adds <Name>.enums.ts and wires it through the barrel.
// --no-register writes the folder but leaves components/index.ts alone.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const kebab = argv.find((a) => !a.startsWith("--"));

if (!kebab) {
  console.error(
    "Usage: node .claude/scripts/new-component/scaffold.mjs <kebab-name> [--enums] [--dry-run] [--no-register]",
  );
  process.exit(2);
}

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(kebab)) {
  console.error(
    `"${kebab}" is not a kebab-case folder name. Every folder in components/ is lower case with hyphens.`,
  );
  process.exit(2);
}

const Pascal = kebab
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join("");

const dir = path.join(ROOT, "components", kebab);
const barrel = path.join(ROOT, "components/index.ts");
const withEnums = has("--enums");
const dryRun = has("--dry-run");

if (fs.existsSync(dir)) {
  console.error(`components/${kebab}/ already exists.`);
  process.exit(1);
}

// A name collision in the root barrel is a silent overwrite at `export *` time,
// so check before writing rather than after.
const barrelText = fs.readFileSync(barrel, "utf8");
if (barrelText.includes(`"./${kebab}"`)) {
  console.error(`components/index.ts already exports ./${kebab}.`);
  process.exit(1);
}

// Prettier is not in any gate here, but a scaffold that it would rewrite is a
// scaffold that shows up as noise in the author's first `pnpm format`. Column
// widths depend on the component's own name, so they are computed.
const files = {
  // `ref` is a plain prop: React 19, and forwardRef is legacy here.
  // One JSDoc line per prop -- it is the only documentation a plugin author
  // reads, through the emitted .d.ts.
  [`${Pascal}.types.ts`]: `import type React from "react";
${withEnums ? `import type { ${Pascal}Size } from "./${Pascal}.enums";\n` : ""}
export interface ${Pascal}Props {
  /** Ref to the root element */
  ref?: React.Ref<HTMLDivElement>;
${withEnums ? `  /** Size of the ${kebab.replaceAll("-", " ")} */\n  size?: ${Pascal}Size;\n` : ""}  /** Content */
  children?: React.ReactNode;
  /** Custom CSS class */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Value of the data-testid attribute */
  testId?: string;
}
`,

  ...(withEnums
    ? {
        [`${Pascal}.enums.ts`]: `// String enums: a member resolves to its own name, which is what the plugin
// validator's kit stub relies on.
export enum ${Pascal}Size {
  small = "small",
  normal = "normal",
}
`,
      }
    : {}),

  [`${Pascal}.tsx`]: `import classNames from "classnames";

import type { ${Pascal}Props } from "./${Pascal}.types";
${withEnums ? `import { ${Pascal}Size } from "./${Pascal}.enums";\n` : ""}
import styles from "./${Pascal}.module.scss";

export const ${Pascal} = ({
  ref,
${withEnums ? `  size = ${Pascal}Size.normal,\n` : ""}  children,
  className,
  style,
  testId = "${kebab}",
}: ${Pascal}Props) => {
  return (
    <div
      ref={ref}
      className={classNames(styles.container${withEnums ? ", styles[size]" : ""}, className)}
      style={style}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
`,

  // No hardcoded hex, no physical left/right: see .claude/rules/theming.md.
  // A knob of your own takes a fallback and a row in the story's table.
  [`${Pascal}.module.scss`]: `@use "../../styles/variables/colors";

.container {
  display: flex;
  align-items: center;
  gap: var(--${kebab}-gap, 8px);

  color: var(--text-color);
  background-color: var(--background-color);
  border: 1px solid var(--border-service-color);
  border-radius: 3px;

  padding-block: 8px;
  padding-inline: 12px;
}
${
  withEnums
    ? `
.small {
  padding-block: 4px;
}

.normal {
  padding-block: 8px;
}
`
    : ""
}`,

  "index.tsx": `export { ${Pascal} } from "./${Pascal}";
export type { ${Pascal}Props } from "./${Pascal}.types";
${withEnums ? `export { ${Pascal}Size } from "./${Pascal}.enums";\n` : ""}`,

  [`${Pascal}.stories.tsx`]: `import type { Meta, StoryObj } from "@storybook/react-vite";

import { ${Pascal} } from ".";

const meta = {
  title: "UI/TODO section/${Pascal}",
  component: ${Pascal},
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
} satisfies Meta<typeof ${Pascal}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "${Pascal}",
  },
};
`,

  [`${Pascal}.test.tsx`]: `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ${Pascal} } from ".";

describe("${Pascal}", () => {
  it("renders its children", () => {
    render(<${Pascal}>content</${Pascal}>);

    expect(screen.getByTestId("${kebab}")).toHaveTextContent("content");
  });
});
`,

  // Shipped in the published package: `files` in package.json lists
  // components/**/README.md.
  // It is also the Storybook Docs page (.storybook/blocks/DocsPage.tsx), so it
  // is the only description the component has. COMPONENT_README_TEMPLATE.md governs it;
  // the TODO category fails \`pnpm check:readme\` until a real one is chosen.
  "README.md": `<!-- ui-kit-doc {
  "schema": 1,
  "name": "${Pascal}",
  "folder": "components/${kebab}",
  "kind": "component",
  "category": "TODO",
  "status": "public",
  "summary": "TODO: what this component is for, in one sentence.",
  "import": { "subpath": "components/${kebab}", "barrel": true, "default": false },
  "exports": ["${Pascal}", "${Pascal}Props"${withEnums ? `, "${Pascal}Size"` : ""}],
  "providers": ["ThemeProvider"],
  "state": { "visibility": null, "close": null, "loading": null, "disabled": null },
  "related": [],
  "subComponents": [],
  "testIds": ["${kebab}"]
} -->

# ${Pascal}

TODO: what this component is for, in one sentence. Then say when to reach for it.

## Use this when / not when

- Use when: TODO
- Not for TODO.

## Import

\`\`\`ts
import { ${Pascal} } from "@onlyoffice/apps-ui-kit/components/${kebab}";
\`\`\`

Also exported from the root barrel \`@onlyoffice/apps-ui-kit\`.

Needs \`ThemeProvider\` from \`@onlyoffice/apps-ui-kit/providers/theme\` above it in the tree.

## Minimal example

\`\`\`tsx
import { ${Pascal} } from "@onlyoffice/apps-ui-kit/components/${kebab}";

export function Example() {
  return <${Pascal}>content</${Pascal}>;
}
\`\`\`

## Props

<!-- props:start ${Pascal}Props -->
<!-- props:end -->

## Recipes

TODO: one \`###\` per real use the minimal example does not show.

## Behaviour the types don't state

- TODO: what a reader would get wrong from the types alone.

## CSS variables

| Variable | Default | Effect |
| --- | --- | --- |
| \`--${kebab}-gap\` | \`8px\` | Gap between children |

## Accessibility

- TODO: the roles and \`aria-*\` attributes it sets, the keys it handles, how focus moves.

## Test ids

| Element | \`data-testid\` |
| --- | --- |
| The root | \`${kebab}\`, or \`testId\` |

## Related
`,
};

// Appended, not inserted in order: components/index.ts is not alphabetical and
// sorting it would produce a diff nobody asked for.
const registration = `\nexport * from "./${kebab}";\n`;

if (dryRun) {
  console.log(`Would create components/${kebab}/:`);
  for (const name of Object.keys(files)) console.log(`  ${name}`);
  if (!has("--no-register"))
    console.log(`Would append to components/index.ts:${registration}`);
  process.exit(0);
}

fs.mkdirSync(dir);
for (const [name, content] of Object.entries(files))
  fs.writeFileSync(path.join(dir, name), content);

if (!has("--no-register")) fs.appendFileSync(barrel, registration);

console.log(`Created components/${kebab}/`);
for (const name of Object.keys(files)) console.log(`  ${name}`);
console.log(
  has("--no-register")
    ? '\nNot registered. Add `export * from "./' +
        kebab +
        '";` to components/index.ts when ready.'
    : "\nRegistered in components/index.ts -- it is now part of the plugin API surface.",
);
console.log(
  "\nNext: fill the TODOs in the README (it is the Docs page) and the story, then\n" +
    "  pnpm readme:props && pnpm check:readme && pnpm tsc && pnpm lint && pnpm test\n" +
    "  node .claude/scripts/plugin-surface/surface.mjs   # confirm the new exports",
);
