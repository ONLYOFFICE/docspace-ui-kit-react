// The style warnings are only as good as the counting under them: a split that
// breaks on `ModalDialog.Header` makes every sentence look short, and a
// tautology test that misses a stem lets "Disables the button" through.
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  LIMITS,
  contentWords,
  isTautological,
  liveOnlyPhrase,
  longSentences,
  markdownProse,
  sentences,
  storyTexts,
  wordCount,
} from "./doc-style.mjs";

// Table B of the rule is what a writer reads, LIMITS what the check applies;
// the two are kept in step here rather than trusted to.
describe("LIMITS", () => {
  const rule = fs.readFileSync(
    path.resolve(import.meta.dirname, "../../.claude/rules/doc-writing.md"),
    "utf8",
  );
  const ceilingOf = (piece) => {
    const row = rule
      .split("\n")
      .find((line) => line.startsWith("|") && line.includes(piece));
    return Number(/(\d+) words\s*\|\s*$/.exec(row ?? "")?.[1]);
  };

  it.each([
    ["README lead paragraph", "lead"],
    ["`Use this when / not when` bullet", "whenBullet"],
    ["a prop's JSDoc", "prop"],
    ["an `argTypes` description", "argType"],
    ["a `description.story`", "story"],
    ["`Behaviour the types don't state` bullet", "behaviourBullet"],
    ["an `Accessibility` bullet", "accessibility"],
    ["Effect cell", "cssEffect"],
    ["any sentence", "sentence"],
  ])("matches table B for %s", (piece, key) => {
    expect(ceilingOf(piece)).toBe(LIMITS[key]);
  });
});

describe("wordCount", () => {
  it("counts a code span as one word and a link by its text", () => {
    expect(
      wordCount("Renders `ModalDialog.Header` inside [the body](./x.md)."),
    ).toBe(5);
  });

  it("ignores emphasis markers and punctuation-only tokens", () => {
    expect(wordCount("**Auto-save** — the same switch")).toBe(4);
  });
});

describe("sentences", () => {
  it("does not split on dots inside code or abbreviations", () => {
    expect(
      sentences(
        "Reads `api/2.0/files` once, e.g. on mount. Then it waits for `onClose`.",
      ),
    ).toHaveLength(2);
  });

  it("ends a sentence at a list item and a blank line", () => {
    expect(
      sentences(
        "Two kinds of button:\n\n- **Primary** the main one\n- Secondary all the rest",
      ),
    ).toEqual([
      "Two kinds of button:",
      "Primary the main one",
      "Secondary all the rest",
    ]);
  });

  it("drops one-word fragments", () => {
    expect(sentences("Disabled. The button ignores clicks.")).toEqual([
      "The button ignores clicks.",
    ]);
  });
});

describe("longSentences", () => {
  it("reports a sentence over the limit and nothing at it", () => {
    const at = `${Array(LIMITS.sentence).fill("word").join(" ")}.`;
    const over = `${Array(LIMITS.sentence + 1)
      .fill("word")
      .join(" ")}.`;

    expect(longSentences(at)).toEqual([]);
    expect(longSentences(over)).toEqual([
      { sentence: over, words: LIMITS.sentence + 1 },
    ]);
  });
});

describe("isTautological", () => {
  it("catches a description that only restates the name", () => {
    expect(isTautological("isDisabled", "Disables the component.")).toBe(true);
    expect(isTautological("onClick", "Called on click.")).toBe(true);
    expect(
      isTautological("isDisabled", "Whether the button is disabled.", "Button"),
    ).toBe(true);
  });

  it("passes a description that says what the value does", () => {
    expect(
      isTautological(
        "isDisabled",
        "Greys the button out and stops it receiving focus or clicks.",
        "Button",
      ),
    ).toBe(false);
  });

  it("leaves the props React and the kit's convention define alone", () => {
    expect(isTautological("dataTestId", "`data-testid` of the root.")).toBe(
      false,
    );
  });

  it("stems so that two forms of one word are one word", () => {
    expect([...contentWords("disabled disables")]).toHaveLength(1);
  });
});

describe("liveOnlyPhrase", () => {
  it("finds Storybook's panels and an instruction to act on the canvas", () => {
    expect(
      liveOnlyPhrase("The default. Change any prop in the Controls panel."),
    ).toBe("Controls panel");
    expect(
      liveOnlyPhrase("A hint on hover. Hover the buttons to see it."),
    ).toBe("Hover the buttons to see it");
    expect(liveOnlyPhrase("No trigger here — right click anywhere")).toBe(
      "right click anywhere",
    );
  });

  it("passes a description that says what happens", () => {
    expect(
      liveOnlyPhrase("A hint below the button on hover (`tooltipText`)."),
    ).toBeNull();
    expect(liveOnlyPhrase("Clicking the row selects it.")).toBeNull();
  });
});

describe("markdownProse", () => {
  const readme = [
    "<!-- ui-kit-doc { } -->",
    "",
    "# Button",
    "",
    "Lead sentence.",
    "",
    "## Behaviour the types don't state",
    "",
    "- First bullet",
    "  continues here.",
    "- Second bullet.",
    "",
    "```tsx",
    "const ignored = true;",
    "```",
    "",
    "## Props",
    "",
    "<!-- props:start -->",
    "Generated text that is not checked.",
    "<!-- props:end -->",
    "",
    "## CSS variables",
    "",
    "| Variable | Default | Effect |",
    "| --- | --- | --- |",
    "| `--x` | `1px` | Sets the border width. |",
  ].join("\n");

  const blocks = markdownProse(readme);

  it("reads the lead, the bullets with their continuations and the Effect cells", () => {
    expect(blocks).toEqual([
      { section: null, kind: "paragraph", text: "Lead sentence.", line: 5 },
      {
        section: "Behaviour the types don't state",
        kind: "bullet",
        text: "First bullet continues here.",
        line: 9,
      },
      {
        section: "Behaviour the types don't state",
        kind: "bullet",
        text: "Second bullet.",
        line: 11,
      },
      {
        section: "CSS variables",
        kind: "cell",
        text: "Sets the border width.",
        line: 27,
      },
    ]);
  });
});

describe("storyTexts", () => {
  it("finds story descriptions by export and argTypes descriptions by prop", () => {
    const source = `
const meta = {
  argTypes: {
    size: { control: "select", description: "How large " + "the button is." },
  },
};
export const Default = {
  parameters: { docs: { description: { story: \`Shows \${"x"} it.\` } } },
};
`;

    expect(storyTexts(source)).toEqual([
      {
        kind: "argType",
        name: "size",
        text: "How large the button is.",
        line: 4,
      },
      { kind: "story", name: "Default", text: "Shows CODE it.", line: 8 },
    ]);
  });
});
