import type React from "react";

import type { AvatarRole, AvatarSize, AvatarActionKeys } from "./Avatar.enums";

export type TAvatarModel = { label: string; icon: string } & (
	| {
			key: string;
			onClick: () => void;
	  }
	| {
			key: typeof AvatarActionKeys.PROFILE_AVATAR_UPLOAD;
			onClick: (ref?: React.RefObject<HTMLDivElement | null>) => void;
	  }
);

export type AvatarProps = {
	/** Size of avatar */
	size: AvatarSize;
	/** Adds a table of user roles */
	role: AvatarRole;
	/** Displays as `Picture` in case the url is specified and as `Icon` in case the path to the .svg file is specified */
	source?: string | React.JSX.Element;
	/** Allows to display a user name as initials when `source` is set to blank */
	userName?: string;
	/** Enables avatar editing */
	editing?: boolean;
	/** Allows to display as a default icon when `source` is set to blank */
	isDefaultSource?: boolean;
	/** Function called when the avatar change button is pressed */
	editAction?: () => void;
	/** Hides user role */
	hideRoleIcon?: boolean;
	/** Accepts class */
	className?: string;
	/** Accepts id */
	id?: string;
	/** Accepts css style  */
	style?: React.CSSProperties;
	/** Show tooltip on hover role icon */
	withTooltip?: boolean;
	/** Tooltip content */
	tooltipContent?: string;
	onClick?: (e: React.MouseEvent) => void;
	/** Display initials for group when `source` is set to blank */
	isGroup?: boolean;
	/** Accepts roleIcon */
	roleIcon?: React.ReactElement;
	noClick?: boolean;
	hasAvatar?: boolean;
	onChangeFile?: () => void;

	model?: TAvatarModel[];
	isNotIcon?: boolean;
	imgClassName?: string;
	dataTestId?: string;
};
