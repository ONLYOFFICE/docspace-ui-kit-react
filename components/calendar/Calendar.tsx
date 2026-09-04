import React, { useEffect, useState } from "react";
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
}: CalendarProps) => {
  const handleDateChange = (date: DateTime) => {
    // Combine the new date with the existing time from selectedDate
    const dateStr = formatDate(date, "yyyy-MM-dd");
    const timeStr = selectedDate ? formatDate(selectedDate, "HH:mm") : "00:00";
    let formattedDate = parseToDateTime(`${dateStr}T${timeStr}`)!;

    if (useMaxTime) {
      formattedDate = endOf(formattedDate, "day")!;
    }

    setSelectedDate?.(formattedDate);
    onChange?.(formattedDate);
  };

  const [observedDate, setObservedDate] = useState<DateTime>(now());
  const [selectedScene, setSelectedScene] = useState(0);
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
        setSelectedScene={setSelectedScene}
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
        setSelectedScene={setSelectedScene}
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
        setSelectedScene={setSelectedScene}
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
      id={id}
      className={classNames(styles.container, className, {
        [styles.isScroll]: isScroll,
      })}
      style={style}
      ref={forwardedRef}
      data-testid={dataTestId ?? "calendar"}
    >
      {CalendarNode}
    </div>
  );
};

export { Calendar };
