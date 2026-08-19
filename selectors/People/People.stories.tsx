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

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import PeopleSelector from ".";
import type { PeopleSelectorProps } from "./PeopleSelector.types";
import type { TAccessRight, TSelectorItem } from "../../components/selector";

type StoryArgs = {
  // Layout
  id?: string;
  className?: string;

  // Selection
  isMultiSelect?: boolean;

  // Tabs
  withGroups?: boolean;
  isGroupsOnly?: boolean;
  withGuests?: boolean;
  isGuestsOnly?: boolean;

  // Filtering
  currentUserId?: string;
  filterUserId?: string;
  withOutCurrentAuthorizedUser?: boolean;
  excludeItems?: string[];
  disableInvitedUsers?: string[];
  disableDisabledUsers?: boolean;
  roomId?: string | number;
  targetEntityType?: "file" | "folder" | "room";
  onlyRoomMembers?: boolean;
  isAgent?: boolean;

  // Header
  withHeader?: boolean;
  headerProps?: { headerLabel: string; onCloseClick: () => void };

  // Aside
  useAside?: boolean;
  withoutBackground?: boolean;
  withBlur?: boolean;

  // Cancel button
  withCancelButton?: boolean;
  cancelButtonLabel?: string;

  // Footer checkbox
  withFooterCheckbox?: boolean;
  footerCheckboxLabel?: string;
  isChecked?: boolean;

  // Access rights
  withAccessRights?: boolean;
  accessRights?: TAccessRight[];
  selectedAccessRight?: TAccessRight;
  onAccessRightsChange?: (right: TAccessRight) => void;

  // Empty screen
  emptyScreenHeader?: string;
  emptyScreenDescription?: string;

  // Callbacks
  onSubmit: (
    items: TSelectorItem[],
    access?: TAccessRight | null,
    fileName?: string,
    isFooterCheckboxChecked?: boolean,
  ) => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/PeopleSelector",
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `PeopleSelector is a searchable, paginated selector for choosing users and groups from the DocSpace system.

### Features

- **Live API mode**: Fetches members, groups, and guests from the DocSpace Search API with infinite scroll
- **Tabs**: Toggle Members, Groups, and Guests tabs via \`withGroups\` and \`withGuests\`
- **Single / multi-select**: Controlled by \`isMultiSelect\`
- **Room scope**: Pass \`roomId\` to filter users with access to a specific room
- **Access rights**: Optional access-right dropdown via \`withAccessRights\`
- **Current user**: Highlights the current user with a "(Me)" label via \`currentUserId\`
- **Exclusions**: Hide or disable specific users via \`excludeItems\` / \`disableInvitedUsers\`
- **Header / aside / cancel**: Fully composable via \`withHeader\`, \`useAside\`, \`withCancelButton\`
- **Footer checkbox**: Optional checkbox in the footer via \`withFooterCheckbox\`

### Usage

\`\`\`tsx
import PeopleSelector from "@docspace/ui-kit/selectors/People";

// Basic single-select
<PeopleSelector
  withHeader
  headerProps={{ headerLabel: "Select Member", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log(items[0])}
/>

// Multi-select with groups, guests, and access rights
<PeopleSelector
  isMultiSelect
  withGroups
  withGuests
  withAccessRights
  accessRights={rights}
  selectedAccessRight={rights[0]}
  onAccessRightsChange={setRight}
  withHeader
  headerProps={{ headerLabel: "Add Members", onCloseClick: () => setOpen(false) }}
  currentUserId={myId}
  excludeItems={existingMemberIds}
  onSubmit={(items, access) => invite(items, access)}
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

    // Selection
    isMultiSelect: {
      control: "boolean",
      description: "Allow selecting multiple items at once",
      table: { defaultValue: { summary: "false" } },
    },

    // Tabs
    withGroups: {
      control: "boolean",
      description: "Show a Groups tab alongside the Members tab",
      table: { defaultValue: { summary: "false" } },
    },
    isGroupsOnly: {
      control: "boolean",
      description: "Show only the Groups tab (no Members tab)",
      table: { defaultValue: { summary: "false" } },
    },
    withGuests: {
      control: "boolean",
      description: "Show a Guests tab alongside the Members tab",
      table: { defaultValue: { summary: "false" } },
    },
    isGuestsOnly: {
      control: "boolean",
      description: "Show only the Guests tab",
      table: { defaultValue: { summary: "false" } },
    },

    // Filtering
    currentUserId: {
      control: "text",
      description: "ID of the current user — displayed with a '(Me)' label",
    },
    filterUserId: {
      control: "text",
      description: "ID of a user to remove from the list",
    },
    withOutCurrentAuthorizedUser: {
      control: "boolean",
      description: "Remove the current authorized user from the list entirely",
      table: { defaultValue: { summary: "false" } },
    },
    excludeItems: {
      control: "object",
      description: "Array of user IDs to exclude from results",
    },
    disableInvitedUsers: {
      control: "object",
      description: "Array of user IDs to show as disabled (already invited)",
    },
    disableDisabledUsers: {
      control: "boolean",
      description: "Disable terminated users in the list",
      table: { defaultValue: { summary: "false" } },
    },
    roomId: {
      control: "text",
      description:
        "Scope the list to users/groups with access to this room ID",
    },
    targetEntityType: {
      control: "select",
      options: ["file", "folder", "room"],
      description: "Entity type used for shared-access queries when roomId is set",
      table: { defaultValue: { summary: "room" } },
    },
    onlyRoomMembers: {
      control: "boolean",
      description: "Only show members already in the room",
      table: { defaultValue: { summary: "false" } },
    },
    isAgent: {
      control: "boolean",
      description: "Adjusts empty screen description text for AI agent context",
      table: { defaultValue: { summary: "false" } },
    },

    // Header (TSelectorHeader)
    withHeader: {
      control: "boolean",
      description: "Show the header bar with a label and close button",
      table: { defaultValue: { summary: "false" } },
    },

    // Aside (TSelectorWithAside)
    useAside: {
      control: "boolean",
      description: "Render the selector inside an Aside panel with a backdrop",
      table: { defaultValue: { summary: "false" } },
    },
    withoutBackground: {
      control: "boolean",
      description: "Remove the background overlay in Aside mode",
      table: { defaultValue: { summary: "false" } },
    },
    withBlur: {
      control: "boolean",
      description: "Apply blur effect to the Aside backdrop",
      table: { defaultValue: { summary: "false" } },
    },

    // Cancel button
    withCancelButton: {
      control: "boolean",
      description: "Show a cancel button in the footer",
      table: { defaultValue: { summary: "false" } },
    },

    // Footer checkbox
    withFooterCheckbox: {
      control: "boolean",
      description: "Show a checkbox in the footer",
      table: { defaultValue: { summary: "false" } },
    },

    // Empty screen
    emptyScreenHeader: {
      control: "text",
      description: "Custom header text for the empty state screen",
    },
    emptyScreenDescription: {
      control: "text",
      description: "Custom description text for the empty state screen",
    },

    // Callbacks
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with selected TSelectorItem array (and optional access right) on confirm",
    },
    onClose: {
      action: "onClose",
      description: "Called when the selector panel is dismissed",
    },
    onCancel: {
      action: "onCancel",
      description: "Called when the cancel button is clicked",
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div
    style={{
      width: "700px",
      height: "600px",
      border: "4px dashed #d0d5dd",
      overflow: "hidden",
      transform: "translateZ(0)",
    }}
  >
    <Toast />
    <PeopleSelector {...(props as unknown as PeopleSelectorProps)} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withHeader: true,
    headerProps: {
      headerLabel: "Select Member",
      onCloseClick: () => {},
    },
    isMultiSelect: false,
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
          "Default single-select mode. Fetches all members from the DocSpace API.",
      },
      source: {
        code: `<PeopleSelector
  withHeader
  headerProps={{ headerLabel: "Select Member", onCloseClick: () => setOpen(false) }}
  isMultiSelect={false}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const MultiSelectWithTabs: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withHeader: true,
    headerProps: {
      headerLabel: "Add Members",
      onCloseClick: () => {},
    },
    isMultiSelect: true,
    withGroups: true,
    withGuests: true,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    onSubmit: (items) => {
      toastr.success(`Selected ${items.length} item(s)`);
    },
    onCancel: () => {
      toastr.info("Cancelled");
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select mode with Members, Groups, and Guests tabs. " +
          "Includes a cancel button in the footer.",
      },
      source: {
        code: `<PeopleSelector
  isMultiSelect
  withHeader
  headerProps={{ headerLabel: "Add Members", onCloseClick: () => setOpen(false) }}
  withGroups
  withGuests
  withCancelButton
  cancelButtonLabel="Cancel"
  onSubmit={(items) => invite(items)}
  onCancel={() => setOpen(false)}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const AsideMode: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    useAside: true,
    withoutBackground: false,
    withBlur: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select Member",
      onCloseClick: () => {},
    },
    isMultiSelect: false,
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
        code: `<PeopleSelector
  useAside
  withoutBackground={false}
  withBlur={false}
  withHeader
  headerProps={{ headerLabel: "Select Member", onCloseClick: () => setOpen(false) }}
  isMultiSelect={false}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};
