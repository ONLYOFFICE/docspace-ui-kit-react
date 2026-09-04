import React from "react";

import { AsideHeader } from "../../aside";
import type { HeaderProps } from "../Selector.types";

const Header = React.memo(
	({
		onBackClick,
		onCloseClick,
		withoutBackButton,
		headerLabel,
		withoutBorder,
		isCloseable,
	}: HeaderProps) => {
		return (
			<AsideHeader
				header={headerLabel}
				isBackButton={
					!withoutBackButton ? typeof withoutBackButton === "boolean" : false
				}
				onBackClick={onBackClick}
				onCloseClick={onCloseClick}
				withoutBorder={withoutBorder}
				isCloseable={isCloseable}
			/>
		);
	},
);

Header.displayName = "Header";

export { Header };
