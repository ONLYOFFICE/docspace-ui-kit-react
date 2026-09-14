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

"use client";

import { observer } from "mobx-react";

import AnalyzeIllustration from "../../../../assets/analyzeResponsesIllustration.svg";

import { Text } from "../../../../components/text";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useAiChatStoreOptional } from "../../../providers/ai-chat-store/AiChatStoreProvider";

import styles from "./AnalyzeIntro.module.scss";

/**
 * The analyze mode's own opening, shown above the generated chips in place of
 * the ordinary welcome intro: which mode the chat is in, which form it is
 * about, and that other files stay out of it.
 *
 * The widget draws this only while the thread is empty and at least one chip
 * exists (`WidgetConfig.suggestionsHeader`), so it introduces the first
 * question rather than standing for the whole conversation.
 */
export const AnalyzeIntro = observer(() => {
  const t = useCommonTranslation();
  const store = useAiChatStoreOptional();

  if (!store?.isAnalyzeMode) return null;

  const fileName = store.analyzeFormTitle;

  return (
    <div className={styles.analyzeIntro} data-testid="analyze-intro">
      <AnalyzeIllustration className={styles.illustration} />
      <Text fontSize="13px" fontWeight="600" lineHeight="16px" noSelect>
        {t("AnalyzeResponsesMode")}
      </Text>
      <Text
        fontSize="12px"
        lineHeight="16px"
        className={styles.hint}
        title={fileName}
        noSelect
      >
        {t("AnalyzeModeSuggestionsHeader", { fileName })}
      </Text>
    </div>
  );
});

export default AnalyzeIntro;
