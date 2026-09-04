import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { FloatingButton, FloatingButtonIcons } from ".";

const meta = {
  title: "UI/Interactive elements/FloatingButton",
  component: FloatingButton,
  parameters: {
    docs: {
      description: {
        component: `A floating action button (FAB) that appears on top of other UI elements for primary or important actions.

### Features

- **Multiple Icons**: Supports upload, trash, move, duplicate, download, copy, and more
- **Progress Indicator**: Shows upload/operation progress with percentage
- **Alert Badge**: Optional alert indicator for notifications
- **Completed State**: Visual feedback when an operation is complete
- **Color Customization**: Configurable background color

### Usage

\`\`\`tsx
import { FloatingButton, FloatingButtonIcons } from "@docspace/ui-kit/components/floating-button";

// Basic floating button
<FloatingButton icon={FloatingButtonIcons.upload} />

// With progress
<FloatingButton icon={FloatingButtonIcons.upload} percent={45} />

// With alert
<FloatingButton icon={FloatingButtonIcons.upload} alert />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=1053-45015&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    icon: {
      control: "select",
      options: Object.values(FloatingButtonIcons),
      description: "The icon to display in the button",
    },
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description: "Loading progress percentage (0-100)",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    alert: {
      control: "boolean",
      description: "Show alert indicator badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    completed: {
      control: "boolean",
      description: "Show completed state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stopped: {
      control: "boolean",
      description:
        "Show the stopped state: the operation was aborted by the user. Takes precedence over `alert` and `completed`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "Custom background color",
    },
    onClick: {
      action: "onClick",
      description: "Function called when the button is clicked",
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "70px",
          width: "100px",
          display: "flex",
          justifyContent: "flex-start",
          position: "relative",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatingButton>;

type Story = StoryObj<ComponentProps<typeof FloatingButton>>;

export default meta;

export const Default: Story = {
  render: (args) => <FloatingButton {...args} />,
  args: {
    icon: FloatingButtonIcons.upload,
  },
};

const WithProgressTemplate = () => {
  return <FloatingButton icon={FloatingButtonIcons.upload} percent={45} />;
};

export const WithProgress: Story = {
  render: () => <WithProgressTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Floating button showing upload progress at 45%. The circular progress indicator fills as the percentage increases.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} percent={45} />`,
      },
    },
  },
};

const WithAlertTemplate = () => {
  return <FloatingButton icon={FloatingButtonIcons.upload} alert />;
};

export const WithAlert: Story = {
  render: () => <WithAlertTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Floating button with an alert indicator badge. Used to draw attention to notifications or important updates.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} alert />`,
      },
    },
  },
};

const CompletedTemplate = () => {
  return (
    <FloatingButton icon={FloatingButtonIcons.upload} completed percent={100} />
  );
};

export const Completed: Story = {
  render: () => <CompletedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Floating button in completed state. Shows a checkmark or completion indicator when an operation finishes.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} completed percent={100} />`,
      },
    },
  },
};

const StoppedTemplate = () => {
  return (
    <FloatingButton icon={FloatingButtonIcons.trash} completed stopped alert />
  );
};

export const Stopped: Story = {
  render: () => <StoppedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Floating button in stopped state. Shows the minus status icon when the user aborts a running operation, instead of the success checkmark.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.trash} completed stopped />`,
      },
    },
  },
};

const IconVariantsTemplate = () => {
  const icons = [
    { icon: FloatingButtonIcons.upload, label: "upload" },
    { icon: FloatingButtonIcons.trash, label: "trash" },
    { icon: FloatingButtonIcons.move, label: "move" },
    { icon: FloatingButtonIcons.duplicate, label: "duplicate" },
    { icon: FloatingButtonIcons.download, label: "download" },
    { icon: FloatingButtonIcons.copy, label: "copy" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 80px)",
        gridGap: "24px",
        alignItems: "center",
      }}
    >
      {icons.map(({ icon, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FloatingButton icon={icon} />
          <span style={{ fontSize: "11px", color: "#666" }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export const IconVariants: Story = {
  render: () => <IconVariantsTemplate />,
  decorators: [],
  parameters: {
    docs: {
      description: {
        story:
          "Floating buttons with different icon variants. Shows the available built-in icons for common operations.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} />
<FloatingButton icon={FloatingButtonIcons.trash} />
<FloatingButton icon={FloatingButtonIcons.move} />
<FloatingButton icon={FloatingButtonIcons.duplicate} />
<FloatingButton icon={FloatingButtonIcons.download} />
<FloatingButton icon={FloatingButtonIcons.copy} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--floating-circle-button-background": "#7c3aed",
          "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
          "--floating-button-icon": "#ffffff",
        } as CSSProperties
      }
    >
      <FloatingButton icon={FloatingButtonIcons.upload} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--floating-circle-button-background\` | Button background color | \`--color-scheme-main-accent\` |
| \`--floating-button-shadow\` | Box shadow | theme token |
| \`--floating-button-button-size\` | Button size (width & height) | \`48px\` |
| \`--floating-button-icon\` | Icon fill color | \`--color-scheme-text-accent\` |`,
      },
    },
  },
};

