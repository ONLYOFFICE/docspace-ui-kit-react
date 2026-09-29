import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import React, { useState } from "react";
import { fn } from "storybook/test";

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
        "The row's parts, by position: the first is the title, the second sits beside it, and the text of every later child is joined into the line under the title while the child itself is not shown. It has to be an array of at least two",
    },
    disableSideInfo: {
      control: "boolean",
      description:
        "Drops the line of details under the title, leaving the title and what sits beside it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    convertSideInfo: {
      control: "boolean",
      description:
        "Whether the last child is joined into the details line as text like the others. Turn it off to show it at the end of that line as the element it is, such as a link",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    sideColor: {
      control: "color",
      description: "Any CSS colour for the text of the details line",
    },
    sectionWidth: {
      control: "number",
      description:
        "Meant to switch the content to a layout for a given section width; no style reads it at present, so changing it changes nothing on the page",
    },
    onClick: {
      control: false,
      description: "Called on a click anywhere in the content",
    },
    className: {
      control: "text",
      description: "Class added to the content element",
    },
    id: {
      control: "text",
      description: "Id of the content element",
    },
    style: {
      control: "object",
      description:
        "Inline style applied to the content element, and again to the wrapper around the title and its icons",
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
  render: (args) => <Template {...args} />,
  args: {
    disableSideInfo: false,
    convertSideInfo: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content of one file row: the title, a status icon beside it, and the details **Modified today**, **24 KB** and **Version 2** joined into one line under them. Click anywhere in it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<RowContent onClick={handleClick}>
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
  render: (args) => <Template {...args} />,
  args: {
    convertSideInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A details line that ends in something to click: **Version 2** stays a link at the end of the line instead of being joined in as plain text (`convertSideInfo` off). It follows the joined text directly, with no bar or space before it, and only the last child is kept this way.",
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
  render: (args) => <Template {...args} />,
  args: {
    sideColor: globalColors.gray,
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
  render: () => <TitleOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A row that needs only its title and a control of its own: the checkbox takes the place of the title icons, and there is no details line under them (`disableSideInfo`).",
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
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The content in a right-to-left interface: the title and its icon start at the right edge, and the details are joined in reverse order, so reading from the right the last of them, **24 KB**, comes first.",
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
