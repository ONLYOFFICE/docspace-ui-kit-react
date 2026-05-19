/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading, HeadingLevel, HeadingSize } from ".";

const meta = {
  title: "UI/Data display/Heading",
  component: Heading,
  parameters: {
    docs: {
      description: {
        component: `Heading component for rendering semantic heading elements with configurable levels, sizes, and types.

### Features

- **Semantic Levels**: Renders h1-h6 elements for proper document hierarchy
- **Five Sizes**: xsmall, small, medium, large, and xlarge preset sizes
- **Type Variants**: Default, header, menu, and content styling types
- **Truncation**: Truncate overflowing text with ellipsis
- **Inline Display**: Render headings inline alongside other content
- **Custom Styling**: Override color, fontSize, fontWeight, and lineHeight
- **Tooltip Support**: Available via HeadingWithTooltip wrapper

### Usage

\`\`\`tsx
import { Heading, HeadingLevel, HeadingSize } from "@docspace/ui-kit/components/heading";

// Basic heading
<Heading level={HeadingLevel.h1} size={HeadingSize.large}>Page Title</Heading>

// Menu-style heading
<Heading level={HeadingLevel.h3} type="menu">Menu Section</Heading>

// Truncated heading
<Heading level={HeadingLevel.h2} truncate>Very long heading text...</Heading>
\`\`\``,
      },
    },
  },
  argTypes: {
    level: {
      control: "select",
      options: Object.keys(HeadingLevel).filter((key) =>
        Number.isNaN(Number(key)),
      ),
      description: "HTML heading level (h1-h6)",
      table: {
        defaultValue: { summary: "h1" },
      },
    },
    size: {
      control: "select",
      options: Object.values(HeadingSize),
      description: "Heading size preset",
      table: {
        defaultValue: { summary: "medium" },
      },
    },
    type: {
      control: "select",
      options: ["default", "header", "menu", "content"],
      description: "Heading type variant",
    },
    color: {
      control: "color",
      description: "Text color",
    },
    truncate: {
      control: "boolean",
      description: "Truncate overflowing text with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description: "Display heading inline",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fontSize: {
      control: "text",
      description: "Custom font size override",
    },
    fontWeight: {
      control: "text",
      description: "Custom font weight override",
    },
    lineHeight: {
      control: "text",
      description: "Custom line height override",
    },
  },
} satisfies Meta<typeof Heading>;

type Story = StoryObj<ComponentProps<typeof Heading>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Heading {...args} />,
  args: {
    level: HeadingLevel.h1,
    size: HeadingSize.large,
    children: "Default Heading",
  },
};

const LevelsTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1}>H1 Heading</Heading>
      <Heading level={HeadingLevel.h2}>H2 Heading</Heading>
      <Heading level={HeadingLevel.h3}>H3 Heading</Heading>
      <Heading level={HeadingLevel.h4}>H4 Heading</Heading>
      <Heading level={HeadingLevel.h5}>H5 Heading</Heading>
      <Heading level={HeadingLevel.h6}>H6 Heading</Heading>
    </Wrapper>
  );
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>
        XSmall Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.small}>
        Small Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.medium}>
        Medium Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.large}>
        Large Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>
        XLarge Heading
      </Heading>
    </Wrapper>
  );
};

const TypesTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1}>Default Type</Heading>
      <Heading level={HeadingLevel.h1} type="header">
        Header Type
      </Heading>
      <Heading level={HeadingLevel.h1} type="menu">
        Menu Type
      </Heading>
      <Heading level={HeadingLevel.h1} type="content">
        Content Type
      </Heading>
    </Wrapper>
  );
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: 250 }}>
      <Heading level={HeadingLevel.h2} truncate>
        This is a very long heading that will be truncated when it exceeds the
        container width
      </Heading>
    </div>
  );
};

const CustomStyledTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1} color="blue">
        Blue Heading
      </Heading>
      <Heading
        level={HeadingLevel.h1}
        style={{ fontStyle: "italic" }}
      >
        Italic Heading
      </Heading>
      <Heading
        level={HeadingLevel.h1}
        style={{ textDecoration: "underline" }}
      >
        Underlined Heading
      </Heading>
    </Wrapper>
  );
};

export const Levels: Story = {
  render: () => <LevelsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All six heading levels (h1-h6) for semantic document structure.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1}>H1 Heading</Heading>
<Heading level={HeadingLevel.h2}>H2 Heading</Heading>
<Heading level={HeadingLevel.h3}>H3 Heading</Heading>
<Heading level={HeadingLevel.h4}>H4 Heading</Heading>
<Heading level={HeadingLevel.h5}>H5 Heading</Heading>
<Heading level={HeadingLevel.h6}>H6 Heading</Heading>`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All five size presets from xsmall to xlarge, independent of the heading level.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>XSmall Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.small}>Small Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.medium}>Medium Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.large}>Large Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>XLarge Heading</Heading>`,
      },
    },
  },
};

export const Types: Story = {
  render: () => <TypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Different heading types: default, header, menu, and content, each with distinct styling.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1}>Default Type</Heading>
<Heading level={HeadingLevel.h1} type="header">Header Type</Heading>
<Heading level={HeadingLevel.h1} type="menu">Menu Type</Heading>
<Heading level={HeadingLevel.h1} type="content">Content Type</Heading>`,
      },
    },
  },
};

export const TruncatedHeading: Story = {
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Heading that truncates with an ellipsis when it exceeds the container width.",
      },
      source: {
        code: `<div style={{ width: 250 }}>
  <Heading level={HeadingLevel.h2} truncate>
    This is a very long heading that will be truncated...
  </Heading>
</div>`,
      },
    },
  },
};

export const CustomStyled: Story = {
  render: () => <CustomStyledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Headings with custom color and style overrides for unique visual treatments.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1} color="blue">Blue Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ fontStyle: "italic" }}>Italic Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ textDecoration: "underline" }}>Underlined Heading</Heading>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--heading-text-color": "#7B4FBF",
          "--heading-weight": "800",
          "--heading-size-content": "22px",
        } as CSSProperties
      }
    >
      <Heading level={HeadingLevel.h2} type="content">
        Custom Heading
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

\`\`\`css
--heading-text-color     /* color override */
--heading-weight         /* font-weight override */
--heading-size-content   /* content type font-size (default 18px) */
--heading-size-menu      /* menu type font-size (default 23px) */
--heading-size-header    /* header type font-size (default 28px) */
\`\`\``,
      },
      source: {
        code: `<div
  style={{
    "--heading-text-color": "#7B4FBF",
    "--heading-weight": "800",
    "--heading-size-content": "22px",
  }}
>
  <Heading level={HeadingLevel.h2} type="content">
    Custom Heading
  </Heading>
</div>`,
      },
    },
  },
};
