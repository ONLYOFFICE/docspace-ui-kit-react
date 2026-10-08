import React from "react";
import classNames from "classnames";

import { ModalDialogBackdropProps } from "../ModalDialog.types";
import styles from "../ModalDialog.module.scss";

const ModalBackdrop = ({
  className,
  zIndex,
  children,
}: ModalDialogBackdropProps) => {
  return (
    <div
      style={{ zIndex }}
      className={classNames(styles.modalBackdrop, className)}
    >
      {children}
    </div>
  );
};

export { ModalBackdrop };
