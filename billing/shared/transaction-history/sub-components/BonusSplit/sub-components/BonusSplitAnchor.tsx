import type React from "react";

import classNames from "classnames";

import GiftIcon from "../../../../../../assets/icons/12/gift.react.svg";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import type { WalletOperationDto } from "../../../../../store/PaymentStore";
import {
  BONUS_SPLIT_TOOLTIP_ID,
  getBonusSplit,
  serializeBonusSplit,
} from "../../../utils";

import styles from "../BonusSplit.module.scss";

type BonusSplitAnchorProps = {
  transaction: Pick<
    WalletOperationDto,
    "sources" | "currency" | "debit" | "type"
  >;
  className?: string;
  children?: React.ReactNode;
};

export const BonusSplitAnchor = ({
  transaction,
  className,
  children,
}: BonusSplitAnchorProps) => {
  const t = useCommonTranslation();
  const split = getBonusSplit(transaction);

  if (!split) return <>{children}</>;

  return (
    <div
      className={classNames(styles.anchor, className)}
      data-tooltip-id={BONUS_SPLIT_TOOLTIP_ID}
      data-tooltip-content={serializeBonusSplit(split)}
      data-testid="transaction_bonus_split"
      data-partial={split.wallet > 0}
    >
      {children}
      <GiftIcon
        className={styles.icon}
        role="img"
        aria-label={
          split.wallet > 0
            ? t("PaidPartlyWithPromoCredits")
            : t("PaidWithPromoCredits")
        }
      />
    </div>
  );
};
