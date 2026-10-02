import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import type { TooltipProps } from "../Tooltip.types";

type PinnedTooltipProps = Pick<
  TooltipProps,
  "clickable" | "openOnClick" | "isOpen" | "setIsOpen"
>;

export const usePinnedTooltip = (
  tooltipId: string,
  contentTestId: string,
): PinnedTooltipProps => {
  const [isOpen, setIsOpen] = useState(false);
  const pinnedAnchor = useRef<Element | null>(null);

  useEffect(() => {
    if (isMobile) return;

    const close = () => {
      pinnedAnchor.current = null;
      setIsOpen(false);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;

      const anchor = target?.closest(`[data-tooltip-id="${tooltipId}"]`);

      if (anchor) {
        pinnedAnchor.current = pinnedAnchor.current === anchor ? null : anchor;
        setIsOpen(true);
        return;
      }

      if (target?.closest(`[data-testid="${contentTestId}"]`)) return;

      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    // Capture phase: the anchors may scroll inside a nested container.
    document.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [tooltipId, contentTestId]);

  if (isMobile) return { clickable: true, openOnClick: true };

  return {
    clickable: true,
    isOpen,
    setIsOpen: (value: boolean) => {
      if (!value && pinnedAnchor.current) return;

      setIsOpen(value);
    },
  };
};
