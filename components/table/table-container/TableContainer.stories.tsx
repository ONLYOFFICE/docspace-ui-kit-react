import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import type { TableContainerProps } from "../Table.types";

import { useRef } from "react";
import FileCells, { storyFiles } from "../../../.storybook/utils/FileCells";

import { TableContainer } from "./TableContainer";
import { Scrollbar } from "../../scrollbar";
import { TableRow } from "../table-row";
import { TableHeader } from "../table-header";
import { SortByFieldName } from "../../../enums";
import { TableBody } from "../table-body";

const COLUMN_STORAGE_NAME = "storybook-table-container-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-container-info-panel-storage";

const onColumnSort = fn();
const onColumnToggle = fn();

const mockColumns = [
  {
    key: "Name",
    title: "Name",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: onColumnToggle,
    onClick: onColumnSort,
  },
  {
    key: "Type",
    title: "Type",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: onColumnToggle,
    onClick: onColumnSort,
  },
  {
    key: "Tags",
    title: "Tags",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: onColumnToggle,
    onClick: onColumnSort,
  },
];

const createTableRows = (count: number) =>
  storyFiles.slice(0, count).map((file) => (
    <TableRow key={file.name}>
      <FileCells file={file} />
    </TableRow>
  ));

const TableContainerWrapper = (props: TableContainerProps) => {
  const { useReactWindow } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer {...props} forwardedRef={containerRef}>
      <TableHeader
        containerRef={containerRef}
        columns={mockColumns}
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        useReactWindow={useReactWindow}
        showSettings
        sortingVisible
        sorted
      />
      <TableBody
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        fetchMoreFiles={async () => {}}
        filesLength={10}
        hasMoreFiles={false}
        itemCount={10}
        itemHeight={50}
        useReactWindow={useReactWindow}
      >
        {createTableRows(10)}
      </TableBody>
    </TableContainer>
  );
};

const meta = {
  title: "UI/Table/TableContainer",
  component: TableContainerWrapper,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `TableContainer is the outer element of a table, the grid that the header, the group menu and the rows are laid out in.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    useReactWindow: {
      control: "boolean",
      description:
        "Whether the body inside is virtualised. The container then becomes a full-height block instead of the grid.",
    },
    noSelect: {
      control: "boolean",
      description: "Stops the user selecting text anywhere inside the table.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Applied to the container.",
    },
    forwardedRef: {
      control: false,
      description:
        "Ref of the container element; pass the same ref to the header as `containerRef`.",
    },
    children: {
      control: false,
      description: "The header, the group menu and the body.",
    },
  },
  decorators: [
    (Story) => {
      return (
        <div>
          <div style={{ position: "relative" }}>
            <Scrollbar
              id="sectionScroll"
              style={{ height: "400px" }}
              autoHide={false}
            >
              <div style={{ marginTop: "25px" }}>
                <Story />
              </div>
            </Scrollbar>
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableContainer>;

type Story = StoryObj<ComponentProps<typeof TableContainer>>;

export default meta;

export const Default: Story = {
  name: "Complete table",
  render: (args) => <TableContainerWrapper {...args} />,
  args: {
    useReactWindow: false,
  },
  beforeEach: () => {
    onColumnSort.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const container = canvas.getByTestId("table-container");
    await expect(getComputedStyle(container).display).toBe("grid");
    // The header sizes the grid's columns.
    await expect(container.style.gridTemplateColumns).not.toBe("");
    const header = canvas.getByTestId("table-header");
    await expect(within(header).getByText("Tags")).toBeVisible();
    await expect(
      within(canvas.getByTestId("table-body")).getAllByTestId("table-row"),
    ).toHaveLength(10);

    // A column title sorts by its field.
    await userEvent.click(within(header).getByText("Type"));
    await expect(onColumnSort).toHaveBeenCalledWith(
      SortByFieldName.Type,
      expect.anything(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A complete table of ten rows under a sortable header, the usual way the parts are put together. The container holds the grid, and the header sizes its columns.",
      },
      source: {
        code: `const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    useReactWindow={false}
    showSettings
    sortingVisible
    sorted
  />
  <TableBody
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    fetchMoreFiles={fetchMore}
    filesLength={10}
    hasMoreFiles={false}
    itemCount={10}
    itemHeight={50}
    useReactWindow={false}
  >
    {rows}
  </TableBody>
</TableContainer>`,
      },
    },
  },
};
