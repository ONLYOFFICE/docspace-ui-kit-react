import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { CategoryItem } from "./index";

const meta = {
  title: "UI/Data display/CategoryItem",
  component: CategoryItem,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Heading of the row, rendered as the text of a link at 16px.",
    },
    subtitle: {
      control: "text",
      description:
        "Explanatory line under the title, at 12px and no wider than 1024px.",
    },
    url: {
      control: "text",
      description:
        "Where the link points. It is dropped while `isDisabled` is set, which leaves an `<a>` with no `href`.",
    },
    onClickLink: {
      action: "onClickLink",
      description:
        "Called with the click event on the title link. Nothing prevents the browser from following `url` — call `preventDefault` yourself when you route in JavaScript.",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Dims the title, subtitle and arrow, and removes `href` and `onClickLink` from the link. The arrow still renders, so say in the subtitle why the row is unavailable.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withPaidBadge: {
      control: "boolean",
      description:
        "Shows the paid badge beside the title — unless the page's path starts with `/management`, where it is suppressed. Required, so pass `false` when there is no badge.",
    },
    badgeLabel: {
      control: "text",
      description:
        "Text inside the paid badge. Required even when `withPaidBadge` is `false`; pass an empty string then.",
    },
    dataTestId: {
      control: "text",
      description:
        "Value of `data-testid` on the wrapper, and the stem of the title link's own `<dataTestId>_category_link`. Without it the link keeps the shared `link` id.",
    },
  },
} satisfies Meta<typeof CategoryItem>;

type Story = StoryObj<ComponentProps<typeof CategoryItem>>;

export default meta;

export const Default: Story = {
  name: "Default",
  render: (args) => <CategoryItem {...args} />,
  args: {
    title: "Category Title",
    subtitle:
      "This is a description of the category that provides more details",
    url: "#",
    isDisabled: false,
    withPaidBadge: false,
    badgeLabel: "PRO",
    onClickLink: fn(),
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const link = canvas.getByRole("link", { name: "Category Title" });
    await expect(link).toHaveAttribute("href", "#");
    // Keep the test page where it is: the handler still runs, but the
    // browser does not follow the link.
    canvasElement.addEventListener("click", (e) => e.preventDefault(), {
      once: true,
    });
    await userEvent.click(link);
    await expect(args.onClickLink).toHaveBeenCalledTimes(1);
    // No badge unless asked for.
    await expect(canvas.queryByText("PRO")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An entry as it sits in an index of destinations: the title link, the explanation under it and the arrow.",
      },
      source: {
        code: `<CategoryItem
  title="Category Title"
  subtitle="Description of the category"
  url="/settings/category"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel=""
/>`,
      },
    },
  },
};

export const WithPaidBadge: Story = {
  name: "With paid badge",
  render: (args) => <CategoryItem {...args} />,
  args: {
    title: "Premium Feature",
    subtitle: "Available on a paid plan",
    url: "#",
    isDisabled: false,
    withPaidBadge: true,
    badgeLabel: "PRO",
    onClickLink: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("PRO")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A paid badge beside the title (`withPaidBadge`, `badgeLabel`), for a destination that needs a paid plan. A page whose path contains `management` hides it.",
      },
      source: {
        code: `<CategoryItem
  title="Premium Feature"
  subtitle="Available on a paid plan"
  url="/settings/premium"
  onClickLink={handleClick}
  withPaidBadge
  badgeLabel="PRO"
/>`,
      },
    },
  },
};

export const DisabledState: Story = {
  name: "Disabled",
  render: (args) => <CategoryItem {...args} />,
  args: {
    title: "Disabled Category",
    subtitle: "This category is currently unavailable",
    url: "#",
    isDisabled: true,
    withPaidBadge: false,
    badgeLabel: "PRO",
    onClickLink: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The title is still a link, focusable and announced as unavailable,
    // but it has no href and no handler.
    const link = canvas.getByRole("link", { name: "Disabled Category" });
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).not.toHaveAttribute("href");
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.click(link);
    await expect(args.onClickLink).not.toHaveBeenCalled();
    // It is dimmed: the title takes the same colour as the disabled subtitle.
    const subtitle = canvas.getByText("This category is currently unavailable");
    await expect(getComputedStyle(link).color).toBe(
      getComputedStyle(subtitle).color,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "An unavailable entry with its title, subtitle and arrow dimmed (`isDisabled`). The title stays focusable, is announced as an unavailable link and does nothing.",
      },
      source: {
        code: `<CategoryItem
  title="Disabled Category"
  subtitle="This category is currently unavailable"
  url="/settings/category"
  onClickLink={handleClick}
  isDisabled
  withPaidBadge={false}
  badgeLabel=""
/>`,
      },
    },
  },
};

const Wrapper = (props: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxWidth: "600px",
    }}
  >
    {props.children}
  </div>
);

const AllVariantsTemplate = () => (
  <Wrapper>
    <CategoryItem
      title="General Settings"
      subtitle="Manage general application settings"
      url="#"
      withPaidBadge={false}
      badgeLabel=""
      onClickLink={fn()}
    />
    <CategoryItem
      title="Security"
      subtitle="Configure passwords and access policies"
      url="#"
      withPaidBadge
      badgeLabel="PRO"
      onClickLink={fn()}
    />
    <CategoryItem
      title="Backup"
      subtitle="Manage backup and restore options"
      url="#"
      isDisabled
      withPaidBadge={false}
      badgeLabel=""
      onClickLink={fn()}
    />
  </Wrapper>
);

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsTemplate />,
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole("link").map((link) => link.textContent);
    await expect(links).toEqual(["General Settings", "Security", "Backup"]);
    // Backup is still listed as a link, but an unavailable one.
    await expect(canvas.getByRole("link", { name: "Backup" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The three looks side by side, as they appear together in one index:\n\n- **General Settings** — a plain entry\n- **Security** — the same entry with the paid badge (`withPaidBadge`)\n- **Backup** — an unavailable entry, dimmed, whose title is announced as a disabled link (`isDisabled`)",
      },
      source: {
        code: `<CategoryItem title="General Settings" subtitle="Manage general application settings" url="/settings/general" onClickLink={handleClick} withPaidBadge={false} badgeLabel="" />
<CategoryItem title="Security" subtitle="Configure passwords and access policies" url="/settings/security" onClickLink={handleClick} withPaidBadge badgeLabel="PRO" />
<CategoryItem title="Backup" subtitle="Manage backup and restore options" url="/settings/backup" onClickLink={handleClick} isDisabled withPaidBadge={false} badgeLabel="" />`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <CategoryItem {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    // Arabic for "General settings" and "Language and time zone", escaped to keep the source ASCII.
    title:
      "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0639\u0627\u0645\u0629",
    subtitle:
      "\u0627\u0644\u0644\u063a\u0629 \u0648\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0632\u0645\u0646\u064a\u0629",
    url: "#",
    isDisabled: false,
    withPaidBadge: true,
    badgeLabel: "PRO",
    onClickLink: fn(),
  },
  play: async ({ canvas }) => {
    // Under RTL the badge follows the title leftwards.
    const title = canvas.getByRole("link");
    const badge = canvas.getByText("PRO");
    await expect(badge.getBoundingClientRect().right).toBeLessThanOrEqual(
      title.getBoundingClientRect().left,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "80px" },
      description: {
        story:
          'The entry in a right-to-left interface. The text aligns right, the badge follows the title leftwards, and the arrow sits at the left end, pointing left. The direction comes from the theme\'s `interfaceDirection`; the wrapper adds `dir="rtl"` for rules that read the DOM.',
      },
      source: {
        code: `<div dir="rtl">
  <CategoryItem
    title="..."
    subtitle="..."
    url="/settings/general"
    onClickLink={handleClick}
    withPaidBadge
    badgeLabel="PRO"
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  render: () => (
    <div
      style={
        {
          "--category-item-title-color": "#0082c9",
          "--category-item-description-color": "#2e7d32",
          "--category-item-arrow-color": "#d84315",
          "--category-item-disabled-color": "#c4c4c4",
          "--category-item-margin": "32px",
        } as CSSProperties
      }
    >
      <CategoryItem
        title="Files"
        subtitle="Manage files and storage settings"
        url="/settings/files"
        onClickLink={fn()}
        withPaidBadge={false}
        badgeLabel=""
      />
      <CategoryItem
        title="Security"
        subtitle="Configure passwords and two-factor authentication"
        url="/settings/security"
        onClickLink={fn()}
        isDisabled
        withPaidBadge={false}
        badgeLabel=""
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByRole("link", { name: "Files" })).color,
    ).toBe("rgb(0, 130, 201)");
    await expect(
      getComputedStyle(
        canvas.getByText("Configure passwords and two-factor authentication"),
      ).color,
    ).toBe("rgb(196, 196, 196)");
  },
  parameters: {
    docs: {
      description: {
        story: `The variables set on one wrapper, shown on two entries:\n\n- **Files** — the title, subtitle and arrow colours and the margin below it\n- **Security** — \`--category-item-disabled-color\` on a disabled entry (\`isDisabled\`)`,
      },
    },
  },
};
