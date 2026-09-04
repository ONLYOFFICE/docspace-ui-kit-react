"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import type { PortalProps } from "./Portal.types";

const Portal = ({ visible = true, element, appendTo = null }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const domExists = !!(
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      window.document &&
      window.document.createElement
    );

    if (domExists && !mounted && visible) {
      setMounted(true);
    }
  }, [mounted, visible]);

  return element && mounted && visible
    ? createPortal(element, appendTo || document.body)
    : null;
};

export { Portal };
