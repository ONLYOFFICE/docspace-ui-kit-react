import type React from "react";

import classNames from "classnames";

import StatisticsIcon from "../../../../../../assets/icons/16/statistics.react.svg";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import type { OperationTokenUsage } from "../../../../../store/PaymentStore";
import {
  TOKEN_USAGE_TOOLTIP_ID,
  getCachedTokensPercent,
  serializeTokenUsage,
} from "../../../utils";

import styles from "../TokenUsage.module.scss";

type TokenUsageAnchorProps = {
  usage?: OperationTokenUsage | null;
  className?: string;
  children?: React.ReactNode;
};

export const TokenUsageAnchor = ({
  usage,
  className,
  children,
}: TokenUsageAnchorProps) => {
  const t = useCommonTranslation();

  if (!usage) return <>{children}</>;

  const cached = getCachedTokensPercent(usage) !== null;

  return (
    <div
      className={classNames(styles.anchor, className)}
      data-tooltip-id={TOKEN_USAGE_TOOLTIP_ID}
      data-tooltip-content={serializeTokenUsage(usage)}
      data-testid="transaction_token_usage"
      data-cached={cached}
    >
      <StatisticsIcon
        className={classNames(styles.icon, { [styles.iconCached]: cached })}
        role="img"
        aria-label={t("TokenUsage")}
      />
      {children}
    </div>
  );
};
