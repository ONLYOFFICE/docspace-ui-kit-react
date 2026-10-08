import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import { InputSize, InputType, TextInput } from "../text-input";

import {
  parseToDateTime,
  formatDate,
  startOf,
  now,
  parseWithFormat,
} from "../../utils/date";

import type { TimePickerProps } from "./TimePicker.types";
import styles from "./TimePicker.module.scss";

export type { TimePickerProps };

const TimePicker = ({
  initialTime,
  onChange = () => {},
  className = "",
  hasError = false,
  tabIndex,
  classNameInput,
  onBlur,
  focusOnRender = false,
  forwardedRef,
  testId,
  isTwelveHourFormat,
  meridiem,
  ariaLabel = "Time picker",
  hoursLabel = "Hours",
  minutesLabel = "Minutes",
  autoAdvance = true,
}: TimePickerProps) => {
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<DateTime>(
    initialTime ? parseToDateTime(initialTime)! : startOf(now(), "day")!,
  );

  const [isInputFocused, setIsInputFocused] = useState(false);

  const hoursFormat = isTwelveHourFormat ? "hh" : "HH";
  const [hours, setHours] = useState(formatDate(date, hoursFormat));

  const [minutes, setMinutes] = useState(formatDate(date, "mm"));

  const mountRef = useRef(false);

  const focusHoursInput = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!minutesInputRef.current?.contains(target))
      hoursInputRef.current?.select();
  };

  const focusMinutesInput = () => {
    minutesInputRef.current?.select();
  };

  const blurMinutesInput = () => {
    onBlur?.();
    minutesInputRef.current?.blur();
  };

  // The automatic moves between the fields, which `autoAdvance` turns off.
  const advanceToMinutes = () => {
    if (autoAdvance) focusMinutesInput();
  };

  const completeMinutes = () => {
    if (autoAdvance) blurMinutesInput();
  };

  const report = (h: string, m: string) => {
    const day = formatDate(date, "yyyy-MM-dd");
    const newDate = parseWithFormat(`${day} ${h}:${m}`, "yyyy-MM-dd HH:mm");
    if (newDate) setDate(newDate);

    const parsedDate = isTwelveHourFormat
      ? parseWithFormat(
          `${day} ${h}:${m} ${meridiem ?? ""}`,
          "yyyy-MM-dd hh:mm a",
        )
      : newDate;
    if (parsedDate) onChange(parsedDate);
  };

  const changeHours = (time: string) => {
    setHours(time);
    report(time, minutes);
  };

  const onHoursBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1) changeHours(`0${e.target.value}`);
    setIsInputFocused(false);
  };
  const onMinutesBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1) changeMinutes(`0${e.target.value}`);
    setIsInputFocused(false);
  };

  const focusInput = () => setIsInputFocused(true);

  useEffect(() => {
    if (focusOnRender && hoursInputRef.current) hoursInputRef.current.select();
    mountRef.current = true;
  }, [focusOnRender]);

  const changeMinutes = (time: string) => {
    setMinutes(time);
    report(hours, time);
  };

  const handleChangeHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = e.target.value;

    if (h.length > 2) {
      advanceToMinutes();
      return;
    }

    if (h === "") {
      changeHours("00");
      return;
    }
    if (!/^\d+$/.test(h)) return;

    const maxHours = isTwelveHourFormat ? 12 : 23;

    if (+h > maxHours) {
      advanceToMinutes();
      if (h.length === 2) changeHours(`0${h[0]}`);
      return;
    }

    const maxHoursDigit = isTwelveHourFormat ? 1 : 2;

    if (h.length === 1 && +h > maxHoursDigit) {
      changeHours(`0${h}`);
      advanceToMinutes();
      return;
    }

    if (h.length === 2) advanceToMinutes();

    changeHours(h);
  };

  const handleChangeMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = e.target.value;

    if (m.length > 2) {
      completeMinutes();
      return;
    }

    if (m === "") {
      changeMinutes("00");
      return;
    }
    if (!/^\d+$/.test(m)) return;

    if (+m > 59) {
      if (autoAdvance) onBlur?.();
      return;
    }

    if (m.length === 1 && +m > 5) {
      changeMinutes(`0${m}`);
      completeMinutes();
      return;
    }
    if (m.length === 2) {
      completeMinutes();
    }

    changeMinutes(m);
  };

  const preventDefaultContext = (e: React.MouseEvent<HTMLInputElement>) =>
    e.preventDefault();

  return (
    <div
      onClick={focusHoursInput}
      className={classNames(styles.timeInput, className, {
        [styles.hasError]: hasError,
        [styles.isFocused]: isInputFocused,
      })}
      ref={forwardedRef}
      data-testid={testId ?? "time-picker"}
      role="group"
      aria-label={ariaLabel}
    >
      <TextInput
        className={classNameInput ? `${classNameInput}-hours-input` : undefined}
        withBorder={false}
        forwardedRef={hoursInputRef}
        value={hours}
        onChange={handleChangeHours}
        onBlur={onHoursBlur}
        tabIndex={tabIndex}
        onFocus={focusInput}
        type={InputType.text}
        onContextMenu={preventDefaultContext}
        autoComplete="off"
        inputMode="numeric"
        size={InputSize.base}
        data-test-id="hours-input"
        aria-label={hoursLabel}
        aria-invalid={hasError || undefined}
      />
      :
      <TextInput
        className={
          classNameInput ? `${classNameInput}-minutes-input` : undefined
        }
        withBorder={false}
        forwardedRef={minutesInputRef}
        value={minutes}
        onChange={handleChangeMinutes}
        onClick={focusMinutesInput}
        onBlur={onMinutesBlur}
        tabIndex={tabIndex}
        onFocus={focusInput}
        type={InputType.text}
        onContextMenu={preventDefaultContext}
        autoComplete="off"
        inputMode="numeric"
        size={InputSize.base}
        data-test-id="minutes-input"
        aria-label={minutesLabel}
        aria-invalid={hasError || undefined}
      />
    </div>
  );
};

export { TimePicker };
