import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { withDemoBanner } from "../../.storybook/decorators/PortalGate";

import { SectionList } from "./SectionList";

const meta = {
  title: "Components/Forms",
  component: SectionList,
  tags: ["!autodocs"],
  // With no portal the list runs on its own in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: `The Forms section: the form-filling rooms the caller can see, with search, a sort order and a filter, rooms that open in place, and no create button.

### Features

- **Read-only** — the filter bar is \`FilterInput\` without \`showMainButton\`, and a row's context menu only opens it or copies its link, so nothing here writes to a portal
- **Rooms open in place** — a form room lists its forms and its Complete / In process folders, with a file-type filter; the breadcrumb and its back arrow lead out again
- **Owner filter** — "Me" is \`subjectId\` with \`SubjectFilter.Owner\`. There is no room-type group: the section holds one type only, which is how the portal's own filter behaves there
- **Scoped by the server** — the list is \`getRoomsFolder\` with \`searchArea=Forms\`, which returns form-filling rooms and nothing else. The SDK's \`SearchArea\` has no \`Forms\` member yet; the server reads the area by name, so the story passes the string. A portal that predates the Forms section does not know the name, and the list shows its error
- **Demo or portal** — with no portal in the API Config toolbar the list runs on in-memory data; pick one there and the same screen reads that portal, as whoever the key belongs to

### Usage

\`\`\`tsx
const { roomsApi } = useApi();
const response = await roomsApi.getRoomsFolder({
  // Not in the SDK's SearchArea yet; the server takes the name.
  searchArea: "Forms" as unknown as SearchArea,
  filterValue: "survey",
  sortBy: "DateAndTime",
  sortOrder: SortOrder.Descending,
});
const { folders: formRooms, total } = response.data.response;
\`\`\``,
      },
    },
  },
  args: { kind: "forms" },
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
    await listed(context, "Job applications");

    // Search narrows the list.
    await userEvent.type(canvas.getByPlaceholderText(/^Search in /), "survey");
    await waitFor(
      () => expect(canvas.queryByText("Expense reports")).toBeNull(),
      { timeout: 3000 },
    );
    await expect(canvas.getByText("Customer survey")).toBeVisible();
    // The filter pushes the applied query back into the field; an edit made
    // before that lands is overwritten, so let the search settle first.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await userEvent.clear(canvas.getByPlaceholderText(/^Search in /));
    await listed(context, "Expense reports");

    // A folder opens in place.
    await userEvent.click(canvas.getByText("Job applications"));
    await listed(context, "In process");
  },
};

export const WithFolderPicker: Story = {
  args: { withFolderPicker: true },
  play: async (context) => {
    await listed(context, "Job applications");
    await opensPicker(context);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Select folder** opens a picker whose root holds Forms and nothing else. Press **Open** inside it to show the form rooms, or go into a room, or its Complete or In process folder, first; the list then opens there.",
      },
    },
  },
};
