import InfoIconReactSvg from "../../../assets/info.outline.react.svg";
import { Text } from "../../text";

import type { TSelectorInfo } from "../Selector.types";
import styles from "../Selector.module.scss";

export const Info = ({ infoText, withInfoBadge }: TSelectorInfo) => {
	return (
		<div className={styles.info} id="selector-info-text">
			<div className={styles.infoTextWrapper}>
				{withInfoBadge ? <InfoIconReactSvg /> : null}
				<Text
					fontSize="12px"
					fontWeight={400}
					lineHeight="16px"
					className={styles.text}
				>
					{infoText}
				</Text>
			</div>
		</div>
	);
};
