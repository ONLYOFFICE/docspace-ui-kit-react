"use client";

/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
