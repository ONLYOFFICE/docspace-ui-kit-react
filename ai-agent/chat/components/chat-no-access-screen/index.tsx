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
import { Trans } from "react-i18next";

import ChatNoAccessRightsDarkIcon from "../../../../assets/emptyview/empty.chat.access.rights.dark.svg";
import ChatNoAccessRightsLightIcon from "../../../../assets/emptyview/empty.chat.access.rights.light.svg";

import { EmptyView } from "../../../../components/empty-view";
import { Text } from "../../../../components/text";
import { Link, LinkType } from "../../../../components/link";
import { useTheme } from "../../../../context/ThemeContext";
import { match, P } from "ts-pattern";
import { useCommonTranslation } from "../../../../utils/i18n";
import { getBrandName } from "../../../../constants/brands";

type Props = {
  aiReady: boolean;
  standalone: boolean;
  isPortalAdmin: boolean;
  isPayer?: boolean;
  walletCustomerEmail?: string | null;
  walletCustomerDisplayName?: string | null;
  goToAISettings?: () => void;
};

export const ChatNoAccessScreen = ({
  aiReady,
  isPortalAdmin,
  standalone,
  isPayer,
  walletCustomerEmail,
  walletCustomerDisplayName,
  goToAISettings,
}: Props) => {
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const icon = isBase ? (
    <ChatNoAccessRightsLightIcon />
  ) : (
    <ChatNoAccessRightsDarkIcon />
  );

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
        productName: getBrandName("ProductName"),
        aiChats: t("AIChats"),
      }),
    )
    // saas admin
    .with([false, true], () => {
      const payerLabel = walletCustomerDisplayName || walletCustomerEmail;

      return (
        <>
          <Text as="span">{t("EmptyAIAgentsNotActiveYetDescription")}</Text>
          <Text as="span" style={{ display: "block", marginTop: "8px" }}>
            {t("EmptyAIAgentsNotActiveYetDescriptionLine2")}
          </Text>
          {!isPayer && payerLabel ? (
            <Text as="span" style={{ display: "block", marginTop: "8px" }}>
              <Trans
                i18nKey="Common:EmptyAIAgentsNotActiveYetContactPayer"
                values={{ payerContact: payerLabel }}
                components={{
                  1:
                    walletCustomerEmail && !walletCustomerDisplayName ? (
                      <Link
                        key="chat-no-access-payer-link"
                        type={LinkType.action}
                        href={`mailto:${walletCustomerEmail}`}
                        color="accent"
                      />
                    ) : (
                      <Text key="chat-no-access-payer-name" as="span" />
                    ),
                }}
              />
            </Text>
          ) : null}
        </>
      );
    })
    // standalone user
    .with([true, false], () =>
      t("EmptyAIAgentsAIDisabledDescription", {
        productName: getBrandName("ProductName"),
        aiAgents: t("AIAgents"),
      }),
    )
    // saas user
    .otherwise(() => (
      <>
        <Text as="span">
          {t("EmptyAIAgentsAIDisabledDescriptionLine1", {
            aiAgents: t("AIAgents"),
          })}
        </Text>
        <Text as="span" style={{ display: "block", marginTop: "8px" }}>
          {t("EmptyAIAgentsAIDisabledDescriptionLine2", {
            productName: getBrandName("ProductName"),
          })}
        </Text>
      </>
    ));

  const goToServices = {
    type: "button",
    title: t("GoToSettings"),
    key: "go-to-services",
    onClick: goToAISettings,
  } as const;

  const goToAIProviderSettings = {
    type: "button",
    title: t("GoToSettings"),
    key: "go-to-ai-provider-settings",
    onClick: goToAISettings,
  } as const;

  const options =
    !isPortalAdmin || !goToAISettings
      ? []
      : standalone
        ? [goToAIProviderSettings]
        : [goToServices];

  return (
    <EmptyView
      title={title}
      description={description}
      icon={icon}
      options={options}
      className="chat-no-access-screen"
    />
  );
};

