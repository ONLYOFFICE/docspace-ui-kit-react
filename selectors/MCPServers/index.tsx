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

import React from "react";

import EmptyScreenRoomSelectorLight from "../../assets/emptyview/empty.room.selector.light.svg";
import EmptyScreenRoomSelectorDark from "../../assets/emptyview/empty.room.selector.dark.svg";
import faviconUrl from "../../assets/favicon.ico";

import { useCommonTranslation } from "../../utils/i18n";
import {
  Selector,
  RowLoader,
  type TSelectorItem,
  type TSelectorWithAside,
} from "../../components/selector";
import { useTheme } from "../../context/ThemeContext";
import { useApi } from "../../providers/api/ApiProvider";
import { getBrandName } from "../../constants/brands";

const getServerIcon = (type: ServerType, _isBase: boolean) => {
  switch (type) {
    case ServerType.Portal:
      return faviconUrl;
    default:
      return null;
  }
};

export enum ServerType {
  Custom,
  Portal,
  GitHub,
  Box,
}

export type TServer = {
  id: string;
  name: string;
  serverType: ServerType;
  description?: string;
  icon?: {
    icon48: string;
    icon32: string;
    icon24: string;
    icon16: string;
  };
  enabled?: boolean;
  connected?: boolean;
  headers: Record<string, string>;
  endpoint: string;
  authorizationEndpoint?: string;
  needReset?: boolean;
};

type MCPServersSelectorProps = TSelectorWithAside & {
  onSubmit: (servers: TSelectorItem[]) => void;
  onBackClick: VoidFunction;

  initedSelectedServers?: string[];
};

const MCPServersSelector = ({
  initedSelectedServers,
  onSubmit,
  onClose,
  onBackClick,
  useAside,
  withoutBackground,
  withBlur,
}: MCPServersSelectorProps) => {
  const t = useCommonTranslation();
  const { apiClient } = useApi();
  const { isBase } = useTheme();

  const [servers, setServers] = React.useState<TSelectorItem[]>([]);
  const [selectedServers, setSelectedServers] = React.useState<TSelectorItem[]>(
    [],
  );
  const [initedSelectedServersItems, setInitedSelectedServersItems] =
    React.useState<TSelectorItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const startCurrentIndexRef = React.useRef(0);
  const [totalServers, setTotalServers] = React.useState(0);

  const isRequestLoading = React.useRef(false);

  const convertServerToOption = React.useCallback(
    (server: TServer): TSelectorItem => {
      const name =
        server.serverType === ServerType.Portal
          ? `${getBrandName("OrganizationName")} ${getBrandName("ProductName")}`
          : server.name;

      return {
        key: server.id,
        id: server.id,
        label: name,
        icon:
          (server.icon?.icon32 || getServerIcon(server.serverType, isBase)) ??
          "",
        isMCP: true,
        isSelected: initedSelectedServers?.includes(server.id),
        isDisabled: server.needReset,
      };
    },
    [isBase, initedSelectedServers, t],
  );

  const fetchServers = React.useCallback(async () => {
    if (isRequestLoading.current) return;

    isRequestLoading.current = true;
    setIsLoading(true);

    try {
      const response = await apiClient.request<{
        response: TServer[];
        total: number;
      }>(`/api/2.0/ai/servers/available?startIndex=0&count=100`);

      const items = response.response.map(convertServerToOption);

      const selectedItems = items.filter((i) => i.isSelected);

      setServers(items);
      setInitedSelectedServersItems(selectedItems);
      setSelectedServers(selectedItems);

      setTotalServers(response.total);
      startCurrentIndexRef.current = 100;
    } catch (e) {
      console.error(e);
    }

    isRequestLoading.current = false;
    setIsLoading(false);
  }, [apiClient, convertServerToOption]);

  const fetchMoreServer = React.useCallback(async () => {
    if (isRequestLoading.current) return;
    isRequestLoading.current = true;

    try {
      const response = await apiClient.request<{
        response: TServer[];
        total: number;
      }>(
        `/api/2.0/ai/servers/available?startIndex=${startCurrentIndexRef.current}&count=100`,
      );

      const items = response.response.map(convertServerToOption);

      setServers((prev) => [...prev, ...items]);

      const selectedItems = items.filter((i) => i.isSelected);

      setInitedSelectedServersItems((prev) => [...prev, ...selectedItems]);
      setSelectedServers((prev) => [...prev, ...selectedItems]);

      startCurrentIndexRef.current += 100;
      setTotalServers(response.total);
    } catch (e) {
      console.error(e);
    }

    isRequestLoading.current = false;
    setIsLoading(false);
  }, [apiClient, convertServerToOption]);

  const onSelect = (item: TSelectorItem) => {
    const isIncluded = selectedServers.some((i) => i.id === item.id);

    if (isIncluded) {
      setSelectedServers((prev) => prev.filter((id) => id.id !== item.id));
    } else {
      setSelectedServers((prev) => [...prev, item]);
    }
  };

  const onSubmitAction = () => {
    onSubmit(selectedServers);
    onBackClick();
  };

  const withAsideProps: TSelectorWithAside = useAside
    ? { useAside, onClose, withBlur, withoutBackground }
    : {};

  React.useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  return (
    <Selector
      items={servers}
      emptyScreenImage={
        isBase ? (
          <EmptyScreenRoomSelectorLight />
        ) : (
          <EmptyScreenRoomSelectorDark />
        )
      }
      emptyScreenHeader={t("NoMCPServers", {
        mcpServers: t("MCPSettingTitle"),
      })}
      emptyScreenDescription={t("NoMCPServersDescription", {
        mcpServers: t("MCPSettingTitle"),
        productName: getBrandName("ProductName"),
        aiAgent: t("AIAgent"),
      })}
      searchEmptyScreenImage={
        isBase ? (
          <EmptyScreenRoomSelectorLight />
        ) : (
          <EmptyScreenRoomSelectorDark />
        )
      }
      searchEmptyScreenHeader={t("NotFoundTitle")}
      searchEmptyScreenDescription={t("SearchEmptyRoomsDescription")}
      submitButtonLabel={t("AddButton")}
      disableSubmitButton={false}
      onSubmit={onSubmitAction}
      rowLoader={<RowLoader />}
      hasNextPage={servers.length < totalServers}
      isNextPageLoading={false}
      totalItems={totalServers}
      loadNextPage={fetchMoreServer}
      isLoading={isLoading}
      isMultiSelect
      {...withAsideProps}
      onSelect={onSelect}
      withHeader
      headerProps={{
        headerLabel: t("AvailableMCPServers", {
          mcpServers: t("MCPSettingTitle"),
        }),
        withoutBackButton: false,
        onBackClick: onBackClick,
        onCloseClick: onClose ?? onBackClick,
        withoutBorder: false,
      }}
      withCancelButton
      cancelButtonLabel={t("CancelButton")}
      onCancel={onBackClick}
      selectedItems={initedSelectedServersItems}
    />
  );
};

export default MCPServersSelector;
