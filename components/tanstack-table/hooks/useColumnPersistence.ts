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

import type { ColumnSizingState, VisibilityState } from "@tanstack/react-table";

import type { ColumnPersistenceConfig } from "../TanStackTable.types";
import {
  readSizingFromStorage,
  writeSizingToStorage,
} from "../utils/storageMigration";

/**
 * Hook that manages column sizing and visibility persistence to localStorage.
 *
 * Key architectural decision: the storage key is **captured in a ref** at mount
 * time (or when explicitly updated via `updateStorageKey`). This prevents the
 * race condition where MobX reactively changes `columnStorageName` before the
 * component unmounts, causing writes to the wrong localStorage key.
 *
 * @param config - persistence configuration
 * @param columnKeys - ordered column keys (used for legacy format conversion)
 */
export function useColumnPersistence(
  config: ColumnPersistenceConfig,
  columnKeys: string[],
) {
  // Snapshot the storage key at mount time to avoid race conditions.
  // MobX may change config.columnStorageName reactively before unmount.
  const storageKeyRef = useRef(
    config.infoPanelVisible && config.columnInfoPanelStorageName
      ? config.columnInfoPanelStorageName
      : config.columnStorageName,
  );

  // Update ref when info panel visibility toggles (intentional change)
  const activeKey =
    config.infoPanelVisible && config.columnInfoPanelStorageName
      ? config.columnInfoPanelStorageName
      : config.columnStorageName;

  // Only update the ref if the change is driven by info panel toggle,
  // not by a tab switch (which would change columnStorageName itself)
  if (activeKey === config.columnStorageName ||
      activeKey === config.columnInfoPanelStorageName) {
    storageKeyRef.current = activeKey;
  }

  const initialSizing = useMemo<ColumnSizingState>(
    () => readSizingFromStorage(storageKeyRef.current, columnKeys) ?? {},
    // Only recompute when the storage key actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storageKeyRef.current],
  );

  const initialVisibility = useMemo<VisibilityState>(() => {
    const raw = localStorage.getItem(storageKeyRef.current);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && "visibility" in parsed) {
        return parsed.visibility as VisibilityState;
      }
    } catch {
      // Legacy format doesn't store visibility
    }
    return {};
  }, []);

  const saveSizing = useCallback(
    (sizing: ColumnSizingState) => {
      writeSizingToStorage(storageKeyRef.current, sizing, columnKeys, true);
    },
    [columnKeys],
  );

  const saveVisibility = useCallback(
    (visibility: VisibilityState) => {
      const key = storageKeyRef.current.replace("ColumnsSize", "TableColumns");
      localStorage.setItem(key, JSON.stringify(visibility));
    },
    [],
  );

  /**
   * Explicitly update the storage key. Call this when the info panel
   * toggles or when intentionally switching table views.
   * Do NOT call this from reactive MobX effects during unmount.
   */
  const updateStorageKey = useCallback(
    (newKey: string) => {
      storageKeyRef.current = newKey;
    },
    [],
  );

  return {
    initialSizing,
    initialVisibility,
    saveSizing,
    saveVisibility,
    updateStorageKey,
  };
}
