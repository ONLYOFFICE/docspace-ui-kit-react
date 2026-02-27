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

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import GroupsSelector from ".";
import type { GroupsSelectorProps } from "./GroupsSelector.types";

type StoryArgs = GroupsSelectorProps;

const meta: Meta<StoryArgs> = {
  title: "Selectors/GroupsSelector",
  component: GroupsSelector,
  parameters: {
    docs: {
      description: {
        component: `GroupsSelector is a searchable, paginated selector panel for choosing a user group.

### Features

- **Live API mode**: Fetches groups from the DocSpace Groups API in batches of 100 with infinite scroll
- **Single-select**: The user can pick exactly one group at a time
- **Search**: Filters groups by name; resets and re-fetches the list automatically
- **Header**: Optional configurable header with a close button via \`withHeader\` / \`headerProps\`
- **Aside mode**: Can render inside an Aside panel with backdrop and optional blur via \`useAside\`
- **Callbacks**: \`onSubmit\` and \`onClose\` hooks

### Usage

\`\`\`tsx
import GroupsSelector from "@docspace/ui-kit/selectors/Groups";

// Inline mode
<GroupsSelector
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log(items[0])}
/>

// Aside panel mode
<GroupsSelector
  useAside
  onClose={() => setOpen(false)}
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log(items[0])}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    // Layout
    id: {
      control: "text",
      description: "HTML id attribute for the root element",
    },
    className: {
      control: "text",
      description: "Additional CSS class name for the root element",
    },

    // Header (TSelectorHeader)
    withHeader: {
      control: "boolean",
      description: "Show the header bar with a label and close button",
      table: {
        defaultValue: { summary: "false" },
      },
    },

    // Aside (TSelectorWithAside)
    useAside: {
      control: "boolean",
      description: "Render the selector inside an Aside panel with a backdrop",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description: "Remove the background overlay when rendered in Aside mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBlur: {
      control: "boolean",
      description: "Apply a blur effect to the Aside backdrop",
      table: {
        defaultValue: { summary: "false" },
      },
    },

    // Callbacks
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with the selected TSelectorItem array when the user confirms their choice",
    },
    onClose: {
      action: "onClose",
      description: "Called when the selector panel is dismissed",
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div
    style={{
      width: "100%",
      height: "500px",
      overflow: "hidden",
      transform: "translateZ(0)",
    }}
  >
    <Toast />
    <GroupsSelector {...props} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withHeader: true,
    headerProps: {
      headerLabel: "Select Group",
      onCloseClick: () => {},
    },
    onSubmit: (items) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live DocSpace API. Groups are fetched and filtered via the search field.",
      },
      source: {
        code: `<GroupsSelector
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const AsideMode: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    useAside: true,
    withoutBackground: false,
    withBlur: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select Group",
      onCloseClick: () => {},
    },
    onSubmit: (items) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Renders the selector inside an Aside panel with a backdrop overlay. " +
          "Use `withBlur` to apply a blur effect and `withoutBackground` to remove the overlay.",
      },
      source: {
        code: `<GroupsSelector
  useAside
  withoutBackground={false}
  withBlur={false}
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};
