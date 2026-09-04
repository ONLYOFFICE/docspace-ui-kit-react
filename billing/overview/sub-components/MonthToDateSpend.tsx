import { Fragment, useMemo } from "react";
import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import {
  getServiceUnitRate,
  getServiceUsageSubLabel,
} from "../../utils/serviceUsage";
import SpendAmount from "../../shared/spend-amount";
import type { TServiceUsage } from "../../types";

import styles from "../Overview.module.scss";

type MonthToDateSpendProps = {
  onViewUsage?: () => void;
};

const sumAmount = (items: TServiceUsage[]) =>
  items.reduce((sum, item) => sum + item.totalAmount, 0);

const MonthToDateSpend = ({ onViewUsage }: MonthToDateSpendProps) => {
  const t = useCommonTranslation();
  const { walletCodeCurrency, formatWalletCurrency, language } =
    usePaymentStore();
  const { serviceUsage, walletMonthToDateSpend } = useServicesStore();

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(language || "en", { month: "long" }).format(
        new Date(),
      ),
    [language],
  );

  const subscriptions = serviceUsage.filter((item) => item.subscription);
  const payAsYouGo = serviceUsage.filter((item) => !item.subscription);

  const subscriptionsTotal = sumAmount(subscriptions);
  const payAsYouGoTotal = sumAmount(payAsYouGo);
  const total = walletMonthToDateSpend;

  const subscriptionsPct = total > 0 ? (subscriptionsTotal / total) * 100 : 0;
  const payAsYouGoPct = total > 0 ? (payAsYouGoTotal / total) * 100 : 0;

  const renderRows = (items: TServiceUsage[]) =>
    items.map((item, index) => {
      let subLabel = getServiceUsageSubLabel(t, item, language);

      if (item.subscription) {
        const unitPrice = formatWalletCurrency(
          item.price,
          2,
          item.currency || walletCodeCurrency,
        );
        const rate = getServiceUnitRate(t, item.service, unitPrice);
        if (rate) subLabel = `${subLabel} | ${rate}`;
      }

      return (
        <Fragment key={item.service}>
          {index > 0 ? <div className={styles.spendDivider} /> : null}
          <div className={styles.spendRow}>
            <div className={styles.spendRowInfo}>
              <Text fontSize="14px" fontWeight={600} truncate>
                {item.title}
              </Text>
              <Text fontSize="12px" className={styles.mutedTitle} truncate>
                {subLabel}
              </Text>
            </div>
            <SpendAmount
              amount={item.totalAmount}
              currency={item.currency}
              className={styles.spendAmount}
              tooltipId={`spend-amount-${item.service}`}
            />
          </div>
        </Fragment>
      );
    });

  const renderSection = ({
    key,
    items,
    label,
    sectionTotal,
    dotClass,
    emptyDescription,
  }: {
    key: string;
    items: TServiceUsage[];
    label: string;
    sectionTotal: number;
    dotClass: string;
    emptyDescription: string;
  }) => (
    <Fragment key={key}>
      <div className={styles.spendSectionHeader}>
        <span className={`${styles.spendDot} ${dotClass}`} />
        <Text
          fontSize="14px"
          fontWeight={600}
          className={styles.spendSectionLabel}
        >
          {label}
        </Text>
        <SpendAmount
          amount={sectionTotal}
          className={styles.spendSectionTotal}
          fontSize="12px"
          tooltipId={`spend-section-total-${key}`}
        />
      </div>
      {items.length > 0 ? (
        renderRows(items)
      ) : (
        <div className={styles.spendSectionEmpty}>
          <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
            {t("NoChargesYet")}
          </Text>
          <Text fontSize="12px" className={styles.mutedTitle}>
            {emptyDescription}
          </Text>
        </div>
      )}
    </Fragment>
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("SpendingInMonth", { month: monthLabel })}
        </Text>
        {onViewUsage ? (
          <Link
            onClick={onViewUsage}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_view_usage_link"
          >
            {t("ViewUsage")}
          </Link>
        ) : null}
      </div>
      <Text fontSize="18px" fontWeight={700} className={styles.cardValue}>
        {formatWalletCurrency(total, 2, walletCodeCurrency)}
      </Text>

      {serviceUsage.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
              {t("NoSpendingActivity")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoSpendingActivityDescription")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={styles.spendBody}>
          <div className={styles.spendBar}>
              {subscriptionsPct > 0 ? (
                <div
                  className={styles.spendBarSubs}
                  style={{ width: `${subscriptionsPct}%` }}
                />
              ) : null}
              {payAsYouGoPct > 0 ? (
                <div
                  className={styles.spendBarPayg}
                  style={{ width: `${payAsYouGoPct}%` }}
                />
              ) : null}
            </div>

            <div className={styles.spendList}>
              {[
                {
                  key: "subscriptions",
                  items: subscriptions,
                  label: t("Subscriptions"),
                  sectionTotal: subscriptionsTotal,
                  dotClass: styles.spendDotSubs,
                  emptyDescription: t("SubscriptionsEmptyDesc"),
                },
                {
                  key: "payAsYouGo",
                  items: payAsYouGo,
                  label: t("PayAsYouGo"),
                  sectionTotal: payAsYouGoTotal,
                  dotClass: styles.spendDotPayg,
                  emptyDescription: t("PayAsYouGoEmptyDesc"),
                },
              ]
                // Empty sections drop to the bottom.
                .sort(
                  (a, b) =>
                    Number(a.items.length === 0) -
                    Number(b.items.length === 0),
                )
                .map(renderSection)}
            </div>
        </div>
      )}
    </div>
  );
};

export default observer(MonthToDateSpend);

