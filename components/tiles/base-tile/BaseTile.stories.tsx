// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";

import WordSvgUrl from "../../../assets/icons/32/word.svg";
import PdfSvgUrl from "../../../assets/icons/32/pdf.svg";
import SlideSvgUrl from "../../../assets/icons/32/slide.svg";
import { Link } from "../../link";

import { BaseTile } from ".";
import { BaseTileProps } from "./BaseTile.types";
import { TileContent } from "../tile-content";

const wordElement = <WordSvgUrl />;

const contextOptions = [
  {
    id: "option_edit",
    key: "edit",
    label: "Edit",
    onClick: () => {},
    disabled: false,
  },
  {
    id: "option_delete",
    key: "delete",
    label: "Delete",
    onClick: () => {},
    disabled: false,
  },
];

const meta = {
  title: "Components/UI/Tiles/BaseTile",
  component: BaseTile,
  parameters: {
    docs: {
      description: {
        component:
          "Base tile component that serves as a foundation for file and room tiles",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    isActive: { control: "boolean" },
    inProgress: { control: "boolean" },
    showHotkeyBorder: { control: "boolean" },
    isEdit: { control: "boolean" },
  },
} satisfies Meta<typeof BaseTile>;

type Story = StoryObj<typeof meta>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: BaseTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect = (isSelected: boolean) => {
    setChecked(isSelected);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <BaseTile {...args} checked={checked} onSelect={onSelect} />
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    item: {
      id: "tile-1",
      title: "Document.docx",
      fileExst: ".docx",
    },
    element: wordElement,
    contextOptions,
    topContent: (
      <TileContent>
        <Link>Document.docx</Link>
      </TileContent>
    ),
    onSelect: () => {},
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic base tile with default configuration",
      },
    },
  },
};

export const Checked: Story = {
  render: Template,
  args: {
    ...Default.args,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Base tile in checked/selected state",
      },
    },
  },
};

export const Active: Story = {
  render: Template,
  args: {
    ...Default.args,
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Base tile in active state",
      },
    },
  },
};

export const InProgress: Story = {
  render: Template,
  args: {
    ...Default.args,
    inProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Base tile showing progress/loading state",
      },
    },
  },
};

export const WithHotkeyBorder: Story = {
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Base tile with hotkey border visible",
      },
    },
  },
};

export const WithBottomContent: Story = {
  render: Template,
  args: {
    ...Default.args,
    topContent: (
      <TileContent>
        <Link>Document.docx</Link>
      </TileContent>
    ),
    bottomContent: (
      <div style={{ padding: "8px", fontSize: "12px", color: "#666" }}>
        Additional information
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Base tile with both top and bottom content",
      },
    },
  },
};
