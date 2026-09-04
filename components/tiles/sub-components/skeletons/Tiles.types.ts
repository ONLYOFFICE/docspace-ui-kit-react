import { RectangleSkeletonProps } from "../../../rectangle";

export type TilesSkeletonProps = RectangleSkeletonProps & {
	foldersCount?: number;
	filesCount?: number;
	withTitle?: boolean;
	isRooms?: boolean;
};

export type StyledBottomProps = {
	isFolder?: boolean;
};

export type TileSkeletonProps = RectangleSkeletonProps & {
	isFolder?: boolean;
	isRoom?: boolean;
};
