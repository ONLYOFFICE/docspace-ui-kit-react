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

import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import {
  InputSize,
  InputType,
  TextInput,
} from "../text-input";

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

  const changeHours = (time: string) => {
    setHours(time);
    const dateStr = `${formatDate(date, "yyyy-MM-dd")} ${time}:${minutes}`;
    const newDate = parseWithFormat(dateStr, "yyyy-MM-dd HH:mm");
    if (newDate) setDate(newDate);

    const dateFormat = isTwelveHourFormat
      ? "yyyy-MM-dd hh:mm a"
      : "yyyy-MM-dd HH:mm";

    const parsedDate = parseWithFormat(
      `${formatDate(date, "yyyy-MM-dd")} ${time}:${minutes} ${meridiem ?? ""}`.trim(),
      dateFormat,
    );
    if (parsedDate) onChange(parsedDate);
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
    const dateStr = `${formatDate(date, "yyyy-MM-dd")} ${hours}:${time}`;
    const newDate = parseWithFormat(dateStr, "yyyy-MM-dd HH:mm");
    if (newDate) setDate(newDate);

    const dateFormat = isTwelveHourFormat
      ? "yyyy-MM-dd hh:mm a"
      : "yyyy-MM-dd HH:mm";

    const parsedDate = parseWithFormat(
      `${formatDate(date, "yyyy-MM-dd")} ${hours}:${time} ${meridiem ?? ""}`.trim(),
      dateFormat,
    );
    if (parsedDate) onChange(parsedDate);
  };

  const handleChangeHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = e.target.value;

    if (h.length > 2) {
      focusMinutesInput();
      return;
    }

    if (h === "") {
      changeHours("00");
      return;
    }
    if (!/^\d+$/.test(h)) return;

    const maxHours = isTwelveHourFormat ? 12 : 23;

    if (+h > maxHours) {
      focusMinutesInput();
      if (h.length === 2) changeHours(`0${h[0]}`);
      return;
    }

    const maxHoursDigit = isTwelveHourFormat ? 1 : 2;

    if (h.length === 1 && +h > maxHoursDigit) {
      changeHours(`0${h}`);
      focusMinutesInput();
      return;
    }

    if (h.length === 2) focusMinutesInput();

    changeHours(h);
  };

  const handleChangeMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = e.target.value;

    if (m.length > 2) {
      blurMinutesInput();
      return;
    }

    if (m === "") {
      changeMinutes("00");
      return;
    }
    if (!/^\d+$/.test(m)) return;

    if (+m > 59) {
      onBlur?.();
      return;
    }

    if (m.length === 1 && +m > 5) {
      changeMinutes(`0${m}`);
      blurMinutesInput();
      return;
    }
    if (m.length === 2) {
      blurMinutesInput();
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
      aria-label="Time picker"
    >
      <TextInput
        className={`${classNameInput}-hours-input`}
        withBorder={false}
        forwardedRef={hoursInputRef}
        value={hours}
        onChange={handleChangeHours}
        onBlur={onHoursBlur}
        tabIndex={tabIndex}
        onFocus={focusInput}
        type={InputType.search}
        onContextMenu={preventDefaultContext}
        autoComplete="off"
        inputMode="numeric"
        size={InputSize.base}
        data-test-id="hours-input"
        aria-label="Hours"
      />
      :
      <TextInput
        className={`${classNameInput}-minutes-input`}
        withBorder={false}
        forwardedRef={minutesInputRef}
        value={minutes}
        onChange={handleChangeMinutes}
        onClick={focusMinutesInput}
        onBlur={onMinutesBlur}
        onFocus={focusInput}
        type={InputType.search}
        onContextMenu={preventDefaultContext}
        autoComplete="off"
        inputMode="numeric"
        size={InputSize.base}
        data-test-id="minutes-input"
        aria-label="Minutes"
      />
    </div>
  );
};

export { TimePicker };
