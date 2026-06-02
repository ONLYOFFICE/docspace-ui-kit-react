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

import React from "react";
import equal from "fast-deep-equal/react";
import { isMobileOnly, isMobile, isTablet } from "react-device-detect";
import classNames from "classnames";

import EmptyIcon from "../../assets/empty.svg";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { TooltipContainer } from "../tooltip";

import { ComboButton } from "./sub-components/ComboButton";
import { ComboBoxSize, ComboBoxDisplayType } from "./ComboBox.enums";
import type { TComboboxProps, TOption } from "./ComboBox.types";
import styles from "./ComboBox.module.scss";

const compare = (prevProps: TComboboxProps, nextProps: TComboboxProps) => {
  return equal(prevProps, nextProps);
};

const ComboBoxPure: React.FC<TComboboxProps> = ({
  selectedOption: selectedOptionProps,
  setIsOpenItemAccess,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] =
    React.useState(selectedOptionProps);

  const ref = React.useRef<null | HTMLDivElement>(null);

  // const stopAction = (e: any) => e.preventDefault();

  // const setIsOpenAction = (value: boolean) => {
  //   const { setIsOpenItemAccess } = props;
  //   setIsOpen(value);
  //   setIsOpenItemAccess?.(value);
  // };

  const { withBackdrop = true, onBackdropClick, onToggle } = props;

  const handleClickOutside = React.useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;

      if (ref.current?.contains(target)) return;

      if (onToggle && !(withBackdrop && onBackdropClick)) return;

      setIsOpenItemAccess?.(!isOpen);
      setIsOpen(false);

      if (withBackdrop) onBackdropClick?.(e);
    },
    [isOpen, setIsOpenItemAccess, withBackdrop, onBackdropClick, onToggle],
  );

  const comboBoxClick: React.MouseEventHandler<HTMLDivElement | Element> = (
    e,
  ) => {
    const {
      disableIconClick = true,
      disableItemClick,
      isDisabled,
      onToggle,
      isLoading,
      disableItemClickFirstLevel = false,
    } = props;

    const target = e.target as HTMLElement;

    if (
      isDisabled ||
      disableItemClick ||
      isLoading ||
      (disableItemClickFirstLevel &&
        target.closest(".item-by-first-level") &&
        (isMobileOnly || isMobile || isTablet)) ||
      (disableIconClick && e && target.closest(".optionalBlock")) ||
      target.classList.contains("ScrollbarsCustom") ||
      target.classList.contains("ScrollbarsCustom-Thumb") ||
      target.classList.contains("ScrollbarsCustom-Track") ||
      target.classList.contains("backdrop-active")
    )
      return;

    onToggle?.(e as React.MouseEvent<HTMLDivElement>, !isOpen);
    setIsOpenItemAccess?.(!isOpen);

    setIsOpen((v) => {
      return !v;
    });
  };

  const { onSelect } = props;

  const optionClick = React.useCallback(
    (
      option: TOption,
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent
        | KeyboardEvent,
    ) => {
      if (option.isSeparator) return;
      if (option.disabled && option.tooltip) return;

      setIsOpen((v) => {
        setIsOpenItemAccess?.(!v);
        return !v;
      });

      onSelect?.(option);

      event?.stopPropagation();
    },
    [onSelect, setIsOpenItemAccess],
  );

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      const options = document.querySelectorAll(
        '[data-testid="drop-down-item"]',
      );
      const currentFocusedIndex = Array.from(options).findIndex(
        (opt) => opt.getAttribute("data-focused") === "true",
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentFocusedIndex === -1
              ? 0
              : (currentFocusedIndex + 1) % options.length;
          options.forEach((opt, i) => {
            opt.setAttribute(
              "data-focused",
              i === nextIndex ? "true" : "false",
            );
          });
          break;
        }
        case "Enter": {
          e.preventDefault();
          const focusedOption = Array.from(options).find(
            (opt) => opt.getAttribute("data-focused") === "true",
          );
          if (focusedOption) {
            const optionIndex = Array.from(options).indexOf(focusedOption);
            const option = props.options?.[optionIndex];
            if (option && !option.disabled) {
              optionClick(option, e);
            }
          }
          break;
        }
        default:
          break;
      }
    },
    [isOpen, props.options, optionClick],
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const {
    dropDownMaxHeight,
    directionX,
    directionY,
    size = ComboBoxSize.base,
    type,
    options,
    advancedOptions,
    isDisabled,
    children,
    noBorder,
    scaled = true,
    scaledOptions,
    displayType = ComboBoxDisplayType.default,
    textOverflow,
    comboIcon,
    manualY,
    manualX,
    isDefaultMode = true,
    manualWidth = "200px",
    displaySelectedOption,
    fixedDirection,
    withBlur,
    fillIcon,
    offsetX,
    modernView,
    isAside,
    withBackground,
    advancedOptionsCount,
    isMobileView,
    withoutPadding,
    isLoading,
    isNoFixedHeightOptions,
    hideMobileView,
    forceCloseClickOutside,
    withoutBackground,
    opened,
    dropDownId,
    title,
    className,
    plusBadgeValue,
    optionStyle,
    style,
    withLabel = true,
    displayArrow,
    topSpace,
    usePortalBackdrop,
    tabIndex,
    onClickSelectedItem,
    shouldShowBackdrop,
    dropDownClassName,
    dropDownTestId,
    dataTestId,
    noSelect = true,
    useImageIcon = false,
    withoutArrow = false,
  } = props;

  React.useEffect(() => {
    setIsOpen(opened || false);
    setIsOpenItemAccess?.(opened || false);
  }, [opened, setIsOpenItemAccess]);

  React.useEffect(() => {
    setSelectedOption(selectedOptionProps);
  }, [selectedOptionProps]);

  React.useEffect(() => {
    setIsOpen(false);
  }, []);

  const dropDownMaxHeightProp = dropDownMaxHeight
    ? { maxHeight: dropDownMaxHeight }
    : {};

  const dropDownManualWidthProp =
    scaledOptions && !isDefaultMode
      ? { manualWidth: "100%" }
      : scaledOptions && ref.current
        ? { manualWidth: `${ref.current.clientWidth}px` }
        : { manualWidth };

  const optionsLength = options.length
    ? options.length
    : displayType !== "toggle"
      ? 0
      : 1;

  // Todo: Add support advancedOptions === Array
  const withAdvancedOptions =
    React.isValidElement(advancedOptions) && !!advancedOptions?.props.children;

  let optionsCount = optionsLength;

  if (withAdvancedOptions) {
    const advancedOptionsWithoutSeparator: TOption[] =
      React.isValidElement(advancedOptions) && advancedOptions.props
        ? (advancedOptions.props as { children: TOption[] }).children.filter(
            (option: TOption) => option?.key !== "s1",
          )
        : [];

    const advancedOptionsWithoutSeparatorLength =
      advancedOptionsWithoutSeparator.length;

    optionsCount =
      advancedOptionsCount || advancedOptionsWithoutSeparatorLength
        ? advancedOptionsWithoutSeparatorLength
        : 6;
  }

  const disableMobileView = optionsCount < 4 || hideMobileView;

  const renderedOptions = React.useMemo(() => {
    if (!options?.length) return null;

    const selectedLabel = selectedOption?.label;
    const selectedKey = selectedOption?.key;

    return options.map((option) => {
      const {
        key,
        disabled,
        label,
        icon,
        isBeta,
        withExternalLink,
        externalLinkPath,
        onExternalLinkClick,
      } = option;

      const isSameAsSelectedLabel = label === selectedLabel;
      const isSameAsSelectedKey = key === selectedKey;

      const optionDisabled =
        disabled || (!displaySelectedOption && isSameAsSelectedLabel);

      const isActiveOption = withLabel
        ? isSameAsSelectedLabel
        : isSameAsSelectedKey;
      const isActive = displaySelectedOption && isActiveOption;
      const isSelected = isActiveOption;

      const handleClick = (
        e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
      ) => optionClick(option, e);
      const handleClickSelected = () => onClickSelectedItem?.(option);

      return (
        <DropDownItem
          key={key}
          testId={
            option.dataTestId ||
            `drop_down_item_${key.toString().toLowerCase()}`
          }
          label={label}
          icon={icon}
          isBeta={isBeta}
          data-focused={isOpen ? isActiveOption : undefined}
          data-is-separator={option.isSeparator || undefined}
          data-type={option.type || undefined}
          aria-disabled={optionDisabled || undefined}
          className={`drop-down-item ${option?.className || ""}`}
          textOverflow={textOverflow}
          disabled={optionDisabled}
          onClick={handleClick}
          onClickSelectedItem={handleClickSelected}
          fillIcon={option.fillIcon ?? fillIcon}
          isModern={noBorder}
          isActive={isActive}
          isSelected={isSelected}
          style={optionStyle}
          isSeparator={option.isSeparator}
          tooltip={option.tooltip}
          withExternalLink={withExternalLink}
          externalLinkPath={externalLinkPath}
          onExternalLinkClick={onExternalLinkClick}
        />
      );
    });
  }, [
    options,
    selectedOption?.label,
    selectedOption?.key,
    displaySelectedOption,
    withLabel,
    textOverflow,
    fillIcon,
    noBorder,
    optionStyle,
    isOpen,
    onClickSelectedItem,
    optionClick,
  ]);

  const dropDownProps = React.useMemo(
    () => ({
      open: isOpen,
      directionX,
      directionY,
      manualWidth,
      manualX,
      manualY: manualY?.toString(),
      fixedDirection,
      forwardedRef: ref,
      withBlur,
      offsetX,
      withBackdrop,
      isAside,
      withBackground,
      advancedOptionsCount,
      isMobileView,
      withoutPadding,
      isNoFixedHeightOptions,
      forceCloseClickOutside,
      withoutBackground,
      dropDownId,
      eventTypes: ["mousedown"],
      topSpace,
      usePortalBackdrop,
      style,
      showDisabledItems: true,
      isDefaultMode,
      clickOutsideAction: handleClickOutside,
      shouldShowBackdrop,
      className: dropDownClassName,
      dataTestId: dropDownTestId,
    }),
    [
      isOpen,
      directionX,
      directionY,
      manualWidth,
      manualX,
      manualY,
      fixedDirection,
      withBlur,
      offsetX,
      withBackdrop,
      isAside,
      withBackground,
      advancedOptionsCount,
      isMobileView,
      withoutPadding,
      isNoFixedHeightOptions,
      forceCloseClickOutside,
      withoutBackground,
      dropDownId,
      topSpace,
      usePortalBackdrop,
      style,
      isDefaultMode,
      handleClickOutside,
      shouldShowBackdrop,
      dropDownClassName,
      dropDownTestId,
    ],
  );

  const dropDownContent = advancedOptions || renderedOptions;

  const dropDownElement = React.useMemo(
    () => (
      <DropDown
        {...dropDownProps}
        {...dropDownMaxHeightProp}
        {...dropDownManualWidthProp}
      >
        {dropDownContent}
      </DropDown>
    ),
    [
      dropDownProps,
      dropDownMaxHeightProp,
      dropDownManualWidthProp,
      dropDownContent,
    ],
  );

  const comboboxClasses = classNames(styles.combobox, className, styles[size], {
    [styles.scaled]: scaled,
    [styles.isOpen]: isOpen,
    [styles.noSelect]: noSelect,
    [styles.disableMobileView]: disableMobileView,
    [styles.withoutPadding]: withoutPadding,
  });

  const imageProps = useImageIcon
    ? {
        imageIcon: EmptyIcon,
        imageAlt:
          typeof selectedOption.label === "string"
            ? selectedOption.label
            : String(selectedOption.key),
      }
    : {};

  return (
    <TooltipContainer
      as="div"
      className={comboboxClasses}
      ref={ref}
      onClick={comboBoxClick}
      data-testid={dataTestId ?? "combobox"}
      title={title}
      data-scaled={scaledOptions || undefined}
      style={style}
    >
      <ComboButton
        noBorder={noBorder}
        isDisabled={isDisabled}
        selectedOption={selectedOption}
        withOptions={optionsLength > 0}
        optionsLength={optionsLength}
        withAdvancedOptions={withAdvancedOptions}
        innerContainer={children}
        innerContainerClassName="optionalBlock"
        isOpen={isOpen}
        size={size as ComboBoxSize}
        scaled={scaled}
        comboIcon={comboIcon}
        modernView={modernView}
        fillIcon={selectedOption.fillIcon ?? fillIcon}
        tabIndex={tabIndex}
        isLoading={isLoading}
        type={type}
        plusBadgeValue={plusBadgeValue}
        displayArrow={displayArrow}
        noSelect={noSelect}
        withoutArrow={withoutArrow}
        {...imageProps}
      />

      {displayType !== "toggle" ? dropDownElement : null}
    </TooltipContainer>
  );
};

export { ComboBoxPure };

export const ComboBox = React.memo(ComboBoxPure, compare);
