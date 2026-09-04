import React from "react";

import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types";

export type { BadgeProps };

const Badge = (props: BadgeProps) => {
  const {
    ref,
    onClick,
    fontSize = "11px",
    color,
    fontWeight = 800,
    backgroundColor,
    borderRadius = "11px",
    padding = "0px 5px",
    maxWidth = "50px",
    height,
    type,
    isHovered = false,
    border,
    label = 0,
    onMouseLeave,
    onMouseOver,
    noHover = false,
    className,
    isVersionBadge,
    isPaidBadge,
    isMutedBadge,
    dataTestId,
    ...rest
  } = props;

  const onClickAction = React.useCallback(
    (e: React.MouseEvent) => {
      if (!onClick) return;

      e.preventDefault();
      onClick(e);
    },
    [onClick],
  );

  const shouldDisplay = label && label !== "0";

  const badgeStyle = {
    height,
    border,
    borderRadius,
    "--badge-background-color": backgroundColor,
  } as React.CSSProperties;

  const innerStyle = isPaidBadge
    ? ({
        padding,
        borderRadius,
        "--badge-background-color": backgroundColor,
      } as React.CSSProperties)
    : ({
        maxWidth,
        padding,
        borderRadius,
        "--badge-background-color": backgroundColor,
      } as React.CSSProperties);

  const textStyle = {
    fontSize,
    fontWeight,
    color,
  } as React.CSSProperties;

  return (
    <TooltipContainer
      as="div"
      ref={ref}
      className={`${styles.badge} ${styles.themed} ${className || ""}`}
      style={badgeStyle}
      onClick={onClickAction}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      role="status"
      aria-label={`${label} ${type || ""}`}
      aria-live="polite"
      aria-atomic="true"
      data-testid={dataTestId ?? "badge"}
      data-hidden={!shouldDisplay}
      data-no-hover={noHover}
      data-is-hovered={isHovered}
      data-type={type}
      data-version-badge={isVersionBadge}
      data-paid={isPaidBadge}
      data-muted={isMutedBadge}
      {...rest}
    >
      <div
        className={styles.inner}
        style={innerStyle}
        data-type={type}
        data-testid="badge-inner"
        aria-hidden="true"
        data-no-hover={noHover}
      >
        <Text
          className={styles.text}
          style={textStyle}
          textAlign="center"
          data-testid="badge-text"
          data-color={!!color}
        >
          {label}
        </Text>
      </div>
    </TooltipContainer>
  );
};

Badge.displayName = "Badge";

export { Badge };
