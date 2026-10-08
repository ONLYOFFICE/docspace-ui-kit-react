import React from "react";

import { observer } from "mobx-react";

import InfoIcon from "../../../../assets/info.outline.react.svg";

import { Text } from "../../../../components/text";
import { Loader, LoaderTypes } from "../../../../components/loader";

import styles from "../../styles/StorageSummary.module.scss";
import { useCommonTranslation } from "../../../../utils/i18n";
import { Link } from "../../../../components";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type StorageWarningProps = {
  isDisabled?: boolean;
  title?: string;
  body?: string;
  onCancelChange?: () => void;
  isCancelLoading?: boolean;
  style?: React.CSSProperties;
};

const StorageWarning: React.FC<StorageWarningProps> = ({
  title,
  body,
  onCancelChange,
  isCancelLoading,
  style,
  isDisabled,
}) => {
  const paymentStore = usePaymentStore();
  const currentStoragePlanSize =
    paymentStore.tariff?.currentStoragePlanSize ?? 0;

  const t = useCommonTranslation();

  const isCancellationMode = !!onCancelChange;

  return (
    <div className={styles.warningBlock} style={style}>
      <div className={styles.warningTitle}>
        <InfoIcon />
        {title ? (
          <Text fontWeight={600} className={styles.warningColor}>
            {title}
          </Text>
        ) : (
          <Text fontWeight={600}>{t("Important")}</Text>
        )}
      </div>

      <Text fontSize="12px" className={styles.warningBody}>
        {body ??
          t("StorageWarning", {
            amount: `${currentStoragePlanSize} ${t("Gigabyte")}`,
            storageUnit: t("Gigabyte"),
          })}
      </Text>

      {!isDisabled && isCancellationMode ? (
        <div className={styles.cancelChangeRow}>
          <Link
            textDecoration="underline dashed"
            onClick={isCancelLoading ? () => {} : onCancelChange}
            fontWeight={600}
            color="accent"
          >
            {t("CancelChange")}
          </Link>
          {isCancelLoading ? (
            <div className={styles.loaderContainer}>
              <Loader
                color=""
                size="16px"
                type={LoaderTypes.track}
                className={styles.refreshLoader}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default observer(StorageWarning);
