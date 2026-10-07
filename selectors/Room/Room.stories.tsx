import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";
import { RoomType, SearchArea } from "@onlyoffice/docspace-api-sdk";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import RoomSelector from ".";
import type { RoomSelectorProps } from "./RoomSelector.types";
import type { TSelectorItem } from "../../components/selector";

import { withPortalGate } from "../../.storybook/decorators/PortalGate";

type StoryArgs = {
  // Layout
  id?: string;
  className?: string;

  // Selection
  isMultiSelect: boolean;

  // Filtering
  roomType?: RoomType | RoomType[];
  searchArea?: SearchArea | string;
  excludeItems?: (number | string | undefined)[];
  disableThirdParty?: boolean;

  // Header
  withHeader?: boolean;
  headerProps?: { headerLabel: string; onCloseClick: () => void };

  // Search
  withSearch?: boolean;

  // Aside
  useAside?: boolean;
  withoutBackground?: boolean;
  withBlur?: boolean;

  // Cancel button
  withCancelButton?: boolean;
  cancelButtonLabel?: string;

  // Padding
  withPadding?: boolean;

  // Create
  withCreate?: boolean;
  createDefineRoomLabel?: string;
  createDefineRoomType?: RoomType;

  // Sort & submit
  forceIsMultiSelect?: boolean;
  sortSelectedFirst?: boolean;
  disableSubmitUntilChanged?: boolean;
  submitButtonLabel?: string;

  // Empty screen
  emptyScreenHeader?: string;
  emptyScreenDescription?: string;

  // Callbacks
  onSubmit: (items: TSelectorItem[]) => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/RoomSelector",
  decorators: [withPortalGate("Room selector")],
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `RoomSelector is a searchable, paginated selector for choosing rooms from the ONLYOFFICE Apps system.

### Features

- **Live API mode**: Fetches rooms from the ONLYOFFICE Apps API with infinite scroll
- **Single / multi-select**: Controlled by \`isMultiSelect\`
- **Room type filter**: Pass \`roomType\` to restrict the list to specific room types
- **Search**: Enable with \`withSearch\`
- **Third-party rooms**: Optionally hide third-party storage rooms via \`disableThirdParty\`
- **Room creation**: Show a create-room button via \`withCreate\` + \`createDefineRoomLabel\`
- **Pre-selection**: Pass \`selectedItems\` with \`sortSelectedFirst\` to float already-selected rooms to the top
- **Header / aside / cancel**: Fully composable via \`withHeader\`, \`useAside\`, \`withCancelButton\`
- **SSR support**: Pre-populate with server-fetched data via \`withInit\` + \`initItems\`

### Usage

\`\`\`tsx
import RoomSelector from "@onlyoffice/apps-ui-kit/selectors/Room";

// Basic single-select
<RoomSelector
  isMultiSelect={false}
  withSearch
  withHeader
  headerProps={{ headerLabel: "Select Room", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log(items[0])}
/>

// Multi-select scoped to custom rooms
<RoomSelector
  isMultiSelect
  withSearch
  roomType={RoomType.CustomRoom}
  selectedItems={currentRooms}
  sortSelectedFirst
  disableSubmitUntilChanged
  withHeader
  headerProps={{ headerLabel: "Add to Rooms", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => save(items)}
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
      description: "Allow selecting multiple rooms at once",
      table: { defaultValue: { summary: "false" } },
    },

    // Filtering
    roomType: {
      control: "select",
      options: [
        undefined,
        RoomType.CustomRoom,
        RoomType.EditingRoom,
        RoomType.PublicRoom,
        RoomType.VirtualDataRoom,
      ],
      description: "Filter rooms by type. Omit to show all room types.",
    },
    searchArea: {
      control: "select",
      options: [
        undefined,
        SearchArea.Active,
        SearchArea.Archive,
        SearchArea.Templates,
      ],
      description: "Search scope — Active rooms, Archive, or Templates",
    },
    excludeItems: {
      control: "object",
      description: "Array of room IDs to exclude from the list",
    },
    disableThirdParty: {
      control: "boolean",
      description: "Hide rooms backed by third-party storage",
      table: { defaultValue: { summary: "false" } },
    },

    // Header
    withHeader: {
      control: "boolean",
      description: "Show the header bar with a label and close button",
      table: { defaultValue: { summary: "false" } },
    },

    // Search
    withSearch: {
      control: "boolean",
      description: "Show a search input above the room list",
      table: { defaultValue: { summary: "false" } },
    },

    // Aside
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
    cancelButtonLabel: {
      control: "text",
      description: "Label for the cancel button",
    },

    // Padding
    withPadding: {
      control: "boolean",
      description: "Add padding inside the selector",
      table: { defaultValue: { summary: "false" } },
    },

    // Create
    withCreate: {
      control: "boolean",
      description: "Show a create-room button at the top of the list",
      table: { defaultValue: { summary: "false" } },
    },
    createDefineRoomLabel: {
      control: "text",
      description: "Label for the create-room button (requires withCreate)",
    },
    createDefineRoomType: {
      control: "select",
      options: [
        undefined,
        RoomType.CustomRoom,
        RoomType.EditingRoom,
        RoomType.PublicRoom,
        RoomType.VirtualDataRoom,
      ],
      description: "Room type to pre-fill on create (requires withCreate)",
    },

    // Sort & submit
    forceIsMultiSelect: {
      control: "boolean",
      description:
        "Force multi-select UI behavior regardless of the isMultiSelect prop",
      table: { defaultValue: { summary: "false" } },
    },
    sortSelectedFirst: {
      control: "boolean",
      description: "Float pre-selected rooms to the top of the list",
      table: { defaultValue: { summary: "false" } },
    },
    disableSubmitUntilChanged: {
      control: "boolean",
      description:
        "Keep submit disabled until the selection differs from the initial state",
      table: { defaultValue: { summary: "false" } },
    },
    submitButtonLabel: {
      control: "text",
      description: "Custom label for the submit button",
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
        "Called with the array of selected TSelectorItem(s) on confirm",
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

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const row = (label: string) => {
  const found = Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid^="selector-item-"]'),
  ).find((item) => item.textContent?.includes(label));
  if (!found) throw new Error(`No row labelled ${label}`);
  return found;
};

const shown = (label: string) =>
  waitFor(() => expect(row(label)).toBeVisible(), { timeout: 3000 });

const submitted = (args: StoryArgs) =>
  (
    (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0] as TSelectorItem[]
  ).map((item) => item.label);

// Picking a room and confirming hands it to onSubmit.
const picks = async (args: StoryArgs, label: string) => {
  await userEvent.click(row(label));
  await userEvent.click(screen.getByTestId("selector_submit_button"));
  await expect(submitted(args)).toEqual([label]);
};

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
    <RoomSelector {...(props as unknown as RoomSelectorProps)} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    await shown("Contracts 2026");

    // The demo portal filters the rooms by the search.
    const search = screen
      .getByTestId("selector_search_input")
      .querySelector("input") as HTMLInputElement;
    await userEvent.type(search, "press");
    await waitFor(
      () => expect(screen.queryByText("Contracts 2026")).toBeNull(),
      { timeout: 3000 },
    );
    await expect(row("Press kit")).toBeVisible();
    await userEvent.clear(search);
    await shown("Contracts 2026");

    await picks(args, "Press kit");
    await userEvent.click(screen.getByTestId("aside_header_close_icon_button"));
    await expect(args.headerProps?.onCloseClick).toHaveBeenCalledTimes(1);
  },
  args: {
    withHeader: true,
    headerProps: {
      headerLabel: "Select Room",
      onCloseClick: fn(),
    },
    withSearch: true,
    isMultiSelect: false,
    onSubmit: fn((items: TSelectorItem[]) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default single-select mode with search. Fetches all rooms from the ONLYOFFICE Apps API.",
      },
      source: {
        code: `<RoomSelector
  isMultiSelect={false}
  withSearch
  withHeader
  headerProps={{ headerLabel: "Select Room", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const MultiSelect: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    await shown("Contracts 2026");
    await userEvent.click(row("Contracts 2026"));
    await userEvent.click(row("Press kit"));
    await userEvent.click(screen.getByTestId("selector_submit_button"));
    await expect(submitted(args)).toEqual(["Contracts 2026", "Press kit"]);

    await userEvent.click(screen.getByTestId("selector_cancel_button"));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
  args: {
    withHeader: true,
    headerProps: {
      headerLabel: "Add to Rooms",
      onCloseClick: fn(),
    },
    withSearch: true,
    isMultiSelect: true,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    forceIsMultiSelect: true,
    onSubmit: fn((items: TSelectorItem[]) => {
      toastr.success(`Selected ${items.length} room(s)`);
    }),
    onCancel: fn(() => {
      toastr.info("Cancelled");
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select mode with a cancel button in the footer. " +
          "Select multiple rooms and confirm with the submit button.",
      },
      source: {
        code: `<RoomSelector
  isMultiSelect
  withSearch
  withHeader
  headerProps={{ headerLabel: "Add to Rooms", onCloseClick: () => setOpen(false) }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onSubmit={(items) => save(items)}
  onCancel={() => setOpen(false)}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const FilteredByRoomType: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    // Only the custom rooms are asked for.
    await shown("Contracts 2026");
    await expect(row("Sales proposals")).toBeVisible();
    await expect(row("Board meetings")).toBeVisible();
    await expect(screen.queryByText("Press kit")).toBeNull();
    await picks(args, "Board meetings");
  },
  args: {
    withHeader: true,
    headerProps: {
      headerLabel: "Select Custom Room",
      onCloseClick: fn(),
    },
    withSearch: true,
    isMultiSelect: false,
    roomType: RoomType.CustomRoom,
    onSubmit: fn((items: TSelectorItem[]) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Filtered to show only Custom rooms via the `roomType` prop. " +
          "Change `roomType` in the controls panel to filter by other room types.",
      },
      source: {
        code: `<RoomSelector
  isMultiSelect={false}
  withSearch
  withHeader
  headerProps={{ headerLabel: "Select Custom Room", onCloseClick: () => setOpen(false) }}
  roomType={RoomType.CustomRoom}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const AsideMode: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    await shown("Contracts 2026");
    await picks(args, "Sales proposals");
  },
  args: {
    useAside: true,
    withoutBackground: false,
    withBlur: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select Room",
      onCloseClick: fn(),
    },
    withSearch: true,
    isMultiSelect: false,
    onSubmit: fn((items: TSelectorItem[]) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Renders the selector inside an Aside panel with a backdrop overlay. " +
          "Use `withBlur` to apply a blur effect and `withoutBackground` to remove the overlay.",
      },
      source: {
        code: `<RoomSelector
  isMultiSelect={false}
  withSearch
  useAside
  withoutBackground={false}
  withBlur={false}
  withHeader
  headerProps={{ headerLabel: "Select Room", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};
