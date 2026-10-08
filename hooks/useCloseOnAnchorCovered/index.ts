import { useEffect, useEffectEvent, type RefObject } from "react";

import { isElementCovered as defaultIsElementCovered } from "./useCloseOnAnchorCovered.utils";

export { isElementCovered } from "./useCloseOnAnchorCovered.utils";

type UseCloseOnAnchorCoveredProps = {
  anchorRef: RefObject<HTMLElement | null>;
  onClose: VoidFunction;
  isElementCovered?: (element: HTMLElement) => boolean;
  enabled?: boolean;
};

export const useCloseOnAnchorCovered = ({
  anchorRef,
  onClose,
  isElementCovered = defaultIsElementCovered,
  enabled = true,
}: UseCloseOnAnchorCoveredProps) => {
  const checkAndClose = useEffectEvent(() => {
    if (!anchorRef.current) return false;
    if (isElementCovered(anchorRef.current)) {
      onClose();
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!enabled) return;

    let rafId: number;

    const loop = () => {
      if (checkAndClose()) return;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
};
