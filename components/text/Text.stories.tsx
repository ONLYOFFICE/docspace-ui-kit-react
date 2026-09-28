import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { RootTooltip } from "../tooltip";

import { Text } from ".";

const meta = {
  title: "UI/Data display/Text",
  component: Text,
  parameters: {
    docs: {
      description: {
        component: `Component that displays plain text with various styling options.

### Features

- **Multiple HTML Tags**: Renders as a \`<p>\` by default, or as whatever element \`as\` names, from a \`<span>\` to a heading, a label or a link
- **Typography Control**: Sets its own size, weight, line height, alignment and colours as inline styles, and falls back to the kit's 13px regular text when none is set
- **Text Styles**: Turns the text bold or italic with one flag each, bold overriding any weight set beside it
- **Inline Layout**: Sits on a line beside other text as an inline block instead of starting a block of its own
- **Truncation**: Keeps long text on one line and ends it with an ellipsis where the width of its parent runs out
- **Text Direction**: Writes left to right or right to left on request, or lets the browser pick the direction from the text itself
- **Selection Control**: Stops the reader from selecting the text, for captions that should not be copied by accident
- **Tooltip Support**: Opens the kit's shared tooltip with the \`title\` text when the pointer rests on it, once \`RootTooltip\` is mounted

### Usage

\`\`\`tsx
import { Text } from "@onlyoffice/apps-ui-kit/components/text";

// Basic text
<Text>Hello world</Text>

// Bold heading text
<Text as="h2" fontSize="24px" isBold>Section Title</Text>

// Truncated text
<Text truncate>Very long text that will be truncated...</Text>

// RTL text
<Text dir="rtl">مرحبا بالعالم</Text>
\`\`\``,
      },
    },
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
        "Element to render the text as; wins over `tag` when both are set",
      table: {
        defaultValue: { summary: "p" },
      },
    },
    tag: {
      control: "text",
      description:
        "Tag name of the element to render, used only while `as` is unset",
    },
    children: {
      control: "text",
      description: "Text to render",
    },
    fontSize: {
      control: "text",
      description:
        "Font size, set as an inline style; a `fontSize` in `style` wins over it",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "text",
      description:
        "Font weight, set as an inline style; ignored while `isBold` is on",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    color: {
      control: "color",
      description:
        "Text colour, set as an inline style; without it the text takes the colour of its parent",
    },
    backgroundColor: {
      control: "color",
      description: "Background colour behind the text, set as an inline style",
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description:
        "Aligns the lines to the left, the centre or the right, or stretches them to both edges; without it the text follows its parent's alignment",
    },
    lineHeight: {
      control: "text",
      description: "Height of each line, set as an inline style",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl", "auto"],
      description:
        "Writing direction: `ltr` and `rtl` set it on the element; `auto` lets the browser pick it from the text and wraps the text in a span that clicks pass through",
    },
    view: {
      control: "select",
      options: [undefined, "tile"],
      description:
        "`tile` cuts the text to two lines with an ellipsis, and only while `dir` is `auto`; any other value does nothing",
    },
    isBold: {
      control: "boolean",
      description: "Sets the weight to 700, overriding `fontWeight`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isItalic: {
      control: "boolean",
      description: "Renders the text in italics",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description:
        "Makes the element an inline block, so it sits on a line beside other text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    truncate: {
      control: "boolean",
      description:
        "Keeps the text on one line and ends it with an ellipsis; it needs a parent of bounded width, otherwise the element grows instead",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noSelect: {
      control: "boolean",
      description: "Stops the reader from selecting the text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    title: {
      control: "text",
      description:
        "Text of the kit's shared tooltip that opens when the pointer rests on the text; it needs `RootTooltip` mounted",
    },
    onClick: {
      action: "onClick",
      description: "Called with the event when the text is clicked",
    },
    htmlFor: {
      control: "text",
      description:
        'Passed to the element unchanged, for `as="label"`: the `id` of the field the text names',
    },
    href: {
      control: "text",
      description: 'Passed to the element unchanged, for `as="a"`',
    },
    rel: {
      control: "text",
      description: 'Passed to the element unchanged, for `as="a"`',
    },
    tabIndex: {
      control: "number",
      description:
        "Passed to the element unchanged; a focusable text element also needs a `role` from you",
    },
    role: {
      control: "text",
      description:
        "ARIA role of the element, passed unchanged: `status` or `alert` for a line that reports an outcome, `button` alongside `tabIndex` and `onClick`",
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name, passed unchanged, for text whose content is not what should be announced",
    },
    "aria-live": {
      control: "select",
      options: [undefined, "off", "polite", "assertive"],
      description:
        "Passed unchanged, so a screen reader reads the text out when it changes",
    },
    "aria-hidden": {
      control: "boolean",
      description:
        "Passed unchanged, hiding decorative text that repeats what is already read",
    },
    id: {
      control: "text",
      description: "The element's own `id`",
    },
    className: {
      control: false,
      description: "Class name added after the component's own classes",
    },
    style: {
      control: false,
      description:
        "Inline styles of the element, merged over the style props, so its values win",
    },
    display: {
      control: false,
      description:
        "Ignored: written onto the element as an unknown attribute and does not change the layout; use `isInline` or `style`",
    },
    containerWidth: {
      control: false,
      description:
        "Not read by the text itself: `RowContent` and `TileContent` read it off the child as the width of the slot they put it in",
    },
    containerMinWidth: {
      control: false,
      description:
        "Not read by the text itself: `RowContent` reads it off the child as the minimum width of a side slot",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the element",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    ref: {
      control: false,
      description: "Attached to the rendered element, whatever `as` made it",
    },
  },
} satisfies Meta<typeof Text>;

type Story = StoryObj<ComponentProps<typeof Text>>;

export default meta;

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
  },
  parameters: {
    docs: {
      description: {
        story:
          "A paragraph at the kit's body size and regular weight, the starting point for any line of text; change any other prop live in the Controls panel below.",
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
  render: () => <FontSizesTemplate />,
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
  render: () => <FontWeightsTemplate />,
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
  render: () => <TextStylesTemplate />,
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
  render: () => <TextAlignmentTemplate />,
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
  render: () => <InlineTemplate />,
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
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A sentence longer than its 200px box stays on one line and ends with an ellipsis (`truncate`); without a box of bounded width it would grow instead.",
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
  render: () => <HeadingElementsTemplate />,
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
  render: () => <DirectionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'For text whose language is not known in advance: the first line is set left to right and the second right to left (`dir`); the last two leave the direction to the browser, which reads it from the text itself (`dir="auto"`).',
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
  render: () => <NoSelectTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For captions that should not be copied by accident: drag across both lines, and only the first one is selected (`noSelect`).",
      },
      source: {
        code: `<Text>This text can be selected</Text>
<Text noSelect>This text cannot be selected</Text>`,
      },
    },
  },
};

export const WithTooltip: Story = {
  render: () => (
    <>
      <Text isInline title="Last edited on 12 March">
        Updated recently
      </Text>
      <RootTooltip />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "For text that needs a word of explanation without taking space on the page: rest the pointer on the line to read the tooltip (`title`). It opens the kit's shared tooltip, which needs `RootTooltip` mounted, as this story does.",
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-size\` | Font size; a \`fontSize\` prop or \`style\` wins over it | \`13px\` |
| \`--text-weight\` | Font weight; a \`fontWeight\` prop, \`style\` or \`isBold\` wins over it | \`400\` |

The wrapper sets both on a single line of text, which comes out larger and semibold.`,
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
