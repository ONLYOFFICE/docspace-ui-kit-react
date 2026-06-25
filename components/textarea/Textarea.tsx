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

import React, { useRef, useEffect, useState, useCallback } from "react";
import copy from "copy-to-clipboard";
import classNames from "classnames";
import TextareaAutosize from "react-autosize-textarea";

import CopyIconUrl from "../../assets/icons/16/copy.react.svg";

import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";
import { IconButton } from "../icon-button";
import { Scrollbar } from "../scrollbar";
import { toastr } from "../toast";
import { jsonify, isJSON } from "./Textarea.utils";
import type { TextareaProps } from "./Textarea.types";
import styles from "./Textarea.module.scss";

const Textarea = ({
  className,
  wrapperClassName,
  id,
  isDisabled = false,
  isReadOnly = false,
  hasError = false,
  heightScale = false,
  maxLength,
  name,
  onChange,
  placeholder = " ",
  style,
  tabIndex = -1,
  value = "",
  fontSize = 13,
  heightTextArea,
  color,
  autoFocus,
  areaSelect = false,
  isJSONField = false,
  enableCopy = false,
  hasNumeration = false,
  isFullHeight = false,
  classNameCopyIcon,
  isChatMode = false,
  dataTestId,
  onKeyDown,
  onCopy,
  copyInfoText,
}: TextareaProps) => {
  const { isRTL } = useInterfaceDirection();

  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [isError, setIsError] = useState(hasError);
  const [isFocus, setIsFocus] = useState(false);
  const modifiedValue = jsonify(value, isJSONField);

  const calculateDimensions = useCallback(() => {
    const lineHeight = 1.5;
    const padding = 7;
    const numberOfLines = modifiedValue.split("\n").length;
    const fullHeight = numberOfLines * fontSize * lineHeight + padding + 4;
    const stringifiedHeight =
      typeof heightTextArea === "number"
        ? `${heightTextArea}px`
        : heightTextArea;

    const defaultPaddingLeft = 42;
    const numberOfDigits =
      String(numberOfLines).length - 2 > 0 ? String(numberOfLines).length : 0;
    const paddingLeftProp = hasNumeration
      ? fontSize < 13
        ? `${defaultPaddingLeft + numberOfDigits * 6}px`
        : `${((defaultPaddingLeft + numberOfDigits * 4) * fontSize) / 13}px`
      : "8px";

    return {
      fullHeight,
      stringifiedHeight,
      paddingLeftProp,
      numberOfLines,
    };
  }, [modifiedValue, fontSize, heightTextArea, hasNumeration]);

  const handleTextareaClick = useCallback(() => {
    if (areaRef.current) {
      areaRef.current.focus();
      if (enableCopy) {
        areaRef.current.select();
      }
    }
  }, [enableCopy]);

  const handleCopy = useCallback(() => {
    if (modifiedValue) {
      copy(modifiedValue);
      if (copyInfoText) {
        toastr.success(copyInfoText);
      }
      if (onCopy) {
        onCopy(modifiedValue);
      }
    }
  }, [modifiedValue, onCopy, copyInfoText]);

  useEffect(() => {
    setIsError(hasError);
  }, [hasError]);

  useEffect(() => {
    setIsError(isJSONField && (!value || !isJSON(value)));
  }, [isJSONField, value]);

  useEffect(() => {
    if (areaSelect && areaRef.current) {
      areaRef.current.select();
    }
  }, [areaSelect]);

  const { fullHeight, stringifiedHeight, paddingLeftProp, numberOfLines } =
    calculateDimensions();

  const numerationValue = Array.from(
    { length: numberOfLines },
    (_, index) => index + 1,
  ).join("\n");

  return (
    <div
      className={classNames(styles.wrapper, wrapperClassName, {
        [styles.heightScale]: heightScale,
        [styles.isFullHeight]: isFullHeight,
        [styles.defaultHeight]: !heightScale && !isFullHeight,
        [styles.isJSONField]: isJSONField && enableCopy,
        [styles.copy]: enableCopy,
        [styles.scrollbar]: isChatMode,
      })}
      style={
        {
          "--height-textarea": stringifiedHeight,
          "--full-height": `${fullHeight}px`,
        } as React.CSSProperties
      }
      onClick={handleTextareaClick}
    >
      {enableCopy ? (
        <IconButton
          className={`${styles.copyIconWrapper} ${classNameCopyIcon || ""}`}
          onClick={handleCopy}
          iconNode={<CopyIconUrl />}
          size={16}
        />
      ) : null}

      <Scrollbar
        className={classNames(className, {
          [styles.heightScale]: heightScale,
          [styles.isFullHeight]: isFullHeight,
          [styles.defaultHeight]: !heightScale && !isFullHeight,
          [styles.hasError]: isError || hasError,
          [styles.isDisabled]: isDisabled,
          [styles.scrollbar]: !isChatMode,
        })}
        style={
          {
            ...style,
            "--height-textarea": stringifiedHeight,
            "--full-height": `${fullHeight}px`,
          } as React.CSSProperties
        }
        data-disabled={isDisabled}
        data-error={isError || hasError}
        data-focus={isFocus}
      >
        {hasNumeration ? (
          <pre
            className={styles.numeration}
            style={fontSize !== 13 ? { fontSize: `${fontSize}px` } : {}}
          >
            {numerationValue}
          </pre>
        ) : null}
        {/*  @ts-expect-error: Passing pointer events causes a React warning - "Unknown event handler". TextareaAutosize types are outdated */}
        <TextareaAutosize
          id={id}
          className={classNames(styles.textarea, {
            [styles.isJSONField]: isJSONField,
            [styles.hasError]: isError || hasError,
          })}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={maxLength}
          name={name}
          tabIndex={tabIndex}
          disabled={isDisabled}
          readOnly={isReadOnly}
          value={isJSONField ? modifiedValue : value}
          style={
            {
              fontSize: `${fontSize}px`,
              color,
              "--padding-inline-start": paddingLeftProp,
            } as React.CSSProperties
          }
          autoFocus={autoFocus}
          ref={areaRef}
          dir="auto"
          data-dir={isRTL ? "rtl" : undefined}
          data-testid={dataTestId ?? "textarea"}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onClick={(e: React.MouseEvent<HTMLTextAreaElement>) =>
            e.stopPropagation()
          }
          onKeyDown={onKeyDown}
        />
      </Scrollbar>
    </div>
  );
};

export { Textarea };
