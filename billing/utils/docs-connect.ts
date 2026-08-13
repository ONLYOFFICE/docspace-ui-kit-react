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

import {
  DOCS_CONNECT,
  DOCS_CONNECT_DEVPACK_PRODUCT,
  DOCS_CONNECT_PRODUCT,
} from "../constants";

export type TDocsConnectServiceLike = {
  serviceName?: string | null;
  features?: ({ id?: string | null } | null | undefined)[] | null;
};

const hasProduct = (service: TDocsConnectServiceLike, product: string) =>
  (service.features ?? []).some((feature) => feature?.id === product);

export const isDocsConnectDevPackService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_DEVPACK_PRODUCT);

export const isDocsConnectBaseService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_PRODUCT) &&
  !isDocsConnectDevPackService(service);

export const isDocsConnectService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_PRODUCT) ||
  isDocsConnectDevPackService(service);

export const findDocsConnectServices = <T extends TDocsConnectServiceLike>(
  services: readonly T[] | null | undefined,
) => ({
  base: (services ?? []).find(isDocsConnectBaseService) ?? null,
  devPack: (services ?? []).find(isDocsConnectDevPackService) ?? null,
});

export const isDocsConnectServiceName = (name?: string | null) => {
  const value = (name ?? "").toLowerCase();

  return (
    value.startsWith(DOCS_CONNECT_PRODUCT) || value.startsWith(DOCS_CONNECT)
  );
};

export type TDocsConnectScheduleInput = {
  hasSubscription: boolean;
  currentUsers: number;
  scheduledUsers: number | null;
  scheduledOnDevPack: boolean;
  nextDevPackEnabled: boolean;
};

export type TDocsConnectScheduleFlags = {
  hasScheduledChange: boolean;
  isCancellation: boolean;
  usersAdjusting: boolean;
  devPackDisabling: boolean;
};

export const getDocsConnectScheduleFlags = ({
  hasSubscription,
  currentUsers,
  scheduledUsers,
  scheduledOnDevPack,
  nextDevPackEnabled,
}: TDocsConnectScheduleInput): TDocsConnectScheduleFlags => {
  const hasScheduledChange = hasSubscription && scheduledUsers != null;
  const isCancellation = hasScheduledChange && scheduledUsers === 0;

  return {
    hasScheduledChange,
    isCancellation,
    usersAdjusting: hasScheduledChange && scheduledUsers !== currentUsers,
    devPackDisabling:
      hasScheduledChange &&
      !isCancellation &&
      scheduledOnDevPack &&
      !nextDevPackEnabled,
  };
};
