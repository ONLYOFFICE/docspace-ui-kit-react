"use client";

import React from "react";
import classNames from "classnames";

import { isMobile, isTablet } from "../../utils";
import type { BackdropProps } from "./Backdrop.types";

import styles from "./Backdrop.module.scss";

const Backdrop: React.FC<BackdropProps> = ({
  visible = false,
  className,
  withBackground = false,
  isAside = false,
  withoutBackground = false,
  isModalDialog = false,
  zIndex = 203,
  onClick,
  shouldShowBackdrop: shouldShowBackdropProp = false,
  ...restProps
}) => {
  const backdropRef = React.useRef<HTMLDivElement | null>(null);
  const [needBackdrop, setNeedBackdrop] = React.useState(false);
  const [needBackground, setNeedBackground] = React.useState(false);

  const updateBackdropState = React.useCallback(() => {
    if (!visible) {
      setNeedBackground(false);
      setNeedBackdrop(false);
      return;
    }

    const isMobileView = isMobile();
    const existingBackdrops = document.querySelectorAll(".backdrop-active");
    const backdropCount = existingBackdrops.length;

    // Determine if backdrop is needed
    const shouldShowBackdrop =
      backdropCount < 1 ||
      (isAside && backdropCount <= 2) ||
      shouldShowBackdropProp;

    // Determine if background is needed
    const shouldShowBackground =
      !withoutBackground &&
      (withBackground || isMobileView || (isAside && !withoutBackground));

    setNeedBackdrop(shouldShowBackdrop);
    setNeedBackground(shouldShowBackground);
  }, [
    visible,
    isAside,
    withBackground,
    withoutBackground,
    shouldShowBackdropProp,
  ]);

  const backdropClasses = classNames(
    styles.backdrop,
    "backdrop-active",
    "not-selectable",
    Array.isArray(className) ? className : className?.split(" "),
    {
      [styles.visible]: visible,
      [styles.withBackground]: needBackground,
      [styles.withoutBackground]: !needBackground || withoutBackground,
      [styles.isAside]: isAside,
      [styles.isModalDialog]: isModalDialog,
      [styles.mobileView]: isMobile() || isTablet(),
    },
  );

  const handleTouch = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isModalDialog) {
        e.preventDefault();
      }

      onClick?.(e as unknown as React.MouseEvent);
    },
    [isModalDialog, onClick],
  );

  React.useEffect(() => {
    updateBackdropState();
  }, [updateBackdropState]);

  if (!visible || (!needBackdrop && !isAside)) {
    return null;
  }

  return (
    <div
      {...restProps}
      ref={backdropRef}
      className={backdropClasses}
      style={{ zIndex, ...restProps.style }}
      onClick={onClick}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouch}
      data-testid="backdrop"
    />
  );
};

export { Backdrop };
