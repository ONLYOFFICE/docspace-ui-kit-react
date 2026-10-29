import React, { useEffect, useId, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import classNames from "classnames";

import ExpanderDownReactSvg from "../../assets/expander-down.react.svg";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Scrollbar } from "../scrollbar";
import { Text } from "../text";
import { consumeKey } from "../../utils/consume-key";

import styles from "./LinkWithDropdown.module.scss";
import { LinkWithDropDownProps } from "./LinkWithDropdown.types";

const LinkWithDropdown = ({
  isSemitransparent = false,
  dropdownType = "alwaysDashed",
  isTextOverflow = false,
  fontSize = "13px",
  fontWeight,
  color,
  isBold = false,
  title,
  className = "",
  data,
  id,
  style,
  isDisabled = false,
  directionX,
  directionY,
  hasScroll = false,
  withExpander = false,
  dropDownClassName,
  isOpen = false,
  children,
  manualWidth,
  isAside,
  withoutBackground,
  fixedDirection = false,
  isDefaultMode = true,
  topSpace,
  bottomSpace,
  withDynamicScrollbar,
  ...rest
}: LinkWithDropDownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState({
    isOpen,
    orientation: window.orientation,
  });

  const setIsOpen = (value: boolean) =>
    setState((s) => ({ ...s, isOpen: value }));

  const onSetOrientation = () => {
    setState((s) => ({ ...s, orientation: window.orientation }));
  };

  const onOpen = () => {
    if (isDisabled) return;
    setIsOpen(!state.isOpen);
  };

  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const menuId = `link-with-dropdown${useId().replace(/:/g, "")}-menu`;
  // Set when the list was opened by an arrow key: which item takes focus.
  const focusOnOpen = useRef<"first" | "last" | null>(null);

  // Only the entries a user can choose: separators (role="separator") and
  // headers render as rows too, and focusing one shows nothing chosen while
  // Enter on it closes the menu.
  const getItems = () =>
    Array.from(
      document
        .getElementById(menuId)
        ?.querySelectorAll<HTMLElement>(
          ".drop-down-item:not([role='separator']):not(.drop-down-item_header):not([aria-disabled='true'])",
        ) ?? [],
    );

  // The props type declares no handlers, but untyped callers spread them in.
  const { onKeyDown: callerOnKeyDown } = rest as typeof rest &
    Pick<React.HTMLAttributes<HTMLAnchorElement>, "onKeyDown">;

  const onKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    // A caller's onKeyDown runs first and can opt out of the built-in keys
    // with preventDefault().
    callerOnKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (isDisabled) return;

    if (e.key === "Enter" || e.key === " ") {
      // Space would otherwise scroll the page.
      e.preventDefault();
      consumeKey(e);
      onOpen();
      return;
    }

    // The arrows go into the list, opening it first if need be.
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      consumeKey(e);
      const target = e.key === "ArrowDown" ? "first" : "last";
      if (state.isOpen) {
        const items = getItems();
        (target === "first" ? items[0] : items.at(-1))?.focus();
      } else {
        focusOnOpen.current = target;
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape" && state.isOpen) {
      e.preventDefault();
      // Not to the dialog around it, which closes on Escape too.
      consumeKey(e);
      setIsOpen(false);
    }
  };

  // Opened by an arrow key: move focus into the list once its items are on
  // screen.
  useEffect(() => {
    if (!state.isOpen || !focusOnOpen.current) return;

    let frame = 0;
    let attempts = 0;
    const tryFocus = () => {
      const items = getItems();
      const target = focusOnOpen.current === "last" ? items.at(-1) : items[0];
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
    // getItems reads the DOM by menuId, which does not change.
  }, [state.isOpen]);

  // Roving focus inside the open list: arrows, Home and End move, Enter and
  // Space choose, Escape closes and returns to the link, Tab closes.
  useEffect(() => {
    if (!state.isOpen) return;
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const onMenuKeyDown = (e: KeyboardEvent) => {
      const items = getItems();
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
          triggerRef.current?.focus();
          return;
        case "Escape":
          e.preventDefault();
          consumeKey(e);
          setIsOpen(false);
          triggerRef.current?.focus();
          return;
        case "Tab":
          // The menu is portalled, so Tab from one of its items would leave
          // the page: the focus goes back to the link and Tab moves on from
          // there.
          triggerRef.current?.focus();
          setIsOpen(false);
          return;
        default:
      }
    };

    menu.addEventListener("keydown", onMenuKeyDown);
    return () => menu.removeEventListener("keydown", onMenuKeyDown);
    // getItems reads the DOM by menuId, which does not change.
  }, [state.isOpen, menuId]);

  const onCheckManualWidth = () => {
    const padding = 32;
    if (ref.current) {
      const width = ref.current
        .querySelector(".text")
        ?.getBoundingClientRect().width;
      if (width) return `${width + padding}px`;
    }
  };

  const onClose = (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (ref.current && ref.current.contains(target)) return;

    setIsOpen(!state.isOpen);
  };

  const onClickDropDownItem = (
    e:
      | React.MouseEvent<Element, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const { key } = currentTarget.dataset;
    const item = data?.find((x) => x.key === key);
    setIsOpen(!state.isOpen);
    if (item && "onClick" in item) item.onClick?.(e);
  };

  useEffect(() => {
    window.addEventListener("orientationchange", onSetOrientation);

    return () => {
      window.removeEventListener("orientationchange", onSetOrientation);
    };
  }, []);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [dropdownType, isOpen]);

  const showScroll = hasScroll && isMobileOnly;
  const scrollHeight = state.orientation === 90 ? 100 : 250;

  const dropDownItem = data?.map((item) => {
    const { key, ...restProp } = item;
    return (
      <DropDownItem
        key={key}
        {...restProp}
        className={classNames(styles.dropDownItem, "drop-down-item", {
          "drop-down-item_header": "isHeader" in item && item.isHeader,
        })}
        id={`${item.key}`}
        onClick={onClickDropDownItem}
        testId={`link_with_drop_down_${item.key}`}
        data-key={item.key}
        textOverflow={isTextOverflow}
      />
    );
  });

  const styledText = (
    <Text
      as="span"
      className={classNames(styles.text, {
        [styles.textOverflow]: isTextOverflow,
      })}
      truncate={isTextOverflow}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      isBold={isBold}
      title={title}
    >
      {children}
    </Text>
  );

  return (
    <span
      id={id}
      style={style}
      className={classNames(
        styles.span,
        { [styles.isOpen]: state.isOpen },
        className,
      )}
      data-test-id="link-dropdown"
      ref={ref}
    >
      <span onClick={onOpen}>
        <a
          className={classNames(
            styles.linkWithDropdown,
            {
              [styles.disabled]: isDisabled,
              [styles.semitransparent]: isSemitransparent,
              [styles.alwaysDashed]: dropdownType === "alwaysDashed",
              [styles.appearDashedAfterHover]:
                dropdownType === "appearDashedAfterHover",
            },
            className,
          )}
          // Unknown props first, so they cannot replace the keyboard wiring
          // below; a caller's onKeyDown is composed into ours instead.
          {...rest}
          style={{ color }}
          ref={triggerRef}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={state.isOpen}
          aria-controls={state.isOpen ? menuId : undefined}
          aria-disabled={isDisabled}
        >
          {withExpander ? (
            <div
              className={classNames(
                styles.textWithExpander,
                { [styles.isOpen]: state.isOpen },
                className,
              )}
            >
              {styledText}
              <ExpanderDownReactSvg className={styles.expander} />
            </div>
          ) : (
            styledText
          )}
        </a>
      </span>
      <DropDown
        className={
          // An explicit manualWidth is the width; the 200px cap only applies
          // to a menu that sizes itself.
          classNames(dropDownClassName || "", {
            "fixed-max-width": !manualWidth,
            [styles.fixedMaxWidth]: !manualWidth,
          }) || ""
        }
        manualWidth={
          manualWidth || (showScroll ? onCheckManualWidth() : undefined)
        }
        id={menuId}
        open={state.isOpen}
        fixedDirection={fixedDirection}
        isDefaultMode={isDefaultMode}
        forwardedRef={ref}
        directionX={directionX}
        directionY={directionY}
        clickOutsideAction={onClose}
        isAside={isAside}
        withoutBackground={withoutBackground}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
        withDynamicScrollbar={withDynamicScrollbar}
        {...rest}
      >
        {showScroll ? (
          <Scrollbar
            className="scroll-drop-down-item"
            style={{ height: scrollHeight }}
          >
            {dropDownItem}
          </Scrollbar>
        ) : (
          dropDownItem
        )}
      </DropDown>
    </span>
  );
};

export { LinkWithDropdown };
