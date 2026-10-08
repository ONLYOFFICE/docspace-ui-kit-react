import React from "react";
import type { DebouncedFunc } from "lodash";
import throttle from "lodash/throttle";
import { isTablet as Tablet } from "react-device-detect";
import classNames from "classnames";

import VerticalDotsReactSvg from "../../assets/icons/16/vertical-dots.react.svg";

import { isTablet, isMobile } from "../../utils";
import { consumeKey } from "../../utils/consume-key";

import { DropDownItem } from "../drop-down-item";
import { DropDown } from "../drop-down";
import { IconButton } from "../icon-button";

import type { ContextMenuModel } from "../context-menu";

import styles from "./ContextMenuButton.module.scss";
import type { ContextMenuButtonProps } from "./ContextMenuButton.types";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const OUTSIDE_CLICK_EVENTS = ["click", "mousedown"];

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

type TFocusTarget = "first" | "last" | null;

const ContextMenuButtonPure = ({
  opened = false,
  data = [],
  displayType = ContextMenuButtonDisplayType.dropdown,
  onClose,
  isDisabled = false,
  getData,
  onClick,
  className,
  iconOpenName,
  id,
  style,
  displayIconBorder = false,
  iconClassName,
  color,
  hoverColor,
  clickColor,
  size = 16,
  iconHoverName,
  iconClickName,
  isFill = true,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  onMouseOver,
  title = "",
  dropDownClassName,
  directionX = "left",
  directionY,
  columnCount,
  zIndex,
  usePortal = true,
  iconName,
  fixedDirection = false,
  testId,
}: ContextMenuButtonProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);
  const reactId = React.useId();
  const menuId = `${id ?? `context-menu-button${reactId.replace(/:/g, "")}`}-menu`;
  // Set when the menu was opened from the keyboard: which item takes focus.
  const focusOnOpen = React.useRef<TFocusTarget>(null);
  const throttledResize = React.useRef<null | DebouncedFunc<() => void>>(null);

  const [state, setState] = React.useState({
    isOpen: opened,
    data,
    displayType: ContextMenuButtonDisplayType.dropdown,
    offsetX: 0,
    offsetY: 0,
  });

  const getTypeByWidth = React.useCallback(() => {
    if (displayType !== "auto") return displayType;

    return ContextMenuButtonDisplayType.dropdown;
  }, [displayType]);

  React.useEffect(() => {
    const type = displayType === "auto" ? getTypeByWidth() : displayType;

    setState((s) => ({ ...s, displayType: type }));
  }, [displayType, getTypeByWidth]);

  const resize = React.useCallback(() => {
    if (displayType !== "auto") return;

    const type = getTypeByWidth();

    setState((s) => {
      if (type === state.displayType) return s;

      return { ...s, displayType: type };
    });
  }, [displayType, getTypeByWidth, state.displayType]);

  React.useEffect(() => {
    throttledResize.current = throttle(resize, 300);

    window.addEventListener("resize", throttledResize.current);

    return () => {
      if (throttledResize.current) {
        window.removeEventListener("resize", throttledResize.current);
        throttledResize.current.cancel();
      }
    };
  }, [resize]);

  const toggle = React.useCallback((o?: boolean) => {
    setState((s) => ({
      ...s,
      isOpen: typeof o === "boolean" ? o : !s.isOpen,
    }));
  }, []);

  const isOpenRef = React.useRef(state.isOpen);
  isOpenRef.current = state.isOpen;

  const onCloseAction = React.useCallback(() => {
    if (!isOpenRef.current) return;

    isOpenRef.current = false;

    setState((s) => ({ ...s, isOpen: false }));
    onClose?.();
  }, [onClose]);

  React.useEffect(() => {
    toggle(opened);
  }, [toggle, opened]);

  React.useEffect(() => {
    setState((s) => ({ ...s, displayType: getTypeByWidth() }));
  }, [getTypeByWidth]);

  const readData = () => (getData ? getData() : data);

  const openMenu = (
    e: React.MouseEvent | React.KeyboardEvent,
    focusTarget: TFocusTarget = null,
  ) => {
    focusOnOpen.current = focusTarget;
    setState((s) => ({ ...s, data: readData(), isOpen: true }));
    // onClick reports the click that opens the menu.
    onClick?.(e as React.MouseEvent);
  };

  const onIconButtonClick = (e: React.MouseEvent) => {
    if (isDisabled || state.displayType === "toggle") {
      e.preventDefault();

      return;
    }

    // Every close goes through onCloseAction, so onClose pairs with onClick.
    if (state.isOpen) {
      onCloseAction();
      return;
    }

    openMenu(e);
  };

  const focusButton = () => buttonRef.current?.focus();

  const getMenuItems = () =>
    Array.from(
      document
        .getElementById(menuId)
        ?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? [],
    );

  const onIconButtonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    const { key } = e;

    if (state.displayType === "toggle") {
      if (key !== "Enter" && key !== " ") return;
      e.preventDefault();
      consumeKey(e);
      setState((s) => ({ ...s, data: readData() }));
      onClick?.(e as unknown as React.MouseEvent);
      return;
    }

    if (key === "Enter" || key === " " || key === "ArrowDown") {
      e.preventDefault();
      consumeKey(e);
      if (state.isOpen && key !== "ArrowDown") onCloseAction();
      else if (state.isOpen) getMenuItems()[0]?.focus();
      else openMenu(e, "first");
      return;
    }

    if (key === "ArrowUp") {
      e.preventDefault();
      consumeKey(e);
      if (state.isOpen) getMenuItems().at(-1)?.focus();
      else openMenu(e, "last");
      return;
    }

    if (key === "Escape" && state.isOpen) {
      e.preventDefault();
      consumeKey(e);
      onCloseAction();
    }
  };

  // Keyboard-opened: move focus into the menu once its items are on screen.
  React.useEffect(() => {
    if (!state.isOpen || !focusOnOpen.current) return;

    let frame = 0;
    let attempts = 0;

    const tryFocus = () => {
      const items = getMenuItems();
      const target =
        focusOnOpen.current === "last" ? items.at(-1) : items.at(0);
      target?.focus();

      if (target && document.activeElement === target) {
        focusOnOpen.current = null;
        return;
      }

      attempts += 1;
      if (attempts < 20) frame = requestAnimationFrame(tryFocus);
    };

    tryFocus();

    return () => cancelAnimationFrame(frame);
    // getMenuItems reads the DOM by menuId, which does not change.
  }, [state.isOpen, state.data]);

  // Roving focus inside the open menu: arrows, Home/End, Enter/Space,
  // Escape and Tab, as in the WAI-ARIA menu button pattern.
  React.useEffect(() => {
    if (!state.isOpen) return;

    const menu = document.getElementById(menuId);
    if (!menu) return;

    const onMenuKeyDown = (e: KeyboardEvent) => {
      const items = getMenuItems();
      const current = items.indexOf(document.activeElement as HTMLElement);

      const move = (index: number) => {
        e.preventDefault();
        consumeKey(e);
        items[(index + items.length) % items.length]?.focus();
      };

      switch (e.key) {
        case "ArrowDown":
          return move(current + 1);
        case "ArrowUp":
          return move(current - 1);
        case "Home":
          return move(0);
        case "End":
          return move(items.length - 1);
        case "Enter":
        case " ":
          if (current === -1) return;
          e.preventDefault();
          consumeKey(e);
          items[current].click();
          focusButton();
          return;
        case "Escape":
          e.preventDefault();
          consumeKey(e);
          onCloseAction();
          focusButton();
          return;
        case "Tab":
          onCloseAction();
          return;
        default:
      }
    };

    menu.addEventListener("keydown", onMenuKeyDown);

    return () => menu.removeEventListener("keydown", onMenuKeyDown);
    // getMenuItems and focusButton only read refs and the stable menuId.
  }, [state.isOpen, menuId, onCloseAction]);

  const clickOutsideAction = (e: Event) => {
    const path = e.composedPath?.();
    const dropDownItem = path
      ? path.find((x: EventTarget) => x === ref.current)
      : null;

    if (dropDownItem) return;

    onCloseAction();
  };

  const getLabel = (item: ContextMenuModel) => {
    return item && "label" in item ? item.label : "";
  };

  const onDropDownItemClick = (
    item: ContextMenuModel,
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ("onClick" in item) {
      const open = state.displayType === "dropdown";
      item.onClick?.({ originalEvent: e, action: open, item });
    }
    onCloseAction();
  };

  const callNewMenu = (e: React.MouseEvent) => {
    if (isDisabled || state.displayType !== "toggle") {
      e.preventDefault();
      return;
    }

    setState((s) => ({ ...s, data: readData() }));
    onClick?.(e);
  };

  const isDropdown = state.displayType !== ContextMenuButtonDisplayType.toggle;
  const items = getData ? state.data : data;

  const iconButtonName = state.isOpen && iconOpenName ? iconOpenName : iconName;
  const iconButtonNode = !iconButtonName ? <VerticalDotsReactSvg /> : undefined;

  return (
    <div
      className={classNames(styles.outer, className, "context-menu-button", {
        [styles.displayIconBorder]: displayIconBorder,
      })}
      id={id}
      style={style}
      data-testid={testId ?? "context-menu-button"}
      onClick={callNewMenu}
      ref={ref}
      aria-disabled={isDisabled}
    >
      <IconButton
        className={iconClassName}
        color={color}
        hoverColor={hoverColor}
        clickColor={clickColor}
        size={size}
        iconName={iconButtonName}
        iconNode={iconButtonNode}
        iconHoverName={iconHoverName}
        iconClickName={iconClickName}
        isFill={isFill}
        isDisabled={isDisabled}
        onClick={onIconButtonClick}
        onKeyDown={onIconButtonKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={title}
        tabIndex={isDisabled ? -1 : 0}
        {...{
          ref: buttonRef,
          role: "button",
          onMouseOver,
          onMouseOut,
        }}
        aria-label={title || undefined}
        aria-haspopup={isDropdown ? "menu" : undefined}
        aria-expanded={isDropdown ? state.isOpen : undefined}
        aria-controls={isDropdown && state.isOpen ? menuId : undefined}
      />{" "}
      {state.displayType === ContextMenuButtonDisplayType.dropdown ? (
        <DropDown
          className={dropDownClassName}
          fixedDirection={fixedDirection}
          directionX={directionX}
          directionY={directionY}
          open={state.isOpen}
          forwardedRef={ref}
          clickOutsideAction={clickOutsideAction}
          columnCount={columnCount}
          withBackdrop={isTablet() || isMobile() || Tablet}
          withoutBackground
          zIndex={zIndex}
          isDefaultMode={usePortal}
          eventTypes={OUTSIDE_CLICK_EVENTS}
          id={menuId}
          role="menu"
        >
          {items?.map((item: ContextMenuModel, index: number) => {
            if (!item) return null;
            const { key, ...rest } = item;
            return (
              item && (
                <DropDownItem
                  key={key || index}
                  {...rest}
                  id={item.id}
                  testId={item?.dataTestId ?? `${key}_item`}
                  label={getLabel(item)}
                  role="menuitem"
                  onClick={(
                    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
                  ) => onDropDownItemClick(item, e)}
                />
              )
            );
          })}
        </DropDown>
      ) : null}
    </div>
  );
};

export { ContextMenuButtonPure };

// A plain shallow comparison: every prop reaches the component.
export const ContextMenuButton = React.memo(ContextMenuButtonPure);
