import React from "react";

import EmptyScreenRoomSelectorLight from "../../assets/emptyview/empty.room.selector.light.svg";
import EmptyScreenRoomSelectorDark from "../../assets/emptyview/empty.room.selector.dark.svg";

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
import { ServerType } from "../../enums";
import { getServerIcon } from "../../utils/ai/getServerIcon";

export { ServerType };

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

// `tools/list-system-tools` answers either as the legacy flat
// `serverType -> tools` map or as `{ groups, errors, system }`. `groups`
// also carries the registered custom servers' tools, so only the explicit
// `system` list says which names are host-configured servers; deriving that
// from the keys labelled a custom server with the product name and the
// portal logo. Without `system` (an older service) the keys are the best
// available guess.
const normalizeSystemListing = (
  raw: Record<string, unknown> | undefined,
): { groups: Record<string, unknown>; system: string[] } => {
  const nested = raw?.groups;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const groups = nested as Record<string, unknown>;
    const system = Array.isArray(raw?.system)
      ? raw.system.filter((name): name is string => typeof name === "string")
      : Object.keys(groups);
    return { groups, system };
  }
  const groups = raw ?? {};
  return { groups, system: Object.keys(groups) };
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

  const [totalServers, setTotalServers] = React.useState(0);

  const isRequestLoading = React.useRef(false);

  // Servers are keyed by name in the chat-lib model: system servers come from
  // the service config (list-system-tools groups), the rest are portal-level
  // custom servers (list-custom-servers without an entityId).
  const convertServerToOption = React.useCallback(
    (name: string, isSystem: boolean): TSelectorItem => {
      return {
        key: name,
        id: name,
        label: isSystem
          ? `${getBrandName("OrganizationName")} ${getBrandName("ProductName")}`
          : name,
        // portalUrl is left empty on purpose: the resulting "/logo.ashx?..."
        // is relative, so the browser resolves it against the portal origin
        // the app is already served from.
        icon:
          getServerIcon(isSystem ? ServerType.Portal : ServerType.Custom, isBase) ??
          "",
        isMCP: true,
        isSelected: initedSelectedServers?.includes(name),
      };
    },
    [isBase, initedSelectedServers, t],
  );

  const fetchServers = React.useCallback(async () => {
    if (isRequestLoading.current) return;

    isRequestLoading.current = true;
    setIsLoading(true);

    try {
      const [systemTools, customServers] = await Promise.all([
        apiClient.request<Record<string, unknown>>(
          `/api/2.0/ai/tools/list-system-tools`,
        ),
        apiClient.request<Record<string, unknown>>(
          `/api/2.0/ai/tools/list-custom-servers`,
        ),
      ]);

      const listing = normalizeSystemListing(systemTools);
      // A system server that failed tool enumeration (down, misconfigured)
      // still gets a group in the response — just an empty one (the lib's
      // listTools returns [] on error). Hide those: a server with no tools
      // is useless to attach. A name that is also a portal-level custom
      // server is a custom server, whatever the listing says: system
      // servers never appear in the portal's custom map.
      const systemNames = listing.system.filter((name) => {
        if (name in (customServers ?? {})) return false;
        const tools = listing.groups[name];
        return Array.isArray(tools) && tools.length > 0;
      });
      const customNames = Object.keys(customServers ?? {}).filter(
        (name) => !systemNames.includes(name),
      );

      const items = [
        ...systemNames.map((name) => convertServerToOption(name, true)),
        ...customNames.map((name) => convertServerToOption(name, false)),
      ];

      const selectedItems = items.filter((i) => i.isSelected);

      setServers(items);
      setInitedSelectedServersItems(selectedItems);
      setSelectedServers(selectedItems);

      setTotalServers(items.length);
    } catch (e) {
      console.error(e);
    }

    isRequestLoading.current = false;
    setIsLoading(false);
  }, [apiClient, convertServerToOption]);

  // The tools lists are not paginated — everything arrives in one response.
  const fetchMoreServer = React.useCallback(async () => {}, []);

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
