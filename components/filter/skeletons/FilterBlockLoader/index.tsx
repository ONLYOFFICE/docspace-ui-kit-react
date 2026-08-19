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

import React from "react";
import { RoomsType } from "../../../../enums";
import { RectangleSkeleton } from "../../../rectangle";

import { FilterBlockLoaderProps } from "./FilterBlockLoader.types";
import styles from "./FilterBlockLoader.module.scss";

const FilterBlockLoader = ({
	id,
	className,
	style,
	isRooms,
	isContactsPage,
	isContactsPeoplePage,
	isContactsGroupsPage,
	isContactsInsideGroupPage,
	isContactsGuestsPage,
	...rest
}: FilterBlockLoaderProps) => {
	const roomTypeLoader = isRooms ? (
		<>
			<RectangleSkeleton
				key={RoomsType.EditingRoom}
				width="98"
				height="28"
				borderRadius="16"
				className="loader-item tag-item"
			/>
			<RectangleSkeleton
				key={RoomsType.CustomRoom}
				width="89"
				height="28"
				borderRadius="16"
				className="loader-item tag-item"
			/>
		</>
	) : null;

	return (
		<div
			id={id}
			className={`${styles.filterContainer} ${className || ""}`}
			style={style}
			{...rest}
			data-testid="filter-block-loader"
		>
			{!isRooms && !isContactsPage ? (
				<div className={styles.filterBlock} data-is-last="false">
					<RectangleSkeleton
						width="50"
						height="16"
						borderRadius="3"
						className="loader-item"
					/>
					<RectangleSkeleton
						width="100%"
						height="32"
						borderRadius="3"
						className="loader-item"
					/>
					<div className="row-loader">
						<RectangleSkeleton
							width="16"
							height="16"
							borderRadius="3"
							className="loader-item"
						/>
						<RectangleSkeleton
							width="137"
							height="20"
							borderRadius="3"
							className="loader-item"
						/>
					</div>
				</div>
			) : null}

			{!isContactsInsideGroupPage ? (
				<div className={styles.filterBlock} data-is-last="true">
					<RectangleSkeleton
						width="51"
						height="16"
						borderRadius="3"
						className="loader-item"
					/>
					<div className="row-loader">
						<RectangleSkeleton
							width={isContactsPeoplePage ? "120" : "51"}
							height="28"
							borderRadius="16"
							className="loader-item"
						/>
						<RectangleSkeleton
							width="68"
							height="28"
							borderRadius="16"
							className="loader-item"
						/>
					</div>
					{isRooms || isContactsGroupsPage ? (
						<div className="row-loader">
							<RectangleSkeleton
								width="16"
								height="16"
								borderRadius="3"
								className="loader-item"
							/>
							<RectangleSkeleton
								width={isContactsGroupsPage ? "150" : "137"}
								height="20"
								borderRadius="3"
								className="loader-item"
							/>
						</div>
					) : null}
				</div>
			) : null}

			{isRooms || isContactsPeoplePage || isContactsInsideGroupPage ? (
				<div className={styles.filterBlock} data-is-last="false">
					<RectangleSkeleton
						width="50"
						height="16"
						borderRadius="3"
						className="loader-item"
					/>
					<div className="row-loader">
						{isContactsPeoplePage || isContactsInsideGroupPage ? (
							<>
								<RectangleSkeleton
									width="67"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="80"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="83"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
							</>
						) : isRooms ? (
							roomTypeLoader
						) : null}
					</div>
				</div>
			) : null}

			{isContactsPeoplePage ||
			isContactsGuestsPage ||
			isContactsInsideGroupPage ? (
				<div className={styles.filterBlock} data-is-last="false">
					<RectangleSkeleton
						width="50"
						height="16"
						borderRadius="3"
						className="loader-item"
					/>
					<div className="row-loader">
						<RectangleSkeleton
							width="114"
							height="28"
							borderRadius="16"
							className="loader-item tag-item"
						/>
						<RectangleSkeleton
							width="110"
							height="28"
							borderRadius="16"
							className="loader-item tag-item"
						/>
						<RectangleSkeleton
							width="108"
							height="28"
							borderRadius="16"
							className="loader-item tag-item"
						/>
						<RectangleSkeleton
							width="59"
							height="28"
							borderRadius="16"
							className="loader-item tag-item"
						/>
					</div>
				</div>
			) : null}

			{!isContactsGroupsPage ? (
				<div className={styles.filterBlock} data-is-last="true">
					<RectangleSkeleton
						width="50"
						height="16"
						borderRadius="3"
						className="loader-item"
					/>
					<div className="row-loader">
						{isContactsPage ? (
							<>
								<RectangleSkeleton
									width="57"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="57"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
							</>
						) : isRooms ? (
							<>
								<RectangleSkeleton
									width="67"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="73"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="67"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="74"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="65"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="72"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
							</>
						) : (
							<>
								<RectangleSkeleton
									width="73"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="99"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="114"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="112"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="130"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="66"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="81"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="74"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
								<RectangleSkeleton
									width="68"
									height="28"
									borderRadius="16"
									className="loader-item tag-item"
								/>
							</>
						)}
					</div>
				</div>
			) : null}
		</div>
	);
};

export { FilterBlockLoader };
export default FilterBlockLoader;
