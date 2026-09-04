import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";
import { ModalDialog } from "../../components/modal-dialog";
import { getConvertedSize } from "../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./ChangePricingPlan.module.scss";
import { getBrandName } from "../../constants/brands";

type ChangePricingPlanDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const ChangePricingPlanDialog = observer(
  ({ visible, onClose }: ChangePricingPlanDialogProps) => {
    const store = usePaymentStore();
    const { managersCount, allowedStorageSizeByQuota } = store;
    const { addedManagersCount, usedTotalStorageSizeCount } = store.quotas;

    const t = useCommonTranslation();

    const onCloseModal = () => {
      onClose?.();
    };

    const allowedStorageSpace = getConvertedSize(t, allowedStorageSizeByQuota);
    const currentStorageSpace = getConvertedSize(t, usedTotalStorageSizeCount);

    const planUsersLimitations = (
      <Text as="span" fontSize="13px">
        <CommonTrans
          i18nKey="PlanUsersLimit"
         
          values={{
            usersCount: managersCount,
            productName: getBrandName("ProductName"),
            currentUsersCount: addedManagersCount,
          }}
          components={{
            1: <Text as="span" fontWeight={700} />,
          }}
        />
      </Text>
    );

    const storagePlanLimitations = (
      <Text as="span" fontSize="13px">
        <CommonTrans
          i18nKey="PlanStorageLimit"
         
          values={{
            storageValue: allowedStorageSpace,
            currentStorageValue: currentStorageSpace,
          }}
          components={{
            1: <Text as="span" fontWeight={700} />,
          }}
        />
      </Text>
    );

    return (
      <ModalDialog
        visible={visible}
        onClose={onCloseModal}
        autoMaxHeight
        isLarge
      >
        <ModalDialog.Header>{t("ChangePricingPlan")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.content}>
            <Text fontSize="13px" isBold className={styles.cannotDowngradePlan}>
              {t("CannotChangePlan")}
            </Text>
            {planUsersLimitations}
            <br />
            {storagePlanLimitations}

            <Text fontSize="13px" className={styles.saveOrChange}>
              {t("SaveOrChange")}
            </Text>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            className="ok-button"
            label={t("OKButton")}
            size={ButtonSize.normal}
            primary
            onClick={onCloseModal}
            tabIndex={3}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default ChangePricingPlanDialog;

