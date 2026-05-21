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

import React from "react";
import classNames from "classnames";
import { isIOS, isMobile } from "react-device-detect";

import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";

import { DomHelpers } from "../../utils";
import type { TDirectionX } from "../../types";

import { Portal } from "../portal";

import { Scrollbar } from "../scrollbar";

import { VirtualList } from "./sub-components/VirtualList";
import { Row } from "./sub-components/Row";

import type { DropDownProps } from "./DropDown.types";
import { DEFAULT_PARENT_HEIGHT } from "./DropDown.constants";
import { getItemHeight, hideDisabledItems } from "./DropDown.utils";
import styles from "./DropDown.module.scss";

const DropDown = ({
  directionY = "bottom",
  directionX = "right",

  open,
  enableOnClickOutside,
  isDefaultMode = true,
  fixedDirection = false,
  forwardedRef,
  offsetX = 0,
  children,
  maxHeight,
  showDisabledItems,
  isMobileView,
  isNoFixedHeightOptions,
  disableScrollbarPadding,
  useFlexibleHeight,
  enableKeyboardEvents,
  appendTo,
  eventTypes,
  zIndex,
  clickOutsideAction,
  manualWidth,
  manualX,
  manualY,
  className,
  style,
  topSpace,
  bottomSpace,
  withDynamicScrollbar,
  backDrop,
  dataTestId,
}: DropDownProps) => {
  const { isRTL } = useInterfaceDirection();

  const dropDownRef = React.useRef<null | HTMLDivElement>(null);

  const [state, setState] = React.useState({
    directionX,
    directionY,
    manualY,
    width: 0,
    isDropdownReady: false, // need to avoid scrollbar appearing during dropdown position calculation
    dynamicMaxHeight: undefined as number | undefined,
  });

  const checkPositionPortal = React.useCallback(() => {
    const parent = forwardedRef;

    if (!parent?.current || fixedDirection) {
      setState((s) => ({
        ...s,
        isDropdownReady: true,
        width: dropDownRef.current?.offsetWidth || 0,
      }));
      return;
    }

    const dropDown = dropDownRef.current;

    const parentRects = parent.current.getBoundingClientRect();

    const dropDownHeight = dropDown?.offsetParent
      ? dropDown.offsetHeight
      : DomHelpers.getHiddenElementOuterHeight(dropDown);

    let { bottom } = parentRects;

    const viewport = DomHelpers.getViewport();
    const scrollBarWidth =
      viewport.width - document.documentElement.clientWidth;

    const dropDownRects = dropDown?.getBoundingClientRect();

    let dynamicMaxHeight: number | undefined;

    if (withDynamicScrollbar) {
      // --- withDynamicScrollbar: own direction, height constraint and positioning ---
      const availableBelow =
        viewport.height - parentRects.bottom - (bottomSpace ?? 0);
      const availableAbove = parentRects.top - (topSpace ?? 0);

      const goingUp =
        directionY === "top" ||
        (directionY === "both" &&
          dropDownHeight > availableBelow &&
          availableAbove > availableBelow);

      const available = (goingUp ? availableAbove : availableBelow) - 8;

      if (available > 0 && dropDownHeight > available)
        dynamicMaxHeight = available;

      if (goingUp) {
        bottom -=
          parent.current.clientHeight + (dynamicMaxHeight ?? dropDownHeight);
        if (topSpace && bottom < 0) bottom = topSpace;
      }
    } else {
      if (
        directionY === "top" ||
        (directionY === "both" &&
          parentRects.bottom + dropDownHeight > viewport.height)
      ) {
        bottom -= parent.current.clientHeight + dropDownHeight;
        if (topSpace && bottom < 0) bottom = topSpace;
      }
    }

    if (dropDown && dropDownRects) {
      // directionX logic

      // Check available space around the parent
      const hasRightSpace =
        parentRects.left + dropDownRects.width + offsetX < viewport.width;
      const hasLeftSpace =
        parentRects.right - dropDownRects.width - offsetX > 0;
      const hasNoSpace = !hasRightSpace && !hasLeftSpace;

      // Determine if start/end alignment is possible
      const canAlignStart = isRTL ? hasLeftSpace : hasRightSpace;
      const canAlignEnd = isRTL ? hasRightSpace : hasLeftSpace;

      // Alignment functions
      const alignToParentStart = () => {
        const left = isRTL
          ? parentRects.right - dropDownRects.width - scrollBarWidth - offsetX
          : parentRects.left + offsetX;

        dropDown.style.left = `${left}px`;
      };

      const alignToParentEnd = () => {
        const left = isRTL
          ? parentRects.left - scrollBarWidth + offsetX
          : parentRects.right - dropDownRects.width - offsetX;

        dropDown.style.left = `${left}px`;
      };

      const alignToViewportStart = () => {
        const left = isRTL ? viewport.width - dropDownRects.width : 0;

        dropDown.style.left = `${left}px`;
      };

      // Alignment logic based on direction and space
      const alignMap: Record<TDirectionX | "hasNoSpace", () => void> = {
        right: canAlignStart ? alignToParentStart : alignToParentEnd,
        left: canAlignEnd ? alignToParentEnd : alignToParentStart,
        hasNoSpace: alignToViewportStart,
      };

      // Apply alignment
      const setAlignment = alignMap[hasNoSpace ? "hasNoSpace" : directionX];
      setAlignment();
    }
    // --- Apply position and update state ---
    if (dropDownRef.current)
      dropDownRef.current.style.top = `${bottom + window.scrollY}px`;

    setState((s) => ({
      ...s,
      directionX,
      directionY,
      width: dropDownRef.current ? dropDownRef.current.offsetWidth : 240,
      isDropdownReady: true,
      dynamicMaxHeight,
    }));
  }, [
    directionX,
    directionY,
    fixedDirection,
    forwardedRef,
    offsetX,
    isRTL,
    topSpace,
    bottomSpace,
    withDynamicScrollbar,
  ]);

  const checkPosition = React.useCallback(() => {
    if (!dropDownRef.current || fixedDirection) {
      setState((s) => ({
        ...s,
        isDropdownReady: true,
        width: dropDownRef.current?.offsetWidth || 0,
      }));
      return;
    }

    const rects = dropDownRef.current.getBoundingClientRect();
    const parentRects = forwardedRef?.current?.getBoundingClientRect();

    const container = DomHelpers.getViewport();

    const dimensions = parentRects
      ? {
          toTopCorner: parentRects.top,
          parentHeight: parentRects.height,
          containerHeight: container.height,
        }
      : {
          toTopCorner: rects.top,
          parentHeight: DEFAULT_PARENT_HEIGHT,
          containerHeight: container.height,
        };

    let left = false;
    let rightVar = false;

    if (isRTL) {
      left = rects.left < 0 && rects.width < container.width;
      rightVar = rects.right > container.width && rects.width < container.width;
    } else {
      left = rects.right > container.width && rects.width < container.width;
      rightVar = rects.left < 0 && rects.width < container.width;
    }

    const topVar =
      rects.bottom > dimensions.containerHeight &&
      dimensions.toTopCorner > rects.height;
    const bottom = rects.top < 0;

    setState((s) => {
      const x = left ? "left" : rightVar ? "right" : s.directionX;
      const y = bottom ? "bottom" : topVar ? "top" : s.directionY;
      const mY = topVar ? `${dimensions.parentHeight}px` : s.manualY;

      return {
        ...s,
        directionX: x,
        directionY: y,
        manualY: mY,
        width: dropDownRef.current ? dropDownRef.current.offsetWidth : 240,
        isDropdownReady: true,
      };
    });
  }, [fixedDirection, isRTL, forwardedRef]);

  const setDropDownRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      dropDownRef.current = node;

      if (node && open) {
        if (isDefaultMode) {
          checkPositionPortal();
        } else {
          checkPosition();
        }
      }
    },
    [open, isDefaultMode, checkPositionPortal, checkPosition],
  );

  const renderDropDown = () => {
    const directionXStylesDisabled =
      isDefaultMode && forwardedRef?.current && !fixedDirection;

    let cleanChildren = children;
    let itemCount = children ? React.Children.toArray(children).length : 0;

    if (!showDisabledItems) {
      cleanChildren = hideDisabledItems(cleanChildren);
      if (cleanChildren)
        itemCount = React.Children.toArray(cleanChildren).length;
    }

    const rowHeights =
      cleanChildren &&
      Array.isArray(cleanChildren) &&
      React.Children.map(cleanChildren, (child: React.ReactElement) => {
        return getItemHeight(child);
      });

    const getItemSize = (index: number) =>
      (rowHeights && rowHeights[index]) as number;
    const fullHeight =
      (cleanChildren &&
        rowHeights &&
        rowHeights.reduce((a: number, b: number) => a + b, 0)) ||
      0;
    // --- withDynamicScrollbar: override maxHeight with computed viewport-aware value ---
    const useDynamicScrollbar =
      withDynamicScrollbar && !!state.dynamicMaxHeight;
    const effectiveMaxHeight = useDynamicScrollbar
      ? state.dynamicMaxHeight
      : maxHeight;

    const calculatedHeight =
      fullHeight > 0 && effectiveMaxHeight && fullHeight < effectiveMaxHeight
        ? fullHeight
        : effectiveMaxHeight;

    const dropDownMaxHeightProp = maxHeight
      ? { height: `${calculatedHeight}px` }
      : {};

    const dropDownStyles: React.CSSProperties = {
      ...dropDownMaxHeightProp,
      ...style,
      ["--z-index" as string]: zIndex,
      ["--max-height" as string]: maxHeight && `${maxHeight}px`,
      ["--manual-width" as string]: manualWidth,
      ["--manual-x" as string]: manualX,
      ["--manual-y" as string]: state.manualY,
      // withDynamicScrollbar: lock width to prevent Scrollbar internals from collapsing it
      ...(useDynamicScrollbar && state.width ? { width: state.width } : {}),
    };

    const dropDownClasses = classNames(styles.dropDown, className, {
      "dropdown-container": true,
      "not-selectable": true,
      [styles.directionTop]: state.directionY === "top",
      [styles.directionBottom]: state.directionY === "bottom",
      [styles.directionRight]:
        state.directionX === "right" && !directionXStylesDisabled,
      [styles.directionLeft]:
        state.directionX === "left" && !directionXStylesDisabled,
      [styles.open]: open,
      [styles.mobileView]: isMobileView,
      [styles.directionXStylesDisabled]: directionXStylesDisabled,
      [styles.maxHeight]: maxHeight,
      [styles.withManualWidth]: manualWidth,
      [styles.notReady]: !state.isDropdownReady,
      [styles.useFlexibleHeight]: useFlexibleHeight,
    });

    return (
      <>
        {isDefaultMode ? backDrop : null}

        <div
          ref={setDropDownRef}
          style={dropDownStyles}
          className={dropDownClasses}
          data-testid={dataTestId ?? "dropdown"}
          role="listbox"
        >
          {/* withDynamicScrollbar: use project Scrollbar instead of VirtualList */}
          {useDynamicScrollbar ? (
            <Scrollbar
              className="scroll-drop-down-item"
              style={{ height: state.dynamicMaxHeight! - 16 }}
            >
              {cleanChildren}
            </Scrollbar>
          ) : (
            <VirtualList
              Row={Row}
              width={state.width}
              itemCount={itemCount}
              maxHeight={maxHeight}
              cleanChildren={cleanChildren}
              calculatedHeight={calculatedHeight || 0}
              isNoFixedHeightOptions={isNoFixedHeightOptions ?? false}
              disableScrollbarPadding={disableScrollbarPadding}
              useFlexibleHeight={useFlexibleHeight}
              getItemSize={getItemSize}
              isOpen={open ?? false}
              enableKeyboardEvents={enableKeyboardEvents ?? false}
            >
              {children}
            </VirtualList>
          )}
        </div>
      </>
    );
  };

  React.useLayoutEffect(() => {
    const resizeListener = () => {
      if (isDefaultMode) {
        checkPositionPortal();
      } else {
        checkPosition();
      }
    };

    let scrollRafId: number | null = null;

    const scrollListener = (e: Event) => {
      if (dropDownRef.current?.contains(e.target as Node)) return;

      if (scrollRafId !== null) return;

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        checkPositionPortal();
      });
    };

    if (open) {
      enableOnClickOutside?.();

      window.addEventListener("resize", resizeListener);

      if (isDefaultMode) {
        window.addEventListener("scroll", scrollListener, true);
      }

      if (isIOS && isMobile)
        window.visualViewport?.addEventListener("resize", resizeListener);
    } else {
      window.removeEventListener("resize", resizeListener);

      if (isDefaultMode) {
        window.removeEventListener("scroll", scrollListener, true);
      }

      if (isIOS && isMobile)
        window.visualViewport?.removeEventListener("resize", resizeListener);
    }

    return () => {
      // withDynamicScrollbar: reset dynamicMaxHeight so stale value doesn't affect next open
      setState((s) => ({
        ...s,
        isDropdownReady: false,
        dynamicMaxHeight: undefined,
      }));
      window.removeEventListener("resize", resizeListener);

      if (isDefaultMode) {
        window.removeEventListener("scroll", scrollListener, true);
        if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
      }

      if (isIOS && isMobile)
        window.visualViewport?.removeEventListener("resize", resizeListener);
    };
  }, [
    checkPosition,
    checkPositionPortal,
    enableOnClickOutside,

    isDefaultMode,
    open,
  ]);

  React.useEffect(() => {
    if (!dropDownRef.current) return;

    const listener = (evt: Event) => {
      const target = evt.target as HTMLElement;

      if (dropDownRef.current?.contains(target)) return;

      clickOutsideAction?.(evt, !open);
    };

    const types: string[] = !eventTypes
      ? []
      : Array.isArray(eventTypes)
        ? eventTypes
        : [eventTypes];

    if (!open) {
      types?.forEach((type) => {
        window.removeEventListener(type, listener);
      });

      return;
    }

    types?.forEach((type) => {
      window.addEventListener(type, listener);
    });

    return () => {
      types?.forEach((type) => {
        window.removeEventListener(type, listener);
      });
    };
  }, [clickOutsideAction, eventTypes, open]);

  const element = renderDropDown();

  if (isDefaultMode) {
    return <Portal element={element} appendTo={appendTo} />;
  }

  return element;
};

const EnhancedComponent = DropDown;

export { EnhancedComponent };
