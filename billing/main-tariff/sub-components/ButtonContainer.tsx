import React from "react";
import { observer } from "mobx-react";
import RequestButtonContainer from "./RequestButtonContainer";
import UpdatePlanButtonContainer from "./UpdatePlanButtonContainer";
import type { TTranslation } from "../../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./ButtonContainer.module.scss";

const ButtonContainer = observer(
  ({ isDisabled, t }: { isDisabled: boolean; t: TTranslation }) => {
    const store = usePaymentStore();
    const { isNeedRequest } = store;

    return (
      <div className={styles.body}>
        {isNeedRequest ? (
          <RequestButtonContainer isDisabled={isDisabled} />
        ) : (
          <UpdatePlanButtonContainer t={t} isDisabled={isDisabled} />
        )}
      </div>
    );
  },
);

export default ButtonContainer;

