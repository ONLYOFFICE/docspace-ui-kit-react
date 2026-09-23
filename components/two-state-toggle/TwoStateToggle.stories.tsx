import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TwoStateToggle } from ".";

const meta = {
  title: "UI/Navigation/TwoStateToggle",
  component: TwoStateToggle,
  parameters: {
    docs: {
      description: {
        component: `TwoStateToggle is a pill-shaped switch that moves the user between the new Dashboard and the classic DocSpace view. It is not a general-purpose on/off control; for an ordinary two-state setting use \`ToggleButton\`.

### Features

- **State in \`localStorage\`**: the initial position is read once, on mount, from the \`useDocSpace\` key. \`"old"\` means the classic view; anything else, including no value, means the new one. There is no \`value\` / \`onChange\` pair
- **NEW to OLD**: opens a confirmation modal. Confirming writes \`"old"\` and navigates to \`/\`; cancelling or closing the modal changes nothing
- **OLD to NEW**: switches immediately, writes \`"new"\` and navigates to \`/dashboard\`
- **Fixed targets**: \`/dashboard\` and \`/\` are hardcoded. \`onNavigate\` only decides how to navigate; without it the page does a full load through \`window.location.href\`
- **Blocked storage**: if \`localStorage\` throws, the toggle starts in the new view and still switches and navigates; the choice is just not persisted
- **Hiding parts**: an empty \`title\` renders only the pill; an empty \`confirmHint\` drops the hint from the modal

### Accessibility

- \`role="switch"\` on a \`<button>\`, with \`aria-checked\` set while the new view is active
- \`aria-label\`: taken from \`ariaLabel\`, default "Switch DocSpace design". \`title\`, \`labelOld\` and \`labelNew\` do not change it; the labels are \`aria-hidden\`

### Usage

\`\`\`tsx
import { TwoStateToggle } from "@onlyoffice/apps-ui-kit/components/two-state-toggle";

// In a React Router context: pass navigate to avoid a full reload
<TwoStateToggle onNavigate={(url) => navigate(url)} />

// Standalone (falls back to window.location.href)
<TwoStateToggle />
\`\`\`

### CSS Custom Properties

| Variable | Description |
|----------|-------------|
| \`--color-scheme-main-accent\` | Pill background, focus ring, label on the thumb |
| \`--button-root-border-radius\` | Border radius of the pill (thumb is 2px smaller); fallback \`6px\` |
| \`--text-color\` | Color of the title label |`,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Text label shown at the inline start of the toggle; an empty string hides it",
      table: { defaultValue: { summary: "DocSpace design" } },
    },
    labelOld: {
      control: "text",
      description:
        "Label for the classic DocSpace view (inline-start half of the pill)",
      table: { defaultValue: { summary: "OLD" } },
    },
    labelNew: {
      control: "text",
      description:
        "Label for the new Dashboard view (inline-end half of the pill)",
      table: { defaultValue: { summary: "NEW" } },
    },
    confirmTitle: {
      control: "text",
      description: "Confirmation modal title (shown when switching NEW → OLD)",
      table: { defaultValue: { summary: "Switch to Old Design" } },
    },
    confirmBody: {
      control: "text",
      description: "Confirmation modal main body text",
      table: {
        defaultValue: {
          summary:
            "You are about to leave the new Dashboard and return to the classic DocSpace view.",
        },
      },
    },
    confirmHint: {
      control: "text",
      description:
        "Hint shown below the body, e.g. how to return to the new view; an empty string hides it",
      table: {
        defaultValue: {
          summary:
            "You can return to the new Dashboard at any time by navigating to /dashboard.",
        },
      },
    },
    confirmOk: {
      control: "text",
      description: 'Confirmation modal "proceed" button label',
      table: { defaultValue: { summary: "Switch" } },
    },
    confirmCancel: {
      control: "text",
      description: 'Confirmation modal "cancel" button label',
      table: { defaultValue: { summary: "Cancel" } },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name of the switch button",
      table: { defaultValue: { summary: "Switch DocSpace design" } },
    },
    onNavigate: {
      action: "onNavigate",
      description:
        'Called with `"/dashboard"` when switching to NEW and with `"/"` after confirming the switch to OLD; replaces `window.location.href`. Pass React Router `navigate` here.',
    },
    className: {
      control: "text",
      description: "Additional CSS class applied to the wrapper",
    },
  },
  decorators: [
    (Story) => {
      localStorage.setItem("useDocSpace", "new");
      return <Story />;
    },
  ],
} satisfies Meta<typeof TwoStateToggle>;

type Story = StoryObj<ComponentProps<typeof TwoStateToggle>>;

export default meta;

export const Default: Story = {
  args: {
    title: "DocSpace design",
    labelOld: "OLD",
    labelNew: "NEW",
  },
};

export const ShowingOldState: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem("useDocSpace", "old");
      return <Story />;
    },
  ],
  args: {
    title: "DocSpace design",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle in the OLD position. Clicking it switches to NEW immediately (calls `onNavigate("/dashboard")`).',
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    title: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Toggle without the text label — only the pill is rendered.",
      },
      source: {
        code: `<TwoStateToggle title="" onNavigate={(url) => navigate(url)} />`,
      },
    },
  },
};

export const CustomLabels: Story = {
  args: {
    title: "Interface",
    labelOld: "v1",
    labelNew: "v2",
    confirmTitle: "Switch to v1?",
    confirmBody: "You will be taken back to the classic interface.",
    confirmHint: "Return to v2 anytime via /dashboard.",
    confirmOk: "Yes, switch",
    confirmCancel: "Stay on v2",
  },
  parameters: {
    docs: {
      description: {
        story:
          "All text strings are customizable — useful when the toggle is reused in other contexts.",
      },
    },
  },
};
