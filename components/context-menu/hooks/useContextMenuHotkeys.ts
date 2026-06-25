/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useState } from "react";
import type {
  ContextMenuModel,
  ContextMenuProps,
  ContextMenuRefType,
  ContextMenuType,
  TContextMenuValueTypeOnClick,
} from "../ContextMenu.types";

const useContextMenuHotkeys = ({
  visible,
  withHotkeys,
  model,
  currentEvent,
  hide,
  showDisabledItems,
}: {
  visible: boolean;
  withHotkeys: boolean;
  model: ContextMenuModel[];
  currentEvent: React.RefObject<
    | null
    | React.MouseEvent
    | MouseEvent
    | React.ChangeEvent<HTMLInputElement>
    | Event
  >;
  hide: ContextMenuRefType["hide"];
  showDisabledItems: ContextMenuProps["showDisabledItems"];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLevel, setActiveLevel] = useState(0);
  const [activeModel, setActiveModel] = useState<ContextMenuModel[] | null>(
    null,
  );
  const [activeItems, setActiveItems] = useState<ContextMenuType[] | null>(
    null,
  );

  const menuModel = activeModel ?? model;

  const onOpenSubMenu = () => {
    const currentItem = menuModel[currentIndex];
    if (
      !("items" in currentItem) ||
      !currentItem.items ||
      !currentItem.items.length
    ) {
      return;
    }

    setCurrentIndex(0);
    setActiveLevel((prevLevel) => prevLevel + 1);
    setActiveItems((items) =>
      items?.length ? [...items, currentItem] : [currentItem],
    );
    setActiveModel(currentItem.items);
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (!currentEvent.current || !menuModel || !withHotkeys) return e;

    const clearModel = [];
    for (const index in menuModel) {
      const item = menuModel[index];

      const withDisabled = showDisabledItems ? true : !item.disabled;
      if (!item.isSeparator && withDisabled) {
        clearModel.push({ ...item, index: Number(index) });
      }
    }

    if (!clearModel.length) return e;

    const clearModelIndex = clearModel.findIndex(
      (elem) => elem.key === menuModel[currentIndex].key,
    );

    switch (e.code) {
      case "ArrowDown":
        {
          if (currentIndex + 1 >= menuModel.length) {
            if (!clearModel[0].disabled) setCurrentIndex(clearModel[0].index);
          } else {
            const nextIndex = clearModel[clearModelIndex + 1].index;
            if (!clearModel[clearModelIndex + 1].disabled)
              setCurrentIndex(nextIndex);
          }
        }
        break;
      case "ArrowUp":
        {
          if (currentIndex - 1 < 0) {
            if (!clearModel.at(-1)?.disabled)
              setCurrentIndex(clearModel.at(-1)?.index ?? menuModel.length - 1);
          } else {
            const prevIndex = clearModel[clearModelIndex - 1].index;
            if (!clearModel[clearModelIndex - 1].disabled)
              setCurrentIndex(prevIndex);
          }
        }
        break;
      case "ArrowRight":
        onOpenSubMenu();
        break;
      case "ArrowLeft":
        {
          if (!activeItems || !activeItems.length) return;

          const prevItem =
            activeLevel !== activeItems?.length
              ? activeItems.at(-2)
              : activeItems.at(-1);

          const prevActiveItems =
            activeLevel !== activeItems?.length
              ? activeItems.at(-3)
              : activeItems.at(-2);

          const prevModel = prevActiveItems?.items ?? model;
          const prevModelIndex = prevModel?.findIndex(
            (x) => x.key === prevItem?.key,
          );

          setCurrentIndex(prevModelIndex > -1 ? prevModelIndex : 0);
          setActiveModel(prevModel);
          setActiveLevel((prevLevel) => prevLevel - 1);

          setActiveItems((prevActiveItems) => {
            if (!prevActiveItems) return prevActiveItems;
            return activeLevel !== prevActiveItems?.length
              ? prevActiveItems.slice(0, -2)
              : prevActiveItems.slice(0, -1);
          });
        }
        break;
      case "Enter": {
        const currentItem = clearModel[clearModelIndex];
        if ("items" in currentItem && currentItem.items) {
          onOpenSubMenu();
        } else if ("onClick" in currentItem && currentItem.onClick) {
          currentItem.onClick(e as unknown as TContextMenuValueTypeOnClick);
          hide(e);
        }
        break;
      }
      case "Escape": {
        hide(e);
        break;
      }
      default:
        return;
    }

    // e.preventDefault();
    // e.stopPropagation();
  };

  const onMouseMove = (
    index: number,
    model: ContextMenuModel[],
    level: number,
  ) => {
    setCurrentIndex(index);
    setActiveLevel(level);
    setActiveModel(model);
  };

  const setActiveHotkeysModel = (
    item: ContextMenuType,
    model: ContextMenuModel[],
    level: number,
  ) => {
    if (!item) return;

    const itemIndex = model.findIndex(({ key }) => key === item.key);

    setCurrentIndex(itemIndex);
    setActiveModel(model);
    setActiveLevel(level);

    if (level === 0) {
      const modelItem = model[itemIndex];
      if ("items" in modelItem && modelItem.items) {
        setActiveItems([modelItem]);
        return;
      }

      setActiveItems(null);
    } else {
      setActiveItems((prevItems) => {
        if (!prevItems) return prevItems;

        return item.items
          ? [...prevItems.slice(0, level), item]
          : prevItems.slice(0, level);
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  useEffect(() => {
    if (!visible) {
      setCurrentIndex(0);
      setActiveLevel(0);
      setActiveItems(null);
      setActiveModel(null);
    }
  }, [visible]);

  return {
    currentIndex,
    activeLevel,
    activeItems,
    setActiveItems,
    onMouseMove,
    setActiveHotkeysModel,
  };
};

export default useContextMenuHotkeys;
