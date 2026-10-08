import React, { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import classNames from "classnames";

import PlusIcon from "../../assets/payment.plus.react.svg";
import MinusIcon from "../../assets/minus.react.svg";

import { Text } from "../text";
import { Slider } from "../slider";
import { TextInput } from "../text-input";
import { InputType } from "../text-input";
import { TabItem } from "../tab-item";

import styles from "./quantity-picker.module.scss";

interface TabItemObject {
  /** Tab label; rendered with a leading plus sign */
  name: string;
  /** Amount added to the current value when the tab is selected */
  value: number;
}

type QuantityPickerProps = {
  /** Current value; the component is controlled */
  value: number;
  /** Lower bound for the controls, typed input and slider */
  minValue: number;
  /** Upper bound; nothing the component does goes past it, except the one overflow step `showPlusSign` allows */
  maxValue: number;
  /** Amount the plus and minus controls and the slider move by; the last step up is shortened so it stops at the bound */
  step: number;
  /** Heading above the controls; omitted when empty */
  title?: string | null;
  /** Secondary line under the title; omitted when empty */
  subtitle?: string;
  /** Lets the value go exactly one past `maxValue` (to `maxValue + 1`), shown as `maxValue+` */
  showPlusSign?: boolean;
  /** Disables every control and replaces the input with static text */
  isDisabled?: boolean;
  /** Renders a slider bound to the value, from `minValue` to `maxValue` (`maxValue + 1` with `showPlusSign`) */
  showSlider?: boolean;
  /** Called with the new value */
  onChange: (value: number) => void;
  /** Class name on the root element */
  className?: string;
  /** Preset tabs; selecting one adds its amount to the current value, capped like the plus control */
  items?: Array<number | TabItemObject>;
  /** Widens the value field from 101px to 140px */
  isLarge?: boolean;
  /** Hides the plus and minus controls */
  withoutControls?: boolean;
  /** Text shown in place of the value while `isDisabled` is set; the field then sizes to its content */
  disableValue?: string;
  /** Text under the controls; turns to the warning colour while an invalid value is entered with `enableZero` */
  underControlsTitle?: string | React.ReactNode;
  /**
   * Former name of `enableZero`, kept as an alias; `enableZero` wins when both are set.
   * @deprecated Use `enableZero`.
   */
  isZeroAllowed?: boolean;
  /** Allows zero as a value below `minValue`; other values below it are flagged */
  enableZero?: boolean;
  /** Tooltip id set as `data-tooltip-id` on the minus control */
  minusTooltipId?: string;
  /** Disables only the minus control; it stays focusable (`aria-disabled`) so `minusTooltipId` can still explain why */
  minusDisabled?: boolean;
  /** Accessible name of the minus control, e.g. a translated "Decrease"; no `aria-label` is rendered without it */
  decreaseLabel?: string;
  /** Accessible name of the plus control, e.g. a translated "Increase"; no `aria-label` is rendered without it */
  increaseLabel?: string;
};

const shouldSetIncrementError = (
  newValue: number,
  enableZero: boolean,
  minValue: number,
): boolean => {
  if (!enableZero) return false;
  if (enableZero && newValue < minValue) return newValue !== 0;

  return false;
};

const QuantityPicker: React.FC<QuantityPickerProps> = ({
  value,
  minValue,
  maxValue,
  step,
  title,
  subtitle,
  showPlusSign,
  isDisabled,
  showSlider,
  onChange,
  className,
  items,
  isLarge,
  withoutControls,
  disableValue,
  underControlsTitle,
  enableZero: enableZeroProp,
  isZeroAllowed,
  minusTooltipId,
  minusDisabled,
  decreaseLabel,
  increaseLabel,
}) => {
  const enableZero = enableZeroProp ?? isZeroAllowed ?? false;

  const displayValue = showPlusSign
    ? value > maxValue
      ? `${maxValue}+`
      : `${value}`
    : `${value}`;

  // The highest value the component itself ever produces: `maxValue`, or the
  // single `maxValue+` overflow state when `showPlusSign` is on.
  const overflowValue = showPlusSign ? maxValue + 1 : maxValue;
  const capToOverflow = (next: number) => Math.min(next, overflowValue);

  const [error, setError] = useState(false);
  const [draftValue, setDraftValue] = useState<string | null>(null);

  const containerClass = classNames(styles.container, className);
  const titleClass = classNames(styles.countTitle, {
    [styles.disabled]: isDisabled,
  });

  const titleUnderControlsClass = classNames(styles.underContorlsText, {
    [styles.warningIncrementFromZero]: enableZero ? error : false,
  });

  const inputClass = classNames(styles.countInput, {
    [styles.disabled]: isDisabled,
    [styles.isLarge]: isLarge,
    [styles.isConstant]: isDisabled && disableValue,
  });
  const circleClass = classNames(styles.circle, {
    [styles.disabled]: isDisabled,
  });
  const controlButtonClass = classNames(styles.controlButton, {
    [styles.disabled]: isDisabled,
  });

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setDraftValue(null);
    onChange(newValue);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    const operation = e.currentTarget.dataset.operation as "plus" | "minus";
    let newValue = +value;

    setDraftValue(null);

    if (operation === "plus") {
      if (newValue < minValue) {
        newValue = minValue;
        setError(false);
      } else if (newValue < overflowValue) {
        newValue = capToOverflow(newValue + step);
      }
    }

    if (operation === "minus") {
      if (value > maxValue) {
        newValue = maxValue;
      } else if (newValue - step >= minValue) {
        newValue -= step;
      } else {
        newValue = enableZero ? 0 : minValue;
        setError(false);
      }
    }

    if (newValue !== +value) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = e.target.value.replace(/\D/g, "");
    const numberValue = +nextDraft;

    if (nextDraft !== "" && numberValue > maxValue) {
      setDraftValue(null);

      if (overflowValue !== value) onChange(overflowValue);

      setError(false);
      return;
    }

    setDraftValue(nextDraft);

    if (nextDraft === "") return;

    if (!enableZero && numberValue < minValue) return;

    if (numberValue !== value) onChange(numberValue);

    setError(shouldSetIncrementError(numberValue, enableZero, minValue));
  };

  const commitDraftValue = () => {
    if (draftValue === null) return;

    const numberValue = draftValue === "" ? 0 : +draftValue;
    const nextValue =
      enableZero || numberValue >= minValue ? numberValue : minValue;

    setDraftValue(null);

    if (nextValue !== value) onChange(nextValue);

    setError(shouldSetIncrementError(nextValue, enableZero, minValue));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitDraftValue();
  };

  const handleButtonMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const buttonProps = isDisabled
    ? {}
    : { onClick: handleButtonClick, onMouseDown: handleButtonMouseDown };
  const minusButtonProps = isDisabled || minusDisabled ? {} : buttonProps;
  const isMinusInactive = !isDisabled && minusDisabled;
  const minusCircleClass = classNames(circleClass, styles.minusIcon, {
    [styles.disabled]: minusDisabled,
  });
  const sliderProps = isDisabled ? {} : { onChange: handleSliderChange };
  const inputProps = isDisabled
    ? {}
    : {
        onChange: handleInputChange,
        onBlur: commitDraftValue,
        onKeyDown: handleInputKeyDown,
      };

  const createTabItems = () => {
    if (!items || !items.length) return [];

    return items.map((item) => {
      if (typeof item === "number") {
        return {
          name: `+${item}`,
          id: item.toString(),
          value: item,
          content: null,
          isDisabled,
        };
      }

      return {
        name: `+${item.name}`,
        id: item.value.toString(),
        value: item.value,
        content: null,
        isDisabled,
      };
    });
  };

  const onSelectTab = (e: React.MouseEvent<HTMLDivElement>) => {
    const itemValue = Number(e.currentTarget.dataset.value);
    if (itemValue === undefined) return;

    setDraftValue(null);
    onChange(capToOverflow(value + itemValue));
    setError(false);
  };

  const tabItems = createTabItems();

  return (
    <div className={containerClass}>
      {title ? (
        <Text fontWeight={600} fontSize="16px" className={titleClass}>
          {title}
        </Text>
      ) : null}

      {subtitle ? (
        <Text
          fontWeight={600}
          fontSize="11px"
          className={classNames(styles.subTitle, {
            [styles.disabled]: isDisabled,
          })}
        >
          {subtitle}
        </Text>
      ) : null}

      <div className={styles.countControls}>
        {withoutControls ? null : (
          <button
            type="button"
            className={minusCircleClass}
            {...minusButtonProps}
            {...(minusTooltipId ? { "data-tooltip-id": minusTooltipId } : {})}
            {...(decreaseLabel ? { "aria-label": decreaseLabel } : {})}
            {...(isMinusInactive ? { "aria-disabled": true } : {})}
            disabled={isDisabled}
            data-operation="minus"
            data-testid="quantity_picker_minus_icon"
          >
            <MinusIcon className={controlButtonClass} aria-hidden="true" />
          </button>
        )}

        {isDisabled ? (
          <Text className={inputClass}>{disableValue ?? displayValue}</Text>
        ) : (
          <TextInput
            type={InputType.text}
            isReadOnly={isDisabled}
            withBorder={false}
            className={inputClass}
            value={draftValue ?? displayValue}
            style={{ boxShadow: "none" }}
            {...inputProps}
            // TextInput defaults to tabIndex -1; the value field has to be
            // reachable between the two controls.
            tabIndex={0}
            testId="quantity_picker_input"
          />
        )}

        {withoutControls ? null : (
          <button
            type="button"
            className={`${circleClass} ${styles.plusIcon}`}
            {...buttonProps}
            {...(increaseLabel ? { "aria-label": increaseLabel } : {})}
            disabled={isDisabled}
            data-operation="plus"
            data-testid="quantity_picker_plus_icon"
          >
            <PlusIcon className={controlButtonClass} aria-hidden="true" />
          </button>
        )}
      </div>

      <Text className={titleUnderControlsClass}>{underControlsTitle}</Text>
      {showSlider ? (
        <div className={styles.sliderWrapper}>
          <Slider
            thumbBorderWidth="8px"
            thumbHeight="32px"
            thumbWidth="32px"
            runnableTrackHeight="12px"
            isDisabled={isDisabled}
            min={minValue}
            max={overflowValue}
            step={step}
            withPouring
            value={value}
            {...sliderProps}
            className={styles.slider}
            dataTestId="quantity_picker_slider"
          />
          <div className={styles.sliderTrack}>
            <Text className={styles.sliderTrackValueMin}>{minValue}</Text>
            <Text
              className={styles.sliderTrackValueMax}
            >{`${maxValue}${showPlusSign ? "+" : ""}`}</Text>
          </div>
        </div>
      ) : null}

      {items && items.length > 0 ? (
        <div className={styles.tabsWrapper}>
          {tabItems.map((item) => {
            return (
              <TabItem
                data-value={item.value}
                key={item.id}
                label={item.name}
                onSelect={onSelectTab}
                isDisabled={isDisabled}
                allowNoSelection
                dataTestId={`add_${item.id}_tab_item`}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default QuantityPicker;
