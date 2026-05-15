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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionButton } from ".";

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

const meta = {
  title: "UI/Interactive elements/ActionButton",
  component: ActionButton,
  parameters: {
    docs: {
      description: {
        component: `A lightweight polymorphic action button.

### Features

- **Polymorphic**: render as \`button\`, \`a\`, or any React component via \`as\`
- **Icon support**: optional leading icon via \`icon\` prop
- **React 19**: accepts \`ref\` as a regular prop

### Usage

\`\`\`tsx
import { ActionButton } from "@docspace/ui-kit/components/action-button";

<ActionButton onClick={handleClick}>Clear filter</ActionButton>

<ActionButton icon={<FilterIcon />} onClick={handleClick}>Clear filter</ActionButton>

<ActionButton as="a" href="/about">Go to page</ActionButton>
\`\`\``,
      },
    },
  },
  argTypes: {
    icon: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Clear filter",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Clear filter",
    icon: <FilterIcon />,
  },
};

export const TextOnly: Story = {
  args: {
    children: "Text",
  },
};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "#",
    children: "Go to page",
  },
};
