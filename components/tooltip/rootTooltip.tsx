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

import { useEffect, useRef } from "react";
import type React from "react";

import { Tooltip as ReactTooltip, type TooltipRefProps } from "react-tooltip";
import { flip, offset, shift } from "@floating-ui/dom";

import { checkIsSSR } from "../../utils/device";

import { Portal } from "../portal";

import { DEFAULT_OFFSET } from "./Tooltip.constants";
import styles from "./Tooltip.module.scss";

declare global {
  interface Window {
    __systemTooltipRef?: React.RefObject<TooltipRefProps | null>;
  }
}

const globalCloseEvents = {
  escape: true,
  resize: true,
  scroll: true,
  clickOutsideAnchor: true,
};

const openEvents = {
  click: true,
  mouseenter: false,
};

const closeEvents = {
  click: true,
  mouseleave: false,
};

const RootTooltip = () => {
  const systemTooltipRef = useRef<TooltipRefProps>(null);
  const infoTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!checkIsSSR()) {
      window.__systemTooltipRef = systemTooltipRef;
    }
  }, []);

  const renderTooltip = (
    id: string,
    ref:
      | React.RefObject<TooltipRefProps | null>
      | React.RefObject<HTMLDivElement | null>,
    testId: string,
    imperativeMode: boolean,
    openOnClick: boolean = false,
  ) => {
    return (
      <div
        ref={
          imperativeMode
            ? undefined
            : (ref as React.RefObject<HTMLDivElement | null>)
        }
        className={styles.tooltip}
        data-testid={testId}
      >
        <ReactTooltip
          ref={
            imperativeMode
              ? (ref as React.RefObject<TooltipRefProps | null>)
              : undefined
          }
          id={id}
          opacity={1}
          place="bottom"
          noArrow
          className="__react_component_tooltip"
          globalCloseEvents={globalCloseEvents}
          openEvents={openOnClick ? openEvents : undefined}
          closeEvents={openOnClick ? closeEvents : undefined}
          delayShow={0}
          clickable={openOnClick}
          imperativeModeOnly={imperativeMode}
          middlewares={[
            offset(DEFAULT_OFFSET),
            flip({
              crossAxis: false,
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
        />
      </div>
    );
  };

  const systemTooltip = renderTooltip(
    "system-tooltip",
    systemTooltipRef,
    "system-tooltip-container",
    true,
    false,
  );

  const infoTooltip = renderTooltip(
    "info-tooltip",
    infoTooltipRef,
    "info-tooltip-container",
    false,
    true,
  );

  const rootElement = !checkIsSSR()
    ? document?.getElementById("root") || document?.body
    : null;

  return (
    <>
      <Portal
        element={systemTooltip}
        appendTo={rootElement || undefined}
        visible
      />
      <Portal
        element={infoTooltip}
        appendTo={rootElement || undefined}
        visible
      />
    </>
  );
};

RootTooltip.displayName = "RootTooltip";

export { RootTooltip };
