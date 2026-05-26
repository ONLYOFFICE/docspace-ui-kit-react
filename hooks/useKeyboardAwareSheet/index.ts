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

import { useEffect, useRef } from "react";

// Sub-pixel deltas (e.g. 0.18px) appear during keyboard animations on some
// browsers; treat them as "no keyboard".
const KEYBOARD_HEIGHT_THRESHOLD = 1;

/**
 * Lifts a `<ModalDialog>` bottom-sheet above the virtual keyboard on mobile.
 *
 * Reads `window.visualViewport` and offsets the sheet's `bottom` style by the
 * keyboard height so the modal content stays directly above the keyboard.
 *
 * Pass the ref obtained from `<ModalDialog sheetRef={...}>`.
 *
 * Notes:
 * - Edge Android's viewport geometry is unstable during keyboard transitions;
 *   callers should typically disable this hook there. Chrome and Firefox
 *   mobile work reliably.
 * - On iOS WebKit positions `position: fixed` against the visual viewport
 *   automatically, so this hook is unnecessary there.
 *
 * @param sheetRef - ref attached to the `<ModalDialog sheetRef>` (the sheet
 *   element).
 * @param enabled - apply the offset only when true.
 */
export function useKeyboardAwareSheet(
  sheetRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const frameRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const vv = window.visualViewport;
    if (!vv) return;

    let cancelled = false;
    let mountFrame = 0;

    const apply = (sheet: HTMLElement) => {
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height);
      sheet.style.bottom =
        keyboardHeight > KEYBOARD_HEIGHT_THRESHOLD
          ? `${keyboardHeight}px`
          : "";
    };

    const update = () => {
      const sheet = sheetRef.current;
      if (!sheet || !sheet.isConnected || frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        if (cancelled) return;
        const current = sheetRef.current;
        if (!current || !current.isConnected) return;
        apply(current);
      });
    };

    const trySync = () => {
      if (cancelled) return;
      if (sheetRef.current?.isConnected) {
        update();
      } else {
        // Sheet may not be in the DOM yet (Portal mounts after our effect on
        // first render). Retry on the next frame.
        mountFrame = requestAnimationFrame(trySync);
      }
    };

    vv.addEventListener("resize", update);
    trySync();

    return () => {
      cancelled = true;
      if (mountFrame) cancelAnimationFrame(mountFrame);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      vv.removeEventListener("resize", update);
      const sheet = sheetRef.current;
      if (sheet?.isConnected) sheet.style.bottom = "";
    };
  }, [enabled, sheetRef]);
}
