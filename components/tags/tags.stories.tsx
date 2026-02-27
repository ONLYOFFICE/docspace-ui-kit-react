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

import { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";

import { Tags } from ".";

type TagsType = typeof Tags;
type Story = StoryObj<TagsType>;

const meta: Meta<TagsType> = {
  title: "UI/Data display/Tags",
  component: Tags,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    onSelectTag: { action: "tag selected" },
    onMouseEnter: { action: "mouse enter" },
    onMouseLeave: { action: "mouse leave" },
    onOptionTagClick: { action: "option tag clicked" },
  },
};

export default meta;

export const Default: Story = {
  args: {
    tags: ["Design", "Development"],
    columnCount: 2,
    onSelectTag: () => {},
  },
};

export const WithMultipleTags: Story = {
  args: {
    tags: ["React", "TypeScript", "Node.js", "GraphQL", "Docker"],
    columnCount: 5,
    onSelectTag: () => {},
  },
};

export const WithDropdown: Story = {
  render: (args) => (
    <div style={{ height: "150px", paddingTop: "20px" }}>
      <Tags {...args} />
    </div>
  ),
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    style: { width: "250px" },
    columnCount: 3,
    onSelectTag: () => {},
  },
};

export const WithTagObjects: Story = {
  args: {
    tags: [
      { label: "Design", roomType: 1 },
      { label: "Development", roomType: 2 },
      { label: "Marketing", roomType: 3 },
    ],
    columnCount: 3,
    onSelectTag: () => {},
  },
};

export const WithRemoveIcon: Story = {
  render: (args) => (
    <div style={{ height: "150px", paddingTop: "20px" }}>
      <Tags {...args} />
    </div>
  ),
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4"],
    columnCount: 2,
    removeTagIcon: true,
    onSelectTag: () => {},
    style: { width: "200px" },
  },
};

export const WithCustomOptionTag: Story = {
  render: (args) => {
    const optionRef = useRef<HTMLDivElement>(null);
    return (
      <div style={{ height: "100px", paddingTop: "20px" }}>
        <Tags
          {...args}
          optionTagRef={optionRef}
          onOptionTagClick={() => console.log("Option tag clicked")}
        />
      </div>
    );
  },
  args: {
    tags: ["Tag1", "Tag2", "Tag3"],
    columnCount: 2,
    onSelectTag: () => {},
    style: { width: "150px" },
  },
};

export const ShowAllTags: Story = {
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
    columnCount: -1,
    onSelectTag: () => {},
  },
};

export const WithCreateTag: Story = {
  args: {
    tags: ["Design", "Development"],
    columnCount: 3,
    showCreateTag: true,
    onSelectTag: () => {},
  },
};
