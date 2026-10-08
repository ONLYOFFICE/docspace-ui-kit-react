import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { FloatingButton, FloatingButtonIcons } from ".";

const meta = {
  title: "UI/Interactive elements/FloatingButton",
  component: FloatingButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=1053-45015&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    icon: {
      control: "select",
      options: Object.values(FloatingButtonIcons),
      description:
        "Which of the built-in icons is drawn in the middle of the circle; ignored when `iconUrl` is set",
      table: {
        defaultValue: { summary: "other" },
      },
    },
    iconUrl: {
      control: "text",
      description:
        "URL of an image drawn in the middle instead of the built-in icon, 20px wide",
    },
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description:
        "How much of the ring is filled, from 0 to 100; left unset, the ring spins instead",
    },
    withoutProgress: {
      control: "boolean",
      description:
        "Leaves the ring out entirely, so only the bare circle shows",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    alert: {
      control: "boolean",
      description:
        "Puts a red exclamation mark on the circle's upper edge; `stopped` wins over it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    completed: {
      control: "boolean",
      description:
        "Marks the operation finished: the ring fades out, the circle pulses once and a green tick appears",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stopped: {
      control: "boolean",
      description:
        "Puts a stop mark on the circle's upper edge, for an operation the user aborted; wins over `alert` and `completed`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutStatus: {
      control: "boolean",
      description:
        "Hides the badge on the circle's upper edge whatever `stopped`, `alert` and `completed` say",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description:
        "CSS colour of the circle and the ring; left unset, the accent colour is used",
    },
    showCancelButton: {
      control: "boolean",
      description:
        "Adds a cross, shown while the pointer is over the badge, that the host's layout must place beside the circle: on its own it lands under the circle and cannot be seen",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showCloseIcon: {
      control: "boolean",
      description:
        "Keeps the cross from `showCancelButton` visible without hovering",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "onClick",
      description: "Called with the click event when the circle is clicked",
    },
    clearUploadedFilesHistory: {
      action: "clearUploadedFilesHistory",
      description: "Called when the cross beside the circle is clicked",
    },
    id: {
      control: "text",
      description: "`id` of the circle, not of the wrapper that positions it",
    },
    className: {
      control: "text",
      description: "Extra class on the circle, after the component's own",
    },
    style: {
      control: "object",
      description: "Inline style on the circle",
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
  parameters: {
    docs: {
      description: {
        story:
          "An upload that has just started, with no progress value yet, so the ring spins; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} onClick={openPanel} />`,
      },
    },
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
          "A red exclamation mark on the circle's upper edge, for an operation that needs the user's attention, such as one that finished with errors (\`alert\`).",
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
          "A finished operation: the ring fades out, the circle pulses once and a green tick stays on its upper edge (\`completed\`).",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} completed percent={100} />`,
      },
    },
  },
};

const StoppedTemplate = () => {
  return <FloatingButton icon={FloatingButtonIcons.trash} completed stopped />;
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
    {
      icon: FloatingButtonIcons.deletePermanently,
      label: "deletePermanently",
    },
    { icon: FloatingButtonIcons.exportIndex, label: "exportIndex" },
    { icon: FloatingButtonIcons.markAsRead, label: "markAsRead" },
    { icon: FloatingButtonIcons.backup, label: "backup" },
    { icon: FloatingButtonIcons.plus, label: "plus" },
    { icon: FloatingButtonIcons.minus, label: "minus" },
    { icon: FloatingButtonIcons.refresh, label: "refresh" },
    { icon: FloatingButtonIcons.dots, label: "dots" },
    { icon: FloatingButtonIcons.arrow, label: "arrow" },
    { icon: FloatingButtonIcons.other, label: "other" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 100px)",
        rowGap: "8px",
        columnGap: "24px",
      }}
    >
      {icons.map(({ icon, label }) => (
        <div
          key={label}
          style={{
            position: "relative",
            width: 100,
            height: 70,
          }}
        >
          <FloatingButton icon={icon} />
          <span
            style={{
              position: "absolute",
              top: 56,
              insetInlineStart: 0,
              width: 48,
              textAlign: "center",
              fontSize: "11px",
              color: "#666",
            }}
          >
            {label}
          </span>
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
<FloatingButton icon={FloatingButtonIcons.copy} />
<FloatingButton icon={FloatingButtonIcons.deletePermanently} />
<FloatingButton icon={FloatingButtonIcons.exportIndex} />
<FloatingButton icon={FloatingButtonIcons.markAsRead} />
<FloatingButton icon={FloatingButtonIcons.backup} />
<FloatingButton icon={FloatingButtonIcons.plus} />
<FloatingButton icon={FloatingButtonIcons.minus} />
<FloatingButton icon={FloatingButtonIcons.refresh} />
<FloatingButton icon={FloatingButtonIcons.dots} />
<FloatingButton icon={FloatingButtonIcons.arrow} />
<FloatingButton icon={FloatingButtonIcons.other} />`,
      },
    },
  },
};

export const WithoutProgress: Story = {
  render: () => (
    <FloatingButton icon={FloatingButtonIcons.upload} withoutProgress />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The bare circle with no ring, for an operation whose progress is not worth showing, or a badge that only opens a panel (`withoutProgress`).",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} withoutProgress />`,
      },
    },
  },
};

export const WithoutStatusBadge: Story = {
  render: () => (
    <FloatingButton icon={FloatingButtonIcons.move} completed withoutStatus />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A finished move with no tick on the circle: the ring still fades out, but the badge on the upper edge is hidden whatever the state props say (`withoutStatus`).",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.move} completed withoutStatus />`,
      },
    },
  },
};

export const CustomColor: Story = {
  render: () => (
    <FloatingButton
      icon={FloatingButtonIcons.upload}
      percent={45}
      color="#2e8b57"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The circle, the ring and the accent parts of the icon in a colour of your own instead of the accent colour, for example one per kind of operation (`color`).",
      },
      source: {
        code: `<FloatingButton icon={FloatingButtonIcons.upload} percent={45} color="#2e8b57" />`,
      },
    },
  },
};

// An inline picture, so the story makes no network request.
const sampleIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="3" y="2" width="14" height="16" rx="2" fill="#ffffff"/><rect x="6" y="6" width="8" height="1.5" fill="#8fb3d9"/><rect x="6" y="9.5" width="8" height="1.5" fill="#8fb3d9"/><rect x="6" y="13" width="5" height="1.5" fill="#8fb3d9"/></svg>',
)}`;

export const CustomIconImage: Story = {
  render: () => <FloatingButton iconUrl={sampleIconUrl} />,
  parameters: {
    docs: {
      description: {
        story:
          "An image of your own in the middle, 20px wide, for an operation none of the built-in icons fits (`iconUrl`).",
      },
      source: {
        code: `<FloatingButton iconUrl="/images/operation.svg" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "24px",
          "--floating-circle-button-background": "#7c3aed",
          "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
          "--floating-button-icon": "#fde68a",
        } as CSSProperties
      }
    >
      <div style={{ position: "relative", width: 100, height: 70 }}>
        <FloatingButton icon={FloatingButtonIcons.upload} />
      </div>
      <div style={{ position: "relative", width: 100, height: 70 }}>
        <FloatingButton icon={FloatingButtonIcons.move} />
      </div>
    </div>
  ),
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: `Two buttons under one wrapper that sets the background, the shadow and the icon colour -- the variables are listed under CSS variables on this page.

- **Upload** — the background and the shadow; its icon is one of the accent icons (upload, trash, deletePermanently, other), whose shapes are painted in the background colour, so the icon colour does not reach it
- **Move** — the icon colour, on an icon that is not an accent one`,
      },
      source: {
        code: `<div
  style={{
    "--floating-circle-button-background": "#7c3aed",
    "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
    "--floating-button-icon": "#fde68a",
  }}
>
  <FloatingButton icon={FloatingButtonIcons.upload} />
  <FloatingButton icon={FloatingButtonIcons.move} />
</div>`,
      },
    },
  },
};
