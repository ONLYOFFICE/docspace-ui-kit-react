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
// the GNU AGPL at: http://www.gnu.org/licenses/by-sa/4.0/legalcode
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

import { Meta, StoryObj } from "@storybook/react-vite";

import File32ReactSvg from "../../../assets/icons/32/file.react.svg";

import { TileContent } from ".";
import { BaseTile } from "../base-tile";
import { Link } from "../../link";
import { Text } from "../../text";
import { Badge } from "../../badge";

const element = <File32ReactSvg />;

const mockContextOptions = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const meta = {
  title: "Components/UI/Tiles/TileContent",
  component: TileContent,
  parameters: {
    docs: {
      description: {
        component:
          "Content wrapper component for tile items, handles layout and spacing",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "300px", margin: "20px" }}>
        <BaseTile
          item={{ id: "1", title: "Document.docx" }}
          contextOptions={mockContextOptions}
          element={element}
          topContent={<Story />}
        />
      </div>
    ),
  ],
} satisfies Meta<typeof TileContent>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: <Link>Document.docx</Link>,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic tile content with a link inside BaseTile",
      },
    },
  },
};

export const WithText: Story = {
  args: {
    children: (
      <Text fontSize="14px" fontWeight={600}>
        My Document
      </Text>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Tile content with text component inside BaseTile",
      },
    },
  },
};

export const WithMultipleElements: Story = {
  args: {
    children: (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link>Document.docx</Link>
        <Badge label="New" backgroundColor="#4781D1" color="#fff" />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Tile content with multiple child elements",
      },
    },
  },
};
