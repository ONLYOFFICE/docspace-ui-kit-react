import { Text } from "../../../components/text";
import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react";
import SelectTotalSizeContainer from "./SelectTotalSizeContainer";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./SubComponents.module.scss";

const CurrentUsersCountContainer = observer(({
  isNeedPlusSign,
  isDisabled,
  addedManagersCountTitle,
}: {
  isNeedPlusSign: boolean;
  isDisabled: boolean;
  addedManagersCountTitle?: string | null;
}) => {

  const store = usePaymentStore();
  const { maxCountManagersByQuota } = store.quotas;

  return (
    <div className={styles.currentUsersContainer}>
      <Text
        fontSize="16px"
        fontWeight={600}
        textAlign="center"
        className={classNames(styles.currentAdminsNumber, {
          [styles.isDisabled]: isDisabled,
        })}
      >
        {addedManagersCountTitle}
      </Text>
      <Text
        fontSize="44px"
        fontWeight={700}
        textAlign="center"
        className={classNames(styles.currentAdminsNumber, {
          [styles.isDisabled]: isDisabled,
        })}
      >
        {maxCountManagersByQuota}
      </Text>
      <SelectTotalSizeContainer isNeedPlusSign={isNeedPlusSign} />
    </div>
  );
});

export default CurrentUsersCountContainer;
