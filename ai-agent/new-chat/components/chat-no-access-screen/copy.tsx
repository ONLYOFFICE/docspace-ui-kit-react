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
import { match, P } from "ts-pattern";

import { getBrandName } from "../../../../constants/brands";
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
  const productName = getBrandName("ProductName");

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
      t("EmptyAIChatNotAvailableYetUserDescription", { aiChat, productName }),
    )
    // saas admin: activation is one click (or a top-up) away
    .with([false, true], () =>
      t("EmptyAIChatNotActiveYetAdminDescription", { aiChat }),
    )
    // saas user
    .otherwise(() =>
      t("EmptyAIChatNotActiveYetUserDescription", { aiChat, productName }),
    );

  // The OpenRouter models / pricing / wallet rows only describe the SaaS
  // offering; a standalone portal pays its own AI provider directly.
  return { title, description, showBenefits: !standalone };
};

export const getNoAccessCopy = ({
  isAgents,
  ...rest
}: NoAccessCopyProps): NoAccessCopy =>
  isAgents ? getAgentsCopy(rest) : getChatCopy(rest);
