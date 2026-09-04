import React from "react";
import { observer } from "mobx-react";
import { Button, ButtonSize } from "../../../components/button";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./SubComponents.module.scss";

const DowngradePlanButtonContainer = observer(
  ({ isDisabled, onDowngradeTariff, onUpdateTariff, buttonLabel }: { isDisabled?: boolean; onDowngradeTariff?: () => void; onUpdateTariff?: () => void; buttonLabel: string }) => {
    const paymentStore = usePaymentStore();
    const { isLoading, isLessCountThanAcceptable } = paymentStore;

    return (
      <div className={styles.downgradePlanButton}>
        <Button
          label={buttonLabel}
          size={ButtonSize.medium}
          primary
          isDisabled={isLessCountThanAcceptable || isLoading || isDisabled}
          onClick={onDowngradeTariff ?? onUpdateTariff}
          isLoading={isLoading}
          testId="downgrade_plan_button"
        />
      </div>
    );
  },
);

export default DowngradePlanButtonContainer;

