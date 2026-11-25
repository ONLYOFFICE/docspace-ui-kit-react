import React, { useMemo, memo, type JSX } from "react";

import classNames from "classnames";

import MediaContextMenu from "../../../assets/icons/16/vertical-dots.react.svg";
import BackArrow from "../../../assets/viewer.media.back.react.svg";
import { Text } from "../../../components/text";

import { ContextMenu } from "../../../components/context-menu";

import styles from "./MobileDetails.module.scss";
import type MobileDetailsProps from "./MobileDetails.props";

const MobileDetails = memo(
  ({
    ref,
    icon,
    title,
    isError,
    isPreviewFile,
    isPublicFile,
    onHide,
    onMaskClick,
    onContextMenu,
    contextModel,
  }: MobileDetailsProps): JSX.Element => {
    const contextMenuHeader = useMemo(
      () => ({
        icon,
        color: "",
        title,
      }),
      [icon, title],
    );

    return (
      <div
        className={classNames(styles.container)}
        role="dialog"
        aria-label={title}
      >
        {!isPublicFile ? (
          <BackArrow
            className={styles.mobileClose}
            onClick={onMaskClick}
            data-test-id="mobile-details-back"
            role="button"
            aria-label="Back"
          />
        ) : null}
        <Text
          fontSize="14px"
          className={styles.title}
          data-test-id="mobile-details-title"
        >
          {title}
        </Text>
        {!isPreviewFile && !isError ? (
          <div className="details-context">
            <MediaContextMenu
              className={styles.mobileContext}
              onClick={onContextMenu}
              data-test-id="mobile-details-context"
              role="button"
              aria-label="Open context menu"
            />
            <ContextMenu
              ref={ref}
              model={[]}
              withBackdrop
              onHide={onHide}
              header={contextMenuHeader}
              getContextModel={contextModel}
              data-test-id="mobile-details-context-menu"
            />
          </div>
        ) : null}
      </div>
    );
  },
);

MobileDetails.displayName = "MobileDetails";

export { MobileDetails };
