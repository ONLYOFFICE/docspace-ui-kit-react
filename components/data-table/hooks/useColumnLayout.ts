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
 * - When the user shows or hides a column (`expectChange`, then the columns
 *   that follow it), it is hidden or shown by the engine's rules, in the same
 *   render, and the result is stored.
 * - When the visible columns change on their own (a record of them read after
 *   the first render, a column a socket brings), the shares are restored from
 *   `storage` for the new set and nothing is stored. Without `storage` there
 *   is nothing to restore, so the engine's rules apply as for the user.
 * - A different `storage.id` restores again; the same id with a new adapter
 *   object does nothing.
 * - The container is watched: once the columns no longer fit at their
 *   minimums the layout turns compact, and back when they fit again. A
 *   collapsed container (width 0) is never compact. The shares are untouched
 *   either way, so the proportions come back with the width.
 *
 * The storage is written only when the user changed something: a resize, a
 * reset or a column shown or hidden. Restoring and rendering never
 * write, so a window that only renders cannot overwrite a record another
 * window saved.
 *
 * `flexibleTotal` counts the table's flexible columns, hidden ones included:
 * a column shown takes that share of the flexible area.
 */
export const useColumnLayout = (
  columns: LayoutColumn[],
  storage: WidthStorage | undefined,
  flexibleTotal?: number,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(0);
  const pendingSaveRef = useRef<ColumnFractions | null>(null);
  const expectedRef = useRef<{ id: string; visible: boolean } | null>(null);

  const signature = signatureOf(columns);
  const storageId = storage?.id ?? null;

  const restore = (width: number): LayoutState => ({
    signature,
    columns,
    storageId,
    measuredAt: width,
    fractions: restoreFractions(columns, storage?.load(), width, flexibleTotal),
  });

  const [state, setState] = useState<LayoutState>(() => restore(0));

  // Derived from props, so adjusted during render rather than in an effect:
  // React re-renders this component at once and the stale shares never paint.
  let current = state;
  if (state.storageId !== storageId) {
    current = restore(widthRef.current);
    pendingSaveRef.current = null;
    expectedRef.current = null;
    setState(current);
  } else if (state.signature !== signature) {
    const expected = expectedRef.current;
    const has = (list: LayoutColumn[]) =>
      list.some((column) => column.id === expected?.id);
    const byUser =
      expected !== null &&
      has(columns) === expected.visible &&
      has(state.columns) !== expected.visible;
    // A choice is answered by the very next change of the columns, or never:
    // one the consumer turned down must not claim a later change that happens
    // to match it, a socket bringing the same column, say.
    expectedRef.current = null;

    if (byUser || !storage) {
      current = {
        ...state,
        signature,
        columns,
        fractions: reconcileColumns(
          state.columns,
          columns,
          state.fractions,
          widthRef.current,
          flexibleTotal,
        ),
      };
      if (byUser) pendingSaveRef.current = current.fractions;
    } else {
      current = restore(widthRef.current);
    }
    setState(current);
  }
  // The signature leaves out what moves no share, such as `resizable`, so a
  // change to that alone keeps the stored columns; the ones in use are always
  // this render's. Not stored: a consumer passing a new array every render
  // would re-render forever.
  if (current.columns !== columns) current = { ...current, columns };

  const storageRef = useRef(storage);
  storageRef.current = storage;
  const flexibleTotalRef = useRef(flexibleTotal);
  flexibleTotalRef.current = flexibleTotal;

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
              flexibleTotalRef.current,
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

  /** Says the user is about to show or hide this column. */
  const expectChange = useCallback((id: string, visible: boolean) => {
    expectedRef.current = { id, visible };
  }, []);

  return {
    containerRef,
    expectChange,
    /** The visible columns the shares belong to. */
    columns: current.columns,
    fractions: current.fractions,
    gridTemplate,
    compact,
    commit,
    reset,
  };
};
