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

import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { SelectionArea } from "./SelectionArea";
import type { SelectionAreaProps } from "./SelectionArea.types";
import styles from "./SelectionArea.stories.module.scss";

export default {
  title: "UI/Layout components/SelectionArea",
  component: SelectionArea,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      disable: true,
    },
  },
  decorators: [
    (S) => (
      <div id="sectionScroll" className={styles.container}>
        <S />
      </div>
    ),
  ],
} as Meta;

const Template: StoryFn<SelectionAreaProps> = (args) => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleMove = ({
    added,
    removed,
  }: {
    added: Element[];
    removed: Element[];
  }) => {
    setSelectedItems((prev) => {
      const newItems = [...prev];

      added.forEach((element) => {
        const valueElement =
          args.viewAs === "tile"
            ? element
            : element.getElementsByClassName(args.itemClass || "item-name")[0];

        const value = valueElement?.getAttribute("value");
        if (value && !newItems.includes(value)) {
          newItems.push(value);
        }
      });

      removed.forEach((element) => {
        const valueElement =
          args.viewAs === "tile"
            ? element
            : element.getElementsByClassName(args.itemClass || "item-name")[0];

        const value = valueElement?.getAttribute("value");
        if (value) {
          const index = newItems.indexOf(value);
          if (index > -1) {
            newItems.splice(index, 1);
          }
        }
      });

      return newItems;
    });
  };

  return (
    <>
      <div className={styles.itemsContainer}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={`item_${index}`}
            className={`${styles.item} selectable-item ${selectedItems.includes(`item_${index}`) ? styles.selected : ""}`}
            {...({ value: `item_${index}` } as Record<string, string>)}
            data-id={`item_${index}`}
          >
            Item {index + 1}
          </div>
        ))}
      </div>

      <SelectionArea
        {...args}
        onMove={handleMove}
        containerClass={styles.container}
        itemsContainerClass={styles.itemsContainer}
        selectableClass="selectable-item"
        scrollClass={styles.container}
        itemClass="item-name"
        viewAs="tile"
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  viewAs: "tile",
  folderHeaderHeight: 0,
  defaultHeaderHeight: 0,
  countTilesInRow: 4,
  arrayTypes: [
    {
      type: "item",
      itemHeight: 150,
      rowGap: 16,
    },
  ],
  isRooms: false,
};
