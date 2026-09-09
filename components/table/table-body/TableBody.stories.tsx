import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { useEffect, useRef, useState } from "react";
import { uuid as uuidv4 } from "../../../utils/";

import { TableBody } from "./TableBody";
import { TableRow } from "../table-row";
import { TableCell } from "../sub-components/table-cell";
import { Scrollbar } from "../../scrollbar";
import { TableContainer } from "../table-container";

const COLUMN_STORAGE_NAME = "storybook-table-body-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-body-info-panel-storage";

const meta = {
  title: "UI/Table/TableBody",
  component: TableBody,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `TableBody renders table rows with support for infinite scrolling and virtual scrolling.

### Features

- **Virtual Scrolling**: Uses react-window for efficient rendering of large datasets
- **Infinite Scrolling**: Automatically fetches more data when scrolling near the bottom
- **Configurable Item Height**: Supports custom row heights for different layouts
- **Info Panel Awareness**: Adjusts column layout when the info panel is visible

### Usage

\`\`\`tsx
import { TableBody } from "@onlyoffice/apps-ui-kit/components/table/table-body";

<TableBody
  columnStorageName="my-table-columns"
  columnInfoPanelStorageName="my-table-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={items.length}
  hasMoreFiles={hasMore}
  itemCount={items.length}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>
\`\`\``,
      },
    },
  },
  argTypes: {
    useReactWindow: {
      control: "boolean",
      description: "Enable virtual scrolling with react-window",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    itemHeight: {
      control: "number",
      description: "Height of each row in pixels",
      table: {
        defaultValue: { summary: "50" },
      },
    },
    itemCount: {
      control: "number",
      description: "Total number of items to render",
    },
    filesLength: {
      control: "number",
      description:
        "Number of currently loaded files (used for infinite scroll calculation)",
    },
    hasMoreFiles: {
      control: "boolean",
      description:
        "Whether more files are available to fetch",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    infoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel is visible (affects column layout)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fetchMoreFiles: {
      control: false,
      action: "fetchMoreFiles",
    },
    onScroll: {
      control: false,
      action: "onScroll",
    },
    children: { control: false },
  },
  decorators: [
    (Story, context) => {
      const ref = useRef<HTMLDivElement>(null);
      const [isMounted, setIsMounted] = useState(false);
      const [renderedCount, setRenderedCount] = useState(0);

      useEffect(() => {
        if (!isMounted) {
          setIsMounted(true);
        }
      }, [isMounted, setIsMounted]);

      useEffect(() => {
        if (isMounted) {
          const rowsCount = document.querySelectorAll(
            ".table-container_row",
          ).length;
          setRenderedCount(rowsCount);
        }
      }, [isMounted]);

      return (
        <div>
          <div style={{ marginBottom: "20px", fontSize: "14px" }}>
            <p>
              <strong>Note:</strong> TableBody component for displaying table
              rows with support for infinite scrolling and virtual scrolling
              using react-window.
            </p>
          </div>
          <Scrollbar
            id="sectionScroll"
            style={{ height: "400px" }}
            autoHide={false}
          >
            <div style={{ paddingTop: "20px", width: "98%" }}>
              <TableContainer
                forwardedRef={ref}
                useReactWindow={context.args.useReactWindow}
              >
                {isMounted ? <Story /> : null}
              </TableContainer>
            </div>
          </Scrollbar>

          <div style={{ marginTop: "20px", fontSize: "16px" }}>
            <div>useReactWindow: {context.args.useReactWindow.toString()}</div>
            <div>
              Rendered rows: {renderedCount}/{context.args.itemCount}
            </div>
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableBody>;

type Story = StoryObj<ComponentProps<typeof TableBody>>;

export default meta;

const createMockRows = (count: number) => {
  return Array(count)
    .fill(null)
    .map((_, index) => (
      <TableRow
        key={uuidv4()}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 24px" }}
      >
        <TableCell>{`Cell ${index + 1}-1`}</TableCell>
        <TableCell>{`Cell ${index + 1}-2`}</TableCell>
        <TableCell>{`Cell ${index + 1}-3`}</TableCell>
      </TableRow>
    ));
};

export const Default: Story = {
  render: (args) => <TableBody {...args} />,
  args: {
    columnStorageName: COLUMN_STORAGE_NAME,
    columnInfoPanelStorageName: COLUMN_INFO_PANEL_STORAGE_NAME,
    fetchMoreFiles: async () => {},
    filesLength: 20,
    hasMoreFiles: false,
    itemCount: 20,
    itemHeight: 50,
    useReactWindow: true,
    infoPanelVisible: false,
    children: createMockRows(20),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default TableBody with react-window virtual scrolling enabled and 20 rows.",
      },
      source: {
        code: `<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>`,
      },
    },
  },
};

export const WithoutReactWindow: Story = {
  render: (args) => <TableBody {...args} />,
  args: {
    ...Default.args,
    useReactWindow: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "TableBody without virtual scrolling. All rows are rendered in the DOM at once. Suitable for small datasets.",
      },
      source: {
        code: `<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow={false}
>
  {rows}
</TableBody>`,
      },
    },
  },
};

export const WithMoreFiles: Story = {
  render: (args) => <TableBody {...args} />,
  args: {
    ...Default.args,
    children: createMockRows(5),
    filesLength: 5,
    itemCount: 5,
    hasMoreFiles: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "TableBody with hasMoreFiles enabled, indicating more data can be fetched via infinite scroll.",
      },
      source: {
        code: `<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={5}
  hasMoreFiles
  itemCount={5}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>`,
      },
    },
  },
};
