// The docs pipeline's transforms on fixtures. Every one of them is a text
// rewrite that a README shape nobody anticipated can break silently, and the
// only other thing that would notice is the site build in another repository.
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";

import {
  escapeForMdx,
  firstParagraph,
  firstSentence,
  rewriteLinks,
  stripHtmlComments,
} from "./markdown.mjs";
import { linkResolver, wrapApiTables } from "./render.mjs";
import {
  csfTitle,
  mdxTitle,
  orderLevel,
  readStoryOrder,
  storyId,
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

  it("puts listed names first and the rest alphabetically", () => {
    const { ordered, children } = orderLevel(
      ["UI", "Samples", "Getting started", "Aardvark"],
      ["Getting started", ["Welcome"], "UI"],
    );
    expect(ordered).toEqual(["Getting started", "UI", "Aardvark", "Samples"]);
    expect(children.get("Getting started")).toEqual(["Welcome"]);
  });

  it("places the unlisted at a `*`", () => {
    expect(orderLevel(["c", "a", "z", "b"], ["a", "*", "z"]).ordered).toEqual([
      "a",
      "b",
      "c",
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

  it("wraps a Props table and nothing else", () => {
    const input = `## Props\n\n${table("id")}\n\n| Variable | Default |\n| --- | --- |\n| \`--x\` | 1 |`;
    const { text, wrapped } = wrapApiTables(input);
    expect(wrapped).toBe(true);
    expect(text.match(/<APITable/g)).toHaveLength(1);
    expect(text).toContain("<APITable>\n\n| Prop");
  });

  it("names the tables when their row ids collide", () => {
    const input = `## Props\n\n${table("id")}\n\n### Header\n\n${table("id")}`;
    const { text } = wrapApiTables(input);
    expect(text).toContain('<APITable name="Props">');
    expect(text).toContain('<APITable name="Header">');
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
