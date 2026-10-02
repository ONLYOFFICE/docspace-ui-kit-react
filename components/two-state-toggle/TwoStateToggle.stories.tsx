import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TwoStateToggle } from ".";

const meta = {
  title: "UI/Navigation/TwoStateToggle",
  component: TwoStateToggle,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
        "Label on the inline-start half of the pill, the position of the classic view",
      table: { defaultValue: { summary: "OLD" } },
    },
    labelNew: {
      control: "text",
      description:
        "Label on the inline-end half of the pill, the position of the new dashboard",
      table: { defaultValue: { summary: "NEW" } },
    },
    confirmTitle: {
      control: "text",
      description:
        "Heading of the confirmation dialog shown when switching from NEW to OLD",
      table: { defaultValue: { summary: "Switch to Old Design" } },
    },
    confirmBody: {
      control: "text",
      description: "First paragraph of the confirmation dialog",
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
        "Second, smaller paragraph under the first one in the confirmation dialog; an empty string hides it",
      table: {
        defaultValue: {
          summary:
            "You can return to the new Dashboard at any time by navigating to /dashboard.",
        },
      },
    },
    confirmOk: {
      control: "text",
      description:
        "Label of the confirmation dialog's primary button, which switches to OLD",
      table: { defaultValue: { summary: "Switch" } },
    },
    confirmCancel: {
      control: "text",
      description:
        "Label of the confirmation dialog's second button, which closes it and keeps NEW",
      table: { defaultValue: { summary: "Cancel" } },
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible name a screen reader announces for the switch; the English default is not translated",
      table: { defaultValue: { summary: "Switch DocSpace design" } },
    },
    onNavigate: {
      action: "onNavigate",
      description:
        'Called with `"/dashboard"` when switching to NEW and with `"/"` after confirming the switch to OLD; replaces `window.location.href`. Pass React Router `navigate` here.',
    },
    className: {
      control: "text",
      description:
        "Additional CSS class applied to the wrapper around the title and the pill",
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
  parameters: {
    docs: {
      description: {
        story:
          "The toggle in the NEW position, as a first visit finds it. Click it to open the confirmation dialog that guards the way back to the classic view; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TwoStateToggle onNavigate={(url) => navigate(url)} />`,
      },
    },
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
      source: {
        code: `// localStorage.useDocSpace === "old"
<TwoStateToggle onNavigate={(url) => navigate(url)} />`,
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
          "All text strings are customizable — useful when the toggle is reused in other contexts. Click the toggle to see the dialog texts.",
      },
      source: {
        code: `<TwoStateToggle
  title="Interface"
  labelOld="v1"
  labelNew="v2"
  confirmTitle="Switch to v1?"
  confirmBody="You will be taken back to the classic interface."
  confirmHint="Return to v2 anytime via /dashboard."
  confirmOk="Yes, switch"
  confirmCancel="Stay on v2"
  onNavigate={(url) => navigate(url)}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <TwoStateToggle {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    title: "Design",
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "62px" },
      description: {
        story:
          "The toggle in a right-to-left layout: the title moves to the right of the pill, OLD takes the right half and NEW the left, and the thumb sits on the left over NEW. The wrapper carries `dir=\"rtl\"` for the layout; the thumb's leftward slide comes from the theme's `interfaceDirection` (the Direction toolbar).",
      },
      source: {
        code: `<div dir="rtl">
  <TwoStateToggle title="Design" onNavigate={(url) => navigate(url)} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          "--color-scheme-main-accent": "#2e7d32",
          "--button-root-border-radius": "18px",
          "--text-color": "#2e7d32",
        } as CSSProperties
      }
    >
      <TwoStateToggle {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `All three overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. Press Tab to focus the switch and see the ring take the custom accent.`,
      },
      source: {
        code: `<div style={{
  "--color-scheme-main-accent": "#2e7d32",
  "--button-root-border-radius": "18px",
  "--text-color": "#2e7d32",
}}>
  <TwoStateToggle onNavigate={(url) => navigate(url)} />
</div>`,
      },
    },
  },
};
