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

import { OperationsProgressButton } from ".";
import type { Operation } from "./OperationsProgressButton.types";

const meta = {
  title: "UI/Feedback/OperationsProgressButton",
  component: OperationsProgressButton,
  parameters: {
    docs: {
      description: {
        component: `Floating progress button that displays the status of ongoing file operations (upload, copy, move, delete, etc.).

### Features

- **Operation Tracking**: Monitors multiple concurrent file operations
- **Progress Display**: Shows percentage completion for active operations
- **Multiple Operations**: Dropdown list when several operations run simultaneously
- **Alert State**: Visual indicator for errors during operations
- **Completed State**: Auto-hides after successful completion
- **Tooltip Labels**: Contextual tooltips showing operation details
- **Panel Integration**: Click to open detailed operation panels

### Usage

\`\`\`tsx
import OperationsProgressButton from "@docspace/ui-kit/components/operations-progress-button";

// Single upload operation
<OperationsProgressButton
  operations={[{
    operation: "upload",
    label: "Uploading files",
    alert: false,
    completed: false,
    percent: 45,
  }]}
/>

// Multiple operations
<OperationsProgressButton
  operations={[
    { operation: "upload", label: "Uploading", alert: false, completed: false, percent: 60 },
    { operation: "copy", label: "Copying", alert: false, completed: false, percent: 30 },
  ]}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    operationsAlert: {
      control: "boolean",
      description: "Indicates if any operation has an error/alert",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsCompleted: {
      control: "boolean",
      description: "Indicates if all operations have completed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mainButtonVisible: {
      control: "boolean",
      description: "Whether the main action button is visible alongside",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    needErrorChecking: {
      control: "boolean",
      description: "Enables error state checking for operations",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showCancelButton: {
      control: "boolean",
      description: "Shows a cancel button on hover for upload operations",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description: "Adjusts positioning when the info panel is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description: "Overall progress percentage",
    },
    clearOperationsData: {
      action: "clearOperationsData",
      description: "Callback to clear operations data after completion",
    },
    clearPanelOperationsData: {
      action: "clearPanelOperationsData",
      description: "Callback to clear panel operations data",
    },
    onOpenPanel: {
      action: "onOpenPanel",
      description: "Callback when the operation panel is opened",
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "120px",
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OperationsProgressButton>;

type Story = StoryObj<ComponentProps<typeof OperationsProgressButton>>;

export default meta;

const singleUploadOperation: Operation[] = [
  {
    id: "op-1",
    operation: "upload",
    label: "Uploading files",
    alert: false,
    completed: false,
    percent: 45,
  },
];

export const CssCustomization: Story = {
  render: () => (
    // CSS vars grouped by the internal part they target:
    //
    // Group 1 — OperationsProgressButton › dropdown list area
    //   --ops-progress-dropdown-bg       dropdown background
    //   --ops-progress-dropdown-hover    item hover background
    //   --ops-progress-list-padding      each row padding
    //
    // Group 2 — OperationsProgressButton › progress-list icon SVGs
    //   --ops-progress-icon-color        default icon fill
    //   --ops-progress-icon-hover        icon fill on hover
    //   --ops-progress-success-icon      success-state badge
    //   --ops-progress-error-icon        error-state badge
    //
    // Group 3 — FloatingButton (inner sub-component)
    //   --floating-circle-button-background  circle fill
    //   --floating-button-icon               circle icon fill
    //   --floating-button-button-size        circle diameter
    //   --floating-button-shadow             circle box-shadow
    <div
      style={
        {
          "--ops-progress-dropdown-bg": "#e6f3fb",
          "--ops-progress-dropdown-hover": "#cce5f6",
          "--ops-progress-list-padding": "0px 12px",
          "--ops-progress-icon-color": "#0082c9",
          "--ops-progress-icon-hover": "#006ba6",
          "--ops-progress-success-icon": "#0082c9",
          "--ops-progress-error-icon": "#f03032",
          "--floating-circle-button-background": "#0082c9",
          "--floating-button-icon": "#ffffff",
          "--floating-button-shadow": "0 4px 16px rgba(0, 130, 201, 0.4)",
        } as CSSProperties
      }
    >
      <OperationsProgressButton
        operations={[
          {
            id: "op-1",
            operation: "upload",
            label: "Uploading files",
            alert: false,
            completed: false,
            percent: 65,
          },
          {
            id: "op-2",
            operation: "copy",
            label: "Copying documents",
            alert: false,
            completed: false,
            percent: 30,
          },
        ]}
        operationsAlert={false}
        operationsCompleted={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**OperationsProgressButton — dropdown list area**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--ops-progress-dropdown-bg\` | Dropdown background | theme-based |
| \`--ops-progress-dropdown-hover\` | Item hover background | theme-based |
| \`--ops-progress-list-padding\` | Row padding | \`0px 8px\` |
| \`--ops-progress-dropdown-margin\` | Bottom margin | \`8px\` |

**OperationsProgressButton — progress list icon SVGs**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--ops-progress-icon-color\` | Icon fill | \`#fff\` |
| \`--ops-progress-icon-hover\` | Icon hover fill | theme-based |
| \`--ops-progress-success-icon\` | Success badge color | theme-based |
| \`--ops-progress-error-icon\` | Error badge color | theme-based |
| \`--ops-progress-items-gap\` | Container item gap | \`8px\` |
| \`--ops-progress-label-gap\` | Label items gap | \`8px\` |
| \`--ops-progress-bar-padding\` | Bar wrapper padding | \`8px 16px\` |
| \`--ops-progress-header-margin\` | Header right margin | \`8px\` |
| \`--ops-progress-wrapper-margin\` | Progress wrapper margin | \`4px\` |

**FloatingButton (inner sub-component)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--floating-circle-button-background\` | Circle fill | accent color |
| \`--floating-button-icon\` | Circle icon fill | accent text color |
| \`--floating-button-shadow\` | Circle box-shadow | theme-based |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <OperationsProgressButton {...args} />,
  args: {
    operations: singleUploadOperation,
    operationsAlert: false,
    operationsCompleted: false,
  },
};

const UploadInProgressTemplate = () => {
  return (
    <OperationsProgressButton
      operations={[
        {
          id: "op-1",
          operation: "upload",
          label: "Uploading files",
          alert: false,
          completed: false,
          percent: 65,
        },
      ]}
      operationsAlert={false}
      operationsCompleted={false}
      showCancelButton
    />
  );
};

export const UploadInProgress: Story = {
  render: () => <UploadInProgressTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows an upload operation in progress at 65%. Hover to see the cancel button.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 65 }]}
  showCancelButton
/>`,
      },
    },
  },
};

const WithAlertTemplate = () => {
  return (
    <OperationsProgressButton
      operations={[
        {
          id: "op-1",
          operation: "upload",
          label: "Uploading files",
          alert: true,
          completed: false,
          percent: 40,
          errorCount: 3,
        },
      ]}
      operationsAlert
      operationsCompleted={false}
      needErrorChecking
    />
  );
};

export const WithAlert: Story = {
  render: () => <WithAlertTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows an operation with an error alert. The button displays an alert indicator and the tooltip shows error details.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: true, completed: false, percent: 40, errorCount: 3 }]}
  operationsAlert
  needErrorChecking
/>`,
      },
    },
  },
};

const CompletedOperationTemplate = () => {
  return (
    <OperationsProgressButton
      operations={[
        {
          id: "op-1",
          operation: "copy",
          label: "Copying files",
          alert: false,
          completed: true,
          percent: 100,
        },
      ]}
      operationsAlert={false}
      operationsCompleted
    />
  );
};

export const CompletedOperation: Story = {
  render: () => <CompletedOperationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows a completed operation. The button auto-hides after a brief display of the completion state.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "copy", label: "Copying files", alert: false, completed: true, percent: 100 }]}
  operationsCompleted
/>`,
      },
    },
  },
};

const MultipleOperationsTemplate = () => {
  return (
    <OperationsProgressButton
      operations={[
        {
          id: "op-1",
          operation: "upload",
          label: "Uploading files",
          alert: false,
          completed: false,
          percent: 60,
        },
        {
          id: "op-2",
          operation: "copy",
          label: "Copying documents",
          alert: false,
          completed: false,
          percent: 30,
        },
      ]}
      panelOperations={[
        {
          id: "op-3",
          operation: "move",
          label: "Moving folder",
          alert: false,
          completed: false,
          percent: 80,
          showPanel: () => console.log("Open move panel"),
        },
      ]}
      operationsAlert={false}
      operationsCompleted={false}
    />
  );
};

export const MultipleOperations: Story = {
  render: () => <MultipleOperationsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Multiple concurrent operations. Click the button to open a dropdown listing all active operations with their individual progress.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[
    { operation: "upload", label: "Uploading files", percent: 60, ... },
    { operation: "copy", label: "Copying documents", percent: 30, ... },
  ]}
  panelOperations={[
    { operation: "move", label: "Moving folder", percent: 80, ... },
  ]}
/>`,
      },
    },
  },
};
