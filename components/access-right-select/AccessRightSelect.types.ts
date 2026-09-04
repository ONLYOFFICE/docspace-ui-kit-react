import type { TComboboxProps } from "../combobox";

type PropsFromCombobox = Pick<
	TComboboxProps,
	| "className"
	| "selectedOption"
	| "advancedOptions"
	| "scaled"
	| "scaledOptions"
	| "size"
	| "manualWidth"
	| "onSelect"
	| "directionX"
	| "directionY"
	| "fixedDirection"
	| "isAside"
	| "manualY"
	| "withoutBackground"
	| "withBackground"
	| "withBlur"
	| "type"
	| "noBorder"
	| "isDisabled"
	| "isMobileView"
	| "shouldShowBackdrop"
	| "dataTestId"
	| "noSelect"
	| "isLoading"
	| "showDisabledItems"
	| "withBackdrop"
	| "title"
	| "displaySelectedOption"
>;

export type AccessRightSelectProps = PropsFromCombobox & {
	/** List of access options */
	accessOptions: TComboboxProps["options"];
	isSelectionDisabled?: boolean;
	selectionErrorText?: React.ReactNode;
	availableAccess?: number[];
	topSpace?: number;
	modernView?: boolean;
	fillIcon?: boolean;
	isDefaultMode?: boolean;
	comboIcon?: string;
	usePortalBackdrop?: boolean;
	directionX?: string;
	directionY?: string;
	dataTestId?: string;
	setIsOpenItemAccess?: React.Dispatch<React.SetStateAction<boolean>>;
};
