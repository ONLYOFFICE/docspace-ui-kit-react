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

import { globalColors } from "../../providers/theme";
import { Link } from "../link";
import { Text } from "../text";
import { Tooltip } from ".";

const meta = {
  title: "UI/Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: `Tooltip displays contextual information when hovering over or clicking on elements.

### Features

- **12 Placement Options**: top, right, bottom, left with start/end variants
- **Custom Styling**: Configurable background color, opacity, and max width
- **Click or Hover Trigger**: Choose between hover (default) and click-to-show modes
- **Dynamic Content**: Generate tooltip content dynamically via \`getContent\` callback
- **Floating Behavior**: Follow cursor position with the \`float\` prop
- **Arrow Control**: Show or hide the tooltip arrow pointer

### Usage

\`\`\`tsx
import { Tooltip } from "@docspace/ui-kit/components/tooltip";

// Basic tooltip
<Link data-tooltip-id="my-tooltip" data-tooltip-content="Hello!">
  Hover me
</Link>
<Tooltip id="my-tooltip" />

// With custom styling
<Tooltip id="styled" color="green" maxWidth="200px" />

// Click to show
<Tooltip id="click" openOnClick />

// Dynamic content
<Tooltip
  id="dynamic"
  getContent={({ content }) => <div>{content}</div>}
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=649%3A4458&mode=dev",
    },
  },
  argTypes: {
    place: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ],
      description: "Position of the tooltip relative to the target element",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    color: {
      control: "color",
      description: "Background color of the tooltip",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the tooltip",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    maxWidth: {
      control: "text",
      description: "Maximum width of the tooltip",
    },
    noArrow: {
      control: "boolean",
      description: "Hides the arrow pointer",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    openOnClick: {
      control: "boolean",
      description: "Opens tooltip on click instead of hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    float: {
      control: "boolean",
      description: "Enables floating behavior that follows cursor position",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<ComponentProps<typeof Tooltip>>;

export default meta;

const bodyStyle = { marginTop: 100, marginInlineStart: 200 };

export const Default: Story = {
  render: (args) => {
    return (
      <div style={{ height: "240px" }}>
        <div style={{ ...bodyStyle, position: "absolute" as const }}>
          <Link
            data-tooltip-id="default-tooltip"
            data-tooltip-content="Simple tooltip"
          >
            Hover me
          </Link>
        </div>
        <Tooltip {...args} id="default-tooltip" />
      </div>
    );
  },
  args: {
    float: true,
    place: "top",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default tooltip that appears on hover with floating behavior enabled.",
      },
      source: {
        code: `<Link data-tooltip-id="my-tooltip" data-tooltip-content="Simple tooltip">
  Hover me
</Link>
<Tooltip id="my-tooltip" float place="top" />`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="styled-tooltip"
          data-tooltip-content="Styled tooltip"
        >
          Hover for styled tooltip
        </Link>
      </div>
      <Tooltip
        id="styled-tooltip"
        color="green"
        opacity={0.9}
        maxWidth="200px"
        noArrow={false}
      />
    </div>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tooltip with custom background color, opacity, and max width styling.",
      },
      source: {
        code: `<Link data-tooltip-id="styled" data-tooltip-content="Styled tooltip">
  Hover for styled tooltip
</Link>
<Tooltip id="styled" color="green" opacity={0.9} maxWidth="200px" />`,
      },
    },
  },
};

const ClickToShowTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="click-tooltip"
          data-tooltip-content="Click-triggered tooltip"
        >
          Click me
        </Link>
      </div>
      <Tooltip id="click-tooltip" openOnClick place="right" />
    </div>
  );
};

export const ClickToShow: Story = {
  render: () => <ClickToShowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tooltip triggered by click instead of hover. Useful for touch devices or explicit actions.",
      },
      source: {
        code: `<Link data-tooltip-id="click" data-tooltip-content="Click-triggered tooltip">
  Click me
</Link>
<Tooltip id="click" openOnClick place="right" />`,
      },
    },
  },
};

const RichContentTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="rich-tooltip"
          data-tooltip-content="Bob Johnston"
        >
          Hover for rich content
        </Link>
      </div>
      <Tooltip
        id="rich-tooltip"
        float
        place="top"
        maxWidth="250px"
        getContent={({ content }) => (
          <div>
            <Text isBold fontSize="16px">
              {content}
            </Text>
            <Text color={globalColors.gray} fontSize="13px">
              BobJohnston@gmail.com
            </Text>
            <Text fontSize="13px">Developer</Text>
          </div>
        )}
      />
    </div>
  );
};

export const RichContent: Story = {
  render: () => <RichContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tooltip with rich content rendered via the getContent callback. Displays structured user information.",
      },
      source: {
        code: `<Link data-tooltip-id="rich" data-tooltip-content="Bob Johnston">
  Hover for rich content
</Link>
<Tooltip
  id="rich"
  float
  maxWidth="250px"
  getContent={({ content }) => (
    <div>
      <Text isBold>{content}</Text>
      <Text>BobJohnston@gmail.com</Text>
      <Text>Developer</Text>
    </div>
  )}
/>`,
      },
    },
  },
};

const DynamicGroupTemplate = () => {
  const users = [
    { name: "Bob", email: "bob@example.com", position: "Developer" },
    { name: "Alice", email: "alice@example.com", position: "Designer" },
    { name: "Charlie", email: "charlie@example.com", position: "Manager" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Text>Group of tooltips:</Text>
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        {users.map((user, index) => (
          <Link
            key={user.name}
            data-tooltip-id="group-tooltip"
            data-tooltip-content={index}
          >
            {user.name}
          </Link>
        ))}
      </div>
      <Tooltip
        id="group-tooltip"
        getContent={({ content }) => {
          const user = users[Number(content)];
          return user ? (
            <div>
              <Text isBold fontSize="16px">
                {user.name}
              </Text>
              <Text color={globalColors.gray} fontSize="13px">
                {user.email}
              </Text>
              <Text fontSize="13px">{user.position}</Text>
            </div>
          ) : null;
        }}
      />
    </div>
  );
};

export const DynamicGroup: Story = {
  render: () => <DynamicGroupTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A single tooltip shared by multiple trigger elements. Uses getContent to display different data for each anchor.",
      },
      source: {
        code: `{users.map((user, index) => (
  <Link data-tooltip-id="group" data-tooltip-content={index}>
    {user.name}
  </Link>
))}
<Tooltip
  id="group"
  getContent={({ content }) => {
    const user = users[Number(content)];
    return <div><Text isBold>{user.name}</Text></div>;
  }}
/>`,
      },
    },
  },
};
