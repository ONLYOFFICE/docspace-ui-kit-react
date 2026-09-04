import React, { useState } from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { Button, ButtonSize } from "../../../components/button";
import { observer } from "mobx-react";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import SalesDepartmentRequestDialog from "../../dialogs/SalesDepartmentRequestDialog";
import styles from "./SubComponents.module.scss";

type RequestButtonContainerProps = {
  isDisabled?: boolean;
};

const RequestButtonContainer = observer(
  ({ isDisabled }: RequestButtonContainerProps) => {
    const paymentStore = usePaymentStore();
    const { isLoading } = paymentStore;

    const [isVisibleDialog, setIsVisibleDialog] = useState(false);
    const t = useCommonTranslation();

    const toDoRequest = () => {
      setIsVisibleDialog(true);
    };

    const onClose = () => {
      isVisibleDialog && setIsVisibleDialog(false);
    };

    return (
      <div className={styles.requestButton}>
        {isVisibleDialog ? (
          <SalesDepartmentRequestDialog
            visible={isVisibleDialog}
            onClose={onClose}
          />
        ) : null}
        <Button
          className="send-request-button"
          label={t("SendRequest")}
          size={ButtonSize.medium}
          primary
          isDisabled={isLoading || isDisabled}
          onClick={toDoRequest}
          isLoading={isLoading}
          testId="sales_request_button"
        />
      </div>
    );
  },
);

export default RequestButtonContainer;

