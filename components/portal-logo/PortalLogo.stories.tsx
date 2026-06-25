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

import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import PortalLogo from "./PortalLogo";

const meta = {
  title: "UI/Data display/PortalLogo",
  component: PortalLogo,
  parameters: {
    docs: {
      description: {
        component: `Renders the portal logo with responsive behavior based on screen width and theme.

### Features

- **Theme Aware**: Automatically selects light or dark logo variant
- **Responsive**: Switches to a compact logo on mobile when resizable
- **Error Handling**: Falls back to a default SVG logo if the image fails to load

### Usage

\`\`\`tsx
import PortalLogo from "@docspace/ui-kit/components/portal-logo";

// Basic portal logo
<PortalLogo />

// Resizable logo (adapts to mobile)
<PortalLogo isResizable />

// With custom class
<PortalLogo className="custom-logo" isResizable />
\`\`\``,
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional CSS class name applied to the logo",
    },
    isResizable: {
      control: "boolean",
      description:
        "Whether the logo resizes based on screen width (compact on mobile)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof PortalLogo>;

type Story = StoryObj<ComponentProps<typeof PortalLogo>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    // Group 1 — mobile header bar (visible when viewport <= 600 px)
    //   --portal-logo-mobile-bg      header bar background
    //   --portal-logo-mobile-height  bar height
    //   --portal-logo-mobile-img-height  logo image height inside the bar
    //
    // Group 2 — desktop logo image (visible when viewport > 600 px)
    //   --portal-logo-desktop-img-height  image height
    //   --portal-logo-desktop-img-width   image width
    <div
      style={
        {
          "--portal-logo-mobile-bg": "#e6f3fb",
          "--portal-logo-mobile-height": "56px",
          "--portal-logo-mobile-img-height": "28px",
          "--portal-logo-desktop-img-height": "44px",
          "--portal-logo-desktop-img-width": "320px",
        } as CSSProperties
      }
    >
      <PortalLogo isResizable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**Mobile header bar** (shown when viewport <= 600 px)

| Variable | Description | Default |
|----------|-------------|---------|
| \`--portal-logo-mobile-bg\` | Header bar background | theme-based |
| \`--portal-logo-mobile-height\` | Bar height | \`48px\` |
| \`--portal-logo-mobile-img-height\` | Logo image height | \`24px\` |

**Desktop logo image** (shown when viewport > 600 px)

| Variable | Description | Default |
|----------|-------------|---------|
| \`--portal-logo-desktop-img-height\` | Logo height | \`44px\` |
| \`--portal-logo-desktop-img-width\` | Logo width | \`386px\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: false,
  },
};

export const Resizable: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Resizable logo that adapts to screen width. On mobile viewports, it switches to a compact logo displayed in a fixed header bar.",
      },
      source: {
        code: `<PortalLogo isResizable />`,
      },
    },
  },
};

export const WithClassName: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    className: "custom-logo-class",
    isResizable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Portal logo with a custom CSS class applied for additional styling.",
      },
      source: {
        code: `<PortalLogo className="custom-logo-class" />`,
      },
    },
  },
};

