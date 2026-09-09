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
  tags: ["!autodocs"],
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
import AIAgentSelector from "@onlyoffice/apps-ui-kit/selectors/AIAgent";

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
  <div style={{ width: "700px", height: "600px", border: "4px dashed #d0d5dd", overflow: "hidden", transform: "translateZ(0)" }}>
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
  tags: ["!autodocs"],
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
