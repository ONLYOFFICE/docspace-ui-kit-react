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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { CircleSkeleton } from ".";

const meta = {
  title: "UI/Skeletons/Circle",
  component: CircleSkeleton,
  argTypes: {
    radius: {
      control: "text",
      description: "Radius of the circle",
      table: {
        defaultValue: { summary: "25" },
      },
    },
    x: {
      control: "text",
      description: "X coordinate of circle center",
      table: {
        defaultValue: { summary: "25" },
      },
    },
    y: {
      control: "text",
      description: "Y coordinate of circle center",
      table: {
        defaultValue: { summary: "25" },
      },
    },
    width: {
      control: "text",
      description: "Width of the SVG container",
      table: {
        defaultValue: { summary: "50" },
      },
    },
    height: {
      control: "text",
      description: "Height of the SVG container",
      table: {
        defaultValue: { summary: "50" },
      },
    },
    backgroundColor: {
      control: "color",
      description: "Background color of the skeleton",
      table: {
        defaultValue: { summary: "#000000" },
      },
    },
    foregroundColor: {
      control: "color",
      description: "Foreground color of the skeleton",
      table: {
        defaultValue: { summary: "#000000" },
      },
    },
    backgroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the background",
      table: {
        defaultValue: { summary: "0.1" },
      },
    },
    foregroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the foreground",
      table: {
        defaultValue: { summary: "0.15" },
      },
    },
    speed: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
      description: "Animation speed in seconds",
      table: {
        defaultValue: { summary: "2" },
      },
    },
    animate: {
      control: "boolean",
      description: "Whether to animate the skeleton",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A circular skeleton loader component with customizable dimensions, colors, and animation.

### Features

- **Configurable Dimensions**: Set width, height, radius, and center coordinates
- **Custom Colors**: Adjustable background and foreground colors with independent opacity controls
- **Animation Control**: Toggle animation on/off and adjust animation speed
- **SVG Based**: Renders as an SVG circle for crisp display at any resolution

### Usage

\`\`\`tsx
import { CircleSkeleton } from "@docspace/ui-kit/components/circle";

<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof CircleSkeleton>;

type Story = StoryObj<ComponentProps<typeof CircleSkeleton>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <CircleSkeleton
        width="40"
        height="40"
        radius="20"
        x="20"
        y="20"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <CircleSkeleton
        width="56"
        height="56"
        radius="28"
        x="28"
        y="28"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <CircleSkeleton
        width="80"
        height="80"
        radius="40"
        x="40"
        y="40"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The CircleSkeleton component uses props for styling (no CSS custom properties):

| Prop | Description | Default |
|------|-------------|---------|
| \`backgroundColor\` | Skeleton background color | theme-based |
| \`foregroundColor\` | Skeleton shimmer color | theme-based |
| \`backgroundOpacity\` | Background opacity | \`0.1\` |
| \`foregroundOpacity\` | Foreground opacity | \`0.15\` |
| \`radius\` | Circle radius in SVG units | \`12\` |
| \`x\` / \`y\` | Circle center coordinates | \`3\` / \`12\` |
| \`speed\` | Animation speed (seconds) | \`2\` |
| \`animate\` | Toggle animation | \`true\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
  },
  parameters: {
    docs: {
      description: {
        story: "Default circle skeleton with standard dimensions.",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" />`,
      },
    },
  },
};

export const SmallAvatar: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "32",
    height: "32",
    radius: "16",
    x: "16",
    y: "16",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Small avatar-sized circle skeleton, suitable for compact user avatars.",
      },
      source: {
        code: `<CircleSkeleton width="32" height="32" radius="16" x="16" y="16" />`,
      },
    },
  },
};

export const LargeAvatar: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "80",
    height: "80",
    radius: "40",
    x: "40",
    y: "40",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large avatar-sized circle skeleton, suitable for profile images.",
      },
      source: {
        code: `<CircleSkeleton width="80" height="80" radius="40" x="40" y="40" />`,
      },
    },
  },
};

export const CustomColors: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Circle skeleton with custom background and foreground colors and opacity values.",
      },
      source: {
        code: `<CircleSkeleton
  width="50"
  height="50"
  radius="20"
  x="25"
  y="25"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>`,
      },
    },
  },
};

export const NoAnimation: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Static circle skeleton with animation disabled.",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" animate={false} />`,
      },
    },
  },
};

export const SlowAnimation: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    speed: 2.5,
  },
  parameters: {
    docs: {
      description: {
        story: "Circle skeleton with a slower animation speed of 2.5 seconds.",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" speed={2.5} />`,
      },
    },
  },
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multiple circle skeletons arranged in a row, simulating an avatar group placeholder.",
      },
      source: {
        code: `<div style={{ display: "flex", gap: "8px" }}>
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
</div>`,
      },
    },
  },
};
