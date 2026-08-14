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

import { match } from "ts-pattern";

import InfoIcon from "../../assets/info.outline.react.svg";

import PublicRoomBar from "../../components/public-room-bar";
import { Text } from "../../components/text";
import { Link, LinkType } from "../../components/link";
import { Loader, LoaderTypes } from "../../components/loader";

import styles from "./ChatInfoBlock.module.scss";
import { useCommonTranslation } from "../../utils/i18n";

export type ChatInfoBlockProps = {
  standalone: boolean;
  isPortalAdmin: boolean;
  isCardLinkedToPortal?: boolean;
  onActivateAI?: () => void;
  onTopUpAndActivateAI?: () => void;
  onShowAIBenefits?: () => void;
  isActivating?: boolean;
};

export const ChatInfoBlock = ({
  standalone,
  isPortalAdmin,
  onActivateAI,
  // onShowAIBenefits,
  isActivating,
}: ChatInfoBlockProps) => {
  const t = useCommonTranslation();

  const headerText =
    standalone && isPortalAdmin
      ? t("AIFeaturesAreCurrentlyDisabled")
      : t("AIFeaturesNotActive");

  // shared intro for the SaaS admin variants: what AI gives + wallet notice
  const activateIntro = (
    <Text as="span">{`${t("AIDisabledInfoBlockActivateWalletDescription")} `}</Text>
  );

  const bodyText = match([standalone, isPortalAdmin])
    // standalone admin
    .with([true, true], () =>
      t("AIDisabledInfoBlockStandaloneDescription"),
    )
    // saas admin
    .with([false, true], () => (
      <>
        {activateIntro}
        {isActivating ? (
          <Text
            as="span"
            style={{ display: "inline-flex", verticalAlign: "middle" }}
          >
            <Loader type={LoaderTypes.track} size="16px" />
          </Text>
        ) : (
          <>
            <Link
              type={LinkType.action}
              color="accent"
              textDecoration={"underline"}
              onClick={onActivateAI}
            >
              {t("Activate")}
            </Link>
            {/* {" | "}
            <Link
              type={LinkType.action}
              color="accent"
              onClick={onShowAIBenefits}
              textDecoration={"underline"}
            >
              {t("Benefits")}
            </Link> */}
          </>
        )}
      </>
    ))
    // standalone/saas user
    .otherwise(() =>
      t("AIDisabledInfoBlockContactAdminDescription"),
    );

  return (
    <PublicRoomBar
      className={styles.chatInfoBlock}
      headerText={headerText}
      bodyText={bodyText}
      iconName={<InfoIcon />}
      dataTestId="chat-info-block"
    />
  );
};

