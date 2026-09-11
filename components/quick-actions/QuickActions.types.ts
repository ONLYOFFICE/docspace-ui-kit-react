import type { MouseEvent, ReactNode } from "react";

export type QuickActionItem = {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  disabled?: boolean;
  tooltipContent?: ReactNode;
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
  | { isLoading: true; prevLabel?: never; nextLabel?: never }
  | { isLoading?: boolean; prevLabel: string; nextLabel: string };

export type QuickActionsProps = QuickActionsCloseProps &
  QuickActionsControlProps & {
    items: QuickActionItem[];
    className?: string;
    dataTestId?: string;
  };

