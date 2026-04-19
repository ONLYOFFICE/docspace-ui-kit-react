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

import type { Nullable } from "../../../../types";
import {
  DEFAULT_MIN_COLUMN_SIZE,
  HANDLE_OFFSET,
  SETTINGS_SIZE,
} from "../../Table.constants";
import { getSubstring } from "../../Table.utils";
import {
  getColumnStorageKey,
  moveToLeft,
  moveToRight,
  saveColumnSizes,
} from "../TableHeader.utils";
import type { UseTableHeaderResizeOptions } from "./use-table-header-resize";

type UseColumnDragOptions = {
  optionsRef: React.RefObject<UseTableHeaderResizeOptions>;
  headerRef: React.RefObject<HTMLDivElement | null>;
};

export function useColumnDrag({
  optionsRef,
  headerRef,
}: UseColumnDragOptions): {
  onPointerDown: (e: React.PointerEvent) => void;
} {
  const columnIndexRef = useRef<Nullable<number>>(null);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.target) {
      const target = event.target as HTMLDivElement;
      if (target.dataset.column) {
        columnIndexRef.current = +target.dataset.column;
      }
    }

    const container = optionsRef.current.containerRef.current;
    if (!container) return;

    const pointerId = event.pointerId;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    // Cache DOM context — one lookup per drag, indices aligned with columns
    const cols = optionsRef.current.columns;
    const columnEls: (HTMLElement | null)[] = [];
    for (let i = 0; i < cols.length; i++) {
      columnEls.push(document.getElementById(`column_${i}`));
    }
    const rowEls = optionsRef.current.useReactWindow
      ? Array.from(
          container.querySelectorAll<HTMLElement>(
            ".table-row, .table-list-item",
          ),
        )
      : [];

    // Snapshot exact px widths — eliminates subpixel drift and empty grid
    const initWidths = columnEls.map(
      (el) => `${Math.round(el?.getBoundingClientRect().width ?? 0)}px`,
    );
    initWidths.push(`${SETTINGS_SIZE}px`);

    // Keep widths in closure — avoid parsing gridTemplateColumns on every frame
    const widths: string[] = [...initWidths];
    let pendingStr: string | null = initWidths.join(" ");
    let rafId: number | null = null;

    const applyWidths = () => {
      rafId = null;
      if (pendingStr == null) return;
      const str = pendingStr;
      pendingStr = null;
      container.style.gridTemplateColumns = str;
      if (headerRef.current)
        headerRef.current.style.gridTemplateColumns = str;
      for (const r of rowEls) r.style.gridTemplateColumns = str;
    };

    // Initial write synchronously so first frame is correct
    applyWidths();

    const schedule = (str: string) => {
      pendingStr = str;
      if (rafId == null) rafId = requestAnimationFrame(applyWidths);
    };

    const cleanup = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("pointercancel", handleMouseUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };

    const handleMouseMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;

      const columnIndex = columnIndexRef.current;
      if (columnIndex === null) return;

      const column = columnEls[columnIndex];
      if (!column) return;

      const opts = optionsRef.current;
      const columnSize = column.getBoundingClientRect();
      let newWidth = opts.isRTL
        ? columnSize.right - e.clientX
        : e.clientX - columnSize.left;

      const minSize = column.dataset.minWidth
        ? +column.dataset.minWidth
        : DEFAULT_MIN_COLUMN_SIZE;

      if (newWidth <= minSize - HANDLE_OFFSET) {
        const currentWidth = getSubstring(widths[columnIndex]);
        if (currentWidth !== minSize) {
          newWidth = minSize - HANDLE_OFFSET;
          moveToRight(
            widths,
            columnIndex,
            newWidth,
            cols.length,
            columnEls,
            opts.isIndexEditingMode,
          );
        } else {
          moveToLeft(
            widths,
            columnIndex,
            newWidth,
            columnEls,
            opts.isIndexEditingMode,
          );
        }
      } else {
        moveToRight(
          widths,
          columnIndex,
          newWidth,
          cols.length,
          columnEls,
          opts.isIndexEditingMode,
        );
      }

      schedule(widths.join(" "));
    };

    const handleMouseUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;

      // Cancel any pending rAF and flush final state synchronously
      if (rafId != null) cancelAnimationFrame(rafId);
      pendingStr = widths.join(" ");
      applyWidths();

      const opts = optionsRef.current;
      const str = container.style.gridTemplateColumns;
      const key = getColumnStorageKey(
        opts.infoPanelVisible,
        opts.columnStorageName,
        opts.columnInfoPanelStorageName,
      );
      saveColumnSizes(key, str);

      cleanup();
    };

    const onVisibilityChange = () => {
      if (document.hidden) cleanup();
    };

    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("pointercancel", handleMouseUp);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return { onPointerDown };
}
