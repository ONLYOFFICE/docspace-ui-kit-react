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

import CrossIcon from "../../assets/icons/12/cross.react.svg";
import AiAgentsIcon from "../../assets/icons/16/ai-agents.svg";

import { Text } from "../../components/text";
import { Link, LinkType } from "../../components/link";
import { IconButton } from "../../components/icon-button";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";

import "./RecomendedModel.scss";

export type RecomendedModelProps = {
  isAdmin: boolean;
  isChat: boolean;
  selectedModel: string;
  /**
   * Whether the recommended model can be selected right here — the host's
   * call, because where it may come from differs per portal: OpenRouter on a
   * standalone installation, the portal's own (billed) AI on SaaS. Only the
   * non-chat states branch on it: available turns the notice into "select it",
   * otherwise it explains that the model has to be connected first.
   */
  isAvailable?: boolean;
  recomendedModel: string;
  onClose?: () => void;
  onOpenSettings?: () => void;
  onOpenEdit?: () => void;
  onSelectModel?: () => void;
};

export const RecomendedModel = ({
  isAdmin,
  isChat,
  selectedModel,
  isAvailable,
  recomendedModel,
  onClose,
  onOpenSettings,
  onOpenEdit,
  onSelectModel,
}: RecomendedModelProps) => {
  const t = useCommonTranslation();

  // The recommended model is already selected — nothing to recommend.
  if (selectedModel === recomendedModel) return null;

  const isRecomendedAvailable = !!isAvailable;

  // Chat states (branch by role only).
  const isChatAdminState = isChat && isAdmin;
  const isChatUserState = isChat && !isAdmin;

  // Non-chat states.
  const isSelectModelState = !isChat && isRecomendedAvailable;
  const isNotAvailableAdminState = !isChat && !isRecomendedAvailable && isAdmin;
  const isNotAvailableUserState = !isChat && !isRecomendedAvailable && !isAdmin;

  let title = t("RecommendedModelNotAvailableTitle");
  if (isChatAdminState) title = t("RecommendedModelChatTitle");
  else if (isChatUserState) title = t("RecommendedModelChatNotSelectedTitle");
  else if (isSelectModelState) title = t("RecommendedModelNotSelectedTitle");

  return (
    <div className="recomendedModel">
      <div className="recomendedModel-header">
        <div className="recomendedModel-header-title">
          <AiAgentsIcon />
          <Text fontSize="12px" lineHeight="16px" isBold>
            {title}
          </Text>
        </div>
        {onClose ? (
          <IconButton size={12} iconNode={<CrossIcon />} onClick={onClose} />
        ) : null}
      </div>

      {isChatAdminState ? (
        <Text fontSize="12px" lineHeight="16px">
          <CommonTrans
            i18nKey="RecommendedModelChatAdminDescription"
            values={{ model: recomendedModel }}
          />
        </Text>
      ) : null}

      {isChatUserState ? (
        <Text fontSize="12px" lineHeight="16px">
          <CommonTrans
            i18nKey="RecommendedModelChatUserDescription"
            values={{ model: recomendedModel }}
          />
        </Text>
      ) : null}

      {isSelectModelState ? (
        <Text fontSize="12px" lineHeight="16px">
          <CommonTrans
            i18nKey="RecommendedModelSelectDescription"
            values={{ model: recomendedModel }}
          />
        </Text>
      ) : null}

      {isNotAvailableAdminState ? (
        <Text fontSize="12px" lineHeight="16px">
          <CommonTrans
            i18nKey="RecommendedModelNotAvailableAdminDescription"
            values={{ model: recomendedModel }}
          />
        </Text>
      ) : null}

      {isNotAvailableUserState ? (
        <Text fontSize="12px" lineHeight="16px">
          <CommonTrans
            i18nKey="RecommendedModelNotAvailableUserDescription"
            values={{ model: recomendedModel }}
          />
        </Text>
      ) : null}

      {isChatAdminState ? (
        <Link
          type={LinkType.action}
          fontSize="12px"
          lineHeight="16px"
          isHovered
          onClick={onOpenEdit}
        >
          {t("OpenAgentSettings")}
        </Link>
      ) : null}

      {isSelectModelState ? (
        <Link
          type={LinkType.action}
          fontSize="12px"
          lineHeight="16px"
          isHovered
          onClick={onSelectModel}
        >
          {t("SelectModel")}
        </Link>
      ) : null}

      {isNotAvailableAdminState ? (
        <Link
          type={LinkType.action}
          fontSize="12px"
          lineHeight="16px"
          isHovered
          onClick={onOpenSettings}
        >
          {t("OpenAISettings")}
        </Link>
      ) : null}
    </div>
  );
};

export default RecomendedModel;

