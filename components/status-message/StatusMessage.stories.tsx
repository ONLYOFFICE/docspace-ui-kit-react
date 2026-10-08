import { useState } from "react";

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { Button, ButtonSize } from "../button";

import StatusMessage from ".";

const meta = {
  title: "UI/Feedback/StatusMessage",
  component: StatusMessage,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    message: {
      control: "text",
      description:
        "The text or nodes shown in the bar. An empty value fades the bar out and removes it; a new value appears once the previous one has faded out",
    },
    isWarning: {
      control: "boolean",
      description:
        "Paints the bar in the warning colours instead of the error ones. Takes effect together with the next change of `message`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof StatusMessage>;

type Story = StoryObj<ComponentProps<typeof StatusMessage>>;

export default meta;

// The bar around a message's text.
const barOf = (text: HTMLElement) =>
  text.closest("div[class*='body']") as HTMLElement;

export const Default: Story = {
  render: (args) => <StatusMessage {...args} />,
  args: {
    message: "This is a status message",
  },
  play: async ({ canvas }) => {
    const text = await canvas.findByText("This is a status message");
    await waitFor(() => expect(text).toBeVisible());
    await expect(barOf(text).className).not.toMatch(/warning/);
    // An error is an alert: it is announced as soon as it appears.
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "This is a status message",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The error bar as a form shows it after a failed action. Type a new text in the Controls panel below to watch the old one fade out first; the warning switch there repaints the bar at once (`isWarning`).",
      },
      source: {
        code: `<StatusMessage message="This is a status message" />`,
      },
    },
  },
};

const WarningTemplate = () => {
  return <StatusMessage message="This is a warning message" isWarning />;
};

const ToggleTemplate = () => {
  const [message, setMessage] = useState("Click the button to dismiss");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusMessage message={message} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          label="Show Message"
          size={ButtonSize.small}
          onClick={() => setMessage("Status message is visible")}
        />
        <Button
          label="Hide Message"
          size={ButtonSize.small}
          onClick={() => setMessage("")}
        />
      </div>
    </div>
  );
};

const MessageSwapTemplate = () => {
  const [message, setMessage] = useState("First message");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusMessage message={message} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          label="Message A"
          size={ButtonSize.small}
          onClick={() => setMessage("First message")}
        />
        <Button
          label="Message B"
          size={ButtonSize.small}
          onClick={() => setMessage("Second message")}
        />
        <Button
          label="Clear"
          size={ButtonSize.small}
          onClick={() => setMessage("")}
        />
      </div>
    </div>
  );
};

export const WarningMessage: Story = {
  render: () => <WarningTemplate />,
  play: async ({ canvas }) => {
    const text = await canvas.findByText("This is a warning message");
    await expect(barOf(text).className).toMatch(/warning/);
    // A warning is a polite status rather than an alert.
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "This is a warning message",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a problem that does not block the user: the same bar in the warning colours (`isWarning`).",
      },
      source: {
        code: `<StatusMessage message="This is a warning message" isWarning />`,
      },
    },
  },
};

export const ToggleVisibility: Story = {
  render: () => <ToggleTemplate />,
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText("Click the button to dismiss");

    // An empty message fades the bar out and removes it.
    await userEvent.click(canvas.getByRole("button", { name: "Hide Message" }));
    await waitFor(
      () =>
        expect(canvas.queryByText("Click the button to dismiss")).toBeNull(),
      { timeout: 3000 },
    );

    // A new one brings it back.
    await userEvent.click(canvas.getByRole("button", { name: "Show Message" }));
    await expect(
      await canvas.findByText(
        "Status message is visible",
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use this to see how the bar leaves and returns: **Hide Message** fades it out and removes it, **Show Message** brings it back (`message` set to an empty string and back).",
      },
      source: {
        code: `const [message, setMessage] = useState("Click the button to dismiss");

<StatusMessage message={message} />
<Button label="Show" onClick={() => setMessage("Visible")} />
<Button label="Hide" onClick={() => setMessage("")} />`,
      },
    },
  },
};

export const MessageSwap: Story = {
  render: () => <MessageSwapTemplate />,
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText("First message");

    // The old text fades out before the new one appears.
    await userEvent.click(canvas.getByRole("button", { name: "Message B" }));
    const second = await canvas.findByText(
      "Second message",
      {},
      { timeout: 3000 },
    );
    await expect(canvas.queryByText("First message")).toBeNull();
    await expect(barOf(second)).toBeInTheDocument();

    // Cleared straight away, before the new text has faded in: the bar is
    // still removed, even though no fade-out transition ever runs.
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await waitFor(
      () => expect(canvas.queryByText("Second message")).toBeNull(),
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use this to see what a user sees when one message replaces another: **Message A** and **Message B** fade the current text out before the new one fades in, **Clear** hides the bar.",
      },
      source: {
        code: `const [message, setMessage] = useState("First message");

<StatusMessage message={message} />
<Button label="Message A" onClick={() => setMessage("First message")} />
<Button label="Message B" onClick={() => setMessage("Second message")} />
<Button label="Clear" onClick={() => setMessage("")} />`,
      },
    },
  },
};

const QuickChangeTemplate = () => {
  const [message, setMessage] = useState("Saving failed");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusMessage message={message} />
      <Button
        label="New text, then clear"
        size={ButtonSize.small}
        onClick={() => {
          setMessage("Retrying");
          requestAnimationFrame(() => setMessage(""));
        }}
      />
    </div>
  );
};

export const QuickChange: Story = {
  render: () => <QuickChangeTemplate />,
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText("Saving failed");

    // A new text and an empty one in neighbouring frames: the browser never
    // starts the fade, so no transitionend fires, and the bar still goes.
    await userEvent.click(
      canvas.getByRole("button", { name: "New text, then clear" }),
    );
    await waitFor(
      () => {
        expect(canvas.queryByText("Saving failed")).toBeNull();
        expect(canvas.queryByText("Retrying")).toBeNull();
      },
      { timeout: 3000 },
    );
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Changes faster than the fade: **New text, then clear** sets a new message and an empty one in the next frame. The bar fades out and is removed rather than staying behind invisible.",
      },
      source: {
        code: `setMessage("Retrying");
requestAnimationFrame(() => setMessage(""));`,
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
          "--status-message-bg": "#1e1b4b",
          "--status-message-border": "2px solid #7c3aed",
          "--status-message-text": "#e0e7ff",
          "--status-message-icon": "#a78bfa",
          "--status-message-radius": "12px",
          "--status-message-padding": "12px 16px",
          "--status-message-gap": "16px",
          "--status-message-shadow": "0 4px 20px rgba(124,58,237,0.3)",
          "--status-message-margin-bottom": "24px",
          "--status-message-max-width": "360px",
          "--status-message-warning-bg": "#422006",
          "--status-message-warning-border-style": "2px solid #f59e0b",
          "--status-message-warning-icon": "#fbbf24",
        } as CSSProperties
      }
    >
      <StatusMessage message="Custom styled status message with CSS variables." />
      <StatusMessage message="Custom styled warning message." isWarning />
    </div>
  ),
  play: async ({ canvas }) => {
    const plain = barOf(
      await canvas.findByText(
        "Custom styled status message with CSS variables.",
      ),
    );
    await expect(getComputedStyle(plain).backgroundColor).toBe(
      "rgb(30, 27, 75)",
    );
    await expect(plain.getBoundingClientRect().width).toBeLessThanOrEqual(360);
    const warning = barOf(canvas.getByText("Custom styled warning message."));
    await expect(getComputedStyle(warning).backgroundColor).toBe(
      "rgb(66, 32, 6)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first bar shows the shared variables; the second, with \`isWarning\`, is there for the three warning variables, and the gap between the two is the bottom margin. The max width caps both bars below the 400px wrapper.`,
      },
      source: {
        code: `<div
  style={{
    "--status-message-bg": "#1e1b4b",
    "--status-message-border": "2px solid #7c3aed",
    "--status-message-text": "#e0e7ff",
    "--status-message-icon": "#a78bfa",
    "--status-message-radius": "12px",
    "--status-message-padding": "12px 16px",
    "--status-message-gap": "16px",
    "--status-message-shadow": "0 4px 20px rgba(124,58,237,0.3)",
    "--status-message-margin-bottom": "24px",
    "--status-message-max-width": "360px",
    "--status-message-warning-bg": "#422006",
    "--status-message-warning-border-style": "2px solid #f59e0b",
    "--status-message-warning-icon": "#fbbf24",
  }}
>
  <StatusMessage message="Custom styled status message with CSS variables." />
  <StatusMessage message="Custom styled warning message." isWarning />
</div>`,
      },
    },
  },
};
