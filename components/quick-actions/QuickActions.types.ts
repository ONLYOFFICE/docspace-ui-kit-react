import type { MouseEvent, ReactNode } from "react";

export type QuickActionItem = {
  /** Identity of the tile: its React key, and what tells one section's tiles from another's. */
  id: string;
  /** Picture above the label, in an 81×75 box (48×45 at tablet and below). An `<svg>` fills the box. */
  icon: ReactNode;
  /** Text under the icon, and the tile's accessible name. Clamped to two lines. */
  label: string;
  /** Called with the event when the tile is activated, whether it is a button or a link. */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Makes the tile a link to this address. A disabled tile stays a button whatever this says. */
  href?: string;
  /** Target of that link. `"_blank"` also adds `rel="noopener noreferrer"`. */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Whether the tile is inert: it fades to half opacity and stops taking the pointer. */
  disabled?: boolean;
  /** Content of a tooltip shown under the tile on hover. Without it the tile has no tooltip. */
  tooltipContent?: ReactNode;
  /** `data-testid` of the tile. Without it the tile carries none. */
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
       * Called when the close control is clicked; the banner stays until you
       * remove it. Without it no close control is drawn.
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
      /** Draws skeleton tiles instead of the real ones, and no arrows or cross. */
      isLoading: true;
      /** Accessible name of the arrow that scrolls back. Required, and localized by you, unless `isLoading` is pinned to `true`. */
      prevLabel?: never;
      /** Accessible name of the arrow that scrolls on. Required, and localized by you, unless `isLoading` is pinned to `true`. */
      nextLabel?: never;
    }
  | {
      /** Draws skeleton tiles instead of the real ones, and no arrows or cross. */
      isLoading?: boolean;
      /** Accessible name of the arrow that scrolls back. Required, and localized by you, unless `isLoading` is pinned to `true`. */
      prevLabel: string;
      /** Accessible name of the arrow that scrolls on. Required, and localized by you, unless `isLoading` is pinned to `true`. */
      nextLabel: string;
    };

export type QuickActionsProps = React.AriaAttributes &
  QuickActionsCloseProps &
  QuickActionsControlProps & {
    /** The tiles, in the order they are drawn. An empty array renders nothing at all. */
    items: QuickActionItem[];
    /** Applied to the banner, after the component's own class. */
    className?: string;
    /** `data-testid` of the banner. The track and the controls carry ids of their own. */
    dataTestId?: string;
  };
