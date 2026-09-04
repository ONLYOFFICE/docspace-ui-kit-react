"use client";

import { type DependencyList, type RefObject, useEffect } from "react";

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (e: MouseEvent) => void,
  options?: AddEventListenerOptions | boolean,
  ...deps: DependencyList
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // e.stopPropagation();
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) handler(e);
    };
    document.addEventListener("mousedown", handleClickOutside, options);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler, ...deps]);
};
