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
