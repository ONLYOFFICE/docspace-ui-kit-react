import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

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
        'Text to the left of the pill. An empty string removes it. The default names the product through `getBrandName("ProductName")`, so a portal that rebrands the product renames it here too.',
      table: { defaultValue: { summary: "ONLYOFFICE Apps design" } },
    },
    labelOld: {
      control: "text",
      description: "Label on the left half of the pill, the classic view.",
      table: { defaultValue: { summary: "OLD" } },
    },
    labelNew: {
      control: "text",
      description: "Label on the right half, the new dashboard.",
      table: { defaultValue: { summary: "NEW" } },
    },
    confirmTitle: {
      control: "text",
      description: "Heading of the dialog shown when leaving the new view.",
      table: { defaultValue: { summary: "Switch to Old Design" } },
    },
    confirmBody: {
      control: "text",
      description:
        'First paragraph of that dialog. The default names the product through `getBrandName("ProductName")`.',
      table: {
        defaultValue: {
          summary:
            "You are about to leave the new Dashboard and return to the classic ONLYOFFICE Apps view.",
        },
      },
    },
    confirmHint: {
      control: "text",
      description:
        "Second paragraph of that dialog. An empty string removes it.",
      table: {
        defaultValue: {
          summary:
            "You can return to the new Dashboard at any time by navigating to /dashboard.",
        },
      },
    },
    confirmOk: {
      control: "text",
      description: "Label of that dialog's primary button.",
      table: { defaultValue: { summary: "Switch" } },
    },
    confirmCancel: {
      control: "text",
      description: "Label of its cancel button.",
      table: { defaultValue: { summary: "Cancel" } },
    },
    ariaLabel: {
      control: "text",
      description:
        'Accessible name of the switch button. The English default, which names the product through `getBrandName("ProductName")`, is not translated for you.',
      table: { defaultValue: { summary: "Switch ONLYOFFICE Apps design" } },
    },
    onNavigate: {
      action: "onNavigate",
      description:
        "Called with the URL to go to — `/dashboard` or `/`, both hard-coded. Pass your router's navigate here; without it the component assigns `window.location.href` and the page reloads.",
    },
    className: {
      control: "text",
      description: "Applied to the wrapper around the title and the pill.",
    },
  },
  // Without onNavigate a switch sets window.location.href and takes the
  // story's frame away to /dashboard or /.
  args: { onNavigate: fn() },
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
    labelOld: "OLD",
    labelNew: "NEW",
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "true");

    // The default strings name the product through the brand lookup
    // (Storybook registers the brands fixture), never the old "DocSpace".
    await expect(toggle).toHaveAccessibleName("Switch ONLYOFFICE Apps design");
    await expect(canvas.getByText("ONLYOFFICE Apps design")).toBeVisible();
    await expect(canvas.queryByText(/DocSpace/)).toBeNull();

    // Leaving NEW asks first; Cancel keeps NEW and goes nowhere.
    await userEvent.click(toggle);
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancel" }),
    );
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onNavigate).not.toHaveBeenCalled();

    await userEvent.click(toggle);
    await userEvent.click(
      await screen.findByRole("button", { name: "Switch" }),
    );
    await waitFor(() =>
      expect(toggle).toHaveAttribute("aria-checked", "false"),
    );
    await expect(args.onNavigate).toHaveBeenCalledWith("/");
    await expect(localStorage.getItem("useDocSpace")).toBe("old");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The toggle in the NEW position, as a first visit finds it. A click opens the confirmation dialog that guards the way back to the classic view.",
      },
      source: {
        code: `<TwoStateToggle onNavigate={(url) => navigate(url)} />`,
      },
    },
  },
};

export const ShowingOldState: Story = {
  name: "Classic view",
  decorators: [
    (Story) => {
      localStorage.setItem("useDocSpace", "old");
      return <Story />;
    },
  ],
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "false");

    // Back to NEW needs no confirmation.
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    // ModalDialog keeps its markup while closed, so check it is not shown.
    await expect(screen.queryByText("Switch to Old Design")).not.toBeVisible();
    await expect(args.onNavigate).toHaveBeenCalledWith("/dashboard");
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
  name: "Without the title",
  args: {
    title: "",
  },
  play: async ({ canvas }) => {
    // Only the pill: its two labels are the whole text.
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toBeVisible();
    await expect(
      (toggle.parentElement as HTMLElement).textContent?.replace(/\s/g, ""),
    ).toBe("OLDNEW");
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
  name: "Custom texts",
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
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Interface")).toBeVisible();
    await expect(canvas.getByText("v1")).toBeVisible();
    await expect(canvas.getByText("v2")).toBeVisible();

    // The confirmation speaks with the story's own words.
    await userEvent.click(canvas.getByRole("switch"));
    await waitFor(() =>
      expect(screen.getByText("Switch to v1?")).toBeVisible(),
    );
    await expect(
      screen.getByText("You will be taken back to the classic interface."),
    ).toBeVisible();
    await expect(
      screen.getByText("Return to v2 anytime via /dashboard."),
    ).toBeVisible();
    await expect(
      screen.getByRole("button", { name: "Yes, switch" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Stay on v2" }));
    await expect(args.onNavigate).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A toggle with every text of its own, the dialog's included, for reuse in another context.",
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
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <TwoStateToggle {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    title: "Design",
  },
  play: async ({ canvas }) => {
    // The title moves to the right of the pill.
    await expect(
      canvas.getByText("Design").getBoundingClientRect().left,
    ).toBeGreaterThan(canvas.getByRole("switch").getBoundingClientRect().left);
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "62px" },
      description: {
        story:
          "The toggle in a right-to-left layout, with the title to the right of the pill and the thumb on the left over NEW. The wrapper's `dir=\"rtl\"` lays it out; the theme's `interfaceDirection` slides the thumb.",
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
  name: "CSS customization",
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveStyle({
      borderRadius: "18px",
      backgroundColor: "rgb(46, 125, 50)",
    });
    await expect(canvas.getByText("ONLYOFFICE Apps design")).toHaveStyle({
      color: "rgb(46, 125, 50)",
    });
    // The focus ring mixes the custom accent (46, 125, 50 in 0-1 sRGB).
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await expect(getComputedStyle(toggle).boxShadow).toContain(
      "0.180392 0.490196 0.196078",
    );
  },
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
        story: `All three overridable variables, set on one wrapper. The keyboard focus ring takes the custom accent too.`,
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
