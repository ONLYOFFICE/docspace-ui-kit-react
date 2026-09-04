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
