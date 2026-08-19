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
import { useTranslation } from "react-i18next";

import AiIllustration from "../../assets/aIIllustration.svg";

import { Text } from "../../components/text";

import styles from "./ChatIntro.module.scss";

/**
 * Illustration + tagline shown at the very top of a new (empty) chat, above
 * the suggestion chips. Handed to the chat library through
 * `WidgetConfig.suggestionsHeader` (see the `ai-agent/providers` widget
 * config), so the library renders it inside its own thread layout — and,
 * like the chips, only while the chat is empty.
 */
export const ChatIntro = () => {
  const { t } = useTranslation("Common");

  return (
    <div className={styles.chatIntro} data-testid="chat-intro">
      <AiIllustration className={styles.illustration} />
      <Text
        fontSize="13px"
        fontWeight="600"
        lineHeight="16px"
        className={styles.text}
        noSelect
      >
        {t("WelcomeAiChatTitle")}
      </Text>
    </div>
  );
};

