import { Text } from "../../../../../../components/text";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import { usePaymentStore } from "../../../../../store/PaymentStoreProvider";
import { formatterCurrencyWithoutTranction } from "../../../../../wallet/utils";
import type { BonusSplit } from "../../../utils";

import styles from "../BonusSplit.module.scss";

const SplitLine = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.line}>
    <Text as="span" fontSize="12px">
      {label}
    </Text>
    <Text as="span" fontSize="12px" fontWeight={600} className={styles.value}>
      {value}
    </Text>
  </div>
);

export const BonusSplitContent = ({ split }: { split: BonusSplit }) => {
  const t = useCommonTranslation();
  const { language, walletCodeCurrency } = usePaymentStore();
  const currency = split.currency || walletCodeCurrency;
  const format = (value: number) =>
    formatterCurrencyWithoutTranction(language, value, currency);

  return (
    <div className={styles.content} data-testid="bonus_split_content">
      <div className={styles.title}>
        {split.wallet > 0
          ? t("PaidPartlyWithPromoCredits")
          : t("PaidWithPromoCredits")}
      </div>
      <SplitLine label={t("PromoCredits")} value={format(split.bonus)} />
      <SplitLine label={t("PurchasedCredits")} value={format(split.wallet)} />
      <Text as="div" fontSize="12px" className={styles.details}>
        {split.wallet > 0
          ? t("PromoSplitPurchasedNote")
          : t("PromoSplitNothingPurchased")}
      </Text>
    </div>
  );
};
