import React, { memo, useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import styles from "./PlayerSpeedControl.module.scss";

import { PlayerSpeedControlProps } from "./PlayerSpeedControl.props";

import {
  DefaultIndexSpeed,
  getNextIndexSpeed,
  MillisecondShowSpeedToast,
  speedIcons,
  speedRecord,
  speeds,
} from "./PlayerSpeedControl.helper";

const PlayerSpeedControl = memo(
  ({ handleSpeedChange, onMouseLeave, src }: PlayerSpeedControlProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>(undefined);

    const [currentIndexSpeed, setCurrentIndexSpeed] =
      useState<number>(DefaultIndexSpeed);
    const [isOpenSpeedContextMenu, setIsOpenSpeedContextMenu] =
      useState<boolean>(false);
    const [speedToastVisible, setSpeedToastVisible] = useState<boolean>(false);

    useEffect(() => {
      setCurrentIndexSpeed(DefaultIndexSpeed);
    }, [src]);

    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        setIsOpenSpeedContextMenu(false);
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        clearTimeout(timerRef.current);
      };
    }, []);

    const toggle = () => {
      if (isMobileOnly) {
        const nextIndexSpeed = getNextIndexSpeed(currentIndexSpeed);
        setCurrentIndexSpeed(nextIndexSpeed);
        const newSpeed = speedRecord[speeds[nextIndexSpeed]];
        handleSpeedChange(newSpeed);
        setSpeedToastVisible(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setSpeedToastVisible(false);
        }, MillisecondShowSpeedToast);
      } else {
        setIsOpenSpeedContextMenu((prev) => !prev);
      }
    };

    return (
      <>
        {speedToastVisible ? (
          <div className={styles.toast}>{speedIcons[currentIndexSpeed]}</div>
        ) : null}
        <div
          className={styles.wrapper}
          ref={ref}
          onClick={toggle}
          data-testid="speed-control"
          aria-expanded={isOpenSpeedContextMenu}
          aria-haspopup="listbox"
        >
          {speedIcons[currentIndexSpeed]}

          {isOpenSpeedContextMenu ? (
            <div
              className={styles.dropdown}
              onMouseLeave={onMouseLeave}
              data-testid="speed-menu"
              aria-label="Select playback speed"
            >
              {speeds.map((speed, index) => (
                <div
                  key={speed}
                  className={styles.dropdownItem}
                  data-testid={`speed-option-${speed}`}
                  aria-selected={index === currentIndexSpeed}
                  onClick={() => {
                    setCurrentIndexSpeed(index);
                    handleSpeedChange(speedRecord[speed]);
                    onMouseLeave();
                  }}
                >
                  {speed}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </>
    );
  },
);

PlayerSpeedControl.displayName = "PlayerSpeedControl";

export { PlayerSpeedControl };
