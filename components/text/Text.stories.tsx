// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from ".";

const meta = {
  title: "UI/Data display/Text",
  component: Text,
  parameters: {
    docs: {
      description: {
        component: `Component that displays plain text with various styling options.

### Features

- **Multiple HTML Tags**: Render as p, span, div, or heading elements via the \`as\` prop
- **Typography Control**: Customize fontSize, fontWeight, lineHeight, and color
- **Text Styles**: Support for bold, italic, inline, and truncated text
- **Text Direction**: LTR, RTL, and auto direction support
- **Alignment**: Left, center, right, and justify alignment
- **Selection Control**: Disable text selection with \`noSelect\`
- **Tooltip Support**: Built-in tooltip via the \`withTooltip\` HOC

### Usage

\`\`\`tsx
import { Text } from "@docspace/ui-kit/components/text";

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
      options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
      description: "HTML element to render",
      table: {
        defaultValue: { summary: "p" },
      },
    },
    fontSize: {
      control: "text",
      description: "Sets the font size",
    },
    fontWeight: {
      control: "text",
      description: "Sets the font weight",
    },
    color: {
      control: "color",
      description: "Text color",
    },
    backgroundColor: {
      control: "color",
      description: "Background color",
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "Text alignment",
      table: {
        defaultValue: { summary: "left" },
      },
    },
    lineHeight: {
      control: "text",
      description: "Line height",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl", "auto"],
      description: "Text direction",
      table: {
        defaultValue: { summary: "ltr" },
      },
    },
    isBold: {
      control: "boolean",
      description: "Sets font weight to bold (700)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isItalic: {
      control: "boolean",
      description: "Sets font style to italic",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description: "Sets display to inline-block",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    truncate: {
      control: "boolean",
      description: "Truncates overflowing text with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noSelect: {
      control: "boolean",
      description: "Disables text selection",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    title: {
      control: "text",
      description: "Title attribute for native hover tooltip",
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
        story: "Text rendered at various font sizes from 10px to 24px.",
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
          "Text rendered at various font weights from light (300) to bold (700).",
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
          "Text with bold, italic, and combined bold+italic styling via boolean props.",
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
          "Text with different alignment options: left, center, right, and justify.",
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
          "Inline text elements rendered side by side using the isInline prop.",
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
          "Text that truncates with an ellipsis when it exceeds the container width.",
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
          "Text rendered as heading elements (h1-h6) using the as prop with appropriate sizes.",
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
          "Text direction support for LTR, RTL, and auto-detected direction.",
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
          "Text with selection disabled via the noSelect prop. Try selecting the second line.",
      },
      source: {
        code: `<Text>This text can be selected</Text>
<Text noSelect>This text cannot be selected</Text>`,
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

\`\`\`css
--text-size    /* font-size (default 13px) */
--text-weight  /* font-weight (default 400) */
\`\`\``,
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
