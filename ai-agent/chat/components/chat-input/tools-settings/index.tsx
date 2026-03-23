/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import { LoginProvider } from "@onlyoffice/docspace-api-sdk";

import { Portal } from "../../../../../components/portal";

import McpToolReactSvg from "../../../../../assets/mcp.tool.svg";
import WebSearchIcon from "../../../../../assets/web.search.svg";
import LightbulbIcon from "../../../../../assets/lightbulb.svg";
import ManageConnectionsReactSvg from "../../../../../assets/manage.connection.react.svg";

import { ServerType, ChatReasoningEffort } from "../../../../../enums";
import { getOAuthToken } from "../../../../../utils/get-oauth-token";
import { isMobile } from "../../../../../utils";
import { useCommonTranslation } from "../../../../../utils/i18n";
import { getServerIcon } from "../../../../../utils/ai/getServerIcon";
import { useTheme } from "../../../../../context/ThemeContext";

import { Text } from "../../../../../components/text";
import {
  ContextMenu,
  type ContextMenuRefType,
} from "../../../../../components/context-menu";
import { IconButton } from "../../../../../components/icon-button";
import { Aside } from "../../../../../components/aside";
import { Button, ButtonSize } from "../../../../../components/button";
import { Backdrop } from "../../../../../components/backdrop";
import { TooltipContainer } from "../../../../../components/tooltip";

import { useChatStore } from "../../../store/chatStore";
import type useToolsSettings from "../../../hooks/useToolsSettings";

import styles from "../ChatInput.module.scss";
import { Link, LinkType } from "../../../../../components/link";
import { ContextMenuModel } from "../../../../../components/context-menu";
import { useApi } from "../../../../../providers";
import { HelpButton } from "../../../../../components";

const ToolsSettings = ({
  servers,
  MCPTools,
  webSearchAvailable,
  webSearchEnabled,
  isFetched,
  setServers,
  setMCPTools,
  setWebSearchEnabled,
  isAdmin,
  aiReady,
  goToWebSearchSettings,
  thinkingSupported,
  thinkingEnabled,
  setThinkingEnabled,
}: ReturnType<typeof useToolsSettings> & {
  isAdmin?: boolean;
  aiReady: boolean;
  goToWebSearchSettings?: () => void;
}) => {
  const t = useCommonTranslation();
  const { agentId } = useChatStore();
  const { isBase } = useTheme();
  const { aiApi, thirdPartyApi, baseUrl } = useApi();

  const [showManageConnections, setShowManageConnections] =
    React.useState(false);

  const [isMcpToolsVisible, setIsMcpToolsVisible] = React.useState(false);

  const contextMenuRef = React.useRef<ContextMenuRefType>(null);

  const toggleTool = React.useCallback(
    async (mcpId: string, toolId: string) => {
      const countTools = MCPTools.get(mcpId)?.length ?? 0;
      const disabledTools =
        MCPTools.get(mcpId)
          ?.filter((tool) => !tool.enabled)
          .map((tool) => tool.name) ?? [];

      if (toolId === "all_tools") {
        const enabled = disabledTools.length === countTools;
        const newTools =
          MCPTools.get(mcpId)?.map((tool) => ({
            ...tool,
            enabled,
          })) ?? [];

        if (enabled) {
          await aiApi.changeMCPToolsForRoom(Number(agentId), mcpId, []);
        } else {
          await aiApi.changeMCPToolsForRoom(
            Number(agentId),
            mcpId,
            newTools.map((tool) => tool.name),
          );
        }

        setMCPTools(new Map([...MCPTools, [mcpId, newTools]]));
      } else {
        const enabled = disabledTools.includes(toolId);

        const newTools =
          MCPTools.get(mcpId)?.map((tool) => ({
            ...tool,
            enabled: tool.name === toolId ? enabled : tool.enabled,
          })) ?? [];

        setMCPTools(new Map([...MCPTools, [mcpId, newTools]]));

        if (enabled) {
          await aiApi.changeMCPToolsForRoom(
            Number(agentId),
            mcpId,
            disabledTools.filter((tool) => tool !== toolId),
          );
        } else {
          await aiApi.changeMCPToolsForRoom(Number(agentId), mcpId, [
            ...disabledTools,
            toolId,
          ]);
        }
      }
    },
    [MCPTools, agentId, setMCPTools],
  );

  const openOauthWindow = async (serverId: string, type: string) => {
    const url = await thirdPartyApi.getThirdPartyCode(
      type as unknown as LoginProvider,
    );

    const newWindow = window.open(
      "",
      t("Authorization"),
      "height=600, width=1020",
    );

    if (newWindow && typeof url === "string") {
      newWindow.location = url;
    }

    getOAuthToken(newWindow)
      .then(async (token) => {
        if (token) {
          try {
            await aiApi.connectServer(Number(agentId), serverId, token);

            newWindow?.close();

            const newTools = await aiApi.getMCPToolsForRoom(
              Number(agentId),
              serverId,
            );

            if (!newTools) return;

            setMCPTools((prev) => {
              const newMap = new Map(prev);
              newMap.set(serverId, newTools);
              return newMap;
            });
            setServers((prev) => {
              const newServers = [...prev];
              const serverIndex = newServers.findIndex(
                (s) => s.id === serverId,
              );
              newServers[serverIndex].connected = true;
              return newServers;
            });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((e) => console.error(e));
  };

  const disconnectServerAction = async (serverId: string) => {
    try {
      await aiApi.disconnectServer(Number(agentId), serverId);

      setMCPTools((prev) => {
        const newMap = new Map(prev);
        newMap.delete(serverId);
        return newMap;
      });
      setServers((prev) => {
        const newServers = [...prev];
        const serverIndex = newServers.findIndex((s) => s.id === serverId);
        newServers[serverIndex].connected = false;
        return newServers;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const showMcpTools = (e: React.MouseEvent<HTMLElement>) => {
    if (!aiReady || showManageConnections) return;

    setIsMcpToolsVisible(true);
    contextMenuRef.current?.show(e);
  };

  const hideMcpTools = React.useCallback(() => {
    setIsMcpToolsVisible(false);
  }, []);

  const onWebSearchToggle = React.useCallback(() => {
    if (!webSearchAvailable) return;

    aiApi.updateUserChatSettings(Number(agentId), {
      webSearchEnabled: !webSearchEnabled,
    });
    setWebSearchEnabled(!webSearchEnabled);
  }, [
    agentId,
    webSearchEnabled,
    webSearchAvailable,
    setWebSearchEnabled,
    aiApi,
  ]);

  const onThinkingToggle = React.useCallback(() => {
    if (!thinkingSupported) return;

    const newReasoningEffort = !thinkingEnabled
      ? ChatReasoningEffort.Medium
      : ChatReasoningEffort.None;

    aiApi.updateUserChatSettings(Number(agentId), {
      reasoningEffort: newReasoningEffort,
    });
    setThinkingEnabled(!thinkingEnabled);
  }, [agentId, thinkingEnabled, thinkingSupported, setThinkingEnabled, aiApi]);

  const model = React.useMemo(() => {
    const serverItems = Array.from(MCPTools.entries())
      .map(([mcpId, tools]) => {
        const server = servers.find((s) => s.id === mcpId);

        if (!server || server.needReset)
          return {
            key: "",
            label: "",
          };

        const items = [
          {
            key: "all_tools",
            label: "All tools",
            withToggle: true,
            checked: tools.some((tool) => tool.enabled),
            onClick: () => {
              toggleTool(mcpId, "all_tools");
            },
          },
          {
            key: "separator-sub-menu-1",
            isSeparator: true,
          },
          ...tools
            .map((tool) => ({
              key: tool.name,
              label: tool.name,
              withToggle: true,
              checked: tool.enabled,
              onClick: () => {
                toggleTool(mcpId, tool.name);
              },
            }))
            .filter(Boolean),
        ];

        const portalServerName = t("OrganizationName") + " " + t("ProductName");

        const name =
          server.serverType === ServerType.Portal
            ? portalServerName
            : server.name;

        return {
          key: mcpId,
          label: name,
          icon: server.icon?.icon16 ?? "",
          iconNode: getServerIcon(server.serverType, isBase, baseUrl),
          withMCPIcon: true,
          items,
        };
      })
      .filter((i) => i.key);

    const showManageConnectionItem = servers.some(
      (server) =>
        server.serverType !== ServerType.Portal &&
        server.serverType !== ServerType.Custom,
    );

    return [
      {
        key: "web-search",
        label: "Web Search",
        iconNode: <WebSearchIcon />,
        withToggle: true,
        checked: webSearchEnabled && webSearchAvailable,
        onClick: onWebSearchToggle,
        disabled: !webSearchAvailable,
        disabledStylesType: "toggle",
        tooltipTarget: "toggle",
        getTooltipContent: () => (
          <>
            <Text>
              {t("ConnectWebSearch", {
                webSearch: t("WebSearchAI"),
                productName: t("ProductName"),
              })}
            </Text>
            {isAdmin && goToWebSearchSettings ? (
              <Link
                type={LinkType.action}
                isHovered
                fontWeight={600}
                onClick={goToWebSearchSettings}
                dataTestId="go-to-settings-link"
              >
                {t("GoToSettings")}
              </Link>
            ) : null}
          </>
        ),
      },
      {
        key: "extended-thinking",
        label: (
          <div className={styles.extendedThinkingLabel}>
            {t("ExtendedThinking")}{" "}
            {thinkingSupported && (
              <HelpButton
                tooltipContent={
                  <Text>{t("ExtendedThinkingIncreasedCosts")}</Text>
                }
                openOnClick={false}
                tooltipStyle={{ zIndex: 1001 }}
                className={styles.extendedThinkingHelpButton}
              />
            )}
          </div>
        ),
        withToggle: true,
        checked: thinkingEnabled && thinkingSupported,
        onClick: onThinkingToggle,
        iconNode: <LightbulbIcon />,
        disabled: !thinkingSupported,
        disabledStylesType: "toggle",
        tooltipTarget: "toggle",
        getTooltipContent: () =>
          !thinkingSupported ? (
            <Text>{t("ExtendedThinkingNotSupported")}</Text>
          ) : null,
      },
      ...(showManageConnectionItem || serverItems.length > 0
        ? [{ key: "separator-1", isSeparator: true }]
        : []),
      ...serverItems,
      ...(serverItems.length > 0 && showManageConnectionItem
        ? [{ key: "separator-2", isSeparator: true }]
        : []),
      ...(showManageConnectionItem
        ? [
            {
              key: "manage-connections",
              label: t("ManageConnection"),
              onClick: () => {
                setShowManageConnections(true);
              },
              iconNode: <ManageConnectionsReactSvg />,
              disabled: !showManageConnectionItem,
              getTooltipContent: () => (
                <Text>
                  {t("ConnectMCPServers", {
                    mcpServers: t("MCPSettingTitle"),
                  })}
                </Text>
              ),
            },
          ]
        : []),
    ] as ContextMenuModel[];
  }, [
    MCPTools,
    isBase,
    isAdmin,
    servers,
    toggleTool,
    webSearchEnabled,
    webSearchAvailable,
    goToWebSearchSettings,
    onWebSearchToggle,
    thinkingEnabled,
    thinkingSupported,
    onThinkingToggle,
  ]);

  if (!isFetched) return;

  return (
    <>
      <TooltipContainer
        as="div"
        title={t("AIToolsHint")}
        className={classNames(
          styles.chatInputButton,
          styles.chatInputToolsButton,
          {
            [styles.activeChatInputButton]: isMcpToolsVisible,
            [styles.disabled]: !aiReady,
          },
        )}
        onClick={showMcpTools}
        data-testid="chat-input-tools-button"
        aria-disabled={!aiReady}
      >
        <IconButton iconNode={<McpToolReactSvg />} size={16} isFill={false} />
        <Text lineHeight="16px" fontSize="13px" fontWeight={600} noSelect>
          {t("Tools")}
        </Text>
        <ContextMenu
          ref={contextMenuRef}
          model={model}
          onHide={hideMcpTools}
          maxHeightLowerSubmenu={360}
          showDisabledItems
          withBackdrop={isMobile()}
          headerOnlyMobile
          withoutBackHeaderButton
          dataTestId="chat-input-tools-context-menu"
        />
      </TooltipContainer>
      {showManageConnections ? (
        <Portal
          visible
          element={
            <>
              <Aside
                header={t("ManageConnection")}
                onClose={() => setShowManageConnections(false)}
                visible={showManageConnections}
              >
                <div className={styles.toolSettingsWrapper}>
                  {servers.map((server) => {
                    if (
                      server.serverType === ServerType.Portal ||
                      server.serverType === ServerType.Custom
                    )
                      return null;

                    return (
                      <div key={server.id} className={styles.toolSettingsItem}>
                        <div className={styles.toolSettingsItemInfo}>
                          {server.icon?.icon16 ? (
                            <img src={server.icon.icon16} alt={server.name} />
                          ) : (
                            getServerIcon(server.serverType, isBase, baseUrl)
                          )}

                          <Text
                            fontSize="14px"
                            lineHeight="16px"
                            fontWeight={600}
                          >
                            {server.name}
                          </Text>
                        </div>
                        <Button
                          label={
                            server.connected ? t("Disconnect") : t("Connect")
                          }
                          size={ButtonSize.small}
                          onClick={() => {
                            if (server.connected) {
                              disconnectServerAction(server.id);
                            } else {
                              openOauthWindow(server.id, server.name);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </Aside>
              <Backdrop
                isAside
                onClick={() => setShowManageConnections(false)}
                visible={showManageConnections}
                withBackground
              />
            </>
          }
        />
      ) : null}
    </>
  );
};

export default observer(ToolsSettings);
