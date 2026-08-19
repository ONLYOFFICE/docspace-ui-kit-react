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
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

const meta = {
  title: "UI/Feedback/ColumnarInfoBar",
  component: ColumnarInfoBar,
  parameters: {
    docs: {
      description: {
        component: `A neutral info bar that displays labeled columns of data. Used for contextual information that doesn't require user action — such as profile details or event metadata.

### Features

- **Columnar layout**: flex-wrap grid of label + value pairs
- **Optional close button**: rendered only when \`onAction\` is provided
- **Optional header**: shown above columns when \`headerText\` is provided
- **Theme-aware**: neutral gray background in light mode, dark gray in dark mode

### Usage

\`\`\`tsx
import { ColumnarInfoBar } from "@docspace/ui-kit/components/columnar-info-bar";

// With close button (e.g. profile welcome bar)
<ColumnarInfoBar
  headerText="Your profile details"
  columns={[
    { label: "DocSpace name", value: "my-portal.onlyoffice.com" },
    { label: "Name", value: "John Smith" },
    { label: "Email", value: "john@example.com" },
    { label: "Generated password", value: "••••••••" },
  ]}
  onAction={handleClose}
/>

// Without close button (e.g. webhook event details)
<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event ID", value: "evt_123" },
    { label: "Event Type", value: "file.created" },
  ]}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "Optional heading displayed before the columns",
    },
    onAction: {
      description:
        "Close button callback. If omitted, no close button is rendered.",
    },
    onLoad: {
      description: "Called once after the component mounts.",
    },
  },
} satisfies Meta<typeof ColumnarInfoBar>;

type Story = StoryObj<ComponentProps<typeof ColumnarInfoBar>>;

export default meta;

export const ProfileDetails: Story = {
  name: "Profile details (with close)",
  args: {
    headerText: "Your profile details",
    columns: [
      { label: "DocSpace name", value: "my-portal.onlyoffice.com" },
      { label: "Name", value: "John Smith" },
      { label: "Email", value: "john@example.com" },
      { label: "Generated password", value: "••••••••" },
    ],
    onAction: fn(),
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Bar with a header and close button — used to show profile details after social auth registration.",
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <ColumnarInfoBar
      headerText="Custom styled bar"
      columns={[
        { label: "Project", value: "DocSpace" },
        { label: "Version", value: "2.6.0" },
        { label: "Region", value: "EU West" },
      ]}
      onAction={() => {}}
      style={
        {
          "--cib-bg": "#1e1b4b",
          "--cib-color": "#e0e7ff",
          "--cib-accent": "#6366f1",
        } as CSSProperties
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS custom properties for external theming. Pass via the \`style\` prop:

\`\`\`css
--cib-bg      /* background color (default: SnackBar warning background) */
--cib-color   /* text + label color (labels render at 60% opacity) */
--cib-accent  /* inline-start accent border color (default: warning orange) */
\`\`\``,
      },
      source: {
        code: `<ColumnarInfoBar
  columns={columns}
  style={{
    "--cib-bg": "#1e1b4b",
    "--cib-color": "#e0e7ff",
    "--cib-accent": "#6366f1",
  }}
/>`,
      },
    },
  },
};

export const EventDetails: Story = {
  name: "Webhook event details (no close)",
  args: {
    columns: [
      { label: "Status", value: "200 OK" },
      { label: "Event ID", value: "evt_01hx9z3k2m" },
      { label: "Event Type", value: "file.created" },
      { label: "Event Time", value: "May 26, 2026, 14:32" },
      { label: "Delivery Time", value: "May 26, 2026, 14:32:01" },
    ],
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Static info bar without a close button — used to show webhook event metadata in the event details view.",
      },
    },
  },
};
