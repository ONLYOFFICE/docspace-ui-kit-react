// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";

import ChatNoAccessRightsDarkIcon from "../../../../assets/emptyview/empty.chat.access.rights.dark.svg";
import ChatNoAccessRightsLightIcon from "../../../../assets/emptyview/empty.chat.access.rights.light.svg";

import { EmptyView } from "../../../../components/empty-view";
import { useTheme } from "../../../../context/ThemeContext";
import { match, P } from "ts-pattern";
import { getCommonTranslation } from "../../../../utils";

type Props = {
  aiReady: boolean;
  standalone: boolean;
  isPortalAdmin: boolean;
  goToAISettings?: () => void;
};

export const ChatNoAccessScreen = ({
  aiReady,
  isPortalAdmin,
  standalone,
  goToAISettings,
}: Props) => {
  const { isBase } = useTheme();

  const icon = isBase ? (
    <ChatNoAccessRightsLightIcon />
  ) : (
    <ChatNoAccessRightsDarkIcon />
  );

  const title =
    isPortalAdmin && standalone
      ? getCommonTranslation("EmptyAIAgentsAIDisabledStandaloneAdminTitle", {
          aiProvider: "AIProvider",
        })
      : getCommonTranslation("AIFeaturesAreCurrentlyDisabled");

  const description = match([standalone, isPortalAdmin])
    // standalone admin
    .with([true, true], () =>
      getCommonTranslation(
        "EmptyAIAgentsAIDisabledStandaloneAdminDescription",
        {
          productName: "ProductName",
          aiChats: "AIChats",
        },
      ),
    )
    // saas admin
    .with([false, true], () =>
      getCommonTranslation("EmptyChatAIDisabledSaasAdminDescription", {
        productName: "ProductName",
      }),
    )
    // standalone/saas user
    .with([P._, false], () =>
      getCommonTranslation("EmptyChatAIDisabledUserDescription", {
        productName: "ProductName",
      }),
    )
    .otherwise(() => "");

  const goToServices = {
    type: "button",
    title: getCommonTranslation("GoToSettings"),
    key: "go-to-services",
    onClick: goToAISettings,
  } as const;

  const goToAIProviderSettings = {
    type: "button",
    title: getCommonTranslation("GoToSettings"),
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
    />
  );
};
