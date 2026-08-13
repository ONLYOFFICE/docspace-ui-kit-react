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

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";

import type { TTranslation } from "../../utils/common";

import {
  AI_SEARCH,
  BACKUP_SERVICE,
  DISK_STORAGE,
  DOCS_CONNECT,
  DOCS_CONNECT_ROUTE,
} from "../constants";

export const AI_SERVICES_REDIRECT_URL = "/billing/addons/ai-services";
export const AI_SEARCH_REDIRECT_URL = "/billing/addons/ai-search";
export const DISK_STORAGE_REDIRECT_URL = "/billing/addons/disk-storage";
export const WALLET_REDIRECT_URL = "/billing/wallet";
export const TARIFF_REDIRECT_URL = "/billing/tariff-plan";
export const BACKUP_REDIRECT_URL = "/billing/addons/backup";

export enum PaymentFlavor {
  Tariff = "tariff",
  DocsConnect = "docsConnect",
  Backup = "backup",
  Ai = "ai",
  DiskStorage = "diskStorage",
  Wallet = "wallet",
}

export type TFlavorContent = {
  processingTitle: string;
  processingHint: string;
  activateStepLabel: string;
  successTitle: string;
  successHint: string;
  successButtonLabel: string;
  /** set only when the flavor needs texts different from the wallet ones */
  errorTitle?: string;
  errorHint?: string;
  errorButtonLabel?: string;
  redirectUrl: string;
};

// AI search isn't part of the SDK's TenantWalletService enum yet; the backend
// identifies it by -18.
const AI_SEARCH_WALLET_SERVICE = -18 as TenantWalletService;

export const resolveWalletService = (
  service: string,
): TenantWalletService | null => {
  if (service.includes(AI_SEARCH)) return AI_SEARCH_WALLET_SERVICE;
  if (service.includes("ai")) return TenantWalletService.AITools;
  if (service.includes(DISK_STORAGE)) return TenantWalletService.Storage;
  if (service.includes(BACKUP_SERVICE)) return TenantWalletService.Backup;
  return null;
};

export const resolveWalletServicesToActivate = (
  service: string,
  skipAiSearch: boolean = false,
): TenantWalletService[] => {
  const walletService = resolveWalletService(service);

  if (walletService === null) return [];
  if (walletService === AI_SEARCH_WALLET_SERVICE)
    return [TenantWalletService.AITools, walletService];
  if (walletService === TenantWalletService.AITools && !skipAiSearch)
    return [walletService, AI_SEARCH_WALLET_SERVICE];
  return [walletService];
};

export const resolveDocsConnectParams = ({
  service,
  users,
  add,
  devpack,
}: {
  service: string;
  users: string;
  add: string;
  devpack: string;
}) => {
  const isDocsConnect = service === DOCS_CONNECT;
  const docsConnectUsers = Number(users) || 0;
  const docsConnectAddUsers = Number(add) || docsConnectUsers;
  const withDevPack = devpack === "1" || devpack === "true";

  return { isDocsConnect, docsConnectUsers, docsConnectAddUsers, withDevPack };
};

export const isAIService = (service: string) => service.includes("ai");
export const isBackupService = (service: string) =>
  service.includes(BACKUP_SERVICE);

export const resolveFlavor = (
  service: string,
  admins: string,
): PaymentFlavor => {
  if (admins) return PaymentFlavor.Tariff;
  if (service === DOCS_CONNECT) return PaymentFlavor.DocsConnect;
  if (isBackupService(service)) return PaymentFlavor.Backup;
  if (isAIService(service)) return PaymentFlavor.Ai;
  if (service.includes(DISK_STORAGE)) return PaymentFlavor.DiskStorage;
  return PaymentFlavor.Wallet;
};

export const getFlavorContent = (
  t: TTranslation,
  flavor: PaymentFlavor,
  {
    plan,
    service,
    storage,
  }: { plan: string; service: string; storage: string },
): TFlavorContent => {
  switch (flavor) {
    case PaymentFlavor.Tariff:
      return {
        processingTitle: t("Common:WalletTopUpCallbackProcessingTitle"),
        processingHint: t("Common:WalletTopUpCallbackProcessingHint"),
        activateStepLabel: "",
        successTitle: t("Common:PlanActivated", { planName: plan }),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:GoToTariffPlan"),
        redirectUrl: TARIFF_REDIRECT_URL,
      };
    case PaymentFlavor.DocsConnect:
      return {
        processingTitle: t("Common:DocsConnectCallbackProcessingTitle"),
        processingHint: t("Common:DocsConnectCallbackProcessingHint"),
        activateStepLabel: t("Common:DocsConnectCallbackStepActivate"),
        successTitle: t("Common:DocsConnectCallbackSuccess"),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:DocsConnectCallbackGoTo"),
        errorTitle: t("Common:DocsConnectCallbackErrorTitle"),
        errorHint: t("Common:DocsConnectCallbackErrorHint"),
        errorButtonLabel: t("Common:DocsConnectCallbackGoTo"),
        redirectUrl: DOCS_CONNECT_ROUTE,
      };
    case PaymentFlavor.Backup:
      return {
        processingTitle: t("Common:BackupPaywallCallbackProcessingTitle"),
        processingHint: t("Common:BackupPaywallCallbackProcessingHint"),
        activateStepLabel: t("Common:BackupPaywallCallbackStepActivate"),
        successTitle: t("Common:BackupPaywallCallbackSuccess"),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:GoToAddon"),
        redirectUrl: BACKUP_REDIRECT_URL,
      };
    case PaymentFlavor.Ai:
      return {
        processingTitle: t("Common:WalletTopUpCallbackProcessingTitle"),
        processingHint: t("Common:WalletTopUpCallbackProcessingHint"),
        activateStepLabel: t("Common:AIPaywallCallbackStepActivate"),
        successTitle: t("Common:AIPaywallCallbackActivated"),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:GoToAddon"),
        redirectUrl: service.includes(AI_SEARCH)
          ? AI_SEARCH_REDIRECT_URL
          : AI_SERVICES_REDIRECT_URL,
      };
    case PaymentFlavor.DiskStorage:
      return {
        processingTitle: t("Common:StoragePaywallCallbackProcessingTitle"),
        processingHint: t("Common:StoragePaywallCallbackProcessingHint"),
        activateStepLabel: storage
          ? t("Common:StoragePaywallCallbackStepActivateAmount", { storage })
          : t("Common:StoragePaywallCallbackStepActivate"),
        successTitle: t("Common:StoragePaywallCallbackSuccess"),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:GoToAddon"),
        redirectUrl: DISK_STORAGE_REDIRECT_URL,
      };
    default:
      return {
        processingTitle: t("Common:WalletTopUpCallbackProcessingTitle"),
        processingHint: t("Common:WalletTopUpCallbackProcessingHint"),
        activateStepLabel: "",
        successTitle: t("Common:WalletTopUpSuccessTitle"),
        successHint: t("Common:WalletTopUpCallbackSuccessHint"),
        successButtonLabel: t("Common:WalletTopUpGoToWallet"),
        redirectUrl: WALLET_REDIRECT_URL,
      };
  }
};

