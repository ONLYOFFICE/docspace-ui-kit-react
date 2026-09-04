import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { Loader, LoaderTypes } from "../../../components/loader";
import { IconButton } from "../../../components/icon-button";
import { toastr } from "../../../components/toast";
import InfoIcon from "../../../assets/info.react.svg";

import PriceDetailsDialog from "./PriceDetailsDialog";
import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";
import type { TTranslation } from "../../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useApi } from "../../../providers/api";
import styles from "./SubComponents.module.scss";

const TotalTariffContainer = observer(
  ({ t, isDisabled }: { t: TTranslation; isDisabled: boolean }) => {
    const store = usePaymentStore();
    const { paymentApi } = useApi();
    const {
      totalPrice,
      isNeedRequest,
      maxAvailableManagersCount,
      managersCount,
      formatPaymentCurrency,
      tariffDueTodayAmount,
      setTariffDueTodayAmount,
      isTariffDueTodayCalculating,
      setIsTariffDueTodayCalculating,
      needsWalletMigration,
      getConfirmButtonLabel,
    } = store;
    const { isYearTariff, maxCountManagersByQuota, isFreeTariff } =
      store.quotas;

    const [isPriceDetailsVisible, setIsPriceDetailsVisible] = useState(false);

    const managersDiff = managersCount - maxCountManagersByQuota;
    const isDowngradePlan =
      !isFreeTariff && managersCount < maxCountManagersByQuota;
    const isTheSameCount =
      !isFreeTariff && managersCount === maxCountManagersByQuota;
    // Migration flow has its own dialog/price breakdown — skip the prorated
    // "due today" calculation and pill here.
    const isUpgrade =
      !isFreeTariff &&
      !isDowngradePlan &&
      !isTheSameCount &&
      !needsWalletMigration;

    const confirmLabel = getConfirmButtonLabel(t);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      if (isNeedRequest || (!isUpgrade && !isDowngradePlan)) {
        setTariffDueTodayAmount(null);
        setIsTariffDueTodayCalculating(false);
        return;
      }

      if (isDowngradePlan) {
        setTariffDueTodayAmount(0);
        setIsTariffDueTodayCalculating(false);
        return;
      }

      setIsTariffDueTodayCalculating(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        try {
          const calcRes = await paymentApi.calculateWalletPayment(
            {
              walletQuantityRequestDto: {
                quantity: { adminwallet: managersDiff },
                productQuantityType: ProductQuantityType.Add,
              },
            },
            { signal: controllerRef.current.signal },
          );

          const result = calcRes?.data?.response as unknown as {
            amount: number;
          } | null;

          if (result) setTariffDueTodayAmount(Math.ceil(result.amount));
          setIsTariffDueTodayCalculating(false);
        } catch (e) {
          if (e instanceof Error && e.name === "CanceledError") return;
          setIsTariffDueTodayCalculating(false);
          toastr.error(t("ErrorNotification"));
        }
      }, 1000);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [managersDiff, isUpgrade, isDowngradePlan, isNeedRequest, paymentApi]);

    const dueTodayPill =
      (isUpgrade || isDowngradePlan) && !isNeedRequest ? (
        <div
          className={classNames(styles.proratedNow, {
            [styles.isDisabled]: isDisabled,
          })}
        >
          <div className={styles.proratedNowLabel}>
            <Text as="span" fontSize="13px" fontWeight={600}>
              {t("TotalDueToday")}
            </Text>
            <IconButton
              iconNode={<InfoIcon />}
              size={12}
              onClick={() => setIsPriceDetailsVisible(true)}
              className={styles.proratedNowInfo}
              dataTestId="due_today_info_button"
            />
          </div>
          {isTariffDueTodayCalculating || tariffDueTodayAmount === null ? (
            <Loader
              color=""
              size="16px"
              type={LoaderTypes.track}
              className={styles.proratedNowLoader}
            />
          ) : (
            <Text as="span" className={styles.proratedNowPrice}>
              {formatPaymentCurrency(tariffDueTodayAmount)}
            </Text>
          )}
        </div>
      ) : null;

    return (
      <div className={styles.totalTariffContainer}>
        {dueTodayPill}

        <div
          className={classNames(styles.paymentPriceTotalPrice, {
            [styles.isDisabled]: isDisabled,
          })}
        >
          {isNeedRequest ? (
            <Text
              fontSize="14"
              textAlign="center"
              fontWeight={600}
              className={styles.totalTariffDescription}
            >
              <CommonTrans
                i18nKey="BusinessRequestDescription"
                values={{ peopleNumber: maxAvailableManagersCount }}
              />
            </Text>
          ) : (
            <Text
              fontWeight={600}
              fontSize="16px"
              className={styles.totalPriceLine}
            >
              {isYearTariff ? (
                <CommonTrans
                  i18nKey="TotalPricePerYear"
                  values={{ price: formatPaymentCurrency(totalPrice) }}
                  components={{
                    2: (
                      <span
                        key="large-font-year"
                        className={styles.largerFontSize}
                      />
                    ),
                    3: (
                      <Text
                        fontWeight={600}
                        as="span"
                        key="bold-text-year"
                        className={styles.totalPriceSuffix}
                      />
                    ),
                  }}
                />
              ) : (
                <CommonTrans
                  i18nKey="TotalPricePerMonth"
                  values={{ price: formatPaymentCurrency(totalPrice) }}
                  components={{
                    2: (
                      <span
                        key="large-font-month"
                        className={styles.largerFontSize}
                      />
                    ),
                    3: (
                      <Text
                        fontWeight={600}
                        as="span"
                        key="bold-text-month"
                        className={styles.totalPriceSuffix}
                      />
                    ),
                  }}
                />
              )}
            </Text>
          )}
        </div>

        {isPriceDetailsVisible ? (
          <PriceDetailsDialog
            visible={isPriceDetailsVisible}
            onClose={() => setIsPriceDetailsVisible(false)}
            isDowngradePlan={isDowngradePlan}
            confirmLabel={confirmLabel}
          />
        ) : null}
      </div>
    );
  },
);

export default TotalTariffContainer;

