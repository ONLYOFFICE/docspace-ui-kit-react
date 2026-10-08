import React from "react";
import hexRgb from "hex-rgb";

import type { SelectIconProps } from "../RoomLogoCoverDialog.types";
import styles from "../RoomLogoCoverDialog.module.scss";

export const SelectIcon = ({
  t,
  withoutIcon,
  setWithoutIcon,
  setIcon,
  covers,
  currentColorScheme,
  coverId,
}: SelectIconProps) => {
  const toggleWithoutIcon = () => setWithoutIcon(!withoutIcon);

  return (
    <div>
      <div className="icon-container">
        <div className="color-name">{t("CreateEditRoomDialog:Icon")}</div>
        <div
          className={`${styles.withoutIcon}${withoutIcon ? ` ${styles.isSelected}` : ""}`}
          onClick={toggleWithoutIcon}
          data-testid="room_logo_cover_without_icon"
        >
          {t("WithoutIcon")}
        </div>
      </div>

      <div className="cover-icon-container">
        {covers.map((icon, index) => {
          const isSelected = coverId === icon.id ? !withoutIcon : false;
          const accent = currentColorScheme?.main?.accent;
          const iconStyle = accent
            ? ({
                "--icon-hover-color": accent,
                "--icon-selected-bg": isSelected
                  ? hexRgb(accent, { alpha: 0.2, format: "css" })
                  : undefined,
              } as React.CSSProperties)
            : undefined;

          return (
            <div
              className={`${styles.iconContainer}${isSelected ? ` ${styles.isSelected}` : ""}`}
              style={iconStyle}
              onClick={
                coverId === icon.id ? toggleWithoutIcon : () => setIcon(icon)
              }
              key={icon.id}
              id={`cover-icon-${icon.id}`}
              data-testid={`room_logo_cover_icon_${index}`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG icon data from server
              dangerouslySetInnerHTML={{ __html: icon.data }}
            />
          );
        })}
      </div>
    </div>
  );
};
