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
        | React.KeyboardEvent,
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

  // The keyboard's place in the list. Focus stays on the button throughout
  // (the active-descendant pattern), and the options are virtualised, so the
  // highlighted option is kept here rather than looked up in the DOM.
  const listboxId = React.useId();
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // The same rule the rendered options follow: a separator, a disabled option
  // and -- unless displaySelectedOption -- the current value cannot be picked.
  const isOptionPickable = React.useCallback(
    (option: TOption) =>
      !option.isSeparator &&
      !option.disabled &&
      (props.displaySelectedOption || option.label !== selectedOption?.label),
    [props.displaySelectedOption, selectedOption?.label],
  );

  const stepActiveIndex = React.useCallback(
    (from: number, step: 1 | -1) => {
      const list = props.options ?? [];
      const start = from === -1 && step === -1 ? list.length : from;
      for (let i = 1; i <= list.length; i += 1) {
        const index = (start + step * i + list.length * 2) % list.length;
        if (isOptionPickable(list[index])) return index;
      }
      return -1;
    },
    [props.options, isOptionPickable],
  );

  React.useEffect(() => {
    if (!isOpen) setActiveIndex(-1);
  }, [isOpen]);

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
    id,
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

  const setOpenFromKeyboard = (
    e: React.KeyboardEvent<HTMLDivElement>,
    value: boolean,
  ) => {
    onToggle?.(e as unknown as React.MouseEvent<HTMLDivElement>, value);
    setIsOpenItemAccess?.(value);
    setIsOpen(value);
  };

  // The keys a listbox button answers: Enter, Space and the arrows open the
  // list; the arrows then move the highlight, Enter or Space picks it, and
  // Escape or Tab closes the list. Arrow navigation covers `options` only --
  // custom `advancedOptions` content is not a list of them.
  const onComboKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, [contenteditable='true']")) return;
    if (
      isDisabled ||
      isLoading ||
      props.disableItemClick ||
      displayType === ComboBoxDisplayType.toggle
    )
      return;

    const navigable = !withAdvancedOptions && options.length > 0;

    if (!isOpen) {
      if (!["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      if (!navigable && !withAdvancedOptions) return;
      e.preventDefault();

      const selectedIndex = options.findIndex((option) =>
        withLabel
          ? option.label === selectedOption?.label
          : option.key === selectedOption?.key,
      );
      setActiveIndex(
        !navigable
          ? -1
          : selectedIndex !== -1 && isOptionPickable(options[selectedIndex])
            ? selectedIndex
            : stepActiveIndex(-1, e.key === "ArrowUp" ? -1 : 1),
      );
      setOpenFromKeyboard(e, true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (navigable)
          setActiveIndex((index) =>
            stepActiveIndex(index, e.key === "ArrowUp" ? -1 : 1),
          );
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const option = navigable ? options[activeIndex] : undefined;
        if (option && isOptionPickable(option)) optionClick(option, e);
        break;
      }
      case "Escape":
        e.preventDefault();
        setOpenFromKeyboard(e, false);
        break;
      case "Tab":
        setOpenFromKeyboard(e, false);
        break;
      default:
        break;
    }
  };

  const disableMobileView = optionsCount < 4 || hideMobileView;

  const renderedOptions = React.useMemo(() => {
    if (!options?.length) return null;

    const selectedLabel = selectedOption?.label;
    const selectedKey = selectedOption?.key;

    return options.map((option, index) => {
      const {
        key,
        disabled,
        label,
        icon,
        description,
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
          description={description}
          isBeta={isBeta}
          id={`${listboxId}-${index}`}
          isActiveDescendant={isOpen && index === activeIndex}
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
    listboxId,
    activeIndex,
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
          typeof selectedOption?.label === "string"
            ? selectedOption.label
            : String(selectedOption?.key),
      }
    : {};

  return (
    <TooltipContainer
      as="div"
      id={id}
      className={comboboxClasses}
      ref={ref}
      onClick={comboBoxClick}
      onKeyDown={onComboKeyDown}
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
        activeDescendantId={
          activeIndex === -1 ? undefined : `${listboxId}-${activeIndex}`
        }
        size={size as ComboBoxSize}
        scaled={scaled}
        comboIcon={comboIcon}
        modernView={modernView}
        fillIcon={selectedOption?.fillIcon ?? fillIcon}
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
