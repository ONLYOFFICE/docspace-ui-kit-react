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

import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import AppLoader from "./index";

const meta = {
  title: "UI/Status components/AppLoader",
  component: AppLoader,
  parameters: {
    docs: {
      description: {
        component: `A full-screen loading indicator displayed while the application is initializing. Uses the Rombs animation loader.

### Features

- **Full-Screen Overlay**: Centers the loader in the viewport with fixed positioning
- **Rombs Animation**: Uses the animated rombs (diamond) loader style
- **Dark Mode Support**: Automatically adjusts background via CSS variables
- **Zero Configuration**: No props required - renders a consistent loading state

### Usage

\`\`\`tsx
import AppLoader from "@docspace/ui-kit/components/app-loader";

<AppLoader />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AppLoader>;

type Story = StoryObj<typeof AppLoader>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--app-loader-bg": "#e6f3fb",
          "--app-loader-z-index": "100",
        } as CSSProperties
      }
    >
      <div style={{ width: "500px", height: "500px", position: "relative" }}>
        <AppLoader />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--app-loader-bg\` | Background color of the overlay | white / black |
| \`--app-loader-z-index\` | Stack order of the overlay | \`5000\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: () => (
    <div style={{ width: "500px", height: "500px", position: "relative" }}>
      <AppLoader />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full-screen application loader with rombs animation, rendered inside a constrained container for demonstration.",
      },
      source: {
        code: `<AppLoader />`,
      },
    },
  },
};
