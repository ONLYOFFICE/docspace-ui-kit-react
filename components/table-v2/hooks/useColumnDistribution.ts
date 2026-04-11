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

import { useState, useLayoutEffect, useRef, useEffect, useMemo, useEffectEvent } from "react";

import type { ColumnSizingState } from "@tanstack/react-table";

import type { TTableColumn } from "../Table.types";
import {
  MIN_COLUMN_SIZE,
  MIN_NAME_COLUMN_SIZE,
  SETTINGS_COLUMN_SIZE,
  NAME_COLUMN_PERCENT,
} from "../Table.constants";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Computes default column fr-values for a given container width.
 * Used when no localStorage data exists or it is invalid.
 *
 * - `defaultSize` columns: fixed px (not in fr pool)
 * - `isShort` columns: their `minWidth` px (not in fr pool)
 * - `default` column: NAME_COLUMN_PERCENT % of the flexible area
 * - All other enabled columns: split equally from the remaining space
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

  for (const col of fixedCols) sizing[col.key] = col.defaultSize!;
  for (const col of shortCols)
    sizing[col.key] = col.minWidth ?? MIN_COLUMN_SIZE;
  if (defaultCol) sizing[defaultCol.key] = nameWidth;
  otherCols.forEach((col, i) => {
    const extra = i === 0 ? remainingWidth - perOther * otherCols.length : 0;
    sizing[col.key] = perOther + extra;
  });

  return sizing;
}

/**
 * Converts stored percentages → fr values for the current container width.
 * Falls back to computeDistribution when data is missing or invalid.
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

  const hasAll = flexCols.every((c) => percents[c.key] != null);
  if (!hasAll) return computeDistribution(cols, containerWidth);

  for (const col of flexCols) {
    const pct = percents[col.key];
    if (typeof pct !== "number" || !Number.isFinite(pct) || pct <= 0) {
      return computeDistribution(cols, containerWidth);
    }
  }

  const flexArea =
    containerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth;

  const sizing: ColumnSizingState = {};

  for (const col of fixedCols) sizing[col.key] = col.defaultSize!;
  for (const col of shortCols)
    sizing[col.key] = col.minWidth ?? MIN_COLUMN_SIZE;
  for (const col of flexCols) {
    const pct = percents[col.key];
    const minSize =
      col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);
    const px = Math.floor((flexArea * pct) / 100);
    sizing[col.key] =
      Number.isFinite(px) && px > 0 ? Math.max(px, minSize) : minSize;
  }

  return sizing;
}

/**
 * True when the container is too narrow to show all non-essential columns.
 */
function computeHideColumns(
  cols: TTableColumn[],
  containerWidth: number,
): boolean {
  if (containerWidth === 0) return false;

  const visibleCols = cols.filter((c) => c.enable !== false);
  const defaultCol = visibleCols.find((c) => c.default);
  const defaultMinWidth = defaultCol?.minWidth ?? MIN_NAME_COLUMN_SIZE;
  const shortWidth = visibleCols
    .filter((c) => c.isShort && !c.default)
    .reduce((sum, c) => sum + (c.minWidth ?? MIN_COLUMN_SIZE), 0);
  const fixedWidth = visibleCols
    .filter((c) => c.defaultSize != null)
    .reduce((sum, c) => sum + (c.defaultSize ?? 0), 0);
  const otherCount = visibleCols.filter(
    (c) => !c.default && !c.isShort && c.defaultSize == null,
  ).length;

  return (
    containerWidth <
    defaultMinWidth +
      shortWidth +
      fixedWidth +
      otherCount * MIN_COLUMN_SIZE +
      SETTINGS_COLUMN_SIZE
  );
}

export interface UseColumnDistributionResult {
  columnSizing: ColumnSizingState;
  setColumnSizing: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  containerWidth: number;
  hideColumns: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Initializes column sizing from localStorage percents (or defaults) and
 * tracks containerWidth / hideColumns via ResizeObserver.
 *
 * CSS uses `fr` units — the browser scales columns on container resize
 * automatically. ResizeObserver is only needed for:
 * 1. First render — read containerWidth, convert percents → fr sizing
 * 2. hideColumns — detect when the container is too narrow
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

  const initializedRef = useRef(false);

  // Column visibility toggle — recompute distribution and save.
  const visibleColKeysStr = useMemo(
    () =>
      cols
        .filter((c) => c.enable !== false)
        .map((c) => c.key)
        .join(","),
    [cols],
  );
  const prevVisibleColKeysRef = useRef(visibleColKeysStr);

  // ── useEffectEvent callbacks — always see latest cols/percents/saveSizing ─
  // No manual refs needed; deps arrays are clean without suppression.

  const onInit = useEffectEvent((width: number) => {
    initializedRef.current = true;
    setContainerWidth(width);
    setHideColumns(computeHideColumns(cols, width));

    const sized =
      initialPercents && Object.keys(initialPercents).length > 0
        ? percentsToSizing(cols, initialPercents, width)
        : computeDistribution(cols, width);

    setColumnSizing(sized);
    saveSizing(sized);
  });

  const onVisibilityChange = useEffectEvent((width: number) => {
    setHideColumns(computeHideColumns(cols, width));
    const sized = computeDistribution(cols, width);
    setColumnSizing(sized);
    saveSizing(sized);
  });

  const onResize = useEffectEvent((width: number) => {
    setContainerWidth(width);
    setHideColumns(computeHideColumns(cols, width));
  });

  // ── First-render init (synchronous, before paint) ────────────────────────
  // useLayoutEffect fires after DOM is ready but before the browser paints,
  // so columnSizing is set correctly on the very first frame — no flicker.
  useLayoutEffect(() => {
    const el = (containerRef as React.RefObject<HTMLDivElement>).current;
    if (!el) return;

    const width = el.clientWidth;
    if (width === 0) return;

    onInit(width);
  }, []);

  // ── Column visibility toggle — recompute distribution and save ────────────
  useLayoutEffect(() => {
    if (visibleColKeysStr === prevVisibleColKeysRef.current) return;
    prevVisibleColKeysRef.current = visibleColKeysStr;
    if (!initializedRef.current) return;

    const el = (containerRef as React.RefObject<HTMLDivElement>).current;
    const width = el?.clientWidth ?? 0;
    if (width === 0) return;

    onVisibilityChange(width);
  }, [visibleColKeysStr]);

  // ── ResizeObserver — tracks containerWidth and hideColumns only ───────────
  // CSS fr units handle proportional scaling automatically; we only need JS
  // to detect when the container becomes too narrow (hideColumns).
  useEffect(() => {
    const el = (containerRef as React.RefObject<HTMLDivElement>).current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      if (width === 0) return;

      onResize(width);
    });

    ro.observe(el, {});
    return () => ro.disconnect();
  }, []);

  return {
    columnSizing,
    setColumnSizing,
    containerWidth,
    hideColumns,
    containerRef,
  };
}

