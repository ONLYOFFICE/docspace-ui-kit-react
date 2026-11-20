import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { Tabs, type TTabItem } from "../../../components/tabs";

import { useCommonTranslation } from "../../../utils/i18n";
import {
  openStripeCheckout,
  type TTopUpCompletionDeps,
  waitForTopUpCompletion,
} from "../../utils/stripe-flow";
import { AnalyticsEvents } from "../../../enums";

import WarningIcon from "../../../assets/danger.toast.react.svg";
import Amount from "./sub-components/Amount";
import PromoCodeField from "../promo-code/PromoCodeField";
import PromoCodeNoCard from "../promo-code/PromoCodeNoCard";
import { usePromoCode } from "../promo-code/usePromoCode";
import { AmountProvider, useAmountValue } from "../../wallet/context";

import type PaymentStore from "../../store/PaymentStore";
import type { PaymentApi } from "@onlyoffice/docspace-api-sdk";

import styles from "./styles/SimpleTopUpDialog.module.scss";

export type TSimpleTopUpDeps = {
  paymentApi: PaymentApi;
  formatWalletCurrency: PaymentStore["formatWalletCurrency"];
  walletCodeCurrency: string;
  fetchBalance: (isRefresh?: boolean) => Promise<number>;
  fetchTransactionHistory?: PaymentStore["fetchTransactionHistory"];
  walletCustomerStatusNotActive: boolean;
  /** the saved method credits the wallet only once the transfer settles */
  isDelayedPaymentMethod: boolean;
  isStripeCheckoutRequired: boolean;
  language: string;
  fetchCardLinked: (
    backUrl?: string,
    successUrl?: string,
  ) => Promise<string | null | undefined>;
  walletBalance: number;
  fetchCustomerInfo: TTopUpCompletionDeps["fetchCustomerInfo"];
  /** when given, the dialog gets a Promo code tab next to the purchase */
  applyPromoCode?: PaymentStore["applyPromoCode"];
  /** without a linked card the Promo code tab offers to link one instead of the field */
  isCardLinked?: boolean;
  /** opens the card linking flow; the dialog closes right after */
  onLinkCard?: () => Promise<void>;
};

const MIN_AMOUNT = "10";

export type TopUpTab = "purchase" | "promo";

type SimpleTopUpDialogBaseProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  recommendedAmount?: string;
  /** minimum allowed top-up; also pre-fills the input */
  minValue?: string;
  /** optional service to activate after the top-up (passed to the callback URL) */
  service?: string;
  /** current service whose transaction history is refetched after the top-up */
  serviceName?: string;
  /** optional extra query params appended to the success/callback URL */
  successParams?: Record<string, string>;
  /** waited for instead of a balance increase when the callback page makes the purchase */
  isPurchaseCompleted?: () => Promise<boolean>;
  /** overrides the default description under the header */
  descriptionText?: React.ReactNode;
  /** overrides the default helper text under the amount input */
  helperText?: React.ReactNode;
  initialTab?: TopUpTab;
};

export type SimpleTopUpDialogProps = SimpleTopUpDialogBaseProps &
  TSimpleTopUpDeps;

const SimpleTopUpDialogContent = observer(
  ({
    visible,
    onClose,
    onConfirm,
    isStripeCheckoutRequired,
    minValue,
    paymentApi,
    formatWalletCurrency,
    walletCodeCurrency,
    fetchBalance,
    fetchTransactionHistory,
    walletCustomerStatusNotActive,
    isDelayedPaymentMethod,
    language,
    fetchCardLinked,
    walletBalance,
    fetchCustomerInfo,
    service,
    serviceName,
    successParams,
    isPurchaseCompleted,
    descriptionText,
    helperText,
    initialTab = "purchase",
    applyPromoCode,
    isCardLinked = true,
    onLinkCard,
  }: SimpleTopUpDialogProps) => {
    const t = useCommonTranslation();

    const { amount, hasError } = useAmountValue();

    const [isLoading, setIsLoading] = useState(false);
    const [isLinkingCard, setIsLinkingCard] = useState(false);
    const [tabId, setTabId] = useState<TopUpTab>(initialTab);
    const [panelMinHeight, setPanelMinHeight] = useState(0);

    const purchasePanelRef = useCallback((node: HTMLDivElement) => {
      const observer = new ResizeObserver(([entry]) => {
        setPanelMinHeight(entry.borderBoxSize[0].blockSize);
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const promoCode = usePromoCode({
      applyPromoCode,
      formatWalletCurrency,
      language,
      onApplied: onClose,
    });

    const hasPromoTab = Boolean(applyPromoCode);
    const isPromoTab = hasPromoTab && tabId === "promo";

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      return () => {
        abortControllerRef.current?.abort();
      };
    }, []);

    const isDisabled = isLoading || !amount || hasError;

    const isStripeFlow = isStripeCheckoutRequired;

    const onStripeContinue = async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const { signal } = controller;

      setIsLoading(true);

      try {
        await openStripeCheckout(
          { walletCodeCurrency, language, fetchCardLinked },
          amount,
          service,
          successParams,
        );

        if (isDelayedPaymentMethod) {
          onClose();
          return;
        }

        const completion = await waitForTopUpCompletion(
          {
            walletBalance,
            fetchCustomerInfo,
            fetchBalance,
            isPurchaseCompleted,
          },
          signal,
        );

        if (signal.aborted) return;

        if (!completion.isDelayedPaymentMethod) await onConfirm?.();

        if (signal.aborted) return;

        onClose();
      } catch (error) {
        console.error("[first-topup] flow failed", error);
        if (!signal.aborted) {
          toastr.error(t("UnexpectedError"));
          if (isPurchaseCompleted) onClose();
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    const onInstantTopUp = async () => {
      setIsLoading(true);

      try {
        const res = await paymentApi.topUpDeposit({
          topUpDepositRequestDto: {
            amount: +amount,
            currency: walletCodeCurrency,
          },
        });

        if (!res?.data?.response) throw new Error(t("UnexpectedError"));

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: AnalyticsEvents.WalletTopUp });

        fetchTransactionHistory?.(serviceName);
        // The top-up went through; a balance that fails to refresh must not
        // turn its success into an error.
        await fetchBalance(true).catch(() => undefined);

        if (isDelayedPaymentMethod) {
          toastr.success(t("TopUpDelayedPaymentMethodWarning"));
        } else {
          toastr.success(t("WalletToppedUp"));
          await onConfirm?.();
        }

        onClose();
      } catch (error) {
        toastr.error(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    const onSelectTab = (item: TTabItem) => {
      setTabId(item.id as TopUpTab);
    };

    const onLinkCardClick = async () => {
      if (!onLinkCard) return;

      setIsLinkingCard(true);

      try {
        await onLinkCard();
        onClose();
      } catch (error) {
        console.error(error);
        toastr.error(t("UnexpectedError"));
      } finally {
        setIsLinkingCard(false);
      }
    };

    const onContinue = async () => {
      if (isDisabled) return;

      if (isStripeFlow) await onStripeContinue();
      else await onInstantTopUp();
    };

    const purchasePanel = (
      <div className={styles.body}>
        {isDelayedPaymentMethod ? (
          <div
            className={styles.warning}
            data-testid="top_up_delayed_payment_method_warning"
          >
            <WarningIcon className={styles.warningIcon} />
            <Text
              as="span"
              fontSize="12px"
              fontWeight={600}
              lineHeight="16px"
              className={styles.warningText}
            >
              {t("TopUpDelayedPaymentMethodWarning")}
            </Text>
          </div>
        ) : null}

        <Text className={styles.description}>
          {descriptionText ??
            (isStripeFlow
              ? t("TopUpCreditsDescription")
              : t("TopUpCreditsAmountDescription"))}
        </Text>

        <Amount
          formatWalletCurrency={formatWalletCurrency}
          isDisabled={isLoading}
          walletCustomerStatusNotActive={walletCustomerStatusNotActive}
          minValue={minValue ?? MIN_AMOUNT}
          withoutCustomerCheck
        />

        <Text fontSize="12px" className={styles.helperText}>
          {helperText ??
            (isStripeFlow
              ? t("TopUpCreditsChargeHint")
              : t("TopUpTakeSomeTimeToComplete"))}
        </Text>
      </div>
    );

    const tabs: TTabItem[] = [
      {
        id: "purchase",
        name: t("Purchase"),
        content: (
          <div ref={purchasePanelRef} className={styles.panel}>
            {purchasePanel}
          </div>
        ),
      },
      {
        id: "promo",
        name: t("PromoCode"),
        content: (
          <div className={styles.panel} style={{ minHeight: panelMinHeight }}>
            {isCardLinked ? (
              <PromoCodeField promoCode={promoCode} />
            ) : (
              <PromoCodeNoCard />
            )}
          </div>
        ),
      },
    ];

    return (
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.modal}
        autoMaxHeight
        withBodyScroll
        withoutBorder={hasPromoTab}
        withoutHeaderMargin={hasPromoTab}
      >
        <ModalDialog.Header>{t("TopUpCredits")}</ModalDialog.Header>

        <ModalDialog.Body>
          {hasPromoTab ? (
            <Tabs
              className={styles.tabs}
              items={tabs}
              selectedItemId={tabId}
              onSelect={onSelectTab}
            />
          ) : (
            purchasePanel
          )}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <div className={styles.footerButtons}>
            {isPromoTab && !isCardLinked ? (
              <Button
                key="LinkCardButton"
                label={t("LinkPaymentMethod")}
                size={ButtonSize.normal}
                primary
                scale
                onClick={onLinkCardClick}
                isLoading={isLinkingCard}
                testId="wallet_promo_code_link_card"
              />
            ) : isPromoTab ? (
              <Button
                key="RedeemButton"
                label={t("RedeemButton")}
                size={ButtonSize.normal}
                primary
                scale
                onClick={promoCode.onSubmit}
                isLoading={promoCode.isSubmitting}
                isDisabled={!promoCode.canSubmit}
                testId="wallet_promo_code_redeem"
              />
            ) : (
              <Button
                key="ContinueToStripeButton"
                label={isStripeFlow ? t("ContinueToStripe") : t("TopUp")}
                size={ButtonSize.normal}
                primary
                scale
                onClick={onContinue}
                isLoading={isLoading}
                isDisabled={isDisabled}
                testId="first_topup_continue_to_stripe"
              />
            )}
            <Button
              key="CancelButton"
              label={t("CancelButton")}
              size={ButtonSize.normal}
              scale
              onClick={onClose}
              isDisabled={isLoading || isLinkingCard || promoCode.isSubmitting}
              testId="first_topup_cancel"
            />
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

const SimpleTopUpDialog: React.FC<SimpleTopUpDialogProps> = (props) => (
  <AmountProvider initialAmount={props.minValue ?? props.recommendedAmount}>
    <SimpleTopUpDialogContent {...props} />
  </AmountProvider>
);

export default SimpleTopUpDialog;
