import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";

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
        component: `TableBody holds the rows of a table and, for a long list, renders only the rows in view and asks for the next page as the user scrolls.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    useReactWindow: {
      control: "boolean",
      description:
        "Mounts only the rows near the visible part of the page and loads more on scroll; when off, every row is rendered at once",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    itemHeight: {
      control: "number",
      description:
        "Height of every row in pixels when the rows are virtualised",
      table: {
        defaultValue: { summary: "41" },
      },
    },
    itemCount: {
      control: "number",
      description: "How many rows there are in total, loaded or not",
    },
    filesLength: {
      control: "number",
      description:
        "How many rows are loaded; rows past this index are drawn as placeholders while `hasMoreFiles` is set",
    },
    hasMoreFiles: {
      control: "boolean",
      description:
        "Adds two placeholder rows after the loaded ones and asks `fetchMoreFiles` for more when they come into view",
    },
    infoPanelVisible: {
      control: "boolean",
      description:
        "Lays the virtualised rows out with the column widths saved under `columnInfoPanelStorageName` instead of `columnStorageName`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    columnStorageName: {
      control: "text",
      description:
        "`localStorage` key the header saved the column widths under; without it the body renders nothing",
    },
    columnInfoPanelStorageName: {
      control: "text",
      description:
        "`localStorage` key of the column widths used while an info panel is open; without it the body renders nothing",
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Accepted for the rows being reordered, but has no effect",
    },
    fetchMoreFiles: {
      control: false,
      action: "fetchMoreFiles",
      description:
        "Called with the start and stop index of the rows to load when placeholder rows scroll into view",
    },
    onScroll: {
      control: false,
      action: "onScroll",
      description:
        "Called as the page scrolls, only while the rows are virtualised",
    },
    children: {
      control: false,
      description: "The rows, as an array with one element per row",
    },
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

// The mounted rows of the body; virtualised, only those near the view.
const mountedRows = (root: HTMLElement) =>
  within(root).queryAllByTestId("table-row");

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
    fetchMoreFiles: fn(async () => {}),
    filesLength: 20,
    hasMoreFiles: false,
    itemCount: 20,
    itemHeight: 50,
    useReactWindow: true,
    infoPanelVisible: false,
    children: createMockRows(20),
  },
  play: async ({ canvas }) => {
    const body = await waitFor(() => canvas.getByTestId("table-body"));
    await waitFor(() => expect(mountedRows(body).length).toBeGreaterThan(0));
    // Only the rows near the 400px view are mounted.
    await expect(mountedRows(body).length).toBeLessThan(20);
    await expect(canvas.getByText("Cell 1-1")).toBeVisible();
    await expect(canvas.queryByText("Cell 20-1")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Twenty rows through the virtualised body, the mode for a list that can grow long: scroll the frame and only the rows near the view stay mounted, as the counter below it shows.",
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
  play: async ({ canvas }) => {
    // Every row at once.
    const body = await waitFor(() => canvas.getByTestId("table-body"));
    await expect(mountedRows(body)).toHaveLength(20);
    await expect(canvas.getByText("Cell 20-1")).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same twenty rows rendered all at once (`useReactWindow` off), which is simpler and enough for a short list that never pages.",
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
    // The total: five rows are loaded out of twenty.
    itemCount: 20,
    hasMoreFiles: true,
  },
  play: async ({ args, canvas }) => {
    await waitFor(() => expect(canvas.getByText("Cell 5-1")).toBeVisible());
    // The loader acts on a scroll of the section; with the placeholders in
    // view, the next page is asked for.
    const scroller = document.querySelector(
      "#sectionScroll .scroll-wrapper > .scroller",
    ) as HTMLElement;
    await waitFor(() => {
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event("scroll"));
      expect(args.fetchMoreFiles).toHaveBeenCalled();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five loaded rows followed by two placeholder rows, what the user sees while the next page is on its way (`hasMoreFiles`); `fetchMoreFiles` is called as the placeholders come into view.",
      },
      source: {
        code: `<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={5}
  hasMoreFiles
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
