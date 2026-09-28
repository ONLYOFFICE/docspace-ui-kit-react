import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CategoryItem } from "./index";

const meta = {
  title: "UI/Data display/CategoryItem",
  component: CategoryItem,
  parameters: {
    docs: {
      description: {
        component: `CategoryItem is one entry of an index of destinations: a linked title, a line of explanation under it and a trailing arrow, with an optional paid badge beside the title.

### Features

- **Title & Subtitle**: Shows the destination's name as a 16px semibold link and a 12px explanatory line under it, capped at 1024px wide
- **Link Navigation**: Points the title at \`url\` and calls \`onClickLink\` on a click, without preventing the browser from following the link
- **Paid Badge**: Places a gold badge with its own label beside the title when \`withPaidBadge\` is set, except on a page whose path contains \`management\`
- **Disabled State**: Removes the link's \`href\` and click handler and gives the subtitle the disabled colour, which is dimmer only in the dark theme, while the title and arrow stay unchanged
- **Trailing Arrow**: Always ends the heading row with an arrow pointing onward, mirrored under a right-to-left interface
- **Theme Colours**: Takes the subtitle, disabled and arrow colours from the light or dark theme, and the badge's gold from the theme context
- **Built-in Spacing**: Adds a 20px bottom margin to each entry, which adds to a surrounding flex or grid \`gap\`

### Usage

\`\`\`tsx
import { CategoryItem } from "@onlyoffice/apps-ui-kit/components/category-item";

<CategoryItem
  title="Security"
  subtitle="Manage passwords and access settings"
  url="/settings/security"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel=""
/>

// Unavailable entry: the title is not a link
<CategoryItem
  title="Single sign-on"
  subtitle="Upgrade to configure single sign-on"
  url="/settings/sso"
  onClickLink={handleClick}
  isDisabled
  withPaidBadge
  badgeLabel="PRO"
/>

// Client-side routing: stop the browser from following the link
<CategoryItem
  title="General"
  subtitle="Language and time zone"
  url="/settings/general"
  onClickLink={(e) => {
    e.preventDefault();
    navigate("/settings/general");
  }}
  withPaidBadge={false}
  badgeLabel=""
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Heading of the entry, rendered as the text of a 16px link",
    },
    subtitle: {
      control: "text",
      description:
        "Explanatory line under the title, at 12px and no wider than 1024px",
    },
    url: {
      control: "text",
      description:
        "Where the title link points; dropped while the entry is disabled",
    },
    onClickLink: {
      action: "onClickLink",
      description:
        "Called with the click event on the title link; the browser still follows `url` unless the handler calls `preventDefault`",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Removes the link's `href` and click handler and gives the subtitle the disabled colour, which is dimmer only in the dark theme; the title and arrow look unchanged",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withPaidBadge: {
      control: "boolean",
      description:
        "Shows the paid badge beside the title, except on a page whose path contains `management`; required",
    },
    badgeLabel: {
      control: "text",
      description:
        "Text inside the paid badge; required, so pass an empty string when there is no badge",
    },
    dataTestId: {
      control: "text",
      description:
        "Value of `data-testid` on the entry, and the stem of the title link's `<dataTestId>_category_link`",
    },
  },
} satisfies Meta<typeof CategoryItem>;

type Story = StoryObj<ComponentProps<typeof CategoryItem>>;

export default meta;

export const Default: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "An entry as it sits in an index of destinations: the title link, the explanation under it and the arrow. Change any prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Marks a destination that needs a paid plan: the badge beside the title carries its own text (`withPaidBadge`, `badgeLabel`). The badge is not shown on a page whose path contains `management`.",
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
  parameters: {
    docs: {
      description: {
        story:
          "For a destination the reader cannot open right now: the title is no longer a working link (`isDisabled`). Nothing else marks it in the light theme, where the disabled subtitle colour matches the normal one; in the dark theme the subtitle dims. Say in the subtitle why the entry is unavailable.",
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
      onClickLink={() => {}}
    />
    <CategoryItem
      title="Security"
      subtitle="Configure passwords and access policies"
      url="#"
      withPaidBadge
      badgeLabel="PRO"
      onClickLink={() => {}}
    />
    <CategoryItem
      title="Backup"
      subtitle="Manage backup and restore options"
      url="#"
      isDisabled
      withPaidBadge={false}
      badgeLabel=""
      onClickLink={() => {}}
    />
  </Wrapper>
);

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The three looks side by side, as they appear together in one index:\n\n- **General Settings** — a plain entry\n- **Security** — the same entry with the paid badge (`withPaidBadge`)\n- **Backup** — an unavailable entry whose title is no longer a link (`isDisabled`)",
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
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "80px" },
      description: {
        story:
          'The same entry under a right-to-left interface: the title and subtitle align to the right, the badge follows the title leftwards and the arrow sits at the left end, mirrored to point left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
        onClickLink={() => {}}
        withPaidBadge={false}
        badgeLabel=""
      />
      <CategoryItem
        title="Security"
        subtitle="Configure passwords and two-factor authentication"
        url="/settings/security"
        onClickLink={() => {}}
        isDisabled
        withPaidBadge={false}
        badgeLabel=""
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--category-item-title-color\` | Title link color | inherited from the surrounding text |
| \`--category-item-description-color\` | Subtitle text color | theme-based |
| \`--category-item-arrow-color\` | Arrow icon fill color | theme-based |
| \`--category-item-disabled-color\` | Subtitle text color while \`isDisabled\` is set | theme-based |
| \`--category-item-margin\` | Bottom margin of each entry | \`20px\` |

**Files** shows the title, subtitle and arrow colours and the margin below it; **Security** is disabled (\`isDisabled\`) to show \`--category-item-disabled-color\` on its subtitle.`,
      },
    },
  },
};
