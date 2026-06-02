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

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { CollapsibleCard } from "./CollapsibleCard";

const meta = {
  title: "UI/Data display/CollapsibleCard",
  component: CollapsibleCard,
  parameters: {
    docs: {
      description: {
        component: `Card with a clickable header that expands/collapses the body.

### Features

- **title** / **description**: header content (rendered inline with the chevron)
- **children**: body content shown when expanded
- Controlled via \`isOpen\` + \`onToggle\`, or uncontrolled via \`defaultOpen\`
- Chevron rotates 180° on open (no body animation by default)

### Usage

\`\`\`tsx
import { CollapsibleCard } from "@docspace/ui-kit/components/collapsible-card";

<CollapsibleCard
  title="Already using another platform?"
  description="Plug ONLYOFFICE into any ecosystem — no custom code, no migration."
  defaultOpen
>
  {/* any content */}
</CollapsibleCard>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof CollapsibleCard>;

type Story = StoryObj<ComponentProps<typeof CollapsibleCard>>;

export default meta;

export const Collapsed: Story = {
  args: {
    title: "Lorem ipsum dolor sit amet?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    children: (
      <div style={{ padding: 16 }}>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
      </div>
    ),
  },
};

export const Expanded: Story = {
  args: {
    ...Collapsed.args,
    defaultOpen: true,
  },
};
