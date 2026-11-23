import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import { SnackBar } from "./Snackbar";
import type { SnackbarProps, TextAlignValue } from "./Snackbar.types";

const meta = {
  title: "UI/Feedback/SnackBar",
  component: SnackBar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    text: {
      control: "text",
      description:
        "Message of the bar, rendered under the header. Ignored when `htmlContent` is set.",
    },
    headerText: {
      control: "text",
      description:
        "Bold line above the message. Without it the heading element is still rendered, hidden with `display: none`.",
    },
    additionalHeaderText: {
      control: "text",
      description: "Smaller line drawn next to the header.",
    },
    btnText: {
      control: "text",
      description:
        "Label of the inline action, a `<button>` drawn as underlined text after the message. Setting it removes the close cross.",
    },
    showIcon: {
      control: "boolean",
      description: "Whether the warning icon is drawn before the header.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countDownTime: {
      control: "number",
      description:
        "Milliseconds until the countdown fires `onAction`. Pass `-1` for no countdown at all: `0` fires it on the first frame.",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        "Opacity of the bar. Without it the bar renders fully transparent — the stylesheet falls back to `0`.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    backgroundImg: {
      control: "text",
      description:
        "CSS `background-image` value of the bar — a whole shorthand such as `url(/banner.png)`, not a bare path.",
    },
    fontSize: {
      control: "text",
      description:
        "Font size of the countdown, as a CSS length. It does not reach the message, whose size is fixed by `--snackbar-text-size`.",
    },
    fontWeight: {
      control: "number",
      description:
        "Font weight of the countdown. It does not reach the message either.",
    },
    textAlign: {
      control: "select",
      options: [
        "start",
        "end",
        "left",
        "right",
        "center",
        "justify",
        "match-parent",
      ],
      description: "Text alignment of the header and the message.",
    },
    htmlContent: {
      control: "text",
      description:
        "HTML injected instead of `text`, sanitized with `xss`. Under `isCampaigns` it is read as the `src` of an iframe instead.",
    },
    isCampaigns: {
      control: "boolean",
      description:
        "Whether the bar is a campaign banner: `htmlContent` becomes an iframe URL and the only thing drawn over it is a close cross.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    sectionWidth: {
      control: "number",
      description:
        "Minimum width of the iframe on a tablet or wider, in pixels. It does nothing without `htmlContent`.",
    },
    skipBlur: {
      control: "boolean",
      description:
        "Whether the window `blur` listener is skipped. It is on by default and turns a click inside an iframe into an `onAction` half a second later.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    style: {
      control: "object",
      description:
        "Applied to the outermost element as inline style. It is merged after the opacity and background variables, so it can override them.",
    },
    onAction: {
      action: "onAction",
      description:
        "Called by the action text, by the close cross, when the countdown reaches zero and when a click lands in an iframe. The event is only passed on a real click.",
    },
    onLoad: {
      action: "onLoad",
      description:
        "Called once the bar is mounted. Under `isCampaigns` the iframe's own load is what reveals the cross.",
    },
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
  countDownTime: -1,
  sectionWidth: 500,
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
  play: async ({ args, canvas, userEvent }) => {
    await expect(args.onLoad).toHaveBeenCalledTimes(1);
    await expect(canvas.getByTestId("snackbar-header")).toHaveTextContent(
      "Attention",
    );
    await expect(canvas.getByTestId("snackbar-message")).toHaveTextContent(
      "Important notification message",
    );
    await expect(canvas.getByTestId("snackbar-icon")).toBeInTheDocument();

    // The bar is a polite live region, so its appearance is announced.
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(
        "Important notification message",
      ),
    );

    // The close cross is a named, non-submitting button that calls onAction,
    // from the keyboard as well as the mouse.
    const close = canvas.getByRole("button", { name: "Close" });
    await expect(close).toHaveAttribute("type", "button");
    await userEvent.click(close);
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    close.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onAction).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bar as most pages show it: a warning icon, a header and a message, with a close cross at the end that calls `onAction`.",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleClose}
/>`,
      },
    },
  },
};

export const WithAction: Story = {
  name: "With an action",
  render: (args) => <SnackBarWrapper {...args} />,
  args: { ...baseArgs, btnText: "Take Action" },
  play: async ({ args, canvas, userEvent }) => {
    // The action label replaces the close cross.
    await expect(canvas.queryByRole("button", { name: "Close" })).toBeNull();
    // The action is a real button: it is clicked, and reached with Tab and
    // pressed with Space.
    const action = canvas.getByRole("button", { name: "Take Action" });
    await userEvent.click(action);
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    action.blur();
    await userEvent.tab();
    await expect(action).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(args.onAction).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An underlined **Take Action** button in place of the close cross, for a notice that asks for one step (`btnText`). It calls `onAction`.",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  text="Important notification"
  btnText="Take Action"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleAction}
/>`,
      },
    },
  },
};

export const WithCountdown: Story = {
  name: "With a countdown",
  render: (args) => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    countDownTime: 5000,
    text: "This message will disappear in 5 seconds",
  },
  play: async ({ args, canvas }) => {
    // The timer starts at 00:05; waiting for zero would cost five seconds.
    await expect(canvas.getByText(/^00:0[45]$/)).toBeVisible();
    await expect(args.onAction).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A countdown after the message, from 00:05 down to zero, where it calls `onAction` (`countDownTime`). Here nothing removes the bar, so only the timer disappears.",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  text="This message will disappear in 5 seconds"
  showIcon
  opacity={1}
  countDownTime={5000}
  sectionWidth={500}
  onAction={handleDismiss}
/>`,
      },
    },
  },
};

export const WithHtmlContent: Story = {
  name: "HTML content",
  render: (args) => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    htmlContent:
      "<p>Your storage is <b>almost full</b>. Please free up space or <a href='#'>upgrade your plan</a> to continue working without interruptions.</p>",
    text: "",
  },
  play: async ({ canvas }) => {
    // The HTML replaces the header and the message.
    const html = canvas.getByTestId("snackbar-html-content");
    await expect(html.querySelector("b")).toHaveTextContent("almost full");
    await expect(
      canvas.getByRole("link", { name: "upgrade your plan" }),
    ).toBeVisible();
    await expect(canvas.queryByTestId("snackbar-message")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Bold text and a link passed as HTML in place of the header and message (`htmlContent`). The markup is sanitized first, which also drops any `style` attribute.",
      },
      source: {
        code: `<SnackBar
  htmlContent="<p>Your storage is <b>almost full</b>. <a href='#'>Upgrade</a></p>"
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`,
      },
    },
  },
};

export const Maintenance: Story = {
  name: "Maintenance notice",
  render: (args) => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    headerText: "Maintenance Notice",
    text: "System maintenance is scheduled for tonight at 10 PM",
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId("snackbar-header")).toHaveTextContent(
      "Maintenance Notice",
    );
    await expect(canvas.getByTestId("snackbar-message")).toHaveTextContent(
      "System maintenance is scheduled for tonight at 10 PM",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A scheduled-maintenance notice is an ordinary bar with its own header and message; there is no separate maintenance look.",
      },
      source: {
        code: `<SnackBar
  headerText="Maintenance Notice"
  text="System maintenance is scheduled for tonight at 10 PM"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`,
      },
    },
  },
};

export const WithAdditionalHeaderText: Story = {
  name: "Extra header text",
  render: (args) => <SnackBarWrapper {...args} />,
  args: { ...baseArgs, additionalHeaderText: "Today, 10:00" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByTestId("snackbar-additional-info"),
    ).toHaveTextContent("Today, 10:00");
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the header needs a detail such as a time, the smaller **Today, 10:00** line sits right after it (`additionalHeaderText`).",
      },
      source: {
        code: `<SnackBar
  headerText="Attention"
  additionalHeaderText="Today, 10:00"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <SnackBarWrapper {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The text starts at the right; the cross sits at the left end.
    const header = canvas.getByTestId("snackbar-header");
    await expect(getComputedStyle(header).direction).toBe("rtl");
    await expect(
      canvas.getByRole("button", { name: "Close" }).getBoundingClientRect()
        .left,
    ).toBeLessThan(header.getBoundingClientRect().left);
  },
  args: {
    ...baseArgs,
    headerText: "\u062a\u0646\u0628\u064a\u0647",
    text: "\u0631\u0633\u0627\u0644\u0629 \u0625\u0634\u0639\u0627\u0631 \u0645\u0647\u0645\u0629",
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the direction of the whole Docs page
      story: { inline: false, height: "90px" },
      description: {
        story:
          "The same bar under a right-to-left interface. The accent stripe moves to the right edge, and the close cross to the left end. The wrapper sets the direction, and the bar's logical properties follow it.",
      },
      source: {
        code: `<div dir="rtl">
  <SnackBar
    headerText="..."
    text="..."
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={500}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          width: "400px",
          "--snackbar-background": "light-dark(#eef2ff, #1e2240)",
          "--snackbar-text-color": "light-dark(#b91c1c, #fca5a5)",
          "--snackbar-accent-color": "light-dark(#4f46e5, #a5b4fc)",
          "--snackbar-accent-width": "6px",
          "--snackbar-text-size": "13px",
          "--snackbar-content-padding": "16px 24px",
          "--snackbar-icon-fill": "light-dark(#4f46e5, #a5b4fc)",
        } as CSSProperties
      }
    >
      <SnackBar
        text="Custom styled notification with CSS variables"
        headerText="Custom Theme"
        showIcon
        opacity={1}
        countDownTime={-1}
        sectionWidth={400}
        onAction={fn()}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    // The message takes the custom text colour.
    await expect(
      getComputedStyle(canvas.getByTestId("snackbar-message")).color,
    ).toBe("rgb(185, 28, 28)");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The message takes the red text colour while the header keeps the heading colour.`,
      },
      source: {
        code: `<div
  style={{
    "--snackbar-background": "light-dark(#eef2ff, #1e2240)",
    "--snackbar-text-color": "light-dark(#b91c1c, #fca5a5)",
    "--snackbar-accent-color": "light-dark(#4f46e5, #a5b4fc)",
    "--snackbar-accent-width": "6px",
    "--snackbar-text-size": "13px",
    "--snackbar-content-padding": "16px 24px",
    "--snackbar-icon-fill": "light-dark(#4f46e5, #a5b4fc)",
  }}
>
  <SnackBar
    headerText="Custom Theme"
    text="Custom styled notification with CSS variables"
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={400}
  />
</div>`,
      },
    },
  },
};
