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

