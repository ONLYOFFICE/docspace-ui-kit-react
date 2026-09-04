import { Text } from "../../components/text";
import { useCommonTranslation } from "../../utils/i18n";
import { observer } from "mobx-react";
import type { TenantQuotaFeatureDto } from "@onlyoffice/docspace-api-sdk";
import { PortalFeaturesLimitations } from "../../enums";
import { getConvertedSize } from "../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./MainTariff.module.scss";

const CurrentTariffContainer = observer(({ style }: { style?: React.CSSProperties }) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();
  const { quotaCharacteristics } = store.quotas;

  return (
    <div className={styles.currentTariffContainer} style={style}>
      {quotaCharacteristics.map((item: TenantQuotaFeatureDto) => {
        const maxValue = item.value;
        const usedValue = item.used?.value;

        if (maxValue === PortalFeaturesLimitations.Unavailable) return;

        const isExistsMaxValue =
          maxValue !== PortalFeaturesLimitations.Limitless;

        const resultingMaxValue =
          item.type === "size" && isExistsMaxValue
            ? getConvertedSize(t, maxValue)
            : isExistsMaxValue
              ? maxValue
              : null;

        const resultingUsedValue =
          item.type === "size" ? getConvertedSize(t, usedValue) : usedValue;

        return (
          <div key={item.used?.title}>
            <Text isBold fontSize="14px">
              {item.used?.title}
              <Text
                className={styles.currentTariffCount}
                as="span"
                isBold
                fontSize="14px"
              >
                {resultingUsedValue}
                {resultingMaxValue ? `/${resultingMaxValue}` : ""}
              </Text>
            </Text>
          </div>
        );
      })}
    </div>
  );
});

export default CurrentTariffContainer;
