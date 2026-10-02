import React from "react";
import type { Decorator } from "@storybook/react-vite";

import LightSmallLogoUrl from "../../assets/logo/lightsmall.svg?url";

/**
 * No portal serves `logo.ashx` here; swap every logo for a bundled one. The
 * observer rewrites `src` as soon as the image is attached, before the
 * browser gets to ask Storybook's origin for a logo it does not have.
 *
 * For stories whose logo is scenery. `PortalLogo` and `ErrorContainer`
 * demonstrate the failed load itself, so they must not use this.
 */
const withBundledLogos: Decorator = (Story) => {
  React.useEffect(() => {
    const replaceLogos = () => {
      const images = document.querySelectorAll('img[src*="logo.ashx"]');
      images.forEach((img) => {
        (img as HTMLImageElement).src = LightSmallLogoUrl;
      });
    };

    replaceLogos();
    const observer = new MutationObserver(replaceLogos);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <Story />;
};

export default withBundledLogos;
