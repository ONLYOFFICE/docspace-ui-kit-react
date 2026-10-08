import { RectangleSkeletonProps } from "../../../rectangle";

export type HeaderLoaderProps = RectangleSkeletonProps & {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  showText: boolean;
};
