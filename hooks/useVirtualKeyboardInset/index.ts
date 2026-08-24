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

import { useEffect, useState } from "react";

import { isTouchDevice } from "../../utils/device";

// Sub-pixel deltas (e.g. 0.18px) appear during keyboard animations on some
// browsers; treat them as "no keyboard".
const KEYBOARD_HEIGHT_THRESHOLD = 1;

/**
 * Tracks how many CSS pixels of the layout viewport's bottom are covered by
 * the virtual keyboard, so an in-flow container can reserve that space (e.g.
 * as `padding-bottom`) and keep its bottom-anchored content — a chat
 * composer — visible above the keyboard.
 *
 * Differs from `useKeyboardAwareSheet`, which offsets a `position: fixed`
 * bottom sheet: this hook is for normally-flowing flex layouts where the
 * covered area must be re-added inside the container itself.
 *
 * Returns 0 on non-touch devices, when `enabled` is false, when
 * `visualViewport` is unavailable, and while no keyboard is shown.
 */
export function useVirtualKeyboardInset(enabled = true): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!enabled || !isTouchDevice) return undefined;
    const vv = window.visualViewport;
    if (!vv) return undefined;

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Bottom overlap = layout viewport height minus the visual viewport's
        // bottom edge. `offsetTop` matters on iOS: Safari scrolls the page to
        // reveal a focused input, which shrinks the actually covered area.
        const covered = Math.max(
          0,
          Math.round(window.innerHeight - vv.height - vv.offsetTop),
        );
        setInset(covered > KEYBOARD_HEIGHT_THRESHOLD ? covered : 0);
      });
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setInset(0);
    };
  }, [enabled]);

  return inset;
}
