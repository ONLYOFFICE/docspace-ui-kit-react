"use client";

/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
