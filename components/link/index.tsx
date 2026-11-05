import React, { useMemo } from "react";
import classNames from "classnames";
import equal from "fast-deep-equal";

import { TextUi } from "../text";
import { withTooltip } from "../tooltip";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";
import {
  activateOnButtonKey,
  keyboardClickAt,
} from "../../utils/keyboard-activation";

import type { LinkProps } from "./Link.types";
import { LinkType, LinkTarget } from "./Link.enums";
import styles from "./Link.module.scss";

export type { LinkProps };
export { LinkType, LinkTarget };

const LinkUi: React.FC<LinkProps> = React.memo(
  ({
    className,
    children,
    color,
    fontSize,
    href,
    isBold = false,
    isHovered = false,
    isSemitransparent = false,
    lineHeight,
    rel,
    tabIndex,
    role,
    onClick,
    onKeyDown,
    type = LinkType.page,
    isTextOverflow = false,
    noHover = false,
    enableUserSelect = true,
    textDecoration,
    ariaLabel,
    dataTestId,
    style,
    // Same as in Text: RowContent reads these off the element to size its
    // containers, so they must never reach the anchor as attributes.
    containerWidth: _containerWidth,
    containerMinWidth: _containerMinWidth,
    ...rest
  }: LinkProps) => {
    const { isRTL } = useInterfaceDirection();

    // A link with an onClick and no href is out of the keyboard's reach: it
    // takes a Tab stop and its keys, unless the caller wires the keyboard
    // itself (a role or a key handler of its own) or keeps the link out of
    // it (a negative tabIndex, where something around it is the control). A
    // tabIndex of 0 or more only places the stop. An action link runs code,
    // so it is a button; a page link navigates, so it stays a link.
    const isKeyboardOperable =
      !href &&
      !!onClick &&
      role === undefined &&
      (tabIndex === undefined || tabIndex >= 0) &&
      !onKeyDown;
    const isAction = type === LinkType.action;

    // Enter presses it as a click would, and Space too for a button - a link
    // takes Enter only. Handlers that open a menu at the click's position get
    // the link's own corner instead.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (!isAction && e.key === " ") return;
      activateOnButtonKey(e, ({ currentTarget }) =>
        onClick?.(keyboardClickAt(currentTarget, isRTL)),
      );
    };

    const linkClasses = classNames(
      styles.link,
      {
        [styles.semitransparent]: isSemitransparent,
        [styles.isHovered]: isHovered,
        [styles.textOverflow]: isTextOverflow,
        [styles.noHover]: noHover,
        [styles.enableUserSelect]: enableUserSelect,
        [styles.page]: type === LinkType.page,
      },
      className,
    );

    const linkStyle = useMemo(() => {
      return {
        color: color === "accent" ? "var(--accent-main)" : color,
        lineHeight,
        textDecoration,
      };
    }, [color, lineHeight, textDecoration]);

    const commonStyle = useMemo(
      () => (style ? { ...linkStyle, ...style } : linkStyle),
      [linkStyle, style],
    );

    return (
      <TextUi
        className={linkClasses}
        fontSize={fontSize}
        as="a"
        href={href}
        rel={rel}
        role={isKeyboardOperable ? (isAction ? "button" : "link") : role}
        tabIndex={isKeyboardOperable ? (tabIndex ?? 0) : tabIndex}
        onClick={onClick}
        onKeyDown={isKeyboardOperable ? handleKeyDown : onKeyDown}
        isBold={isBold}
        style={commonStyle}
        aria-label={
          ariaLabel || (typeof children === "string" ? children : undefined)
        }
        data-testid={dataTestId ?? "link"}
        {...rest}
      >
        {children}
      </TextUi>
    );
  },
  equal,
);

const Link = withTooltip(LinkUi);

export { Link, LinkUi };
