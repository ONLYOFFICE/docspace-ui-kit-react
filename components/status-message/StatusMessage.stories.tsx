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
        component: `Component for displaying animated status messages with error or warning styling.

### Features

- **Animated Entry/Exit**: Smooth slide-in and fade-out animations
- **Warning Variant**: Alternative styling for warning messages
- **Auto-Hide**: Automatically hides when the message is cleared
- **Message Swap**: Smoothly transitions between different messages
- **Danger Icon**: Displays a warning icon alongside the message text

### Usage

\`\`\`tsx
import StatusMessage from "@docspace/ui-kit/components/status-message";

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
      description: "Message text to display. Set to empty string to hide.",
    },
    isWarning: {
      control: "boolean",
      description: "Display with warning styling instead of error",
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
        story: "Status message with warning styling for non-critical alerts.",
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
          "Demonstrates showing and hiding the status message by setting the message to an empty string.",
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
          "Demonstrates smooth transitions when swapping between different messages.",
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
        } as CSSProperties
      }
    >
      <StatusMessage message="Custom styled status message with CSS variables." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--status-message-bg\` | Background color | theme token |
| \`--status-message-border\` | Border style | theme token |
| \`--status-message-text\` | Text color | theme token |
| \`--status-message-icon\` | Icon fill color | theme token |
| \`--status-message-shadow\` | Box shadow | theme token |
| \`--status-message-radius\` | Border radius | \`6px\` |
| \`--status-message-padding\` | Inner padding | \`8px 12px\` |
| \`--status-message-gap\` | Gap between icon and text | \`12px\` |
| \`--status-message-margin-bottom\` | Bottom margin | \`16px\` |
| \`--status-message-max-width\` | Max width | \`1200px\` |`,
      },
    },
  },
};
