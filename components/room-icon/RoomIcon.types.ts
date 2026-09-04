import type { Nullable, TLogo } from "../../types";
import type { ROOM_ACTION_KEYS } from "../../constants";

type RoomIconDefault = {
	title: string;
	isArchive?: boolean;
	size?: string;
	radius?: string;
	showDefault?: boolean;
	imgClassName?: string;
	className?: string;
	dataTestId?: string;
};

export type TModel = { label: string; icon: string } & (
	| {
			key: string;
			onClick: () => void;
	  }
	| {
			key: typeof ROOM_ACTION_KEYS.CREATE_EDIT_ROOM_UPLOAD;
			onClick: (ref?: React.RefObject<Nullable<HTMLInputElement>>) => void;
	  }
);

type RoomIconExpansion = {
	hoverSrc?: string;
	withEditing?: boolean;
	onChangeFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isEmptyIcon?: boolean;
	dropDownManualX?: string;
	model?: TModel[];
	logo?: TLogo | string;
	tooltipContent?: string;
	tooltipId?: string;
	isTemplate?: boolean;
	dataTestId?: string;
};

type RoomIconColor = {
	color: string;
	imgClassName?: undefined;
};

type RoomIconImage = {
	color?: string | undefined;
	imgClassName?: string;
};

type RoomIconBadge = {
	badgeUrl?: string;
	badgeIconNode?: React.ReactNode;
	badgeIconColor?: string;
	onBadgeClick?: () => void;
};

type RoomIconNonBadge = {
	badgeUrl?: undefined;
	badgeIconNode?: undefined;
	badgeIconColor?: undefined;
	onBadgeClick?: undefined;
};

export type RoomIconProps = RoomIconDefault &
	RoomIconExpansion &
	(RoomIconColor | RoomIconImage) &
	(RoomIconBadge | RoomIconNonBadge);
