import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type ColumnFractions,
  type LayoutColumn,
  getDefaultFractions,
  isCompact,
  reconcileColumns,
  restoreFractions,
} from "../layout/engine";
import { buildGridTemplate } from "../layout/grid";
import type { WidthStorage } from "../layout/storage";

type LayoutState = {
  /** The column set the shares belong to, as compared between renders. */
  signature: string;
  /** The columns themselves, to reconcile from when the set changes. */
  columns: LayoutColumn[];
  /** Which stored record the shares were restored from. */
  storageId: string | null;
  /** Container width the shares were last derived at; 0 until measured. */
  measuredAt: number;
  fractions: ColumnFractions;
};

const signatureOf = (columns: LayoutColumn[]) =>
  columns
    .map(({ id, width }) => {
      const size = width.type === "fixed" ? width.size : (width.min ?? "");
      return `${id}:${width.type}:${size}`;
    })
    .join("|");

/**
 * Owns the column shares of one table and turns them into the one
 * `grid-template-columns` value the header and every row read.
 *
 * - The shares are restored from `storage` before the first paint, at the
 *   measured container width, so the table never flashes a default layout.
 * - When the visible columns change, removed columns are hidden and added ones
 *   shown by the engine's rules, in the same render, and the result is stored.
 * - A different `storage.id` restores again; the same id with a new adapter
 *   object does nothing.
 * - The container is watched: once the columns no longer fit at their
 *   minimums the layout turns compact, and back when they fit again. A
 *   collapsed container (width 0) is never compact. The shares are untouched
 *   either way, so the proportions come back with the width.
 *
 * The storage is written only when the user changed something: a resize, a
 * reset or a change of the visible columns. Restoring and rendering never
 * write, so a window that only renders cannot overwrite a record another
 * window saved.
 */
export const useColumnLayout = (
  columns: LayoutColumn[],
  storage: WidthStorage | undefined,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(0);
  const pendingSaveRef = useRef<ColumnFractions | null>(null);

  const signature = signatureOf(columns);
  const storageId = storage?.id ?? null;

  const restore = (width: number): LayoutState => ({
    signature,
    columns,
    storageId,
    measuredAt: width,
    fractions: restoreFractions(columns, storage?.load(), width),
  });

  const [state, setState] = useState<LayoutState>(() => restore(0));

  // Derived from props, so adjusted during render rather than in an effect:
  // React re-renders this component at once and the stale shares never paint.
  let current = state;
  if (state.storageId !== storageId) {
    current = restore(widthRef.current);
    pendingSaveRef.current = null;
    setState(current);
  } else if (state.signature !== signature) {
    current = {
      ...state,
      signature,
      columns,
      fractions: reconcileColumns(
        state.columns,
        columns,
        state.fractions,
        widthRef.current,
      ),
    };
    pendingSaveRef.current = current.fractions;
    setState(current);
  }

  const storageRef = useRef(storage);
  storageRef.current = storage;

  useEffect(() => {
    if (!pendingSaveRef.current) return;
    storageRef.current?.save(pendingSaveRef.current);
    pendingSaveRef.current = null;
  });

  // Only a re-render trigger: the value used below is computed from the width
  // and the current columns, so it is right in the very render the columns
  // change in.
  const [, setCompactFlag] = useState(false);
  const columnsRef = useRef(current.columns);
  columnsRef.current = current.columns;

  const compact =
    widthRef.current > 0 && isCompact(current.columns, widthRef.current);

  // Runs once per mount: a new storage id is handled during render above.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const measure = () => {
      widthRef.current = element.getBoundingClientRect().width;
      setCompactFlag(
        widthRef.current > 0 && isCompact(columnsRef.current, widthRef.current),
      );
    };
    measure();

    // The first restore ran before there was a width to apply the minimums
    // at; redo it now, still before the browser paints.
    setState((prev) =>
      prev.measuredAt === 0 && widthRef.current > 0
        ? {
            ...prev,
            measuredAt: widthRef.current,
            fractions: restoreFractions(
              prev.columns,
              storageRef.current?.load(),
              widthRef.current,
            ),
          }
        : prev,
    );

    // One measurement per frame however often the observer fires. The flag,
    // not the frame id, says whether one is pending: the id is assigned after
    // `requestAnimationFrame` returns, which can be after the callback ran.
    let scheduled = false;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(() => {
        scheduled = false;
        measure();
      });
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (scheduled) cancelAnimationFrame(frame);
    };
  }, []);

  const gridTemplate = useMemo(
    () => buildGridTemplate(current.columns, current.fractions, compact),
    [current.columns, current.fractions, compact],
  );

  /** Applies shares the user chose and remembers them. */
  const commit = useCallback((fractions: ColumnFractions) => {
    setState((prev) => ({ ...prev, fractions }));
    storageRef.current?.save(fractions);
  }, []);

  /** Back to 40/60, and forgets the stored record. */
  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fractions: getDefaultFractions(prev.columns, widthRef.current),
    }));
    storageRef.current?.clear();
  }, []);

  return {
    containerRef,
    /** The visible columns the shares belong to. */
    columns: current.columns,
    fractions: current.fractions,
    gridTemplate,
    compact,
    commit,
    reset,
  };
};
