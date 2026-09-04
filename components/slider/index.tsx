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
