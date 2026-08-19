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
import { fn } from "storybook/test";

import { SnackBar } from "./Snackbar";
import type { SnackbarProps, TextAlignValue } from "./Snackbar.types";

const meta = {
  title: "UI/Feedback/SnackBar",
  component: SnackBar,
  parameters: {
    docs: {
      description: {
        component: `SnackBar component for displaying persistent notification banners with optional actions and countdowns.

### Features

- **Header & Body**: Display a header text with a message body
- **Action Button**: Optional action button with text label
- **Countdown Timer**: Auto-dismiss with visible countdown
- **Icon Display**: Show an info/warning icon alongside content
- **HTML Content**: Render sanitized HTML content (via xss library)
- **Maintenance Mode**: Special styling for maintenance notices
- **Opacity Control**: Adjustable opacity for background styling
- **Close Button**: Dismiss the snackbar via close button

### Usage

\`\`\`tsx
import { SnackBar } from "@docspace/ui-kit/components/snackbar";

// Basic snackbar
<SnackBar
  headerText="Notice"
  text="Important notification"
  showIcon
  countDownTime={0}
  sectionWidth={500}
  onClose={handleClose}
/>

// With action button
<SnackBar
  headerText="Update"
  text="New version available"
  btnText="Update Now"
  onAction={handleUpdate}
  countDownTime={0}
  sectionWidth={500}
/>

// With countdown auto-dismiss
<SnackBar
  headerText="Info"
  text="Dismissing in 5 seconds"
  countDownTime={5000}
  sectionWidth={500}
  onAction={handleDismiss}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description: "Main message text",
    },
    headerText: {
      control: "text",
      description: "Header text displayed above the main message",
    },
    btnText: {
      control: "text",
      description: "Text for the action button",
    },
    showIcon: {
      control: "boolean",
      description: "Show the info/warning icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countDownTime: {
      control: "number",
      description:
        "Time in milliseconds before auto-dismissal (0 = no countdown)",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the snackbar background",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    isMaintenance: {
      control: "boolean",
      description: "Apply maintenance banner styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fontSize: {
      control: "text",
      description: "Font size for the message text",
    },
    fontWeight: {
      control: "number",
      description: "Font weight for the message text",
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "Text alignment for the message",
      table: {
        defaultValue: { summary: "left" },
      },
    },
    onAction: { action: "onAction" },
    onClose: { action: "onClose" },
    onLoad: { action: "onLoad" },
  },
} satisfies Meta<typeof SnackBar>;

type Story = StoryObj<ComponentProps<typeof SnackBar>>;

export default meta;

const baseArgs: SnackbarProps = {
  backgroundImg: "",
  opacity: 1,
  headerText: "Attention",
  text: "Important notification message",
  showIcon: true,
  fontSize: "13px",
  fontWeight: 400,
  textAlign: "left" as TextAlignValue,
  htmlContent: "",
  countDownTime: 0,
  sectionWidth: 500,
  onClose: fn(),
  onLoad: fn(),
  onAction: fn(),
};

const SnackBarWrapper = (args: SnackbarProps) => (
  <div data-testid="snackbar-wrapper" style={{ width: "calc(100% - 32px)" }}>
    <SnackBar {...args} />
  </div>
);

export const Default: Story = {
  render: (args) => <SnackBarWrapper {...args} />,
  args: baseArgs,
};

const WithActionTemplate = () => {
  return (
    <SnackBarWrapper
      {...baseArgs}
      btnText="Take Action"
      onAction={() => alert("Action taken!")}
    />
  );
};

const WithCountdownTemplate = () => {
  return (
    <SnackBarWrapper
      {...baseArgs}
      countDownTime={5000}
      text="This message will disappear in 5 seconds"
    />
  );
};

const WithHtmlContentTemplate = () => {
  return (
    <SnackBarWrapper
      {...baseArgs}
      htmlContent="<p style='margin: 0; font-size: 13px;'>Your storage is <b>almost full</b>. Please free up space or <a href='#' style='color: #4781d1;'>upgrade your plan</a> to continue working without interruptions.</p>"
      text=""
    />
  );
};

const MaintenanceTemplate = () => {
  return (
    <SnackBarWrapper
      {...baseArgs}
      isMaintenance
      headerText="Maintenance Notice"
      text="System maintenance is scheduled for tonight at 10 PM"
    />
  );
};

export const WithAction: Story = {
  render: () => <WithActionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Snackbar with an action button. Clicking the button triggers the onAction callback.",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  text="Important notification"
  btnText="Take Action"
  showIcon
  countDownTime={0}
  sectionWidth={500}
  onAction={handleAction}
/>`,
      },
    },
  },
};

export const WithCountdown: Story = {
  render: () => <WithCountdownTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Snackbar with a countdown timer that auto-dismisses after the specified duration.",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  text="This message will disappear in 5 seconds"
  showIcon
  countDownTime={5000}
  sectionWidth={500}
  onAction={handleDismiss}
/>`,
      },
    },
  },
};

export const WithHtmlContent: Story = {
  render: () => <WithHtmlContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Snackbar displaying sanitized HTML content instead of plain text.",
      },
      source: {
        code: `<SnackBar
  htmlContent="<p>Your storage is <b>almost full</b>. <a href='#'>Upgrade</a></p>"
  countDownTime={0}
  sectionWidth={500}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          width: "400px",
          "--snackbar-bg": "#1e1b4b",
          "--snackbar-text-color": "#ef4444",
          "--snackbar-accent-color": "#818cf8",
          "--snackbar-accent-width": "6px",
          "--snackbar-text-size": "13px",
          "--snackbar-content-padding": "16px 24px",
          "--snackbar-icon-fill": "#818cf8",
        } as CSSProperties
      }
    >
      <SnackBar
        text="Custom styled notification with CSS variables"
        headerText="Custom Theme"
        showIcon
        opacity={1}
        countDownTime={0}
        sectionWidth={400}
        onAction={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--snackbar-bg\` | Background color | theme token |
| \`--snackbar-text-color\` | Text color | theme token |
| \`--snackbar-accent-color\` | Accent border color | theme token |
| \`--snackbar-accent-width\` | Accent border width | \`4px\` |
| \`--snackbar-text-size\` | Font size | \`12px\` |
| \`--snackbar-content-padding\` | Content padding | \`12px 20px\` |
| \`--snackbar-icon-fill\` | Icon fill color | theme token |`,
      },
    },
  },
};

export const Maintenance: Story = {
  render: () => <MaintenanceTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Snackbar with maintenance banner styling for system-wide notices.",
      },
      source: {
        code: `<SnackBar
  isMaintenance
  headerText="Maintenance Notice"
  text="System maintenance is scheduled for tonight at 10 PM"
  showIcon
  countDownTime={0}
  sectionWidth={500}
/>`,
      },
    },
  },
};

