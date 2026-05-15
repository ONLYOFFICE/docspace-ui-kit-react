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

import Error404 from "./Error404";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/Error404",
  tags: ["!autodocs"],
  component: Error404,
  parameters: {
    docs: {
      description: {
        component: `Not Found error page (404). Displayed when the requested page does not exist.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Navigation Guidance**: Helps users find their way back to valid pages

### Usage

\`\`\`tsx
import Error404 from "@docspace/ui-kit/errors/Error404";

<Error404 />
\`\`\``,
      },
    },
  },
  decorators: [
    (Story) => {
      setupErrorI18n();
      return <Story />;
    },
  ],
} satisfies Meta<typeof Error404>;

type Story = StoryObj<ComponentProps<typeof Error404>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default 404 not found error page with standard messaging.",
      },
      source: {
        code: `<Error404 />`,
      },
    },
  },
};
