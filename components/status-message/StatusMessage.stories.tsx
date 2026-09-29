import { useState } from "react";

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";

import StatusMessage from ".";

const meta = {
  title: "UI/Feedback/StatusMessage",
  component: StatusMessage,
  parameters: {
    docs: {
      description: {
        component: `A bar for an error or a warning that stays on screen until the state behind it changes, placed above the form or page it is about.

### Features

- **Fade In and Out**: Fades in when a message arrives and fades out before it leaves
- **Warning Variant**: Switches the background, border and icon to the warning colours
- **Auto-Hide**: Automatically hides when the message is cleared
- **Message Swap**: Smoothly transitions between different messages
- **Danger Icon**: Shows the same danger glyph before the text in both variants, tinted to match
- **Rich Content**: Accepts plain text or React nodes as the message
- **Container Width**: Stretches to the width of its container up to 1200px and keeps a 16px gap below

### Usage

\`\`\`tsx
import StatusMessage from "@onlyoffice/apps-ui-kit/components/status-message";

// Error message
<StatusMessage message="Invalid email address" />

// Warning message
<StatusMessage message="Password is too weak" isWarning />

// Controlled visibility (clear message to hide)
<StatusMessage message={error || ""} />
\`\`\``,
      },
    },
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

export const Default: Story = {
  render: (args) => <StatusMessage {...args} />,
  args: {
    message: "This is a status message",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The error bar as a form shows it after a failed action. Type a new text in the Controls panel below to watch the old one fade out first; the warning switch there takes effect with the next text change (`isWarning`).",
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--status-message-bg\` | Background color of the error bar | theme token |
| \`--status-message-border\` | Border of the error bar | theme token |
| \`--status-message-text\` | Text color | theme token |
| \`--status-message-icon\` | Icon fill color of the error bar | theme token |
| \`--status-message-warning-bg\` | Background color of the warning bar | theme token |
| \`--status-message-warning-border-style\` | Border of the warning bar | theme token |
| \`--status-message-warning-icon\` | Icon fill color of the warning bar | theme token |
| \`--status-message-shadow\` | Box shadow | theme token |
| \`--status-message-radius\` | Border radius | \`6px\` |
| \`--status-message-padding\` | Inner padding | \`8px 12px\` |
| \`--status-message-gap\` | Gap between icon and text | \`12px\` |
| \`--status-message-margin-bottom\` | Bottom margin | \`16px\` |
| \`--status-message-max-width\` | Max width | \`1200px\` |

The first bar shows the shared variables; the second, with \`isWarning\`, is there for the three warning variables, and the gap between the two is the bottom margin. The max width caps both bars below the 400px wrapper.`,
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
