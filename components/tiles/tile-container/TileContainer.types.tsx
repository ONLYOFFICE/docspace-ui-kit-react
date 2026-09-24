/** The shape `TileContainer` reads off each child to decide which group it belongs to. */
export type TileItem = {
  /** Sorts the tile into the folders group, unless `isRoom` is set or `fileExst` is present. */
  isFolder?: boolean;
  /** Sorts the tile into the rooms group, which is rendered first and gets no heading. */
  isRoom?: boolean;
  /** Presence of an extension keeps the tile out of the folders group. */
  fileExst?: string;
  /** React key of the wrapper the container puts around the tile. The literal `-1` also counts as a folder — it is the portal's "up one level" row. */
  id: number | string;
  /** Sorts the tile into the templates group, which is rendered after the rooms and gets no heading. */
  isTemplate?: boolean;
  /** Title of the item, used as the context menu's header. */
  title?: string;
  /** Used as the context menu's header when there is no `title`. */
  displayName?: string;
  /** Icon of the item, passed to the context menu's header. */
  icon?: string;
  /** Logo of the item, passed to the context menu's header. */
  logo?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    color?: string;
    cover?: string | { data: string; id: string };
  };
};

/** The props every tile in the family shares. */
export interface CommonTileProps {
  /** Whether the tile is selected. */
  checked?: boolean;
  /** Whether the tile is the one the keyboard or the context menu is acting on. */
  isActive?: boolean;
  /** Whether an operation is blocking the tile, which dims it. */
  isBlockingOperation?: boolean;
  /** The tile's own content; the first child is the one the tiles treat as their content element. */
  children?: React.ReactNode;
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered. */
  element?: React.ReactNode;
  /** Badges drawn over the tile. */
  badges?: React.ReactNode;
  /** Called when the thumbnail is clicked. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Called with the new checked state when the tile is selected. */
  onSelect?: (checked: boolean) => void;
  /** Added after the component's own classes. */
  className?: string;
  /** Inline style of the tile. */
  style?: React.CSSProperties;
}

/** What `TileContainer` expects to find on a child: anything, as long as it carries `item`. */
export type TileItemProps = CommonTileProps & {
  /** The item the container sorts by. A child without this prop is dropped. */
  item: TileItem;
};

export type TileContainerProps = {
  /** The tiles. Each one must carry an `item` prop; a child without it is silently dropped, including plain markup. */
  children: React.ReactNode;
  /** Added before the component's own class on the outer element. */
  className?: string;
  /** Value of `id` on the outer element.
   * @default "tileContainer" */
  id?: string;
  /** Inline style of the outer element, and where `--tile-container-gap` goes. */
  style?: React.CSSProperties;
  /** Hands the four groups to `infiniteGrid` instead of wrapping each in its own grid. Without an `infiniteGrid` alongside it the tiles are emitted with no grid at all. */
  useReactWindow?: boolean;
  /** The virtualising grid to render the tiles into. It is told whether the current run is rooms or templates. */
  infiniteGrid?: React.ComponentType<{
    children: React.ReactNode;
    isRooms?: boolean;
    isTemplates?: boolean;
  }>;
  /** Heading above the folders group. It is rendered only when that group has something in it. */
  headingFolders?: React.ReactNode;
  /** Heading above the files group. It is rendered only when that group has something in it. */
  headingFiles?: React.ReactNode;
  /** Flips the arrow class on both headings. It sorts nothing. */
  isDesc?: boolean;
  /** Turns off text selection across the whole container. */
  noSelect?: boolean;
};
