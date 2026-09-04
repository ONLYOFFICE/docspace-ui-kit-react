import type { ReactNode } from "react";

import { ComboBox, ComboBoxSize, TOption } from "../../../components/combobox";
import { Text } from "../../../components/text";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { now } from "../../../utils/date";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type { TUsagePeriodKey } from "../../types";
import { USAGE_PERIODS } from "../utils";
import styles from "../styles/Usage.module.scss";

type PeriodSelectProps = {
  value: TUsagePeriodKey;
  onSelect: (period: TUsagePeriodKey) => void;
};

const PeriodSelect = ({ value, onSelect }: PeriodSelectProps) => {
  const t = useCommonTranslation();
  const { language } = usePaymentStore();

  const getLabel = (period: TUsagePeriodKey): ReactNode => {
    const current = now().setLocale(language || "en");
    const hintSpan = (
      <Text as="span" className={styles.periodHint} fontWeight={600} />
    );

    switch (period) {
      case "thisMonth":
        return (
          <CommonTrans
            i18nKey="ThisMonthWithHint"
            values={{ month: current.toFormat("LLLL") }}
            components={{ 1: hintSpan }}
          />
        );
      case "lastMonth":
        return (
          <CommonTrans
            i18nKey="LastMonthWithHint"
            values={{ month: current.minus({ months: 1 }).toFormat("LLLL") }}
            components={{ 1: hintSpan }}
          />
        );
      case "thisYear":
        return (
          <CommonTrans
            i18nKey="ThisYearWithHint"
            values={{ year: current.year }}
            components={{ 1: hintSpan }}
          />
        );
      case "lastYear":
        return (
          <CommonTrans
            i18nKey="LastYearWithHint"
            values={{ year: current.year - 1 }}
            components={{ 1: hintSpan }}
          />
        );
      case "last3Months":
        return t("Last3Months");
      case "last6Months":
        return t("Last6Months");
      case "last12Months":
        return t("Last12Months");
      default:
        return null;
    }
  };

  const options: TOption[] = USAGE_PERIODS.map((period) => ({
    key: period,
    label: getLabel(period),
    dataTestId: `usage_period_${period}`,
  }));

  const selectedOption =
    options.find((option) => option.key === value) ?? options[0];

  const handleSelect = (option: TOption) => {
    onSelect(option.key as TUsagePeriodKey);
  };

  return (
    <ComboBox
      options={options}
      selectedOption={selectedOption}
      onSelect={handleSelect}
      directionY="both"
      size={ComboBoxSize.content}
      scaled={false}
      dropDownMaxHeight={320}
      dataTestId="usage_period_combobox"
      dropDownTestId="usage_period_dropdown"
    />
  );
};

export default PeriodSelect;

