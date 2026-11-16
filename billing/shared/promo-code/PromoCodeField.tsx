import React from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { FieldContainer } from "../../../components/field-container";
import { InputType, TextInput } from "../../../components/text-input";
import type { TPromoCode } from "./usePromoCode";
import styles from "./PromoCodeField.module.scss";

type PromoCodeFieldProps = {
  promoCode: TPromoCode;
};

const PromoCodeField = ({ promoCode }: PromoCodeFieldProps) => {
  const t = useCommonTranslation();
  const { code, error, isSubmitting, onChange, onSubmit } = promoCode;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className={styles.promoCodeField} data-testid="wallet_promo_code_form">
      <Text className={styles.description}>{t("PromoCodeDescription")}</Text>
      <Text
        as="label"
        htmlFor="wallet_promo_code"
        fontWeight={600}
        className={styles.label}
      >
        {t("PromoCode")}
      </Text>
      <FieldContainer isVertical hasError={Boolean(error)} errorMessage={error}>
        <TextInput
          id="wallet_promo_code"
          isAutoFocussed
          type={InputType.text}
          value={code}
          placeholder={t("PromoCodePlaceholder")}
          maxLength={100}
          autoComplete="off"
          scale
          withBorder
          hasError={Boolean(error)}
          isDisabled={isSubmitting}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          testId="wallet_promo_code_input"
        />
      </FieldContainer>
      <Text fontSize="12px" className={styles.helperText}>
        {t("PromoCodeHint")}
      </Text>
    </div>
  );
};

export default PromoCodeField;
