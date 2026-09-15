import hexRgb from "hex-rgb";

import { Text } from "../../text";
import { getTextColor } from "../../../utils";
import { globalColors } from "../../../providers/theme/themes";
import type { CustomLogoProps } from "../RoomLogoCoverDialog.types";
import styles from "../RoomLogoCoverDialog.module.scss";

export const CustomLogo = ({
  color,
  cover,
  withoutIcon,
  isBaseTheme,
  roomTitle,
}: CustomLogoProps) => {
  const textColor = color ? getTextColor(color, 202) : undefined;

  const darkBg =
    color && !isBaseTheme
      ? hexRgb(color, { alpha: 0.09, format: "css" })
      : undefined;

  return (
    <div
      className={styles.customLogo}
      style={
        {
          "--logo-color": color,
          "--logo-text-color": textColor,
          "--logo-color-dark": darkBg,
        } as React.CSSProperties
      }
    >
      {withoutIcon || !cover ? (
        <div className="logo-cover_wrapper">
          <Text
            className="logo-cover-text"
            fontSize="41px"
            color={textColor || globalColors.white}
            fontWeight={700}
          >
            {roomTitle}
          </Text>
        </div>
      ) : (
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG icon data from server
          dangerouslySetInnerHTML={{ __html: cover.data }}
          className="custom-logo-cover"
        />
      )}
    </div>
  );
};
