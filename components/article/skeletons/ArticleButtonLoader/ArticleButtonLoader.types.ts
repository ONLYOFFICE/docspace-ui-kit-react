import { RectangleSkeletonProps } from "../../../rectangle";

export type ButtonLoaderProps = RectangleSkeletonProps & {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
};
