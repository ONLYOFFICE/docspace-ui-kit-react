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

import { useState, useCallback, useLayoutEffect, useRef } from "react";

import type { ColumnSizingState } from "@tanstack/react-table";

import type { TTableColumn } from "../Table.types";
import {
  MIN_COLUMN_SIZE,
  MIN_NAME_COLUMN_SIZE,
  SETTINGS_COLUMN_SIZE,
  NAME_COLUMN_PERCENT,
} from "../Table.constants";

// ─── Distribution helpers ─────────────────────────────────────────────────────

/**
 * Computes the initial column distribution for a given container width.
 *
 * Distribution rules:
 * - `defaultSize` columns: fixed px, excluded from the flexible pool
 * - `isShort` columns: exactly their `minWidth` (excluded from flexible pool)
 * - `default` column: NAME_COLUMN_PERCENT % of the flexible area
 * - All other enabled columns: split equally from the remaining 60%
 */
function computeDistribution(
  cols: TTableColumn[],
  containerWidth: number,
): ColumnSizingState {
  const visibleCols = cols.filter((c) => c.enable !== false);

  const fixedCols = visibleCols.filter((c) => c.defaultSize != null);
  const fixedWidth = fixedCols.reduce(
    (sum, c) => sum + (c.defaultSize ?? 0),
    0,
  );

  const shortCols = visibleCols.filter(
    (c) => c.isShort && c.defaultSize == null,
  );
  const shortWidth = shortCols.reduce(
    (sum, c) => sum + (c.minWidth ?? MIN_COLUMN_SIZE),
    0,
  );

  const defaultCol = visibleCols.find(
    (c) => c.default && !c.defaultSize && !c.isShort,
  );
  const otherCols = visibleCols.filter(
    (c) => !c.default && !c.defaultSize && !c.isShort,
  );

  const available =
    containerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth;

  const nameWidth = defaultCol
    ? Math.max(
        Math.floor((available * NAME_COLUMN_PERCENT) / 100),
        defaultCol.minWidth ?? MIN_NAME_COLUMN_SIZE,
      )
    : 0;

  const remainingWidth = available - nameWidth;
  const perOther =
    otherCols.length > 0
      ? Math.max(
          Math.floor(remainingWidth / otherCols.length),
          MIN_COLUMN_SIZE,
        )
      : 0;

  const sizing: ColumnSizingState = {};

  for (const col of fixedCols) {
    sizing[col.key] = col.defaultSize!;
  }
  for (const col of shortCols) {
    sizing[col.key] = col.minWidth ?? MIN_COLUMN_SIZE;
  }
  if (defaultCol) {
    sizing[defaultCol.key] = nameWidth;
  }
  otherCols.forEach((col, i) => {
    const extra = i === 0 ? remainingWidth - perOther * otherCols.length : 0;
    sizing[col.key] = perOther + extra;
  });

  return sizing;
}

/**
 * Scales existing column sizes proportionally to a new container width.
 *
 * Mirrors the legacy table's `onResize` behavior:
 * 1. Each flexible column keeps its % of the total flexible width.
 * 2. Columns are clamped at their minimum width.
 * 3. Overflow (space claimed by clamped columns) is redistributed from columns
 *    that still have room above their minimum.
 *
 * Fixed-size (`defaultSize`) and short (`isShort`) columns are unchanged.
 */
function scaleColumnsToWidth(
  cols: TTableColumn[],
  currentSizing: ColumnSizingState,
  newContainerWidth: number,
): ColumnSizingState {
  const visibleCols = cols.filter((c) => c.enable !== false);

  const fixedCols = visibleCols.filter((c) => c.defaultSize != null);
  const fixedWidth = fixedCols.reduce(
    (sum, c) => sum + (c.defaultSize ?? 0),
    0,
  );
  const shortCols = visibleCols.filter((c) => c.isShort && !c.defaultSize);
  const shortWidth = shortCols.reduce(
    (sum, c) => sum + (c.minWidth ?? MIN_COLUMN_SIZE),
    0,
  );
  const flexCols = visibleCols.filter((c) => !c.defaultSize && !c.isShort);

  const newAvailable =
    newContainerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth;

  // Old total flexible width (sum of all flexible columns' current sizes)
  const oldFlexTotal = flexCols.reduce((sum, c) => {
    return sum + (currentSizing[c.key] ?? c.minWidth ?? MIN_COLUMN_SIZE);
  }, 0);

  // Fall back to fresh distribution if we have nothing to scale from
  if (oldFlexTotal <= 0 || flexCols.length === 0) {
    return computeDistribution(cols, newContainerWidth);
  }

  const scaled: ColumnSizingState = {};
  let overflow = 0;

  // Fixed and short columns are pinned
  for (const col of fixedCols) scaled[col.key] = col.defaultSize!;
  for (const col of shortCols)
    scaled[col.key] = col.minWidth ?? MIN_COLUMN_SIZE;

  // Scale each flexible column by its % share
  for (const col of flexCols) {
    const oldSize = currentSizing[col.key] ?? col.minWidth ?? MIN_COLUMN_SIZE;
    const percent = oldSize / oldFlexTotal;
    const newSize = Math.floor(newAvailable * percent);
    const minSize = col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);

    if (newSize < minSize) {
      scaled[col.key] = minSize;
      overflow += minSize - newSize;
    } else {
      scaled[col.key] = newSize;
    }
  }

  // Redistribute overflow: take proportionally from columns above their minimum
  if (overflow > 0) {
    for (const col of flexCols) {
      if (overflow <= 0) break;
      const minSize =
        col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);
      const current = scaled[col.key] ?? minSize;
      const available = current - minSize;
      if (available <= 0) continue;

      const take = Math.min(available, overflow);
      scaled[col.key] = current - take;
      overflow -= take;
    }
  }

  return scaled;
}

/**
 * Computes whether the container is too narrow to show all non-essential columns.
 */
function computeHideColumns(
  cols: TTableColumn[],
  containerWidth: number,
): boolean {
  if (containerWidth === 0) return false;

  const visibleCols = cols.filter((c) => c.enable !== false);

  const defaultCol = visibleCols.find((c) => c.default);
  const defaultMinWidth = defaultCol?.minWidth ?? MIN_NAME_COLUMN_SIZE;

  const shortCols = visibleCols.filter((c) => c.isShort && !c.default);
  const shortWidth = shortCols.reduce(
    (sum, c) => sum + (c.minWidth ?? MIN_COLUMN_SIZE),
    0,
  );

  const fixedWidth = visibleCols
    .filter((c) => c.defaultSize != null)
    .reduce((sum, c) => sum + (c.defaultSize ?? 0), 0);

  const otherCols = visibleCols.filter(
    (c) => !c.default && !c.isShort && c.defaultSize == null,
  );

  const minRequired =
    defaultMinWidth +
    shortWidth +
    fixedWidth +
    otherCols.length * MIN_COLUMN_SIZE +
    SETTINGS_COLUMN_SIZE;

  return containerWidth < minRequired;
}

export interface UseColumnDistributionResult {
  columnSizing: ColumnSizingState;
  setColumnSizing: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  containerWidth: number;
  hideColumns: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Measures the container via ResizeObserver and manages column sizing.
 *
 * Sizing lifecycle:
 * 1. First measurement:
 *    - Persisted sizing → scale stored values to current container width
 *    - No persisted sizing → compute fresh proportional distribution
 * 2. Subsequent container resizes → scale columns proportionally (mirrors legacy
 *    table `onResize` behavior) and persist the new sizes
 */
export function useColumnDistribution(
  cols: TTableColumn[],
  initialSizing: ColumnSizingState,
  saveSizing: (s: ColumnSizingState) => void,
  forwardedRef?: React.Ref<HTMLDivElement>,
): UseColumnDistributionResult {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef =
    (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

  const [columnSizing, setColumnSizing] =
    useState<ColumnSizingState>(initialSizing);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hideColumns, setHideColumns] = useState(false);

  const lastWidthRef = useRef(0);
  const initializedRef = useRef(false);

  // Keep refs current so the ResizeObserver callback (created once, with []
  // deps) always sees the latest cols and saveSizing without stale closures.
  const colsRef = useRef(cols);
  colsRef.current = cols;
  const saveSizingRef = useRef(saveSizing);
  saveSizingRef.current = saveSizing;

  // Track the visible-column key set as a stable string for change detection.
  const visibleColKeysStr = cols
    .filter((c) => c.enable !== false)
    .map((c) => c.key)
    .join(",");
  const prevVisibleColKeysRef = useRef(visibleColKeysStr);

  // Recompute distribution whenever visible columns change (e.g. user toggles
  // a column via settings). The ResizeObserver handles the initial computation,
  // so we skip until it has run at least once.
  useLayoutEffect(() => {
    if (visibleColKeysStr === prevVisibleColKeysRef.current) return;
    prevVisibleColKeysRef.current = visibleColKeysStr;

    if (!initializedRef.current || lastWidthRef.current === 0) return;

    const width = lastWidthRef.current;
    setHideColumns(computeHideColumns(colsRef.current, width));

    const sized = computeDistribution(colsRef.current, width);
    setColumnSizing(sized);
    saveSizingRef.current(sized);
  }, [visibleColKeysStr]);

  const distribute = useCallback(
    (width: number) => {
      const sized = computeDistribution(cols, width);
      setColumnSizing(sized);
      saveSizing(sized);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveSizing],
  );

  useLayoutEffect(() => {
    const el = (containerRef as React.RefObject<HTMLDivElement>).current;
    if (!el) return;

    const handleResize = () => {
      const width = el.clientWidth;
      if (width === 0 || width === lastWidthRef.current) return;
      lastWidthRef.current = width;

      setContainerWidth(width);
      setHideColumns(computeHideColumns(colsRef.current, width));

      if (!initializedRef.current) {
        // ── First measurement ────────────────────────────────────────────────
        initializedRef.current = true;

        const hasPersistedSizing = Object.keys(initialSizing).length > 0;
        if (hasPersistedSizing) {
          // Scale persisted sizes to match the actual container width
          const totalStored = Object.values(initialSizing).reduce(
            (a, b) => a + b,
            0,
          );
          if (totalStored > 0) {
            const available = width - SETTINGS_COLUMN_SIZE;
            const scale = available / totalStored;
            const scaled: ColumnSizingState = {};
            for (const [key, val] of Object.entries(initialSizing)) {
              scaled[key] = Math.floor(val * scale);
            }
            setColumnSizing(scaled);
            return;
          }
        }

        distribute(width);
        return;
      }

      // ── Subsequent resizes — scale proportionally ──────────────────────────
      // Mirrors legacy table onResize: each column keeps its % of the total
      // flexible width; columns clamp at their minimum; overflow redistributes.
      setColumnSizing((prev) => {
        const scaled = scaleColumnsToWidth(colsRef.current, prev, width);
        // Persist after resize so the next page load starts from the new sizes
        saveSizingRef.current(scaled);
        return scaled;
      });
    };

    handleResize();

    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    columnSizing,
    setColumnSizing,
    containerWidth,
    hideColumns,
    containerRef,
  };
}
