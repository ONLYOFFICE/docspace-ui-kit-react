"use client";

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
