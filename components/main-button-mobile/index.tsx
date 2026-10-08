import React, {
  useId,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
} from "react";
import { isIOS, isMobile } from "react-device-detect";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import ButtonAlertReactSvg from "../../assets/button.alert.react.svg";
import { consumeKey } from "../../utils/consume-key";

import { Scrollbar } from "../scrollbar";
import { Backdrop } from "../backdrop";
import { FloatingButton, FloatingButtonIcons } from "../floating-button";
import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";

import "./MainButtonMobile.theme.scss";
import styles from "./MainButtonMobile.module.scss";

import SubmenuItem from "./sub-components/SubmenuItem";
import {
  ActionOption,
  ButtonOption,
  MainButtonMobileProps,
} from "./MainButtonMobile.types";

const MainButtonMobile = (props: MainButtonMobileProps) => {
  const {
    ref,
    className,
    style,
    opened,
    actionOptions,
    buttonOptions,
    withoutButton,
    manualWidth,
    isOpenButton,
    onClose,
    onOpen,
    alert,
    withMenu = true,
    onClick,
    onAlertClick,
    withAlertClick,
    dropdownStyle,
  } = props;

  const { t } = useTranslation(["Common"]);
  const [isOpen, setIsOpen] = useState(opened);
  const sheetId = useId();

  const [height, setHeight] = useState(`${window.innerHeight - 48}px`);
  const [openedSubmenuKey, setOpenedSubmenuKey] = useState("");

  const divRef = useRef<HTMLDivElement | null>(null);
  const dropDownRef = useRef(null);

  const scrollElem = useRef<null | HTMLElement>(null);
  const currentPosition = useRef<null | number>(null);
  const prevPosition = useRef<null | number>(null);
  const buttonBackground = useRef<boolean>(false);

  const mainButtonRef = useRef<HTMLDivElement | null>(null);
  const floatingButtonRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    contains: (target: HTMLElement) => {
      return mainButtonRef.current
        ? mainButtonRef.current.contains(target)
        : false;
    },
    getButtonElement: () => mainButtonRef,
  }));

  useEffect(() => {
    setIsOpen(opened);
  }, [opened]);

  // The latest values, for listeners that are attached once.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handlePopState = () => {
      if (isOpenRef.current) onCloseRef.current?.();
      setIsOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const setDialogBackground = (scrollHeight: number) => {
    if (!buttonBackground.current) {
      scrollElem.current?.classList.add("dialog-background-scroll");
    }
    if (currentPosition.current && currentPosition.current < scrollHeight / 3) {
      buttonBackground.current = false;
    }
  };

  const setButtonBackground = React.useCallback(() => {
    buttonBackground.current = true;
    if (scrollElem.current)
      scrollElem.current.classList.remove("dialog-background-scroll");
  }, []);

  const scrollChangingBackground = React.useCallback(() => {
    if (scrollElem.current) {
      currentPosition.current = scrollElem.current.scrollTop;
      const { scrollHeight } = scrollElem.current;

      if (
        prevPosition.current !== null &&
        currentPosition.current < prevPosition.current
      ) {
        setDialogBackground(scrollHeight);
      } else if (
        currentPosition.current &&
        prevPosition.current &&
        currentPosition.current > 0 &&
        currentPosition.current > prevPosition.current
      ) {
        setButtonBackground();
      }
      prevPosition.current = currentPosition.current;
    }
  }, [setButtonBackground]);

  useEffect(() => {
    if (!isIOS) return;

    const elem = document.getElementsByClassName("section-scroll")[0] as
      HTMLElement | undefined;

    // A page without a `.section-scroll` has nothing to recolour.
    if (!elem) return;

    scrollElem.current = elem;

    if (elem.scrollTop === 0) {
      elem.classList.add("dialog-background-scroll");
    }

    elem.addEventListener("scroll", scrollChangingBackground);

    return () => {
      elem.removeEventListener("scroll", scrollChangingBackground);
    };
  }, [scrollChangingBackground]);

  const onAlertClickAction = () => {
    if (withAlertClick) onAlertClick?.();
  };

  const recalculateHeight = React.useCallback(() => {
    if (divRef.current) {
      const h =
        divRef?.current?.getBoundingClientRect()?.height || window.innerHeight;

      if (h >= window.innerHeight) setHeight(`${window.innerHeight - 48}px`);
      else setHeight(`${h}px`);
    }
  }, []);

  useLayoutEffect(() => {
    if (divRef.current) {
      const { height: h } = divRef.current.getBoundingClientRect();
      setHeight(`${h}px`);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    recalculateHeight();
  }, [isOpen, isOpenButton, recalculateHeight]);

  useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
  }, [recalculateHeight]);

  // `onOpen` and `onClose` report the change itself, so a caller that keeps
  // `opened` in its own state can follow every way the sheet opens and closes.
  const toggle = (value: boolean) => {
    if (value && !isOpen) onOpen?.();
    if (!value && isOpen) onClose?.();

    setIsOpen(value);
  };

  // The trigger is FloatingButton's circle, which takes no ARIA props of its
  // own; the popup state is stamped on its element.
  useEffect(() => {
    const el = floatingButtonRef.current;
    if (!el) return;
    if (withMenu) {
      el.setAttribute("aria-haspopup", "menu");
      el.setAttribute("aria-expanded", String(Boolean(isOpen)));
      if (isOpen) el.setAttribute("aria-controls", sheetId);
      else el.removeAttribute("aria-controls");
    } else {
      el.removeAttribute("aria-haspopup");
      el.removeAttribute("aria-expanded");
      el.removeAttribute("aria-controls");
    }
  }, [withMenu, isOpen, sheetId]);

  // Escape closes the sheet and gives focus back to the button. It listens in
  // the capture phase and consumes the key, so the portal's document hotkeys
  // (Escape clears the selection) and a dialog around it do not also act.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      consumeKey(e);
      onCloseRef.current?.();
      setIsOpen(false);
      floatingButtonRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

  // A click the keyboard made (Enter or Space on the button) has no pointer
  // detail; the sheet it opens takes focus on its first item.
  const focusFirstItem = useRef(false);

  const getMenuItems = () =>
    Array.from(
      divRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    );

  useEffect(() => {
    if (!isOpen || !focusFirstItem.current) return;
    focusFirstItem.current = false;

    // The sheet is not focusable until the drop-down has drawn it, which can
    // take a few frames; try again until the item takes focus.
    let frame = 0;
    let tries = 0;
    const tryFocus = () => {
      const first = getMenuItems()[0];
      first?.focus();
      if (document.activeElement !== first && tries < 10) {
        tries += 1;
        frame = requestAnimationFrame(tryFocus);
      }
    };
    tryFocus();
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const onMainButtonClick = (e: React.MouseEvent) => {
    if (!withMenu) {
      onClick?.(e);
      return;
    }

    focusFirstItem.current = !isOpen && e.detail === 0;
    toggle(!isOpen);
  };

  // Arrow keys move between the items, Home and End jump to the ends, and
  // Enter or Space chooses the focused one.
  const onSheetKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getMenuItems();
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);

    let next: HTMLElement | undefined;
    switch (e.key) {
      case "ArrowDown":
        next = items[(index + 1) % items.length];
        break;
      case "ArrowUp":
        next = items[index <= 0 ? items.length - 1 : index - 1];
        break;
      case "Home":
        next = items[0];
        break;
      case "End":
        next = items[items.length - 1];
        break;
      case "Enter":
      case " ":
        if (index === -1) return;
        e.preventDefault();
        consumeKey(e);
        items[index].click();
        return;
      default:
        return;
    }

    e.preventDefault();
    consumeKey(e);
    next?.focus();
  };

  const outsideClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      isOpen &&
      mainButtonRef?.current &&
      mainButtonRef?.current?.contains(target)
    )
      return;
    toggle(false);
  };

  const noHover = isMobile;

  const renderItems = () => {
    return (
      <div ref={divRef} onKeyDown={onSheetKeyDown}>
        {actionOptions?.length ? (
          <div className={styles.containerAction}>
            {actionOptions?.map((option: ActionOption) => {
              const optionOnClickAction = () => {
                toggle(false);
                option.onClick?.({ action: option.action });
              };

              if (option.items)
                return (
                  <SubmenuItem
                    key={option.key}
                    option={option}
                    toggle={toggle}
                    noHover={noHover}
                    recalculateHeight={recalculateHeight}
                    openedSubmenuKey={openedSubmenuKey}
                    setOpenedSubmenuKey={setOpenedSubmenuKey}
                    openByDefault={option?.openByDefault || false}
                  />
                );

              return (
                <DropDownItem
                  id={option.id}
                  key={option.key}
                  label={option.label}
                  className={
                    classNames(
                      styles.dropDownItem,
                      option.className,
                      option.isSeparator ? "is-separator" : "",
                    ) || ""
                  }
                  onClick={optionOnClickAction}
                  icon={option.icon ? option.icon : ""}
                  noHover={noHover}
                  description={option.description}
                  role="menuitem"
                />
              );
            })}
          </div>
        ) : null}

        {buttonOptions ? (
          <div
            className={classNames(styles.buttonOptions, {
              [styles.withoutButton]: withoutButton,
            })}
          >
            {buttonOptions?.map((option: ButtonOption) => {
              const optionOnClickAction = () => {
                toggle(false);
                option.onClick?.();
              };

              if (option.items) {
                return (
                  <SubmenuItem
                    key={option.key}
                    option={option}
                    toggle={toggle}
                    noHover={noHover}
                    recalculateHeight={recalculateHeight}
                    openedSubmenuKey={openedSubmenuKey}
                    setOpenedSubmenuKey={setOpenedSubmenuKey}
                    openByDefault={false}
                  />
                );
              }

              if (option.isSeparator)
                return (
                  <div key={option.key} className="separator-wrapper">
                    <div className="is-separator" />
                  </div>
                );

              return (
                <DropDownItem
                  id={option.id}
                  label={option.label}
                  icon={option.icon ? option.icon : ""}
                  className={classNames(
                    styles.dropDownItem,
                    "drop-down-item-button",
                  )}
                  key={option.key}
                  onClick={optionOnClickAction}
                  role="menuitem"
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  };

  const children = renderItems();

  return (
    <>
      <Backdrop zIndex={210} visible={isOpen || false} onClick={outsideClick} />
      <div
        ref={mainButtonRef}
        className={className}
        style={{
          zIndex: `${isOpen ? "211" : "201"}`,
          ...style,
        }}
        data-testid="main-button-mobile"
      >
        <FloatingButton
          ref={floatingButtonRef}
          className={classNames(styles.floatingButton)}
          icon={isOpen ? FloatingButtonIcons.minus : FloatingButtonIcons.plus}
          onClick={onMainButtonClick}
          withoutProgress
        />

        <DropDown
          id={sheetId}
          role="menu"
          className={classNames(styles.dropDown, "mainBtnDropdown")}
          style={{ ...dropdownStyle, height }}
          open={isOpen}
          withBackdrop={false}
          directionY="top"
          directionX="left"
          isDefaultMode={false}
          manualWidth={manualWidth || "400px"}
          data-testid="dropdown"
        >
          {isMobile ? (
            <Scrollbar
              style={{ position: "absolute" }}
              scrollClass="section-scroll"
              ref={dropDownRef}
            >
              {children}
            </Scrollbar>
          ) : (
            children
          )}
        </DropDown>

        {alert && !isOpen ? (
          <div className={styles.wrapperAlertIcon}>
            {withAlertClick ? (
              <button
                type="button"
                className={styles.alertButton}
                aria-label={t("Common:Alert")}
                onClick={onAlertClickAction}
              >
                <ButtonAlertReactSvg
                  className={styles.alertIcon}
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
            ) : (
              <ButtonAlertReactSvg
                className={styles.alertIcon}
                role="img"
                aria-label={t("Common:Alert")}
              />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

MainButtonMobile.displayName = "MainButtonMobile";

export { MainButtonMobile };
