import { RectangleSkeletonProps } from "../../../rectangle";

export type FolderLoaderProps = RectangleSkeletonProps & {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  showText: boolean;
  isVisitor: boolean;
};
