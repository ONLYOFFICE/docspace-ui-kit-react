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

import React from "react";

import AiChatReactSvg from "../../../assets/icons/16/ai-chat.react.svg";

import { Button, ButtonSize } from "../../button";
import { useIsomorphicLayoutEffect } from "../../../hooks/useIsomorphicLayoutEffect";

import styles from "../Navigation.module.scss";
import { TAiChatButtonProps } from "../Navigation.types";

// Layout rounding must not be able to flip the collapsed state on its own.
const SUBPIXEL_SLACK = 1;

/**
 * Opens the AI chat panel. Keeps the "AI chat" label next to the icon for as
 * long as the header row can fit it, and collapses to the bare icon only when
 * it genuinely cannot.
 *
 * The slot always *asks* the row for the full labelled width and is allowed to
 * shrink down to the icon, so `clientWidth < naturalWidth` is exactly the
 * "no room left" signal. Collapsing never changes what the slot requests, so
 * the measurement cannot feed back into itself and oscillate - no hysteresis
 * is needed.
 *
 * `.container` carries a much larger flex-shrink than the button row (see
 * Navigation.module.scss), so the room title and control buttons truncate all
 * the way down to their min-content widths before any pressure reaches this
 * slot. The label is therefore the last thing in the header to go, not the
 * first.
 *
 * The label stays in the DOM when collapsed and is hidden in CSS, which keeps
 * the `aria-label` Button derives from it, so the collapsed button is still
 * announced as "AI chat".
 */
const AiChatButton = ({
  toggleChatPanel,
  id,
  titles,
  isChatPanelVisible,
}: TAiChatButtonProps) => {
  const slotRef = React.useRef<HTMLDivElement>(null);
  const mirrorRef = React.useRef<HTMLDivElement>(null);

  const [naturalWidth, setNaturalWidth] = React.useState(0);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const label = titles?.aiChat;

  // The hidden mirror renders the same button at its intrinsic width, so the
  // natural width survives locale switches and late font loads without ever
  // having to expand the real button to re-measure it.
  useIsomorphicLayoutEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror || typeof ResizeObserver === "undefined") return;

    const measure = () => setNaturalWidth(mirror.offsetWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(mirror);

    return () => observer.disconnect();
  }, [label]);

  useIsomorphicLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot || !naturalWidth || typeof ResizeObserver === "undefined") return;

    const check = () =>
      setIsCollapsed(slot.clientWidth < naturalWidth - SUBPIXEL_SLACK);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(slot);

    return () => observer.disconnect();
  }, [naturalWidth]);

  return (
    <div
      ref={slotRef}
      className={styles.aiChatSlot}
      style={naturalWidth ? { width: naturalWidth } : undefined}
      data-collapsed={isCollapsed ? "true" : "false"}
      data-open={isChatPanelVisible ? "true" : "false"}
      data-testid="ai-chat-slot"
    >
      <Button
        id={id}
        accent
        className="ai-chat-button"
        testId="ai-chat-button"
        size={ButtonSize.small}
        icon={<AiChatReactSvg />}
        label={label}
        title={label}
        onClick={toggleChatPanel}
      />
      {/* Measured, never shown. It carries `ai-chat-button_mirror` so the
          collapsed styling skips it and it always reports the full labelled
          width. The icon is stubbed with a same-sized spacer so the SVG (and
          its clip-path id) is not duplicated into the document. */}
      <div ref={mirrorRef} className={styles.aiChatMirror} aria-hidden="true">
        <Button
          accent
          className="ai-chat-button ai-chat-button_mirror"
          size={ButtonSize.small}
          icon={<span className={styles.aiChatIconSpacer} />}
          label={label}
        />
      </div>
    </div>
  );
};

export default AiChatButton;
