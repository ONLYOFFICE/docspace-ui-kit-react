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

import React, { useCallback, useRef } from "react";
import type { ColumnSizingState } from "@tanstack/react-table";

import type { UseColumnResizeOptions } from "../Table.types";

import {
  HANDLE_OFFSET,
  MIN_COLUMN_SIZE,
  SETTINGS_COLUMN_SIZE,
} from "../Table.constants";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSubstring(s: string): number {
  return parseFloat(s) || 0;
}

/**
 * Parse an all-px gridTemplateColumns string into ColumnSizingState.
 * columnKeys = visible column keys in visual order (indices 0…n-1 in the
 * widths array; index n is the settings column — ignored).
 */
function parseSizingFromStr(
  str: string,
  columnKeys: string[],
): ColumnSizingState {
  const parts = str.split(" ");
  const sizing: ColumnSizingState = {};
  for (let i = 0; i < columnKeys.length && i < parts.length; i++) {
    const px = getSubstring(parts[i]);
    if (px > 0) sizing[columnKeys[i]] = px;
  }
  return sizing;
}

// ─── Cascade helpers (mirror legacy moveToRight / moveToLeft) ─────────────────
//
// Header cells have id="column_${visualIndex}" and carry data-min-width /
// data-default-size attributes so that these helpers can read column metadata
// from the DOM — identical to the approach used by legacy table/TableHeader.tsx.
//
// `widths` = gridTemplateColumns.split(" ") (all px after mouseDown init).
// widths[widths.length - 1] is the settings column — never touched.

/**
 * Grow current column, shrink the right neighbour. Cascades rightward when
 * the neighbour hits its minimum. Mirrors legacy moveToRight.
 */
function moveToRight(
  widths: string[],
  columnIndex: number,
  newWidth: number,
  nextIdx?: number,
): void {
  const settingsIdx = widths.length - 1; // settings col — never resize
  let colIndex = nextIdx !== undefined ? nextIdx : columnIndex + 1;

  // Skip fixed-size (defaultSize) columns
  while (colIndex < settingsIdx) {
    const el = document.getElementById(`column_${colIndex}`);
    if (!el) return;
    if (!el.dataset.defaultSize) break;
    colIndex++;
  }
  if (colIndex >= settingsIdx) return;

  const el = document.getElementById(`column_${colIndex}`);
  if (!el) return;

  const offset = getSubstring(widths[columnIndex]) - newWidth;
  const column2Width = getSubstring(widths[colIndex]);
  const minSize = el.dataset.minWidth ? +el.dataset.minWidth : MIN_COLUMN_SIZE;

  if (column2Width + offset - HANDLE_OFFSET >= minSize) {
    // Normal case: right column absorbs the change
    widths[columnIndex] = `${newWidth + HANDLE_OFFSET}fr`;
    widths[colIndex] = `${column2Width + offset - HANDLE_OFFSET}fr`;
  } else if (column2Width !== minSize) {
    // Right column would go below min — clamp it, give remainder to current
    widths[columnIndex] = `${getSubstring(widths[columnIndex]) + column2Width - minSize}fr`;
    widths[colIndex] = `${minSize}fr`;
  } else {
    // Right column already at min — cascade further right
    moveToRight(widths, columnIndex, newWidth, colIndex + 1);
  }
}

/**
 * When the current column is already at its minimum and the handle is still
 * dragged leftward, take space from the left neighbour. Cascades leftward
 * when that neighbour is also at its minimum. Mirrors legacy moveToLeft.
 */
function moveToLeft(
  widths: string[],
  columnIndex: number,
  newWidth: number,
  prevIdx?: number,
): void {
  const colIndex = prevIdx !== undefined ? prevIdx : columnIndex - 1;
  if (colIndex < 0) return;

  const el = document.getElementById(`column_${colIndex}`);
  if (!el) {
    moveToLeft(widths, columnIndex, newWidth, colIndex - 1);
    return;
  }

  const minSize = el.dataset.minWidth ? +el.dataset.minWidth : MIN_COLUMN_SIZE;
  const leftWidth = getSubstring(widths[colIndex]);

  if (leftWidth <= minSize) {
    // Left column already at min — cascade further left
    moveToLeft(widths, columnIndex, newWidth, colIndex - 1);
    return;
  }

  // offset = how much more the user wants to shrink the current column
  const offset = getSubstring(widths[columnIndex]) - newWidth;
  // How far we can actually take from the left column
  const leftColumnWidth = leftWidth - offset;
  const newLeftWidth = Math.max(leftColumnWidth, minSize);
  const actualTaken = leftWidth - newLeftWidth; // how much left col actually gave

  widths[colIndex] = `${newLeftWidth}fr`;
  // Current column gains exactly what was taken from the left column
  widths[columnIndex] = `${getSubstring(widths[columnIndex]) + actualTaken}fr`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * DOM-based column resize hook — zero React renders during drag.
 *
 * During drag:
 *   mousemove → el.style.gridTemplateColumns = newStr   (direct DOM mutation)
 *              → querySelectorAll(".table-container_row") synced the same way
 *
 * On mouseUp:
 *   parseSizingFromStr → setColumnSizing (one React state update) + saveSizing
 *
 * Initialization on mouseDown uses columnSizing + containerWidth (not
 * getBoundingClientRect) to guarantee widths sum exactly to containerWidth and
 * there is no subpixel jump when React re-renders after mouseUp.
 */
export function useColumnResize(options: UseColumnResizeOptions): {
  onResizeMouseDown: (colIndex: number) => (e: React.MouseEvent) => void;
} {
  // Always-current options — no stale closures in drag handlers
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /**
   * Write a new grid string directly to the header and all virtual rows.
   * Direct inline style writes avoid CSS-variable cascade overhead — the browser
   * only reflows the specific elements rather than walking the entire subtree.
   */
  const applyGridStr = useCallback((str: string) => {
    const container = optionsRef.current.containerRef.current;
    if (!container) return;

    const header = container.querySelector<HTMLElement>(".table-container_header");
    if (header) header.style.gridTemplateColumns = str;

    container
      .querySelectorAll<HTMLElement>(".table-container_row")
      .forEach((el) => {
        el.style.gridTemplateColumns = str;
      });
  }, []);

  const onResizeMouseDown = useCallback(
    (colIndex: number) =>
      (e: React.MouseEvent) => {
        e.preventDefault();

        // ── Initialise all column widths to exact px values ───────────────────
        //
        // CSS uses `fr` units so columnSizing px values don't match rendered
        // widths. Read actual rendered widths from the header cell elements via
        // getBoundingClientRect — this is the only reliable source when fr is
        // in use. The last column gets whatever space remains so the sum is
        // always exact.
        const { containerWidth, columnKeys } = optionsRef.current;

        if (columnKeys.length > 0 && containerWidth > 0) {
          let sumOtherPx = 0;
          const parts: string[] = columnKeys.map((_key, i) => {
            if (i === columnKeys.length - 1) {
              // Last flex column: fill the remainder exactly.
              const lastFr = Math.max(
                containerWidth - sumOtherPx - SETTINGS_COLUMN_SIZE,
                MIN_COLUMN_SIZE,
              );
              return `${lastFr}fr`;
            }
            // Read the actual rendered width from the header cell DOM element.
            // This is required because CSS uses `fr` units — columnSizing px
            // values don't match the rendered widths after container resize.
            const el = document.getElementById(`column_${i}`);
            const w = el
              ? Math.round(el.getBoundingClientRect().width)
              : MIN_COLUMN_SIZE;
            sumOtherPx += w;
            // Fixed/short columns keep px; flex columns use fr.
            return el?.dataset.defaultSize || el?.dataset.isShort
              ? `${w}px`
              : `${w}fr`;
          });
          parts.push(`${SETTINGS_COLUMN_SIZE}px`);
          applyGridStr(parts.join(" "));
        }

        // ── Per-drag event handlers ───────────────────────────────────────────
        // Defined here so they share the colIndex closure and are the exact
        // same references passed to add/removeEventListener.

        const onMouseMove = (evt: MouseEvent) => {
          const column = document.getElementById(`column_${colIndex}`);
          if (!column) return;

          const { isRTL } = optionsRef.current;
          const rect = column.getBoundingClientRect();
          let newWidth = isRTL
            ? rect.right - evt.clientX
            : evt.clientX - rect.left;

          const container = optionsRef.current.containerRef.current;
          const headerEl = container?.querySelector<HTMLElement>(".table-container_header");
          const currentStr = headerEl?.style.gridTemplateColumns ?? "";
          if (!currentStr) return;

          const widths = currentStr.split(" ");
          const minSize = column.dataset.minWidth
            ? +column.dataset.minWidth
            : MIN_COLUMN_SIZE;

          if (newWidth <= minSize - HANDLE_OFFSET) {
            const currentWidth = getSubstring(widths[colIndex]);
            if (currentWidth !== minSize) {
              // Column not yet at min: snap it and give the difference to the right
              newWidth = minSize - HANDLE_OFFSET;
              moveToRight(widths, colIndex, newWidth);
            } else {
              // Column already at min: take space from the left instead
              moveToLeft(widths, colIndex, newWidth);
            }
          } else {
            moveToRight(widths, colIndex, newWidth);
          }

          applyGridStr(widths.join(" "));
        };

        const onMouseUp = () => {
          const { saveSizing, setColumnSizing, columnKeys: keys, containerRef } =
            optionsRef.current;

          const container = containerRef.current;
          const headerEl = container?.querySelector<HTMLElement>(".table-container_header");
          const str = headerEl?.style.gridTemplateColumns ?? "";

          if (str && container) {
            // Handoff: write final value into --table-gtc, then clear all inline
            // gridTemplateColumns so elements fall back to var(--table-gtc).
            container.style.setProperty("--table-gtc", str);
            if (headerEl) headerEl.style.gridTemplateColumns = "";
            container
              .querySelectorAll<HTMLElement>(".table-container_row")
              .forEach((el) => {
                el.style.gridTemplateColumns = "";
              });

            // One React state update + localStorage.
            const sizing = parseSizingFromStr(str, keys);
            setColumnSizing(sizing);
            saveSizing(sizing);
          }

          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      },
    [applyGridStr],
  );

  return { onResizeMouseDown };
}
