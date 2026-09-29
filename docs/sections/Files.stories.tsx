import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../.storybook/decorators/PortalGate";

import { SectionList } from "./SectionList";

const meta = {
  title: "Components/Files",
  component: SectionList,
  tags: ["!autodocs"],
  // With no portal the list runs on its own in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: `The Files section: the caller's personal folder, with search, a sort order and a type filter, folders that open in place, and no create button.

### Features

- **Read-only** — the filter bar is \`FilterInput\` without \`showMainButton\`, and a row's context menu only opens it or copies its link, so nothing here writes to a portal
- **Folders open in place** — a click on a folder, or **Open** in its menu, lists it; the breadcrumb and its back arrow lead out again
- **Type filter** — Folders, Documents, Spreadsheets, Presentations, PDF; sent to the portal as \`filterType\`
- **Search and sort** — by name or last modified, both applied by the portal
- **Demo or portal** — with no portal in the API Config toolbar the list runs on in-memory data; pick one there and the same screen reads that portal's My documents through \`foldersApi.getMyFolder\`, as whoever the key belongs to

### Usage

\`\`\`tsx
const { foldersApi } = useApi();
const response = await foldersApi.getMyFolder({
  filterType: FilterType.DocumentsOnly,
  filterValue: "report",
  sortBy: "AZ",
  sortOrder: SortOrder.Ascending,
});
const { folders, files, total } = response.data.response;
\`\`\``,
      },
    },
  },
  args: { kind: "files" },
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
          "**Select folder** opens a picker whose root holds Files and nothing else. Go into it and press **Open** to show Files itself, or go further into a folder first; the list then opens there.",
      },
    },
  },
};
