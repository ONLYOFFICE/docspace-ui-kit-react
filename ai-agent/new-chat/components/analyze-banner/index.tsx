"use client";

import { observer } from "mobx-react";

import DocumentIcon from "../../../../assets/icons/16/catalog.documents.react.svg";

import { Text } from "../../../../components/text";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useAiChatStoreOptional } from "../../../providers/ai-chat-store/AiChatStoreProvider";

import styles from "./AnalyzeBanner.module.scss";

/**
 * Names the form an "Analyze responses" chat is about, at the top of the chat
 * for the whole life of the mode.
 *
 * The form is not shown as a chip on the composer in this mode (see
 * `NewChat`): a chip reads as a file the user may take off or swap, while the
 * mode is bound to this one form until the chat is closed or a new one is
 * started. The panel title says which mode is on; this bar says which form.
 */
export const AnalyzeBanner = observer(() => {
  const t = useCommonTranslation();
  const store = useAiChatStoreOptional();

  if (!store?.isAnalyzeMode) return null;

  const fileName = store.analyzeFormTitle;

  return (
    <div className={styles.analyzeBanner} data-testid="analyze-banner">
      <DocumentIcon className={styles.icon} aria-hidden />
      <Text
        fontSize="13px"
        fontWeight={600}
        lineHeight="20px"
        className={styles.text}
        title={fileName}
        truncate
      >
        {t("AnalyzeModeBanner", { fileName })}
      </Text>
    </div>
  );
});

export default AnalyzeBanner;
