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

import { useCallback, useRef } from "react";

import type { ColumnSizingState } from "@tanstack/react-table";

import type { TTableColumn } from "../Table.types";

// ─── Storage format ────────────────────────────────────────────────────────────
//
// Values are stored as a JSON object of percentages relative to the flexible
// area (containerWidth - SETTINGS_COLUMN_SIZE - fixedWidth - shortWidth).
// Only visible flexible columns are included (no fixed-size, no short, no hidden).
//
// Example: { "Name": 40, "People": 30, "Head of Group": 30 }
//
// Legacy px format ("300px 200px 24px") from the old table is intentionally
// ignored — columns will be recomputed from defaults when legacy data is found.

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** True when the stored string looks like the legacy px-space-separated format. */
function isLegacyPxFormat(raw: string): boolean {
  return raw.includes("px");
}

/**
 * Validates a parsed percentages object.
 *
 * Rules:
 * - Must be a plain object with at least one key
 * - Every value must be a finite number strictly greater than 0
 * - The sum of all values must be within ±2 of 100 (rounding tolerance)
 */
function isValidPercents(percents: Record<string, number>): boolean {
  const keys = Object.keys(percents);
  if (keys.length === 0) return false;

  let sum = 0;
  for (const key of keys) {
    const v = percents[key];
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) return false;
    sum += v;
  }

  // Allow ±2 to accommodate floating-point rounding across many columns
  return sum >= 98 && sum <= 102;
}

/**
 * Read stored column percentages.
 * Returns null and clears the stale entry when the data is missing, in legacy
 * px format, structurally invalid, or contains NaN/null/negative values.
 */
function readPercents(storageKey: string): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    // Legacy px format from the old table — drop it, fall back to fresh compute
    if (isLegacyPxFormat(raw)) {
      localStorage.removeItem(storageKey);
      return null;
    }

    const parsed = JSON.parse(raw) as Record<string, number>;

    if (
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      parsed === null
    ) {
      localStorage.removeItem(storageKey);
      return null;
    }

    if (!isValidPercents(parsed)) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return parsed;
  } catch {
    // JSON.parse failure or localStorage access error
    localStorage.removeItem(storageKey);
    return null;
  }
}

/**
 * Save column sizes as percentages of the flex pool.
 *
 * Only flex columns (enabled, no defaultSize, not isShort) are persisted.
 * The flex pool = sum of all flex column px sizes at save time.
 */
function writePercents(
  storageKey: string,
  sizing: ColumnSizingState,
  cols: TTableColumn[],
): void {
  const flexCols = cols.filter(
    (c) => c.enable !== false && !c.defaultSize && !c.isShort,
  );
  const flexTotal = flexCols.reduce((sum, c) => sum + (sizing[c.key] ?? 0), 0);
  if (flexTotal <= 0) return;

  const percents: Record<string, number> = {};
  for (const col of flexCols) {
    percents[col.key] = ((sizing[col.key] ?? 0) / flexTotal) * 100;
  }

  localStorage.setItem(storageKey, JSON.stringify(percents));
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export interface ColumnPersistenceConfig {
  columnStorageName: string;
  columnInfoPanelStorageName?: string;
  infoPanelVisible?: boolean;
}

/**
 * Manages column sizing persistence to localStorage.
 *
 * - Sizes are stored as **percentages** of the flexible area so they scale
 *   correctly to any container width on the next load.
 * - The active storage key switches between `columnStorageName` and
 *   `columnInfoPanelStorageName` depending on `infoPanelVisible`.
 * - `cols` is kept in a ref so MobX reactive changes don't cause stale
 *   closures in `saveSizing`.
 */
export function useColumnPersistence(
  config: ColumnPersistenceConfig,
  columnKeys: string[],
  cols: TTableColumn[],
): {
  initialPercents: Record<string, number> | null;
  saveSizing: (sizing: ColumnSizingState) => void;
} {
  const resolveKey = () =>
    config.infoPanelVisible && config.columnInfoPanelStorageName
      ? config.columnInfoPanelStorageName
      : config.columnStorageName;

  // Resolve the active storage key — switches when info panel is toggled.
  const resolvedKey = resolveKey();

  const storageKeyRef = useRef<string>(resolvedKey);

  // Keep cols in a ref so saveSizing always uses the latest column list
  // without needing to be recreated on every render.
  const colsRef = useRef(cols);
  colsRef.current = cols;

  // Read percentages from localStorage exactly once per active storage key,
  // using a ref so the value is stable and never re-read by React internals
  // (avoids useMemo invalidation in concurrent mode).
  //
  // When the key changes (info panel toggle), update the ref and re-read.
  // This is safe in the render body because it's a pure synchronous read with
  // no side effects visible to React.
  const initialPercentsRef = useRef<Record<string, number> | null>(
    readPercents(resolvedKey),
  );

  if (resolvedKey !== storageKeyRef.current) {
    storageKeyRef.current = resolvedKey;
    initialPercentsRef.current = readPercents(resolvedKey);
  }

  const initialPercents = initialPercentsRef.current;

  // Stable callback — cols and storage key are read from refs.
  const saveSizing = useCallback((sizing: ColumnSizingState) => {
    writePercents(storageKeyRef.current, sizing, colsRef.current);
  }, []);

  // columnKeys kept in signature for API compatibility; not used directly here.
  void columnKeys;

  return { initialPercents, saveSizing };
}

