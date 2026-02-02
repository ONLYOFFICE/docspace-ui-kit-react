// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { EmployeeType, RoomsType } from "../enums";
import { getCommonTranslation } from "./i18n";

export type TTranslation = (
	key: string,
	params?: Record<string, unknown>,
) => string;

const defaultTranslation: TTranslation = (key, params) => {
	const keyParts = key.split(":");
	const translationKey = keyParts.length > 1 ? keyParts[1] : key;

	let result = getCommonTranslation(translationKey);

	if (!result) return key;

	if (params) {
		for (const [paramKey, paramValue] of Object.entries(params)) {
			result = result.replace(
				new RegExp(`{{${paramKey}}}`, "g"),
				String(paramValue),
			);
		}
	}

	return result;
};

export const getUserTypeTranslation = (type: EmployeeType, t?: TTranslation) => {
	const translate = t ?? defaultTranslation;

	switch (type) {
		case EmployeeType.Owner:
			return translate("Common:Owner");
		case EmployeeType.Admin:
			return translate("Common:PortalAdmin", {
				productName: translate("Common:ProductName"),
			});
		case EmployeeType.RoomAdmin:
			return translate("Common:RoomAdmin");
		case EmployeeType.User:
			return translate("Common:User");
		case EmployeeType.Guest:
		default:
			return translate("Common:Guest");
	}
};

export const RoomsTypeValues = Object.values(RoomsType).filter(
	(item): item is number =>
		typeof item === "number" && item !== RoomsType.AIRoom,
);

export const RoomsTypes = RoomsTypeValues.reduce<Record<number, number>>(
	(acc, current) => {
		if (typeof current === "string") return { ...acc };
		return { ...acc, [current]: current };
	},
	{},
);
