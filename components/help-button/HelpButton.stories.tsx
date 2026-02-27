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

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "../text";

import { HelpButton } from ".";

const meta = {
  title: "UI/Interactive elements/HelpButton",
  component: HelpButton,
  parameters: {
    docs: {
      description: {
        component: `HelpButton displays a help icon with a tooltip. Commonly used to provide additional information or guidance to users.

### Features

- **Tooltip Content**: Accepts any React node as tooltip content
- **Positioning**: Configurable tooltip placement (top, right, bottom, left)
- **Size and Color**: Customizable icon size and color
- **Click Mode**: Option to show tooltip on click instead of hover
- **Offset Control**: Fine-grained positioning with offset props

### Usage

\`\`\`tsx
import { HelpButton } from "@docspace/ui-kit/components/help-button";

// Basic help button
<HelpButton tooltipContent={<div>Help text here</div>} />

// With custom position and offset
<HelpButton
  tooltipContent={<div>Help text</div>}
  place="top"
  offset={12}
/>

// With custom size and color
<HelpButton
  tooltipContent={<div>Help text</div>}
  size={24}
  color="#2DA7DB"
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    tooltipContent: {
      description: "Content to be displayed in the tooltip",
      control: "text",
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Position of the tooltip relative to the button",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    size: {
      control: { type: "number", min: 8, max: 48 },
      description: "Size of the help icon",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    color: {
      control: "color",
      description: "Color of the help icon",
    },
    offset: {
      control: "number",
      description: "Offset distance for the tooltip from the target element",
    },
    openOnClick: {
      control: "boolean",
      description: "Whether to open tooltip on click instead of hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isClickable: {
      control: "boolean",
      description: "Whether the button is clickable",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof HelpButton>;

type Story = StoryObj<ComponentProps<typeof HelpButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton {...args} />
    </div>
  ),
  args: {
    tooltipContent: <div>This is a help tooltip</div>,
    place: "right",
    offset: 8,
  },
};

const CustomStyleTemplate = () => {
  return (
    <Wrapper>
      <HelpButton
        tooltipContent={<div>Default size</div>}
        place="top"
        offset={8}
      />
      <HelpButton
        tooltipContent={<div>Large blue help button</div>}
        size={24}
        color="#2DA7DB"
        place="top"
        offset={12}
      />
      <HelpButton
        tooltipContent={<div>Large green help button</div>}
        size={20}
        color="#4CAF50"
        place="top"
        offset={12}
      />
    </Wrapper>
  );
};

export const CustomStyle: Story = {
  render: () => <CustomStyleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Help buttons with custom sizes and colors. Hover over each to see the tooltip.",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Default size</div>} place="top" />
<HelpButton tooltipContent={<div>Large blue</div>} size={24} color="#2DA7DB" place="top" />
<HelpButton tooltipContent={<div>Large green</div>} size={20} color="#4CAF50" place="top" />`,
      },
    },
  },
};

const WithCustomContentTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        tooltipContent={
          <div style={{ padding: "8px" }}>
            <Text fontSize="14px" fontWeight="bold">
              Help Information
            </Text>
            <ul style={{ margin: "8px 0" }}>
              <li>First instruction</li>
              <li>Second instruction</li>
              <li>Third instruction</li>
            </ul>
            <Text fontSize="12px" color="gray">
              Click for more details
            </Text>
          </div>
        }
        place="right"
        offset={8}
      />
    </div>
  );
};

export const WithCustomContent: Story = {
  render: () => <WithCustomContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "HelpButton with rich tooltip content containing formatted text, lists, and styled elements.",
      },
      source: {
        code: `<HelpButton
  tooltipContent={
    <div>
      <Text fontWeight="bold">Help Information</Text>
      <ul>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ul>
    </div>
  }
  place="right"
/>`,
      },
    },
  },
};

const TooltipPositionsTemplate = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "48px",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((place) => (
        <div
          key={place}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          <HelpButton
            tooltipContent={<div>Tooltip appears at {place}</div>}
            place={place}
            offset={8}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>{place}</span>
        </div>
      ))}
    </div>
  );
};

export const TooltipPositions: Story = {
  render: () => <TooltipPositionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "HelpButton with tooltips in all four positions: top, right, bottom, and left. Hover over each to see the placement.",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Top</div>} place="top" />
<HelpButton tooltipContent={<div>Right</div>} place="right" />
<HelpButton tooltipContent={<div>Bottom</div>} place="bottom" />
<HelpButton tooltipContent={<div>Left</div>} place="left" />`,
      },
    },
  },
};
