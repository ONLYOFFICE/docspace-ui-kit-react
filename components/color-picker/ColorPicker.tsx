import { useId, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import classNames from "classnames";

import CrossIconSvg from "../../assets/icons/16/cross.react.svg";

import { Button, ButtonSize } from "../button";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import { globalColors } from "../../providers/theme";
import { useCommonTranslation } from "../../utils";

import styles from "./ColorPicker.module.scss";
import { ColorPickerProps } from "./ColorPicker.types";

const ColorPicker = ({
  className,
  id,
  onClose = () => {},
  onApply = () => {},
  appliedColor = globalColors.lightBlueMain,
  applyButtonLabel,
  cancelButtonLabel,
  isPickerOnly = false,
  handleChange,
  hexCodeLabel = "Hex code",
  ariaLabel = "Color picker",
  closeButtonLabel = "Close color picker",
}: ColorPickerProps) => {
  const t = useCommonTranslation();
  const [color, setColor] = useState(() => appliedColor);
  const hexInputId = useId();

  const applyLabel = applyButtonLabel ?? t("ApplyButton");
  const cancelLabel = cancelButtonLabel ?? t("CancelButton");

  // Escape is the keyboard's cancel: the same notification as the cancel
  // button and the cross.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
  };

  const onColorChange = (newColor: string) => {
    setColor(newColor);
    if (handleChange) handleChange(newColor);
  };

  return (
    <div
      className={classNames(styles.wrapper, className)}
      id={id}
      data-testid="color-picker"
      role="group"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {isPickerOnly ? (
        <div className={styles.hexHeader}>
          <div className={styles.hexText}>
            <Text
              fontSize="16px"
              lineHeight="22px"
              fontWeight={700}
              truncate
              data-testid="color-picker-title"
            >
              {t("Custom")}
            </Text>
          </div>
          <div className={styles.hexClose}>
            <IconButton
              className={styles.tableHeaderIconButton}
              size={16}
              onClick={onClose}
              iconNode={<CrossIconSvg />}
              isFill
              data-testid="color-picker-close"
              aria-label={closeButtonLabel}
            />
          </div>
        </div>
      ) : null}

      <div className={styles.hexColorPicker} data-testid="color-picker-content">
        <HexColorPicker
          color={color}
          onChange={onColorChange}
          aria-label="Color selector"
        />

        {!isPickerOnly ? (
          <div
            className={styles.hexValueContainer}
            data-testid="color-picker-hex-container"
          >
            <Text
              as="label"
              htmlFor={hexInputId}
              className={styles.hexValueLabel}
              data-testid="color-picker-hex-label"
            >
              {hexCodeLabel}:
            </Text>
            <HexColorInput
              id={hexInputId}
              prefixed
              color={color}
              onChange={onColorChange}
              className={styles.hexValue}
              data-testid="color-picker-hex-input"
              spellCheck="false"
            />
          </div>
        ) : null}

        {!isPickerOnly ? (
          <div className={styles.hexButton} data-testid="color-picker-buttons">
            <Button
              className={styles.applyButton}
              primary
              scale
              size={ButtonSize.small}
              label={applyLabel}
              onClick={() => onApply(color)}
              testId="color-picker-apply"
            />
            <Button
              className={styles.cancelButton}
              scale
              size={ButtonSize.small}
              label={cancelLabel}
              onClick={onClose}
              testId="color-picker-cancel"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { ColorPicker };
