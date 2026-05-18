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

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import classNames from "classnames";

import CrossIconReactSvg from "../../assets/icons/12/cross.react.svg";
import PlusIconSvg from "../../assets/icons/12/plus.svg";
import SearchIconReactSvg from "../../assets/search.react.svg";

import { useDebounce } from "../../hooks/useDebounce";

import { MainButton } from "../main-button";
import { InputBlock } from "../input-block";
import { InputType } from "../text-input";

import styles from "./SearchInput.module.scss";
import { SearchInputProps } from "./SearchInput.types";

const SearchInput = ({
  forwardedRef,
  value = "",
  autoRefresh = true,
  refreshTimeout = 1000,
  showClearButton = false,
  onClearSearch,
  onChange,
  size,
  className,
  style,
  scale = false,
  onClick,
  id,
  name,
  isDisabled = false,
  placeholder,
  onFocus,
  children,
  dataTestId,
  tabIndex,
  showMainButton = false,
  mainButtonProps,
  mainButtonIcon = <PlusIconSvg />,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const afterClear = useRef(false);
  const prevValueRef = useRef(value);

  const debouncedOnChange = useDebounce(
    useCallback(() => {
      if (!afterClear.current) {
        onChange?.(prevValueRef.current);
      }
    }, [onChange]),
    refreshTimeout,
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      prevValueRef.current = newValue;
      afterClear.current = false;
      if (autoRefresh) {
        debouncedOnChange(newValue);
      }
    },
    [autoRefresh, debouncedOnChange],
  );

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    prevValueRef.current = "";
    afterClear.current = true;
    onClearSearch?.();
  }, [onClearSearch]);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setInputValue(value);
    }
  }, [value]);

  const getIconNode = () => {
    const showCrossIcon = !!inputValue || showClearButton;

    const iconNode = (
      <div className="icon-button_svg not-selectable">
        {showCrossIcon ? <CrossIconReactSvg /> : <SearchIconReactSvg />}
      </div>
    );

    return iconNode;
  };

  const handleMainButtonWrapperClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const mainBtnEl = (
        e.currentTarget as HTMLElement
      ).querySelector<HTMLElement>('[data-testid="main-button"]');
      if (mainBtnEl && !mainBtnEl.contains(target)) {
        (mainBtnEl.firstElementChild as HTMLElement)?.click();
      }

      e.preventDefault();
    },
    [],
  );

  const iconNode = getIconNode();
  const iconSizeValue = !!inputValue || showClearButton ? 12 : 14;
  const mainButtonWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={classNames(
        styles.searchInputBlock,
        { [styles.scale]: scale, [styles.isFilled]: !!inputValue },
        className,
      )}
      id={id}
      style={style}
      data-testid={dataTestId ?? "search-input"}
    >
      {showMainButton && mainButtonProps ? (
        <div
          ref={mainButtonWrapperRef}
          className={styles.mainButtonWrapper}
          onClick={handleMainButtonWrapperClick}
        >
          <span className={styles.mainButtonIcon}>{mainButtonIcon}</span>
          <MainButton
            {...mainButtonProps}
            hideArrow
            anchorRef={mainButtonWrapperRef}
          />
        </div>
      ) : null}
      <div className={styles.searchInputField}>
        <InputBlock
          className="search-input-block"
          forwardedRef={forwardedRef}
          onClick={onClick}
          id={id}
          name={name}
          value={inputValue}
          size={size}
          scale={scale}
          isDisabled={isDisabled}
          onChange={handleInputChange}
          onFocus={onFocus}
          // onBlur={handleBlur}
          type={InputType.text}
          iconNode={iconNode}
          iconButtonClassName={
            !!inputValue || showClearButton ? "search-cross" : "search-loupe"
          }
          isIconFill
          iconSize={iconSizeValue}
          onIconClick={
            !!inputValue || showClearButton ? handleClearSearch : undefined
          }
          placeholder={placeholder}
          tabIndex={tabIndex}
        >
          {children}
        </InputBlock>
      </div>
    </div>
  );
};

export { SearchInput };
