import React from "react";

import classNames from "classnames";

import { Portal } from "../../portal";

import { isMobile as isMobileUtils } from "../../../utils";
import { Backdrop } from "../../backdrop";

import { Scrollbar } from "../../scrollbar";

import styles from "../Selector.module.scss";
import type { NewItemDropDownProps } from "../Selector.types";

export const DROPDOWN_CLASS_NAME = "selector-create-new-dropdown";

const DROPDOWN_CONTAINER_WITH_PADDING = 560;
const PADDING = 80;

const NewItemDropDown = ({
  dropDownItems,
  isEmpty,
  onCloseDropDown,
  listHeight,
}: NewItemDropDownProps) => {
  const [isMobile, setIsMobile] = React.useState(
    isMobileUtils(window.innerWidth),
  );

  React.useEffect(() => {
    window.addEventListener("mouseup", onCloseDropDown);

    return () => {
      window.removeEventListener("mouseup", onCloseDropDown);
    };
  }, [onCloseDropDown]);

  // The keyboard opens the menu from the list too: it takes the focus to its
  // first entry, walks the entries with the arrows, picks one with Enter or
  // Space, and closes on Escape or Tab, giving the focus back to the list.
  // Caught on the window ahead of the Selector, whose own Escape would close
  // the whole selector.
  // The menu is drawn in place or, at a phone's width, in a portal, and a
  // resize can swap one for the other while it is open: the keys always read
  // the menu that is on screen now, and the focus follows it to the new one.
  // The focus goes back to the element it came from on opening.
  const menuRef = React.useRef<HTMLDivElement>(null);
  const openerRef = React.useRef<Element | null>(null);
  React.useEffect(() => {
    openerRef.current = document.activeElement;
  }, []);

  const entries = React.useCallback(
    () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="option"], [role="menuitem"]',
        ) ?? [],
      ).filter((entry) => entry.getAttribute("aria-disabled") !== "true"),
    [],
  );

  React.useEffect(() => {
    if (menuRef.current?.contains(document.activeElement)) return;
    entries()[0]?.focus({ preventScroll: true });
  }, [entries, isMobile]);

  React.useEffect(() => {
    const giveFocusBack = () => {
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current) return;
      const list = entries();
      const index = list.findIndex((entry) => entry === document.activeElement);

      switch (e.key) {
        case "ArrowDown":
          list[(index + 1) % list.length]?.focus();
          break;
        case "ArrowUp":
          list[(index - 1 + list.length) % list.length]?.focus();
          break;
        case "Home":
          list[0]?.focus();
          break;
        case "End":
          list[list.length - 1]?.focus();
          break;
        case "Enter":
        case " ":
          list[index]?.click();
          onCloseDropDown();
          break;
        case "Escape":
        case "Tab":
          onCloseDropDown();
          giveFocusBack();
          break;
        default:
          return;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [entries, onCloseDropDown]);

  React.useEffect(() => {
    const onResize = () => {
      if (isMobileUtils(window.innerWidth)) return setIsMobile(true);

      setIsMobile(false);
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const dropDown =
    dropDownItems.length > 0 ? (
      <div
        ref={menuRef}
        className={classNames(
          styles.createDropDown,
          { [styles.isEmpty]: isEmpty },
          DROPDOWN_CLASS_NAME,
        )}
      >
        {listHeight && listHeight < DROPDOWN_CONTAINER_WITH_PADDING ? (
          <Scrollbar style={{ height: listHeight - PADDING }}>
            {dropDownItems.map((item) => item)}
          </Scrollbar>
        ) : (
          dropDownItems.map((item) => item)
        )}
      </div>
    ) : null;

  const portal =
    dropDownItems.length > 0 ? (
      <Portal
        visible
        element={
          <>
            <Backdrop
              visible
              onClick={() => onCloseDropDown()}
              withBackground
              isAside
              zIndex={450}
            />
            <div
              ref={menuRef}
              className={classNames(
                styles.createDropDown,
                { [styles.isEmpty]: isEmpty },
                DROPDOWN_CLASS_NAME,
              )}
            >
              {dropDownItems.map((item) => item)}
            </div>
          </>
        }
      />
    ) : null;

  return isMobile ? portal : dropDown;
};

export default NewItemDropDown;
