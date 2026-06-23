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

import React, { useState } from "react";
import { observer } from "mobx-react";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import styled from "styled-components";

import { Button, ButtonSize } from "../../../components/button";
import { toastr } from "../../../components/toast";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";

import DowngradePlanButtonContainer from "./DowngradePlanButtonContainer";
import ChangePricingPlanDialog from "../../dialogs/ChangePricingPlanDialog";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { AnalyticsEvents } from "../../../enums";

const StyledBody = styled.div`
  button {
    width: 100%;
  }
`;
const StyledModalBody = styled.div`
  .text-warning {
    margin-top: 16px;
  }
`;

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
    fetchBalance,
    walletBalance,
    walletCodeCurrency,
    tariffDueTodayAmount,
    isTariffDueTodayCalculating,
  } = store;
  const {
    maxCountManagersByQuota,
    currentTariffPlanTitle,
    fetchPortalQuota,
    isFreeTariff,
  } = store.quotas;
  const { tariffPlanTitle } = store.paymentQuotas;
  const { fetchPortalTariff } = store.tariff;

  const [isVisiblePaymentConfirm, setIsVisiblePaymentConfirm] = useState(false);
  const [isVisibleDowngradePlanDialog, setIsVisibleDowngradePlanDialog] =
    useState(false);

  const onClose = () => {
    setIsVisiblePaymentConfirm(false);
  };

  const dueTodayAmount = tariffDueTodayAmount ?? totalPrice;
  const isBalanceInsufficient = walletBalance < dueTodayAmount;

  const onUpdateTariff = async () => {
    try {
      setIsLoading(true);

      if (isVisiblePaymentConfirm) onClose();

      const recommendedAmount = isBalanceInsufficient
        ? Math.ceil(dueTodayAmount - walletBalance)
        : 0;

      if (isBalanceInsufficient && recommendedAmount > 0) {
        await paymentApi.topUpDeposit({
          topUpDepositRequestDto: {
            amount: recommendedAmount,
            currency: walletCodeCurrency || "USD",
          },
        });
      }

      const updateRes = await paymentApi.updateWalletPayment({
        walletQuantityRequestDto: {
          quantity: { adminwallet: managersCount - maxCountManagersByQuota },
          productQuantityType: ProductQuantityType.Add,
        },
      });

      const res = updateRes?.data?.response;

      if (res === false) {
        toastr.error(t("ErrorNotification"));

        setIsLoading(false);

        return;
      }

      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: AnalyticsEvents.Purchase,
        ecommerce: {
          items: [{ item_name: "DocSpace Business" }],
        },
      });

      await Promise.all([
        fetchPortalTariff(true),
        fetchBalance(true),
        fetchPortalQuota(true),
      ]);

      toastr.success(
        t("BusinessUpdated", { planName: currentTariffPlanTitle }),
      );

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      toastr.error(t("ErrorNotification"));
      setIsLoading(false);
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

  const onCloseDowngradePlanDialog = () => {
    setIsVisibleDowngradePlanDialog(false);
  };

  const goToStripePortal = () => {
    paymentLink
      ? window.open(paymentLink, "_blank")
      : toastr.error(t("ErrorNotification"));
  };

  const payTariffButton = () => {
    return canPayTariff ? (
      <Button
        className="upgrade-now-button"
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
    const isDowngradePlan =
      !isFreeTariff && managersCount < maxCountManagersByQuota;
    const isTheSameCount =
      !isFreeTariff && managersCount === maxCountManagersByQuota;

    return isDowngradePlan ? (
      <DowngradePlanButtonContainer
        onDowngradeTariff={onDowngradeTariff}
        isDisabled={isDisabled}
        buttonLabel={t("DowngradeNow")}
      />
    ) : (
      <Button
        className="upgrade-now-button"
        label={
          tariffDueTodayAmount !== null &&
          isBalanceInsufficient &&
          !isTheSameCount
            ? t("TopUpAndUpgrade")
            : t("UpgradeNow")
        }
        size={ButtonSize.medium}
        primary
        isDisabled={
          isLessCountThanAcceptable ||
          isTheSameCount ||
          isLoading ||
          isDisabled ||
          isTariffDueTodayCalculating
        }
        onClick={onUpdateTariff}
        isLoading={isLoading}
        testId="upgrade_plan_button"
      />
    );
  };

  return (
    <StyledBody>
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
            <StyledModalBody>
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
              <Text className="text-warning">
                <CommonTrans
                  i18nKey="ActionCannotBeUndone"
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
            </StyledModalBody>
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
    </StyledBody>
  );
};

export default observer(UpdatePlanButtonContainer);

