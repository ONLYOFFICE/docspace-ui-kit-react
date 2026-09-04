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

export type QuickActionsProps = {
  items: QuickActionItem[];
  className?: string;
  dataTestId?: string;
  /**
   * Label for the "show more" affordance that reveals the hidden tiles. Only
   * shown when the grid collapses (more than 4 items on tablet/mobile).
   * Expanding is one-way — there is no "show less". The consumer supplies the
   * localized string; defaults to "Show more".
   */
  showMoreLabel?: string;

  isLoading?: boolean;
};

