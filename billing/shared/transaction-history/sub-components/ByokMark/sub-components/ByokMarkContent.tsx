import { Text } from "../../../../../../components/text";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import { usePaymentStore } from "../../../../../store/PaymentStoreProvider";
import { formatterCurrencyWithoutTranction } from "../../../../../wallet/utils";
import type { ByokOperation } from "../../../utils";

import styles from "../ByokMark.module.scss";

type LineProps = {
  label: string;
  value: string;
  bold?: boolean;
};

const Line = ({ label, value, bold }: LineProps) => (
  <div className={styles.line}>
    <Text
      as="span"
      fontSize="12px"
      fontWeight={bold ? 600 : 400}
      className={styles.label}
    >
      {label}
    </Text>
    <Text
      as="span"
      fontSize="12px"
      fontWeight={bold ? 600 : 400}
      className={styles.value}
    >
      {value}
    </Text>
  </div>
);

export const ByokMarkContent = ({
  operation,
}: {
  operation: ByokOperation;
}) => {
  const t = useCommonTranslation();
  const { language, formatServiceFeePercent } = usePaymentStore();
  const { provider, cost, debit = 0, currency, service } = operation;

  const format = (value: number) =>
    formatterCurrencyWithoutTranction(language, value, currency ?? "");

  const percent = formatServiceFeePercent(service ?? "");

  return (
    <div className={styles.content} data-testid="byok_content">
      <div className={styles.title}>
        {provider
          ? t("ByokKeyTooltipTitle", { provider })
          : t("ByokKeyTooltipTitleGeneric")}
      </div>
      <div className={styles.lines}>
        {cost != null ? (
          <Line
            label={
              provider
                ? t("BilledByProvider", { provider })
                : t("BilledByProviderGeneric")
            }
            value={format(cost)}
          />
        ) : null}
        <Line
          label={
            percent === undefined
              ? t("ServiceFee")
              : t("ServiceFeeWithPercent", { percent })
          }
          value={format(debit)}
          bold
        />
      </div>
      <div className={styles.note}>{t("OnlyServiceFeeCharged")}</div>
    </div>
  );
};
