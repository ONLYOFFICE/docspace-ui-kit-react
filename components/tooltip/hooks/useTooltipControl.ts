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
