import React from "react";

import {
  ComboBox,
  ComboBoxSize,
  type TOption,
} from "../../../../components/combobox";
import { useCommonTranslation } from "../../../../utils/i18n";

import type { TServiceLimitPeriod } from "../common/types";
import { LIMIT_PERIODS, getPeriodLabel } from "../common/utils";
import styles from "../styles/ServiceLimits.module.scss";

type LimitPeriodComboBoxProps = {
  value: TServiceLimitPeriod;
  onChange: (period: TServiceLimitPeriod) => void;
  isDisabled?: boolean;
  testId?: string;
};

const LimitPeriodComboBox = ({
  value,
  onChange,
  isDisabled,
  testId,
}: LimitPeriodComboBoxProps) => {
  const t = useCommonTranslation();

  const options: TOption[] = LIMIT_PERIODS.map((period) => ({
    key: period,
    label: getPeriodLabel(t, period),
    dataTestId: `limit_period_${period.toLowerCase()}_option`,
  }));

  const selected: TOption = options.find((option) => option.key === value) ?? {
    key: value,
    label: getPeriodLabel(t, value),
  };

  const onSelect = (option: TOption) => {
    const period = LIMIT_PERIODS.find((item) => item === option.key);
    if (period) onChange(period);
  };

  return (
    <ComboBox
      className={styles.periodCombobox}
      options={options}
      selectedOption={selected}
      onSelect={onSelect}
      directionY="both"
      noBorder={false}
      scaled={false}
      size={ComboBoxSize.content}
      showDisabledItems
      isDisabled={isDisabled}
      title={t("LimitPeriod")}
      dataTestId={testId}
      dropDownTestId={testId ? `${testId}_dropdown` : undefined}
    />
  );
};

export default LimitPeriodComboBox;
