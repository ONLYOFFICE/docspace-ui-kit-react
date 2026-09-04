import React from "react";

import classNames from "classnames";

import { Portal } from "../../portal";

import { isMobile as isMobileUtils } from "../../../utils";
import { Backdrop } from "../../backdrop";

import { Scrollbar } from "../../scrollbar";

import styles from "../Selector.module.scss";
import type { NewItemDropDownProps } from "../Selector.types";

export const DROPDOWN_CLASS_NAME = "selector-create-new-dropdown";

const DROPDOWN_CONTAINER_WITH_PADDING = 560;
const PADDING = 80;

const NewItemDropDown = ({
	dropDownItems,
	isEmpty,
	onCloseDropDown,
	listHeight,
}: NewItemDropDownProps) => {
	const [isMobile, setIsMobile] = React.useState(
		isMobileUtils(window.innerWidth),
	);

	React.useEffect(() => {
		window.addEventListener("mouseup", onCloseDropDown);

		return () => {
			window.removeEventListener("mouseup", onCloseDropDown);
		};
	}, [onCloseDropDown]);

	React.useEffect(() => {
		const onResize = () => {
			if (isMobileUtils(window.innerWidth)) return setIsMobile(true);

			setIsMobile(false);
		};

		onResize();

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const dropDown =
		dropDownItems.length > 0 ? (
			<div
				className={classNames(
					styles.createDropDown,
					{ [styles.isEmpty]: isEmpty },
					DROPDOWN_CLASS_NAME,
				)}
			>
				{listHeight && listHeight < DROPDOWN_CONTAINER_WITH_PADDING ? (
					<Scrollbar style={{ height: listHeight - PADDING }}>
						{dropDownItems.map((item) => item)}
					</Scrollbar>
				) : (
					dropDownItems.map((item) => item)
				)}
			</div>
		) : null;

	const portal =
		dropDownItems.length > 0 ? (
			<Portal
				visible
				element={
					<>
						<Backdrop
							visible
							onClick={() => onCloseDropDown()}
							withBackground
							isAside
							zIndex={450}
						/>
						<div
							className={classNames(
								styles.createDropDown,
								{ [styles.isEmpty]: isEmpty },
								DROPDOWN_CLASS_NAME,
							)}
						>
							{dropDownItems.map((item) => item)}
						</div>
					</>
				}
			/>
		) : null;

	return isMobile ? portal : dropDown;
};

export default NewItemDropDown;
