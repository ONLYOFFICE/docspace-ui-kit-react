import React, { useCallback, useEffect } from "react";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { useTheme } from "../../../context/ThemeContext";
import { Zendesk } from "../zendesk";
import { zendeskAPI } from "../zendesk/Zendesk.utils";
import { ArticleZendeskProps } from "../Article.types";

import { useCommonTranslation, getTranslationReady } from "../../../utils";

const baseConfig = {
  webWidget: {
    zIndex: 201,
    chat: {
      menuOptions: { emailTranscript: false },
    },
  },
};

/**
 * Loads the Zendesk widget and keeps its settings in step with the app. The
 * widget's own launcher stays hidden throughout: the app draws the Support
 * button itself, so that it can be sized and placed with the rest of the
 * floating corner stack, and opens the chat through this component's API.
 */
const ArticleLiveChat = ({
  languageBaseName,
  zendeskEmail,
  chatDisplayName,
  zendeskKey,
  isShowLiveChat,
}: ArticleZendeskProps) => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();
  const { currentColorScheme } = useTheme();
  const { isRTL } = useInterfaceDirection();

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "setLocale", languageBaseName);

    if (ready)
      zendeskAPI.addChanges("webWidget", "updateSettings", {
        launcher: {
          label: {
            "*": t("Support"),
          },
          chatLabel: {
            "*": t("Support"),
          },
        },
      });
  }, [languageBaseName, ready, t]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "updateSettings", {
      color: {
        theme: currentColorScheme?.main?.accent,
      },
    });
  }, [currentColorScheme?.main?.accent]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "prefill", {
      email: {
        value: zendeskEmail,
      },
      name: {
        value: chatDisplayName ? chatDisplayName.trim() : "",
      },
    });
  }, [zendeskEmail, chatDisplayName]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "updateSettings", {
      position: { horizontal: isRTL ? "left" : "right" },
    });
  }, [isRTL]);

  const onZendeskLoaded = useCallback(() => {
    // The widget arrives with its own launcher showing. Hiding it leaves the
    // app's Support button as the only way in, and closing the chat puts it
    // back out of sight rather than leaving the vendor's launcher behind.
    zendeskAPI.addChanges("webWidget", "hide");
    zendeskAPI.addChanges("webWidget:on", "close", () => {
      zendeskAPI.addChanges("webWidget", "hide");
    });
  }, []);

  return zendeskKey ? (
    <Zendesk
      defer
      zendeskKey={zendeskKey}
      onLoaded={onZendeskLoaded}
      config={baseConfig}
      isShowLiveChat={isShowLiveChat}
    />
  ) : null;
};

ArticleLiveChat.displayName = "LiveChat";

export default ArticleLiveChat;
