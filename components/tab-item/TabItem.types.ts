import React from "react";

export type TTabItemProps = React.AriaAttributes & {
  /** Text of the pill, cut off with an ellipsis when it does not fit. */
  label: string | React.ReactNode;
  /** Called with the click event whenever the pill is clicked and not blocked by `isDisabled` or `lockLastSelection`. */
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the pill starts selected. The pill then keeps that state itself, and a change of this prop re-syncs it. */
  isActive?: boolean;
  /** Ignores clicks and dims the pill. A pill that is also selected keeps its full selected look. */
  isDisabled?: boolean;
  /** Keeps the selected look the pill had on mount: neither clicks nor later `isActive` changes alter it. */
  allowNoSelection?: boolean;
  /** Whether clicking an already selected pill deselects it. Without this a selected pill stays selected. */
  withMultiSelect?: boolean;
  /** Applied to the outermost element. */
  className?: string;
  /** `data-testid` of the outermost element. */
  dataTestId?: string;
  /** Whether a click on an already selected pill is dropped entirely — `onSelect` does not fire either. */
  lockLastSelection?: boolean;
};
