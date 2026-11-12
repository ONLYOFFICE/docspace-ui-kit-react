import React from "react";
import classNames from "classnames";

import ViewerMediaCloseIcon from "../../../assets/viewer.media.close.svg";

import { Text } from "../../../components/text";
import { IconButton } from "../../../components/icon-button";

import type { DesktopDetailsProps } from "./DesktopDetails.type";
import styles from "./DesktopDetails.module.scss";
import { globalColors } from "../../../providers/theme/themes";

export const DesktopDetails = ({
  onMaskClick,
  title,
  className,
  showCloseButton,
}: DesktopDetailsProps) => {
  return (
    <div
      className={classNames(styles.container, className)}
      data-testid="desktop-details"
      role="dialog"
      aria-labelledby="media-viewer-title"
    >
      <Text
        id="media-viewer-title"
        className={styles.title}
        data-testid="desktop-details-title"
      >
        {title}
      </Text>

      {showCloseButton ? (
        <div
          className={styles.controlBtn}
          onClick={onMaskClick}
          data-testid="desktop-details-close"
        >
          <IconButton
            color={globalColors.white}
            iconNode={<ViewerMediaCloseIcon />}
            size={28}
            isClickable
          />
        </div>
      ) : null}
    </div>
  );
};
