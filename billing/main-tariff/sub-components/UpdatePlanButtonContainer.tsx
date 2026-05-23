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
import { observer } from "mobx-react";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";

import { Button, ButtonSize } from "../../../components/button";
import styles from "./UpdatePlanButtonContainer.module.scss";
import { toastr } from "../../../components/toast";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import type { QuotaDto } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";

import DowngradePlanButtonContainer from "./DowngradePlanButtonContainer";
import ChangePricingPlanDialog from "../../dialogs/ChangePricingPlanDialog";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

const MANAGER = "manager";
let timerId: ReturnType<typeof setTimeout> | undefined;
let intervalId: ReturnType<typeof setInterval> | undefined;
let isWaitRequest = false;
let previousManagersCount: number | null = null;

type UpdatePlanButtonContainerProps = {
  isDisabled?: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const UpdatePlanButtonContainer = ({
  isDisabled,
  t,
}: UpdatePlanButtonContainerProps) => {
  const { paymentApi } = useApi();
  const store = usePaymentStore();

  const fetchQuotaInfo = async () => {
    const r = await paymentApi.getQuotaPaymentInformation({
      refresh: true,
    });
    return r.data.response as unknown as QuotaDto;
  };

  const {
    setIsLoading,
    paymentLink,
    isAlreadyPaid,
    managersCount,
    isLoading,
    isLessCountThanAcceptable,
    canPayTariff,
    cardLinkedOnFreeTariff,
    totalPrice,
    formatPaymentCurrency,
    canDowngradeTariff,
    cardLinked,
  } = store;
  const {
    maxCountManagersByQuota,
    isYearTariff,
    setPortalQuotaValue,
    currentTariffPlanTitle,
  } = store.quotas;
  const { tariffPlanTitle } = store.paymentQuotas;
  const { walletCustomerStatusNotActive } = store.tariff;

  const [isVisiblePaymentConfirm, setIsVisiblePaymentConfirm] = useState(false);
  const [isVisibleDowngradePlanDialog, setIsVisibleDowngradePlanDialog] =
    useState(false);

  const resetIntervalSuccess = () => {
    intervalId &&
      toastr.success(
        t("BusinessUpdated", { planName: currentTariffPlanTitle }),
      );
    clearInterval(intervalId);
    intervalId = undefined;
    setIsLoading(false);
  };

  const waitingForQuota = () => {
    isWaitRequest = false;
    let requestsCount = 0;
    intervalId = setInterval(async () => {
      try {
        if (requestsCount === 30) {
          setIsLoading(false);

          intervalId && toastr.error(t("ErrorNotification"));
          clearInterval(intervalId);
          intervalId = undefined;

          return;
        }

        requestsCount++;

        if (isWaitRequest) {
          return;
        }

        isWaitRequest = true;
        const res = await fetchQuotaInfo();

        const managersObject = res.features?.find((obj) => obj.id === MANAGER);

        if (managersObject?.value !== previousManagersCount) {
          setPortalQuotaValue(res);

          resetIntervalSuccess();
        }
      } catch (e) {
        setIsLoading(false);

        intervalId && toastr.error(e as string);
        clearInterval(intervalId);
        intervalId = undefined;
      }

      isWaitRequest = false;
    }, 2000);
  };
  const onClose = () => {
    setIsVisiblePaymentConfirm(false);
  };

  const goLinkCard = () => {
    cardLinked
      ? window.open(cardLinked, "_self")
      : toastr.error(t("UnexpectedError"));
  };

  const onUpdateTariff = async () => {
    try {
      setIsLoading(true);

      if (isVisiblePaymentConfirm) onClose();

      const data: { [key: string]: number } = isYearTariff
        ? { adminyear: managersCount }
        : { admin: managersCount };
      const updateRes = await paymentApi.updatePayment({
        quantityRequestDto: {
          quantity: data,
        },
      });
      const res = updateRes?.data?.response;

      if (res === false) {
        const errorText =
          cardLinkedOnFreeTariff && walletCustomerStatusNotActive ? (
            <>
              {t("CardUnlinked")} <br />
              {t("LinkNewCard")} {"  "}
              <Link
                onClick={goLinkCard}
                fontWeight={600}
                style={{ textDecoration: "underline" }}
                data-testid="add_payment_method_link"
                color="accent"
              >
                {t("AddPaymentMethod")}
              </Link>
            </>
          ) : (
            t("ErrorNotification")
          );

        toastr.error(errorText);

        setIsLoading(false);
        clearTimeout(timerId);
        timerId = undefined;

        return;
      }

      previousManagersCount = maxCountManagersByQuota;
      const quotaRes = await paymentApi
        .getQuotaPaymentInformation({
          refresh: true,
        })
        .then((r) => r.data.response as unknown as QuotaDto);
      const managersObject = quotaRes.features?.find(
        (obj) => obj.id === MANAGER,
      );

      if (managersObject?.value !== previousManagersCount) {
        setPortalQuotaValue(quotaRes);
        resetIntervalSuccess();
      } else {
        waitingForQuota();
      }
    } catch (e) {
      console.error(e);
      toastr.error(t("ErrorNotification"));
      setIsLoading(false);
      clearTimeout(timerId);
      timerId = undefined;
    }
  };

  const isPassedByQuota = () => {
    return isAlreadyPaid ? canDowngradeTariff : canPayTariff;
  };

  const onDowngradeTariff = () => {
    if (isPassedByQuota()) {
      onUpdateTariff();
      return;
    }

    setIsVisibleDowngradePlanDialog(true);
  };

  const onOpenPaymentDialog = () => {
    if (isPassedByQuota()) {
      setIsVisiblePaymentConfirm(true);
      return;
    }

    setIsVisibleDowngradePlanDialog(true);
  };

  const onCloseDowngradePlanDialog = () => {
    setIsVisibleDowngradePlanDialog(false);
  };

  useEffect(() => {
    if (intervalId && maxCountManagersByQuota !== previousManagersCount) {
      resetIntervalSuccess();
    }
  }, [maxCountManagersByQuota, intervalId, previousManagersCount]);

  const goToStripePortal = () => {
    paymentLink
      ? window.open(paymentLink, "_blank")
      : toastr.error(t("ErrorNotification"));
  };

  useEffect(() => {
    return () => {
      timerId && clearTimeout(timerId);
      timerId = undefined;

      intervalId && clearInterval(intervalId);
      intervalId = undefined;
    };
  }, []);

  const payTariffButton = () => {
    return canPayTariff ? (
      <Button
        className={styles.button}
        label={t("UpgradeNow")}
        size={ButtonSize.medium}
        primary
        isDisabled={isLessCountThanAcceptable || isLoading || isDisabled}
        onClick={goToStripePortal}
        isLoading={isLoading}
        testId="upgrade_plan_button"
      />
    ) : (
      <DowngradePlanButtonContainer
        buttonLabel={t("UpgradeNow")}
        onUpdateTariff={goToStripePortal}
        isDisabled={isDisabled}
      />
    );
  };

  const updatingCurrentTariffButton = () => {
    const isDowngradePlan = managersCount < maxCountManagersByQuota;
    const isTheSameCount = managersCount === maxCountManagersByQuota;

    if (cardLinkedOnFreeTariff) {
      return (
        <Button
          className={styles.button}
          label={t("UpgradeNow")}
          size={ButtonSize.medium}
          primary
          isDisabled={isLoading || isDisabled}
          onClick={onOpenPaymentDialog}
          isLoading={isLoading}
          testId="upgrade_plan_button"
        />
      );
    }

    return isDowngradePlan ? (
      <DowngradePlanButtonContainer
        onDowngradeTariff={onDowngradeTariff}
        isDisabled={isDisabled}
        buttonLabel={t("DowngradeNow")}
      />
    ) : (
      <Button
        className={styles.button}
        label={t("UpgradeNow")}
        size={ButtonSize.medium}
        primary
        isDisabled={
          isLessCountThanAcceptable || isTheSameCount || isLoading || isDisabled
        }
        onClick={onUpdateTariff}
        isLoading={isLoading}
        testId="upgrade_plan_button"
      />
    );
  };

  return (
    <div className={styles.body}>
      {isAlreadyPaid || cardLinkedOnFreeTariff
        ? updatingCurrentTariffButton()
        : payTariffButton()}

      {isVisibleDowngradePlanDialog ? (
        <ChangePricingPlanDialog
          visible={isVisibleDowngradePlanDialog}
          onClose={onCloseDowngradePlanDialog}
        />
      ) : null}

      {isVisiblePaymentConfirm ? (
        <ModalDialog
          visible={isVisiblePaymentConfirm}
          onClose={onClose}
          displayType={ModalDialogType.modal}
        >
          <ModalDialog.Header>{t("PlanUpgrade")}</ModalDialog.Header>
          <ModalDialog.Body>
            <div className={styles.modalBody}>
              <Text>
                <CommonTrans
                  i18nKey="SwitchPlan"
                  values={{ planName: tariffPlanTitle }}
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
              <Text>
                <CommonTrans
                  i18nKey="ChargeAmount"
                  values={{ price: formatPaymentCurrency(totalPrice) }}
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
              <Text className={styles.textWarning}>
                <CommonTrans
                  i18nKey="ActionCannotBeUndone"
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
            </div>
          </ModalDialog.Body>
          <ModalDialog.Footer>
            <Button
              key="OkButton"
              label={t("ConfirmPayment")}
              size={ButtonSize.normal}
              primary
              scale
              onClick={onUpdateTariff}
              testId="confirm_payment_button"
            />
            <Button
              key="CancelButton"
              label={t("CancelButton")}
              size={ButtonSize.normal}
              scale
              onClick={onClose}
              testId="cancel_payment_button"
            />
          </ModalDialog.Footer>
        </ModalDialog>
      ) : null}
    </div>
  );
};

export default observer(UpdatePlanButtonContainer);
