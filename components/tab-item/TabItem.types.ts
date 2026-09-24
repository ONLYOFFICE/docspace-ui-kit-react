import React from "react";

export type TTabItemProps = {
  /** Text of the pill. */
  label: string | React.ReactNode;
  /** Called with the click event whenever the pill is clicked and not blocked by `isDisabled` or `lockLastSelection`. */
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the pill starts selected. The component then keeps that state itself; changing this prop re-syncs it. */
  isActive?: boolean;
  /** Whether the pill is inert. Pointer events are dropped in CSS as well, unless it is also active. */
  isDisabled?: boolean;
  /** Freezes the selected look at whatever it was on mount, so the pill can be driven by something other than its own clicks. */
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
