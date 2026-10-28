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
} from "../../../constants";
import { globalColors } from "../../../providers/theme";
import { Zendesk } from "../zendesk";
import { zendeskAPI } from "../zendesk/Zendesk.utils";
import { ArticleLiveChatProps } from "../Article.types";

import "./LiveChat.module.scss";

/**
 * Where the widget's iframes stand in the stacking order: over the page,
 * under the app's dialogs and panels. The widget's own default is 999999.
 */
const Z_INDEX = 201;

/**
 * Loads the Zendesk widget and keeps its settings in step with the app: the
 * locale, the side it opens on, the corner its launcher stands in. The
 * launcher is the vendor's own and the only way into the chat; the app only
 * moves it clear of whatever else it pins to that corner, and scales its
 * iframe down to the corner's button size (LiveChat.module.scss).
 *
 * The account serves the messaging Web Widget, so every command goes through
 * the `messenger` namespace. The Web Widget (Classic) `webWidget` commands are
 * not ignored there, they throw ("Method webWidget.hide does not exist"), and
 * the messaging widget has no API for the launcher label or a visitor
 * prefill: those are Admin Center settings. Its colours can be set, and follow
 * the portal's accent and the light or dark theme.
 */
const ArticleLiveChat = ({
  languageBaseName,
  zendeskKey,
  isShowLiveChat,
  withFloatingButton = false,
  isInfoPanelVisible = false,
  infoPanelWidth = INFO_PANEL_WIDTH,
}: ArticleLiveChatProps) => {
  const { isRTL } = useInterfaceDirection();
  const { isBase, currentColorScheme } = useTheme();
  const isMobileWidth = useIsMobile();

  const accent = currentColorScheme?.main?.accent ?? globalColors.lightBlueMain;
  const onAccent = currentColorScheme?.text?.accent ?? globalColors.white;

  useEffect(() => {
    zendeskAPI.addChanges("messenger:set", "locale", languageBaseName);
  }, [languageBaseName]);

  useEffect(() => {
    // The launcher is the only element of the floating corner stack that CSS
    // does not place, so it repeats the inset the others get from
    // styles/variables/_floating-corner.scss - otherwise it lines up with
    // nothing. It shares that corner with the app's create button and with the
    // upload progress button, and steps one button width aside whenever either
    // of them is on screen. Above mobile the info panel is a docked column the
    // corner moves clear of; on a phone the panel takes the whole screen and
    // there is nothing to step around. The offsets are pixels from the
    // viewport edge, on both axes.
    const inset = isMobileWidth
      ? FLOATING_CORNER_INSET_MOBILE
      : FLOATING_CORNER_INSET;
    const dodge = withFloatingButton
      ? FLOATING_CORNER_SIZE + FLOATING_CORNER_GAP
      : 0;
    const infoPanel = isInfoPanelVisible && !isMobileWidth ? infoPanelWidth : 0;
    const offset = { horizontal: inset + dodge + infoPanel, vertical: inset };

    // The widget keeps a second offset for what it takes to be a phone. It
    // gets the same one, so the breakpoint stays ours - useIsMobile, which is
    // what the create button's stylesheet keys off too.
    // Position and theme go in one call, so neither can be dropped by a
    // later customization that carries only the other.
    zendeskAPI.addChanges("messenger:set", "customization", {
      position: {
        side: isRTL ? "left" : "right",
        offset: { web: offset, mobile: offset },
      },
      theme: {
        primary: accent,
        onPrimary: onAccent,
        action: accent,
        onAction: onAccent,
        onSecondaryAction: accent,
        message: accent,
        onMessage: onAccent,
        background: isBase ? globalColors.white : globalColors.black,
        onBackground: isBase ? globalColors.black : globalColors.white,
        businessMessage: isBase
          ? globalColors.paleGray
          : globalColors.grayDarkStrong,
        onBusinessMessage: isBase ? globalColors.black : globalColors.white,
      },
    });
  }, [
    withFloatingButton,
    isInfoPanelVisible,
    infoPanelWidth,
    isMobileWidth,
    isRTL,
    isBase,
    accent,
    onAccent,
  ]);

  const onZendeskLoaded = useCallback(() => {
    zendeskAPI.addChanges("messenger:set", "zIndex", Z_INDEX);
  }, []);

  return zendeskKey ? (
    <Zendesk
      defer
      zendeskKey={zendeskKey}
      onLoaded={onZendeskLoaded}
      isShowLiveChat={isShowLiveChat}
    />
  ) : null;
};

ArticleLiveChat.displayName = "LiveChat";

export default ArticleLiveChat;
