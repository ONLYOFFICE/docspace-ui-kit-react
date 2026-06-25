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

import { Toast, ToastType, toastr } from ".";
import { Button, ButtonSize } from "../button";

const meta = {
  title: "UI/Feedback/Toast",
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: `Toast notification component for displaying temporary messages with different severity levels.

### Features

- **Four Types**: Success, error, warning, and info with distinct colors and icons
- **Auto-Dismiss**: Configurable timeout for automatic dismissal
- **Persistent Mode**: Set timeout to 0 for toasts that stay until manually dismissed
- **Close Button**: Optional close button via \`withCross\` prop
- **Custom Content**: Support for React nodes including links and formatted text
- **Stacking**: Multiple toasts stack vertically
- **Imperative API**: Trigger toasts via \`toastr.success()\`, \`toastr.error()\`, etc.

### Usage

\`\`\`tsx
import { Toast, toastr } from "@docspace/ui-kit/components/toast";

// Mount the Toast container once
<Toast />

// Trigger toasts imperatively
toastr.success("Operation completed", "Success", 5000);
toastr.error("Something went wrong", "Error", 5000);
toastr.warning("Please review changes", "Warning", 5000);
toastr.info("New updates available", "Info", 5000);

// Persistent toast with close button
toastr.success("Saved", "Success", 0, true);
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=648%3A4421&mode=dev",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(ToastType),
      description: "Toast type: success, error, warning, or info",
    },
    title: {
      control: "text",
      description: "Title of the toast notification",
    },
    data: {
      control: "text",
      description: "Content to display inside the toast",
    },
    withCross: {
      control: "boolean",
      description:
        "Show close button. If false, toast dismisses on click anywhere",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    timeout: {
      control: "number",
      description:
        "Duration in milliseconds before auto-dismiss. Set to 0 for persistent",
      table: {
        defaultValue: { summary: "5000" },
      },
    },
  },
} satisfies Meta<typeof Toast>;

type Story = StoryObj<ComponentProps<typeof Toast>>;

export default meta;

interface ToastTemplateProps {
  type?: ToastType;
  data?: string;
  title?: string;
  timeout?: number;
  withCross?: boolean;
}

const ToastTemplate = ({
  type = ToastType.success,
  data = "Toast message",
  title,
  timeout = 5000,
  withCross = false,
}: ToastTemplateProps) => {
  const showToast = () => {
    switch (type) {
      case ToastType.error:
        toastr.error(data, title, timeout, withCross);
        break;
      case ToastType.warning:
        toastr.warning(data, title, timeout, withCross);
        break;
      case ToastType.info:
        toastr.info(data, title, timeout, withCross);
        break;
      default:
        toastr.success(data, title, timeout, withCross);
    }
  };

  return (
    <>
      <Toast />
      <Button
        label="Show Toast"
        primary
        size={ButtonSize.small}
        onClick={showToast}
      />
    </>
  );
};

const AllTypesTemplate = () => {
  const showAllToasts = () => {
    toastr.success("Success message", "Success", 0, true);
    toastr.error("Error message", "Error", 0, true);
    toastr.warning("Warning message", "Warning", 0, true);
    toastr.info("Info message", "Info", 0, true);
  };

  return (
    <>
      <Toast />
      <Button
        label="Show All Toast Types"
        primary
        size={ButtonSize.small}
        onClick={showAllToasts}
      />
    </>
  );
};

export const Success: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.success}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  args: {
    data: "Operation completed successfully",
    title: "Success",
    timeout: 5000,
    type: ToastType.success,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Success toast for confirming completed operations. Click the button to trigger.",
      },
      source: {
        code: `toastr.success("Operation completed successfully", "Success", 5000);`,
      },
    },
  },
};

export const ErrorToast: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.error}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  args: {
    data: "An error occurred while processing your request",
    title: "Error",
    timeout: 5000,
    type: ToastType.error,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error toast for displaying failure messages. Click the button to trigger.",
      },
      source: {
        code: `toastr.error("An error occurred while processing your request", "Error", 5000);`,
      },
    },
  },
};

export const Warning: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.warning}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  args: {
    data: "Please review the changes before proceeding",
    title: "Warning",
    timeout: 5000,
    type: ToastType.warning,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Warning toast for cautionary messages. Click the button to trigger.",
      },
      source: {
        code: `toastr.warning("Please review the changes before proceeding", "Warning", 5000);`,
      },
    },
  },
};

export const Info: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.info}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  args: {
    data: "New updates are available",
    title: "Information",
    timeout: 5000,
    type: ToastType.info,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Info toast for general informational messages. Click the button to trigger.",
      },
      source: {
        code: `toastr.info("New updates are available", "Information", 5000);`,
      },
    },
  },
};

export const WithCloseButton: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.success}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  args: {
    data: "Click the close button to dismiss",
    title: "Dismissible Toast",
    withCross: true,
    timeout: 0,
    type: ToastType.success,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Persistent toast with a close button. Set timeout to 0 and withCross to true for manual dismissal only.",
      },
      source: {
        code: `toastr.success("Click the close button to dismiss", "Dismissible Toast", 0, true);`,
      },
    },
  },
};

export const AllTypes: Story = {
  render: () => <AllTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Displays all four toast types simultaneously. Each toast is persistent with a close button.",
      },
      source: {
        code: `toastr.success("Success message", "Success", 0, true);
toastr.error("Error message", "Error", 0, true);
toastr.warning("Warning message", "Warning", 0, true);
toastr.info("Info message", "Info", 0, true);`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const showToasts = () => {
    toastr.success("Custom success notification", "Styled Toast", 0, true);
  };

  return (
    <div
      style={
        {
          "--toast-radius": "12px",
          "--toast-padding": "16px",
          "--toast-text-size": "13px",
          "--toast-width": "360px",
          "--toast-inset-end": "32px",
        } as CSSProperties
      }
    >
      <Toast />
      <Button
        label="Show Custom Toasts"
        primary
        size={ButtonSize.small}
        onClick={showToasts}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--toast-radius\` | Toast border radius | \`6px\` |
| \`--toast-padding\` | Toast inner padding | \`12px\` |
| \`--toast-text-size\` | Toast font size | \`12px\` |
| \`--toast-width\` | Container width | \`320px\` |
| \`--toast-inset-end\` | Offset from inline-end edge | \`24px\` |`,
      },
    },
  },
};

