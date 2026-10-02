import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TableContainerProps } from "../Table.types";

import { useRef } from "react";
import { uuid as uuidv4 } from "../../../utils/";

import { TableContainer } from "./TableContainer";
import { Scrollbar } from "../../scrollbar";
import { TableRow } from "../table-row";
import { TableCell } from "../sub-components/table-cell";
import { TableHeader } from "../table-header";
import { SortByFieldName } from "../../../enums";
import { TableBody } from "../table-body";

const COLUMN_STORAGE_NAME = "storybook-table-container-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-container-info-panel-storage";

const mockColumns = [
  {
    key: "Column 1",
    title: "Column 1",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Column 2",
    title: "Column 2",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Column 3",
    title: "Column 3",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: () => {},
    onClick: () => {},
  },
];

const createTableRows = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    return (
      <TableRow key={uuidv4()}>
        <TableCell>{`Cell ${index + 1}-1`}</TableCell>
        <TableCell>{`Cell ${index + 1}-2`}</TableCell>
        <TableCell>{`Cell ${index + 1}-3`}</TableCell>
      </TableRow>
    );
  });
};

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
        sectionWidth={800}
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
        "Makes the container a full-height block instead of a grid; set it together with the same prop on the header and the body when the rows are virtualised",
    },
    noSelect: {
      control: "boolean",
      description: "Stops the user selecting text anywhere inside the table",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class applied to the container after the component's own",
    },
    forwardedRef: {
      control: false,
      description:
        "Ref of the container element; pass the same ref to the header as `containerRef`",
    },
    children: {
      control: false,
      description: "The header, the group menu and the body",
    },
  },
  decorators: [
    (Story) => {
      return (
        <div>
          <div style={{ marginBottom: "20px", fontSize: "14px" }}>
            <p>
              <strong>Note:</strong> TableContainer is a wrapper for table
              elements (header, body, rows, cells). When used with react-window,
              it sets specific styles to properly contain virtualized content.
            </p>
          </div>
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
  render: (args) => <TableContainerWrapper {...args} />,
  args: {
    useReactWindow: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A complete table of ten rows under a sortable header, the usual way the parts are put together: the container holds the grid, the header sizes its columns. Turn on `useReactWindow` in the Controls panel below to render the same rows through the virtualised body.",
      },
      source: {
        code: `const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={800}
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
