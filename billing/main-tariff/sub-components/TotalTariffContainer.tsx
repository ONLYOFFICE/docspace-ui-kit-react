/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { Loader, LoaderTypes } from "../../../components/loader";
import { IconButton } from "../../../components/icon-button";
import { toastr } from "../../../components/toast";
import InfoIcon from "../../../assets/info.outline.react.svg";

import PriceDetailsDialog from "./PriceDetailsDialog";
import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";
import type { TTranslation } from "../../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useApi } from "../../../providers";
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

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      if (!isUpgrade || isNeedRequest) {
        setTariffDueTodayAmount(null);
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
    }, [managersDiff, isUpgrade, isNeedRequest, paymentApi]);

    const dueTodayPill =
      isUpgrade && !isNeedRequest ? (
        <div
          className={classNames(styles.proratedNow, {
            [styles.isDisabled]: isDisabled,
          })}
        >
          <div className={styles.proratedNowLabel}>
            <Text as="span" fontSize="13px">
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
            <Text fontWeight={600} fontSize="16px">
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
                    3: <Text fontWeight={600} as="span" key="bold-text-year" />,
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
                      <Text fontWeight={600} as="span" key="bold-text-month" />
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
          />
        ) : null}
      </div>
    );
  },
);

export default TotalTariffContainer;

