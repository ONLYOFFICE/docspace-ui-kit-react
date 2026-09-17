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
const renderTable = (header, rows) => {
  const widths = header.map((_, column) =>
    Math.max(...[header, ...rows].map((row) => row[column].length)),
  );
  const line = (cells, fill = " ") =>
    `| ${cells.map((cell, i) => cell.padEnd(widths[i], fill)).join(` | `)} |`;
  return [
    line(header),
    line(
      widths.map((width) => "-".repeat(width)),
      "-",
    ),
    ...rows.map((row) => line(row)),
  ].join("\n");
};

const propsTable = renderTable(
  ["Name", "Type", "Default", "Description"],
  [
    ["children", "React.ReactNode", "-", "Content"],
    ["className", "string", "-", "Custom CSS class"],
    ["style", "React.CSSProperties", "-", "Custom CSS styles"],
    ["testId", "string", `"${kebab}"`, "Value of the data-testid attribute"],
  ],
);

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
    docs: {
      description: {
        component: \`TODO: what this component is for.

### Features

- TODO

### Accessibility

TODO: aria attributes, keyboard behaviour, focus management.

### CSS variables

| Variable | Purpose | Default |
|---|---|---|
| \\\`--${kebab}-gap\\\` | Gap between children | \\\`8px\\\` |
\`,
      },
    },
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
  "README.md": `# ${Pascal}

TODO: one paragraph on what this component is for and when to reach for it.

## Usage

\`\`\`jsx
import { ${Pascal} } from "@onlyoffice/apps-ui-kit/components/${kebab}";

const MyComponent = () => {
  return <${Pascal}>content</${Pascal}>;
};
\`\`\`

## Properties

${propsTable}
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

if (!has("--no-register"))
  fs.appendFileSync(barrel, registration);

console.log(`Created components/${kebab}/`);
for (const name of Object.keys(files)) console.log(`  ${name}`);
console.log(
  has("--no-register")
    ? "\nNot registered. Add `export * from \"./" +
        kebab +
        '";` to components/index.ts when ready.'
    : "\nRegistered in components/index.ts -- it is now part of the plugin API surface.",
);
console.log(
  "\nNext: fill the TODOs in the story and README, then\n" +
    "  pnpm tsc && pnpm lint && pnpm test\n" +
    "  node .claude/scripts/plugin-surface/surface.mjs   # confirm the new exports",
);
