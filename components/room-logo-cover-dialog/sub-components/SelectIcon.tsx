import React from "react";
import hexRgb from "hex-rgb";

import { activateOnButtonKey } from "../../../utils/keyboard-activation";

import type { SelectIconProps } from "../RoomLogoCoverDialog.types";
import styles from "../RoomLogoCoverDialog.module.scss";

const pressOnKey = (e: React.KeyboardEvent<HTMLDivElement>) =>
  activateOnButtonKey(e, ({ currentTarget }) => currentTarget.click());

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
  const iconLabel = t("CreateEditRoomDialog:Icon");

  return (
    <div>
      <div className="icon-container">
        <div className="color-name">{iconLabel}</div>
        <div
          className={`${styles.withoutIcon}${withoutIcon ? ` ${styles.isSelected}` : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={withoutIcon}
          onClick={toggleWithoutIcon}
          onKeyDown={pressOnKey}
          data-testid="room_logo_cover_without_icon"
        >
          {t("Common:WithoutIcon")}
        </div>
      </div>

      <div className="cover-icon-container" role="group" aria-label={iconLabel}>
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
              // The glyph is server SVG with no title, so the button is named
              // by its place in the row.
              role="button"
              tabIndex={0}
              aria-label={`${iconLabel} ${index + 1}`}
              aria-pressed={isSelected}
              onClick={
                coverId === icon.id ? toggleWithoutIcon : () => setIcon(icon)
              }
              onKeyDown={pressOnKey}
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
