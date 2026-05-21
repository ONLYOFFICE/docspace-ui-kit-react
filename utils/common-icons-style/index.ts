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

import { css } from "styled-components";

export enum IconSizeType {
	extraSmall = "extraSmall",
	small = "small",
	medium = "medium",
	big = "big",
	scale = "scale",
}

enum IconSizes {
	extraSmall = 8,
	small = 12,
	medium = 16,
	big = 24,
	scale = "scale",
}

const getSizeStyle = (size?: IconSizeType | number) => {
	let sizeVar = size;
	switch (size) {
		case "scale":
			return `
          &:not(:root) {
            width: 100%;
            height: 100%;
          }
        `;
		case IconSizeType.extraSmall:
			sizeVar = IconSizes.extraSmall;
			break;
		case IconSizeType.small:
			sizeVar = IconSizes.small;
			break;
		case IconSizeType.medium:
			sizeVar = IconSizes.medium;
			break;
		case IconSizeType.big:
			sizeVar = IconSizes.big;
			break;

		default:
			sizeVar = size;
	}

	return `
          width: ${sizeVar}px;
          min-width: ${sizeVar}px;
          height: ${sizeVar}px;
          min-height: ${sizeVar}px;
        `;
};

const commonIconsStyles = css<{ size?: IconSizeType | number }>`
  overflow: hidden;
  vertical-align: middle;
  ${(props) => getSizeStyle(props.size)};
`;

export const isIconSizeType = (size: unknown): size is IconSizeType => {
	return (
		typeof size === "string" &&
		Object.values(IconSizeType).includes(size as IconSizeType)
	);
};

export default commonIconsStyles;
