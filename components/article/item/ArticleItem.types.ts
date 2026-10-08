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
  /** Invokes a function upon clicking on a catalog item */
  onClick?: (e: React.MouseEvent, id?: string) => void;
  /** Invokes a function upon dragging and dropping a catalog item */
  onDrop?: (id?: string, text?: string, item?: ArticleItemType) => void;
  /** Tells when the catalog item should display initial on icon, text should be hidden */
  showInitial?: boolean;
  /** Sets the catalog item as end of block */
  isEndOfBlock?: boolean;
  /** Sets catalog item active */
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
  /** Invokes a function upon clicking on the catalog item badge */
  onClickBadge?: (id?: string) => void;
  /** Sets the catalog item to be displayed as a header */
  isHeader?: boolean;
  /** Disables margin top for catalog item header */
  isFirstHeader?: boolean;
  /** Accepts folder id */
  folderId?: string;
  /** Title for the badge tooltip */
  badgeTitle?: string;
  /** Custom badge component */
  badgeComponent?: React.ReactNode;
  /** Title for the item tooltip */
  title?: string;
  /** Link data for routing */
  linkData: TArticleLinkData;
  /** Item data */
  item?: ArticleItemType;
  /** Catalog item icon for SSR */
  iconNode?: React.ReactNode;
  withAnimation?: boolean;
  dataTooltipId?: string;
  isDisabled?: boolean;
};
