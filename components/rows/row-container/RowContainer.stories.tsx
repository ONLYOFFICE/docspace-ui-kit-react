import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { IndexRange } from "react-virtualized";

import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";
import { IconSizeType } from "../../../utils";

import { Row } from "../row";
import { RowContent } from "../row-content";
import { Scrollbar } from "../../scrollbar";
import { Text } from "../../text";

import { RowContainer } from ".";

import { RowContainerProps } from "./RowContainer.types";

import styles from "./RowContainer.stories.module.scss";

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
      description: "The rows, as an array with one entry per row",
    },
    useReactWindow: {
      control: "boolean",
      description:
        "Whether only the rows in view are mounted and the rest paged in as the user scrolls. It needs the page section's scroll container around it; turn it off for a short list",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    itemHeight: {
      control: "number",
      description:
        "Height of every row in pixels while the list is virtualised; a taller row is cut off",
      table: {
        defaultValue: { summary: "50" },
      },
    },
    manualHeight: {
      control: "text",
      description:
        "Height of the list as a CSS length while it is virtualised; without it the list is as tall as its parent, which then needs a height of its own",
    },
    itemCount: {
      control: "number",
      description:
        "How many rows there are in total, loaded or not; read only while the list is virtualised",
    },
    filesLength: {
      control: "number",
      description:
        "How many rows are loaded so far; read only while the list is virtualised",
    },
    hasMoreFiles: {
      control: "boolean",
      description:
        "Whether there is another range of rows to ask for; read only while the list is virtualised",
    },
    fetchMoreFiles: {
      control: false,
      description:
        "Called with the start and stop index of the rows to load when the user scrolls near the end of the loaded ones; it returns a promise",
    },
    onScroll: {
      control: false,
      description: "Called as the virtualised list scrolls",
    },
    noSelect: {
      control: "boolean",
      description:
        "Stops the user from selecting the text of the rows, which is allowed by default",
    },
    id: {
      control: "text",
      description:
        "Id of the list element. The virtualised list finds itself by the id `rowContainer` to measure its width, so another id, or a second list on the page, leaves its rows with no width",
      table: {
        defaultValue: { summary: '"rowContainer"' },
      },
    },
    className: {
      control: "text",
      description: "Class added to the list element",
    },
    style: {
      control: "object",
      description: "Inline style applied to the list element",
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
    checked={false}
    element={
      <CatalogFolderReactSvg
        className={styles.catalogFolderIcon}
        data-size={IconSizeType.big}
      />
    }
    contextOptions={contextOptions}
  >
    <RowContent>
      <Text fontSize="15px" fontWeight={600} truncate>
        {file.title}
      </Text>
      <span />
      <Text>Modified today</Text>
      <Text>{file.size}</Text>
    </RowContent>
  </Row>
);

const Template = (args: RowContainerProps) => {
  return <RowContainer {...args}>{files.map(renderRow)}</RowContainer>;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    useReactWindow: false,
    children: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A short list of twenty files rendered as it is, with virtualisation off (`useReactWindow`), which is how the list works on a page that has no portal section around it. Select the text of a row to see that selection is allowed; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<RowContainer useReactWindow={false}>
  {files.map((file) => (
    <Row key={file.id} checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
      <RowContent>
        <Text fontSize="15px" fontWeight={600} truncate>{file.title}</Text>
        <span />
        <Text>Modified today</Text>
        <Text>{file.size}</Text>
      </RowContent>
    </Row>
  ))}
</RowContainer>`,
      },
    },
  },
};

export const NoTextSelection: Story = {
  render: (args) => <Template {...args} />,
  args: {
    useReactWindow: false,
    noSelect: true,
    children: [],
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
  render: (args) => <VirtualisedTemplate {...args} />,
  args: {
    useReactWindow: true,
    itemHeight: 56,
    fetchMoreFiles: fn(),
    onScroll: fn(),
    children: [],
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "A list of a hundred files of which twenty are loaded: scroll the box and only the rows in view are mounted, each 56px high (`itemHeight`). Near the end of the loaded rows the list asks for the next range (`fetchMoreFiles`, logged in the Actions panel) and shows skeleton rows until it arrives half a second later.",
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
      // Framed: the virtual list measures the first #rowContainer on the page
      story: { inline: false, height: "326px" },
    },
  },
};
