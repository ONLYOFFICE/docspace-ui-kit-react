import React from "react";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { ModalDialog, ModalDialogType } from "../../components/modal-dialog";
import { useCommonTranslation } from "../../utils/i18n";

import { usePaymentStore } from "../store/PaymentStoreProvider";

type RemoveStorageSubscriptionProps = {
  visible: boolean;
  onClose: () => void;
};

const RemoveStorageSubscription: React.FC<RemoveStorageSubscriptionProps> = ({
  visible,
  onClose,
}) => {
  const t = useCommonTranslation();
  const { removePreviousStorageSubscription } = usePaymentStore();

  const onRemove = () => {
    removePreviousStorageSubscription();
    onClose();
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      autoMaxHeight
    >
      <ModalDialog.Header>
        <Text fontSize="21px" isBold>
          {t("RemoveSubscription")}
        </Text>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Text fontSize="13px">
          {t("RemoveSubscriptionConfirm", {
            service: t("AdditionalDiskStorage"),
          })}
        </Text>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          primary
          scale
          size={ButtonSize.normal}
          label={t("Remove")}
          onClick={onRemove}
          testId="remove_storage_subscription_button"
        />
        <Button
          scale
          size={ButtonSize.normal}
          label={t("CancelButton")}
          onClick={onClose}
          testId="cancel_remove_storage_subscription_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(RemoveStorageSubscription);
