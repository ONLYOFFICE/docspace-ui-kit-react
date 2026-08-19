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

import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AsideHeader } from ".";

const meta: Meta<typeof AsideHeader> = {
  title: "UI/Layout components/AsideHeader",
  component: AsideHeader,
  parameters: {
    docs: {
      description: {
        component:
          "Header component for aside panels with optional back/close buttons, custom icons, and loading states.",
      },
    },
  },
  argTypes: {
    header: {
      control: "text",
      description: "Header content - can be string or ReactNode",
    },
    isBackButton: {
      control: "boolean",
      description: "Show back button",
    },
    isCloseable: {
      control: "boolean",
      description: "Show close button",
    },
    withoutBorder: {
      control: "boolean",
      description: "Remove bottom border",
    },
    headerHeight: {
      control: "text",
      description: "Custom header height",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state",
    },
    onBackClick: {
      action: "back clicked",
      description: "Back button click handler",
    },
    onCloseClick: {
      action: "close clicked",
      description: "Close button click handler",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AsideHeader>;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: "450px", border: "1px solid #eee" }}>{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Default Header",
    isCloseable: true,
  },
};

export const WithBackButton: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header with Back Button",
    isBackButton: true,
    isCloseable: true,
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header with Icons",
    headerIcons: [
      {
        key: "settings",
        url: "/static/images/settings.react.svg",
        onClick: () => console.log("Settings clicked"),
      },
      {
        key: "info",
        url: "/static/images/info.outline.react.svg",
        onClick: () => console.log("Info clicked"),
      },
    ],
    isCloseable: true,
  },
};

export const Loading: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    isLoading: true,
    isCloseable: true,
  },
};

export const WithoutBorder: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header without Border",
    withoutBorder: true,
    isCloseable: true,
  },
};

export const CustomHeight: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Custom Height Header",
    headerHeight: "70px",
    isCloseable: true,
  },
};

export const BackAndClose: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Navigation Header",
    isBackButton: true,
    isCloseable: true,
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          width: "450px",
          border: "1px solid #eee",
          "--aside-header-color": "#004f82",
          "--aside-header-border": "#0082c9",
          "--aside-header-font-size": "18px",
          "--aside-header-height": "60px",
          "--aside-header-margin": "0 20px",
          "--aside-header-gap": "10px",
          "--aside-header-justify": "center",
          "--aside-header-title-position": "absolute",
          "--aside-header-title-inset": "0",
          "--aside-header-title-text-align": "center",
        } as CSSProperties
      }
    >
      <AsideHeader header="Customized Header" isCloseable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--aside-header-color\` | Title text color | theme-based |
| \`--aside-header-border\` | Bottom border color | theme-based |
| \`--aside-header-height\` | Header height | \`53px\` |
| \`--aside-header-font-size\` | Title font size | \`21px\` |
| \`--aside-header-margin\` | Header horizontal margins | \`0 16px\` |
| \`--aside-header-gap\` | Gap between header elements | \`6px\` |
| \`--aside-header-justify\` | \`justify-content\` of the header row | \`space-between\` |
| \`--aside-header-border-display\` | \`content\` of bottom border pseudo-element (\`""\` to hide, \`"normal"\` to show) | \`""\` |
| \`--aside-header-title-position\` | \`position\` of the title element | \`static\` |
| \`--aside-header-title-inset\` | \`inset-inline-start\` of the title | \`auto\` |
| \`--aside-header-title-transform\` | \`transform\` of the title | \`none\` |
| \`--aside-header-title-text-align\` | \`text-align\` of the title | \`start\` |`,
      },
    },
  },
};
