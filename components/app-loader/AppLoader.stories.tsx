// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppLoader } from "./index";

const meta = {
  title: "UI/Status components/AppLoader",
  component: AppLoader,
  parameters: {
    docs: {
      description: {
        component: `A full-screen loading indicator displayed while the application is initializing. Uses the Rombs animation loader.

### Features

- **Full-Screen Overlay**: Centers the loader in the viewport with fixed positioning
- **Rombs Animation**: Uses the animated rombs (diamond) loader style
- **Dark Mode Support**: Automatically adjusts background via CSS variables
- **Zero Configuration**: No props required - renders a consistent loading state

### Usage

\`\`\`tsx
import AppLoader from "@docspace/ui-kit/components/app-loader";

<AppLoader />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AppLoader>;

type Story = StoryObj<typeof AppLoader>;

export default meta;

export const Default: Story = {
  render: () => (
    <div style={{ width: "500px", height: "500px", position: "relative" }}>
      <AppLoader />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full-screen application loader with rombs animation, rendered inside a constrained container for demonstration.",
      },
      source: {
        code: `<AppLoader />`,
      },
    },
  },
};
