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

import { Heading, HeadingLevel } from "../../../../components/heading";
import { Text } from "../../../../components/text";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useAiChatStoreOptional } from "../../../providers/ai-chat-store/AiChatStoreProvider";

import styles from "./AnalyzeIntro.module.scss";

/**
 * The analyze mode's own opening, shown above the generated chips in place of
 * the ordinary welcome intro: which mode the chat is in, which form it is
 * about, and that other files stay out of it.
 *
 * The widget draws this while the thread is empty
 * (`WidgetConfig.suggestionsHeader`), whether or not any chip is there — which
 * is what this mode needs: the questions are generated on the server and the
 * block has to name the mode through the whole wait, with nothing under it.
 * Once the first message goes out the thread is no longer empty and the panel
 * title carries the mode alone.
 */
export const AnalyzeIntro = observer(() => {
  const t = useCommonTranslation();
  const store = useAiChatStoreOptional();

  if (!store?.isAnalyzeMode) return null;

  const fileName = store.analyzeFormTitle;

  return (
    <div className={styles.analyzeIntro} data-testid="analyze-intro">
      <AnalyzeIllustration className={styles.illustration} />
      {/* One block, so the container's gap separates the artwork from the
          copy exactly as it does in the welcome intro. */}
      <div className={styles.copy}>
        {/* A heading, not styled text: this names the state the chat is in,
            and the line under it belongs to it. */}
        <Heading
          level={HeadingLevel.h3}
          fontSize="14px"
          fontWeight={600}
          lineHeight="20px"
          className={styles.title}
          noSelect
        >
          {t("AnalyzeResponsesMode")}
        </Heading>
        <Text
          fontSize="12px"
          lineHeight="16px"
          className={`${styles.text} ${styles.hint}`}
          title={fileName}
          noSelect
        >
          {t("AnalyzeModeSuggestionsHeader", { fileName })}
        </Text>
      </div>
    </div>
  );
});

export default AnalyzeIntro;
