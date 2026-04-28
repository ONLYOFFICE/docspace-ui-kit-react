// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
