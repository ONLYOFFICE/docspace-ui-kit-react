import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";

import { Toast, ToastType, toastr } from ".";
import { Button, ButtonSize } from "../button";
import { Link, LinkType } from "../link";
import { Text } from "../text";

const meta = {
  title: "UI/Feedback/Toast",
  component: Toast,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=648%3A4421&mode=dev",
    },
  },
  // Toasts live in one shared container and outlive the story that opened
  // them; start every story with none on screen.
  beforeEach: () => {
    toastr.clear();
  },
  argTypes: {
    className: {
      control: "text",
      description: "Applied to the container the toasts are stacked in.",
    },
    style: {
      control: "object",
      description: "Applied to that container as inline style.",
    },
    isSSR: {
      control: "boolean",
      description:
        "Whether the container renders nothing until the first client-side effect, for a server-rendered tree.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<ToastTemplateProps>;

// The story's own controls: the container's props, and the arguments of the
// `toastr` call its button makes.
type Story = StoryObj<ToastTemplateProps>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Opens the story's toast and returns its content element.
const openToast = async (
  { canvas, userEvent }: PlayContext,
  message: string,
  button = "Show Toast",
) => {
  await userEvent.click(canvas.getByRole("button", { name: button }));
  const text = await screen.findByText(message);
  return text.closest("[data-testid='toast-content']") as HTMLElement;
};

// Plays for the four single-type stories: the toast opens with its type
// and title, and a click on it closes it.
const playType =
  (type: ToastType, message: string, title: string) =>
  async (context: PlayContext) => {
    const toast = await openToast(context, message);
    await expect(toast).toHaveAttribute("data-type", type);
    await expect(toast).toHaveTextContent(title);

    // Without withCross the close button is there for the keyboard only:
    // named, but visually hidden until it is focused.
    const card = toast.closest(".Toastify__toast") as HTMLElement;
    const close = within(card).getByRole("button", { name: "Close" });
    await expect(close.getBoundingClientRect().width).toBeLessThanOrEqual(1);

    await context.userEvent.click(toast);
    await waitFor(() => expect(screen.queryByText(message)).toBeNull());
  };

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
  // No title given, so the type's translated default is shown.
  play: playType(ToastType.success, "Your changes were saved", "Done"),
  parameters: {
    docs: {
      description: {
        story:
          "The call most screens make: a short message after an action, with the title left to the type. **Show Toast** opens it.",
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
  play: playType(
    ToastType.success,
    "Operation completed successfully",
    "Success",
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A success toast: an action the user started has finished, such as a save or a move. **Show Toast** opens it.",
      },
      source: {
        code: `toastr.success("Operation completed successfully", "Success", 5000);`,
      },
    },
  },
};

export const ErrorToast: Story = {
  name: "Error",
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
  play: playType(
    ToastType.error,
    "An error occurred while processing your request",
    "Error",
  ),
  parameters: {
    docs: {
      description: {
        story:
          "An error toast: an action failed. **Show Toast** opens it. In code, pass the caught error itself, and the message is read from it.",
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
  play: playType(
    ToastType.warning,
    "Please review the changes before proceeding",
    "Warning",
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A warning toast: something to look at before going on, without a failure. **Show Toast** opens it.",
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
  play: playType(ToastType.info, "New updates are available", "Information"),
  parameters: {
    docs: {
      description: {
        story:
          "An info toast: something neutral, such as a finished background task. **Show Toast** opens it.",
      },
      source: {
        code: `toastr.info("New updates are available", "Information", 5000);`,
      },
    },
  },
};

export const WithCloseButton: Story = {
  name: "With a cross",
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
  play: async (context) => {
    const message = "Click the close button to dismiss";
    const toast = await openToast(context, message);

    // With the cross, a click on the toast itself no longer closes it.
    await context.userEvent.click(toast);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(screen.getByText(message)).toBeVisible();

    // The cross is a named button, closed here from the keyboard.
    const cross = within(
      toast.closest(".Toastify__toast") as HTMLElement,
    ).getByRole("button", { name: "Close" });
    await expect(cross).toBeVisible();
    cross.focus();
    await context.userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByText(message)).toBeNull());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A toast that stays until its cross is used (`timeout` 0, `withCross`), for a message the user must read. A click on the toast itself does not close it.",
      },
      source: {
        code: `toastr.success("Click the close button to dismiss", "Dismissible Toast", 0, true);`,
      },
    },
  },
};

export const KeyboardDismiss: Story = {
  name: "Closed from the keyboard",
  render: () => (
    <TriggerTemplate
      label="Show Toast"
      onClick={() => toastr.info("Closes from the keyboard too", "Info", 0)}
    />
  ),
  play: async (context) => {
    const message = "Closes from the keyboard too";
    const toast = await openToast(context, message);
    const close = within(
      toast.closest(".Toastify__toast") as HTMLElement,
    ).getByRole("button", { name: "Close" });

    // Hidden from sight until it has keyboard focus, then drawn as the cross.
    await expect(close.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await context.userEvent.tab();
    await expect(close).toHaveFocus();
    await expect(close.getBoundingClientRect().width).toBeGreaterThan(1);

    await context.userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByText(message)).toBeNull());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A toast with no cross and no timeout (`timeout` 0) still closes from the keyboard. Tab reaches its close button, shown as the cross while focused, and Enter closes it.",
      },
      source: {
        code: `toastr.info("Closes from the keyboard too", "Info", 0);`,
      },
    },
  },
};

export const AllTypes: Story = {
  name: "All types",
  render: () => <AllTypesTemplate />,
  play: async (context) => {
    await openToast(context, "Info message", "Show All Toast Types");
    // Newest on top: info first, success last.
    const types = screen
      .getAllByTestId("toast-content")
      .map((toast) => toast.dataset.type);
    await expect(types).toEqual([
      ToastType.info,
      ToastType.warning,
      ToastType.error,
      ToastType.success,
    ]);
  },
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
  name: "Custom content",
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
  play: async (context) => {
    // Any React node is rendered as it is, under the title.
    const toast = await openToast(context, "Report.docx was moved to Archive.");
    await expect(toast).toHaveTextContent("File moved");
    await expect(toast).toHaveTextContent("Open folder");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A message with more than a line of text, such as a link to what the action produced. Any React node passed first is rendered as it is, under the title.",
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
  name: "Default titles",
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
  play: async (context) => {
    const info = await openToast(context, "No title at all", "Show Toasts");
    // null leaves the title out altogether.
    await expect(info.querySelector(".toast-title")).toBeNull();

    // undefined fills in the type's translated default.
    const success = screen
      .getByText("The title is filled in for the type")
      .closest("[data-testid='toast-content']") as HTMLElement;
    await expect(success.querySelector(".toast-title")).toHaveTextContent(
      "Done",
    );
  },
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
  name: "Right to left",
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
  play: async (context) => {
    // The toast reads right to left: the cross moves to the left end.
    const toast = await openToast(context, "The file was saved");
    const card = toast.closest(".Toastify__toast") as HTMLElement;
    await expect(getComputedStyle(card).direction).toBe("rtl");
    const cross = card.querySelector(".closeButton") as HTMLElement;
    await expect(cross.getBoundingClientRect().left).toBeLessThan(
      screen.getByText("The file was saved").getBoundingClientRect().left,
    );
  },
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
          "Toasts in a right-to-left layout open in the top-left corner and slide in from the left. The icon sits right of the text, the cross on the left. The direction comes from the theme; a `dir` on your wrapper does not reach them.",
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
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async (context) => {
    const toast = await openToast(
      context,
      "Custom success notification",
      "Show Custom Toasts",
    );
    const card = toast.closest(".Toastify__toast") as HTMLElement;
    await expect(card).toHaveStyle({ borderRadius: "12px", padding: "16px" });
    const container = card.closest(".Toastify__toast-container") as HTMLElement;
    await expect(Math.round(container.getBoundingClientRect().width)).toBe(360);
    await expect(
      Math.round(window.innerWidth - container.getBoundingClientRect().right),
    ).toBe(32);
  },
  parameters: {
    docs: {
      description: {
        story: `Rounder corners, wider padding and a wider container further from the edge. The variables go on \`Toast\`'s \`style\`, since the toasts are portalled outside any wrapper. All but \`--toast-text-size\` are set.`,
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
