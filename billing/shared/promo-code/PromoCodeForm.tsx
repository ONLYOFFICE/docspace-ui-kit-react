import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { InputSize, InputType } from "../../../components/text-input";
import { InputBlock } from "../../../components/input-block";
import CrossIcon from "../../../assets/icons/12/cross.react.svg";
import ArrowIcon from "../../../assets/icons/16/right.arrow.react.svg";
import { toastr } from "../../../components/toast";
import { formatBillingDate } from "../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./PromoCodeForm.module.scss";

const LEAVE_DURATION_MS = 250;

const BOLD = { 1: <Text as="span" fontWeight={600} /> };

const PromoCodeForm = () => {
  const t = useCommonTranslation();
  const { applyPromoCode, formatWalletCurrency, language } = usePaymentStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef<number | undefined>(undefined);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(
    () => () => {
      if (leaveTimerRef.current !== undefined)
        window.clearTimeout(leaveTimerRef.current);
    },
    [],
  );

  const trimmed = code.trim();

  const onSubmit = async () => {
    if (!trimmed || isSubmitting) return;

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
      onClose();
      return;
    }

    if (result.status === "failed") {
      toastr.error(t("ErrorNotification"));
      return;
    }

    setError(
      result.status === "refused"
        ? refusalText(result.reason)
        : t("PromoCodeTooManyAttempts"),
    );
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

  const onLeft = () => {
    leaveTimerRef.current = undefined;
    setIsOpen(false);
    setIsLeaving(false);
    setCode("");
  };

  const onClose = () => {
    if (isLeaving) return;

    setIsLeaving(true);
    setError("");
    leaveTimerRef.current = window.setTimeout(onLeft, LEAVE_DURATION_MS);
  };

  const onIconClick = () => {
    if (trimmed) onSubmit();
    else onClose();
  };

  if (!isOpen) {
    return (
      <div className={styles.promoCodeSlot}>
        <Link
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          aria-expanded={false}
          textDecoration="underline"
          fontSize="13px"
          fontWeight={600}
          className={styles.promoCodeToggle}
          dataTestId="wallet_promo_code_toggle"
        >
          {t("HavePromoCode")}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.promoCodeSlot}>
      <div
        className={classNames(styles.promoCodeFormGrow, {
          [styles.promoCodeFormLeaving]: isLeaving,
        })}
      >
        <div
          className={styles.promoCodeForm}
          data-testid="wallet_promo_code_form"
          aria-hidden={isLeaving || undefined}
        >
          <div className={styles.promoCodeRow}>
            <Text
              as="label"
              htmlFor="wallet_promo_code"
              className={styles.visuallyHidden}
            >
              {t("PromoCode")}
            </Text>
            <InputBlock
              id="wallet_promo_code"
              type={InputType.text}
              size={InputSize.base}
              value={code}
              placeholder={t("PromoCodePlaceholder")}
              maxLength={100}
              autoComplete="off"
              hasError={Boolean(error)}
              isDisabled={isSubmitting}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
                if (e.key === "Escape") onClose();
              }}
              isAutoFocussed
              scale
              iconNode={trimmed ? <ArrowIcon /> : <CrossIcon />}
              iconSize={trimmed ? 16 : 12}
              isIconFill
              iconColor={trimmed ? "--payment-accent-color" : undefined}
              onIconClick={onIconClick}
              iconAriaLabel={trimmed ? t("ApplyButton") : t("CancelButton")}
              className={styles.promoCodeField}
              dataTestId="wallet_promo_code_block"
              testId="wallet_promo_code_input"
            />
          </div>
          {error ? (
            <Text
              fontSize="11px"
              lineHeight="16px"
              role="alert"
              className={styles.promoCodeError}
            >
              {error}
            </Text>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default observer(PromoCodeForm);
