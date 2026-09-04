import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import ClockIcon from "../../assets/clock.react.svg";

import { ButtonKeys } from "../../enums";

import {
  parseToDateTime,
  formatDate,
  addToDate,
  subtractFromDate,
} from "../../utils/date";

import { TimePicker } from "../time-picker";
import { DatePicker } from "../date-picker";
import { ComboBox, TOption } from "../combobox";

import type { DateTimePickerProps } from "./DateTimePicker.types";
import styles from "./DateTimePicker.module.scss";

export type { DateTimePickerProps };

export type DateTimePickerTranslations = {
  AM: string;
  PM: string;
};

type DateTimePickerComponentProps = DateTimePickerProps & {
  translations: DateTimePickerTranslations;
};

const DateTimePicker = (props: DateTimePickerComponentProps) => {
  const {
    initialDate,
    selectDateText,
    onChange,
    className,
    id,
    hasError,
    minDate,
    maxDate,
    locale,
    openDate,
    dataTestId,
    hideCross,
    useMaxTime,
    translations,
  } = props;

  const options = [
    { key: "AM", label: translations.AM },
    { key: "PM", label: translations.PM },
  ];

  const [isTimeFocused, setIsTimeFocused] = useState(false);

  const [date, setDate] = useState<DateTime | null>(
    initialDate ? parseToDateTime(initialDate) : null,
  );
  const [isTwelveHourFormat, setIsTwelveHourFormat] = useState(true);
  const initialDateTime = initialDate ? parseToDateTime(initialDate) : null;
  const [selectedFormat, setSelectedFormat] = useState<TOption>(
    initialDateTime && initialDateTime.hour >= 12 ? options[1] : options[0],
  );

  const showTimePicker = () => setIsTimeFocused(true);
  const hideTimePicker = () => setIsTimeFocused(false);

  const handleChange = (d: DateTime | null) => {
    if (isTwelveHourFormat && d) {
      setSelectedFormat(d.hour >= 12 ? options[1] : options[0]);
    }

    onChange?.(d);
    setDate(d);
  };

  const timePickerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const dropDownElement =
      target.tagName === "SPAN" ? target.parentElement : target;
    const containsDropDown =
      dropDownElement?.classList.contains("drop-down-item");

    if (
      timePickerRef?.current &&
      !timePickerRef?.current?.contains(target) &&
      !containsDropDown
    ) {
      setIsTimeFocused(false);
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ButtonKeys.enter || event.key === ButtonKeys.tab) {
      setIsTimeFocused(false);
    }
  };

  const onSelectFormat = (opt: TOption) => {
    setSelectedFormat(opt);
    if (!date) return;

    if (opt.key === "AM") {
      handleChange(subtractFromDate(date, 12, "hours"));
    } else {
      handleChange(addToDate(date, 12, "hours"));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    // Check if locale uses 12-hour time format
    // Most locales use 24-hour format except US, AU, PH, etc.
    const twelveHourLocales = ["en-US", "en-AU", "en-PH", "en"];
    const is12Hour =
      twelveHourLocales.some((l) => locale.startsWith(l)) ||
      locale === "en-GB";

    setIsTwelveHourFormat(is12Hour);
  }, [initialDate, locale]);

  return (
    <div
      className={classNames(styles.selectors, className, {
        [styles.hasError]: hasError,
      })}
      id={id}
      data-testid={dataTestId ?? "date-time-picker"}
      aria-label={selectDateText}
      aria-invalid={hasError}
    >
      <DatePicker
        initialDate={initialDate}
        onChange={handleChange}
        selectDateText={selectDateText}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
        openDate={openDate}
        outerDate={date}
        hideCross={hideCross}
        useMaxTime={useMaxTime}
      />
      <span
        className={styles.timeSelector}
        data-testid="date-time-picker-time-wrapper"
      >
        {date !== null ? (
          isTimeFocused ? (
            <div className={styles.timePicker} ref={timePickerRef}>
              <TimePicker
                initialTime={date}
                onChange={handleChange}
                tabIndex={0}
                onBlur={hideTimePicker}
                focusOnRender
                aria-label="Time picker"
                isTwelveHourFormat={isTwelveHourFormat}
                meridiem={String(selectedFormat.key)}
              />
              {isTwelveHourFormat ? (
                <ComboBox
                  options={options}
                  selectedOption={selectedFormat}
                  onSelect={onSelectFormat}
                  scaledOptions
                />
              ) : null}
            </div>
          ) : (
            <span
              className={classNames(styles.timeCell, {
                [styles.hasError]: hasError,
              })}
              onClick={showTimePicker}
              data-testid="date-time-picker-time-display"
              role="button"
              aria-label={`Current time: ${formatDate(date, "HH:mm")}`}
              tabIndex={0}
            >
              <ClockIcon
                className={styles.clockIcon}
                aria-hidden="true"
                data-testid="date-time-picker-clock-icon"
              />
              {isTwelveHourFormat
                ? formatDate(date, "hh:mm a")
                : formatDate(date, "HH:mm")}
            </span>
          )
        ) : null}
      </span>
    </div>
  );
};

export { DateTimePicker };
