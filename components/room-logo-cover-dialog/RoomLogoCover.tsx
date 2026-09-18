import React from "react";
import classNames from "classnames";

import { isMobile } from "../../utils/device";
import { globalColors } from "../../providers/theme/themes";
import { getRoomTitle } from "../room-icon/RoomIcon.utils";
import { useTheme } from "../../context/ThemeContext";
import { Scrollbar } from "../scrollbar";

import { CustomLogo } from "./sub-components/CustomLogo";
import { SelectColor } from "./sub-components/SelectColor";
import { SelectIcon } from "./sub-components/SelectIcon";

import type { TTranslation } from "../../utils";
import type { TColorScheme } from "../../providers/theme/themes";
import type { ICover } from "./RoomLogoCoverDialog.types";
import styles from "./RoomLogoCoverDialog.module.scss";

export type RoomLogoCoverProps = {
  t: TTranslation;

  covers: ICover[];
  title?: string;

  /** Generic initial values — used by RoomLogoCoverDialog */
  initialColor?: string;
  initialCover?: ICover | null;

  /** Raw room data — UIKit derives initialColor/initialCover from these when provided */
  logoColor?: string;
  logoCover?: ICover | null;
  coverColor?: string;
  coverId?: string;
  withSelection?: boolean;

  openColorPicker: boolean;

  isBaseTheme?: boolean;
  currentColorScheme?: TColorScheme;

  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  scrollHeight?: string;
  generalScroll?: boolean;

  onInit?: (color: string, cover: ICover | null) => void;
  onChange?: (color: string, cover: ICover | null) => void;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomLogoCover = ({
  t,
  covers,
  title = "",
  initialColor,
  initialCover,
  logoColor,
  logoCover,
  coverColor,
  coverId,
  withSelection,
  openColorPicker,
  isBaseTheme,
  currentColorScheme,
  forwardedRef,
  scrollHeight,
  generalScroll,
  onInit,
  onChange,
  setOpenColorPicker,
}: RoomLogoCoverProps) => {
  const { isBase } = useTheme();
  const effectiveIsBaseTheme = isBaseTheme ?? isBase;

  const roomTitle = React.useMemo(() => getRoomTitle(title), [title]);

  const defaultCover: ICover | null = (() => {
    if (initialCover !== undefined) return initialCover;
    if (coverId) return covers.find((c) => c.id === coverId) ?? null;
    if (logoCover != null && withSelection) return logoCover;
    return null;
  })();

  const defaultColor: string = (() => {
    if (initialColor !== undefined) return initialColor;
    if (coverColor) return `#${coverColor}`;
    if (logoColor) return `#${logoColor}`;
    return globalColors.logoColors[0];
  })();

  const [selectedColor, setSelectedColor] =
    React.useState<string>(defaultColor);
  const [selectedCover, setSelectedCover] = React.useState<ICover | null>(
    defaultCover,
  );
  const [withoutIcon, setWithoutIcon] = React.useState<boolean>(
    defaultCover == null,
  );

  React.useEffect(() => {
    onInit?.(selectedColor, withoutIcon ? null : selectedCover);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange?.(color, withoutIcon ? null : selectedCover);
  };

  const handleSetIcon = (icon: ICover) => {
    setSelectedCover(icon);
    setWithoutIcon(false);
    onChange?.(selectedColor, icon);
  };

  const handleWithoutIconChange = (value: boolean) => {
    if (value && selectedCover === null) return;
    setWithoutIcon(value);
    onChange?.(selectedColor, value ? null : selectedCover);
  };

  const customColor = globalColors.logoColors.includes(selectedColor)
    ? null
    : selectedColor;

  const selectContainerBody = (
    <>
      <div className="color-select-container">
        <SelectColor
          t={t}
          selectedColor={selectedColor}
          logoColors={globalColors.logoColors}
          customColor={customColor}
          openColorPicker={openColorPicker}
          setOpenColorPicker={setOpenColorPicker}
          onChangeColor={handleColorChange}
        />
      </div>
      {covers.length > 0 ? (
        <div className="icon-select-container">
          <SelectIcon
            t={t}
            withoutIcon={withoutIcon}
            currentColorScheme={currentColorScheme}
            coverId={selectedCover?.id ?? ""}
            setIcon={handleSetIcon}
            setWithoutIcon={handleWithoutIconChange}
            covers={covers}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <div
      ref={forwardedRef}
      className={classNames(styles.roomLogoCoverContainer, {
        [styles.scrollLocked]: openColorPicker,
      })}
    >
      <div className="room-logo-container">
        <CustomLogo
          isBaseTheme={effectiveIsBaseTheme}
          color={selectedColor}
          cover={withoutIcon ? null : selectedCover}
          withoutIcon={withoutIcon}
          roomTitle={roomTitle}
        />
      </div>
      <div className="select-container">
        {isMobile() || generalScroll ? (
          selectContainerBody
        ) : (
          <Scrollbar style={{ height: scrollHeight }}>
            {selectContainerBody}
          </Scrollbar>
        )}
      </div>
    </div>
  );
};

export { RoomLogoCover };
