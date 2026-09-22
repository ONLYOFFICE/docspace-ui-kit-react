import React, { useCallback, useEffect } from "react";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { useTheme } from "../../../context/ThemeContext";
import { useIsMobile } from "../../../hooks/use-is-mobile";
import { INFO_PANEL_WIDTH } from "../../../utils/device";
import {
  FLOATING_CORNER_GAP,
  FLOATING_CORNER_INSET,
  FLOATING_CORNER_INSET_MOBILE,
  FLOATING_CORNER_SIZE,
  LIVE_CHAT_LOCAL_STORAGE_KEY,
  ZENDESK_LAUNCHER_MARGIN_BLOCK,
  ZENDESK_LAUNCHER_MARGIN_INLINE,
} from "../../../constants";
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

const ArticleLiveChat = ({
  languageBaseName,
  zendeskEmail,
  chatDisplayName,
  withFloatingButton,
  zendeskKey,
  showProgress,
  isShowLiveChat,
  isInfoPanelVisible,
}: ArticleZendeskProps) => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();
  const { currentColorScheme } = useTheme();
  const { isRTL } = useInterfaceDirection();
  const isMobileWidth = useIsMobile();
  const infoPanelOffset = isInfoPanelVisible ? INFO_PANEL_WIDTH : 0;

  useEffect(() => {
    // The launcher is the only element of the floating corner stack that CSS
    // does not place, so it repeats the inset the others get from
    // styles/variables/_floating-corner.scss - otherwise it lines up with
    // nothing. It shares that corner with the app's create button and with the
    // upload progress button, and steps one button width aside whenever either
    // of them is on screen.
    const inset = isMobileWidth
      ? FLOATING_CORNER_INSET_MOBILE
      : FLOATING_CORNER_INSET;
    const sharesCorner = withFloatingButton || showProgress;
    const dodge = sharesCorner ? FLOATING_CORNER_SIZE + FLOATING_CORNER_GAP : 0;

    // Zendesk adds the offset to the margin the launcher frame already has, so
    // both axes hand it the distance that is still missing. That margin is
    // also a floor: an offset cannot be negative, so an inset smaller than it
    // (16px against the 20px inline margin) leaves the launcher at the margin.
    const horizontal =
      infoPanelOffset + inset + dodge - ZENDESK_LAUNCHER_MARGIN_INLINE;
    const vertical = inset - ZENDESK_LAUNCHER_MARGIN_BLOCK;

    zendeskAPI.addChanges("webWidget", "updateSettings", {
      offset: {
        horizontal: `${Math.max(horizontal, 0)}px`,
        vertical: `${Math.max(vertical, 0)}px`,
      },
    });
  }, [withFloatingButton, isMobileWidth, showProgress, infoPanelOffset]);

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
    const isShowChat =
      localStorage.getItem(LIVE_CHAT_LOCAL_STORAGE_KEY) === "true" || false;

    zendeskAPI.addChanges("webWidget", isShowChat ? "show" : "hide");
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
