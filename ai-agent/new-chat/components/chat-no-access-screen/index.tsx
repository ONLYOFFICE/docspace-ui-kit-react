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

import ChatNoAccessRightsDarkIcon from "../../../../assets/emptyview/empty.ai-agents.icon.dark.svg";
import ChatNoAccessRightsLightIcon from "../../../../assets/emptyview/empty.ai-agents.icon.light.svg";

import { EmptyView } from "../../../../components/empty-view";
import { useTheme } from "../../../../context/ThemeContext";
import { useCommonTranslation } from "../../../../utils/i18n";

import { ChatAiBenefits } from "../chat-ai-benefits";
import { getNoAccessCopy } from "./copy";

export type ChatNoAccessScreenProps = {
  aiReady: boolean;
  standalone: boolean;
  isPortalAdmin: boolean;
  /** Agents section wording; the AI chat panel gets the chat wording instead. */
  isAgents?: boolean;
  isCardLinkedToPortal?: boolean;
  goToAISettings?: () => void;
  onActivateAI?: () => void;
  onTopUpAndActivateAI?: () => void;
  onShowAIBenefits?: () => void;
  isActivating?: boolean;
};

export const ChatNoAccessScreen = ({
  aiReady,
  isPortalAdmin,
  standalone,
  isAgents = false,
  isCardLinkedToPortal,
  goToAISettings,
  onActivateAI,
  onTopUpAndActivateAI,
  onShowAIBenefits,
  isActivating,
}: ChatNoAccessScreenProps) => {
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const icon = isBase ? (
    <ChatNoAccessRightsLightIcon />
  ) : (
    <ChatNoAccessRightsDarkIcon />
  );

  const { title, description, showBenefits } = getNoAccessCopy({
    isAgents,
    standalone,
    isPortalAdmin,
    t,
  });

  const goToAIProviderSettings = {
    type: "button",
    title: t("GoToSettings"),
    key: "go-to-ai-provider-settings",
    onClick: goToAISettings,
  } as const;

  // saas admin: activate AI right away (or top up first) + show benefits.
  // The actual logic lives on the client and is passed in via callbacks.
  const activateOrTopUpAI = isCardLinkedToPortal
    ? ({
        type: "button",
        title: t("Activate"),
        key: "activate-ai",
        onClick: onActivateAI,
        isLoading: isActivating,
      } as const)
    : ({
        type: "button",
        title: t("TopUpAndActivate"),
        key: "top-up-and-activate-ai",
        onClick: onTopUpAndActivateAI,
      } as const);

  // const aiBenefits = {
  //   type: "button",
  //   title: t("Benefits"),
  //   key: "ai-benefits",
  //   primary: false,
  //   onClick: onShowAIBenefits,
  // } as const;

  const getSaasAdminOptions = () => {
    if (!activateOrTopUpAI.onClick) return [];
    return [activateOrTopUpAI]; // aiBenefits
  };

  const options = !isPortalAdmin
    ? []
    : standalone
      ? goToAISettings
        ? [goToAIProviderSettings]
        : []
      : getSaasAdminOptions();

  return (
    <EmptyView
      title={title}
      description={description}
      icon={icon}
      options={options}
      extraContent={showBenefits ? <ChatAiBenefits /> : null}
      className="chat-no-access-screen"
    />
  );
};

