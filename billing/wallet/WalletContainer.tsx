import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";

import { toAbsoluteUrl } from "../utils/url";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { Link } from "../../components/link";
import { Tabs, type TTabItem } from "../../components/tabs";
import { finishRefreshingWithMinCycle } from "../utils/refreshing";
import { useBalanceRefresh } from "../shared/balance-amount/useBalanceRefresh";

import TransactionHistory from "../shared/transaction-history";
import UpcomingPayments from "./sub-components/UpcomingPayments";
import WalletRefilledModal from "./WalletRefilledModal";
import AutoPaymentInfo from "./sub-components/AutoPaymentInfo";
import DelayedPaymentMethodBanner from "./sub-components/DelayedPaymentMethodBanner";
import PromoCredits from "./sub-components/PromoCredits";
import PromoExpiryBanner from "./sub-components/PromoExpiryBanner";
import UnlinkedCardBanner from "../shared/unlinked-card-banner";
import styles from "./styles/Wallet.module.scss";
import BalanceAmount from "../shared/balance-amount";
import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useServicesStore } from "../store/ServicesStoreProvider";
import useDeviceType from "../hooks/useDeviceType";
import { DeviceType } from "../../enums";
import { getBrandName } from "../../constants/brands";
import SimpleTopUpDialog from "../shared/top-up-balance/SimpleTopUpDialogWrapper";
import type { TopUpTab } from "../shared/top-up-balance/SimpleTopUpDialog";
import { LATIN_NUMBERING_SYSTEM } from "../../utils/latin-digits";

const WALLET_TAB_IDS = ["transaction-history", "upcoming-payments"];

const getInitialTabId = () => {
  const requested = new URLSearchParams(window.location.search).get("tab");
  return requested && WALLET_TAB_IDS.includes(requested)
    ? requested
    : WALLET_TAB_IDS[0];
};

const setTabIdToUrl = (tabId: string) => {
  const url = new URL(window.location.href);

  if (tabId === WALLET_TAB_IDS[0]) url.searchParams.delete("tab");
  else url.searchParams.set("tab", tabId);

  window.history.replaceState(window.history.state, "", url.toString());
};

type WalletProps = {
  isMobile?: boolean;
  onViewUsage?: () => void;
  onAddonsClick?: () => void;
};

const Wallet = (props: WalletProps) => {
  const { onViewUsage, onAddonsClick } = props;

  const store = usePaymentStore();

  const currentDeviceType = useDeviceType({
    mobile: store.mobileBreakpoint,
    desktop: store.desktopBreakpoint,
  });

  const isMobile = props.isMobile ?? currentDeviceType === DeviceType.mobile;
  const { walletMonthToDateSpend, walletMonthToDatePromoSpend } =
    useServicesStore();
  const promoSpend = walletMonthToDatePromoSpend ?? 0;
  const hasPromoSpend = promoSpend > 0;

  const {
    availableCredits,
    hasPromoCredits,
    walletCodeCurrency,
    isCardLinkedToPortal,
    isVisibleWalletSettings,
    wasChangeBalance,
    refreshTransactionHistory,
    canUpdateTariff,
    recommendedAmount,
    walletHelpUrl,
    isAutoTopUpInProgress,
    autoPayments,
    isAutoPaymentExist,
    language,
    wasFirstTopUp,
    showUnlinkedCardBanner,
  } = store;

  const isAutoPaymentSetup = Boolean(
    isAutoPaymentExist &&
    language &&
    walletCodeCurrency &&
    autoPayments?.minBalance &&
    autoPayments?.upToBalance,
  );

  const { isNotPaidPeriod, isDelayedPaymentMethod } = store.tariff;

  const hasPayer = Boolean(store.tariff.walletCustomerEmail);
  const canRedeemPromoCode =
    (store.isPayer || !hasPayer) && canUpdateTariff && !isNotPaidPeriod;

  const t = useCommonTranslation();

  const { isRefreshing, onRefresh } = useBalanceRefresh(
    refreshTransactionHistory,
  );
  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(
    isVisibleWalletSettings,
  );
  const [topUpTab, setTopUpTab] = useState<TopUpTab>(store.topUpDialogTab);
  const [isWalletRefilledOpen, setIsWalletRefilledOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(getInitialTabId);

  const [isAutoSpinning, setIsAutoSpinning] = useState(isAutoTopUpInProgress);
  const hasPromoSection = hasPromoCredits || hasPromoSpend;
  const hadPromoOnMount = useRef(hasPromoSection);
  const [isPromoShown, setIsPromoShown] = useState(hasPromoSection);
  const [isPromoLeaving, setIsPromoLeaving] = useState(false);

  useEffect(() => {
    if (hasPromoSection) {
      setIsPromoShown(true);
      setIsPromoLeaving(false);
    } else if (isPromoShown) {
      setIsPromoLeaving(true);
    }
  }, [hasPromoSection]);

  const onPromoLeft = useCallback(() => {
    setIsPromoShown(false);
    setIsPromoLeaving(false);
  }, []);

  const autoStartTimeRef = useRef<number | null>(null);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(store.language || "en", {
        numberingSystem: LATIN_NUMBERING_SYSTEM,
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [store.language],
  );

  useEffect(() => {
    if (isAutoTopUpInProgress) {
      autoStartTimeRef.current ??= Date.now();
      setIsAutoSpinning(true);
      return;
    }

    const startTime = autoStartTimeRef.current;

    if (startTime === null) {
      setIsAutoSpinning(false);
      return;
    }

    autoStartTimeRef.current = null;

    const timerId = finishRefreshingWithMinCycle({
      startTime,
      setRefreshing: setIsAutoSpinning,
    });

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isAutoTopUpInProgress]);

  const onClose = () => {
    setIsTopUpDialogVisible(false);
  };

  const onOpen = () => {
    setTopUpTab("purchase");
    setIsTopUpDialogVisible(true);
  };

  const onPromoCodeClick = () => {
    setTopUpTab("promo");
    setIsTopUpDialogVisible(true);
  };

  const onSelectTab = (item: TTabItem) => {
    setSelectedTabId(item.id);
    setTabIdToUrl(item.id);
  };

  const tabsItems: TTabItem[] = [
    {
      id: "transaction-history",
      name: t("TransactionHistory"),
      content: (
        <div>
          <TransactionHistory withoutRoleFilter withoutHeader />
        </div>
      ),
    },
    {
      id: "upcoming-payments",
      name: t("UpcomingPayments"),
      content: <UpcomingPayments />,
    },
  ];

  return (
    <div className={styles.walletContainer}>
      <Text className={styles.walletDescription}>
        <CommonTrans
          i18nKey="WalletSectionDescriptionAddons"
          components={{
            1: (
              <Link
                as="span"
                onClick={onAddonsClick}
                color="accent"
                textDecoration="underline"
              />
            ),
          }}
        />
      </Text>

      {walletHelpUrl ? (
        <Link
          textDecoration="underline"
          fontWeight={600}
          href={walletHelpUrl}
          className={styles.learnMoreLink}
          dataTestId="wallet_learn_more_link"
        >
          {t("LearnMore")}
        </Link>
      ) : null}

      <PromoExpiryBanner />

      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.summaryCardBalance}`}>
          <BalanceAmount
            title={t("AvailableCredits")}
            titleFontSize="14px"
            mainFontSize="28px"
            fractionFontSize="18px"
            showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
            isRefreshing={isRefreshing || isAutoSpinning}
            progressText={t("TopUpInProgress")}
            isProgressTextVisible={isAutoSpinning}
            onRefresh={onRefresh}
            amount={availableCredits}
            currency={walletCodeCurrency}
            language={store.language}
          />

          {isPromoShown ? (
            <PromoCredits
              animate={!hadPromoOnMount.current}
              keepEmpty={hasPromoSpend}
              leaving={isPromoLeaving}
              onLeft={onPromoLeft}
            />
          ) : canRedeemPromoCode ? (
            <Link
              onClick={onPromoCodeClick}
              textDecoration="underline"
              fontSize="13px"
              fontWeight={600}
              color="accent"
              className={styles.promoCodeLink}
              dataTestId="wallet_promo_code_link"
            >
              {t("HavePromoCode")}
            </Link>
          ) : null}

          <div className={styles.cardButtons}>
            <Button
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              primary
              label={t("TopUp")}
              onClick={onOpen}
              isDisabled={!canUpdateTariff || isNotPaidPeriod}
              className={styles.cardButton}
              testId="top_up_balance_button"
            />
            {wasFirstTopUp && !isDelayedPaymentMethod ? (
              <Button
                size={isMobile ? ButtonSize.normal : ButtonSize.small}
                label={t("AutoTopUp")}
                onClick={() => setIsWalletRefilledOpen(true)}
                isDisabled={!canUpdateTariff || isNotPaidPeriod}
                className={styles.cardButton}
                testId="auto_top_up_button"
              />
            ) : null}
          </div>

          {isPromoShown ? (
            <Text
              fontSize="11px"
              lineHeight="16px"
              className={styles.promoFootnote}
            >
              {t("PromoCreditsFootnote")}
              {canRedeemPromoCode ? (
                <>
                  {" "}
                  <Link
                    onClick={onPromoCodeClick}
                    textDecoration="underline"
                    fontSize="11px"
                    lineHeight="16px"
                    fontWeight={600}
                    color="accent"
                    dataTestId="wallet_promo_code_link"
                  >
                    {t("HavePromoCode")}
                  </Link>
                </>
              ) : null}
            </Text>
          ) : null}
        </div>

        <div className={`${styles.summaryCard} ${styles.summaryCardSpend}`}>
          <Text
            fontSize="12px"
            lineHeight="16px"
            fontWeight={600}
            className={styles.spendTitle}
          >
            {t("CurrentMonthToDateSpend")}
          </Text>
          <BalanceAmount
            showRefresh={false}
            amount={walletMonthToDateSpend}
            currency={walletCodeCurrency}
            language={store.language}
            mainFontSize={hasPromoSpend ? "22px" : "18px"}
            fractionFontSize={hasPromoSpend ? "14px" : "12px"}
            withoutMargin
            className={classNames(styles.spendAmount, {
              [styles.spendAmountAligned]: hasPromoSpend,
            })}
          />
          {hasPromoSpend ? (
            <div className={styles.spendDetails}>
              <Text fontSize="13px" lineHeight="20px">
                {t("ForPeriod", { period: monthLabel })}
              </Text>
              <div className={styles.spendSplit}>
                <div className={styles.creditsRow}>
                  <Text fontSize="13px" lineHeight="20px">
                    {t("SpendFromPurchasedCredits")}
                  </Text>
                  <Text fontSize="13px" lineHeight="20px" fontWeight={600}>
                    {store.formatWalletCurrency(
                      walletMonthToDateSpend - promoSpend,
                      2,
                    )}
                  </Text>
                </div>
                <div className={styles.creditsRow}>
                  <Text fontSize="13px" lineHeight="20px">
                    {t("SpendFromPromoCredits")}
                  </Text>
                  <Text fontSize="13px" lineHeight="20px" fontWeight={600}>
                    {store.formatWalletCurrency(promoSpend, 2)}
                  </Text>
                </div>
              </div>
            </div>
          ) : (
            <Text fontSize="12px" lineHeight="16px">
              {t("ForPeriod", { period: monthLabel })}
            </Text>
          )}
          {onViewUsage ? (
            <Link
              onClick={onViewUsage}
              textDecoration="underline"
              color="accent"
              className={classNames(styles.viewUsageLink, {
                [styles.viewUsageLinkBottom]: hasPromoSpend,
              })}
              dataTestId="wallet_view_usage_link"
              fontWeight={600}
            >
              {t("ViewUsage")}
            </Link>
          ) : null}
        </div>
      </div>

      {showUnlinkedCardBanner ? (
        <UnlinkedCardBanner />
      ) : isDelayedPaymentMethod ? (
        <DelayedPaymentMethodBanner />
      ) : isAutoPaymentSetup ? (
        <AutoPaymentInfo />
      ) : null}

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={onClose}
          recommendedAmount={recommendedAmount}
          initialTab={topUpTab}
        />
      ) : null}

      {(wasChangeBalance || isWalletRefilledOpen) && !isDelayedPaymentMethod ? (
        <WalletRefilledModal
          visible={wasChangeBalance || isWalletRefilledOpen}
          onClose={() => setIsWalletRefilledOpen(false)}
        />
      ) : null}

      <div className={styles.tabsWrapper}>
        <Tabs
          items={tabsItems}
          selectedItemId={selectedTabId}
          onSelect={onSelectTab}
          withoutStickyIntend
        />
      </div>
    </div>
  );
};

export default observer(Wallet);
