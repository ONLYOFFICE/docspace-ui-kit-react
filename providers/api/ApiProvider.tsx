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

"use client";

import React from "react";
import axios, { type AxiosInstance } from "axios";
import socket from "../../utils/socket";

import {
  Configuration,
  ProfilesApi,
  CommonSettingsApi,
  FoldersApi,
  RoomsApi,
  FilesApi,
  FilesSettingsApi,
  GroupApi,
  PeopleSearchApi,
  SearchApi,
  OperationsApi,
  ThirdPartyApi,
  PaymentApi,
  PortalQuotaApi,
} from "@onlyoffice/docspace-api-sdk";
import { AiApi } from "../../api/ai";

export type TApiProvider = {
  children: React.ReactNode;
  url: string;
  apiKey: string;
  socketPath?: string;
  initSocket?: boolean;
  /** When true, rawApiClient sends Authorization with Bearer prefix (needed in Storybook). */
  useBearerForRawClient?: boolean;
};

export const createApiClient = (
  basePath: string,
  apiKey: string,
  addBearerPrefix = true,
) => {
  const instance: AxiosInstance = axios.create({
    baseURL: basePath,
    headers: {
      Authorization: addBearerPrefix ? `Bearer ${apiKey}` : apiKey,
    },
  });

  const request = async <T = unknown,>(path: string): Promise<T> => {
    const { data } = await instance.get(path);
    return data;
  };

  return { instance, request };
};

export type TApiClient = ReturnType<typeof createApiClient>;

export type TApiContext = {
  profilesApi: ProfilesApi;
  commonSettingsApi: CommonSettingsApi;
  foldersApi: FoldersApi;
  roomsApi: RoomsApi;
  filesApi: FilesApi;
  filesSettingsApi: FilesSettingsApi;
  groupApi: GroupApi;
  peopleSearchApi: PeopleSearchApi;
  groupSearchApi: SearchApi;
  operationsApi: OperationsApi;
  apiClient: TApiClient;
  rawApiClient: TApiClient;
  baseUrl: string;
  aiApi: AiApi;
  thirdPartyApi: ThirdPartyApi;
  paymentApi: PaymentApi;
  portalQuotaApi: PortalQuotaApi;
};

const ApiContext = React.createContext<TApiContext | null>(null);

export const useApi = () => {
  const context = React.useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
};

const ApiProvider = ({
  children,
  url,
  apiKey,
  initSocket = true,
  useBearerForRawClient = false,
}: TApiProvider) => {
  const value = React.useMemo(() => {
    const authHeader = `Bearer ${apiKey}`;
    const baseOptions = {
      headers: {
        Authorization: authHeader,
      },
    } as const;

    const params = apiKey
      ? { apiKey: authHeader, accessToken: apiKey, baseOptions }
      : {};

    const configuration = new Configuration({
      basePath: url,
      ...params,
    });

    return {
      profilesApi: new ProfilesApi(configuration),
      commonSettingsApi: new CommonSettingsApi(configuration),
      foldersApi: new FoldersApi(configuration),
      roomsApi: new RoomsApi(configuration),
      filesApi: new FilesApi(configuration),
      filesSettingsApi: new FilesSettingsApi(configuration),
      groupApi: new GroupApi(configuration),
      peopleSearchApi: new PeopleSearchApi(configuration),
      groupSearchApi: new SearchApi(configuration),
      operationsApi: new OperationsApi(configuration),
      apiClient: createApiClient(url, apiKey),
      rawApiClient: createApiClient(url, apiKey, useBearerForRawClient),
      baseUrl: url,
      thirdPartyApi: new ThirdPartyApi(configuration),
      paymentApi: new PaymentApi(configuration),
      portalQuotaApi: new PortalQuotaApi(configuration),
      aiApi: new AiApi({
        basePath: url,
        apiKey,
      }),
    };
  }, [url, apiKey]);

  React.useEffect(() => {
    if (!initSocket) return;

    const initFunc = async () => {
      let socketPath;

      try {
        const settingsRes = await value.commonSettingsApi.getPortalSettings();
        socketPath = settingsRes?.data?.response?.socketUrl;
      } catch (e) {
        console.error(e);
      }

      const socketUrl = new URL(socketPath ?? "/socket.io", url).toString();
      socket?.connect(socketUrl, "", apiKey);
    };

    initFunc();
  }, [initSocket, url, apiKey, socket]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export default ApiProvider;

