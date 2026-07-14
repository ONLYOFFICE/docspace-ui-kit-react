// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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

  const [selectedColor, setSelectedColor] = React.useState<string>(defaultColor);
  const [selectedCover, setSelectedCover] = React.useState<ICover | null>(defaultCover);
  const [withoutIcon, setWithoutIcon] = React.useState<boolean>(defaultCover == null);

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
