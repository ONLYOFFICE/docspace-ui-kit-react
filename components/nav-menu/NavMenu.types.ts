import React from "react";

import type { LinkRouterProps } from "../../types";

export type NavMenuLinkData = {
  path: string;
  state?: unknown;
};

export type NavSubItem = {
  id: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
  onClick?: (item: NavSubItem) => void;
  linkData?: NavMenuLinkData;
  /**
   * Render a thin separator line above this sub-item. Used to group related
   * children (e.g., put Trash visually apart from Favorites without
   * splitting the sub-menu into multiple groups).
   */
  withTopSeparator?: boolean;
  showBadge?: boolean;
  labelBadge?: string | number;
  badgeComponent?: React.ReactNode;
  onClickBadge?: (id: string) => void;
};

export type NavMenuItem = {
  id: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
  /**
   * Fired when the item is clicked. Return `false` to suppress the default
   * expand/collapse of this item's sub-menu — used when the click opens a
   * modal instead of navigating, so the sub-menu shouldn't toggle behind it.
   * Any other return value (incl. a promise) keeps the default behavior.
   */
  onClick?: (item: NavMenuItem) => void | boolean | Promise<void>;
  children?: NavSubItem[];
  showBadge?: boolean;
  labelBadge?: string | number;
  badgeComponent?: React.ReactNode;
  collapsedBadgeComponent?: React.ReactNode;
  onClickBadge?: (id: string) => void;
  linkData?: NavMenuLinkData;
  /**
   * Internal flag (icon-only mode): marks the last flattened child of the
   * active section so a 32px spacer can be rendered below it.
   */
  endOfActiveSection?: boolean;
  /**
   * Internal flag (icon-only mode): marks an item as a flattened child of the
   * active section, used to play the reveal animation on mount.
   */
  isFlattenedChild?: boolean;
  /** Internal: child position, used to stagger the reveal animation. */
  flattenIndex?: number;
};

export type NavMenuGroup = {
  id: string;
  label?: string;
  items: NavMenuItem[];
};

export type NavMenuProps = {
  groups: NavMenuGroup[];
  activeItemId?: string;
  defaultExpandedId?: string;
  withAnimation?: boolean;
  className?: string;
  LinkRouter?: React.ComponentType<LinkRouterProps>;
  iconOnly?: boolean;
  withExpandControl?: boolean;
};

