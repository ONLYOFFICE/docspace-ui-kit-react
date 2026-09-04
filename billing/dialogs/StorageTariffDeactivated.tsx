import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";
import {
  ModalDialog,
  ModalDialogType,
} from "../../components/modal-dialog";
import { calculateTotalPrice, getConvertedSize } from "../utils/common";
import { STORAGE_TARIFF_DEACTIVATED } from "../constants";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useNavigate } from "react-router";
import styles from "./StorageTariff.module.scss";

type StorageTariffDeactivatedProps = {
  visible: boolean;
  onClose?: () => void;
  onOpenPanel?: () => void;
};

const StorageTariffDeactivated = observer(
  ({
    visible,
    onClose,
    onOpenPanel,
  }: StorageTariffDeactivatedProps) => {
    const navigate = useNavigate();
    const store = usePaymentStore();
    const {
      storagePriceIncrement,
      formatWalletCurrency,
      setIsShowTariffDeactivatedModal,
    } = store;
    const { previousStoragePlanSize } = store.tariff;
    const {
      usedTotalStorageSizeCount,
      maxTotalSizeByQuota,
      isStorageTariffLimit,
    } = store.quotas;

    const t = useCommonTranslation();

    const totalPrice = calculateTotalPrice(
      previousStoragePlanSize,
      storagePriceIncrement,
    );

    const onCloseModal = () => {
      localStorage.setItem(STORAGE_TARIFF_DEACTIVATED, "true");
      setIsShowTariffDeactivatedModal(false);
      onClose?.();
    };

    const onClick = () => {
      if (onOpenPanel) {
        onOpenPanel();
      } else {
        navigate(store.routes.services, { state: { openDialog: true } });
      }

      onCloseModal();
    };

    return (
      <ModalDialog
        visible={visible}
        onClose={onCloseModal}
        autoMaxHeight
        displayType={ModalDialogType.modal}
        isLarge
      >
        <ModalDialog.Header>
          <Text fontSize="21px" isBold>
            {t("Warning")}
          </Text>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Text fontWeight={600}>{t("StorageTariffDeactivated")}</Text>
          <br />
          <Text as="span">
            <CommonTrans
              i18nKey="PreviousPlan"
             
              values={{
                amount: `${previousStoragePlanSize} ${t("Gigabyte")}`,
                price: formatWalletCurrency(totalPrice, 2),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
                2: <Text className={styles.monthPayment} as="span" />,
              }}
            />
          </Text>
          <Text>
            <CommonTrans
              i18nKey="StorageUsed"
             
              values={{
                amount: getConvertedSize(t, usedTotalStorageSizeCount!),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
              }}
            />
          </Text>
          <Text>
            <CommonTrans
              i18nKey="AvailableLimit"
             
              values={{
                amount: getConvertedSize(t, maxTotalSizeByQuota!),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
              }}
            />
          </Text>
          <br />
          <Text>{t("TopUpToReactivateStorage")}</Text>
          {isStorageTariffLimit ? (
            <Text as="span">{t("StorageRestrictions")}</Text>
          ) : null}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            className="send-button"
            label={
              onOpenPanel ? t("BuyStorage") : t("GoToAddon")
            }
            size={ButtonSize.normal}
            primary
            onClick={onClick}
            testId="go_to_service_button"
          />
          <Button
            className="cancel-button"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            onClick={onCloseModal}
            testId="close_storage_tariff_deactivated_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default StorageTariffDeactivated;
