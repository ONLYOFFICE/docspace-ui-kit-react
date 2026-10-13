import { useEffect, useState } from "react";

/**
 * Text for a live region that mounts together with what it announces.
 *
 * Screen readers announce a change inside a live region they already know
 * about; a region inserted together with its text is usually read by nobody.
 * This returns `undefined` on the first render, so the region reaches the DOM
 * empty, and the text once the component has mounted.
 *
 * Internal: deliberately not re-exported from `hooks/index.ts`, which is part
 * of the plugin API.
 */
export const useLiveRegionText = <T>(text: T): T | undefined => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? text : undefined;
};
