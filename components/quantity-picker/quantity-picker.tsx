import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useState,
} from "react";
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
  name: string;
  value: number;
}

type QuantityPickerProps = {
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  title?: string | null;
  subtitle?: string;
  showPlusSign?: boolean;
  isDisabled?: boolean;
  showSlider?: boolean;
  onChange: (value: number) => void;
  className?: string;
  items?: Array<number | TabItemObject>;
  isLarge?: boolean;
  withoutControls?: boolean;
  disableValue?: string;
  underControlsTitle?: string | React.ReactNode;
  isZeroAllowed?: boolean;
  enableZero?: boolean;
  minusTooltipId?: string;
  minusDisabled?: boolean;
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
  enableZero = false,
  minusTooltipId,
  minusDisabled,
}) => {
  const displayValue = showPlusSign
    ? value > maxValue
      ? `${maxValue}+`
      : `${value}`
    : `${value}`;

  const overflowValue = showPlusSign ? maxValue + 1 : maxValue;

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
    [styles.isContant]: disableValue,
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

  const handleButtonClick = (e: MouseEvent<HTMLDivElement>) => {
    const operation = e.currentTarget.dataset.operation as "plus" | "minus";
    let newValue = +value;

    setDraftValue(null);

    if (operation === "plus") {
      if (value <= maxValue) {
        if (newValue < minValue) {
          newValue = minValue;
          setError(false);
        } else {
          newValue += step;
        }
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

  const handleButtonMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const buttonProps = isDisabled
    ? {}
    : { onClick: handleButtonClick, onMouseDown: handleButtonMouseDown };
  const minusButtonProps = isDisabled || minusDisabled ? {} : buttonProps;
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
    onChange(value + itemValue);
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
            [styles.isDisabled]: isDisabled,
          })}
        >
          {subtitle}
        </Text>
      ) : null}

      <div className={styles.countControls}>
        {withoutControls ? null : (
          <div
            className={minusCircleClass}
            {...minusButtonProps}
            {...(minusTooltipId ? { "data-tooltip-id": minusTooltipId } : {})}
            data-operation="minus"
            data-testid="quantity_picker_minus_icon"
          >
            <MinusIcon className={controlButtonClass} />
          </div>
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
            testId="quantity_picker_input"
          />
        )}

        {withoutControls ? null : (
          <div
            className={`${circleClass} ${styles.plusIcon}`}
            {...buttonProps}
            data-operation="plus"
            data-testid="quantity_picker_plus_icon"
          >
            <PlusIcon className={controlButtonClass} />
          </div>
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
            max={maxValue + 1}
            step={step}
            withPouring
            value={value}
            {...sliderProps}
            className={styles.slider}
            dataTestId="quantity_picker_slider"
          />
          <div className={styles.sliderTrack}>
            <Text className={styles.sliderTrackValueMin}>{minValue}</Text>
            <Text className={styles.sliderTrackValueMax}>{`${maxValue}+`}</Text>
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
