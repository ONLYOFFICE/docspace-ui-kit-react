import React from "react";
import type { Decorator } from "@storybook/react-vite";

import LightSmallLogoUrl from "../../assets/logo/lightsmall.svg?url";
import DarkLightSmallLogoUrl from "../../assets/logo/dark_lightsmall.svg?url";
import LeftMenuLogoUrl from "../../assets/logo/dark_leftmenu.svg?url";

import { WhiteLabelLogoType } from "../../enums";

const bundledLogo = (src: string) => {
  const params = new URL(src, window.location.href).searchParams;
  if (params.get("logotype") === String(WhiteLabelLogoType.LeftMenu)) {
    return LeftMenuLogoUrl;
  }
  return params.get("dark") === "true"
    ? DarkLightSmallLogoUrl
    : LightSmallLogoUrl;
};

/**
 * No portal serves `logo.ashx` here; swap every logo for a bundled one of the
 * same type and theme. The observer rewrites `src` as soon as the image is
 * attached or re-pointed -- a theme switch re-points it -- before the browser
 * gets to ask Storybook's origin for a logo it does not have.
 *
 * For stories whose logo is scenery. `PortalLogo` and `ErrorContainer`
 * demonstrate the failed load itself, so they must not use this.
 */
const withBundledLogos: Decorator = (Story) => {
  React.useEffect(() => {
    const replaceLogos = () => {
      document
        .querySelectorAll<HTMLImageElement>('img[src*="logo.ashx"]')
        .forEach((img) => {
          img.src = bundledLogo(img.src);
        });
    };

    replaceLogos();
    const observer = new MutationObserver(replaceLogos);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => observer.disconnect();
  }, []);

  return <Story />;
};

export default withBundledLogos;
