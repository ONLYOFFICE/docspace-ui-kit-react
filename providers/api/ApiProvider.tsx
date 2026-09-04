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

