import type { ComponentType } from "react";

import type { Nullable, LinkRouterProps, To } from "../../types";
import type { ContextMenuModel } from "../context-menu";

export type EmptyViewButtonType = {
  /** Unique identifier for the button */
  key: React.Key;
  /** Title text to display */
  title: string;
  /** Optional click handler for the button */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Optional CSS class name for styling */
  className?: string;
  /** Whether the button uses the primary style (defaults to true) */
  primary?: boolean;
  /** Shows a loader inside the button */
  isLoading?: boolean;
  /** type of option */
  type: "button";
};

export type EmptyViewSeparatorType = {
  /** Unique identifier for the separator */
  key: React.Key;
  /** Text to display as separator */
  text: string;
  /** type of option */
  type: "separator";
};

export type EmptyViewActionType = {
  /** Unique identifier for the action */
  key: React.Key;
  /** Title text to display */
  title: string;
  /** Icon component to display */
  icon?: React.ReactElement;
  /** Optional click handler for the action */
  onClick?: React.MouseEventHandler<HTMLElement> | (() => void);
  /** Optional CSS class name for styling */
  className?: string;
  /** type of option */
  type: "action";
};

export type EmptyViewLinkType = {
  /** Unique identifier for the link */
  key: React.Key;
  /** Target route or URL for the link */
  to: To;
  /** Optional state to pass to the router */
  state?: unknown;
  /** Icon component to display */
  icon: React.ReactElement;
  /** Text description for the link */
  description: string;
  /** Optional click handler for the link */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Optional CSS class name for styling */
  className?: string;
  /** Renders the plain anchor even when `LinkRouter` is passed, for a
   * handler that navigates on its own. */
  isNext?: boolean;
};

export type EmptyViewItemType = {
  /** Unique identifier for the item */
  key: React.Key;
  /** The bold first line: the view's heading, or an item's name. */
  title: string;
  /** The line under the title, as text or a node. */
  description: React.ReactNode;
  /** Picture above the view's title, or at the start of an item, rendered as
   * given. Mark it `aria-hidden` when it only decorates. */
  icon: React.ReactElement;
  /** Optional click handler for the item */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** Optional flag to disable the item */
  disabled?: boolean;
  /** Optional context menu configuration */
  model?: Nullable<ContextMenuModel[]>;
};

/** Array of EmptyViewItemType or EmptyViewLinkType elements */
export type EmptyViewOptionsType = (
  | EmptyViewItemType
  | EmptyViewLinkType
  | EmptyViewButtonType
  | EmptyViewSeparatorType
  | EmptyViewActionType
)[];

export type EmptyViewItemProps = Omit<EmptyViewItemType, "key"> & {
  /** Optional ID for the item */
  id?: string;
};

export type EmptyViewOptionProps = {
  /** Single option of either EmptyViewItemType or EmptyViewLinkType */
  option: EmptyViewOptionsType[number];
  /** Router Link component for navigation */
  LinkRouter?: ComponentType<LinkRouterProps>;
};

export type EmptyViewProps = React.AriaAttributes &
  Omit<EmptyViewItemType, "key" | "onClick" | "disabled" | "model"> & {
    /** What the user can do next, in the order given, under the description.
     * `null` leaves the options out. */
    options: Nullable<EmptyViewOptionsType>;
    /** Your router's `Link`, used for link options instead of a plain anchor,
     * so a click does not reload the page. */
    LinkRouter?: ComponentType<LinkRouterProps>;
    /** Added to the wrapper. */
    className?: string;
    /** Added to the element that holds the options. */
    bodyClassName?: string;
    /** Rendered between the header and the options, outside their gap. */
    extraContent?: React.ReactNode;
  };
