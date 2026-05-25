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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { useNavigate } from "react-router";
import {
  type ChangeWalletServiceStateRequestDto,
  TenantWalletService,
} from "@onlyoffice/docspace-api-sdk";

import { toastr } from "../../components/toast";
import { AI_ENUM, BACKUP_SERVICE, TOTAL_SIZE } from "../constants";

const toWalletService = (id: string): TenantWalletService => {
  if (id === BACKUP_SERVICE) return TenantWalletService.Backup;
  if (id === AI_ENUM) return TenantWalletService.AITools;
  return TenantWalletService.Storage;
};

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useServicesStore } from "../store/ServicesStoreProvider";
import { useApi } from "../../providers";
import TopUpModal from "../shared/top-up-balance/TopUpModal";

import ServicesItems from "./ServicesItems";
import ServicesLoader from "./ServicesLoader";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";
import StoragePlanUpgrade from "./panels/additional-storage/StoragePlanUpgrade";
import StoragePlanCancel from "./panels/additional-storage/StoragePlanCancel";
import GracePeriodModal from "./panels/additional-storage/GracePeriodModal";
import ConfirmationDialog from "./sub-components/ConfirmationDialog";
import AIServiceDialog from "./panels/ai-service/AIServiceDialog";
import { getBrandName } from "../../constants/brands";
type TServicesProps = {
  showPortalSettingsLoader?: boolean;
  initialOpenDialog?: string;
  getAIConfig?: () => Promise<void>;
  cardDisabled?: boolean;
};

const Services = observer(
  ({
    showPortalSettingsLoader = true,
    initialOpenDialog,
    getAIConfig,
    cardDisabled,
  }: TServicesProps) => {
    const navigate = useNavigate();
    const paymentStore = usePaymentStore();
    const servicesStore = useServicesStore();
    const { paymentApi } = useApi();

    const {
      isShowStorageTariffDeactivatedModal,
      changeServiceState,
      isCardLinkedToPortal,
      isServiceActionDisabled,
    } = paymentStore;

    const {
      isInitServicesPage,
      isVisibleWalletSettings,
      setConfirmActionType,
      confirmActionType,
      setVisibleWalletSetting,
      wasFirstAiServiceTopUp,
      formatAiServiceCurrency,
      servicesInit,
    } = servicesStore;

    const { isGracePeriod, previousStoragePlanSize, currentStoragePlanSize } =
      paymentStore.tariff;
    const { isFreeTariff } = paymentStore.quotas;
    const { logoText } = paymentStore;

    const t = useCommonTranslation();

    useEffect(() => {
      servicesInit(t);
    }, []);

    const initialDialogVisibility: Record<string, boolean> = {
      [TOTAL_SIZE]: false,
      [BACKUP_SERVICE]: false,
      [AI_ENUM]: false,
    };
    const [dialogVisibility, setDialogVisibility] = useState(
      initialDialogVisibility,
    );

    const updateDialogVisibility = useCallback(
      (dialogType: string, isVisible: boolean) => {
        setDialogVisibility((prev) => {
          if (prev[dialogType] === isVisible) return prev;
          return { ...prev, [dialogType]: isVisible };
        });
      },
      [],
    );

    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const [isCurrentConfirmState, setIsCurrentConfirmState] = useState(false);
    const [isStorageCancellation, setIsStorageCancellation] = useState(false);
    const [isGracePeriodModalVisible, setIsGracePeriodModalVisible] =
      useState(false);
    const [previousValue, setPreviousValue] = useState("");

    const [isTopUpBalanceVisible, setIsTopUpBalanceVisible] = useState(false);

    const shouldShowLoader = !isInitServicesPage;

    const previousDialogRef = useRef<boolean>(false);

    useEffect(() => {
      if (!isVisibleWalletSettings || !isInitServicesPage) return;

      if (confirmActionType === TOTAL_SIZE) {
        updateDialogVisibility(TOTAL_SIZE, isVisibleWalletSettings);
      } else if (confirmActionType === AI_ENUM) {
        updateDialogVisibility(AI_ENUM, isVisibleWalletSettings);
      } else {
        setIsTopUpBalanceVisible(true);
      }
    }, [
      isVisibleWalletSettings,
      confirmActionType,
      isInitServicesPage,
      updateDialogVisibility,
    ]);

    useEffect(() => {
      if (initialOpenDialog) {
        updateDialogVisibility(TOTAL_SIZE, true);
        setPreviousValue(
          previousStoragePlanSize ? previousStoragePlanSize.toString() : "",
        );
      }
    }, [initialOpenDialog, updateDialogVisibility, previousStoragePlanSize]);

    const confirmationDialogContent: Record<
      string,
      { title: string; body: string | React.ReactNode[] }
    > = {
      [BACKUP_SERVICE]: {
        title: t("Confirmation"),
        body: !isCurrentConfirmState
          ? t("EnableBackupConfirm", {
              productName: getBrandName("ProductName"),
            })
          : isFreeTariff
            ? t("DisableBackupConfirmWithoutQuota", {
                productName: getBrandName("ProductName"),
              })
            : t("DisableBackupConfirm", {
                productName: getBrandName("ProductName"),
              }),
      },
      [AI_ENUM]: {
        title: t("Confirmation"),
        body: isCurrentConfirmState
          ? [
              t("DisableAIToolsConfirm", {
                organizationName: logoText,
              }),
              <CommonTrans
                key="DisableAIToolsConfirmBalance"
                i18nKey="DisableAIToolsConfirmBalance"
                values={{ balance: formatAiServiceCurrency() }}
                components={{
                  1: <span style={{ fontWeight: 600 }} />,
                }}
              />,
              t("DisableAIToolsConfirmReEnable"),
            ]
          : [
              t("AIToolsDescription", {
                productName: getBrandName("ProductName"),
                organizationName: logoText,
              }),
              <CommonTrans
                key="CurrentBalance"
                i18nKey="CurrentBalance"
                values={{ balance: formatAiServiceCurrency() }}
                components={{
                  1: <span style={{ fontWeight: 600 }} />,
                }}
              />,
              t("WantToContinue"),
            ],
      },
    };

    const getDialogContent = (actionType: string | null) => {
      if (!actionType || !(actionType in confirmationDialogContent)) {
        return { title: "", body: "" };
      }
      return confirmationDialogContent[actionType];
    };

    const onClick = (id: string) => {
      setConfirmActionType(id);

      if (
        id === TOTAL_SIZE &&
        (currentStoragePlanSize || previousStoragePlanSize)
      ) {
        navigate(paymentStore.routes.diskStorage);
        return;
      }

      if (id === TOTAL_SIZE && isGracePeriod) {
        setIsGracePeriodModalVisible(true);
        return;
      }

      if (id === AI_ENUM) {
        if (isServiceActionDisabled && !wasFirstAiServiceTopUp) return;

        if (wasFirstAiServiceTopUp) {
          navigate(paymentStore.routes.aiServices);
          return;
        }
      }

      if (id === BACKUP_SERVICE && isCardLinkedToPortal) {
        navigate(paymentStore.routes.backup);
        return;
      }

      // if (id === BACKUP_SERVICE && !isCardLinkedToPortal) {
      //   setConfirmActionType(id);
      //   setIsConfirmDialogVisible(true);
      //   return;
      // }

      updateDialogVisibility(id, true);
    };

    const onClose = () => {
      updateDialogVisibility(TOTAL_SIZE, false);
    };

    const onCloseStorageCancell = () => {
      setIsStorageCancellation(false);
    };

    const onToggle = async (id: string, currentEnabled: boolean) => {
      setConfirmActionType(id);
      setIsCurrentConfirmState(currentEnabled);

      if (id === TOTAL_SIZE) {
        if (isGracePeriod) {
          setIsGracePeriodModalVisible(true);
          return;
        }
        if (currentEnabled) {
          setIsStorageCancellation(true);
          return;
        }
        updateDialogVisibility(TOTAL_SIZE, true);
        return;
      }

      if (id === AI_ENUM && !wasFirstAiServiceTopUp) {
        if (isServiceActionDisabled) return;

        updateDialogVisibility(AI_ENUM, true);
        return;
      }

      if (id !== TOTAL_SIZE) {
        if (dialogVisibility[id]) {
          previousDialogRef.current = true;
        }
      }

      // if (!currentEnabled || id === BACKUP_SERVICE || id === AI_ENUM) {
      //   setIsConfirmDialogVisible(true);
      // } else {
      const raw: ChangeWalletServiceStateRequestDto = {
        service: toWalletService(id),
        enabled: !currentEnabled,
      };

      changeServiceState(id);

      try {
        await paymentApi.changeTenantWalletServiceState({
          changeWalletServiceStateRequestDto: raw,
        });
      } catch (error) {
        console.error(error);
        toastr.error(t("UnexpectedError"));
        changeServiceState(id);
      }
      //}
    };

    const onCloseGracePeriodModal = () => {
      setIsGracePeriodModalVisible(false);
    };

    const onCloseAiService = () => {
      updateDialogVisibility(AI_ENUM, false);
    };

    const onCloseConfirmDialog = () => {
      const isDialogVisible = previousDialogRef.current;
      previousDialogRef.current = false;

      if (isDialogVisible && confirmActionType) {
        updateDialogVisibility(confirmActionType, true);
      }

      setIsConfirmDialogVisible(false);
    };

    const onConfirm = async () => {
      if (!confirmActionType) return;

      const raw: ChangeWalletServiceStateRequestDto = {
        service: toWalletService(confirmActionType),
        enabled: !isCurrentConfirmState,
      };

      setIsConfirmDialogVisible(false);

      if (confirmActionType === BACKUP_SERVICE && !isCardLinkedToPortal) {
        setIsTopUpBalanceVisible(true);
        return;
      }

      changeServiceState(confirmActionType);

      const getSuccessMessage = () => {
        if (confirmActionType === BACKUP_SERVICE) {
          return t("BackupServiceEnabled");
        }
        if (confirmActionType === AI_ENUM) {
          return t("AIToolsEnabled");
        }
      };

      try {
        const result = await paymentApi.changeTenantWalletServiceState({
          changeWalletServiceStateRequestDto: raw,
        });

        if (!result) {
          toastr.error(t("UnexpectedError"));
          changeServiceState(confirmActionType);
          return;
        }

        if (!isCurrentConfirmState) toastr.success(getSuccessMessage());

        if (confirmActionType === AI_ENUM) {
          await getAIConfig?.();
        }
      } catch (error) {
        console.error(error);
        toastr.error(t("UnexpectedError"));
        changeServiceState(confirmActionType);
      }
    };

    const onCloseTopUpModal = (isTopUp: boolean | Event) => {
      setIsTopUpBalanceVisible(false);
      setVisibleWalletSetting(false);
      if (isTopUp) {
        setIsConfirmDialogVisible(true);
      }
    };

    return shouldShowLoader && showPortalSettingsLoader ? (
      <ServicesLoader />
    ) : (
      <>
        <ServicesItems
          onClick={onClick}
          onToggle={onToggle}
          cardDisabled={cardDisabled}
        />
        {isShowStorageTariffDeactivatedModal ? (
          <StorageTariffDeactivated
            visible={isShowStorageTariffDeactivatedModal}
          />
        ) : null}
        {dialogVisibility[TOTAL_SIZE] ? (
          <StoragePlanUpgrade
            visible={dialogVisibility[TOTAL_SIZE]}
            onClose={onClose}
            previousValue={previousValue}
          />
        ) : null}
        {isStorageCancellation ? (
          <StoragePlanCancel
            visible={isStorageCancellation}
            onClose={onCloseStorageCancell}
          />
        ) : null}
        {isGracePeriodModalVisible ? (
          <GracePeriodModal
            visible={isGracePeriodModalVisible}
            onClose={onCloseGracePeriodModal}
          />
        ) : null}
        {dialogVisibility[AI_ENUM] ? (
          <AIServiceDialog
            visible={dialogVisibility[AI_ENUM]}
            onClose={onCloseAiService}
          />
        ) : null}
        {isConfirmDialogVisible && confirmActionType ? (
          <ConfirmationDialog
            visible={isConfirmDialogVisible}
            onClose={onCloseConfirmDialog}
            onConfirm={onConfirm}
            title={getDialogContent(confirmActionType).title}
            bodyText={getDialogContent(confirmActionType).body}
          />
        ) : null}
        {isTopUpBalanceVisible ? (
          <TopUpModal
            visible={isTopUpBalanceVisible}
            onClose={onCloseTopUpModal}
          />
        ) : null}
      </>
    );
  },
);

export default Services;

