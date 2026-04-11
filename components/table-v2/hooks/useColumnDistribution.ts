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
      ? Math.max(Math.floor(remainingWidth / otherCols.length), MIN_COLUMN_SIZE)
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
 * Converts a px sizing state to percentages of the flex pool.
 * Mirrors writePercents in useColumnPersistence, but without localStorage I/O.
 * Returns null when the flex pool is empty (all columns fixed/short/hidden).
 */
function percentsFromSizing(
  sizing: ColumnSizingState,
  cols: TTableColumn[],
): Record<string, number> | null {
  const flexCols = cols.filter(
    (c) => c.enable !== false && !c.defaultSize && !c.isShort,
  );
  const flexTotal = flexCols.reduce((sum, c) => sum + (sizing[c.key] ?? 0), 0);
  if (flexTotal <= 0) return null;

  const percents: Record<string, number> = {};
  for (const col of flexCols) {
    percents[col.key] = ((sizing[col.key] ?? 0) / flexTotal) * 100;
  }
  return percents;
}

/**
 * Converts stored percentages back to px for the current container width.
 *
 * The percentages were saved relative to the flex pool
 * (containerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth).
 * Fixed and short columns are restored from their column definitions.
 *
 * Falls back to computeDistribution when a flex column has no stored percent
 * (e.g. a new column was added after the data was last saved).
 */
function percentsToSizing(
  cols: TTableColumn[],
  percents: Record<string, number>,
  containerWidth: number,
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

  // Fall back to fresh compute when a flex column is absent from stored percents
  // (e.g. a new column was added since the data was last saved).
  const hasAll = flexCols.every((c) => percents[c.key] != null);
  if (!hasAll) return computeDistribution(cols, containerWidth);

  // Second-layer validation: each stored percent must be a finite positive
  // number. If any value is NaN / null / undefined / ≤ 0, discard everything.
  for (const col of flexCols) {
    const pct = percents[col.key];
    if (typeof pct !== "number" || !Number.isFinite(pct) || pct <= 0) {
      return computeDistribution(cols, containerWidth);
    }
  }

  const flexArea =
    containerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth;

  const sizing: ColumnSizingState = {};

  for (const col of fixedCols) {
    sizing[col.key] = col.defaultSize!;
  }
  for (const col of shortCols) {
    sizing[col.key] = col.minWidth ?? MIN_COLUMN_SIZE;
  }
  for (const col of flexCols) {
    const pct = percents[col.key];
    const minSize =
      col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);
    const px = Math.floor((flexArea * pct) / 100);
    // Guard against computed NaN/negative (e.g. zero flex area on tiny screens)
    sizing[col.key] =
      Number.isFinite(px) && px > 0 ? Math.max(px, minSize) : minSize;
  }

  return sizing;
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
 *    - Persisted percents → convert to px via percentsToSizing (scales to any
 *      container width without stale values)
 *    - No persisted data → compute fresh proportional distribution
 * 2. Subsequent container resizes → scale columns proportionally (mirrors
 *    legacy table `onResize` behavior) and persist the new sizes
 * 3. Column visibility change → recompute distribution and persist
 */
export function useColumnDistribution(
  cols: TTableColumn[],
  initialPercents: Record<string, number> | null,
  saveSizing: (s: ColumnSizingState) => void,
  forwardedRef?: React.Ref<HTMLDivElement>,
): UseColumnDistributionResult {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef =
    (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [hideColumns, setHideColumns] = useState(false);

  const lastWidthRef = useRef(0);
  const initializedRef = useRef(false);

  // Tracks the most recently *intended* sizing — updated synchronously every
  // time we call setColumnSizing. Used by scaleColumnsToWidth so it always
  // sees the latest value regardless of React commit timing.
  const sizingRef = useRef<ColumnSizingState>({});

  // Percentages are the persistent source of truth for window resizes.
  // Populated from localStorage on init; updated when the user drags a column.
  // On every ResizeObserver callback that has percents available, we convert
  // them directly to px — this means both the init call and any subsequent
  // layout-shift call (scrollbar, flex settle) produce the same correct result
  // without any risk of scaleColumnsToWidth overwriting localStorage values.
  const percentsRef = useRef<Record<string, number> | null>(initialPercents);

  // Keep refs current so the ResizeObserver callback (created once, with []
  // deps) always sees the latest cols and saveSizing without stale closures.
  const colsRef = useRef(cols);
  colsRef.current = cols;
  const saveSizingRef = useRef(saveSizing);
  saveSizingRef.current = saveSizing;
  // Keep in sync so percentsToSizing uses latest percents on first call.
  const initialPercentsRef = useRef(initialPercents);
  initialPercentsRef.current = initialPercents;

  /** Set sizing in both the ref (immediately) and React state (async commit). */
  const applySizing = useCallback((sized: ColumnSizingState, save = false) => {
    sizingRef.current = sized;
    setColumnSizing(sized);
    if (save) {
      saveSizingRef.current(sized);
      // Keep percentsRef up to date so subsequent ResizeObserver calls
      // convert the latest user-defined proportions, not stale ones.
      percentsRef.current = percentsFromSizing(sized, colsRef.current);
    }
  }, []);

  // Recompute distribution when the visible column set changes (e.g. user
  // toggles a column). Runs as useLayoutEffect so React batches the resulting
  // setColumnSizing update with any other pending state work — no extra paint,
  // no flicker.
  const visibleColKeysStr = cols
    .filter((c) => c.enable !== false)
    .map((c) => c.key)
    .join(",");

  const prevVisibleColKeysRef = useRef(visibleColKeysStr);

  useLayoutEffect(() => {
    if (visibleColKeysStr === prevVisibleColKeysRef.current) return;
    prevVisibleColKeysRef.current = visibleColKeysStr;

    if (!initializedRef.current || lastWidthRef.current === 0) return;

    const width = lastWidthRef.current;
    setHideColumns(computeHideColumns(colsRef.current, width));

    const sized = computeDistribution(colsRef.current, width);
    applySizing(sized, true);
  }, [visibleColKeysStr, applySizing]);

  const distribute = useCallback(
    (width: number) => {
      const sized = computeDistribution(colsRef.current, width);
      applySizing(sized, true);
    },
    [applySizing],
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ResizeObserver handles both initialization and subsequent resizes.
    //
    // Why not call init synchronously + observe?
    // useLayoutEffect runs before paint but after browser layout — however
    // el.clientWidth at that moment can differ from the width reported by the
    // first ResizeObserver callback (e.g. scrollbar appears, flex container
    // settles). If we init synchronously with width A and ResizeObserver fires
    // with width B ≠ A, the "subsequent resize" branch runs scaleColumnsToWidth
    // on sizingRef that contains localStorage values — overwriting them.
    //
    // Letting ResizeObserver do everything avoids the race: the first callback
    // always fires with the stable layout width and is treated as initialization.
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      if (width === 0) return;

      if (!initializedRef.current) {
        // ── First valid measurement — initialize from localStorage ─────────────
        initializedRef.current = true;
        lastWidthRef.current = width;

        setContainerWidth(width);
        setHideColumns(computeHideColumns(colsRef.current, width));

        const percents = percentsRef.current;
        if (percents && Object.keys(percents).length > 0) {
          const sized = percentsToSizing(colsRef.current, percents, width);
          applySizing(sized, true);
        } else {
          distribute(width);
        }
        return;
      }

      // ── Width unchanged — nothing to do ───────────────────────────────────
      if (width === lastWidthRef.current) return;
      lastWidthRef.current = width;

      // Column px sizes are kept fixed on container resize — only
      // containerWidth (for useColumnResize init) and hideColumns are updated.
      setContainerWidth(width);
      setHideColumns(computeHideColumns(colsRef.current, width));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wrap the raw setter so external callers (useColumnResize onMouseUp) also
  // keep sizingRef in sync — otherwise a resize-drag followed by a window
  // resize would scale from stale ref values.
  const setColumnSizingWrapped = useCallback(
    (
      action:
        | ColumnSizingState
        | ((prev: ColumnSizingState) => ColumnSizingState),
    ) => {
      const next =
        typeof action === "function" ? action(sizingRef.current) : action;
      sizingRef.current = next;
      setColumnSizing(next);
    },
    [],
  );

  return {
    columnSizing,
    setColumnSizing: setColumnSizingWrapped,
    containerWidth,
    hideColumns,
    containerRef,
  };
}

