"use client";

import type React from "react";
import { isMobile } from "react-device-detect";

import { Backdrop } from "../backdrop";

import type { DropDownProps } from "./DropDown.types";
import { EnhancedComponent } from "./DropDown";

const DropDown = (props: DropDownProps) => {
  const {
    clickOutsideAction,
    open,
    withBackdrop = true,

    isAside,
    withBackground,
    eventTypes,
    forceCloseClickOutside,
    withoutBackground,

    showDisabledItems = false,
    isDefaultMode = true,
    fixedDirection = false,
    offsetX = 0,
    enableKeyboardEvents = true,
    usePortalBackdrop = false,
    shouldShowBackdrop = false,
  } = props;

  const toggleDropDown = (e: React.MouseEvent) => {
    clickOutsideAction?.({} as Event, !open);
    e.stopPropagation();
  };

  const eventTypesProp = forceCloseClickOutside
    ? {}
    : isMobile
      ? { eventTypes: ["click, touchend"] }
      : eventTypes
        ? { eventTypes }
        : {};

  const backDrop = withBackdrop ? (
    <Backdrop
      visible={open || false}
      zIndex={usePortalBackdrop ? 400 : 199}
      onClick={toggleDropDown}
      isAside={isAside}
      withBackground={withBackground}
      withoutBackground={withoutBackground}
      shouldShowBackdrop={shouldShowBackdrop}
    />
  ) : null;

  return (
    <>
      {!usePortalBackdrop ? backDrop : null}
      <EnhancedComponent
        {...eventTypesProp}
        showDisabledItems={showDisabledItems}
        isDefaultMode={isDefaultMode}
        fixedDirection={fixedDirection}
        offsetX={offsetX}
        enableKeyboardEvents={enableKeyboardEvents}
        backDrop={backDrop}
        {...props}
      />
    </>
  );
};

export { DropDown };
