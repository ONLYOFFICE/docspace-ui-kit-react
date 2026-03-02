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
  ThirdPartyApi,
} from "@onlyoffice/docspace-api-sdk";
import { AiApi } from "../../api/ai";

export type TApiProvider = {
	children: React.ReactNode;
	url: string;
	apiKey: string;
  socketPath?: string;
  initSocket?: boolean;
};

export const createApiClient = (basePath: string, apiKey: string) => {
	const instance: AxiosInstance = axios.create({
		baseURL: basePath,
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	const request = async <T = unknown>(path: string): Promise<T> => {
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
	apiClient: TApiClient;
	baseUrl: string;
  aiApi: AiApi;
  thirdPartyApi: ThirdPartyApi;
};

const ApiContext = React.createContext<TApiContext | null>(null);

export const useApi = () => {
	const context = React.useContext(ApiContext);

	if (!context) {
		throw new Error("useApi must be used within an ApiProvider");
	}

	return context;
};

const ApiProvider = ({ children, url, apiKey, initSocket = true }: TApiProvider) => {
	const value = React.useMemo(() => {
		const authHeader = `Bearer ${apiKey}`;
		const baseOptions = {
			headers: {
				Authorization: authHeader,
			},
		} as const;

		const configuration = new Configuration({
			basePath: url,
			apiKey: authHeader,
			accessToken: apiKey,
			baseOptions,
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
			apiClient: createApiClient(url, apiKey),
      thirdPartyApi: new ThirdPartyApi(configuration),
			baseUrl: url,
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
