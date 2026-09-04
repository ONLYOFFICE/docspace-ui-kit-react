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

