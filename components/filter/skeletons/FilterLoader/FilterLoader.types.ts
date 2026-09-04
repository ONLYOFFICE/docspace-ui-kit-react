import { RectangleSkeletonProps } from "../../../rectangle";

export type FilterLoaderProps = RectangleSkeletonProps & {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
};
