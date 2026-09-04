import React from "react";
import { RectangleSkeleton } from "../../../rectangle";
import { Aside } from "../../../aside";
import { Backdrop } from "../../../backdrop";
import styles from "./Dialog.module.scss";

import { DialogAsideSkeletonProps } from "./Dialog.types";
import { DialogInvitePanelSkeleton } from "./Dialog.invite";

const DialogAsideSkeleton = ({
  isPanel,
  withoutAside,
  withFooterBorder = false,
  isInvitePanelLoader,
  onClose,
}: DialogAsideSkeletonProps) => {
  const zIndex = 310;

  if (isInvitePanelLoader) return <DialogInvitePanelSkeleton />;

  const renderClearDialogAsideLoader = () => {
    return (
      <div
        className={styles.dialogAsideLoader}
        data-is-panel={isPanel ? "true" : "false"}
        data-with-footer-border={withFooterBorder ? "true" : "false"}
        data-testid="dialog-aside-skeleton"
      >
        <div className="dialog-loader-header">
          <RectangleSkeleton height="29px" />
        </div>
        <div className="dialog-loader-body">
          <RectangleSkeleton height="200px" />
        </div>
        <div className="dialog-loader-footer">
          <RectangleSkeleton height="40px" />
          <RectangleSkeleton height="40px" />
        </div>
      </div>
    );
  };

  return withoutAside ? (
    renderClearDialogAsideLoader()
  ) : (
    <>
      <Backdrop visible isAside zIndex={zIndex} onClick={onClose} />

      <div
        className={styles.dialogAsideLoader}
        data-is-panel={isPanel ? "true" : "false"}
        data-with-footer-border={withFooterBorder ? "true" : "false"}
      >
        <Aside
          className="dialog-aside-loader"
          visible
          zIndex={zIndex}
          onClose={() => onClose?.()}
        >
          {renderClearDialogAsideLoader()}
        </Aside>
      </div>
    </>
  );
};

export { DialogAsideSkeleton };
