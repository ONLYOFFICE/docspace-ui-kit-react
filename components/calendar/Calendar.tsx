import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Scrollbar } from "../scrollbar";
import { Days, Months, Years } from "./sub-components";

import type { DateTime } from "luxon";
import {
  now,
  parseToDateTime,
  startOf,
  endOf,
  dateDiffAbs,
  formatDate,
} from "../../utils/date";

import { getValidDates } from "./utils";
import { groupRoleWhenNamed, pickAriaProps } from "../../utils/aria-props";
import { CalendarProps } from "./Calendar.types";
import styles from "./Calendar.module.scss";

const Calendar = ({
  locale = "en",
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
  id,
  className,
  style,
  initialDate,
  onChange,
  isMobile,
  forwardedRef,
  isScroll = false,
  dataTestId,
  useMaxTime,
  ...rest
}: CalendarProps) => {
  const handleDateChange = (date: DateTime) => {
    // Combine the new date with the existing time from selectedDate
    const dateStr = formatDate(date, "yyyy-MM-dd");
    const timeStr = selectedDate
      ? formatDate(selectedDate, "HH:mm:ss")
      : "00:00:00";
    let formattedDate = parseToDateTime(`${dateStr}T${timeStr}`)!;

    if (useMaxTime) {
      formattedDate = endOf(formattedDate, "day")!;
    }

    setSelectedDate?.(formattedDate);
    onChange?.(formattedDate);
  };

  const [observedDate, setObservedDate] = useState<DateTime>(now());
  const [selectedScene, setSelectedScene] = useState(0);

  // A scene change unmounts the control that had the focus. When the focus was
  // inside the calendar, it goes to the new scene's title instead of the page.
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = forwardedRef ?? fallbackRef;
  const focusTitleRef = useRef(false);
  const changeScene: React.Dispatch<React.SetStateAction<number>> = (value) => {
    focusTitleRef.current = !!containerRef.current?.contains(
      document.activeElement,
    );
    setSelectedScene(value);
  };

  useEffect(() => {
    if (!focusTitleRef.current) return;
    focusTitleRef.current = false;
    containerRef.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [selectedScene, containerRef]);
  const [resultMinDate, setResultMinDate] = useState<DateTime>(now());
  const [resultMaxDate, setResultMaxDate] = useState<DateTime>(now());

  useEffect(() => {
    const [min, max] = getValidDates(minDate, maxDate);

    setResultMaxDate(max);
    setResultMinDate(min);
  }, [minDate, maxDate]);

  useEffect(() => {
    let date = initialDate ? parseToDateTime(initialDate) : null;
    const [min, max] = getValidDates(minDate, maxDate);

    if (!date) {
      const today = now();
      date =
        today <= max && today >= min
          ? today
          : dateDiffAbs(today, min, "days") > dateDiffAbs(today, max, "days")
            ? max
            : min;

      date = startOf(date, "day")!;
      date = now();
    } else if (date > max || date < min) {
      date =
        dateDiffAbs(date, min, "days") > dateDiffAbs(date, max, "days")
          ? max
          : min;

      date = startOf(date, "day")!;

      console.warn(
        "Initial date is out of min/max dates boundaries. Initial date will be set as closest boundary value",
      );
    }
    setObservedDate(date);
  }, [initialDate, maxDate, minDate]);

  const CalendarBodyNode =
    selectedScene === 0 ? (
      <Days
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={changeScene}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
        locale={locale}
      />
    ) : selectedScene === 1 ? (
      <Months
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={changeScene}
        selectedDate={selectedDate}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
        locale={locale}
      />
    ) : (
      <Years
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={changeScene}
        selectedDate={selectedDate}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
      />
    );

  const CalendarNode = isScroll ? (
    <Scrollbar>{CalendarBodyNode}</Scrollbar>
  ) : (
    CalendarBodyNode
  );

  return (
    <div
      {...pickAriaProps(rest)}
      role={groupRoleWhenNamed(rest)}
      id={id}
      className={classNames(styles.container, className, {
        [styles.isScroll]: isScroll,
      })}
      style={style}
      ref={containerRef}
      data-testid={dataTestId ?? "calendar"}
    >
      {CalendarNode}
    </div>
  );
};

export { Calendar };
