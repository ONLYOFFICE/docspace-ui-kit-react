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
