import type React from "react";
import { useRef, useState } from "react";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import {
  type ColumnFractions,
  type LayoutColumn,
  resizeColumn,
  toLogicalDelta,
} from "../layout/engine";
import { buildGridTemplate } from "../layout/grid";

/** Pixels an arrow key moves a column edge; Shift moves five times as far. */
const KEY_STEP = 10;
const KEY_STEP_LARGE = 50;

type Drag = {
  columnId: string;
  pointerId: number;
  startX: number;
  width: number;
  startFractions: ColumnFractions;
  latest: ColumnFractions;
  /** Whether a frame is pending; the id alone cannot say, see onPointerMove. */
  scheduled: boolean;
  frame: number;
};

type UseColumnResizeOptions = {
  /** The visible columns, as the layout knows them. */
  columns: LayoutColumn[];
  /** The committed shares. */
  fractions: ColumnFractions;
  /** The table element, which carries the grid variable. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Applies and stores shares the user chose. */
  commit: (fractions: ColumnFractions) => void;
  /** Back to the default layout. */
  reset: () => void;
};

/** Everything a resize handle needs, spread onto it by the header. */
export type ResizeHandleBindings = {
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onDoubleClick: () => void;
};

/**
 * Drag and keyboard resizing of the column edges.
 *
 * A drag never re-renders React: each animation frame writes the new grid to
 * the table's `--data-table-grid` property, and the rows, which only read that
 * property, follow. On pointer-up the shares are committed once, and stored.
 * A cancelled pointer puts the grid back as it was and stores nothing.
 *
 * Arrow keys on a focused handle move the edge by 10 px, 50 px with Shift, in
 * the visual direction of the key; a double click resets the layout.
 */
export const useColumnResize = ({
  columns,
  fractions,
  containerRef,
  commit,
  reset,
}: UseColumnResizeOptions) => {
  const { isRTL } = useInterfaceDirection();
  const dragRef = useRef<Drag | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  const measure = () =>
    containerRef.current?.getBoundingClientRect().width ?? 0;

  const writeGrid = (shares: ColumnFractions) => {
    containerRef.current?.style.setProperty(
      "--data-table-grid",
      buildGridTemplate(columns, shares, false),
    );
  };

  const end = (event: React.PointerEvent<HTMLElement>, apply: boolean) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    if (drag.scheduled) cancelAnimationFrame(drag.frame);
    dragRef.current = null;
    setResizingId(null);

    if (event.currentTarget.hasPointerCapture?.(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    }

    if (!apply) {
      writeGrid(drag.startFractions);
      return;
    }

    // The last frame may not have been drawn yet; React writes the same value
    // on the commit's render, this only avoids a frame of the old grid.
    writeGrid(drag.latest);
    if (drag.latest !== drag.startFractions) commit(drag.latest);
  };

  const bind = (columnId: string): ResizeHandleBindings => ({
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      try {
        // Keeps the moves coming to the handle once the pointer leaves it.
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {
        // Not an active pointer (a synthetic event): the drag still works
        // while the pointer stays over the handle.
      }

      dragRef.current = {
        columnId,
        pointerId: event.pointerId,
        startX: event.clientX,
        width: measure(),
        startFractions: fractions,
        latest: fractions,
        scheduled: false,
        frame: 0,
      };
      setResizingId(columnId);
    },

    onPointerMove: (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      drag.latest = resizeColumn(
        columns,
        drag.startFractions,
        drag.width,
        drag.columnId,
        toLogicalDelta(event.clientX - drag.startX, isRTL),
      );

      // One write per frame. The flag says whether one is pending: the id is
      // assigned after `requestAnimationFrame` returns, which can be after the
      // callback already ran.
      if (!drag.scheduled) {
        drag.scheduled = true;
        drag.frame = requestAnimationFrame(() => {
          drag.scheduled = false;
          writeGrid(drag.latest);
        });
      }
    },

    onPointerUp: (event) => end(event, true),
    onPointerCancel: (event) => end(event, false),

    onKeyDown: (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
      const deltaX = event.key === "ArrowRight" ? step : -step;
      const next = resizeColumn(
        columns,
        fractions,
        measure(),
        columnId,
        toLogicalDelta(deltaX, isRTL),
      );

      if (next !== fractions) commit(next);
    },

    onDoubleClick: reset,
  });

  return { bind, resizingId };
};
