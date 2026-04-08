// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import styled from "styled-components";

import { Button, ButtonSize } from "../../../components/button";
import { toastr } from "../../../components/toast";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import type { QuotaDto } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";

import DowngradePlanButtonContainer from "./DowngradePlanButtonContainer";
import ChangePricingPlanDialog from "../../dialogs/ChangePricingPlanDialog";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

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

const MANAGER = "manager";
let timerId: ReturnType<typeof setTimeout> | undefined;
let intervalId: ReturnType<typeof setInterval> | undefined;
let isWaitRequest = false;
let previousManagersCount: number | null = null;

type UpdatePlanButtonContainerProps = {
  isDisabled?: boolean;
  currentTariffPlanTitle?: string;
  t: (key: string, options?: Record<string, unknown>) => string;
  tariffPlanTitle?: string;
};

const UpdatePlanButtonContainer = ({
  isDisabled,
  currentTariffPlanTitle,
  t,
  tariffPlanTitle,
}: UpdatePlanButtonContainerProps) => {
  const { paymentApi } = useApi();
  const store = usePaymentStore();

  const fetchQuotaInfo = async () => {
    const r = await paymentApi.getQuotaPaymentInformation(true);
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
  const { maxCountManagersByQuota, isYearTariff, setPortalQuotaValue } =
    store.quotas;
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
      : toastr.error(t("Common:UnexpectedError"));
  };

  const onUpdateTariff = async () => {
    try {
      setIsLoading(true);

      if (isVisiblePaymentConfirm) onClose();

      const data: { [key: string]: number } = isYearTariff
        ? { adminyear: managersCount }
        : { admin: managersCount };
      const updateRes = await paymentApi.updatePayment({ quantity: data });
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
        .getQuotaPaymentInformation(true)
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
    const isDowngradePlan = managersCount < maxCountManagersByQuota;
    const isTheSameCount = managersCount === maxCountManagersByQuota;

    if (cardLinkedOnFreeTariff) {
      return (
        <Button
          className="upgrade-now-button"
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
        className="upgrade-now-button"
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
                  namespaces={["Payments"]}
                  values={{ planName: tariffPlanTitle }}
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
              <Text>
                <CommonTrans
                  i18nKey="ChargeAmount"
                  namespaces={["Payments"]}
                  values={{ price: formatPaymentCurrency(totalPrice) }}
                  components={{
                    1: <span style={{ fontWeight: 600 }} />,
                  }}
                />
              </Text>
              <Text className="text-warning">
                <CommonTrans
                  i18nKey="ActionCannotBeUndone"
                  namespaces={["Payments"]}
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
              label={t("Common:CancelButton")}
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

