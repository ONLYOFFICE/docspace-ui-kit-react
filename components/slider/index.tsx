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

import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { SliderProps } from "./Slider.types";
import styles from "./Slider.module.scss";

const Slider = (props: SliderProps) => {
  const {
    id,
    className,
    onChange,
    min,
    max,
    step,
    value,
    withPouring,
    style,
    isDisabled = false,
    thumbBorderWidth,
    thumbHeight,
    thumbWidth,
    runnableTrackHeight,
    dataTestId,
  } = props;

  const [sizeProp, setSizeProp] = useState("0%");
  const sliderRef = useRef<HTMLInputElement>(null);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkRtl = () => {
      if (document.dir === "rtl" || document.documentElement.dir === "rtl") {
        return true;
      }

      if (sliderRef.current) {
        const computedStyle = window.getComputedStyle(sliderRef.current);
        return computedStyle.direction === "rtl";
      }

      return false;
    };

    setIsRtl(checkRtl());
  }, []);

  useEffect(() => {
    const percentage = ((value - min) / (max - min)) * 100;
    setSizeProp(`${percentage}%`);
  }, [value, min, max]);

  const sliderStyle = {
    ...style,
    "--thumb-width": thumbWidth,
    "--thumb-height": thumbHeight,
    "--thumb-border-width": thumbBorderWidth,
    "--runnable-track-height": runnableTrackHeight,
    "--size-prop": sizeProp,
    backgroundSize: withPouring ? `${sizeProp} 100%` : "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: isRtl ? "right center" : "left center",
  } as React.CSSProperties;

  const sliderClasses = classNames(
    styles.slider,
    {
      [styles.withPouring]: withPouring,
      [styles.disabled]: isDisabled,
    },
    className,
  );

  return (
    <input
      id={id}
      ref={sliderRef}
      type="range"
      className={sliderClasses}
      style={sliderStyle}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={isDisabled}
      data-testid={dataTestId ?? "slider"}
    />
  );
};

export { Slider };
