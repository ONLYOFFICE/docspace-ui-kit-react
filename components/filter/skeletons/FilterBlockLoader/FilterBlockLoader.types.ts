import { RectangleSkeletonProps } from "../../../rectangle";

export type FilterBlockLoaderProps = RectangleSkeletonProps & {
	id?: string;
	className?: string;
	isRooms?: boolean;
	isContactsPage?: boolean;
	isContactsPeoplePage?: boolean;
	isContactsGroupsPage?: boolean;
	isContactsInsideGroupPage?: boolean;
	isContactsGuestsPage?: boolean;
};
