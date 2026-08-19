/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	FolderType,
	RoomType,
	FilterType,
	ApplyFilterOption,
} from "@onlyoffice/docspace-api-sdk";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import { DeviceType } from "../../enums";
import FilesSelector from ".";
import type {
	FilesSelectorProps,
	TSelectedFileInfo,
	FileEntryDtoIntegerAllOfSecurity,
} from "./FilesSelector.types";

type StoryArgs = {
	// Panel
	isPanelVisible: boolean;
	embedded: boolean;
	currentDeviceType: DeviceType;

	// Navigation
	currentFolderId: number | string;
	rootFolderType: FolderType;
	isRoomsOnly: boolean;
	isThirdParty: boolean;
	roomType?: RoomType | RoomType[];
	isUserOnly?: boolean;
	openRoot?: boolean;
	roomsFolderId?: number;

	// Header
	withHeader?: boolean;
	headerProps?: { headerLabel: string; onCloseClick: () => void };

	// Search & breadcrumbs
	withSearch: boolean;
	withBreadCrumbs: boolean;
	withoutBackButton: boolean;

	// Footer
	withCancelButton: boolean;
	cancelButtonLabel: string;
	withFooterInput: boolean;
	withFooterCheckbox: boolean;
	footerInputHeader: string;
	currentFooterInputValue: string;
	footerCheckboxLabel: string;
	descriptionText: string;
	submitButtonLabel: string;

	// Creation
	withCreate: boolean;
	createDefineRoomLabel?: string;
	createDefineRoomType?: RoomType;

	// Filtering
	disabledItems: (string | number)[];
	filterParam?: string | number;
	applyFilterOption?: ApplyFilterOption;
	disableThirdParty?: boolean;
	disableBySecurity?: string;

	// Misc
	withPadding?: boolean;
	checkCreating?: boolean;
};

const meta: Meta<StoryArgs> = {
	title: "Components/Selectors/FilesSelector",
	tags: ["!autodocs"],
	argTypes: {
		// Panel
		isPanelVisible: {
			control: "boolean",
			description: "Controls visibility of the Aside panel (non-embedded mode)",
			table: { defaultValue: { summary: "true" } },
		},
		embedded: {
			control: "boolean",
			description:
				"Render inline without the Aside/Backdrop wrapper — useful for embedding inside dialogs",
			table: { defaultValue: { summary: "false" } },
		},
		currentDeviceType: {
			control: "select",
			options: [DeviceType.desktop, DeviceType.tablet, DeviceType.mobile],
			description:
				"Current device type — affects portal rendering on mobile/tablet",
			table: { defaultValue: { summary: "DeviceType.desktop" } },
		},

		// Navigation
		currentFolderId: {
			control: "text",
			description: "ID of the initially opened folder (0 = rooms root)",
			table: { defaultValue: { summary: "0" } },
		},
		rootFolderType: {
			control: "select",
			options: [
				FolderType.VirtualRooms,
				FolderType.USER,
				FolderType.RoomTemplates,
				FolderType.AiAgents,
			],
			description: "Root folder context type",
		},
		isRoomsOnly: {
			control: "boolean",
			description:
				"Restrict navigation to rooms level — do not allow descending into folders",
			table: { defaultValue: { summary: "false" } },
		},
		isThirdParty: {
			control: "boolean",
			description: "Whether navigating a third-party storage provider",
			table: { defaultValue: { summary: "false" } },
		},
		roomType: {
			control: "select",
			options: [
				undefined,
				RoomType.CustomRoom,
				RoomType.EditingRoom,
				RoomType.PublicRoom,
				RoomType.VirtualDataRoom,
			],
			description: "Filter the root rooms list by type",
		},
		isUserOnly: {
			control: "boolean",
			description: "Show only the current user's personal folder tree",
			table: { defaultValue: { summary: "false" } },
		},
		openRoot: {
			control: "boolean",
			description:
				"Open the selector at the root tree view instead of a specific folder",
			table: { defaultValue: { summary: "false" } },
		},

		// Header
		withHeader: {
			control: "boolean",
			description: "Show the header bar with a label and close button",
			table: { defaultValue: { summary: "false" } },
		},

		// Search & breadcrumbs
		withSearch: {
			control: "boolean",
			description: "Show a search input (hidden at root level)",
			table: { defaultValue: { summary: "true" } },
		},
		withBreadCrumbs: {
			control: "boolean",
			description: "Show the breadcrumb navigation trail",
			table: { defaultValue: { summary: "true" } },
		},
		withoutBackButton: {
			control: "boolean",
			description: "Hide the back button in the breadcrumb bar",
			table: { defaultValue: { summary: "false" } },
		},

		// Footer
		withCancelButton: {
			control: "boolean",
			description: "Show a cancel button in the footer",
			table: { defaultValue: { summary: "true" } },
		},
		cancelButtonLabel: {
			control: "text",
			description: "Label for the cancel button",
		},
		withFooterInput: {
			control: "boolean",
			description:
				"Show a text input in the footer (e.g., for file/folder name)",
			table: { defaultValue: { summary: "false" } },
		},
		footerInputHeader: {
			control: "text",
			description: "Header label for the footer input",
		},
		currentFooterInputValue: {
			control: "text",
			description: "Default value pre-filled in the footer input",
		},
		withFooterCheckbox: {
			control: "boolean",
			description: "Show a checkbox in the footer",
			table: { defaultValue: { summary: "false" } },
		},
		footerCheckboxLabel: {
			control: "text",
			description: "Label for the footer checkbox",
		},
		descriptionText: {
			control: "text",
			description: "Description text shown below the selector list",
		},
		submitButtonLabel: {
			control: "text",
			description: "Label for the submit / confirm button",
		},

		// Creation
		withCreate: {
			control: "boolean",
			description: "Show a create-room button at the top of the rooms list",
			table: { defaultValue: { summary: "false" } },
		},
		createDefineRoomLabel: {
			control: "text",
			description: "Label for the create-room button (requires withCreate)",
		},
		createDefineRoomType: {
			control: "select",
			options: [
				undefined,
				RoomType.CustomRoom,
				RoomType.EditingRoom,
				RoomType.PublicRoom,
				RoomType.VirtualDataRoom,
			],
			description: "Room type to pre-select on create (requires withCreate)",
		},

		// Filtering
		disabledItems: {
			control: "object",
			description: "IDs of folders that are disabled as selection targets",
		},
		filterParam: {
			control: "select",
			options: [
				undefined,
				"DOCX",
				"PDF",
				"PDFForm",
				"IMG",
				"XLSX",
				"PPTX",
				"ALL",
				FilterType.DocumentsOnly,
				FilterType.SpreadsheetsOnly,
				FilterType.PresentationsOnly,
				FilterType.ImagesOnly,
				FilterType.MediaOnly,
				FilterType.FoldersOnly,
			],
			description:
				"File type filter — restricts the items shown inside folders",
		},
		applyFilterOption: {
			control: "select",
			options: [undefined, ApplyFilterOption.Files, ApplyFilterOption.All],
			description: "Whether filter applies to files only or all items",
		},
		disableBySecurity: {
			control: "text",
			description:
				"Security key — items without this security permission are disabled",
		},

		// Misc
		withPadding: {
			control: "boolean",
			description: "Add padding inside the selector body",
			table: { defaultValue: { summary: "false" } },
		},
		checkCreating: {
			control: "boolean",
			description:
				"Validate folder write access by creating and deleting a test file on folder open",
			table: { defaultValue: { summary: "false" } },
		},
	},
};

export default meta;

type Story = StoryObj<StoryArgs>;

/** Shared helpers */
const getIsDisabled = (
	isFirstLoad: boolean,
	isSelectedParentFolder: boolean,
	selectedItemId: string | number | undefined,
	selectedItemType: "rooms" | "files" | "agents" | undefined,
	isRoot: boolean,
	_selectedItemSecurity: FileEntryDtoIntegerAllOfSecurity | undefined,
	_selectedFileInfo: TSelectedFileInfo,
	isDisabledFolder?: boolean,
) => {
	if (isFirstLoad) return true;
	if (isSelectedParentFolder) return true;
	if (isDisabledFolder) return true;
	if (isRoot) return true;
	if (!selectedItemId) return true;
	if (selectedItemType === "rooms") return true;
	return false;
};

const getFilesArchiveError = (name: string) =>
	`"${name}" is in the archive and cannot be used as a destination.`;

const Template = (props: StoryArgs) => (
	<div
		style={{
			width: "700px",
			height: "600px",
			border: "4px dashed #d0d5dd",
			position: "relative",
			overflow: "hidden",
		}}
	>
		<Toast />
		<FilesSelector
			{...(props as unknown as FilesSelectorProps)}
			getIsDisabled={getIsDisabled}
			getFilesArchiveError={getFilesArchiveError}
			onSubmit={(
				selectedItemId,
				folderTitle,
				_isPublic,
				_breadCrumbs,
				fileName,
				isChecked,
			) => {
				toastr.success(
					`Saved to "${folderTitle}"${fileName ? ` as "${fileName}"` : ""}${isChecked ? " (checked)" : ""}`,
				);
			}}
			onCancel={() => {
				toastr.info("Cancelled");
			}}
		/>
	</div>
);

// ─── Stories ────────────────────────────────────────────────────────────────

export const Default: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Select",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};

export const RoomsOnly: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: true,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Move here",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};

export const WithFooterInput: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: true,
		footerInputHeader: "File name",
		currentFooterInputValue: "My Document",
		withFooterCheckbox: false,
		submitButtonLabel: "Save",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};

export const WithFileTypeFilter: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Select file",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "Select a PDF file",
		disabledItems: [],
		filterParam: "PDF",
		applyFilterOption: ApplyFilterOption.Files,
	},
};

export const WithRoomCreation: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: true,
		createDefineRoomLabel: "Create new room",
		createDefineRoomType: RoomType.CustomRoom,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Select",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};

export const AsidePanel: Story = {
	render: (props: StoryArgs) => (
		<div style={{ width: "700px", height: "600px", border: "4px dashed #d0d5dd", position: "relative" }}>
			<Toast />
			<FilesSelector
				{...(props as unknown as FilesSelectorProps)}
				getIsDisabled={getIsDisabled}
				getFilesArchiveError={getFilesArchiveError}
				onSubmit={(selectedItemId, folderTitle) => {
					toastr.success(`Saved to "${folderTitle}"`);
				}}
				onCancel={() => {
					toastr.info("Cancelled");
				}}
			/>
		</div>
	),
	args: {
		isPanelVisible: true,
		embedded: false,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Select",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};

export const WithHeader: Story = {
	render: (args: StoryArgs) => <Template {...args} />,
	args: {
		isPanelVisible: true,
		embedded: true,
		currentDeviceType: DeviceType.desktop,
		currentFolderId: 0,
		rootFolderType: FolderType.VirtualRooms,
		isRoomsOnly: false,
		isThirdParty: false,
		withHeader: true,
		headerProps: {
			headerLabel: "Select destination",
			onCloseClick: () => {},
		},
		withSearch: true,
		withBreadCrumbs: true,
		withoutBackButton: false,
		withCancelButton: true,
		cancelButtonLabel: "Cancel",
		withCreate: false,
		withFooterInput: false,
		withFooterCheckbox: false,
		submitButtonLabel: "Move here",
		footerInputHeader: "",
		currentFooterInputValue: "",
		footerCheckboxLabel: "",
		descriptionText: "",
		disabledItems: [],
	},
};
