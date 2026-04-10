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

import { useCallback, useRef, useMemo } from "react";

import type { ColumnSizingState } from "@tanstack/react-table";

import { SETTINGS_COLUMN_SIZE, MIN_COLUMN_SIZE } from "../Table.constants";

// ─── Storage helpers ───────────────────────────────────────────────────────

function isLegacyFormat(value: string): boolean {
  return value.includes("px") && !value.startsWith("{");
}

function parseLegacySizing(
  raw: string,
  columnKeys: string[],
): ColumnSizingState {
  const widths = raw
    .split(" ")
    .map((s) => parseFloat(s))
    .filter((n) => !Number.isNaN(n));

  const sizing: ColumnSizingState = {};
  for (let i = 0; i < columnKeys.length; i++) {
    const w = widths[i];
    if (w !== undefined && w !== SETTINGS_COLUMN_SIZE) {
      sizing[columnKeys[i]] = w;
    }
  }
  return sizing;
}

function readSizing(
  storageKey: string,
  columnKeys: string[],
): ColumnSizingState | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    if (isLegacyFormat(raw)) return parseLegacySizing(raw, columnKeys);
    return JSON.parse(raw) as ColumnSizingState;
  } catch {
    return null;
  }
}

function writeSizing(
  storageKey: string,
  sizing: ColumnSizingState,
  columnKeys: string[],
): void {
  // Write both formats simultaneously for rollback compatibility.
  const parts = columnKeys.map((k) => `${sizing[k] ?? MIN_COLUMN_SIZE}px`);
  parts.push(`${SETTINGS_COLUMN_SIZE}px`);
  localStorage.setItem(storageKey, parts.join(" "));
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export interface ColumnPersistenceConfig {
  columnStorageName: string;
  columnInfoPanelStorageName?: string;
  infoPanelVisible?: boolean;
}

/**
 * Manages column sizing persistence to localStorage.
 *
 * The active storage key is:
 * - `columnInfoPanelStorageName` when `infoPanelVisible && columnInfoPanelStorageName`
 * - `columnStorageName` otherwise
 *
 * The key is captured in a ref so MobX reactive changes during unmount do not
 * write sizing to the wrong key.
 */
export function useColumnPersistence(
  config: ColumnPersistenceConfig,
  columnKeys: string[],
) {
  const resolveKey = () =>
    config.infoPanelVisible && config.columnInfoPanelStorageName
      ? config.columnInfoPanelStorageName
      : config.columnStorageName;

  const storageKeyRef = useRef<string>(resolveKey());

  // Keep ref in sync when info panel visibility changes (intentional toggle,
  // not a reactive side effect).
  const newKey = resolveKey();
  if (newKey !== storageKeyRef.current) {
    storageKeyRef.current = newKey;
  }

  const initialSizing = useMemo<ColumnSizingState>(
    () => readSizing(storageKeyRef.current, columnKeys) ?? {},
    // Only recompute when the resolved storage key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storageKeyRef.current],
  );

  const saveSizing = useCallback(
    (sizing: ColumnSizingState) => {
      writeSizing(storageKeyRef.current, sizing, columnKeys);
    },
    [columnKeys],
  );

  return { initialSizing, saveSizing };
}
