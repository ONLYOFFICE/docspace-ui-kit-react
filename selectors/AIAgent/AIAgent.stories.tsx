import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import { RoomType } from "@onlyoffice/docspace-api-sdk";
import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

import AIAgentSelector from ".";
import type { AIAgentSelectorProps } from "./AIAgent.types";
import type { TSelectorItem } from "../../components/selector";

import { withPortalGate } from "../../.storybook/decorators/PortalGate";

type StoryArgs = AIAgentSelectorProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/AIAgentSelector",
  component: AIAgentSelector,
  decorators: [withPortalGate("AI agent selector")],
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `AIAgentSelector is a selector panel for choosing an AI agent room.

### Features

- **Live API mode**: Fetches AI agent rooms from the ONLYOFFICE Apps API with infinite scroll
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

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const rows = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid^="selector-item-"]'),
  );

const row = (label: string) => {
  const found = rows().find((item) => item.textContent?.includes(label));
  if (!found) throw new Error(`No row labelled ${label}`);
  return found;
};

const submit = () => screen.getByTestId("selector_submit_button");

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
    <AIAgentSelector {...props} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    // The demo portal's agents, with nothing picked yet.
    await waitFor(() => expect(row("Contract reviewer")).toBeVisible());
    await expect(screen.getByText("Choose an AI agent")).toBeVisible();
    await expect(submit()).toBeDisabled();
    await waitFor(() => expect(args.setIsDataReady).toHaveBeenCalledWith(true));

    // An agent without the chat right cannot be picked.
    await userEvent.click(row("Board minutes (restricted)"));
    await expect(submit()).toBeDisabled();

    // Picking one and pressing Select hands it over.
    await userEvent.click(row("Sales assistant"));
    await expect(submit()).toBeEnabled();
    await userEvent.click(submit());
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    const [items] = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0] as [
      TSelectorItem[],
    ];
    await expect(items[0].label).toBe("Sales assistant");

    // Cancel and the header's close both dismiss it.
    await userEvent.click(screen.getByTestId("selector_cancel_button"));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByTestId("aside_header_close_icon_button"));
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
  args: {
    withPadding: true,
    disableBySecurity: undefined,
    excludeItems: [],
    onSubmit: fn((items: TSelectorItem[]) => {
      const id = items[0]?.id;
      toastr.success(`Submit with ${id}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
    setIsDataReady: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live ONLYOFFICE Apps API to load agent rooms.",
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
  play: async ({ args }: PlayContext) => {
    // The items passed in are the list: the first page is not fetched, so the
    // demo portal's agents never replace them.
    await waitFor(() => expect(row("Test agent")).toBeVisible());
    await expect(row("Support agent")).toBeVisible();
    await expect(row("Restricted agent")).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await expect(screen.queryByText("Contract reviewer")).toBeNull();
    await expect(rows()).toHaveLength(3);

    await userEvent.click(row("Support agent"));
    await expect(submit()).toBeEnabled();
    await userEvent.click(submit());
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    const [items] = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0] as [
      TSelectorItem[],
    ];
    await expect(items[0].label).toBe("Support agent");

    // A search is a new question, so it does go to the portal.
    const search = screen
      .getByTestId("selector_search_input")
      .querySelector("input") as HTMLInputElement;
    await userEvent.type(search, "contract");
    await waitFor(() => expect(row("Contract reviewer")).toBeVisible(), {
      timeout: 5000,
    });
    await expect(screen.queryByText("Test agent")).toBeNull();
  },
  args: {
    withPadding: true,
    withInit: true,
    initItems,
    initTotal: 3,
    initHasNextPage: false,
    initSearchValue: "",
    excludeItems: [],
    onSubmit: fn((items: TSelectorItem[]) => {
      const id = items[0]?.id;
      toastr.success(`Submit with ${id}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
    setIsDataReady: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pre-loaded mode using `withInit`. The first page is not requested: `initItems` is the list until the reader searches, " +
          "and a search asks the portal as usual. " +
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
