import React, { use } from "react";

import { Avatar, AvatarRole, AvatarSize } from "../../avatar";
import { Text } from "../../text";
import { Checkbox } from "../../checkbox";

import { SelectAllContext } from "../contexts/SelectAll";
import styles from "../Selector.module.scss";
import type { SelectAllProps } from "../Selector.types";

const SelectAll = React.memo(
	({ show, isLoading, rowLoader }: SelectAllProps) => {
		const {
			selectAllIcon,
			selectAllLabel,
			isAllChecked,
			isAllIndeterminate,
			onSelectAll,
		} = use(SelectAllContext);

		if (!show) return null;

		if (isLoading) return rowLoader;

		const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
			if (e.target instanceof HTMLElement && e.target.closest(".checkbox"))
				return;

			onSelectAll?.();
		};

		return (
			<div className={styles.selectAll} onClick={onClick}>
				<Avatar
					className={styles.avatar}
					source={selectAllIcon ?? ""}
					role={AvatarRole.user}
					size={AvatarSize.min}
				/>

				<Text
					className={styles.label}
					fontWeight={600}
					fontSize="14px"
					noSelect
					truncate
				>
					{selectAllLabel}
				</Text>

				<Checkbox
					className={styles.checkbox}
					isChecked={isAllChecked}
					isIndeterminate={isAllIndeterminate}
				/>
			</div>
		);
	},
);

SelectAll.displayName = "SelectAll";

export { SelectAll };
