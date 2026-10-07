import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { withDemoBanner } from "../../.storybook/decorators/PortalGate";

import { SectionList } from "./SectionList";

const meta = {
  title: "Components/Rooms",
  component: SectionList,
  tags: ["!autodocs"],
  // With no portal the list runs on its own in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: `The Rooms section: the active rooms the caller can see, with search, a sort order and a filter, rooms and folders that open in place, and no create button.

### Features

- **Read-only** — the filter bar is \`FilterInput\` without \`showMainButton\`, and a row's context menu only opens it or copies its link, so nothing here writes to a portal
- **Rooms open in place** — a click on a room, or **Open** in its menu, lists what is inside, where the filter becomes a file-type one; the breadcrumb and its back arrow lead out again
- **Room type filter** — Collaboration, Public, Custom, Virtual data room; sent to the portal as \`type\`
- **Owner filter** — "Me" is \`subjectId\` with \`SubjectFilter.Owner\`, the caller's own id fetched once
- **No form rooms** — as in the portal, form-filling rooms belong to the Forms section: the server leaves them out of \`SearchArea.Active\`
- **Demo or portal** — with no portal in the API Config toolbar the list runs on in-memory data; pick one there and the same screen reads that portal through \`roomsApi.getRoomsFolder\`, as whoever the key belongs to

### Usage

\`\`\`tsx
const { roomsApi } = useApi();
const response = await roomsApi.getRoomsFolder({
  searchArea: SearchArea.Active,
  type: [RoomType.PublicRoom],
  filterValue: "press",
  sortBy: "DateAndTime",
  sortOrder: SortOrder.Descending,
});
const { folders: rooms, total } = response.data.response;
\`\`\``,
      },
    },
  },
  args: { kind: "rooms" },
} satisfies Meta<typeof SectionList>;

export default meta;

type Story = StoryObj<typeof meta>;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The list loads its in-memory demo data after mounting.
const listed = (context: PlayContext, title: string) =>
  waitFor(() => expect(context.canvas.getByText(title)).toBeVisible(), {
    timeout: 3000,
  });

const opensPicker = async (context: PlayContext) => {
  await context.userEvent.click(
    await waitFor(() =>
      context.canvas.getByRole("button", { name: "Select folder" }),
    ),
  );
  await waitFor(() => expect(screen.getByTestId("selector")).toBeVisible());
};

export const Default: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;
    await listed(context, "Finance department");

    // Search narrows the list.
    await userEvent.type(canvas.getByPlaceholderText(/^Search in /), "press");
    await waitFor(() => expect(canvas.queryByText("Marketing")).toBeNull(), {
      timeout: 3000,
    });
    await expect(canvas.getByText("Press kit")).toBeVisible();
    // The filter pushes the applied query back into the field; an edit made
    // before that lands is overwritten, so let the search settle first.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await userEvent.clear(canvas.getByPlaceholderText(/^Search in /));
    await listed(context, "Marketing");

    // A folder opens in place.
    await userEvent.click(canvas.getByText("Finance department"));
    await listed(context, "Q4 budget.xlsx");
  },
};

export const WithFolderPicker: Story = {
  args: { withFolderPicker: true },
  play: async (context) => {
    await listed(context, "Finance department");
    await opensPicker(context);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Select folder** opens a picker whose root holds Rooms and nothing else. Press **Open** inside it to show the rooms list, or go into a room, or a folder in one, first; the list then opens there.",
      },
    },
  },
};
