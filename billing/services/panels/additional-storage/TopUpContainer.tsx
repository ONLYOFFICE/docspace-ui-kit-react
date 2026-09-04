import { DISK_STORAGE } from "../../../constants";
import { observer } from "mobx-react";

import TopUpModal from "../../../shared/top-up-balance/TopUpModal";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

type TopUpContainerTypes = {
  isVisibleContainer: boolean;
  onCloseTopUpModal: () => void;
  amount?: number;
  initialAmount?: number;
};

const TopUpContainer = (props: TopUpContainerTypes) => {
  const {
    isVisibleContainer,
    onCloseTopUpModal,
    amount,
    initialAmount,
  } = props;

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { storageServiceName } = paymentStore;
  const { recommendedAmount = 0 } = servicesStore;

  const recommended = initialAmount ?? recommendedAmount;

  return isVisibleContainer ? (
    <TopUpModal
      visible={isVisibleContainer}
      onClose={onCloseTopUpModal}
      headerProps={{
        isBackButton: true,
        onBackClick: onCloseTopUpModal,
        onCloseClick: onCloseTopUpModal,
      }}
      {...(recommended > 0 && {
        recommendedAmount: recommended.toString(),
        amount: amount!.toString(),
      })}
      serviceName={storageServiceName ?? DISK_STORAGE}
    />
  ) : null;
};

export default observer(TopUpContainer);
