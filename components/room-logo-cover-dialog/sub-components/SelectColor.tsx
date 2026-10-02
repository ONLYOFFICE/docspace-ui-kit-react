import React, { useState, useRef } from "react";

import { isMobile } from "../../../utils/device";
import { useClickOutside } from "../../../utils/use-click-outside";
import { ModalDialog, ModalDialogType } from "../../modal-dialog";
import { IconButton } from "../../icon-button";
import { DropDown } from "../../drop-down";
import { DropDownItem } from "../../drop-down-item";
import { ColorPicker } from "../../color-picker";
import { globalColors } from "../../../providers/theme/themes";

import PlusIcon from "../../../assets/icons/16/button.plus.react.svg";
import PencilIcon from "../../../assets/pencil.react.svg";

import type { SelectColorProps } from "../RoomLogoCoverDialog.types";
import styles from "../RoomLogoCoverDialog.module.scss";

export const SelectColor = ({
  logoColors,
  selectedColor,
  t,
  onChangeColor,
  customColor,
  openColorPicker,
  setOpenColorPicker,
}: SelectColorProps) => {
  const isDefaultColor = logoColors.includes(customColor!);
  const [pickerColor, setPickerColor] = useState<string | null>(
    isDefaultColor ? "" : customColor || "",
  );

  React.useEffect(() => {
    setPickerColor(customColor);
  }, [customColor]);

  const iconRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useClickOutside(pickerRef, () => {
    setOpenColorPicker(false);
  });

  const onApply = (color: string) => {
    setPickerColor(color);
    onChangeColor(color);
  };

  const onOpenColorPicker = () => {
    if (pickerColor && pickerColor !== selectedColor) {
      return onChangeColor(pickerColor);
    }
    setOpenColorPicker(true);
  };

  const isSelectedColorPicker = pickerColor === selectedColor;

  return (
    <div className="select-color-container">
      <div className="color-name">{t("Common:Color")}</div>
      <div className="colors-container">
        {logoColors.map((color, index) =>
          color === selectedColor ? (
            <div
              key={color}
              className={styles.selectedColorItem}
              style={{ "--item-color": color } as React.CSSProperties}
              data-testid={`color_item_selected_${index}`}
            >
              <div className="circle" />
            </div>
          ) : (
            <div
              key={color}
              className={styles.colorItem}
              style={{ "--item-color": color } as React.CSSProperties}
              onClick={() => onChangeColor(color)}
              data-testid={`color_item_${index}`}
            />
          ),
        )}
        {customColor ? (
          <div
            className={`${styles.customSelectedColor}${isSelectedColorPicker ? ` ${styles.isSelected}` : ""}${pickerColor === globalColors.white ? ` ${styles.whiteBorder}` : ""}`}
            style={
              {
                "--item-color": pickerColor,
                "--item-border-color":
                  pickerColor === globalColors.white
                    ? globalColors.black
                    : pickerColor,
                "--icon-fill":
                  pickerColor === globalColors.white
                    ? globalColors.black
                    : globalColors.white,
              } as React.CSSProperties
            }
            ref={iconRef}
            data-testid="color_item_custom_selected"
          >
            {isSelectedColorPicker ? (
              <div className="color-picker-circle">
                <IconButton
                  className="select-color-plus-icon"
                  size={12}
                  iconNode={<PencilIcon />}
                  onClick={onOpenColorPicker}
                  isFill
                />
              </div>
            ) : (
              <IconButton
                className="select-color-plus-icon"
                size={12}
                iconNode={<PencilIcon />}
                onClick={onOpenColorPicker}
                isFill
              />
            )}
          </div>
        ) : (
          <div
            className={`${styles.colorItem}${openColorPicker ? ` ${styles.isSelected}` : ""}`}
            ref={iconRef}
            data-testid="color_item_add_custom"
          >
            <IconButton
              className="select-color-plus-icon"
              size={16}
              iconNode={<PlusIcon />}
              onClick={onOpenColorPicker}
              isFill
            />
          </div>
        )}
        {isMobile() ? (
          <ModalDialog
            className={styles.colorPickerModal}
            displayType={ModalDialogType.modal}
            visible={openColorPicker}
            onClose={() => setOpenColorPicker(false)}
            blur={8}
          >
            <ModalDialog.Body>
              <ColorPicker
                id="buttons-hex"
                onClose={() => setOpenColorPicker(false)}
                onApply={onApply}
                isPickerOnly
                handleChange={onApply}
                appliedColor={selectedColor}
                applyButtonLabel={t("Common:ApplyButton")}
                cancelButtonLabel={t("Common:CancelButton")}
              />
            </ModalDialog.Body>
          </ModalDialog>
        ) : (
          <DropDown
            directionY="both"
            topSpace={16}
            forwardedRef={iconRef}
            withBackdrop={false}
            isDefaultMode
            open={openColorPicker}
            clickOutsideAction={() => setOpenColorPicker(false)}
          >
            <div ref={pickerRef}>
              <DropDownItem className="drop-down-item-hex" noHover noActive>
                <ColorPicker
                  id="accent-hex"
                  onClose={() => setOpenColorPicker(false)}
                  onApply={onApply}
                  isPickerOnly
                  handleChange={onApply}
                  appliedColor={selectedColor}
                  applyButtonLabel={t("Common:ApplyButton")}
                  cancelButtonLabel={t("Common:CancelButton")}
                />
              </DropDownItem>
            </div>
          </DropDown>
        )}
      </div>
    </div>
  );
};
