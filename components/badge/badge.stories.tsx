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

import { Badge } from ".";

const meta = {
  title: "UI/Data display/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `A versatile badge component for displaying notification counts, status markers, or interactive labels.

### Features

- **Numeric & Text Labels**: Display counts or text content
- **High Priority**: Emphasis styling for urgent notifications
- **Version Badge**: Specialized styling for version numbers
- **Paid Badge**: Styling for premium/paid feature indicators
- **Muted Badge**: Reduced prominence for inactive states
- **Hover States**: Built-in hover effects with manual override
- **Custom Styling**: Full control over colors, borders, padding, and radius

### Accessibility

- \`role="status"\`: Identifies the badge as a live status region
- \`aria-label\`: Describes the badge content and type
- \`aria-live="polite"\`: Announces updates to assistive technologies
- \`aria-atomic="true"\`: Ensures the full content is announced on updates

### Usage

\`\`\`tsx
import { Badge } from "@docspace/ui-kit/components/badge";

// Notification count
<Badge label={5} />

// Text badge
<Badge label="New" />

// High priority
<Badge type="high" label="Urgent" backgroundColor="#F21C0E" />

// Paid feature indicator
<Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=6057-171831&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Content to display: number or text",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    type: {
      control: "select",
      options: [undefined, "high"],
      description: "Badge type. Use 'high' for priority styling",
    },
    backgroundColor: {
      control: "color",
      description: "Custom background color",
    },
    color: {
      control: "color",
      description: "Custom text color",
    },
    fontSize: {
      control: "text",
      description: "Custom font size",
      table: {
        defaultValue: { summary: "11px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Custom font weight",
      table: {
        defaultValue: { summary: "800" },
      },
    },
    borderRadius: {
      control: "text",
      description: "Custom border radius",
      table: {
        defaultValue: { summary: "11px" },
      },
    },
    padding: {
      control: "text",
      description: "Custom padding",
      table: {
        defaultValue: { summary: "0px 5px" },
      },
    },
    maxWidth: {
      control: "text",
      description: "Maximum width of the badge",
      table: {
        defaultValue: { summary: "50px" },
      },
    },
    height: {
      control: "text",
      description: "Custom height",
    },
    border: {
      control: "text",
      description: "Custom border style",
    },
    noHover: {
      control: "boolean",
      description: "Disable hover effects",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description: "Force hover state (for demo purposes)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isVersionBadge: {
      control: "boolean",
      description: "Apply version badge styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isPaidBadge: {
      control: "boolean",
      description: "Apply paid/premium feature styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMutedBadge: {
      control: "boolean",
      description: "Apply muted styling for less prominent display",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<ComponentProps<typeof Badge>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Badge {...args} />,
  args: {
    label: 24,
  },
};

const BadgeTypesTemplate = () => {
  return (
    <Wrapper>
      <Badge label={3} />
      <Badge label="New" />
      <Badge label="99+" />
      <Badge type="high" label="High" backgroundColor={globalColors.mainRed} />
    </Wrapper>
  );
};

const SpecialBadgesTemplate = () => {
  return (
    <Wrapper>
      <Badge label="v1.2.3" isVersionBadge />
      <Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
      <Badge label="Muted" isMutedBadge />
    </Wrapper>
  );
};

const HoverStatesTemplate = () => {
  return (
    <Wrapper>
      <Badge label="Default" />
      <Badge label="Hovered" isHovered />
      <Badge label="No Hover" noHover />
    </Wrapper>
  );
};

const CustomStyledTemplate = () => {
  return (
    <Wrapper>
      <Badge
        label="Custom"
        backgroundColor="#335EA3"
        color="#FFFFFF"
        fontSize="14px"
        fontWeight={600}
        borderRadius="8px"
        padding="4px 12px"
      />
      <Badge
        label="Bordered"
        border="2px solid #333"
        backgroundColor="transparent"
        color="#333"
      />
      <Badge
        label="Large"
        maxWidth="80px"
        padding="4px 16px"
        fontSize="14px"
      />
    </Wrapper>
  );
};

const InteractiveTemplate = () => {
  return (
    <Badge label="Click me" onClick={() => alert("Badge clicked!")} />
  );
};

export const BadgeTypes: Story = {
  render: () => <BadgeTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Different badge content types: numeric counts, text labels, and high priority badges.",
      },
      source: {
        code: `<Badge label={3} />
<Badge label="New" />
<Badge label="99+" />
<Badge type="high" label="High" backgroundColor={globalColors.mainRed} />`,
      },
    },
  },
};

export const SpecialBadges: Story = {
  render: () => <SpecialBadgesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Specialized badge variants: version badges, paid feature indicators, and muted badges.",
      },
      source: {
        code: `<Badge label="v1.2.3" isVersionBadge />
<Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
<Badge label="Muted" isMutedBadge />`,
      },
    },
  },
};

export const HoverStates: Story = {
  render: () => <HoverStatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Badge hover behavior: default hover effect, forced hover state, and disabled hover.",
      },
      source: {
        code: `<Badge label="Default" />
<Badge label="Hovered" isHovered />
<Badge label="No Hover" noHover />`,
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
          "Badges with custom styling: colors, borders, padding, border-radius, and font properties.",
      },
      source: {
        code: `<Badge label="Custom" backgroundColor="#335EA3" color="#FFFFFF" fontSize="14px" fontWeight={600} borderRadius="8px" padding="4px 12px" />
<Badge label="Bordered" border="2px solid #333" backgroundColor="transparent" color="#333" />
<Badge label="Large" maxWidth="80px" padding="4px 16px" fontSize="14px" />`,
      },
    },
  },
};

export const InteractiveBadge: Story = {
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Badge with click handler for interactive behavior.",
      },
      source: {
        code: `<Badge label="Click me" onClick={() => alert("Badge clicked!")} />`,
      },
    },
  },
};
