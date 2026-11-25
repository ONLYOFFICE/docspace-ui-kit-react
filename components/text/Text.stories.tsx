import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { RootTooltip } from "../tooltip";

import { Text } from ".";

const meta = {
  title: "UI/Data display/Text",
  component: Text,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    as: {
      control: "select",
      options: [
        "p",
        "span",
        "div",
        "label",
        "a",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
      description:
        "Element to render, replacing the component's own default — `p` for `Text` itself. Wins over `tag` when both are set.",
      table: {
        defaultValue: { summary: "p" },
      },
    },
    tag: {
      control: "text",
      description:
        "Element to render, used only while `as` is unset. It is a tag name, not an id.",
    },
    children: {
      control: "text",
      description:
        "Content of the element: text, or phrasing elements while it is a `<p>`.",
    },
    fontSize: {
      control: "text",
      description:
        "Font size, as an inline style. Unset, `Text` is 13px through `--text-size`.",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "text",
      description:
        "Font weight, as an inline style. Ignored while `isBold` is set. Unset, `Text` is 400 through `--text-weight`.",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    color: {
      control: "color",
      description:
        "Text colour, as an inline style. `Text` declares none of its own and inherits without it.",
    },
    backgroundColor: {
      control: "color",
      description: "Background colour, as an inline style. Any CSS colour.",
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "Text alignment, as an inline style.",
    },
    lineHeight: {
      control: "text",
      description: "Line height, as an inline style.",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl", "auto"],
      description:
        'Writing direction. `"ltr"` and `"rtl"` set the `dir` attribute; `"auto"` instead wraps the children in a span that takes the pointer events off them.',
    },
    view: {
      control: "select",
      options: [undefined, "tile"],
      description:
        'Only `"tile"` is recognised, and only together with `dir="auto"`: it clamps the text to two lines.',
    },
    isBold: {
      control: "boolean",
      description: "Sets the weight to 700, overriding `fontWeight`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isItalic: {
      control: "boolean",
      description:
        "Slants the text in italics; without it the text stays upright.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description:
        "Renders the text inline instead of as a block — `inline-block` in `Text`, `inline` in `Heading`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    truncate: {
      control: "boolean",
      description:
        "Holds the text on one line and ends it with an ellipsis. It needs a parent of bounded width; on its own the element grows instead.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noSelect: {
      control: "boolean",
      description:
        "Stops the text being selected, on every browser the kit supports.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    title: {
      control: "text",
      description:
        "Tooltip text. On a component wrapped in the kit's tooltip HOC it opens the shared tooltip, which needs `RootTooltip` mounted. Elsewhere it is the native `title` attribute.",
    },
    onClick: {
      action: "onClick",
      description: "Called with the event when the element is clicked.",
    },
    htmlFor: {
      control: "text",
      description: 'Passed to the element unchanged, for `as="label"`.',
    },
    href: {
      control: "text",
      description: 'Passed to the element unchanged, for `as="a"`.',
    },
    rel: {
      control: "text",
      description: 'Passed to the element unchanged, for `as="a"`.',
    },
    tabIndex: {
      control: "number",
      description:
        "Passed to the element unchanged. The component adds no role, so a focusable text element needs one from you.",
    },
    role: {
      control: "text",
      description:
        "ARIA role of the element, passed unchanged: `status` or `alert` for a line that reports an outcome, `button` alongside `tabIndex` and `onClick`.",
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name, passed unchanged, for text whose content is not what should be announced.",
    },
    "aria-live": {
      control: "select",
      options: [undefined, "off", "polite", "assertive"],
      description:
        "Live-region politeness, passed unchanged, for a line whose content changes and should be read out.",
    },
    "aria-hidden": {
      control: "boolean",
      description:
        "Hides the element from assistive technology, passed unchanged, for decoration that repeats what is already read.",
    },
    id: {
      control: "text",
      description: "`id` of the rendered element.",
    },
    className: {
      control: false,
      description: "Added after the component's own classes.",
    },
    style: {
      control: false,
      description:
        "Inline style of the element. `Text` merges it over the style props above, so a `fontSize` here wins over the `fontSize` prop.",
    },
    containerWidth: {
      control: false,
      description:
        "Not read here — it reaches the DOM as an unknown attribute. It is read off this element by `RowContent` and `TileContent`, which use it as the width of the slot they put the child in.",
    },
    containerMinWidth: {
      control: false,
      description:
        "Not read here — it reaches the DOM as an unknown attribute. It is read off this element by `RowContent`, which uses it as the minimum width of a side slot.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the element.",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    ref: {
      control: false,
      description:
        "Attached to the rendered element, whatever `as` made it. Typed for a div whatever that element actually is.",
    },
  },
} satisfies Meta<typeof Text>;

type Story = StoryObj<ComponentProps<typeof Text>>;

export default meta;

const styleOf = (el: HTMLElement) => getComputedStyle(el);

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Text {...args} />,
  args: {
    children: "Sample text content",
    as: "p",
    fontSize: "13px",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const text = canvas.getByText("Sample text content");
    await expect(text.tagName).toBe("P");
    await expect(styleOf(text).fontSize).toBe("13px");
    await expect(styleOf(text).fontWeight).toBe("400");
    await userEvent.click(text);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A paragraph at the kit's body size and regular weight, the starting point for any line of text.",
      },
      source: {
        code: `<Text as="p" fontSize="13px">
  Sample text content
</Text>`,
      },
    },
  },
};

const FontSizesTemplate = () => {
  return (
    <Wrapper>
      <Text fontSize="10px">10px - Extra small text</Text>
      <Text fontSize="12px">12px - Small text</Text>
      <Text fontSize="13px">13px - Default text</Text>
      <Text fontSize="14px">14px - Medium text</Text>
      <Text fontSize="16px">16px - Large text</Text>
      <Text fontSize="18px">18px - Extra large text</Text>
      <Text fontSize="24px">24px - Display text</Text>
    </Wrapper>
  );
};

const FontWeightsTemplate = () => {
  return (
    <Wrapper>
      <Text fontWeight="300">Light (300)</Text>
      <Text fontWeight="400">Regular (400)</Text>
      <Text fontWeight="500">Medium (500)</Text>
      <Text fontWeight="600">Semibold (600)</Text>
      <Text fontWeight="700">Bold (700)</Text>
    </Wrapper>
  );
};

const TextStylesTemplate = () => {
  return (
    <Wrapper>
      <Text>Regular text</Text>
      <Text isBold>Bold text</Text>
      <Text isItalic>Italic text</Text>
      <Text isBold isItalic>
        Bold and italic text
      </Text>
    </Wrapper>
  );
};

const TextAlignmentTemplate = () => {
  return (
    <Wrapper>
      <Text textAlign="left">Left aligned text</Text>
      <Text textAlign="center">Center aligned text</Text>
      <Text textAlign="right">Right aligned text</Text>
      <Text textAlign="justify">
        Justified text that spans multiple lines to demonstrate the justify
        alignment behavior in longer paragraphs of content.
      </Text>
    </Wrapper>
  );
};

const InlineTemplate = () => {
  return (
    <div>
      <Text isInline>First inline text</Text>{" "}
      <Text isInline>Second inline text</Text>{" "}
      <Text isInline isBold>
        Third bold inline text
      </Text>
    </div>
  );
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: 200 }}>
      <Text truncate>
        This is a very long text that will be truncated when it exceeds the
        container width
      </Text>
    </div>
  );
};

const HeadingElementsTemplate = () => {
  return (
    <Wrapper>
      <Text as="h1" fontSize="32px" fontWeight="700">
        Heading 1
      </Text>
      <Text as="h2" fontSize="28px" fontWeight="700">
        Heading 2
      </Text>
      <Text as="h3" fontSize="24px" fontWeight="600">
        Heading 3
      </Text>
      <Text as="h4" fontSize="20px" fontWeight="600">
        Heading 4
      </Text>
      <Text as="h5" fontSize="16px" fontWeight="600">
        Heading 5
      </Text>
      <Text as="h6" fontSize="14px" fontWeight="600">
        Heading 6
      </Text>
    </Wrapper>
  );
};

const DirectionTemplate = () => {
  return (
    <Wrapper>
      <Text dir="ltr">English text (LTR)</Text>
      <Text dir="rtl" textAlign="right">
        مرحبا بالعالم - Hello World (RTL)
      </Text>
      <Text dir="auto">English text with auto direction</Text>
      <Text dir="auto">نص عربي مع اتجاه تلقائي</Text>
    </Wrapper>
  );
};

const NoSelectTemplate = () => {
  return (
    <Wrapper>
      <Text>This text can be selected</Text>
      <Text noSelect>This text cannot be selected</Text>
    </Wrapper>
  );
};

export const FontSizes: Story = {
  name: "Font sizes",
  render: () => <FontSizesTemplate />,
  play: async ({ canvas }) => {
    await expect(styleOf(canvas.getByText(/^10px/)).fontSize).toBe("10px");
    await expect(styleOf(canvas.getByText(/^24px/)).fontSize).toBe("24px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Seven lines from 10px to 24px, to pick a size against the 13px body text (`fontSize`).",
      },
      source: {
        code: `<Text fontSize="10px">10px - Extra small text</Text>
<Text fontSize="12px">12px - Small text</Text>
<Text fontSize="13px">13px - Default text</Text>
<Text fontSize="14px">14px - Medium text</Text>
<Text fontSize="16px">16px - Large text</Text>
<Text fontSize="18px">18px - Extra large text</Text>
<Text fontSize="24px">24px - Display text</Text>`,
      },
    },
  },
};

export const FontWeights: Story = {
  name: "Font weights",
  render: () => <FontWeightsTemplate />,
  play: async ({ canvas }) => {
    await expect(styleOf(canvas.getByText("Light (300)")).fontWeight).toBe(
      "300",
    );
    await expect(styleOf(canvas.getByText("Bold (700)")).fontWeight).toBe(
      "700",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five lines from light (300) to bold (700), to compare weights at the same size (`fontWeight`); a weight shows only if the font carries it.",
      },
      source: {
        code: `<Text fontWeight="300">Light (300)</Text>
<Text fontWeight="400">Regular (400)</Text>
<Text fontWeight="500">Medium (500)</Text>
<Text fontWeight="600">Semibold (600)</Text>
<Text fontWeight="700">Bold (700)</Text>`,
      },
    },
  },
};

export const TextStyles: Story = {
  name: "Bold and italic",
  render: () => <TextStylesTemplate />,
  play: async ({ canvas }) => {
    await expect(styleOf(canvas.getByText("Bold text")).fontWeight).toBe("700");
    await expect(styleOf(canvas.getByText("Italic text")).fontStyle).toBe(
      "italic",
    );
    const both = styleOf(canvas.getByText("Bold and italic text"));
    await expect([both.fontWeight, both.fontStyle]).toEqual(["700", "italic"]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Emphasis without choosing a weight: **Bold text** sets 700 (`isBold`), **Italic text** slants it (`isItalic`), and the last line combines both.",
      },
      source: {
        code: `<Text>Regular text</Text>
<Text isBold>Bold text</Text>
<Text isItalic>Italic text</Text>
<Text isBold isItalic>Bold and italic text</Text>`,
      },
    },
  },
};

export const TextAlignment: Story = {
  name: "Alignment",
  render: () => <TextAlignmentTemplate />,
  play: async ({ canvas }) => {
    await expect(
      styleOf(canvas.getByText("Center aligned text")).textAlign,
    ).toBe("center");
    await expect(
      styleOf(canvas.getByText("Right aligned text")).textAlign,
    ).toBe("right");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The four alignments in one column (`textAlign`); the justified paragraph stretches every line but the last to both edges.",
      },
      source: {
        code: `<Text textAlign="left">Left aligned text</Text>
<Text textAlign="center">Center aligned text</Text>
<Text textAlign="right">Right aligned text</Text>
<Text textAlign="justify">Justified text...</Text>`,
      },
    },
  },
};

export const InlineText: Story = {
  name: "Inline",
  render: () => <InlineTemplate />,
  play: async ({ canvas }) => {
    // All three sit on one line.
    const tops = ["First inline text", "Second inline text"].map(
      (t) => canvas.getByText(t).getBoundingClientRect().top,
    );
    await expect(tops[0]).toBe(tops[1]);
    await expect(styleOf(canvas.getByText("First inline text")).display).toBe(
      "inline-block",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three pieces of text on one line, for mixing styles inside a sentence without a wrapper (`isInline`).",
      },
      source: {
        code: `<Text isInline>First inline text</Text>
<Text isInline>Second inline text</Text>
<Text isInline isBold>Third bold inline text</Text>`,
      },
    },
  },
};

export const TruncatedText: Story = {
  name: "Truncated",
  render: () => <TruncatedTemplate />,
  play: async ({ canvas }) => {
    const text = canvas.getByText(/This is a very long text/);
    await expect(styleOf(text).textOverflow).toBe("ellipsis");
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A sentence longer than its 200px box, held on one line and cut with an ellipsis (`truncate`). Without a bounded box it would grow instead.",
      },
      source: {
        code: `<div style={{ width: 200 }}>
  <Text truncate>This is a very long text that will be truncated...</Text>
</div>`,
      },
    },
  },
};

export const HeadingElements: Story = {
  name: "As heading elements",
  render: () => <HeadingElementsTemplate />,
  play: async ({ canvas }) => {
    // `as` renders real heading elements.
    for (const level of [1, 2, 3, 4, 5, 6]) {
      await expect(
        canvas.getByRole("heading", { level, name: `Heading ${level}` }),
      ).toBeVisible();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real `h1`-`h6` elements for a document outline, each given its size and weight by hand (`as`, `fontSize`, `fontWeight`); `Heading` carries these sizes already.",
      },
      source: {
        code: `<Text as="h1" fontSize="32px" fontWeight="700">Heading 1</Text>
<Text as="h2" fontSize="28px" fontWeight="700">Heading 2</Text>
<Text as="h3" fontSize="24px" fontWeight="600">Heading 3</Text>
<Text as="h4" fontSize="20px" fontWeight="600">Heading 4</Text>
<Text as="h5" fontSize="16px" fontWeight="600">Heading 5</Text>
<Text as="h6" fontSize="14px" fontWeight="600">Heading 6</Text>`,
      },
    },
  },
};

export const Direction: Story = {
  name: "Direction",
  render: () => <DirectionTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("English text (LTR)")).toHaveAttribute(
      "dir",
      "ltr",
    );
    // dir="auto" leaves the direction to the browser, read from the text.
    const arabic = canvas.getByText("نص عربي مع اتجاه تلقائي");
    await expect(styleOf(arabic).direction).toBe("rtl");
    const english = canvas.getByText("English text with auto direction");
    await expect(styleOf(english).direction).toBe("ltr");
  },
  parameters: {
    docs: {
      description: {
        story:
          'Four lines in two scripts (`dir`): the first set left to right, the second right to left. The last two take their direction from their own text (`dir="auto"`).',
      },
      source: {
        code: `<Text dir="ltr">English text (LTR)</Text>
<Text dir="rtl" textAlign="right">مرحبا بالعالم (RTL)</Text>
<Text dir="auto">Auto-detected direction</Text>`,
      },
    },
  },
};

export const NoSelectText: Story = {
  name: "Not selectable",
  render: () => <NoSelectTemplate />,
  play: async ({ canvas }) => {
    await expect(
      styleOf(canvas.getByText("This text cannot be selected")).userSelect,
    ).toBe("none");
    await expect(
      styleOf(canvas.getByText("This text can be selected")).userSelect,
    ).not.toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two lines, of which only the first can be selected; the second is a caption kept from accidental copying (`noSelect`).",
      },
      source: {
        code: `<Text>This text can be selected</Text>
<Text noSelect>This text cannot be selected</Text>`,
      },
    },
  },
};

export const WithTooltip: Story = {
  name: "With tooltip",
  render: () => (
    <>
      <Text isInline title="Last edited on 12 March">
        Updated recently
      </Text>
      <RootTooltip />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Updated recently"));
    await waitFor(() =>
      expect(screen.getByText("Last edited on 12 March")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A line with a tooltip that opens when the pointer rests on it (`title`). It is the kit's shared tooltip, which needs `RootTooltip` mounted, as this story does.",
      },
      source: {
        code: `<Text isInline title="Last edited on 12 March">
  Updated recently
</Text>
<RootTooltip />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          "--text-size": "18px",
          "--text-weight": "600",
        } as CSSProperties
      }
    >
      <Text>Semi-bold larger text via CSS vars</Text>
    </div>
  ),
  play: async ({ canvas }) => {
    const text = styleOf(
      canvas.getByText("Semi-bold larger text via CSS vars"),
    );
    await expect(text.fontSize).toBe("18px");
    await expect(text.fontWeight).toBe("600");
  },
  parameters: {
    docs: {
      description: {
        story: `A line of text under a wrapper that sets both variables, so it comes out larger and semibold.`,
      },
      source: {
        code: `<div
  style={{
    "--text-size": "18px",
    "--text-weight": "600",
  }}
>
  <Text>Semi-bold larger text via CSS vars</Text>
</div>`,
      },
    },
  },
};
