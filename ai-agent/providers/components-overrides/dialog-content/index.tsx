import React from "react";
import classNames from "classnames";

import { useTheme } from "@onlyoffice/ai-chat";
import type { DialogContentProps } from "@onlyoffice/ai-chat";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { useIsMobile } from "../../../../hooks/use-is-mobile";
import { useVirtualKeyboardInset } from "../../../../hooks/useVirtualKeyboardInset";
import { isTouchDevice } from "../../../../utils/device";

import styles from "./DialogContent.module.scss";

const DialogContentOverride: React.FC<DialogContentProps> = ({
  children,
  header,
  onClose,
  isHuge = false,
  withWarningIcon = false,
}) => {
  const { themeId } = useTheme();

  const isMobile = useIsMobile();
  const sheetRef = React.useRef<HTMLDivElement>(null);
  // ModalDialog mounts its content through a Portal one render late, so the
  // sheet is only reachable once this body node has been attached.
  const [bodyNode, setBodyNode] = React.useState<HTMLDivElement | null>(null);

  // On mobile the dialog is a bottom sheet pinned to the layout viewport,
  // which the virtual keyboard covers. Lift it by the same inset the chat
  // pane uses to keep the composer visible.
  const keyboardInset = useVirtualKeyboardInset(isMobile);

  React.useEffect(() => {
    // Dialogs open from the composer (e.g. a prompt's action menu) while its
    // textarea still holds focus, leaving the keyboard up over the sheet.
    // Drop that focus unless the dialog already took it (autofocused input).
    const sheet = sheetRef.current;
    if (!isTouchDevice || !bodyNode || !sheet) return;

    const { activeElement } = document;
    if (activeElement instanceof HTMLElement && !sheet.contains(activeElement))
      activeElement.blur();
  }, [bodyNode]);

  React.useEffect(() => {
    const sheet = sheetRef.current;
    if (!bodyNode || !sheet) return;

    sheet.style.bottom = keyboardInset ? `${keyboardInset}px` : "";
  }, [bodyNode, keyboardInset]);

  return (
    <ModalDialog
      visible
      autoMaxHeight
      withoutPadding
      displayType={ModalDialogType.modal}
      isHuge={isHuge}
      onClose={onClose}
      sheetRef={sheetRef}
    >
      <ModalDialog.Header>{header}</ModalDialog.Header>
      <ModalDialog.Body>
        <div
          ref={setBodyNode}
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
