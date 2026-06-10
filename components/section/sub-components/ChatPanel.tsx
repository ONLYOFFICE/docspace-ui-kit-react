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

import { useEffect } from "react";
import classNames from "classnames";

import { DeviceType } from "../../../enums";

import { ChatPanelProps } from "../Section.types";
import styles from "../Section.module.scss";

/**
 * Right-side region dedicated to the AI Chat panel. Unlike `InfoPanel` it never
 * switches into the portal-based "Aside" overlay on tablet/mobile: it always
 * renders inline (so the chat's live state is never lost to a remount across a
 * resize) and the full-screen layout on tablet/mobile is handled purely in CSS
 * (`.chatPanel`). Desktop width — windowed vs. full — is driven by the host via
 * the `--chat-panel-width` CSS variable.
 */
const ChatPanel = ({
  children,
  isVisible,
  currentDeviceType,
  setIsVisible,
}: ChatPanelProps) => {
  // On tablet/mobile the panel is full-screen, so the browser back button
  // closes it (mirrors InfoPanel). Use addEventListener rather than
  // window.onpopstate so it doesn't clobber InfoPanel's own handler.
  useEffect(() => {
    if (currentDeviceType === DeviceType.desktop || !isVisible)
      return undefined;

    const onPopState = () => setIsVisible?.(false);

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [currentDeviceType, isVisible, setIsVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={classNames("chat-panel", styles.chatPanel)}
      id="ChatPanelWrapper"
    >
      {children}
    </div>
  );
};

export default ChatPanel;
