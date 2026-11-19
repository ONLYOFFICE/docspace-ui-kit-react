import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import React, { useState } from "react";
import { expect, fn, within } from "storybook/test";

import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";

import { IconSizeType } from "../../../utils";
import { Link, LinkType } from "../../link";
import { Checkbox } from "../../checkbox";
import { Text } from "../../text";

import { RowContent } from ".";
import { RowContentProps } from "./RowContent.types";
import { globalColors } from "../../../providers/theme";

import styles from "./RowContent.stories.module.scss";

const meta = {
  title: "UI/Rows/RowContent",
  component: RowContent,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    children: {
      control: false,
      description:
        "The row's parts by position: the title, then the icons beside it. Later children are side elements, hidden, with their text joined into the line under the title. It has to be an array.",
    },
    disableSideInfo: {
      control: "boolean",
      description: "Drops the line of joined side text under the title.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    convertSideInfo: {
      control: "boolean",
      description:
        "Whether the last side element is joined into the line as text like the others. Turn it off to show it at the end of the line as the element it is.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    sideColor: {
      control: "color",
      description: "Any CSS colour for the line of side text.",
    },
    sectionWidth: {
      control: "number",
      description: "Changes nothing on screen; nothing reads it.",
    },
    onClick: {
      control: false,
      description: "Called on a click anywhere in the content.",
    },
    className: {
      control: "text",
      description: "Applied to the row's content element.",
    },
    id: {
      control: "text",
      description: "Applied to the row's content element.",
    },
    style: {
      control: "object",
      description:
        "Applied to the content element, and again to the title's wrapper.",
    },
  },
} satisfies Meta<typeof RowContent>;

type Story = StoryObj<ComponentProps<typeof RowContent>>;

export default meta;

const titleIcon = (
  <CatalogFolderReactSvg
    className={styles.catalogFolderIcon}
    data-size={IconSizeType.small}
  />
);

const Template = (args: RowContentProps) => (
  <RowContent {...args}>
    <Text fontSize="15px" fontWeight={600} truncate>
      Quarterly report.docx
    </Text>
    {titleIcon}
    <Text>Modified today</Text>
    <Text>24 KB</Text>
    <Link type={LinkType.action} fontSize="12px">
      Version 2
    </Link>
  </RowContent>
);

export const Default: Story = {
  name: "File row content",
  render: (args) => <Template {...args} />,
  args: {
    disableSideInfo: false,
    convertSideInfo: true,
    sideColor: globalColors.gray,
    sectionWidth: 600,
    onClick: fn(),
  },
  play: async ({ args, canvas }) => {
    // sectionWidth adds no class, an "undefined" one included.
    await expect(canvas.getByTestId("row-content")).not.toHaveClass(
      "undefined",
    );

    // The later children are joined into one line; they are not shown.
    await expect(canvas.getByTestId("tablet-side-info")).toHaveTextContent(
      "Modified today | 24 KB | Version 2",
    );
    for (const side of canvas.getAllByTestId("side-container")) {
      await expect(side).not.toBeVisible();
    }
    await expect(
      within(canvas.getByTestId("tablet-side-info")).queryByRole("link"),
    ).toBeNull();

    canvas.getByText("Quarterly report.docx").click();
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content of one file row: the title with a folder icon beside it. Under them, **Modified today**, **24 KB** and **Version 2** are joined into one line of text. A click anywhere in it calls `onClick`.",
      },
      source: {
        code: `<RowContent sideColor="#A3A9AE" onClick={handleClick}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>`,
      },
    },
  },
};

export const ElementAtTheEnd: Story = {
  name: "Link at the end",
  render: (args) => <Template {...args} />,
  args: {
    convertSideInfo: false,
  },
  play: async ({ canvas }) => {
    // The last child stays an element at the end of the joined text.
    const line = canvas.getByTestId("tablet-side-info");
    await expect(line).toHaveTextContent("Modified today | 24 KBVersion 2");
    const version = within(line).getByText("Version 2");
    await expect(version.closest("a")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A details line that ends in a link: **Version 2** stays a link instead of being joined in as text (`convertSideInfo` off). It follows the joined text with no bar or space. Only the last child is kept this way.",
      },
      source: {
        code: `<RowContent convertSideInfo={false}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>`,
      },
    },
  },
};

export const DetailsColour: Story = {
  name: "Grey details",
  render: (args) => <Template {...args} />,
  args: {
    sideColor: globalColors.gray,
  },
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByTestId("tablet-side-info")).color,
    ).toBe("rgb(163, 169, 174)");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Details that step back from the title: the joined line is drawn in grey (`sideColor`) while the title keeps its own colour.",
      },
      source: {
        code: `<RowContent sideColor="#A3A9AE">
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
</RowContent>`,
      },
    },
  },
};

const TitleOnlyTemplate = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <RowContent disableSideInfo>
      <Text fontSize="15px" fontWeight={600} truncate>
        Quarterly report.docx
      </Text>
      <Checkbox
        id="1"
        name="sample"
        isChecked={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
        }}
      />
    </RowContent>
  );
};

export const TitleOnly: Story = {
  name: "Title only",
  render: () => <TitleOnlyTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByTestId("tablet-side-info")).toBeNull();
    const checkbox = canvas.getByRole("checkbox");
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A title with a checkbox of its own in the place of the icons. There is no details line under them (`disableSideInfo`).",
      },
      source: {
        code: `<RowContent disableSideInfo>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <Checkbox isChecked={isChecked} onChange={() => setIsChecked(!isChecked)} />
</RowContent>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <RowContent>
        <Text fontSize="15px" fontWeight={600} truncate>
          {"مستند"}
        </Text>
        {titleIcon}
        <Text>{"اليوم"}</Text>
        <Text>24 KB</Text>
      </RowContent>
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // Joined in reverse, so the last detail comes first.
    await expect(
      canvas.getByTestId("tablet-side-info").textContent?.startsWith("24 KB"),
    ).toBe(true);
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The content in a right-to-left interface: the title and its icon start at the right edge. The details are joined in reverse order, so **24 KB** comes first from the right.",
      },
      source: {
        code: `<div dir="rtl">
  <RowContent>
    <Text fontWeight={600}>Title</Text>
    <CatalogFolderReactSvg />
    <Text>Modified today</Text>
    <Text>24 KB</Text>
  </RowContent>
</div>`,
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: { inline: false, height: "72px" },
    },
  },
};
