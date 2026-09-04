import { useEffect, useState } from "react";

import { ComboBox, ComboBoxSize, type TOption } from "../../combobox";
import type { AccessSelectorProps, TAccessRight } from "../Selector.types";
import { isMobile } from "../../../utils";
import { AccessRightSelect } from "../../access-right-select";
import { SelectorAccessRightsMode } from "../Selector.enums";
import styles from "../Selector.module.scss";

const SELECTOR_PADDINGS = 32;

const AccessSelector = (props: AccessSelectorProps) => {
	const {
		onAccessRightsChange,
		accessRights,
		selectedAccessRight,
		footerRef,
		accessRightsMode = SelectorAccessRightsMode.Compact,
	} = props;

	const [width, setWidth] = useState(0);

	const isMobileView = isMobile();

	const onSelect = (opt?: TOption) =>
		onAccessRightsChange?.({ ...opt } as TAccessRight);

	useEffect(() => {
		const footerWidth = footerRef?.current?.offsetWidth;
		if (!footerWidth) return;

		setWidth(footerWidth - SELECTOR_PADDINGS);
	}, [footerRef]);

	return accessRightsMode === SelectorAccessRightsMode.Compact ? (
		<ComboBox
			className={styles.comboBox}
			onSelect={onSelect}
			options={accessRights as TOption[]}
			size={ComboBoxSize.content}
			scaled={false}
			manualWidth="auto"
			selectedOption={selectedAccessRight as TOption}
			showDisabledItems
			directionX="right"
			directionY="top"
			forceCloseClickOutside
		/>
	) : (
		<AccessRightSelect
			className={styles.accessRightSelect}
			selectedOption={selectedAccessRight as TOption}
			onSelect={onSelect}
			accessOptions={accessRights as TOption[]}
			size={ComboBoxSize.content}
			scaled={false}
			directionX="left"
			directionY="top"
			fixedDirection={isMobileView}
			manualWidth={isMobileView ? "100%" : `${width}px`}
			isAside={isMobileView}
			manualY={isMobileView ? "0px" : undefined}
			withoutBackground={!isMobileView}
			withBackground={!isMobileView}
			withBlur={isMobileView}
		/>
	);
};

export default AccessSelector;
