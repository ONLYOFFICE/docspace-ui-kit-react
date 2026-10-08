import React from "react";

import AiAgentsEmptyDarkIcon from "../../../../assets/emptyview/empty.ai-agents.icon.dark.svg";
import AiAgentsEmptyLightIcon from "../../../../assets/emptyview/empty.ai-agents.icon.light.svg";

import { EmptyView } from "../../../../components/empty-view";
import { useTheme } from "../../../../context/ThemeContext";
import { useCommonTranslation } from "../../../../utils/i18n";

import { ChatAiBenefits } from "../chat-ai-benefits";
import { getNoAccessCopy } from "./copy";

export type ChatNoAccessScreenProps = {
  standalone: boolean;
  isPortalAdmin: boolean;
  /** Agents section wording; the AI chat panel gets the chat wording instead. */
  isAgents?: boolean;
  isCardLinkedToPortal?: boolean;
  goToAISettings?: () => void;
  onActivateAI?: () => void;
  onTopUpAndActivateAI?: () => void;
  isActivating?: boolean;
  aiToolsFeePercent?: string | null;
};

export const ChatNoAccessScreen = ({
  isPortalAdmin,
  standalone,
  isAgents = false,
  isCardLinkedToPortal,
  goToAISettings,
  onActivateAI,
  onTopUpAndActivateAI,
  isActivating,
  aiToolsFeePercent,
}: ChatNoAccessScreenProps) => {
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const icon = isBase ? <AiAgentsEmptyLightIcon /> : <AiAgentsEmptyDarkIcon />;

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

  const getSaasAdminOptions = () => {
    if (!activateOrTopUpAI.onClick) return [];
    return [activateOrTopUpAI];
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
      extraContent={
        showBenefits ? (
          <ChatAiBenefits serviceFeePercent={aiToolsFeePercent} />
        ) : null
      }
      className="chat-no-access-screen"
    />
  );
};
