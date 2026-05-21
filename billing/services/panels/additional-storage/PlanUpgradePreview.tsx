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

import React, { useEffect, useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";
import classNames from "classnames";
import { now, formatDateLocalized } from "../../../../utils/date";

import { Text } from "../../../../components/text";
import { useApi } from "../../../../providers";
import { toastr } from "../../../../components/toast";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { useInterfaceDirection } from "../../../../context/InterfaceDirectionContext";
import { HelpButton } from "../../../../components/help-button";

import UpgradeWalletIcon from "../../../../assets/icons/16/upgrade.react.svg";

import styles from "../../styles/StorageSummary.module.scss";
import { useServicesActions } from "../../hooks/useServicesActions";
import { calculateDifference } from "../../hooks/resourceUtils";
import { usePaymentContext } from "../../context/PaymentContext";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

let timeout: NodeJS.Timeout | null;
let controller: AbortController;

type PlanUpgradePreviewProps = {
  amount: number;
};

const getDirectionalText = (isRTL: boolean) => {
  return isRTL ? `>1` : `<1`;
};

const PlanUpgradePreview: React.FC<PlanUpgradePreviewProps> = (props) => {
  const { amount } = props;

  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { currentStoragePlanSize, daysUntilStorageExpiry, storageExpiryDate } =
    paymentStore.tariff;
  const { setPartialUpgradeFee, partialUpgradeFee } = servicesStore;
  const { formatWalletCurrency } = paymentStore;

  const { isRTL } = useInterfaceDirection();

  const { setIsWaitingCalculation } = usePaymentContext();
  const t = useCommonTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { calculateDifferenceBetweenPlan } = useServicesActions();

  const tooltipText = () => {
    return (
      <>
        <Text as="span">
          {daysUntilStorageExpiry === 0
            ? t("PartialPaymentNoDate", { storageUnit: t("Gigabyte") })
            : t("PartialPaymentWithDate", {
                startDate: formatDateLocalized(
                  now().setZone(window.timezone),
                  "DATE_MED",
                ),
                endDate: storageExpiryDate,
                storageUnit: t("Gigabyte"),
              })}
        </Text>{" "}
        <Text as="span">{t("PartialPaymentDescription")}</Text>
      </>
    );
  };

  useEffect(() => {
    const calcalatePayment = () => {
      setIsLoading(true);
      setIsWaitingCalculation(true);

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (controller) controller.abort();

        controller = new AbortController();

        const quantity = calculateDifferenceBetweenPlan(amount);
        try {
          const calcRes = await paymentApi.calculateWalletPayment(
            { quantity: { storage: quantity }, productQuantityType: 1 },
            { signal: controller.signal },
          );
          const currentWriteOff = calcRes?.data?.response as unknown as { amount: number } | null;

          if (!currentWriteOff) {
            toastr.error(t("UnexpectedError"));
            return;
          }

          const paymentAmount = currentWriteOff.amount;
          setPartialUpgradeFee(paymentAmount);
          setIsLoading(false);
          setIsWaitingCalculation(false);
        } catch (e) {
          toastr.error(e as unknown as string);
        }
      }, 1000);
    };

    calcalatePayment();
  }, [amount]);

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
      setIsWaitingCalculation(false);
      timeout = null;
    };
  }, []);

  const days = daysUntilStorageExpiry || getDirectionalText(isRTL);

  return (
    <>
      <div className={styles.planInfoHeader}>
        <Text fontWeight={700} fontSize="16px">
          {t("DueToday")}
        </Text>
        <HelpButton
          size={12}
          offsetRight={0}
          place={isRTL ? "left" : "right"}
          tooltipContent={tooltipText()}
          dataTestId="partial_payment_help_button"
        />
      </div>
      <div className={classNames(styles.planInfoContainer, styles.withBottom)}>
        <div className={styles.planInfoIcon}>
          <UpgradeWalletIcon />
        </div>
        <div className={styles.planInfoBody}>
          <Text fontWeight={600}>
            {t("AdditionalStorage", {
              amount: `${calculateDifference(amount, currentStoragePlanSize!)} ${t("Gigabyte")}`,
            })}
          </Text>
          <Text
            fontWeight="600"
            fontSize="11px"
            className={styles.priceForEach}
          >
            {t("RemainingDays", { count: Number(days) })}
          </Text>
        </div>

        <div className={styles.planInfoPrice}>
          {isLoading ? (
            <Loader color="" size="20px" type={LoaderTypes.track} />
          ) : (
            <>
              <Text fontWeight="600" fontSize="14px">
                {formatWalletCurrency(partialUpgradeFee!)}
              </Text>
              <Text
                fontWeight="600"
                fontSize="11px"
                className={styles.priceForEach}
              >
                {t("ForDays", { count: Number(days) })}
              </Text>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default observer(PlanUpgradePreview);
