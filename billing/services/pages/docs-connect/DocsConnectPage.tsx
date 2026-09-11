import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import {
  ContextMenu,
  type ContextMenuRefType,
} from "../../../../components/context-menu";
import { IconButton } from "../../../../components/icon-button";
import { ProgressBar } from "../../../../components/progress-bar";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { formatDateLocalized } from "../../../../utils/date";
import { getBrandName } from "../../../../constants/brands";

import TransactionHistory from "../../../shared/transaction-history";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import StorageWarning from "../../panels/additional-storage/StorageWarning";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { DOCS_CONNECT_SERVICE } from "../../../constants";
import { getDocsConnectScheduleFlags } from "../../../utils/docs-connect";
import type { TDocsConnectPageState } from "../../../types";

import SettingsIcon from "../../../../assets/icons/16/catalog-settings-common.svg";
import PencilIcon from "../../../../assets/pencil.react.svg";
import StatisticsIcon from "../../../../assets/icons/16/statistics.react.svg";
import CircleCrossIcon from "../../../../assets/icons/16/circle.cross.svg";
import AlertIcon from "../../../../assets/plugin.incompatible.react.svg";

import styles from "./DocsConnectPage.module.scss";

type DocsConnectPageProps = {
  state: TDocsConnectPageState;
  onTopUp: () => void;
  onTopUpComplete: () => Promise<void> | void;
  onViewUsage: () => void;
  onBuyPlan: () => void;
  onEditPlan: () => void;
  onGoToTenant: () => void;
  onCancelPlan: () => void;
  onRemovePlan: () => void;
  onCancelChange: () => void;
  isCancelChangeLoading?: boolean;
};

const DocsConnectPage: React.FC<DocsConnectPageProps> = ({
  state,
  onTopUp,
  onTopUpComplete,
  onViewUsage,
  onBuyPlan,
  onEditPlan,
  onGoToTenant,
  onCancelPlan,
  onRemovePlan,
  onCancelChange,
  isCancelChangeLoading,
}) => {
  const t = useCommonTranslation();
  const paymentStore = usePaymentStore();
  const { initServiceData } = useServicesStore();
  const contextMenuRef = useRef<ContextMenuRefType>(null);
  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const openTopUpDialog = () => setIsTopUpDialogVisible(true);
  const closeTopUpDialog = () => setIsTopUpDialogVisible(false);

  useEffect(() => {
    initServiceData(t, DOCS_CONNECT_SERVICE);
  }, []);

  const {
    isPaid,
    expired,
    daysLeft,
    totalDays,
    spentPercent,
    endDate,
    currency,
    credits,
    planUsers,
    pricePerUser,
    basePricePerUser,
    devPackEnabled,
    monthlyCharge,
    scheduledChange,
    deactivated,
    canceled,
  } = state;

  const language = paymentStore.language;
  const { isDelayedPaymentMethod } = paymentStore.tariff;
  const renewalShortfall = Math.max(0, Math.ceil(monthlyCharge - credits));
  const isDelayedPaymentTopUp = isDelayedPaymentMethod && renewalShortfall > 0;

  const getRenewLabel = () => {
    if (renewalShortfall <= 0) return t("Common:RenewSubscription");
    if (isDelayedPaymentMethod) return t("Common:TopUpWallet");
    return t("Common:TopUpAndRenew");
  };
  const formatCurrency = (value: number, digits: number) =>
    paymentStore.formatWalletCurrency(value, digits, currency);

  const trialLow =
    !isPaid && !expired && totalDays > 0 && daysLeft / totalDays < 0.5;
  const { isCancellation, devPackDisabling, usersAdjusting } =
    getDocsConnectScheduleFlags({
      hasSubscription: true,
      currentUsers: planUsers,
      scheduledUsers: scheduledChange?.nextUsers ?? null,
      scheduledOnDevPack: scheduledChange?.scheduledOnDevPack ?? false,
      nextDevPackEnabled: scheduledChange?.nextDevPackEnabled ?? false,
    });

  const nextMonthlyPrice = formatCurrency(
    (scheduledChange?.nextUsers ?? 0) *
      (devPackDisabling ? basePricePerUser : pricePerUser),
    2,
  );

  const getScheduledChangeTitle = () => {
    if (isCancellation) return t("Common:SubscriptionCancellation");

    if (devPackDisabling) {
      return usersAdjusting
        ? t("Common:TariffUserAdjustmentDevPackDisableScheduledWithPrice", {
            fromCount: planUsers,
            toCount: scheduledChange?.nextUsers,
            price: nextMonthlyPrice,
          })
        : t("Common:TariffDevPackDisableScheduledWithPrice", {
            price: nextMonthlyPrice,
          });
    }

    if (!usersAdjusting) return t("Common:ChangeShedule");

    return t("Common:TariffUserAdjustmentScheduled", {
      fromCount: planUsers,
      toCount: scheduledChange?.nextUsers,
    });
  };

  const scheduledChangeTitle = getScheduledChangeTitle();

  const trialActive = !isPaid && !expired;
  const trialToggleTooltip = trialActive
    ? t("Common:DocsConnectTrialToggleDisabled", {
        date: formatDateLocalized(endDate, "DATE_MED", { locale: language }),
      })
    : undefined;

  const contextMenuItems = scheduledChange
    ? [
        {
          key: "usage",
          label: t("Common:ViewUsage"),
          iconNode: <StatisticsIcon />,
          onClick: onViewUsage,
        },
      ]
    : [
        {
          key: "edit",
          label: t("Common:EditSubscription"),
          iconNode: <PencilIcon />,
          onClick: onEditPlan,
        },
        {
          key: "usage",
          label: t("Common:ViewUsage"),
          iconNode: <StatisticsIcon />,
          onClick: onViewUsage,
        },
        {
          key: "separator",
          isSeparator: true,
        },
        {
          key: "cancel",
          label: t("Common:CancelSubscription"),
          iconNode: <CircleCrossIcon />,
          onClick: onCancelPlan,
        },
      ];

  const docsName = `${getBrandName("OrganizationName")} ${getBrandName("ProductEditorsName")}`;

  return (
    <div className={styles.container}>
      {!isPaid && expired ? null : (
        <ServiceToggleSection
          toggleTooltip={trialToggleTooltip}
          isEnabled={deactivated || canceled ? false : isPaid || !expired}
          isDisabled={(!isPaid && !expired) || scheduledChange != null}
          onToggle={
            canceled
              ? onEditPlan
              : deactivated
                ? onTopUp
                : isPaid
                  ? onCancelPlan
                  : onBuyPlan
          }
          title={t("DocsConnect:DocsConnect")}
          priceText={
            isPaid
              ? devPackEnabled
                ? t("DocsConnect:PricePerUserMonthDevPackNote", {
                    price: formatCurrency(pricePerUser, 0),
                  })
                : t("DocsConnect:FromPricePerUserMonthNote", {
                    price: formatCurrency(basePricePerUser, 0),
                  })
              : undefined
          }
          description={t("DocsConnect:ServiceToggleDescription", {
            productName: docsName,
          })}
        />
      )}

      {scheduledChange ? (
        <StorageWarning
          title={scheduledChangeTitle}
          body={
            isCancellation
              ? t("Common:PlanCancellationBillingPeriodNote", {
                  date: formatDateLocalized(
                    scheduledChange.dueDate,
                    "DATE_MED",
                    {
                      locale: language,
                    },
                  ),
                  service: t("DocsConnect:DocsConnect"),
                })
              : t("Common:ScheduledChangeBillingPeriodNote", {
                  date: formatDateLocalized(
                    scheduledChange.dueDate,
                    "DATE_MED",
                    {
                      locale: language,
                    },
                  ),
                })
          }
          onCancelChange={onCancelChange}
          isCancelLoading={isCancelChangeLoading}
        />
      ) : null}

      {isPaid && deactivated ? (
        <div className={styles.deactivatedBanner}>
          <span className={styles.deactivatedBannerIcon} aria-hidden="true">
            <AlertIcon />
          </span>
          <div className={styles.deactivatedBannerText}>
            <Text className={styles.deactivatedTitle}>
              {t("Common:SubscriptionDeactivated")}
            </Text>
            <Text className={styles.deactivatedDescription}>
              {t("Common:SubscriptionDeactivatedDescription")}
            </Text>
          </div>
        </div>
      ) : null}

      <WalletInfo
        withoutBackground
        balance={formatCurrency(credits, 2)}
        onTopUp={openTopUpDialog}
      />

      {isPaid && canceled ? (
        <>
          <Text className={styles.sectionTitle}>
            {t("Common:CurrentSubscription")}
          </Text>
          <div className={styles.noPlanCard}>
            <Text
              fontSize="13px"
              fontWeight={600}
              className={styles.noPlanTitle}
            >
              {t("Common:NoActiveSubscription")}
            </Text>
            <Button
              primary
              scale
              size={ButtonSize.small}
              label={t("DocsConnect:Buy")}
              onClick={onEditPlan}
            />
          </div>
        </>
      ) : (
        <>
          {isPaid ? (
            deactivated ? (
              <div className={styles.tariffHeader}>
                <Text className={styles.sectionTitle}>
                  {t("Common:PreviousSubscription")}
                </Text>
                <span className={styles.statusBadge}>
                  {t("Common:Inactive")}
                </span>
              </div>
            ) : (
              <div className={styles.tariffHeader}>
                <Text className={styles.sectionTitle}>
                  {t("Common:CurrentSubscription")}
                </Text>
                <IconButton
                  iconNode={<SettingsIcon />}
                  size={16}
                  onClick={(e) => contextMenuRef.current?.show(e)}
                />
                <ContextMenu ref={contextMenuRef} model={contextMenuItems} />
              </div>
            )
          ) : expired ? (
            <div className={styles.expiredBanner}>
              <div className={styles.expiredBannerText}>
                <Text className={styles.expiredTitle}>
                  {t("DocsConnect:TrialExpiredTitle")}
                </Text>
                <Text className={styles.expiredDescription}>
                  {t("DocsConnect:TrialExpiredDescription")}
                </Text>
              </div>
              <Button
                primary
                size={ButtonSize.small}
                label={t("Common:Upgrade")}
                onClick={onBuyPlan}
              />
            </div>
          ) : (
            <Text className={styles.sectionTitle}>
              {t("DocsConnect:FreeTrialTitle")}
            </Text>
          )}

          <div
            className={`${styles.summaryGrid} ${
              deactivated ? styles.summaryGridMuted : ""
            }`}
          >
            {isPaid ? (
              <div className={styles.summaryCard}>
                <Text className={styles.cardLabel}>
                  {t("Common:MonthlyCharge")}
                </Text>
                <Text className={styles.cardValue}>
                  {formatCurrency(monthlyCharge, 2)}
                </Text>
                <Text className={styles.cardCaption}>
                  {devPackEnabled
                    ? t("DocsConnect:PricePerUserDevPackShort", {
                        price: formatCurrency(pricePerUser, 0),
                      })
                    : t("DocsConnect:PricePerUserShort", {
                        price: formatCurrency(pricePerUser, 0),
                      })}
                </Text>
              </div>
            ) : (
              <div className={styles.trialCard}>
                <Text className={styles.trialLabel}>
                  {t("DocsConnect:DaysLeft")}
                </Text>
                <Text className={styles.trialDays}>{daysLeft}</Text>
                <Text className={styles.trialTotal}>
                  {t("DocsConnect:OfDays", { count: totalDays })}
                </Text>
                <div
                  className={`${styles.progress} ${
                    expired
                      ? styles.progressExpired
                      : trialLow
                        ? styles.progressLow
                        : ""
                  }`}
                >
                  <ProgressBar percent={spentPercent} />
                </div>
              </div>
            )}

            <div className={styles.summaryCard}>
              <Text className={styles.cardLabel}>{t("Common:Quantity")}</Text>
              <Text className={styles.quantityValue}>{planUsers}</Text>
              <Text className={styles.cardCaption}>
                {t("DocsConnect:PlanUsers")}
              </Text>
            </div>
          </div>

          {isPaid ? (
            deactivated ? (
              <div className={styles.actionsRow}>
                <Button
                  primary
                  size={ButtonSize.small}
                  label={getRenewLabel()}
                  onClick={
                    isDelayedPaymentTopUp
                      ? openTopUpDialog
                      : onEditPlan
                  }
                />
                <Button
                  size={ButtonSize.small}
                  label={t("Common:RemoveSubscription")}
                  onClick={onRemovePlan}
                />
              </div>
            ) : scheduledChange ? (
              isCancellation ? (
                <div className={styles.actionsRow}>
                  <Button
                    size={ButtonSize.small}
                    label={t("Settings:Statistics")}
                    onClick={onGoToTenant}
                  />
                  <Text className={styles.renewalText}>
                    <CommonTrans
                      i18nKey="DocsConnect:TariffPlanAutoCanceled"
                      values={{
                        date: formatDateLocalized(
                          scheduledChange.dueDate,
                          "DATE_MED",
                          { locale: language },
                        ),
                      }}
                      components={{ 1: <Text as="span" fontWeight={600} /> }}
                    />
                  </Text>
                </div>
              ) : (
                <div className={styles.actionsRow}>
                  <Button
                    size={ButtonSize.small}
                    label={t("Settings:Statistics")}
                    onClick={onGoToTenant}
                  />
                  <Text className={styles.renewalText}>
                    <CommonTrans
                      i18nKey="Common:SubscriptionAutoRenewedWithUpdate"
                      values={{
                        finalDate: formatDateLocalized(
                          scheduledChange.dueDate,
                          "DATE_MED",
                          { locale: language },
                        ),
                        price: nextMonthlyPrice,
                        amount: `${t("DocsConnect:PlanUsers")}: ${scheduledChange.nextUsers}`,
                      }}
                      components={{ 1: <Text as="span" fontWeight={600} /> }}
                    />
                  </Text>
                </div>
              )
            ) : (
              <div className={styles.actionsRow}>
                <Button
                  primary
                  size={ButtonSize.small}
                  label={t("Common:EditSubscription")}
                  onClick={onEditPlan}
                />
                <Button
                  size={ButtonSize.small}
                  label={t("Settings:Statistics")}
                  onClick={onGoToTenant}
                />
                <Text className={styles.renewalText}>
                  <CommonTrans
                    i18nKey="DocsConnect:TariffPlanAutoRenewed"
                    values={{
                      date: formatDateLocalized(endDate, "DATE_MED", {
                        locale: language,
                      }),
                    }}
                    components={{ 1: <Text as="span" fontWeight={600} /> }}
                  />
                </Text>
              </div>
            )
          ) : expired ? null : (
            <div className={styles.actionsRow}>
              <Button
                primary
                size={ButtonSize.small}
                label={t("Common:Upgrade")}
                onClick={onBuyPlan}
              />
              <Button
                size={ButtonSize.small}
                label={t("Settings:Statistics")}
                onClick={onGoToTenant}
              />
              <Text className={styles.trialEnds}>
                {t("DocsConnect:TrialEndsOn", {
                  date: formatDateLocalized(endDate, "DATE_MED", {
                    locale: language,
                  }),
                })}
              </Text>
            </div>
          )}
        </>
      )}

      <div className={styles.history}>
        <TransactionHistory
          serviceName={DOCS_CONNECT_SERVICE}
          hideTypeFilter
          hideContactFilter
        />
      </div>

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={closeTopUpDialog}
          onConfirm={onTopUpComplete}
          recommendedAmount={paymentStore.recommendedAmount}
          minValue={isDelayedPaymentTopUp ? `${renewalShortfall}` : undefined}
          serviceName={DOCS_CONNECT_SERVICE}
        />
      ) : null}
    </div>
  );
};

export default observer(DocsConnectPage);
