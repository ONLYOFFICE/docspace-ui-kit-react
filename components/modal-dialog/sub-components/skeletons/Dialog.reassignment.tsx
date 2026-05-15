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

import { CircleSkeleton } from "../../../circle";
import { RectangleSkeleton } from "../../../rectangle";
import styles from "./Dialog.module.scss";

export const DialogReassignmentSkeleton = () => {
	return (
		<div
			className={styles.dataReassignmentLoader}
			data-testid="dialog-reassignment-skeleton"
		>
			<div className="user">
				<CircleSkeleton className="avatar" radius="40" x="40" y="40" />

				<div className="name">
					<RectangleSkeleton width="154" height="20" />
					<RectangleSkeleton width="113" height="20" />
				</div>
			</div>

			<div className="new-owner">
				<div className="new-owner_header">
					<RectangleSkeleton width="113" height="16" />
					<RectangleSkeleton width="253" height="20" />
				</div>

				<div className="new-owner_add">
					<RectangleSkeleton width="32" height="32" />
					<RectangleSkeleton width="113" height="20" />
				</div>
			</div>

			<div className="description">
				<RectangleSkeleton height="40" />
				<RectangleSkeleton width="223" height="20" />
				<RectangleSkeleton width="160" height="20" />
			</div>
		</div>
	);
};
