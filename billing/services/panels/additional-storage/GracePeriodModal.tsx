import React from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type GracePeriodModalProps = {
  visible: boolean;
  onClose: () => void;
};

const GracePeriodModal: React.FC<GracePeriodModalProps> = ({
  visible,
  onClose,
}) => {
  const paymentStore = usePaymentStore();
  const { paymentDate, gracePeriodEndDate, delayDaysCount } =
    paymentStore.tariff;
  const { currentTariffPlanTitle: tariffPlanTitle } = paymentStore.quotas;

  const t = useCommonTranslation();
  const navigate = useNavigate();
  const onClick = () => {
    navigate(paymentStore.routes.portalPayments);
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      autoMaxHeight
      isLarge
    >
      <ModalDialog.Header>{t("Warning")}</ModalDialog.Header>
      <ModalDialog.Body>
        <Text fontWeight={600}>
          {t("ServiceManagementUnavailable", { planName: tariffPlanTitle })}
        </Text>
        <br />
        <Text fontWeight={600}>{t("Reminder")}</Text>
        <Text as="span" dataTestId="grace_period_info">
          <CommonTrans
           
            i18nKey="GracePeriodActivatedInfo"
            values={{
              fromDate: paymentDate,
              byDate: gracePeriodEndDate,
              delayDaysCount,
            }}
            components={{
              1: <Text as="span" />,
            }}
          />
        </Text>{" "}
        <Text as="span">
          {t("GracePeriodActivatedDescription")}
        </Text>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          key="OkButton"
          label={t("GoToTariffPlan")}
          size={ButtonSize.normal}
          primary
          onClick={onClick}
          testId="grace_period_ok_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          onClick={onClose}
          testId="grace_period_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(GracePeriodModal);
