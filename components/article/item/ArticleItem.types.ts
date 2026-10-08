import React from "react";

export type TArticleLinkDataState =
  | {
      title: string;
      isRoot: boolean;
      isPublicRoomType: boolean;
      rootFolderType: number;
      canCreate: boolean;
    }
  | object;

export type TArticleLinkData = {
  path: string;
  state: TArticleLinkDataState;
};

type PickedDivProps = Pick<
  React.ComponentProps<"div">,
  "id" | "className" | "style"
>;

export interface ArticleItemType {
  isRoom?: boolean;
  rootFolderType?: string;
  id?: string;
  roomType?: string;
  title?: string;
  shared?: boolean;
  external?: boolean;
  security?: {
    canCreate: boolean;
  };
}

export type ArticleItemProps = PickedDivProps & {
  /** Catalog item icon */
  icon?: string;
  /** Catalog item text */
  text: string;
  /** Sets the catalog item to display text */
  showText?: boolean;
  /** Called with the event and `id` when the item is clicked or activated with Enter or Space; inside a link, also when the link is activated from the keyboard. A middle click calls it only when the item is not a link. */
  onClick?: (e: React.MouseEvent, id?: string) => void;
  /** Invokes a function upon dragging and dropping a catalog item */
  onDrop?: (id?: string, text?: string, item?: ArticleItemType) => void;
  /** Tells when the catalog item should display initial on icon, text should be hidden */
  showInitial?: boolean;
  /** Sets the catalog item as end of block */
  isEndOfBlock?: boolean;
  /** Marks the current item: highlighted, and `aria-current="page"`. */
  isActive?: boolean;
  /** Sets the catalog item available for drag`n`drop */
  isDragging?: boolean;
  /** Sets the catalog item active for drag`n`drop */
  isDragActive?: boolean;
  /** Sets the catalog item to display badge */
  showBadge?: boolean;
  /** Label in catalog item badge */
  labelBadge?: string | number;
  /** Sets custom badge icon */
  iconBadge?: string;
  /** Called with `id` when the badge is clicked or activated with Enter or Space. With it the badge is a button named by `badgeTitle` (else `labelBadge`). */
  onClickBadge?: (id?: string) => void;
  /** Sets the catalog item to be displayed as a header */
  isHeader?: boolean;
  /** Disables margin top for catalog item header */
  isFirstHeader?: boolean;
  /** Accepts folder id */
  folderId?: string;
  /** Title for the badge tooltip, and the badge button's accessible name */
  badgeTitle?: string;
  /** Custom badge component */
  badgeComponent?: React.ReactNode;
  /** Native tooltip of the item, shown while the label is hidden or truncated. The item's accessible name is always `text`. */
  title?: string;
  /** Address and router state of the item. Read only with `LinkRouter`, which renders the item inside that link. */
  linkData: TArticleLinkData;
  /** Item data */
  item?: ArticleItemType;
  /** Catalog item icon for SSR */
  iconNode?: React.ReactNode;
  /** Whether a click plays the progress animation on the item's background. */
  withAnimation?: boolean;
  /** `data-tooltip-id` of the item, for a shared tooltip anchored by it. */
  dataTooltipId?: string;
  /** Whether the item is rendered without its `LinkRouter` link. */
  isDisabled?: boolean;
  /** Set by the wrapper when the item is rendered inside its `LinkRouter` link, which is then the focusable control. */
  isLink?: boolean;
};
