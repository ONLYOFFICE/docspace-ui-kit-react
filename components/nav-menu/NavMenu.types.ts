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
  /** The sections of the menu, in order. A group with a `label` renders it as a caption above its items. */
  groups: NavMenuGroup[];
  /** Id of the item or sub-item that is currently open. It highlights that entry and, through an effect, expands the section it belongs to. */
  activeItemId?: string;
  /** Section expanded on the first render. After that the expansion is the component's own state. */
  defaultExpandedId?: string;
  /** Plays the sliding highlight when an entry is clicked. */
  withAnimation?: boolean;
  /** Added after the component's own classes on the `nav` element. */
  className?: string;
  /** Your router's link component. Without it `linkData` is ignored and every entry is a `button`. */
  LinkRouter?: React.ComponentType<LinkRouterProps>;
  /** Collapsed rail: labels become tooltips, sub-menus are not rendered, and the active section's children are flattened into the list instead. */
  iconOnly?: boolean;
  /** Gives each section its own chevron and leaves the item body to navigation. Several sections may then be open at once. */
  withExpandControl?: boolean;
};
