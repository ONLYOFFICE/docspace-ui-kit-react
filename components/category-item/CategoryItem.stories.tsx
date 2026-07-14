/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { CategoryItem } from "./index";

const meta = {
  title: "UI/Data display/CategoryItem",
  component: CategoryItem,
  parameters: {
    docs: {
      description: {
        component: `CategoryItem displays a settings category with title, subtitle, and optional paid badge.

### Features

- **Title & Subtitle**: Displays a category name and description
- **Paid Badge**: Optional badge label for premium features
- **Link Navigation**: Click handler for navigation to category details
- **Disabled State**: Prevents interaction when disabled

### Usage

\`\`\`tsx
import { CategoryItem } from "@docspace/ui-kit/components/category-item";

<CategoryItem
  title="Security"
  subtitle="Manage passwords and access settings"
  url="/settings/security"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel="PRO"
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title of the category",
    },
    subtitle: {
      control: "text",
      description: "Description text for the category",
    },
    url: {
      control: "text",
      description: "URL for the category link",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the category item",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withPaidBadge: {
      control: "boolean",
      description: "Shows a paid/premium badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    badgeLabel: {
      control: "text",
      description: "Text label for the paid badge",
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
    onClickLink: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Default category item with title and subtitle.",
      },
      source: {
        code: `<CategoryItem
  title="Category Title"
  subtitle="Description of the category"
  url="/settings/category"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel="PRO"
/>`,
      },
    },
  },
};

export const WithPaidBadge: Story = {
  render: (args) => <CategoryItem {...args} />,
  args: {
    title: "Premium Feature",
    subtitle: "This feature requires a paid subscription",
    url: "#",
    isDisabled: false,
    withPaidBadge: true,
    badgeLabel: "PRO",
    onClickLink: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Category item with a paid badge indicating premium content.",
      },
      source: {
        code: `<CategoryItem title="Premium Feature" subtitle="Requires paid subscription" withPaidBadge badgeLabel="PRO" />`,
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
    onClickLink: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled category item that cannot be interacted with.",
      },
      source: {
        code: `<CategoryItem title="Disabled Category" subtitle="Currently unavailable" isDisabled />`,
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
          "All category item variants: default, with paid badge, and disabled.",
      },
      source: {
        code: `<CategoryItem title="General Settings" subtitle="Manage settings" />
<CategoryItem title="Security" subtitle="Configure access" withPaidBadge badgeLabel="PRO" />
<CategoryItem title="Backup" subtitle="Manage backup" isDisabled />`,
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
          "--category-item-description-color": "#0082c9",
          "--category-item-arrow-color": "#0082c9",
          "--category-item-subheader-size": "14px",
          "--category-item-margin": "16px",
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
| \`--category-item-title-color\` | Title link color | inherited |
| \`--category-item-description-color\` | Description text color | theme gray |
| \`--category-item-arrow-color\` | Arrow icon fill color | theme black/white |
| \`--category-item-disabled-color\` | Disabled text color | theme gray |
| \`--category-item-subheader-size\` | Subheader font size | \`13px\` |
| \`--category-item-margin\` | Bottom margin between items | \`20px\` |`,
      },
    },
  },
};

