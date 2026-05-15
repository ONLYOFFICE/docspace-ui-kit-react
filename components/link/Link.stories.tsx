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

import { Link, LinkType, LinkTarget } from ".";

const meta = {
  title: "UI/Navigation/Link",
  component: Link,
  parameters: {
    docs: {
      description: {
        component: `Link component with two types: page links for navigation and action links for triggering behavior.

### Features

- **Two Types**: \`page\` for navigation links with href, \`action\` for click-triggered behavior
- **Bold Text**: Emphasize links with bold font weight
- **Hover States**: Built-in hover effects with manual override via \`isHovered\`
- **Semitransparent**: Reduced opacity for "pending" status indicators
- **Text Overflow**: Truncate long link text with ellipsis
- **User Selection**: Control whether link text can be selected
- **Tooltip Support**: Built-in tooltip via the \`withTooltip\` HOC

### Accessibility

- \`aria-label\`: Automatically set from children text, overridable via \`ariaLabel\` prop

### Usage

\`\`\`tsx
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";

// Page link
<Link type={LinkType.page} href="https://example.com" target={LinkTarget.blank}>
  Visit Example
</Link>

// Action link
<Link type={LinkType.action} onClick={handleClick}>
  Click to filter
</Link>

// Bold link
<Link type={LinkType.page} href="/profile" isBold>
  View Profile
</Link>
\`\`\``,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["page", "action"],
      description: "Link type: page for navigation, action for click handlers",
      table: {
        defaultValue: { summary: "page" },
      },
    },
    href: {
      control: "text",
      description: "URL for page-type links",
    },
    fontSize: {
      control: "text",
      description: "Font size",
    },
    fontWeight: {
      control: "text",
      description: "Font weight",
    },
    color: {
      control: "color",
      description: "Link text color",
    },
    isBold: {
      control: "boolean",
      description: "Bold font weight",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description: "Force hover state (for demo purposes)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description: "Apply 50% opacity for pending status",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description: "Truncate overflowing text with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Disable hover effects",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableUserSelect: {
      control: "boolean",
      description: "Allow text selection",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof Link>;

type Story = StoryObj<ComponentProps<typeof Link>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Link {...args}>Simple link</Link>,
  args: {
    href: "https://github.com",
    type: LinkType.page,
    fontSize: "13px",
    target: LinkTarget.blank,
  },
};

const PageLinksTemplate = () => {
  return (
    <Wrapper>
      <Link type={LinkType.page} href="https://github.com" isBold>
        Bold page link
      </Link>
      <Link type={LinkType.page} href="https://github.com">
        Regular page link
      </Link>
      <Link type={LinkType.page} href="https://github.com" isHovered>
        Hovered page link
      </Link>
      <Link type={LinkType.page} href="https://github.com" isSemitransparent>
        Semitransparent page link
      </Link>
    </Wrapper>
  );
};

const ActionLinksTemplate = () => {
  return (
    <Wrapper>
      <Link type={LinkType.action} onClick={() => {}} isBold>
        Bold action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}}>
        Regular action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}} isHovered>
        Hovered action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}} isSemitransparent>
        Semitransparent action link
      </Link>
    </Wrapper>
  );
};

const AllVariantsTemplate = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <strong>Page links:</strong>
        <Wrapper>
          <Link type={LinkType.page} href="https://github.com" isBold>
            Bold page link
          </Link>
          <Link type={LinkType.page} href="https://github.com">
            Regular page link
          </Link>
          <Link type={LinkType.page} href="https://github.com" isHovered>
            Hovered page link
          </Link>
          <Link
            type={LinkType.page}
            href="https://github.com"
            isSemitransparent
          >
            Semitransparent page link
          </Link>
        </Wrapper>
      </div>
      <div>
        <strong>Action links:</strong>
        <Wrapper>
          <Link type={LinkType.action} onClick={() => {}} isBold>
            Bold action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}}>
            Regular action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}} isHovered>
            Hovered action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}} isSemitransparent>
            Semitransparent action link
          </Link>
        </Wrapper>
      </div>
    </div>
  );
};

const HoveredTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://github.com" isHovered>
      Hovered link
    </Link>
  );
};

const SemitransparentTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://github.com" isSemitransparent>
      Semitransparent link
    </Link>
  );
};

const TextOverflowTemplate = () => {
  return (
    <div style={{ width: 200 }}>
      <Link type={LinkType.page} href="https://github.com" isTextOverflow>
        This is a very long link that should demonstrate text overflow behavior
      </Link>
    </div>
  );
};

const NoHoverTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://github.com" noHover>
      No hover effect link
    </Link>
  );
};

export const PageLinks: Story = {
  render: () => <PageLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Page links navigate to other pages. They support bold, hovered, and semitransparent states.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://github.com" isBold>Bold page link</Link>
<Link type={LinkType.page} href="https://github.com">Regular page link</Link>
<Link type={LinkType.page} href="https://github.com" isHovered>Hovered page link</Link>
<Link type={LinkType.page} href="https://github.com" isSemitransparent>Semitransparent page link</Link>`,
      },
    },
  },
};

export const ActionLinks: Story = {
  render: () => <ActionLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Action links trigger behavior on click instead of navigating. Used for filtering, opening dropdowns, etc.",
      },
      source: {
        code: `<Link type={LinkType.action} onClick={handleClick} isBold>Bold action link</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular action link</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered action link</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent action link</Link>`,
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of all page and action link variants.",
      },
      source: {
        code: `// Page links
<Link type={LinkType.page} href="https://github.com" isBold>Bold</Link>
<Link type={LinkType.page} href="https://github.com">Regular</Link>
<Link type={LinkType.page} href="https://github.com" isHovered>Hovered</Link>
<Link type={LinkType.page} href="https://github.com" isSemitransparent>Semitransparent</Link>

// Action links
<Link type={LinkType.action} onClick={handleClick} isBold>Bold</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular</Link>`,
      },
    },
  },
};

export const HoveredState: Story = {
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with forced hover state for demonstration purposes.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://github.com" isHovered>Hovered link</Link>`,
      },
    },
  },
};

export const SemitransparentState: Story = {
  render: () => <SemitransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Semitransparent link with reduced opacity, typically used for users with pending status.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://github.com" isSemitransparent>Semitransparent link</Link>`,
      },
    },
  },
};

export const WithTextOverflow: Story = {
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with text overflow truncation when it exceeds the container width.",
      },
      source: {
        code: `<div style={{ width: 200 }}>
  <Link type={LinkType.page} href="https://github.com" isTextOverflow>
    Very long link text...
  </Link>
</div>`,
      },
    },
  },
};

export const NoHoverEffect: Story = {
  render: () => <NoHoverTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with hover effects disabled via the noHover prop.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://github.com" noHover>No hover effect link</Link>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--link-color": "#9C27B0",
          "--link-hover-text-decoration": "none",
        } as CSSProperties
      }
    >
      <Link type={LinkType.page} href="https://github.com">
        Custom color link
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

\`\`\`css
--link-color                  /* link text color */
--link-text-decoration        /* text decoration (default none) */
--link-cursor                 /* cursor style */
--link-hover-text-decoration  /* text decoration on hover (default underline) */
\`\`\``,
      },
      source: {
        code: `<div
  style={{
    "--link-color": "#9C27B0",
    "--link-hover-text-decoration": "none",
  }}
>
  <Link type={LinkType.page} href="https://github.com">
    Custom color link
  </Link>
</div>`,
      },
    },
  },
};
