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

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { checkIsSSR } from "../../../utils/device";

import {
  DEFAULT_DELAY_SHOW,
  SYSTEM_TOOLTIP_TOP_OFFSET,
} from "../Tooltip.constants";

const shouldHandleTooltipEvent = (
  target: HTMLElement,
  currentTarget: HTMLElement,
): boolean => {
  const anchorElement = target.closest
    ? target.closest("[data-tooltip-element]")
    : null;
  return anchorElement === currentTarget;
};

const VIRTUAL_ANCHOR_STYLES = {
  position: "fixed",
  width: "1px",
  height: "1px",
  pointerEvents: "none",
  visibility: "hidden",
  zIndex: "-1",
} as const;

const createVirtualAnchor = (
  anchorId: string,
  contentString?: string,
): HTMLDivElement => {
  const anchor = document.createElement("div");
  anchor.setAttribute("data-tooltip-id", "system-tooltip");
  anchor.setAttribute("data-tooltip-anchor", anchorId);
  anchor.setAttribute("data-tooltip-content", contentString || "");

  Object.assign(anchor.style, VIRTUAL_ANCHOR_STYLES);

  return anchor;
};

export const useTooltipControl = (
  originalOnClick?: (e: React.MouseEvent<HTMLElement>) => void,
  originalOnMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void,
  originalOnMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void,
  contentString?: string,
) => {
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const virtualAnchorRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const anchorId = useRef<string>(`tooltip-${reactId}`);

  useEffect(() => {
    return () => {
      if (virtualAnchorRef.current && !checkIsSSR()) {
        document.body.removeChild(virtualAnchorRef.current);
        virtualAnchorRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;

      if (!shouldHandleTooltipEvent(target, currentTarget)) {
        return;
      }
      if (!isReady && virtualAnchorRef.current) {
        virtualAnchorRef.current.style.left = `${e.clientX}px`;
        virtualAnchorRef.current.style.top = `${e.clientY + SYSTEM_TOOLTIP_TOP_OFFSET}px`;
      }
    },
    [isReady],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;

      if (!shouldHandleTooltipEvent(target, currentTarget)) {
        return;
      }

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!virtualAnchorRef.current && !checkIsSSR()) {
        const anchor = createVirtualAnchor(anchorId.current, contentString);
        anchor.style.left = `${e.clientX}px`;
        anchor.style.top = `${e.clientY + SYSTEM_TOOLTIP_TOP_OFFSET}px`;
        document.body.appendChild(anchor);
        virtualAnchorRef.current = anchor;
      } else if (virtualAnchorRef.current) {
        virtualAnchorRef.current.style.left = `${e.clientX}px`;
        virtualAnchorRef.current.style.top = `${e.clientY + SYSTEM_TOOLTIP_TOP_OFFSET}px`;
      }

      if (isReady) {
        setIsReady(false);
        timeoutRef.current = setTimeout(() => {
          setIsReady(true);
        }, 100);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsReady(true);
        }, DEFAULT_DELAY_SHOW);
      }

      if (originalOnMouseEnter) {
        originalOnMouseEnter(e as React.MouseEvent<HTMLElement>);
      }
    },
    [originalOnMouseEnter, isReady, contentString],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      closeTimeoutRef.current = setTimeout(() => {
        setIsReady(false);
        if (virtualAnchorRef.current && !checkIsSSR()) {
          document.body.removeChild(virtualAnchorRef.current);
          virtualAnchorRef.current = null;
        }
      }, 50);

      if (originalOnMouseLeave) {
        originalOnMouseLeave(e as React.MouseEvent<HTMLElement>);
      }
    },
    [originalOnMouseLeave],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      setIsReady(false);

      if (originalOnClick) {
        originalOnClick(e as React.MouseEvent<HTMLElement>);
      }
    },
    [originalOnClick],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (checkIsSSR()) return;
    if (!isReady) return;

    const handleDocumentClick = () => {
      setIsReady(false);
      const tooltipRef = window.__systemTooltipRef;
      if (tooltipRef?.current) {
        tooltipRef.current.close();
      }
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isReady]);

  useEffect(() => {
    const tooltipRef = window.__systemTooltipRef;
    if (!tooltipRef?.current || !contentString) return;

    if (isReady) {
      tooltipRef.current.open({
        anchorSelect: `[data-tooltip-anchor="${anchorId.current}"]`,
        content: contentString,
        place: "bottom-start",
      });
    } else {
      tooltipRef.current.close();
    }
  }, [isReady, contentString]);

  return {
    anchorId: anchorId.current,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleClick,
  };
};
