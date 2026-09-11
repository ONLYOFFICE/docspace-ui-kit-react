import React, { useRef, useState } from "react";
import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { HelpButton } from "../../../components/help-button";
import { Loader, LoaderTypes } from "../../../components/loader";
import { ModalDialog } from "../../../components/modal-dialog";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import WalletInfo from "../../shared/top-up-balance/sub-components/WalletInfo";
import SimpleTopUpDialog from "../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import StorageWarning from "../../services/panels/additional-storage/StorageWarning";
import { formatRemainingDays } from "../../utils/common";

import InfoIcon from "../../../assets/info.outline.react.svg";

import styles from "./PriceDetailsDialog.module.scss";

type PriceDetailsDialogProps = {
  visible: boolean;
  onClose: () => void;
  isDowngradePlan: boolean;
};

const PriceDetailsDialog = observer(
  ({
    visible,
    onClose,
    isDowngradePlan: isDowngradePlanProp,
  }: PriceDetailsDialogProps) => {
    const t = useCommonTranslation();
    const store = usePaymentStore();
    const {
      isLoading,
      isCardMissingOrInactive,
      managersCount,
      totalPrice,
      tariffDueTodayAmount,
      isTariffDueTodayCalculating,
      formatPaymentCurrency,
      formatWalletCurrency,
      language,
      walletBalance,
      getConfirmButtonLabel,
    } = store;
    const { maxCountManagersByQuota } = store.quotas;
    const { planCost } = store.paymentQuotas;
    const { paymentDate, daysUntilPayment, isDelayedPaymentMethod } =
      store.tariff;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTopUpVisible, setIsTopUpVisible] = useState(false);
    const openTopUpDialog = () => setIsTopUpVisible(true);
    const closeTopUpDialog = () => setIsTopUpVisible(false);

    const isDowngradePlan = useRef(isDowngradePlanProp).current;
    const confirmLabel = getConfirmButtonLabel(t);
    const currentAdmins = useRef(maxCountManagersByQuota).current;
    const newAdmins = useRef(managersCount).current;
    const pricePerAdmin = useRef(planCost.value).current;
    const initialPaymentDate = useRef(paymentDate).current;
    const initialDaysUntilPayment = useRef(daysUntilPayment).current;

    const additionalAdmins = newAdmins - currentAdmins;
    const dueToday = tariffDueTodayAmount ?? 0;
    const daysDisplay = formatRemainingDays(
      initialDaysUntilPayment,
      language,
      t,
    );

    const topUpShortfall = Math.max(0, Math.ceil(dueToday - walletBalance));
    const isDelayedPaymentTopUp =
      !isDowngradePlan && isDelayedPaymentMethod && topUpShortfall > 0;

    const onConfirm = async () => {
      if (isDelayedPaymentTopUp) {
        openTopUpDialog();
        return;
      }

      setIsSubmitting(true);

      const isSuccess = await store.executeWalletUpdate(
        isDowngradePlan ? newAdmins : additionalAdmins,
        isDowngradePlan ? ProductQuantityType.Set : ProductQuantityType.Add,
        t,
      );

      setIsSubmitting(false);

      if (isSuccess) onClose();
    };

    const renderRow = (label: React.ReactNode, value: React.ReactNode) => (
      <div className={styles.row}>
        <Text as="span" fontSize="14px">
          {label}
        </Text>
        <Text as="span" fontSize="14px" fontWeight={600}>
          {value}
        </Text>
      </div>
    );

    return (
      <>
      <ModalDialog
        visible={visible && !isTopUpVisible}
        hideContent={isTopUpVisible}
        onClose={onClose}
        autoMaxHeight
        isLarge
      >
        <ModalDialog.Header>
          {isDowngradePlan ? t("Confirmation") : t("PriceDetails")}
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.content}>
            <WalletInfo balance={formatWalletCurrency()} />

            <Text fontSize="16px" fontWeight={700}>
              {t("OrderSummary")}
            </Text>

            <div className={styles.summary}>
              {renderRow(
                t("AdminAdjustment"),
                `${currentAdmins} → ${newAdmins}`,
              )}
              {renderRow(
                isDowngradePlan ? t("ReducedAdmins") : t("AdditionalAdmins"),
                isDowngradePlan
                  ? `${additionalAdmins}`
                  : `+${additionalAdmins}`,
              )}
              {renderRow(
                t("PricePerAdmin"),
                formatPaymentCurrency(pricePerAdmin),
              )}
              {isDowngradePlan
                ? renderRow(
                    t("NewMonthlyPrice"),
                    formatPaymentCurrency(newAdmins * pricePerAdmin),
                  )
                : null}
              {isDowngradePlan
                ? renderRow(t("EffectiveDate"), initialPaymentDate)
                : renderRow(
                    t("RemainingPeriod"),
                    <>
                      {`${daysDisplay} `}
                      <Text as="span" fontSize="14px" className={styles.muted}>
                        ({t("UntilDate", { date: initialPaymentDate })})
                      </Text>
                    </>,
                  )}

              <div className={styles.divider} />

              <div className={styles.row}>
                <div className={styles.totalLabel}>
                  <Text as="span" fontSize="14px" fontWeight={600}>
                    {t("TotalDueToday")}
                  </Text>
                  {isDowngradePlan ? null : (
                    <HelpButton
                      iconNode={<InfoIcon />}
                      tooltipContent={
                        <Text fontSize="12px">
                          {t("DueTodayProrationTooltip")}
                        </Text>
                      }
                      dataTestId="price_details_due_today_help"
                    />
                  )}
                </div>
                {isTariffDueTodayCalculating ||
                tariffDueTodayAmount === null ? (
                  <Loader color="" size="16px" type={LoaderTypes.track} />
                ) : (
                  <Text as="span" fontSize="14px" fontWeight={600}>
                    {formatPaymentCurrency(dueToday)}
                  </Text>
                )}
              </div>
            </div>

            {isDowngradePlan ? (
              <StorageWarning
                body={t("TariffAdminAdjustmentWarning", {
                  admins: currentAdmins,
                })}
              />
            ) : (
              <Text fontSize="13px">
                <CommonTrans
                  i18nKey="PriceDetailsNextBill"
                  values={{
                    price: formatPaymentCurrency(totalPrice),
                    date: paymentDate,
                  }}
                  components={{
                    1: <Text as="span" fontSize="13px" fontWeight={600} />,
                    2: <Text as="span" fontSize="13px" fontWeight={600} />,
                  }}
                />
              </Text>
            )}
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            key="confirm"
            label={confirmLabel}
            size={ButtonSize.normal}
            primary
            scale
            isDisabled={
              isLoading ||
              isTariffDueTodayCalculating ||
              tariffDueTodayAmount === null ||
              isCardMissingOrInactive
            }
            isLoading={isSubmitting}
            onClick={onConfirm}
            testId="price_details_pay_button"
          />
          <Button
            key="cancel"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            scale
            onClick={onClose}
            testId="price_details_cancel_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>

      {isTopUpVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={closeTopUpDialog}
          minValue={`${topUpShortfall}`}
        />
      ) : null}
      </>
    );
  },
);

export default PriceDetailsDialog;

