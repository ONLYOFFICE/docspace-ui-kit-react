"use client";

import type React from "react";
import { useEffect, useRef } from "react";

import { flip, offset, shift } from "@floating-ui/dom";
import classNames from "classnames";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { Portal } from "../portal";

import { DEFAULT_OFFSET } from "./Tooltip.constants";
import styles from "./Tooltip.module.scss";
import type {
  TFallbackAxisSideDirection,
  TGetTooltipContent,
  TooltipProps,
  TTooltipPlace,
} from "./Tooltip.types";

const globalCloseEvents = {
  escape: true,
  resize: true,
  scroll: true,
  clickOutsideAnchor: true,
};

export * from "./sub-components/withTooltip";
export * from "./sub-components/TooltipContainer";
export * from "./rootTooltip";
export * from "./Tooltip.types";

const Tooltip = ({
  ref,
  id,
  place = "top",
  getContent,
  children,
  afterShow,
  afterHide,
  className,
  style,
  color,
  maxWidth,
  anchorSelect,
  clickable,
  openOnClick,
  isOpen,
  float,
  noArrow = true,
  fallbackAxisSideDirection,
  opacity = 1,
  imperativeModeOnly,
  noUserSelect,
  dataTestId,
  zIndex,
  tooltipStyle,
  delayShow,
  ...rest
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const openEvents = {
    click: openOnClick,
    mouseenter: !openOnClick,
  };

  const closeEvents = {
    click: openOnClick,
    mouseleave: !openOnClick,
  };

  const containerStyle = maxWidth
    ? ({ ...style, "--tooltip-max-width": maxWidth } as React.CSSProperties)
    : style;

  const renderTooltip = () => {
    const tooltipClass = classNames(styles.tooltip, className, {
      [styles.noUserSelect]: noUserSelect,
    });

    return (
      <div
        ref={tooltipRef}
        className={tooltipClass}
        style={
          zIndex
            ? { ...containerStyle, zIndex, position: "relative" }
            : containerStyle
        }
        data-testid={dataTestId ?? "tooltip"}
      >
        <ReactTooltip
          ref={ref}
          id={id}
          opacity={opacity}
          float={float}
          place={place}
          isOpen={isOpen}
          noArrow={noArrow}
          render={getContent}
          clickable={clickable}
          afterShow={afterShow}
          afterHide={afterHide}
          openEvents={openEvents}
          positionStrategy="fixed"
          closeEvents={closeEvents}
          openOnClick={openOnClick}
          anchorSelect={anchorSelect}
          imperativeModeOnly={imperativeModeOnly}
          className="__react_component_tooltip"
          globalCloseEvents={globalCloseEvents}
          delayShow={delayShow}
          middlewares={[
            offset(rest.offset ?? DEFAULT_OFFSET),
            flip({
              crossAxis: false,
              fallbackAxisSideDirection,
              fallbackPlacements: [
                "right",
                "bottom",
                "left",
                "top",
                "top-start",
                "top-end",
                "right-start",
                "right-end",
                "bottom-start",
                "bottom-end",
                "left-start",
                "left-end",
              ],
            }),
            shift(),
          ]}
          style={tooltipStyle}
          {...rest}
        >
          {children}
        </ReactTooltip>
      </div>
    );
  };

  const tooltip = renderTooltip();

  useEffect(() => {
    if (!tooltipRef.current) return;

    if (color) {
      tooltipRef.current.style.setProperty("--tooltip-bg-color", color);
    }
  }, [color]);

  return <Portal element={tooltip} />;
};

Tooltip.displayName = "Tooltip";

export type { TFallbackAxisSideDirection, TTooltipPlace, TGetTooltipContent };

export { Tooltip };
export { withTooltip } from "./sub-components/withTooltip";
export { TooltipContainer } from "./sub-components/TooltipContainer";
