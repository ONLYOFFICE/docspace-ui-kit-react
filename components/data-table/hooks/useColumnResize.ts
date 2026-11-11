import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import {
  type ColumnFractions,
  getEdgeOffset,
  type LayoutColumn,
  resizeColumn,
  toLogicalDelta,
} from "../layout/engine";
import { buildGridTemplate } from "../layout/grid";
import styles from "../DataTable.module.scss";

/** Pixels an arrow key moves a column edge; Shift moves five times as far. */
const KEY_STEP = 10;
const KEY_STEP_LARGE = 50;

/** Which columns a drag resizes; the shares it holds are keyed by them. */
const idsOf = (columns: LayoutColumn[]) =>
  columns.map((column) => column.id).join("|");

type Drag = {
  columnId: string;
  /** The columns the drag started on, as `idsOf` gives them. */
  ids: string;
  pointerId: number;
  /** The handle the drag started on. */
  handle: HTMLElement;
  startX: number;
  /** Where the edge was when the drag started, along the reading direction. */
  startEdge: number;
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
  /** The grid the table renders with, compact or not. */
  gridTemplate: string;
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
 * A drag never re-renders React: each animation frame writes the new grid
 * onto the header row and the rows themselves, and on pointer-up back to the
 * table's `--data-table-grid` property, which they read again; the shares are
 * committed once, and stored. A row that mounts mid-drag shows the grid the
 * drag started from until it ends.
 * A cancelled pointer puts the grid back as it was and stores nothing. So does
 * a release after the handle went away mid-drag, as when the container
 * narrows and the table turns compact: the window hears it, since the handle
 * cannot. A drag also ends that way once the visible columns change under it,
 * a column a socket brings, say: its shares belong to the old set. Each
 * move resizes the current widths by the distance from the edge to the
 * pointer, so turning back mid-drag widens the edge's neighbour.
 *
 * Arrow keys on a focused handle move the edge by 10 px, 50 px with Shift, in
 * the visual direction of the key; a double click resets the layout.
 *
 * `bind` is the same function on every render, and every handler reads the
 * layout of the latest one, so the header is not drawn again for a new `bind`
 * and a handler kept by the window never works on columns gone stale.
 */
export const useColumnResize = (options: UseColumnResizeOptions) => {
  const { containerRef } = options;
  const { isRTL } = useInterfaceDirection();
  const latestRef = useRef({ ...options, isRTL });
  latestRef.current = { ...options, isRTL };
  const dragRef = useRef<Drag | null>(null);
  const detachRef = useRef<(() => void) | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  useEffect(() => () => detachRef.current?.(), []);

  const bind = useCallback(
    (columnId: string): ResizeHandleBindings => {
      const measure = () =>
        containerRef.current?.getBoundingClientRect().width ?? 0;

      /** The header row and the rows of this table, not of a table inside it. */
      const gridRows = () => {
        const table = containerRef.current;
        if (!table) return [];
        return Array.from(
          table.querySelectorAll<HTMLElement>(
            `.${styles.headerRow}, .${styles.row}`,
          ),
        ).filter((row) => row.closest('[role="table"]') === table);
      };

      // While dragging, the grid goes straight onto each row.
      // `--data-table-grid` is inherited, so a new value on the table restyles
      // every element in it, which for a few hundred rows costs a frame many
      // times over; `grid-template-columns` restyles the rows alone.
      const writeRows = (shares: ColumnFractions) => {
        const template = buildGridTemplate(
          latestRef.current.columns,
          shares,
          false,
        );
        for (const row of gridRows()) {
          row.style.setProperty("grid-template-columns", template);
        }
      };

      /** Back to the table's property, set once, with the rows reading it again. */
      const writeGrid = (template: string) => {
        containerRef.current?.style.setProperty("--data-table-grid", template);
        for (const row of gridRows()) {
          row.style.removeProperty("grid-template-columns");
        }
      };

      /** Whether the visible columns are still the ones the drag started on. */
      const sameColumns = (drag: Drag) =>
        idsOf(latestRef.current.columns) === drag.ids;

      const end = (pointerId: number, apply: boolean) => {
        const drag = dragRef.current;
        if (!drag || pointerId !== drag.pointerId) return;

        if (drag.scheduled) cancelAnimationFrame(drag.frame);
        dragRef.current = null;
        detachRef.current?.();
        detachRef.current = null;
        setResizingId(null);

        if (drag.handle.hasPointerCapture?.(drag.pointerId)) {
          drag.handle.releasePointerCapture(drag.pointerId);
        }

        const { columns, gridTemplate, commit } = latestRef.current;

        // The handle is gone, or the columns it resized are: the rows go back
        // to the grid the table renders now.
        if (!drag.handle.isConnected || !sameColumns(drag)) {
          writeGrid(gridTemplate);
          return;
        }

        if (!apply) {
          writeGrid(buildGridTemplate(columns, drag.startFractions, false));
          return;
        }

        // React writes the same value on the commit's render; this hands the
        // rows back to the property now, so no frame shows the old grid.
        writeGrid(buildGridTemplate(columns, drag.latest, false));
        if (drag.latest !== drag.startFractions) commit(drag.latest);
      };

      return {
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

          // Also heard by the window, in case the handle goes before the
          // release. The handle's own events come first, so this is a no-op
          // otherwise.
          detachRef.current?.();
          const onUp = (e: PointerEvent) => end(e.pointerId, true);
          const onCancel = (e: PointerEvent) => end(e.pointerId, false);
          window.addEventListener("pointerup", onUp);
          window.addEventListener("pointercancel", onCancel);
          detachRef.current = () => {
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onCancel);
          };

          const { columns, fractions } = latestRef.current;
          const width = measure();
          dragRef.current = {
            columnId,
            ids: idsOf(columns),
            pointerId: event.pointerId,
            handle: event.currentTarget,
            startX: event.clientX,
            startEdge: getEdgeOffset(columns, fractions, width, columnId),
            width,
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
          if (!sameColumns(drag)) {
            end(drag.pointerId, false);
            return;
          }

          // Each move goes from where the edge is now to where the pointer is,
          // on the current widths, as the old table did. Replaying the whole
          // movement on the widths the drag started with would, on the way
          // back, first give width to the column squeezed last (the far one)
          // instead of the neighbour. An edge stuck at the minimums stays put
          // until the pointer comes back to it.
          const { columns, isRTL: rtl } = latestRef.current;
          const target = toLogicalDelta(event.clientX - drag.startX, rtl);
          const moved =
            getEdgeOffset(columns, drag.latest, drag.width, drag.columnId) -
            drag.startEdge;

          drag.latest = resizeColumn(
            columns,
            drag.latest,
            drag.width,
            drag.columnId,
            target - moved,
          );

          // One write per frame. The flag says whether one is pending: the id
          // is assigned after `requestAnimationFrame` returns, which can be
          // after the callback already ran.
          if (!drag.scheduled) {
            drag.scheduled = true;
            drag.frame = requestAnimationFrame(() => {
              drag.scheduled = false;
              writeRows(drag.latest);
            });
          }
        },

        onPointerUp: (event) => end(event.pointerId, true),
        onPointerCancel: (event) => end(event.pointerId, false),

        onKeyDown: (event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();

          const { columns, fractions, commit, isRTL: rtl } = latestRef.current;
          const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
          const deltaX = event.key === "ArrowRight" ? step : -step;
          const next = resizeColumn(
            columns,
            fractions,
            measure(),
            columnId,
            toLogicalDelta(deltaX, rtl),
          );

          if (next !== fractions) commit(next);
        },

        onDoubleClick: () => latestRef.current.reset(),
      };
    },
    [containerRef],
  );

  return { bind, resizingId };
};
