import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

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
    await listed(context, "Notes.docx");

    // Search narrows the list.
    await userEvent.type(canvas.getByPlaceholderText(/^Search in /), "budget");
    await waitFor(() => expect(canvas.queryByText("Notes.docx")).toBeNull(), {
      timeout: 3000,
    });
    await expect(canvas.getByText("Household budget.xlsx")).toBeVisible();
    // The filter pushes the applied query back into the field; an edit made
    // before that lands is overwritten, so let the search settle first.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await userEvent.clear(canvas.getByPlaceholderText(/^Search in /));
    await listed(context, "Notes.docx");

    // A folder opens in place.
    await userEvent.click(canvas.getByText("Templates"));
    await listed(context, "Letter.docx");
  },
};

export const WithFolderPicker: Story = {
  args: { withFolderPicker: true },
  play: async (context) => {
    await listed(context, "Notes.docx");
    await opensPicker(context);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Select folder** opens a picker whose root holds Files and nothing else. Go into it and press **Open** to show Files itself, or go further into a folder first; the list then opens there.",
      },
    },
  },
};
