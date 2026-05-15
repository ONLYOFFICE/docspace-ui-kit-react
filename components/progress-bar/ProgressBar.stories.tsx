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

import { ProgressBar, PreparationPortalProgress } from ".";

const meta = {
  title: "UI/Status components/ProgressBar",
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: `A progress bar component that displays operation progress with percentage, labels, status text, and error messages.

### Features

- **Percentage Display**: Visual progress from 0% to 100% (values above 100 are capped)
- **Label Text**: Customizable label describing the ongoing operation
- **Status Messages**: Show current processing state below the bar
- **Error Display**: Red error message when an operation fails
- **Infinite Mode**: Animated loading bar for indeterminate progress

### Accessibility

- \`role="progressbar"\` with \`aria-valuenow\`, \`aria-valuemin\`, \`aria-valuemax\`
- \`aria-label\` for screen reader description

### Usage

\`\`\`tsx
import { ProgressBar } from "@docspace/ui-kit/components/progress-bar";

// Basic progress
<ProgressBar percent={50} label="Uploading file..." />

// With status
<ProgressBar percent={75} label="Processing" status="3 of 4 files processed" />

// Infinite loading
<ProgressBar percent={0} label="Please wait..." isInfiniteProgress />
\`\`\``,
      },
    },
  },
  argTypes: {
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description: "Progress value as a percentage (0-100, capped at 100)",
    },
    label: {
      control: "text",
      description: "Text label describing the operation",
    },
    isInfiniteProgress: {
      control: "boolean",
      description:
        "Display infinite loading animation instead of percentage-based progress",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    status: {
      control: "text",
      description: "Status text displayed below the progress bar",
    },
    error: {
      control: "text",
      description: "Error message displayed in red below the progress bar",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
    },
  },
} satisfies Meta<typeof ProgressBar>;

type Story = StoryObj<ComponentProps<typeof ProgressBar>>;

export default meta;

export const Default: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 50,
    label: "Uploading file...",
  },
  parameters: {
    docs: {
      description: {
        story: "Basic progress bar at 50% with a label.",
      },
      source: {
        code: `<ProgressBar percent={50} label="Uploading file..." />`,
      },
    },
  },
};

export const WithStatus: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 75,
    label: "Processing document",
    status: "3 of 4 files processed",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Progress bar with status text showing processing details below the bar.",
      },
      source: {
        code: `<ProgressBar percent={75} label="Processing document" status="3 of 4 files processed" />`,
      },
    },
  },
};

export const WithError: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 30,
    label: "Upload failed",
    error: "Network connection error",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Progress bar in error state with a red error message displayed below.",
      },
      source: {
        code: `<ProgressBar percent={30} label="Upload failed" error="Network connection error" />`,
      },
    },
  },
};

export const InfiniteProgress: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 0,
    label: "Please wait...",
    isInfiniteProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Infinite loading animation for operations with indeterminate progress.",
      },
      source: {
        code: `<ProgressBar percent={0} label="Please wait..." isInfiniteProgress />`,
      },
    },
  },
};

export const Complete: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 100,
    label: "Upload complete",
    status: "All files processed successfully",
  },
  parameters: {
    docs: {
      description: {
        story: "Progress bar at 100% completion with a success status message.",
      },
      source: {
        code: `<ProgressBar percent={100} label="Upload complete" status="All files processed successfully" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          "--progress-bar-size": "8px",
          "--progress-bar-radius": "8px",
          "--progress-bar-fill": "#7c3aed",
          "--progress-bar-track": "#e9d5ff",
          "--progress-bar-bottom-margin": "12px",
        } as CSSProperties
      }
    >
      <ProgressBar {...args} />
    </div>
  ),
  args: {
    percent: 65,
    label: "Customized progress bar",
    status: "Violet theme, 8px height",
  },
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization. Set on a parent element:

\`\`\`css
--progress-bar-track      /* track background (replaces theme color) */
--progress-bar-fill       /* fill background (replaces theme color) */
--progress-bar-text       /* status text color */
--progress-bar-error-text /* error text color */
--progress-bar-size       /* bar height (default: 4px) */
--progress-bar-radius     /* border radius (default: 3px) */
--progress-bar-bottom-margin /* margin below bar (default: 8px) */
\`\`\``,
      },
      source: {
        code: `<div style={{
  "--progress-bar-size": "8px",
  "--progress-bar-radius": "8px",
  "--progress-bar-fill": "#7c3aed",
  "--progress-bar-track": "#e9d5ff",
}}>
  <ProgressBar percent={65} label="Customized" />
</div>`,
      },
    },
  },
};

type PreparationStory = StoryObj<ComponentProps<typeof PreparationPortalProgress>>;

export const PreparationPortal: PreparationStory = {
  render: (args) => <PreparationPortalProgress {...args} />,
  args: {
    percent: 75,
    text: "Preparing your portal...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Specialized portal preparation progress bar showing percentage and descriptive text.",
      },
      source: {
        code: `<PreparationPortalProgress percent={75} text="Preparing your portal..." />`,
      },
    },
  },
};
