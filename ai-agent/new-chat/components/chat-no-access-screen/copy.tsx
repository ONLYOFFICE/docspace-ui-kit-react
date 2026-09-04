import React from "react";
import { match, P } from "ts-pattern";

import { Text } from "../../../../components/text";

type Translate = (key: string, values?: Record<string, unknown>) => string;

export type NoAccessCopyProps = {
  /** Agents section copy ("AI agents"), otherwise the AI chat panel copy. */
  isAgents: boolean;
  standalone: boolean;
  isPortalAdmin: boolean;
  t: Translate;
};

export type NoAccessCopy = {
  title: string;
  description: React.ReactNode;
  /** SaaS only: the OpenRouter/wallet block under the description. */
  showBenefits: boolean;
};

const getAgentsCopy = ({
  standalone,
  isPortalAdmin,
  t,
}: Omit<NoAccessCopyProps, "isAgents">): NoAccessCopy => {
  const title = match([standalone, isPortalAdmin])
    // standalone admin
    .with([true, true], () =>
      t("EmptyAIAgentsAIDisabledStandaloneAdminTitle", {
        aiProvider: t("AIProvider"),
      }),
    )
    // saas (admin + user)
    .with([false, P._], () => t("EmptyAIAgentsNotActiveYetTitle"))
    // standalone user
    .otherwise(() => t("AIFeaturesAreCurrentlyDisabled"));

  const description = match([standalone, isPortalAdmin])
    // standalone admin
    .with([true, true], () =>
      t("EmptyAIAgentsAIDisabledStandaloneAdminDescription", {
        aiChats: t("AIChats"),
      }),
    )
    // saas admin
    .with([false, true], () => (
      <>
        <Text as="span">{t("EmptyAIAgentsNotActiveYetDescription")}</Text>
        <Text as="span" style={{ display: "block", marginTop: "8px" }}>
          {t("EmptyAIAgentsNotActiveYetDescriptionLine2")}
        </Text>
      </>
    ))
    // standalone user
    .with([true, false], () =>
      t("EmptyAIAgentsAIDisabledDescription", {
        aiAgents: t("AIAgents"),
      }),
    )
    // saas user
    .otherwise(() => t("EmptyAIDisabledContactAdminDesc"));

  return { title, description, showBenefits: false };
};

const getChatCopy = ({
  standalone,
  isPortalAdmin,
  t,
}: Omit<NoAccessCopyProps, "isAgents">): NoAccessCopy => {
  const aiChat = t("AIChat");

  const title = standalone
    ? t("EmptyAIChatNotAvailableYetTitle", { aiChat })
    : t("EmptyAIChatNotActiveYetTitle", { aiChat });

  const description = match([standalone, isPortalAdmin])
    // standalone admin: connect an AI service of your own
    .with([true, true], () =>
      t("EmptyAIChatNotAvailableYetAdminDescription", { aiChat }),
    )
    // standalone user: nothing to connect without admin rights
    .with([true, false], () =>
      t("EmptyAIChatNotAvailableYetUserDescription", { aiChat }),
    )
    // saas admin: activation is one click (or a top-up) away
    .with([false, true], () =>
      t("EmptyAIChatNotActiveYetAdminDescription", { aiChat }),
    )
    // saas user
    .otherwise(() => t("EmptyAIChatNotActiveYetUserDescription", { aiChat }));

  // The OpenRouter models / pricing / wallet rows only describe the SaaS
  // offering; a standalone portal pays its own AI provider directly.
  return { title, description, showBenefits: !standalone };
};

export const getNoAccessCopy = ({
  isAgents,
  ...rest
}: NoAccessCopyProps): NoAccessCopy =>
  isAgents ? getAgentsCopy(rest) : getChatCopy(rest);
