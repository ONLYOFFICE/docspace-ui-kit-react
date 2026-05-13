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
