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

import React, { useMemo } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import EditPenSvgUrl from "../../assets/icons/12/pen-edit.react.svg";
import Camera10ReactSvgUrl from "../../assets/icons/10/cover.camera.react.svg";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg";
import TemplateRoomIcon from "../../assets/template-room-icon.react.svg";

import { useClickOutside, getTextColor } from "../../utils";
import { ROOM_ACTION_KEYS } from "../../constants";

import { useInterfaceDirection, useTheme } from "../../context";

import { globalColors } from "../../providers/theme";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import { Tooltip } from "../tooltip";

import { encodeToBase64, getRoomTitle } from "./RoomIcon.utils";
import styles from "./RoomIcon.module.scss";
import type { RoomIconProps } from "./RoomIcon.types";

const RoomIcon = ({
	title,
	isArchive = false,
	color,
	size = "32px",
	radius = "6px",
	showDefault,
	imgClassName,
	logo,
	badgeUrl,
	badgeIconNode,
	onBadgeClick,
	className,
	withEditing,
	hoverSrc,
	model,
	onChangeFile,
	isEmptyIcon,
	dropDownManualX,
	tooltipContent,
	tooltipId,
	isTemplate = false,
	dataTestId,
}: RoomIconProps) => {
	const [correctImage, setCorrectImage] = React.useState(true);
	const [openEditLogo, setOpenLogoEdit] = React.useState(false);

	const onToggleOpenEditLogo = () => setOpenLogoEdit(!openEditLogo);

	const iconRef = React.useRef<HTMLDivElement>(null);
	const inputFilesElement = React.useRef<HTMLInputElement>(null);

	const { isBase } = useTheme();

	const onInputClick = () => {
		if (inputFilesElement.current) {
			inputFilesElement.current.value = "";
		}
	};

	useClickOutside(iconRef, () => {
		setOpenLogoEdit(false);
	});

	const { isRTL } = useInterfaceDirection();

	const roomTitle = useMemo(() => getRoomTitle(title ?? ""), [title]);

	const imgSrc = logo
		? typeof logo === "string"
			? logo
			: logo.cover
				? `data:image/svg+xml;base64, ${encodeToBase64(logo?.cover?.data)}`
				: typeof logo === "object" && logo.medium
					? logo.medium
					: undefined
		: undefined;

	const dropdownElement = (
		<DropDown
			manualX={dropDownManualX || "-10px"}
			open={openEditLogo}
			clickOutsideAction={() => setOpenLogoEdit(false)}
			withBackdrop={false}
			isDefaultMode={false}
		>
			{model?.map((option) => {
				const optionOnClickAction = () => {
					setOpenLogoEdit(false);
					if (option.key === ROOM_ACTION_KEYS.CREATE_EDIT_ROOM_UPLOAD) {
						return option.onClick(inputFilesElement);
					}
					option.onClick();
				};
				return (
					<DropDownItem
						key={option.key}
						label={option.label}
						icon={option.icon}
						onClick={optionOnClickAction}
						testId={option.key}
					/>
				);
			})}
		</DropDown>
	);

	const prefetchImage = React.useCallback(() => {
		if (!imgSrc || typeof imgSrc !== "string") return;
		setCorrectImage(true);
		const img = new Image();

		img.src = imgSrc;

		img.onerror = () => {
			setCorrectImage(false);
		};
	}, [imgSrc]);

	const getContent = () => (
		<Text fontSize="12px" fontWeight={400} noSelect>
			{tooltipContent}
		</Text>
	);

	React.useEffect(() => {
		prefetchImage();
	}, [prefetchImage]);

	const isBigSize = size === "96px";

	const coverSize = +size.replace("px", "") * 0.625;
	const textColor = color && getTextColor(`#${color}`, 202);

	const isWrongImage =
		!correctImage &&
		imgSrc &&
		typeof imgSrc !== "string" &&
		logo &&
		typeof logo !== "string" &&
		!logo?.color;

	const roomTitleText = (
		<Text
			className={classNames("room-title", styles.roomTitle)}
			noSelect
			data-testid="room-title"
			style={
				{
					"--room-icon-text-color":
						isBase && isWrongImage
							? globalColors.black
							: !isBase && !isArchive
								? `#${color}`
								: textColor,
				} as React.CSSProperties
			}
		>
			{roomTitle}
		</Text>
	);

	const isImage =
		typeof logo === "string" || (typeof logo === "object" && logo?.medium);

	return (
		<>
			<div
				ref={iconRef}
				className={classNames(
					{
						[styles.withHover]: !!hoverSrc && !isArchive,
						[styles.withEditing]: withEditing,
						[styles.isEmptyIcon]: isEmptyIcon,
						[styles.isArchive]: isArchive,
						[styles.wrongImage]: isWrongImage,
					},
					className,
					styles.roomIcon,
				)}
				style={
					{
						"--room-icon-size": size,
						"--room-icon-radius": radius,
						"--room-icon-color": color ? `#${color}` : null,
						"--room-icon-text-color": textColor,
						"--room-icon-cover-size": coverSize / 20,
					} as React.CSSProperties
				}
				data-testid={dataTestId ?? "room-icon"}
				data-is-archive={isArchive}
				data-has-editing={withEditing}
				data-is-template={isTemplate}
				data-is-empty={isEmptyIcon}
				onClick={onToggleOpenEditLogo}
			>
				{isTemplate ? (
					<div className="template-icon-container template-hover">
						<div className="template-icon-svg">
							<TemplateRoomIcon />
						</div>
						{showDefault || !correctImage ? (
							roomTitleText
						) : isImage ? (
							<img
								className={classNames([imgClassName, "room-image"])}
								src={imgSrc}
								alt="room icon"
							/>
						) : (
							<ReactSVG
								className={classNames(
									"room-icon-cover template-icon-svg-icon",
									styles.roomIconCover,
								)}
								src={imgSrc as string}
							/>
						)}
					</div>
				) : isEmptyIcon ? (
					<>
						<div className="room-icon-empty" data-testid="empty-icon">
							<Camera10ReactSvgUrl />
						</div>
						<div
							className={classNames(styles.editWrapper, styles.size20, {
								[styles.rtl]: isRTL,
							})}
						>
							<IconButton
								className="open-plus-logo-icon"
								size={12}
								iconNode={<PlusSvgUrl />}
								onClick={onToggleOpenEditLogo}
								isFill
							/>
							{dropdownElement}
						</div>
					</>
				) : showDefault || !correctImage ? (
					<>
						<div className="room-background hover-class" />
						{roomTitleText}
					</>
				) : logo &&
					typeof logo !== "string" &&
					logo?.cover &&
					typeof imgSrc === "string" &&
					imgSrc ? (
					<>
						<div className="room-background hover-class" />
						<ReactSVG
							className={classNames("room-icon-cover", styles.roomIconCover)}
							style={
								{
									"--room-icon-text-color": isBase ? textColor : `#${color}`,
								} as React.CSSProperties
							}
							src={imgSrc}
							data-testid="room-icon-cover"
						/>
					</>
				) : (
					<img
						className={classNames([
							imgClassName,
							"hover-class",
							"not-selectable",
						])}
						src={imgSrc as string}
						alt="room icon"
						data-testid="room-icon-image"
					/>
				)}

				{hoverSrc && !isArchive ? (
					<div
						className={classNames(styles.roomIconContainer)}
						onClick={onToggleOpenEditLogo}
						data-testid="hover-container"
					>
						<img
							className={styles.roomIconHover}
							src={hoverSrc}
							alt="room icon hover"
							data-testid="hover-image"
						/>
						{dropdownElement}
					</div>
				) : null}

				{(badgeUrl || badgeIconNode) && !withEditing ? (
					<div
						className={classNames(styles.roomIconBadge, {
							[styles.isBig]: isBigSize,
						})}
						data-testid="badge-container"
					>
						<IconButton
							data-tooltip-id={tooltipId}
							onClick={onBadgeClick}
							iconName={badgeUrl}
							iconNode={badgeIconNode}
							size={isBigSize ? 28 : 12}
							className={classNames(
								styles.roomIconButton,
								{
									[styles.isBig]: isBigSize,
									[styles.isHovered]: !!tooltipContent,
								},
								"room-icon_button",
							)}
							isFill
						/>

						{tooltipContent ? (
							<Tooltip id={tooltipId} getContent={getContent} place="bottom" />
						) : null}
					</div>
				) : null}

				{withEditing && !isArchive ? (
					<div
						className={classNames(styles.editWrapper, styles.size20, {
							[styles.rtl]: isRTL,
							[styles.isEditIcon]: withEditing,
						})}
					>
						<IconButton
							className="open-edit-logo-icon"
							size={12}
							iconNode={<EditPenSvgUrl />}
							onClick={onToggleOpenEditLogo}
							isFill
						/>
						{dropdownElement}
					</div>
				) : null}
			</div>
			{onChangeFile ? (
				<input
					id="customFileInput"
					data-testid="customFileInput"
					className="custom-file-input"
					type="file"
					onChange={onChangeFile}
					accept="image/png, image/jpeg"
					onClick={onInputClick}
					ref={inputFilesElement}
					style={{ display: "none" }}
				/>
			) : null}
		</>
	);
};

export { RoomIcon };

export * from "./RoomIcon.types";

export * from "./RoomIcon.utils";
