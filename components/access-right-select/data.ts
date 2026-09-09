import { globalColors } from "../../providers/theme";

import type { TOption } from "../combobox";

export const data: TOption[] = [
	{
		key: "key1",
		label: "Room administrator",
		description: `Administration of rooms, archiving of rooms, inviting and managing users in rooms.`,
		quota: "free",
		color: globalColors.tickColor,
	},
	{
		key: "key2",
		label: "Full access",
		description: `Edit, upload, create, view, download, delete files and folders.`,
		quota: "paid",
		color: globalColors.favoritesStatus,
	},

	{ key: "key3", label: "", isSeparator: true },
	{
		key: "key4",
		label: "Editing",
		description: `Editing, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key5",
		label: "Review",
		description: `Reviewing, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key6",
		label: "Comment",
		description: `Commenting on files, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key7",
		label: "Read only",
		description: `Viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key8",
		label: "Deny access",
		description: "",
	},
];
