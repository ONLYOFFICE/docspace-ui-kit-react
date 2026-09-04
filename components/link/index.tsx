import React, { useMemo } from "react";
import classNames from "classnames";
import equal from "fast-deep-equal";

import { TextUi } from "../text";
import { withTooltip } from "../tooltip";

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
    type = LinkType.page,
    isTextOverflow = false,
    noHover = false,
    enableUserSelect = true,
    textDecoration,
    ariaLabel,
    dataTestId,
    style,
    ...rest
  }: LinkProps) => {
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
        tabIndex={tabIndex}
        isBold={isBold}
        style={commonStyle}
        aria-label={ariaLabel || children}
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
