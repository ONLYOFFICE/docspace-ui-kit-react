import React from "react";
import classNames from "classnames";

import { useTheme } from "@onlyoffice/ai-chat";
import type { DialogContentProps } from "@onlyoffice/ai-chat";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";

import styles from "./DialogContent.module.scss";

const DialogContentOverride: React.FC<DialogContentProps> = ({
  children,
  header,
  onClose,
  isHuge = false,
  withWarningIcon = false,
}) => {
  const { themeId } = useTheme();

  return (
    <ModalDialog
      visible
      autoMaxHeight
      withoutPadding
      displayType={ModalDialogType.modal}
      isHuge={isHuge}
      onClose={onClose}
    >
      <ModalDialog.Header>{header}</ModalDialog.Header>
      <ModalDialog.Body>
        <div
          className={classNames("aui-root", themeId, styles.body, {
            [styles.warning]: withWarningIcon,
          })}
        >
          {children}
        </div>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

DialogContentOverride.displayName = "DialogContentOverride";

export { DialogContentOverride };

