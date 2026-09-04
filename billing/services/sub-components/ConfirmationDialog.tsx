import React from "react";
import { useCommonTranslation } from "../../../utils/i18n";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";

interface ConfirmationDialogProps {
  visible: boolean;
  onClose: () => void;
  bodyText: React.ReactNode | React.ReactNode[];
  title: string;
  onConfirm: () => void;
  acceptLabel?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  onClose,
  bodyText,
  title,
  onConfirm,
  acceptLabel,
}) => {
  const t = useCommonTranslation();

  const bodyItems = Array.isArray(bodyText) ? bodyText : [bodyText];

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      withBodyScroll
    >
      <ModalDialog.Header>{title}</ModalDialog.Header>
      <ModalDialog.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {bodyItems.map((item, index) => (
            <Text as="span" key={index}>
              {item}
            </Text>
          ))}
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={acceptLabel ?? t("ContinueButton")}
          size={ButtonSize.normal}
          onClick={onConfirm}
          primary
          scale
          testId="service-confirmation-dialog-continue-button"
        />
        <Button
          label={t("CancelButton")}
          size={ButtonSize.normal}
          onClick={onClose}
          testId="service-confirmation-dialog-close-button"
          scale
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ConfirmationDialog;
