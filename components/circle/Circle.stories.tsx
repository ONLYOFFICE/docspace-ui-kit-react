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
