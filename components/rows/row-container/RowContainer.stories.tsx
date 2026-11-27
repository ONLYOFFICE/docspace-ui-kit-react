import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";

import type { IndexRange } from "react-virtualized";

import Word32Svg from "../../../assets/icons/32/word.svg";

import { globalColors } from "../../../providers/theme";

import { Link, LinkType } from "../../link";
import { Row } from "../row";
import { RowContent } from "../row-content";
import { Scrollbar } from "../../scrollbar";
import { Text } from "../../text";

import { RowContainer } from ".";

import { RowContainerProps } from "./RowContainer.types";

const meta = {
  title: "UI/Rows/RowContainer",
  component: RowContainer,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    children: {
      control: false,
      description: "The rows. It must be an array, one entry per row.",
    },
    useReactWindow: {
      control: "boolean",
      description:
        "Whether the rows are virtualised and paged in as the user scrolls. Turn it off outside the portal, whose scroll element the virtual list follows.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    itemHeight: {
      control: "number",
      description:
        "Height of one row in pixels, which the virtualised list uses for every row alike. A taller row gets no more room.",
      table: {
        defaultValue: { summary: "50" },
      },
    },
    manualHeight: {
      control: "text",
      description:
        "Height of the container as a CSS length while `useReactWindow` is on. Without it the container takes its parent's full height. With virtualisation off it does nothing.",
    },
    itemCount: {
      control: "number",
      description:
        "How many rows there are in total. Read by the virtual list only.",
    },
    filesLength: {
      control: "number",
      description:
        "How many rows are loaded so far. Read by the virtual list only.",
    },
    hasMoreFiles: {
      control: "boolean",
      description: "Whether there is another page to ask for.",
    },
    fetchMoreFiles: {
      control: false,
      description:
        "Called with the range to load when the user scrolls near the end.",
    },
    onScroll: {
      control: false,
      description:
        "Called as the virtual list scrolls. Never called with virtualisation off.",
    },
    noSelect: {
      control: "boolean",
      description:
        "Disables text selection, which is on by default inside the container.",
    },
    id: {
      control: "text",
      description: "Id of the container element.",
      table: {
        defaultValue: { summary: '"rowContainer"' },
      },
    },
    className: {
      control: "text",
      description: "Applied to the container.",
    },
    style: {
      control: "object",
      description: "Applied to the container.",
    },
  },
} satisfies Meta<typeof RowContainer>;
type Story = StoryObj<typeof meta>;

export default meta;

const files = Array.from({ length: 20 }, (_, index) => ({
  id: `file-${index + 1}`,
  title: `Document ${index + 1}.docx`,
  size: `${(index % 9) + 1} KB`,
}));

const contextOptions = [
  { key: "open", label: "Open" },
  { key: "rename", label: "Rename" },
  { key: "delete", label: "Delete" },
];

const renderRow = (file: { id: string; title: string; size: string }) => (
  <Row
    key={file.id}
    mode="modern"
    checked={false}
    element={<Word32Svg width={32} height={32} />}
    contextOptions={contextOptions}
  >
    <RowContent sideColor={globalColors.gray}>
      <Link
        type={LinkType.page}
        title={file.title}
        fontSize="15px"
        fontWeight={600}
        isTextOverflow
        truncate
      >
        {file.title.replace(/\.docx$/, "")}
        <span style={{ color: globalColors.gray }}>.docx</span>
      </Link>
      <span />
      <Text fontSize="12px" fontWeight={400}>
        Modified today
      </Text>
      <Text fontSize="12px" fontWeight={400}>
        {file.size}
      </Text>
    </RowContent>
  </Row>
);

const Template = (args: RowContainerProps) => {
  return <RowContainer {...args}>{files.map(renderRow)}</RowContainer>;
};

export const Default: Story = {
  name: "All rows at once",
  render: (args) => <Template {...args} />,
  args: {
    useReactWindow: false,
    children: [],
  },
  play: async ({ canvas }) => {
    // Every row at once, without the virtual list.
    const container = canvas.getByTestId("row-container");
    await expect(within(container).getAllByTestId("row")).toHaveLength(20);
    await expect(getComputedStyle(container).userSelect).not.toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Twenty file rows rendered at once, with virtualisation off (`useReactWindow`), as on a page with no portal section around it. The text of the rows can be selected.",
      },
      source: {
        code: `<RowContainer useReactWindow={false}>
  {files.map((file) => (
    <Row key={file.id} mode="modern" checked={false} element={<Word32Svg />} contextOptions={contextOptions}>
      <RowContent sideColor={globalColors.gray}>
        <Link type={LinkType.page} title={file.title} fontSize="15px" fontWeight={600} isTextOverflow truncate>
          {file.name}
          <span style={{ color: globalColors.gray }}>{file.exst}</span>
        </Link>
        <span />
        <Text fontSize="12px" fontWeight={400}>Modified today</Text>
        <Text fontSize="12px" fontWeight={400}>{file.size}</Text>
      </RowContent>
    </Row>
  ))}
</RowContainer>`,
      },
    },
  },
};

export const NoTextSelection: Story = {
  name: "No text selection",
  render: (args) => <Template {...args} />,
  args: {
    useReactWindow: false,
    noSelect: true,
    children: [],
  },
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByTestId("row-container")).userSelect,
    ).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A list whose rows are picked with clicks and drags rather than read and copied: dragging across a title selects no text (`noSelect`).",
      },
      source: {
        code: `<RowContainer useReactWindow={false} noSelect>
  {rows}
</RowContainer>`,
      },
    },
  },
};

// The virtual list follows the scroll of the portal section found by this id.
const SectionScroll = ({ children }: { children: ReactNode }) => (
  <div style={{ height: "300px", position: "relative" }} id="sectionScroll">
    <Scrollbar>{children}</Scrollbar>
  </div>
);

const TOTAL = 100;
const PAGE = 20;

const VirtualisedTemplate = (args: RowContainerProps) => {
  const [loaded, setLoaded] = useState(PAGE);
  const [, setMounted] = useState(false);

  // The list looks up its scroller and its own width while rendering, so it
  // needs one more render once both are in the DOM.
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMoreFiles = async (range: IndexRange) => {
    await args.fetchMoreFiles?.(range);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setLoaded((count) => Math.min(TOTAL, count + PAGE));
  };

  const rows = Array.from({ length: loaded }, (_, index) =>
    renderRow({
      id: `file-${index + 1}`,
      title: `Document ${index + 1}.docx`,
      size: `${(index % 9) + 1} KB`,
    }),
  );

  return (
    <SectionScroll>
      <RowContainer
        {...args}
        itemCount={TOTAL}
        filesLength={loaded}
        hasMoreFiles={loaded < TOTAL}
        fetchMoreFiles={fetchMoreFiles}
      >
        {rows}
      </RowContainer>
    </SectionScroll>
  );
};

export const Virtualised: Story = {
  name: "Virtualised and paged",
  render: (args) => <VirtualisedTemplate {...args} />,
  args: {
    useReactWindow: true,
    itemHeight: 56,
    fetchMoreFiles: fn(),
    onScroll: fn(),
    children: [],
  },
  play: async ({ args, canvas }) => {
    await waitFor(() => expect(canvas.getByText("Document 1")).toBeVisible());
    // Only the rows near the view are mounted.
    await expect(canvas.getAllByTestId("row").length).toBeLessThan(20);

    // Scrolling to the end of the loaded rows asks for the next page.
    const scroller = document.querySelector(
      "#sectionScroll .scroll-wrapper > .scroller",
    ) as HTMLElement;
    await waitFor(() => {
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event("scroll"));
      expect(args.fetchMoreFiles).toHaveBeenCalled();
    });
    await expect(args.onScroll).toHaveBeenCalled();
    await waitFor(
      () => {
        scroller.scrollTop = scroller.scrollHeight;
        scroller.dispatchEvent(new Event("scroll"));
        expect(canvas.getByText("Document 21")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "A box of a hundred files, twenty of them loaded, with only the rows in view mounted, each 56px high (`itemHeight`). Near the end of the loaded rows the list calls `fetchMoreFiles`. Skeleton rows stand in until the next range arrives.",
      },
      source: {
        code: `<div id="sectionScroll" style={{ height: 300 }}>
  <Scrollbar>
    <RowContainer
      itemHeight={56}
      itemCount={100}
      filesLength={rows.length}
      hasMoreFiles={rows.length < 100}
      fetchMoreFiles={loadMore}
      onScroll={handleScroll}
    >
      {rows}
    </RowContainer>
  </Scrollbar>
</div>`,
      },
      story: { inline: false, height: "326px" },
    },
  },
};
