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

/** The collapsed slot: the bare 32px icon button, per Navigation.module.scss. */
const COLLAPSED_WIDTH = 32;

/**
 * The header row the button competes for width in, whichever of the two places
 * it is rendered: on desktop it sits in the trailing button row, a sibling of
 * `.container`; from tablet down that row is dropped and the button joins the
 * control buttons *inside* `.container`. Going up to `.container` first and
 * only then to its parent lands on the same row in both cases, without this
 * component having to know the host's own class names.
 */
const rowOf = (slot: HTMLElement) =>
  slot.closest(`.${styles.container}`)?.parentElement ??
  slot.parentElement?.parentElement ??
  null;

/**
 * Is anything else in the header row already having to shorten its text?
 *
 * "The header has run out of space" cannot be read off the slot's own width:
 * the header's left-hand side is a grid whose children truncate happily, so it
 * never reports a flex deficit to this side of the row no matter how cramped it
 * gets. What it does do is put an ellipsis in - so the room title, the share
 * button's label and the tariff line each become the signal.
 *
 * Only elements that clip their own text with an ellipsis count, which is why
 * this walks the row instead of naming selectors: the room title and the share
 * button belong to this component's own markup, the tariff line is a host-
 * supplied node, and all three are recognised by the same two computed
 * properties without Navigation having to know which is which.
 */
const isRowCrowded = (slot: HTMLElement) => {
  const row = rowOf(slot);
  if (!row) return false;

  // The row itself has more content than it can show. Catches the layouts whose
  // neighbours have no ellipsis to give - the tablet header, where the button
  // joins the control buttons and would otherwise be pushed past the edge.
  if (row.scrollWidth > row.clientWidth + SUBPIXEL_SLACK) return true;

  return Array.from(row.querySelectorAll<HTMLElement>("*")).some((node) => {
    // The button's own label is not evidence about the row it sits in.
    if (slot.contains(node)) return false;
    if (node.scrollWidth <= node.clientWidth + SUBPIXEL_SLACK) return false;

    const style = getComputedStyle(node);
    return (
      style.textOverflow === "ellipsis" &&
      (style.overflowX === "hidden" || style.overflowX === "clip")
    );
  });
};

/**
 * Opens the AI chat panel. Keeps the "AI chat" label next to the icon for as
 * long as the header row can fit it, and collapses to the bare icon as soon as
 * anything else in the row has started shortening its own text.
 *
 * The label is the first thing in the header to go, not the last: a collapsed
 * button is still named by its icon, while a room title cut to "Sales and mar..."
 * or a share button cut to "Sha..." tells the reader nothing. Collapsing hands
 * the ~60px back to them.
 *
 * Two things have to be true for that to work without the button flickering:
 *
 *  - the slot's width follows the state, so collapsing actually releases space
 *    (a slot that always asks for the labelled width would decide correctly and
 *    change nothing);
 *  - the decision is read while the slot is asking for its *expanded* width, so
 *    it never depends on the state it is about to set. `measure` writes that
 *    width, reads the row, and only then commits - all inside one layout pass,
 *    so nothing is painted in between and the two states cannot alternate.
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

    const measure = () => {
      // Ask expanded, read the row, then commit. Reading while expanded is what
      // keeps the decision independent of the state it sets.
      slot.style.width = `${naturalWidth}px`;
      const crowded = isRowCrowded(slot);

      slot.style.width = `${crowded ? COLLAPSED_WIDTH : naturalWidth}px`;
      setIsCollapsed(crowded);
    };

    measure();

    // The row, not the slot: the slot's width is this effect's own output, so
    // observing it would feed the measurement back into itself. The row changes
    // width for every reason that matters here - the window, the info panel,
    // the chat panel.
    const row = rowOf(slot) ?? slot;
    const observer = new ResizeObserver(measure);
    observer.observe(row);

    return () => observer.disconnect();
  }, [naturalWidth]);

  return (
    <div
      ref={slotRef}
      className={styles.aiChatSlot}
      // Only the first paint's width; `measure` owns it from then on.
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
