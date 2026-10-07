import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

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
        "Message of the bar, drawn under the header. Not shown when `htmlContent` is set",
    },
    headerText: {
      control: "text",
      description:
        "Bold line above the message. Without it the header line is hidden",
    },
    additionalHeaderText: {
      control: "text",
      description: "Smaller line drawn next to the header",
    },
    btnText: {
      control: "text",
      description:
        "Label of the action, drawn as underlined text after the message. Setting it removes the close cross",
    },
    showIcon: {
      control: "boolean",
      description: "Whether the warning icon is drawn before the header",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countDownTime: {
      control: "number",
      description:
        "Milliseconds until the countdown after the message reaches zero and calls `onAction`. `-1` shows no countdown; `0` calls `onAction` as soon as the bar mounts",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        "Opacity of the whole bar. Without it the bar is fully transparent",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    backgroundImg: {
      control: "text",
      description:
        "CSS `background-image` value of the bar, a whole value such as `url(/banner.png)` rather than a bare path",
    },
    isMaintenance: {
      control: false,
      description: "Ignored: the bar looks the same with or without it",
    },
    fontSize: {
      control: "text",
      description:
        "Font size of the countdown, as a CSS length. The header and message keep their own size",
    },
    fontWeight: {
      control: "number",
      description:
        "Font weight of the countdown. The header and message keep their own weight",
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
      description: "Text alignment of the header and the message",
    },
    htmlContent: {
      control: "text",
      description:
        "HTML drawn in place of the header and message, sanitized with xss, which drops `style` attributes. With `isCampaigns` it is the URL of the page loaded into the iframe",
    },
    isCampaigns: {
      control: "boolean",
      description:
        "Whether the bar is a campaign banner: `htmlContent` is loaded as a page into an iframe, and the only thing drawn over it is a close cross",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    sectionWidth: {
      control: "number",
      description:
        "Minimum width of the HTML content on a tablet, in pixels. Has no effect without `htmlContent`",
    },
    skipBlur: {
      control: "boolean",
      description:
        "Whether a click inside an iframe on the page is left alone. Without it such a click calls `onAction` half a second later",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    style: {
      control: "object",
      description:
        "Inline style of the bar, applied after `opacity` and `backgroundImg`, so it can override both",
    },
    onAction: {
      action: "onAction",
      description:
        "Called when the action label or the close cross is clicked, when the countdown reaches zero, and after a click inside an iframe",
    },
    onClose: {
      control: false,
      description: "Ignored: the close cross calls `onAction`",
    },
    onLoad: {
      action: "onLoad",
      description: "Called once the bar is mounted",
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

    // The close cross is the only button; it calls onAction. It has no
    // accessible name, so it is found by role alone.
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bar as most pages show it: a warning icon, a header and a message, with a close cross at the end that calls `onAction`. Change any other prop live in the Controls panel below.",
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
  render: (args) => <SnackBarWrapper {...args} />,
  args: { ...baseArgs, btnText: "Take Action" },
  play: async ({ args, canvas, userEvent }) => {
    // The action label replaces the close cross.
    await expect(canvas.queryByRole("button")).toBeNull();
    await userEvent.click(canvas.getByText("Take Action"));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the notice asks for one step, the bar offers it in place of the close cross: the underlined **Take Action** label after the message calls `onAction` (`btnText`).",
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
          "For a notice that should not outstay its moment: the countdown after the message ticks down from 00:05 and calls `onAction` at zero, where the host removes the bar (`countDownTime`). Here nothing removes it, so only the timer disappears.",
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
          "When the notice needs bold text or a link, pass it as HTML: it replaces the header and the message, and the markup is sanitized first, which also drops any `style` attribute (`htmlContent`).",
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
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A scheduled-maintenance notice is an ordinary bar with its own header and message; there is no separate maintenance look, and `isMaintenance` changes nothing.",
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
      canvas.getByRole("button").getBoundingClientRect().left,
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
          "The same bar under a right-to-left interface: the accent stripe moves to the right edge, the icon and header start from the right, and the close cross moves to the left end. The wrapper sets the direction to right-to-left, and the bar's logical properties follow it.",
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
  render: () => (
    <div
      style={
        {
          width: "400px",
          "--snackbar-background": "#eef2ff",
          "--snackbar-text-color": "#b91c1c",
          "--snackbar-accent-color": "#4f46e5",
          "--snackbar-accent-width": "6px",
          "--snackbar-text-size": "13px",
          "--snackbar-content-padding": "16px 24px",
          "--snackbar-icon-fill": "#4f46e5",
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
    "--snackbar-background": "#eef2ff",
    "--snackbar-text-color": "#b91c1c",
    "--snackbar-accent-color": "#4f46e5",
    "--snackbar-accent-width": "6px",
    "--snackbar-text-size": "13px",
    "--snackbar-content-padding": "16px 24px",
    "--snackbar-icon-fill": "#4f46e5",
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
