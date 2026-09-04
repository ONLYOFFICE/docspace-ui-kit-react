import type { FolderDtoInteger, RoomType } from "@onlyoffice/docspace-api-sdk";

import type { WithFlag } from "../../types";
import type {
	TSelectorCancelButton,
	TSelectorHeader,
	TSelectorItem,
	TSelectorWithAside,
} from "../../components/selector";

import type { SearchArea } from "@onlyoffice/docspace-api-sdk";

export type TInitValue = WithFlag<
	"withInit",
	{
		withInit: true;
		initItems: FolderDtoInteger[];
		initTotal: number;
		initHasNextPage: boolean;
		initSearchValue?: string;
	}
>;

export type RoomSelectorProps = TSelectorHeader &
	TSelectorCancelButton &
	TSelectorWithAside & {
		id?: string;
		className?: string;
		style?: React.CSSProperties;

		isMultiSelect: boolean;

		onSubmit: (items: TSelectorItem[]) => void | Promise<void>;
		isForms?: boolean;
		roomType?: RoomType | RoomType[];
		searchArea?: SearchArea | string;
		excludeItems?: (number | string | undefined)[];
		setIsDataReady?: (value: boolean) => void;
		submitButtonLabel?: string;

		disableThirdParty?: boolean;

		withPadding?: boolean;
		withSearch?: boolean;
		withCreate?: boolean;
		createDefineRoomLabel?: string;
		createDefineRoomType?: RoomType;
		/** Disables the Public room type in the create-room dropdown */
		disabledCreatePublicRoom?: boolean;

		emptyScreenHeader?: string;
		emptyScreenDescription?: string;

		/** When true, sorts items so that selectedItems appear at the beginning of the list */
		sortSelectedFirst?: boolean;
		/** When true, disables submit button until selection changes from initial state (for grouping panel) */
		disableSubmitUntilChanged?: boolean;
		selectedItems?: TSelectorItem[];
		disableFirstFetch?: boolean;
		forceIsMultiSelect?: boolean;
	} & TInitValue;
