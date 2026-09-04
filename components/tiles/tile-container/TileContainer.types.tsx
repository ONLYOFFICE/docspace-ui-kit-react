/** Base tile item data structure */
export type TileItem = {
  /** Indicates if the item is a folder */
  isFolder?: boolean;
  /** Indicates if the item is a room */
  isRoom?: boolean;
  /** File extension */
  fileExst?: string;
  /** Unique identifier for the item */
  id: number | string;
  isTemplate?: boolean;
  /** Optional display title */
  title?: string;
  /** Optional alternative display name */
  displayName?: string;
  /** Optional icon identifier */
  icon?: string;
  /** Optional logo data used by tiles/headers */
  logo?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    color?: string;
    cover?: string | { data: string; id: string };
  };
};

/** Common properties for tile items */
export interface CommonTileProps {
  /** Indicates if the tile is selected */
  checked?: boolean;
  /** Indicates if the tile is in active state */
  isActive?: boolean;
  /** Indicates if the tile is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Child elements */
  children?: React.ReactNode;
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Additional React element */
  element?: React.ReactNode;
  /** Badges to display */
  badges?: React.ReactNode;
  /** Click handler for the thumbnail */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Selection handler */
  onSelect?: (checked: boolean) => void;
  /** Class name for styling */
  className?: string;
  /** Style object for inline styling */
  style?: React.CSSProperties;
}

/** Props for individual tile items */
export type TileItemProps = CommonTileProps & {
  /** The tile item data */
  item: TileItem;
};

export type TileContainerProps = {
  /** Child elements to be rendered within the container */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Container's HTML id attribute */
  id?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Flag to enable React Window for virtualization */
  useReactWindow?: boolean;
  /** Component for rendering infinite grid layout */
  infiniteGrid?: React.ComponentType<{
    children: React.ReactNode;
    isRooms?: boolean;
    isTemplates?: boolean;
  }>;
  /** Custom heading for folders section */
  headingFolders?: React.ReactNode;
  /** Custom heading for files section */
  headingFiles?: React.ReactNode;
  /** Flag to indicate descending order */
  isDesc?: boolean;
  /** Disables text selection */
  noSelect?: boolean;
};
