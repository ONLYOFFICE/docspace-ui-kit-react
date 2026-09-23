import type { MouseEvent, ReactNode } from "react";

export type QuickActionItem = {
  /** Unique key of the tile; the set of ids also identifies the section. */
  id: string;
  /** Tile illustration, rendered `aria-hidden`. */
  icon: ReactNode;
  /** Visible caption and accessible name of the tile. */
  label: string;
  /** Click handler of the tile, on the button or the link alike. */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Renders the tile as a link instead of a button (ignored while disabled). */
  href?: string;
  /** Link target; `_blank` adds `rel="noopener noreferrer"`. */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Dims the tile and blocks interaction. */
  disabled?: boolean;
  /** Tooltip shown below the tile. */
  tooltipContent?: ReactNode;
  /** `data-testid` of the tile element. */
  dataTestId?: string;
};

/**
 * The close control is opt-in and comes with its label or not at all: an
 * icon-only button with no accessible name is worse than no button, so the
 * types refuse `onClose` without `closeLabel`.
 */
type QuickActionsCloseProps =
  | {
      /**
       * Hides the whole banner. When omitted no close control is rendered, so
       * a consumer that has nowhere to persist the choice keeps a carousel
       * without an affordance that would appear to do nothing on the next
       * load.
       */
      onClose: () => void;
      /** Tooltip and accessible name for the close control. */
      closeLabel: string;
    }
  | { onClose?: never; closeLabel?: never };

/**
 * The arrow labels are required rather than defaulted: a built-in English
 * fallback would hide a missing translation from every consumer, which is
 * exactly how the old "Show more" label shipped unlocalized.
 *
 * A banner pinned to `isLoading` is the one exception — it renders skeleton
 * tiles and no controls at all, so a pure loader need not reach for
 * translations it would never show. Anything that can leave the loading state,
 * including a banner whose `isLoading` is a running flag, names its arrows.
 */
type QuickActionsControlProps =
  | {
      /** Renders skeleton tiles instead of the items. */
      isLoading: true;
      prevLabel?: never;
      nextLabel?: never;
    }
  | {
      /** Renders skeleton tiles instead of the items. */
      isLoading?: boolean;
      /** Accessible name of the scroll-back arrow. */
      prevLabel: string;
      /** Accessible name of the scroll-forward arrow. */
      nextLabel: string;
    };

export type QuickActionsProps = QuickActionsCloseProps &
  QuickActionsControlProps & {
    /** Tiles to render; an empty array renders nothing unless loading. */
    items: QuickActionItem[];
    /** Class name of the outer banner element. */
    className?: string;
    /** `data-testid` of the outer banner element. */
    dataTestId?: string;
  };
