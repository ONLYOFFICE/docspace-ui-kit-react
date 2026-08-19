"use client";

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

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VariableSizeList } from "react-window";
import { Scrollbar } from "../../scrollbar";
import type { VirtualListProps } from "../DropDown.types";

const VirtualList = ({
  Row,
  width,
  isOpen,
  children,
  itemCount,
  maxHeight,
  cleanChildren,
  calculatedHeight,
  isNoFixedHeightOptions,
  disableScrollbarPadding,
  useFlexibleHeight,
  getItemSize,
  enableKeyboardEvents,
}: VirtualListProps) => {
  const listRef = useRef<VariableSizeList>(null);

  const activeIndex = useMemo(() => {
    let foundIndex = -1;
    React.Children.forEach(cleanChildren, (child, index) => {
      if (
        React.isValidElement(child) &&
        (child.props as { disabled?: boolean })?.disabled
      ) {
        foundIndex = index;
      }
    });
    return foundIndex;
  }, [cleanChildren]);

  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const currentIndexRef = useRef<number>(activeIndex);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!listRef.current || !isOpen) return;

      event.preventDefault();

      let index = currentIndexRef.current;

      if (!children || !Array.isArray(children)) {
        return;
      }

      switch (event.code) {
        case "ArrowDown": {
          if (children?.[index + 1]) index += 1;
          else index = 0;
          break;
        }

        case "ArrowUp":
          if (children?.[index - 1]) index -= 1;
          else index = children.length - 1;
          break;
        case "Enter":
          return (
            children[index] &&
            React.isValidElement(children?.[index]) &&
            children?.[index]?.props?.onClick()
          );
        default:
          return;
      }

      setCurrentIndex(index);
      currentIndexRef.current = index;
      listRef.current.scrollToItem(index, "smart");
    },
    [isOpen, children],
  );

  const handleMouseMove = useCallback((index: number) => {
    if (currentIndexRef.current === index) return;
    setCurrentIndex(index);
    currentIndexRef.current = index;
  }, []);

  useEffect(() => {
    if (isOpen && maxHeight && enableKeyboardEvents) {
      window.addEventListener("keydown", handleKeyDown);
    }

    const list = listRef.current;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (itemCount > 0 && list) {
        setCurrentIndex(activeIndex);
        currentIndexRef.current = activeIndex;
        list.scrollToItem(activeIndex, "smart");
      }
    };
  }, [
    isOpen,
    activeIndex,
    maxHeight,
    enableKeyboardEvents,
    itemCount,
    handleKeyDown,
  ]);

  if (!maxHeight) return cleanChildren || children;

  return isNoFixedHeightOptions ? (
    <Scrollbar
      style={
        useFlexibleHeight ? { maxHeight, width: "100%" } : { height: maxHeight }
      }
      className={disableScrollbarPadding ? "scroll-drop-down-item" : undefined}
      paddingInlineEnd={disableScrollbarPadding ? "0" : undefined}
    >
      {cleanChildren}
    </Scrollbar>
  ) : (
    <VariableSizeList
      ref={listRef}
      width={width}
      itemCount={itemCount}
      itemSize={getItemSize}
      height={calculatedHeight}
      itemData={{
        children: cleanChildren,
        activeIndex,
        activedescendant: currentIndex,
        handleMouseMove,
      }}
      outerElementType={Scrollbar}
    >
      {Row}
    </VariableSizeList>
  );
};

VirtualList.displayName = "VirtualList";

export { VirtualList };
