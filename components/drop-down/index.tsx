"use client";

import type React from "react";
import { isMobile } from "react-device-detect";

import { Backdrop } from "../backdrop";

import type { DropDownProps } from "./DropDown.types";
import { EnhancedComponent } from "./DropDown";

// Two separate event names: `addEventListener` takes one name per call, so
// a single "click, touchend" string would listen for an event that never fires.
const MOBILE_EVENT_TYPES = ["click", "touchend"];

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
    backDrop: customBackDrop,
  } = props;

  const toggleDropDown = (e: React.MouseEvent) => {
    clickOutsideAction?.({} as Event, !open);
    e.stopPropagation();
  };

  const eventTypesProp = forceCloseClickOutside
    ? {}
    : isMobile
      ? { eventTypes: MOBILE_EVENT_TYPES }
      : eventTypes
        ? { eventTypes }
        : {};

  const builtBackDrop = withBackdrop ? (
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

  const backDrop =
    customBackDrop !== undefined ? customBackDrop : builtBackDrop;

  // The backdrop is rendered exactly once: here, beside the menu, or inside
  // the portal with `usePortalBackdrop`.
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
        {...props}
        backDrop={usePortalBackdrop ? backDrop : null}
      />
    </>
  );
};

export { DropDown };
