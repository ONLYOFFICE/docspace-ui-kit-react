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

import { RoomType } from "@onlyoffice/docspace-api-sdk";
import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

import AIAgentSelector from ".";
import type { AIAgentSelectorProps } from "./AIAgent.types";

type StoryArgs = AIAgentSelectorProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/AIAgentSelector",
  component: AIAgentSelector,
  parameters: {
    docs: {
      description: {
        component: `AIAgentSelector is a selector panel for choosing an AI agent room.

### Features

- **Live API mode**: Fetches AI agent rooms from the DocSpace API with infinite scroll
- **Init data mode**: Accepts pre-loaded items for SSR or offline scenarios via \`withInit\`
- **Security filtering**: Disable items that lack the \`UseChat\` permission via \`disableBySecurity\`
- **Exclusion list**: Skip already-selected agents via \`excludeItems\`
- **Padding control**: Toggle inner padding with \`withPadding\`
- **Callbacks**: \`onSubmit\`, \`onClose\`, and \`setIsDataReady\` hooks

### Usage

\`\`\`tsx
import AIAgentSelector from "@docspace/ui-kit/selectors/AIAgent";

// Live API mode
<AIAgentSelector
  withPadding
  onSubmit={(items) => console.log(items)}
  onClose={() => setOpen(false)}
/>

// Pre-loaded (SSR / offline) mode
<AIAgentSelector
  withInit
  initItems={items}
  initTotal={items.length}
  initHasNextPage={false}
  withPadding
  onSubmit={(items) => console.log(items)}
  onClose={() => setOpen(false)}
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
    withPadding: {
      control: "boolean",
      description: "Add inner padding to the selector panel",
      table: {
        defaultValue: { summary: "false" },
      },
    },

    // Behaviour
    disableBySecurity: {
      control: "text",
      description:
        "Message shown on items where UseChat security permission is missing",
    },
    excludeItems: {
      control: "object",
      description: "List of item ids to exclude from the selector list",
    },

    // SSR / init data
    withInit: {
      control: "boolean",
      description: "Use pre-loaded init data instead of fetching from the API",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    initTotal: {
      control: "number",
      description: "Total number of items for the pre-loaded dataset",
      if: { arg: "withInit" },
    },
    initHasNextPage: {
      control: "boolean",
      description: "Whether there is a next page in the pre-loaded dataset",
      if: { arg: "withInit" },
      table: {
        defaultValue: { summary: "false" },
      },
    },
    initSearchValue: {
      control: "text",
      description: "Initial search value for the pre-loaded dataset",
      if: { arg: "withInit" },
    },

    // Callbacks
    onSubmit: {
      action: "onSubmit",
      description: "Called with the selected TSelectorItem array on confirm",
    },
    onClose: {
      action: "onClose",
      description: "Called when the selector panel is dismissed",
    },
    setIsDataReady: {
      action: "setIsDataReady",
      description: "Called with true/false when data loading state changes",
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div style={{ width: "100%", height: "500px", overflow: "hidden", transform: "translateZ(0)" }}>
    <Toast />
    <AIAgentSelector {...props} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withPadding: true,
    disableBySecurity: undefined,
    excludeItems: [],
    onSubmit: (items) => {
      const id = items[0]?.id;
      toastr.success(`Submit with ${id}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
    setIsDataReady: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live DocSpace API to load agent rooms.",
      },
      source: {
        code: `<AIAgentSelector
  withPadding
  onSubmit={(items) => console.log("selected", items)}
  onClose={() => setOpen(false)}
  setIsDataReady={(ready) => console.log("ready", ready)}
/>`,
      },
    },
  },
};

const initItems: FolderDtoInteger[] = [
  {
    id: 1,
    title: "Test agent",
    roomType: RoomType.CustomRoom,
    shared: false,
    parentId: 0,
    filesCount: 0,
    foldersCount: 0,
    security: { UseChat: true } as FolderDtoInteger["security"],
    logo: { medium: "", large: "", small: "", color: "5299e0", original: "" },
  },
  {
    id: 2,
    title: "Support agent",
    roomType: RoomType.CustomRoom,
    shared: true,
    parentId: 0,
    filesCount: 3,
    foldersCount: 0,
    security: { UseChat: true } as FolderDtoInteger["security"],
    logo: { medium: "", large: "", small: "", color: "2db482", original: "" },
  },
  {
    id: 3,
    title: "Restricted agent",
    roomType: RoomType.CustomRoom,
    shared: false,
    parentId: 0,
    filesCount: 0,
    foldersCount: 0,
    security: { UseChat: false } as FolderDtoInteger["security"],
    logo: { medium: "", large: "", small: "", color: "f97a0b", original: "" },
  },
];

export const WithInit: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withPadding: true,
    withInit: true,
    initItems,
    initTotal: 3,
    initHasNextPage: false,
    initSearchValue: "",
    excludeItems: [],
    onSubmit: (items) => {
      const id = items[0]?.id;
      toastr.success(`Submit with ${id}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
    setIsDataReady: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pre-loaded mode using `withInit`. No API requests are made — items are passed directly. " +
          "The third item has `UseChat: false` and will appear disabled when `disableBySecurity` is set.",
      },
      source: {
        code: `const initItems = [
  {
    id: 1,
    title: "Test agent",
    roomType: RoomType.CustomRoom,
    shared: false,
    parentId: 0,
    filesCount: 0,
    foldersCount: 0,
    security: { UseChat: true },
    logo: { medium: "", large: "", small: "", color: "5299e0", original: "" },
  },
  {
    id: 2,
    title: "Support agent",
    roomType: RoomType.CustomRoom,
    shared: true,
    parentId: 0,
    filesCount: 3,
    foldersCount: 0,
    security: { UseChat: true },
    logo: { medium: "", large: "", small: "", color: "2db482", original: "" },
  },
  {
    id: 3,
    title: "Restricted agent",
    roomType: RoomType.CustomRoom,
    shared: false,
    parentId: 0,
    filesCount: 0,
    foldersCount: 0,
    security: { UseChat: false },
    logo: { medium: "", large: "", small: "", color: "f97a0b", original: "" },
  },
];

<AIAgentSelector
  withInit
  initItems={initItems}
  initTotal={3}
  initHasNextPage={false}
  initSearchValue=""
  withPadding
  excludeItems={[]}
  onSubmit={(items) => console.log("selected", items)}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};
