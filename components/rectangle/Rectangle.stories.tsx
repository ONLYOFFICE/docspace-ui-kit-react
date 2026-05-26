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

import { RectangleSkeleton } from ".";

const meta = {
  title: "UI/Skeletons/Rectangle",
  component: RectangleSkeleton,
  argTypes: {
    width: {
      control: "text",
      description: "Width of the rectangle",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description: "Height of the rectangle",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    x: {
      control: "text",
      description: "X position of the rectangle",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    y: {
      control: "text",
      description: "Y position of the rectangle",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    borderRadius: {
      control: "text",
      description: "Border radius of the rectangle",
      table: {
        defaultValue: { summary: "0" },
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
        component: `A rectangular skeleton loader component with customizable dimensions, colors, and animation.

### Features

- **Configurable Dimensions**: Set width, height, position, and border radius
- **Custom Colors**: Adjustable background and foreground colors with independent opacity controls
- **Animation Control**: Toggle animation on/off and adjust animation speed
- **SVG Based**: Renders as an SVG rectangle for crisp display at any resolution
- **Border Radius**: Supports rounded corners for pill or card-style placeholders

### Usage

\`\`\`tsx
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";

<RectangleSkeleton width="200px" height="100px" />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof RectangleSkeleton>;

type Story = StoryObj<ComponentProps<typeof RectangleSkeleton>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <RectangleSkeleton
        width="280px"
        height="40px"
        borderRadius="20px"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <RectangleSkeleton
        width="200px"
        height="40px"
        borderRadius="20px"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <RectangleSkeleton
        width="160px"
        height="40px"
        borderRadius="20px"
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
        story: `The RectangleSkeleton component uses props for styling (no CSS custom properties):

| Prop | Description | Default |
|------|-------------|---------|
| \`backgroundColor\` | Skeleton background color | theme-based |
| \`foregroundColor\` | Skeleton shimmer color | theme-based |
| \`backgroundOpacity\` | Background opacity | \`0.1\` |
| \`foregroundOpacity\` | Foreground opacity | \`0.15\` |
| \`borderRadius\` | Shape corner radius | \`0\` |
| \`speed\` | Animation speed (seconds) | \`2\` |
| \`animate\` | Toggle animation | \`true\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
  },
  parameters: {
    docs: {
      description: {
        story: "Default rectangle skeleton with standard dimensions.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" />`,
      },
    },
  },
};

export const SmallCircle: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rectangle skeleton with 50% border radius to create a circular shape.",
      },
      source: {
        code: `<RectangleSkeleton width="40px" height="40px" borderRadius="50%" />`,
      },
    },
  },
};

export const CustomColors: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rectangle skeleton with custom background and foreground colors and opacity values.",
      },
      source: {
        code: `<RectangleSkeleton
  width="200px"
  height="100px"
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
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Static rectangle skeleton with animation disabled.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" animate={false} />`,
      },
    },
  },
};

export const SlowAnimation: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    speed: 2.5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rectangle skeleton with a slower animation speed of 2.5 seconds.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" speed={2.5} />`,
      },
    },
  },
};

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multiple rectangle skeletons arranged in a 3-column grid layout, simulating a card grid placeholder.",
      },
      source: {
        code: `<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
</div>`,
      },
    },
  },
};
