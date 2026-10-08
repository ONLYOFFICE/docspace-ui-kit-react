import { useRef, useState } from "react";
import { HexColorInput } from "react-colorful";
import classNames from "classnames";

import { DropDownItem } from "../drop-down-item";
import { DropDown } from "../drop-down";

import { ColorInputProps } from "./ColorInput.types";
import { ColorPicker } from "../color-picker";
import { globalColors } from "../../providers/theme";
import { useCommonTranslation } from "../../utils";
import styles from "./ColorInput.module.scss";

const ColorInput = ({
  className,
  id,
  handleChange,
  defaultColor,
  size,
  scale,
  isDisabled,
  hasError,
  hasWarning,
  dataTestId,
  inputLabel,
  pickerButtonLabel = "Color picker",
}: ColorInputProps) => {
  const t = useCommonTranslation();
  const [color, setColor] = useState(
    defaultColor || globalColors.lightBlueMain,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  // Bumped on every opening: the picker reads its colour only when it mounts,
  // and the closed drop-down keeps it mounted, so it is remounted to start
  // from the colour the field holds now rather than the one it first had.
  const [pickerKey, setPickerKey] = useState(0);
  const swatchRef = useRef<HTMLButtonElement>(null);

  const closePicker = () => setIsPickerOpen(false);
  const togglePicker = () => {
    if (!isPickerOpen) setPickerKey((key) => key + 1);
    setIsPickerOpen(!isPickerOpen);
  };

  // The picker's cross and Escape hand the focus back to the swatch.
  const onPickerClose = () => {
    closePicker();
    swatchRef.current?.focus();
  };

  const onChange = (value: string) => {
    handleChange?.(value);
    setColor(value);
  };

  const colorBlockStyles = {
    "--block-color": color,
  } as React.CSSProperties;

  return (
    <div
      data-testid={dataTestId ?? "color-input"}
      className={classNames(styles.wrapper, className)}
      id={id}
    >
      <div
        className={classNames(styles.inputWrapper, { [styles.scale]: scale })}
      >
        <HexColorInput
          className={styles.hexValue}
          prefixed
          color={color.toUpperCase()}
          onChange={onChange}
          data-size={size}
          data-error={hasError ? "true" : undefined}
          data-warning={hasWarning ? "true" : undefined}
          data-scale={scale ? "true" : undefined}
          data-disabled={isDisabled ? "true" : undefined}
          disabled={isDisabled}
          aria-label={inputLabel ?? t("Color")}
          aria-invalid={hasError || undefined}
        />
        <button
          type="button"
          ref={swatchRef}
          className={classNames(styles.colorBlock, {
            [styles.disabled]: isDisabled,
          })}
          style={colorBlockStyles}
          onClick={togglePicker}
          disabled={isDisabled}
          aria-label={pickerButtonLabel}
          aria-expanded={isPickerOpen}
          data-testid="color-input-swatch"
        />
      </div>

      <DropDown
        manualY="48px"
        withBackdrop
        isDefaultMode={false}
        open={isPickerOpen}
        clickOutsideAction={closePicker}
      >
        <DropDownItem
          className={classNames(styles.dropDownItemHex, "drop-down-item-hex")}
        >
          <ColorPicker
            key={pickerKey}
            appliedColor={color}
            handleChange={onChange}
            isPickerOnly
            onClose={onPickerClose}
          />
        </DropDownItem>
      </DropDown>
    </div>
  );
};

export { ColorInput };
