import React from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../rectangle";
import { Tooltip } from "../tooltip";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

import ArrowLeftIcon from "../../assets/arrow-left.react.svg";
import ArrowRightIcon from "../../assets/icons/16/right.arrow.react.svg";
import CrossIcon from "../../assets/icons/16/cross.react.svg";

import type { QuickActionItem, QuickActionsProps } from "./QuickActions.types";

import styles from "./QuickActions.module.scss";

// Sub-pixel slack: scrollWidth/clientWidth are rounded independently, so an
// unscrollable track can report a maximum offset of a fraction of a pixel and
// light up both arrows on a strip that cannot move.
const SCROLL_EPSILON = 1;

// How much of the current view stays on screen after paging, so the tile at the
// edge is not scrolled past unseen.
const PAGE_OVERLAP = 64;

// Scrolling toward the end raises scrollLeft in LTR and lowers it (through
// negative values) in RTL. Read the resolved direction from the element rather
// than the document so a subtree that overrides `dir` still pages correctly.
const getDirectionSign = (track: HTMLElement) =>
  getComputedStyle(track).direction === "rtl" ? -1 : 1;

// Whether the track can still move in either direction, kept in sync with
// scrolling and resizing. Both ends are reported independently so each arrow
// can be dropped at its own extreme.
// The width of the tiles themselves is reported alongside. The track is as wide
// as the banner lets it be and the tiles are centred inside it, so anchoring the
// controls to the track would put them at the edge of the empty box rather than
// at the edge of the row on every section that offers fewer tiles than the
// widest one.
const useScrollAffordance = (
  track: HTMLDivElement | null,
  itemsKey: string,
) => {
  const [affordance, setAffordance] = React.useState({
    canScrollPrev: false,
    canScrollNext: false,
    rowWidth: 0,
  });

  useIsomorphicLayoutEffect(() => {
    if (!track) {
      setAffordance({
        canScrollPrev: false,
        canScrollNext: false,
        rowWidth: 0,
      });
      return undefined;
    }

    // A different set of tiles means a different section. The component is not
    // remounted on that navigation, so the DOM would keep the offset the last
    // section was left at and open the new one with its first tile out of
    // sight. Assignment rather than `scrollTo`, so the jump is instant and
    // needs no support beyond the property itself.
    track.scrollLeft = 0;

    const measure = () => {
      const maxOffset = track.scrollWidth - track.clientWidth;
      const scrollable = maxOffset > SCROLL_EPSILON;

      // Distance travelled from the start, sign-independent: RTL counts down
      // from zero into negative values.
      const offset = Math.abs(track.scrollLeft);
      const canScrollPrev = scrollable && offset > SCROLL_EPSILON;
      const canScrollNext = scrollable && offset < maxOffset - SCROLL_EPSILON;

      // Taken from the outer edges of the row rather than from `scrollWidth`,
      // which never reports less than the track's own box and so would hand
      // back the empty width again. Read as min/max so the pair works in RTL,
      // where the first tile is the rightmost one. Rounded because it is
      // recomputed on every scroll event and sub-pixel drift alone would
      // re-render the banner for the length of the scroll.
      const first = track.firstElementChild;
      const last = track.lastElementChild;
      let rowWidth = 0;

      if (first && last) {
        const start = first.getBoundingClientRect();
        const end = last.getBoundingClientRect();

        rowWidth = Math.round(
          Math.max(start.right, end.right) - Math.min(start.left, end.left),
        );
      }

      // Keep the previous object while nothing changed: this runs on every
      // scroll event, and a fresh object each time would re-render the whole
      // banner for the length of the scroll.
      setAffordance((prev) =>
        prev.canScrollPrev === canScrollPrev &&
        prev.canScrollNext === canScrollNext &&
        prev.rowWidth === rowWidth
          ? prev
          : { canScrollPrev, canScrollNext, rowWidth },
      );
    };

    measure();

    track.addEventListener("scroll", measure, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    // The track is full-width and its height is fixed by the tiles, so its own
    // box does not change when the content that overflows it does. Observing
    // the tiles as well is what catches a late layout pass — otherwise the
    // first measurement is the only one that ever runs.
    Array.from(track.children).forEach((tile) => ro.observe(tile));

    return () => {
      track.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [track, itemsKey]);

  return affordance;
};

const QuickActionTile = ({ item }: { item: QuickActionItem }) => {
  const {
    id,
    icon,
    label,
    onClick,
    href,
    target,
    disabled,
    tooltipContent,
    dataTestId,
  } = item;

  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  const tileClassName = classNames(styles.tile, {
    [styles.disabled]: disabled,
  });

  let tile;

  if (href && !disabled) {
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    tile = (
      <a
        className={tileClassName}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={label}
        data-testid={dataTestId}
      >
        {content}
      </a>
    );
  } else {
    tile = (
      <button
        type="button"
        className={tileClassName}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        data-testid={dataTestId}
      >
        {content}
      </button>
    );
  }

  if (!tooltipContent) return tile;

  const tooltipAnchorId = `quick-action-tooltip-${id}`;

  return (
    <div id={tooltipAnchorId} className={styles.tileTooltipAnchor}>
      {tile}
      <Tooltip
        id={`${tooltipAnchorId}-instance`}
        anchorSelect={`#${tooltipAnchorId}`}
        place="bottom"
        getContent={() => tooltipContent}
      />
    </div>
  );
};

// Placeholder tile matching `.tile`'s box (size, radius, gap) so the loading
// grid lines up with the real one and there's no layout shift when it resolves.
const QuickActionTileSkeleton = () => (
  <div className={classNames(styles.tile, styles.skeletonTile)} aria-hidden>
    <RectangleSkeleton
      className={styles.skeletonIcon}
      width="100%"
      height="100%"
      borderRadius="12px"
    />
  </div>
);

export const QuickActions = ({
  items,
  className,
  dataTestId,
  onClose,
  closeLabel,
  prevLabel,
  nextLabel,
  isLoading = false,
}: QuickActionsProps) => {
  // State rather than a ref: the loading placeholder renders a track of its own
  // without one, so the real track arrives on a later render. A ref object is
  // stable, so an effect keyed on it would never re-run to measure the node
  // that replaced the placeholder.
  const [track, setTrack] = React.useState<HTMLDivElement | null>(null);

  // `useId` values carry colons, which a bare `#id` selector cannot hold.
  const instanceId = React.useId().replace(/:/g, "-");
  const closeAnchorId = `quick-actions-close-${instanceId}`;

  // The ids, not the array identity: the consumer rebuilds `items` on every
  // render, so identity would rewind the strip continuously. The count alone
  // is too coarse — two sections can offer the same number of tiles.
  const itemsKey = items.map((item) => item.id).join("|");

  const { canScrollPrev, canScrollNext, rowWidth } = useScrollAffordance(
    track,
    itemsKey,
  );

  // Handed to the stylesheet rather than applied here: the controls layer is
  // built from it together with values only the stylesheet knows. Left unset
  // until the row has been measured, so the declaration's own fallback covers
  // the first paint and any environment without layout.
  const rowWidthVar = rowWidth
    ? ({ "--_measured-row-width": `${rowWidth}px` } as React.CSSProperties)
    : undefined;

  const scrollByPage = (towardEnd: boolean) => {
    if (!track) return;

    const page = Math.max(track.clientWidth - PAGE_OVERLAP, PAGE_OVERLAP);
    const distance = page * getDirectionSign(track) * (towardEnd ? 1 : -1);

    track.scrollBy({ left: distance, behavior: "smooth" });
  };

  if (isLoading) {
    const count = items.length || 4;
    return (
      <div
        className={classNames(styles.quickActions, className)}
        data-testid={dataTestId}
      >
        <div className={styles.grid}>
          {Array.from({ length: count }, (_, index) => (
            <QuickActionTileSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  // The controls layer is a sibling of the track, absolutely positioned and
  // transparent to the pointer except on the buttons themselves, so nothing
  // here takes part in layout: the tiles and the content below keep their
  // positions whether the controls are on screen or not.
  return (
    <div
      className={classNames(styles.quickActions, className)}
      style={rowWidthVar}
      data-testid={dataTestId}
    >
      <div
        ref={setTrack}
        className={styles.grid}
        data-testid="quick-actions-track"
      >
        {items.map((item) => (
          <QuickActionTile key={item.id} item={item} />
        ))}
      </div>

      {canScrollPrev ? (
        <div className={classNames(styles.fade, styles.fadeStart)} />
      ) : null}

      {canScrollNext ? (
        <div className={classNames(styles.fade, styles.fadeEnd)} />
      ) : null}

      <div className={styles.controls}>
        {canScrollPrev ? (
          <button
            type="button"
            className={classNames(styles.control, styles.prev)}
            onClick={() => scrollByPage(false)}
            aria-label={prevLabel}
            data-testid="quick-actions-prev"
          >
            <ArrowLeftIcon />
          </button>
        ) : null}

        {canScrollNext ? (
          <button
            type="button"
            className={classNames(styles.control, styles.next)}
            onClick={() => scrollByPage(true)}
            aria-label={nextLabel}
            data-testid="quick-actions-next"
          >
            <ArrowRightIcon />
          </button>
        ) : null}

        {onClose ? (
          <button
            id={closeAnchorId}
            type="button"
            className={classNames(styles.control, styles.close)}
            onClick={onClose}
            aria-label={closeLabel}
            data-testid="quick-actions-close"
          >
            <CrossIcon />
          </button>
        ) : null}
      </div>

      {onClose ? (
        <Tooltip
          id={`${closeAnchorId}-instance`}
          anchorSelect={`#${closeAnchorId}`}
          place="bottom"
          getContent={() => closeLabel}
        />
      ) : null}
    </div>
  );
};

export type { QuickActionItem, QuickActionsProps };

export * from "./icons";

