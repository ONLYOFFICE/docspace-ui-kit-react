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

import React, { useState, useEffect } from "react";
import classNames from "classnames";

import type { LoadingButtonProps } from "./LoadingButton.types";
import styles from "./LoadingButton.module.scss";

const CloseIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.70744 6.29356L5.41412 4.00061L7.7075 1.70724L6.29329 0.293026L3.9998 2.58651L1.70588 0.292969L0.291779 1.7073L2.58558 4.00073L0.293285 6.29303L1.7075 7.70724L3.99991 5.41483L6.29334 7.70788L7.70744 6.29356Z"
      fill="white"
    />
  </svg>
);

const LoadingButton: React.FC<LoadingButtonProps> = ({
  percent = 0,
  onClick,
  inConversion = false,
  loaderColor,
  backgroundColor,
  isDefaultMode,
}) => {
  const [isAnimation, setIsAnimation] = useState<boolean>(true);

  const stopAnimation = (): void => {
    setIsAnimation(false);
  };

  useEffect(() => {
    const timer = setTimeout(stopAnimation, 5000);

    return function cleanup() {
      clearTimeout(timer);
    };
  }, [isAnimation]);

  return (
    <div
      style={{ "--circle-fill-color": loaderColor } as React.CSSProperties}
      className={classNames(styles.loadingButtonContainer, {
        [styles.defaultMode]: isDefaultMode,
      })}
      onClick={onClick}
      data-testid="loading-button-container"
    >
      <div
        className={classNames(styles.circle, {
          [styles.isProgressZero]: percent === 0,
          [styles.isAnimation]: isAnimation,
          [styles.inConversion]: inConversion,
        })}
        style={{ "--loading-button-percent": percent } as React.CSSProperties}
      >
        <div
          className={classNames(
            styles.circleMask,
            styles.circleFull,
            "circle__mask circle__full",
          )}
        >
          <div className={classNames(styles.circleFill, "circle__fill")} />
        </div>
        <div className={classNames(styles.circleMask, "circle__mask")}>
          <div className={classNames(styles.circleFill, "circle__fill")} />
        </div>

        <div
          style={
            {
              "--loading-button-custom-bg": backgroundColor,
            } as React.CSSProperties
          }
          className={classNames(styles.loadingButton, "loading-button")}
        >
          {!inConversion ? <CloseIcon /> : null}
        </div>
      </div>
    </div>
  );
};

export { LoadingButton };
export type { LoadingButtonProps };
