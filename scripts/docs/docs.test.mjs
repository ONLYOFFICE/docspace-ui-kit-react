// The docs pipeline's transforms on fixtures. Every one of them is a text
// rewrite that a README shape nobody anticipated can break silently, and the
// only other thing that would notice is the site build in another repository.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";

import { collect } from "./collect.mjs";
import {
  escapeForMdx,
  firstParagraph,
  firstSentence,
  rewriteLinks,
  slugify,
  stripHtmlComments,
} from "./markdown.mjs";
import {
  linkResolver,
  pngWidth,
  renderMdx,
  renderReadme,
  reshapePropsTables,
  THEMED_IMAGE_IMPORT,
  wrapApiTables,
} from "./render.mjs";
import { sidebarItems } from "./sidebar.mjs";
import { parseMdx } from "./mdx.mjs";
import { shotsOf, storyKey } from "./pictures.mjs";
import {
  csfStories,
  csfTitle,
  mdxTitle,
  orderLevel,
  readStoryOrder,
  storyId,
  storyNameFromExport,
} from "./story-tree.mjs";

const compiles = (text) => compile(text, { remarkPlugins: [remarkGfm] });

describe("csfTitle", () => {
  it("reads a meta object declared apart from the export", () => {
    const text = `const meta = { title: "UI/Form controls/Button", component: B } satisfies Meta;
export default meta;`;
    expect(csfTitle(text)).toBe("UI/Form controls/Button");
  });

  it("reads an inline default export", () => {
    expect(
      csfTitle(`export default { title: 'UI/Tiles/BaseTile' } as Meta;`),
    ).toBe("UI/Tiles/BaseTile");
  });

  it("ignores the `title` of an arg", () => {
    const text = `const meta = { title: "UI/Overlays/Aside", args: { title: "Hello" } };
export default meta;`;
    expect(csfTitle(text)).toBe("UI/Overlays/Aside");
  });

  it("is null for a computed title and undefined without a default export", () => {
    expect(csfTitle("export default { title: `UI/${name}` };")).toBeNull();
    expect(csfTitle("export const Story = {};")).toBeUndefined();
  });
});

describe("mdxTitle", () => {
  it("reads <Meta title> and skips <Meta of>", () => {
    expect(mdxTitle('<Meta title="Getting started/Hooks" />')).toBe(
      "Getting started/Hooks",
    );
    expect(mdxTitle("<Meta of={Stories} />")).toBeUndefined();
  });
});

describe("story order", () => {
  it("evaluates the literal, nested arrays included", () => {
    const text = `const preview = { parameters: { options: { storySort: {\n  // note\n  order: ["A", ["x", "y"], "B"],\n} } } };`;
    expect(readStoryOrder(text)).toEqual(["A", ["x", "y"], "B"]);
  });

  it("refuses anything but strings and arrays", () => {
    expect(() =>
      readStoryOrder("const p = { storySort: { order: [...other] } };"),
    ).toThrow(/only strings and arrays/);
  });

  it("puts listed names first and the rest in the order given", () => {
    const { ordered, children } = orderLevel(
      ["UI", "Samples", "Getting started", "Aardvark"],
      ["Getting started", ["Welcome"], "UI"],
    );
    expect(ordered).toEqual(["Getting started", "UI", "Samples", "Aardvark"]);
    expect(children.get("Getting started")).toEqual(["Welcome"]);
  });

  it("places the unlisted at a `*`", () => {
    expect(orderLevel(["c", "a", "z", "b"], ["a", "*", "z"]).ordered).toEqual([
      "a",
      "c",
      "b",
      "z",
    ]);
  });
});

describe("storyId", () => {
  it("matches Storybook's sanitising", () => {
    expect(storyId("UI/Form controls/TextInput")).toBe(
      "ui-form-controls-textinput",
    );
    expect(storyId("Getting started/Types and roles")).toBe(
      "getting-started-types-and-roles",
    );
  });
});

describe("escapeForMdx", () => {
  it("escapes braces and stray angle brackets in prose only", () => {
    const input = "Pass {x} to `{y}` when a < b or <Button> renders.";
    expect(escapeForMdx(input)).toBe(
      "Pass \\{x\\} to `{y}` when a &lt; b or &lt;Button> renders.",
    );
  });

  it("leaves fenced code alone", () => {
    const input = "```tsx\n<Button style={{ a: 1 }} />\n```";
    expect(escapeForMdx(input)).toBe(input);
  });

  it("self-closes void tags and turns autolinks into links", () => {
    expect(escapeForMdx("a<br>b <https://example.com>")).toBe(
      "a<br />b [https://example.com](https://example.com)",
    );
  });

  it("produces MDX that compiles", async () => {
    const readme = [
      "# Name",
      "",
      "Takes `{ a: 1 }` or {b}, and <Foo> in text.<br>",
      "",
      "| Prop | Type |",
      "| --- | --- |",
      '| `x` | `"a" \\| "b"` |',
    ].join("\n");
    await expect(compiles(escapeForMdx(readme))).resolves.toBeDefined();
  });
});

describe("stripHtmlComments", () => {
  it("drops comment-only lines, multi-line ones included, but not code", () => {
    const input = [
      '<!-- ui-kit-doc {\n  "a": 1\n} -->',
      "# Title",
      "<!-- props:start -->",
      "text <!-- inline --> more",
      "```html",
      "<!-- kept -->",
      "```",
    ].join("\n");
    expect(stripHtmlComments(input)).toBe(
      ["# Title", "text  more", "```html", "<!-- kept -->", "```"].join("\n"),
    );
  });
});

describe("rewriteLinks", () => {
  it("sees a link whose text is code, and never a link inside code", () => {
    const out = rewriteLinks(
      "[`Button`](../button/README.md) and `[x](y)`",
      (target) => `NEW/${target}`,
    );
    expect(out).toBe("[`Button`](NEW/../button/README.md) and `[x](y)`");
  });
});

describe("linkResolver", () => {
  const pages = {
    bySource: new Map([
      ["components/button/README.md", "interactive-elements/button.md"],
      ["components/text-input/README.md", "form-controls/text-input.md"],
    ]),
    byStoryId: new Map([
      ["getting-started-welcome", "getting-started/welcome.md"],
    ]),
  };
  const resolve = (target, warnings = []) =>
    linkResolver({
      root: process.cwd(),
      source: "components/button/README.md",
      out: "interactive-elements/button.md",
      pages,
      revision: "master",
      warn: (message) => warnings.push(message),
    })(target, "label", false);

  it("maps a README link to the page, keeping the anchor", () => {
    expect(resolve("../text-input/README.md#props")).toBe(
      "../form-controls/text-input.md#props",
    );
  });

  it("maps a Storybook link to the page it became", () => {
    expect(resolve("?path=/docs/getting-started-welcome--docs")).toBe(
      "../getting-started/welcome.md",
    );
  });

  it("sends an unpublished file to the repository", () => {
    expect(resolve("../section/README.md")).toBe(
      "https://github.com/ONLYOFFICE/docspace-ui-kit-react/blob/master/components/section/README.md",
    );
  });

  it("leaves external links and reports missing files", () => {
    const warnings = [];
    expect(resolve("https://example.com")).toBeUndefined();
    expect(resolve("../nowhere/README.md", warnings)).toBeUndefined();
    expect(warnings).toHaveLength(1);
  });
});

describe("wrapApiTables", () => {
  const table = (name) =>
    [`| Prop | Type |`, `| --- | --- |`, `| \`${name}\` | \`string\` |`].join(
      "\n",
    );

  it("wraps every table whose rows can be named, and skips one that cannot", () => {
    const input = `## Props\n\n${table("id")}\n\n| Variable | Default |\n| --- | --- |\n| \`--x\` | 1 |\n\n| A | B |\n| --- | --- |\n|  | empty first cell |\n\n| Icon | Name |\n| --- | --- |\n| ![x](x.png) | image first |\n\n| C | D |\n| --- | --- |\n| <br />text | element first |`;
    const { text, wrapped } = wrapApiTables(input);
    expect(wrapped).toBe(true);
    expect(text.match(/<APITable/g)).toHaveLength(2);
    expect(text).toContain("<APITable>\n\n| Prop");
    expect(text).toContain("<APITable>\n\n| Variable");
    expect(text).toContain("| --- | --- |\n|  | empty first cell |");
    expect(text).toContain("| --- | --- |\n| ![x](x.png) | image first |");
    expect(text).toContain("| --- | --- |\n| <br />text | element first |");
  });

  it("names the tables when their row ids collide", () => {
    const input = `## Props\n\n${table("id")}\n\n### Header\n\n${table("id")}`;
    const { text } = wrapApiTables(input);
    expect(text).toContain('<APITable name="Props">');
    expect(text).toContain('<APITable name="Header">');
  });
});

describe("slugify", () => {
  it("drops the number prefix Docusaurus would drop from the id", () => {
    expect(slugify("01. My matters")).toBe("my-matters");
    expect(slugify("Form controls")).toBe("form-controls");
  });
});

describe("summaries", () => {
  it("takes the first sentence after the H1, not a dot inside code", () => {
    const text =
      "# Hooks\n\nEleven hooks in `hooks/index.ts. x` here. Second one.";
    expect(firstSentence(firstParagraph(text))).toBe(
      "Eleven hooks in `hooks/index.ts. x` here.",
    );
  });
});

describe("reshapePropsTables", () => {
  const readme = [
    "## Props",
    "",
    "| Prop | Type | Required | Default | Description |",
    "| --- | --- | --- | --- | --- |",
    "| `label` | `string` | no | – | Button text |",
    "| `onClick` | `() => void` | **yes** | – | Called on click. |",
    '| `size` | `"a" \\| "b"` | no | `"a"` | The size |',
    "",
    "| Variable | Default | Effect |",
    "| --- | --- | --- |",
    "| `--x` | 1 | y |",
  ].join("\n");

  it("folds Required and Default into the SDK's three columns", () => {
    const out = reshapePropsTables(readme);
    expect(out).toContain("| Property | Type | Description |");
    expect(out).toContain("| `label`? | `string` | Button text |");
    expect(out).toContain("| `onClick` | `() => void` | Called on click. |");
    expect(out).toContain(
      '| `size`? | `"a" \\| "b"` | The size. Default: `"a"`. |',
    );
  });

  it("leaves other tables and code alone", () => {
    const out = reshapePropsTables(
      `${readme}\n\n\`\`\`\n| Prop | Type | Required | Default | Description |\n\`\`\``,
    );
    expect(out).toContain("| Variable | Default | Effect |");
    expect(out.match(/\| Prop \| Type \| Required/g)).toHaveLength(1);
  });

  it("gives APITable rows ids without the optional marker", () => {
    const { text } = wrapApiTables(reshapePropsTables(readme));
    expect(text).toContain("<APITable>\n\n| Property");
    expect(text).not.toContain('name="');
  });
});

describe("sidebarItems", () => {
  it("emits a category with no pages as a doc", () => {
    const row = { label: "Row", slug: "row" };
    const rows = {
      key: "UI/Rows",
      label: "Rows",
      slug: "ui/rows",
      children: [],
      pages: [row],
      sequence: [{ type: "page", item: row }],
    };
    const items = sidebarItems([
      {
        key: "UI/Table",
        label: "Table",
        slug: "ui/table",
        children: [],
        pages: [],
        sequence: [],
      },
      {
        key: "UI",
        label: "UI",
        slug: "ui",
        children: [rows],
        pages: [],
        sequence: [{ type: "category", item: rows }],
      },
    ]);
    expect(items[0]).toEqual({
      type: "doc",
      id: "docspace/ui-kit/ui/table/index",
      label: "Table",
    });
    expect(items[1].type).toBe("category");
    expect(items[1].items[0].type).toBe("category");
    expect(items[1].items[0].items[0].id).toBe("docspace/ui-kit/ui/rows/row");
  });
});

describe("renderMdx", () => {
  const context = (source) => ({
    root: process.cwd(),
    source,
    out: "getting-started/welcome.md",
    page: { label: "Welcome", source, options: {} },
    pages: { bySource: new Map(), byStoryId: new Map() },
    revision: "master",
    warn: () => {},
  });

  it("drops imports, Meta, dropped components and the trailing footer", () => {
    const raw = [
      'import { Meta } from "@storybook/addon-docs/blocks";',
      'import { WelcomePage } from "./welcome/WelcomePage";',
      "",
      '<Meta title="Getting started/Welcome" />',
      "",
      "<Hero />",
      "",
      "## Installation",
      "",
      "Text.",
      "",
      "---",
      "",
      "`@onlyoffice/apps-ui-kit` 4.0.0 — AGPL-3.0-only.",
      "",
    ].join("\n");
    const out = renderMdx(raw, context("docs/Welcome.mdx"));
    expect(out).toContain("# Welcome\n\n## Installation\n\nText.\n");
    expect(out).not.toContain("import ");
    expect(out).not.toContain("<Meta");
    expect(out).not.toContain("AGPL");
    expect(out).not.toMatch(/---\n*$/);
  });
});

describe("pictures", () => {
  it("reads a PNG's width from its header", () => {
    const header = Buffer.alloc(24);
    header.writeUInt32BE(1948, 16);
    const file = path.join(os.tmpdir(), `ui-kit-docs-${process.pid}.png`);
    fs.writeFileSync(file, header);
    try {
      expect(pngWidth(file)).toBe(1948);
    } finally {
      fs.rmSync(file);
    }
  });

  it("puts a ThemedImage under the intro and imports it", () => {
    const out = renderReadme("# Button\n\nIntro.\n\n## Props\n", {
      root: process.cwd(),
      source: "components/button/README.md",
      out: "interactive-elements/button.md",
      page: { label: "Button", source: "components/button/README.md" },
      pages: { bySource: new Map(), byStoryId: new Map() },
      pictures: new Map([
        [
          "primary",
          { light: "button-light.png", dark: "button-dark.png", width: 117 },
        ],
      ]),
      revision: "master",
      storyId: () => "x",
      warn: () => {},
    });
    expect(out).toContain(THEMED_IMAGE_IMPORT);
    expect(out).toContain(
      "Intro.\n\n<ThemedImage alt=\"Button\" width={117} sources={{ light: require('./button-light.png').default, dark: require('./button-dark.png').default }} />\n\n## Props",
    );
  });
});

describe("stories and MDX", () => {
  it("names a story as Storybook does", () => {
    expect(storyNameFromExport("WithIcon")).toBe("With Icon");
    expect(storyNameFromExport("Size24")).toBe("Size 24");
    expect(storyNameFromExport("MCPServersList")).toBe("MCP Servers List");
    expect(storyKey("WithIcon")).toBe("with-icon");
  });

  it("lists a CSF file's stories with their descriptions", () => {
    const text = `const meta = { title: "UI/X/Y" };
export default meta;
export const Default = { args: {} };
export const WithIcon = {
  parameters: { docs: { description: { story: "Has an icon." } } },
};`;
    expect(csfStories(text)).toEqual([
      { exportName: "Default", description: undefined, tags: [] },
      { exportName: "WithIcon", description: "Has an icon.", tags: [] },
    ]);
  });

  it("leaves out the exports the meta's excludeStories names", () => {
    const text = `const meta = {
  title: "UI/X/Y",
  excludeStories: ["sampleData", /^Helper/],
};
export default meta;
export const sampleData = [1, 2];
export const HelperOne = () => null;
export const Default = { args: {} };`;
    expect(csfStories(text).map((s) => s.exportName)).toEqual(["Default"]);
    expect(
      csfStories(
        `export default { excludeStories: /Data$/ };
export const rowData = [];
export const Default = {};`,
      ).map((s) => s.exportName),
    ).toEqual(["Default"]);
  });

  it("keeps a story's shot name off the reserved ones", () => {
    expect(storyKey("Primary")).toBe("primary-story");
    expect(storyKey("ArgsTable")).toBe("args-table-story");
    expect(
      shotsOf({
        kind: "readme",
        stories: [{ exportName: "Default" }, { exportName: "Primary" }],
      }).map((s) => s.name),
    ).toEqual(["primary", "default", "primary-story"]);
  });

  it("keeps what an HTML element holds between its tags", () => {
    const page = parseMdx(
      '<div className={styles.x}>\n  Some <b>text</b>\n</div>\n\n<img src={pic} alt="a" />',
    );
    expect(page.blocks.map((b) => b.children)).toEqual([
      "Some <b>text</b>",
      undefined,
    ]);
  });

  it("parses an MDX page's imports, Meta and top-level elements", () => {
    const text = [
      'import { Meta, Story } from "@storybook/addon-docs/blocks";',
      "import * as S from './X.stories';",
      "",
      "<Meta of={S} />",
      "",
      "# X",
      "",
      "<Story of={S.Default} />",
      "",
      "<Matrix",
      '  name="rooms"',
      "/>",
      "",
      "```tsx",
      "<Inline />",
      "```",
    ].join("\n");
    const page = parseMdx(text);
    expect(page.metaOf).toBe("S");
    expect(page.imports.get("S")).toBe("./X.stories");
    expect(page.blocks.map((b) => `${b.tag}@${b.start}-${b.end}`)).toEqual([
      "import@0-0",
      "import@1-1",
      "Meta@3-3",
      "Story@7-7",
      "Matrix@9-11",
    ]);
    expect(page.blocks[4].attrs.name).toBe("rooms");
  });

  it("lists a page's shots in order", () => {
    const names = shotsOf({
      kind: "docs",
      blocks: parseMdx(
        "<Meta of={S} />\n\n<Story of={S.A} />\n\n<Table />\n\n<Story of={S.A} />",
      ).blocks,
    }).map((shot) => shot.name);
    expect(names).toEqual(["a", "block0"]);
    expect(
      shotsOf({ kind: "autodocs", stories: [{ exportName: "Default" }] }).map(
        (s) => s.name,
      ),
    ).toEqual(["primary", "args-table", "default"]);
  });
});

describe("collect", () => {
  const fixture = () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "ui-kit-collect-"));
    const write = (file, text) => {
      fs.mkdirSync(path.join(root, path.dirname(file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), text);
    };
    write(
      ".storybook/preview.tsx",
      `export default { parameters: { options: { storySort: { order: [
        "Getting started", ["Welcome", "Structure"], "UI", ["Form controls"],
      ] } } } };`,
    );
    write("docs/welcome.mdx", '<Meta title="Getting started/Welcome" />\n');
    write("docs/structure.mdx", '<Meta title="Getting started/Structure" />');
    write("docs/getting-started.md", "# Installation\n");
    write(
      "components/button/Button.stories.tsx",
      'export default { title: "UI/Form controls/Button" };\nexport const Default = {};',
    );
    write(
      "components/button/README.md",
      '<!-- ui-kit-doc { "summary": "A button." } -->\n\n# Button\n',
    );
    write(
      "components/button/Button.docs.mdx",
      'import * as S from "./Button.stories";\n\n<Meta of={S} />\n',
    );
    write(
      "components/navigation/Navigation.stories.tsx",
      'export default { title: "UI/Navigation/Navigation" };\nexport const Default = {};',
    );
    write(
      "components/text-input/TextInput.stories.tsx",
      'export default { title: "UI/Form controls/TextInput" };\nexport const Default = {};',
    );
    write(
      "components/text-input/README.md",
      '<!-- ui-kit-doc { "summary": "An input." } -->\n\n# TextInput\n',
    );
    return root;
  };

  it("orders categories and pages as Storybook does, extra pages included", () => {
    const warnings = [];
    const { categories } = collect(fixture(), {
      warn: (message) => warnings.push(message),
    });
    expect(warnings).toEqual([
      "components/button/README.md: not published, components/button/Button.docs.mdx is the docs page of components/button/Button.stories.tsx",
    ]);
    expect(categories.map((c) => c.label)).toEqual(["Getting started", "UI"]);

    const [started, ui] = categories;
    const labels = (category) =>
      category.sequence.map(({ type, item }) => `${type}:${item.label}`);
    expect(labels(started)).toEqual([
      "page:Welcome",
      "page:Installation",
      "page:Structure",
    ]);
    expect(started.pages.map((p) => `${p.kind}:${p.slug}`)).toEqual([
      "mdx:welcome",
      "markdown:installation",
      "mdx:structure",
    ]);

    expect(labels(ui)).toEqual([
      "category:Form controls",
      "category:Navigation",
    ]);
    const [form, navigation] = ui.children;
    expect(form.slug).toBe("ui/form-controls");
    expect(form.pages.map((p) => `${p.kind}:${p.slug}:${p.source}`)).toEqual([
      "docs:button:components/button/Button.docs.mdx",
      "readme:text-input:components/text-input/README.md",
    ]);
    expect(navigation.pages.map((p) => `${p.kind}:${p.slug}`)).toEqual([
      "autodocs:navigation-component",
    ]);
  });
});
