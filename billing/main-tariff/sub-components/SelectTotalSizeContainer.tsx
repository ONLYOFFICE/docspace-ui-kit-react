import React from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { observer } from "mobx-react";
import { getConvertedSize } from "../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./SubComponents.module.scss";

const SelectTotalSizeContainer = observer(
  ({ isNeedPlusSign }: { isNeedPlusSign: boolean }) => {
    const paymentStore = usePaymentStore();
    const { allowedStorageSizeByQuota } = paymentStore;

    const { usedTotalStorageSizeTitle } = paymentStore.paymentQuotas;

    const t = useCommonTranslation();

    const convertedSize = getConvertedSize(t, allowedStorageSizeByQuota);

    return (
      <div className={styles.selectTotalSizeContainer}>
        <Text
          textAlign="center"
          fontWeight={600}
          fontSize="11px"
          className={styles.selectTotalSizeTitle}
          color="var(--payment-storage-size-title)"
        >
          {usedTotalStorageSizeTitle}: {convertedSize}{" "}
          {isNeedPlusSign ? "+" : ""}
        </Text>
      </div>
    );
  },
);

export default SelectTotalSizeContainer;

