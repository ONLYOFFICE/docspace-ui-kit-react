import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast, ToastType, toastr } from ".";
import { Button, ButtonSize } from "../button";
import { Link, LinkType } from "../link";
import { Text } from "../text";

const meta = {
  title: "UI/Feedback/Toast",
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: `Toast notification component for displaying temporary messages with different severity levels.

### Features

- **Four Types**: Shows success, error, warning and info toasts, each on its own background colour, with a check, danger or info icon; error and warning share the danger icon
- **Auto-Dismiss**: Closes each toast after the given number of milliseconds, 5000 by default; a value under 750 falls back to 5000
- **Persistent Mode**: Keeps a toast open until it is closed by hand when its timeout is 0
- **Close Button**: Adds a cross that closes the toast when \`withCross\` is passed to \`toastr\`; without it a click anywhere on the toast closes it
- **Custom Content**: Renders any React node as the message, such as a line of text followed by a link
- **Stacking**: Lists toasts in the top corner on the inline-end side, newest first; at tablet and phone widths they overlap as a deck, each 8px below the one in front
- **Imperative API**: Opens toasts from anywhere through \`toastr.success\`, \`error\`, \`warning\` and \`info\`, and closes them with \`toastr.clear\`
- **Default Titles**: Fills an omitted title with a translated word for the type (Done, Warning, Alert, Info) and shows no title when \`null\` is passed

### Accessibility

Each toast is rendered by react-toastify, which marks it for assistive technology:

- \`role="alert"\` on the body of every toast, so a screen reader announces its title and message as soon as it appears
- The close cross is a \`<div>\` outside the tab order with no accessible name, so a toast shown with a \`timeout\` of 0 cannot be closed from the keyboard

### Usage

\`\`\`tsx
import { Toast, toastr } from "@onlyoffice/apps-ui-kit/components/toast";

// Mount the Toast container once
<Toast />

// Trigger toasts imperatively
toastr.success("Operation completed", "Success", 5000);
toastr.error("Something went wrong", "Error", 5000);
toastr.warning("Please review changes", "Warning", 5000);
toastr.info("New updates available", "Info", 5000);

// Persistent toast with close button
toastr.success("Saved", "Success", 0, true);

// A failed request: the message is read from the error object
toastr.error(error);

// Close every open toast
toastr.clear();
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
      description:
        "Which `toastr` method the story calls, and so the colour and icon of the toast: `success`, `error`, `warning` or `info`. The `Toast` container itself ignores this prop",
    },
    title: {
      control: "text",
      description:
        "Bold first line of the toast, the second argument of `toastr`. Left out, a translated default for the type is shown; `null` shows no title",
    },
    data: {
      control: "text",
      description:
        "Message under the title, the first argument of `toastr`: a string or any React node",
    },
    withCross: {
      control: "boolean",
      description:
        "Fourth argument of `toastr`: shows a cross that closes the toast, and stops a click on the toast from closing it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    timeout: {
      control: "number",
      description:
        "Third argument of `toastr`: milliseconds before the toast closes, or 0 to keep it open until it is closed by hand. A value under 750 falls back to 5000",
      table: {
        defaultValue: { summary: "5000" },
      },
    },
    id: {
      control: "text",
      description:
        "Ignored: nothing reads it, and the container carries no `id`",
    },
    className: {
      control: "text",
      description: "Class added to the container the toasts are stacked in",
    },
    style: {
      control: "object",
      description:
        "Inline style of the container the toasts are stacked in; the place to set the CSS variables, since the container is not rendered inside your markup",
    },
    isSSR: {
      control: "boolean",
      description:
        "Renders nothing until the page has mounted in the browser, so a server-rendered tree and its first client render match",
      table: {
        defaultValue: { summary: "false" },
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
  className?: string;
  style?: CSSProperties;
  isSSR?: boolean;
}

const ToastTemplate = ({
  type = ToastType.success,
  data = "Toast message",
  title,
  timeout = 5000,
  withCross = false,
  className,
  style,
  isSSR,
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
      <Toast className={className} style={style} isSSR={isSSR} />
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

export const Default: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.success}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
    />
  ),
  args: {
    data: "Your changes were saved",
    timeout: 5000,
    type: ToastType.success,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The call most screens make: a short message after an action, with the title left to the type. Click **Show Toast** to open it, and pick another type or change the message, title or timeout live in the Controls panel below.",
      },
      source: {
        code: `toastr.success("Your changes were saved");`,
      },
    },
  },
};

export const Success: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.success}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
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
          "Confirms that an action the user started has finished, such as a save or a move. Click **Show Toast** to open it, and change the message, title or timeout live in the Controls panel below.",
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
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
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
          "Tells the user that an action failed. Click **Show Toast** to open it; in code, pass the caught error itself and the message is read from it.",
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
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
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
          "Asks the user to look at something before going on, without reporting a failure. Click **Show Toast** to open it.",
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
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
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
          "Reports something neutral the user may want to know, such as a finished background task. Click **Show Toast** to open it.",
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
      className={args.className}
      style={args.style}
      isSSR={args.isSSR}
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
          "For a message the user must read before it goes: the toast stays until its cross is clicked (`timeout` 0, `withCross`), and a click on the toast itself no longer closes it.",
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
          "Compares the four types side by side: **Info** on top, as the newest, then **Warning**, **Error** and **Success**, each on its own background. All four stay open until closed with their cross.",
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

const TriggerTemplate = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <>
    <Toast />
    <Button label={label} primary size={ButtonSize.small} onClick={onClick} />
  </>
);

export const CustomContent: Story = {
  render: () => (
    <TriggerTemplate
      label="Show Toast"
      onClick={() =>
        toastr.success(
          <>
            <Text fontSize="12px">Report.docx was moved to Archive.</Text>
            <Link type={LinkType.action} fontSize="12px" isBold>
              Open folder
            </Link>
          </>,
          "File moved",
          0,
          true,
        )
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A message that needs more than a line of text, such as a link to what the action produced: any React node passed as the first argument is rendered as it is, under the title.",
      },
      source: {
        code: `toastr.success(
  <>
    <Text fontSize="12px">Report.docx was moved to Archive.</Text>
    <Link type={LinkType.action} fontSize="12px" isBold>
      Open folder
    </Link>
  </>,
  "File moved",
  0,
  true,
);`,
      },
    },
  },
};

export const DefaultTitles: Story = {
  render: () => (
    <TriggerTemplate
      label="Show Toasts"
      onClick={() => {
        toastr.success(
          "The title is filled in for the type",
          undefined,
          0,
          true,
        );
        toastr.info("No title at all", null, 0, true);
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Most calls need no title of their own. **No title at all** — the info toast, given `null` as its title, shows the message alone. **Done** — the success toast below it left the title out, so the translated word for its type is shown.",
      },
      source: {
        code: `toastr.success("The title is filled in for the type", undefined, 0, true);
toastr.info("No title at all", null, 0, true);`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <ToastTemplate
      type={args.type ?? ToastType.success}
      data={typeof args.data === "string" ? args.data : "Toast message"}
      title={args.title}
      timeout={args.timeout}
      withCross={args.withCross}
    />
  ),
  globals: { direction: "rtl" },
  args: {
    data: "The file was saved",
    title: "Saved",
    withCross: true,
    timeout: 0,
    type: ToastType.success,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "112px" },
      description: {
        story:
          "Toasts in a right-to-left layout: they open in the top-left corner and slide in from the left, the icon moves to the right of the text and the cross to the left. The toasts are portalled outside the story, so the direction comes from the document, set here by the Direction toolbar, and a `dir` on a wrapper of yours would not reach them.",
      },
      source: {
        code: `// The page runs right to left, e.g. <ThemeProvider locale="ar">
toastr.success("The file was saved", "Saved", 0, true);`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const showToasts = () => {
    toastr.success("Custom success notification", "Styled Toast", 0, true);
  };

  return (
    <>
      <Toast
        style={
          {
            "--toast-radius": "12px",
            "--toast-padding": "16px",
            "--toast-width": "360px",
            "--toast-inset-end": "32px",
          } as CSSProperties
        }
      />
      <Button
        label="Show Custom Toasts"
        primary
        size={ButtonSize.small}
        onClick={showToasts}
      />
    </>
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
| \`--toast-text-size\` | Font size of custom content that sets none of its own; the title and a string message stay at 12px | \`12px\` |
| \`--toast-width\` | Container width, above phone width | \`320px\` |
| \`--toast-inset-end\` | Offset from the inline-end edge of the window, above tablet width | \`24px\` |

The toasts are portalled to the end of the page, outside any wrapper of yours, so the variables are set through the \`style\` prop of \`Toast\`. The example sets every row a string toast can show, all but \`--toast-text-size\`: open a toast to see the rounder corners, the wider padding and the wider container further from the edge.`,
      },
      source: {
        code: `<Toast
  style={{
    "--toast-radius": "12px",
    "--toast-padding": "16px",
    "--toast-width": "360px",
    "--toast-inset-end": "32px",
  }}
/>`,
      },
    },
  },
};
