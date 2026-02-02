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

/**
 * Gets a cookie value by name
 */
export const getCookie = (name: string): string | undefined => {
	if (typeof document === "undefined") return undefined;

	const matches = document.cookie.match(
		new RegExp(
			`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`,
		),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Gets a translation from window.i18n for the Common namespace
 * Reads language from the asc_language cookie
 */
export const getCommonTranslation = (key: string): string | undefined => {
	if (typeof window === "undefined") return undefined;

	const i18n = (
		window as unknown as {
			i18n?: {
				loaded: Record<string, { data: Record<string, string> }>;
			};
		}
	).i18n;

	if (!i18n?.loaded) return undefined;

	const cookieLang = getCookie("asc_language");
	const lang =
		cookieLang === "en-US" || cookieLang === "en-GB" ? "en" : cookieLang;

	const commonKeys = Object.getOwnPropertyNames(i18n.loaded).filter(
		(k) => k.indexOf(`${lang}/Common.json`) > -1,
	);

	if (commonKeys.length === 0) return undefined;

	const i18nKey = commonKeys.length === 1 ? commonKeys[0] : commonKeys[1];

	return i18n.loaded[i18nKey]?.data?.[key];
};
