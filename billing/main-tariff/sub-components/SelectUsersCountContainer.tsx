import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../utils/i18n";

import { getConvertedSize } from "../../utils/common";
import QuantityPicker from "../../../components/quantity-picker";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

let formattedSizeTitle: string | null = null;
const SelectUsersCountContainer = observer(
  ({ isDisabled, isNeedPlusSign }: { isDisabled: boolean; isNeedPlusSign: boolean }) => {
    const store = usePaymentStore();

    const {
      isLoading,
      minAvailableManagersValue,
      managersCount,
      maxAvailableManagersCount,
      setManagersCount,
      setTotalPrice,
      isLessCountThanAcceptable,
      stepByQuotaForManager,
      isAlreadyPaid,
      allowedStorageSizeByQuota,
    } = store;

    const { addedManagersCountTitle, usedTotalStorageSizeTitle } =
      store.paymentQuotas;

    const t = useCommonTranslation();

    const sizeValue = getConvertedSize(t, allowedStorageSizeByQuota);
    formattedSizeTitle = `${usedTotalStorageSizeTitle ?? ""}: ${sizeValue}${isNeedPlusSign ? "+" : ""}`;

    const onChangeNumber = (value: number) => {
      setManagersCount(value);
      setTotalPrice(value);
    };

    const isUpdatingTariff = isLoading && isAlreadyPaid;

    return (
      <QuantityPicker
        className="select-users-count-container"
        value={
          isLessCountThanAcceptable ? minAvailableManagersValue : managersCount
        }
        minValue={minAvailableManagersValue}
        maxValue={maxAvailableManagersCount}
        step={stepByQuotaForManager}
        title={addedManagersCountTitle}
        subtitle={formattedSizeTitle}
        showPlusSign
        isDisabled={isDisabled || isUpdatingTariff}
        onChange={onChangeNumber}
        showSlider
      />
    );
  },
);

export default SelectUsersCountContainer;

