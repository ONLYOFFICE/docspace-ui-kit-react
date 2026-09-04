import React from "react";

export type TTabItemProps = {
  /** Tab item text. */
  label: string | React.ReactNode;
  /** Callback function when tab is selected. */
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Determines if the tab is currently active. */
  isActive?: boolean;
  /** Determines if the tab is disabled and cannot be interacted with. */
  isDisabled?: boolean;
  /** Allows the tab to be deselected, resulting in no active tab. */
  allowNoSelection?: boolean;
  /** Enables multi-select functionality */
  withMultiSelect?: boolean;
  /** Sets a tab class name */
  className?: string;
  /** Sets a tab data-testid */
  dataTestId?: string;
  /** Locks the last selected tab */
  lockLastSelection?: boolean;
};
