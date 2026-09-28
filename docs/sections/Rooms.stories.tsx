import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionList } from "./SectionList";

const meta = {
  title: "Components/Rooms",
  component: SectionList,
  tags: ["!autodocs"],
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

export const Default: Story = {};

export const WithFolderPicker: Story = {
  args: { withFolderPicker: true },
  parameters: {
    docs: {
      description: {
        story:
          "**Select folder** opens a picker whose root holds Rooms and nothing else. Press **Open** inside it to show the rooms list, or go into a room, or a folder in one, first; the list then opens there.",
      },
    },
  },
};
