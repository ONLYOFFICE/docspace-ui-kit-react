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

    // An action link has no href, so the keyboard never reaches it: one that
    // runs code is a button to the keyboard too, unless the caller wires the
    // keyboard itself (a role, a tabIndex or a key handler of its own).
    const isKeyboardButton =
      !href &&
      !!onClick &&
      role === undefined &&
      tabIndex === undefined &&
      !onKeyDown;

    // Enter and Space press it as a click would; handlers that open a menu at
    // the click's position get the link's own corner instead.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) =>
      activateOnButtonKey(e, ({ currentTarget }) =>
        onClick?.(keyboardClickAt(currentTarget, isRTL)),
      );

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
        role={isKeyboardButton ? "button" : role}
        tabIndex={isKeyboardButton ? 0 : tabIndex}
        onClick={onClick}
        onKeyDown={isKeyboardButton ? handleKeyDown : onKeyDown}
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
