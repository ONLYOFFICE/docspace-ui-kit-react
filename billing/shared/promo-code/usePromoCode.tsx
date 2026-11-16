import React, { useState } from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { formatBillingDate } from "../../utils/common";

import type PaymentStore from "../../store/PaymentStore";

const BOLD = { 1: <Text as="span" fontWeight={600} /> };

type UsePromoCodeDeps = {
  applyPromoCode?: PaymentStore["applyPromoCode"];
  formatWalletCurrency: PaymentStore["formatWalletCurrency"];
  language: string;
  onApplied?: () => void;
};

export const usePromoCode = ({
  applyPromoCode,
  formatWalletCurrency,
  language,
  onApplied,
}: UsePromoCodeDeps) => {
  const t = useCommonTranslation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = code.trim();
  const canSubmit = Boolean(trimmed) && !isSubmitting;

  const onChange = (value: string) => {
    setCode(value);
    if (error) setError("");
  };

  const refusalText = (reason: string) => {
    switch (reason) {
      case "promo_not_found":
        return t("PromoCodeNotFound");
      case "promo_already_used":
        return t("PromoCodeAlreadyUsed");
      case "promo_expired":
        return t("PromoCodeExpired");
      default:
        return t("PromoCodeInvalid");
    }
  };

  const onSubmit = async () => {
    if (!canSubmit || !applyPromoCode) return;

    setIsSubmitting(true);
    setError("");

    const result = await applyPromoCode(trimmed);

    setIsSubmitting(false);

    if (result.status === "applied" || result.status === "pending") {
      const amount = formatWalletCurrency(
        result.amount,
        2,
        result.currency || undefined,
      );

      const expiresAt = result.expiresAt
        ? formatBillingDate(result.expiresAt, language)
        : "";

      const isPending = result.status === "pending";
      const title = isPending ? t("PromoCodeAccepted") : t("PromoCodeApplied");
      const body = isPending ? (
        <CommonTrans
          i18nKey="PromoCodePending"
          values={{ amount }}
          components={BOLD}
        />
      ) : (
        <>
          <CommonTrans
            i18nKey="PromoCodeCreditsAdded"
            values={{ amount: `+${amount}` }}
            components={BOLD}
          />
          {expiresAt ? (
            <>
              {" "}
              <CommonTrans
                i18nKey="PromoCodeCreditsExpire"
                values={{ date: expiresAt }}
                components={BOLD}
              />
            </>
          ) : null}
        </>
      );

      toastr.success(<Text as="div">{body}</Text>, title);
      setCode("");
      onApplied?.();
      return;
    }

    if (result.status === "failed") {
      toastr.error(t("ErrorNotification"));
      return;
    }

    if (result.status === "refused") setError(refusalText(result.reason));
    else if (result.status === "needsCard") setError(t("PromoCodeNeedsCard"));
    else setError(t("PromoCodeTooManyAttempts"));
  };

  return { code, error, isSubmitting, canSubmit, onChange, onSubmit };
};

export type TPromoCode = ReturnType<typeof usePromoCode>;
