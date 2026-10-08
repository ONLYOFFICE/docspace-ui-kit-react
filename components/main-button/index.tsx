import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import classNames from "classnames";
import TriangleNavigationDownReactSvgUrl from "../../assets/triangle.navigation.down.react.svg";
import { GuidanceRefKey } from "../../enums";
import { Text } from "../text";
import { ContextMenu } from "../context-menu";
import { MainButtonProps } from "./MainButton.types";
import styles from "./MainButton.module.scss";
import { ContextMenuRefType } from "../context-menu/ContextMenu.types";
import { TooltipContainer } from "../tooltip";

const MainButton = (props: MainButtonProps) => {
  const {
    model,
    onAction,
    text = "Button",
    isDropdown = true,
    isDisabled = false,
    hideArrow = false,
    className,
    id,
    setRefMap,
    anchorRef,
    // Declared for backward compatibility and never read; taken out here so
    // it no longer reaches the DOM as an unknown attribute.
    opened: _opened,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<ContextMenuRefType>(null);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  // Stable, so the menu does not rebuild its `hide` on every render.
  const onMenuShow = useCallback(() => setIsOpen(true), []);
  const onMenuHide = useCallback(() => setIsOpen(false), []);

  // The element used to position the dropdown. Defaults to the button itself;
  // callers can override (e.g. SearchInput wraps the button in a larger pill).
  const positionRef = (anchorRef ??
    buttonRef) as React.RefObject<HTMLElement | null>;

  useEffect(() => {
    const updateWidth = () => {
      const target = positionRef.current ?? buttonRef.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        setButtonWidth(rect.width);
        if (setRefMap) {
          setRefMap(
            GuidanceRefKey.MainButton,
            buttonRef as unknown as React.RefObject<HTMLDivElement | null>,
          );
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [setRefMap, positionRef]);

  const onMainButtonClick = (e: React.MouseEvent) => {
    if (!isDisabled) {
      if (!isDropdown) {
        onAction?.(e);
      } else if (menuRef.current) {
        const target = positionRef.current ?? buttonRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const newEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: rect.left,
          clientY: rect.bottom,
        });
        Object.defineProperty(newEvent, "pageX", { value: rect.left });
        Object.defineProperty(newEvent, "pageY", { value: rect.bottom });

        setButtonWidth(rect.width);
        menuRef.current.toggle(newEvent);
      }
    } else {
      e.preventDefault();
    }
  };

  // The menu reads its hotkeys from `keyup` on `window`. Enter clicks a native
  // button on `keydown`, so the `keyup` of the same press would reach the menu
  // it has just opened and pick its first item: that `keyup` is kept to the
  // button. While the menu is open, Enter belongs to the menu (it picks the
  // highlighted item), so the button does not click again.
  const enterOpensMenu = useRef(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || !isDropdown) return;
    if (isOpen) e.preventDefault();
    else enterOpensMenu.current = true;
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || !enterOpensMenu.current) return;
    enterOpensMenu.current = false;
    e.stopPropagation();
  };

  // A menu whose items explain themselves is wider than the button, so it is
  // sized by its content instead of being clamped to the button width.
  // A caller may leave holes in the model for options it decided not to offer
  // (an upload-folder entry a tablet has no picker for), so an item is only
  // asked about its description once it is known to be one.
  const hasItemDescriptions = model?.some(
    (item) => item && "description" in item && Boolean(item.description),
  );

  const buttonClasses = classNames(styles.mainButton, className, {
    [styles.disabled]: isDisabled,
    [styles.dropdown]: isDropdown,
  });

  return (
    <div
      className={styles.groupMainButton}
      ref={containerRef}
      data-testid="main-button"
    >
      <TooltipContainer
        as="button"
        type="button"
        {...rest}
        id={id}
        ref={buttonRef}
        className={buttonClasses}
        onClick={onMainButtonClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        // Not the native `disabled`: that would take the button out of the
        // tab order and silence a tooltip on it.
        aria-disabled={isDisabled || undefined}
        aria-haspopup={isDropdown ? "menu" : undefined}
        aria-expanded={isDropdown ? isOpen : undefined}
        aria-controls={isDropdown && isOpen ? menuId : undefined}
      >
        <Text as="span" className={styles.text}>
          {text}
        </Text>
        {isDropdown ? (
          <>
            {hideArrow ? null : (
              <span className={styles.img} aria-hidden="true">
                <TriangleNavigationDownReactSvgUrl />
              </span>
            )}
            <ContextMenu
              id={menuId}
              className={styles.menu}
              model={model ?? []}
              ref={menuRef}
              onShow={onMenuShow}
              onHide={onMenuHide}
              appendTo={
                typeof document !== "undefined" ? document.body : undefined
              }
              containerRef={positionRef as React.RefObject<HTMLDivElement>}
              style={{
                position: "fixed",
                ...(hasItemDescriptions
                  ? {
                      minWidth: buttonWidth ? `${buttonWidth}px` : undefined,
                    }
                  : { width: buttonWidth ? `${buttonWidth}px` : "auto" }),
              }}
            />
          </>
        ) : null}
      </TooltipContainer>
    </div>
  );
};

export { MainButton };
