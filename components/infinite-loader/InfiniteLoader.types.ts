import { IndexRange } from "react-virtualized";
import { TViewAs } from "../../types";

export type InfiniteLoaderProps = {
  viewAs: TViewAs;
  hasMoreFiles: boolean;
  filesLength: number;
  itemCount: number;
  loadMoreItems: (params: IndexRange) => Promise<void>;
  itemSize: number;
  children: React.ReactNode[];
  onScroll?: () => void;
  isLoading?: boolean;
  columnStorageName?: string;
  columnInfoPanelStorageName?: string;
  className?: string;
  infoPanelVisible?: boolean;
  countTilesInRow?: number;
  showSkeleton?: boolean;
  currentFolderId?: string | number;
  smallPreview?: boolean;
  isOneTile?: boolean;
};

export type ListComponentProps = InfiniteLoaderProps & {
  scroll: Element | (Window & typeof globalThis);
};
