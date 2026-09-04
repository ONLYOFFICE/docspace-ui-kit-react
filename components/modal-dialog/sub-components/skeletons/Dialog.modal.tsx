import React from "react";
import { RectangleSkeleton } from "../../../rectangle";
import styles from "./Dialog.module.scss";
import { DialogSkeletonProps } from "./Dialog.types";

export const DialogModalSkeleton = ({ isLarge, withFooterBorder }: DialogSkeletonProps) => {
  return (
    <div
      className={styles.dialogLoader}
      data-is-large={isLarge ? "true" : "false"}
      data-with-footer-border={withFooterBorder ? "true" : "false"}
      data-testid="dialog-skeleton"
    >
      <div className="dialog-loader-header">
        <RectangleSkeleton height="29px" />
      </div>
      <div className="dialog-loader-body">
        <RectangleSkeleton height={isLarge ? "175px" : "73px"} />
      </div>
      <div className="dialog-loader-footer">
        <RectangleSkeleton height="40px" />
        <RectangleSkeleton height="40px" />
      </div>
    </div>
  );
};