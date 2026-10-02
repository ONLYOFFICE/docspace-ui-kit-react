export const INFO_PANEL_WIDTH = 400;
export const MAX_INFINITE_LOADER_SHIFT = 800;

export function checkIsSSR() {
  return typeof window === "undefined";
}

export const size = {
  mobile: 600,
  // table: is between
  desktop: 1024,
};

export const mobile = `(max-width: ${size.mobile}px)`;

export const mobileMore = `(min-width: ${size.mobile}px)`;

export const tablet = `(max-width: ${size.desktop - 0.1}px)`;

export const desktop = `(min-width: ${size.desktop}px)`;

export const transitionalScreenSize = `(max-width: ${
  size.desktop + INFO_PANEL_WIDTH
}px)`;

export const isMobile = (width?: number) => {
  return (
    (width ?? ((typeof window !== "undefined" && window.innerWidth) || 0)) <=
    size.mobile
  );
};

export const isMobileDevice = () => {
  const angleByRadians =
    (Math.PI / 180) *
    (window.screen?.orientation?.angle ?? window.orientation ?? 0);
  const width = Math.abs(
    Math.round(
      Math.sin(angleByRadians) * window.innerHeight +
        Math.cos(angleByRadians) * window.innerWidth,
    ),
  );
  return isMobile(width);
};

export const isTablet = (width?: number) => {
  const checkWidth =
    width || (typeof window !== "undefined" && window.innerWidth) || 0;
  return checkWidth > size.mobile && checkWidth < size.desktop;
};

export const isDesktop = () => {
  if (!checkIsSSR()) {
    return window.innerWidth >= size.desktop;
  }
  return false;
};

export const isTouchDevice = !!(
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0)
);

/**
 * True for Android Chrome/Firefox/Samsung Internet — browsers where
 * `visualViewport` reliably tracks the virtual keyboard. Edge Android is
 * excluded because its viewport geometry is unstable during keyboard
 * transitions.
 */
export const isReliableAndroidViewport = () => {
  if (checkIsSSR()) return false;
  const ua = navigator.userAgent;
  if (!/Android/i.test(ua)) return false;
  if (/EdgA?\//i.test(ua)) return false;
  return true;
};
