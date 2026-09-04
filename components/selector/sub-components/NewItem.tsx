import React from "react";

import classNames from "classnames";

import { AddButton } from "../../add-button";

import NewItemDropDown from "./NewItemDropDown";
import useCreateDropDown from "../hooks/useCreateDropDown";
import type { NewItemProps } from "../Selector.types";

import styles from "../Selector.module.scss";

const NewItem = ({
	label,
	style,
	dropDownItems,
	onCreateClick,
	hotkey,
	inputItemVisible,
	listHeight,
}: NewItemProps) => {
	const { isOpenDropDown, onCloseDropDown, setIsOpenDropDown } =
		useCreateDropDown();

	const onCreateClickAction = React.useCallback(() => {
		if (isOpenDropDown || inputItemVisible) return;
		if (dropDownItems) return setIsOpenDropDown(true);

		onCreateClick?.();
	}, [
		dropDownItems,
		inputItemVisible,
		isOpenDropDown,
		onCreateClick,
		setIsOpenDropDown,
	]);

	React.useEffect(() => {
		if (isOpenDropDown && inputItemVisible) setIsOpenDropDown(false);
	}, [inputItemVisible, isOpenDropDown, setIsOpenDropDown]);

	const onKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key.toLowerCase() === hotkey && e.shiftKey) {
				onCreateClickAction();
			}
		},
		[hotkey, onCreateClickAction],
	);

	React.useEffect(() => {
		if (!hotkey) return;
		window.removeEventListener("keypress", onKeyDown);
		window.addEventListener("keypress", onKeyDown);

		return () => {
			window.removeEventListener("keypress", onKeyDown);
		};
	}, [hotkey, onCreateClickAction, onKeyDown]);

	return (
		<div
			key="create-new-item"
			style={style}
			className={classNames(styles.selectorItem, styles.hoverable)}
			onClick={onCreateClickAction}
		>
			<AddButton
				isAction
				label={label}
				titleText={label}
				fontSize="14px"
				lineHeight="18px"
				noSelect
				dir="auto"
				truncate
			/>
			{isOpenDropDown && dropDownItems && dropDownItems.length > 0 ? (
				<NewItemDropDown
					dropDownItems={dropDownItems}
					onCloseDropDown={onCloseDropDown}
					listHeight={listHeight}
				/>
			) : null}
		</div>
	);
};

export default NewItem;
