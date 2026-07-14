/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";
import {
  ModalDialog,
  ModalDialogType,
} from "../../components/modal-dialog";
import { calculateTotalPrice, getConvertedSize } from "../utils/common";
import { STORAGE_TARIFF_DEACTIVATED } from "../constants";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useNavigate } from "react-router";
import styles from "./StorageTariff.module.scss";

type StorageTariffDeactivatedProps = {
  visible: boolean;
  onClose?: () => void;
  onOpenPanel?: () => void;
};

const StorageTariffDeactivated = observer(
  ({
    visible,
    onClose,
    onOpenPanel,
  }: StorageTariffDeactivatedProps) => {
    const navigate = useNavigate();
    const store = usePaymentStore();
    const {
      storagePriceIncrement,
      formatWalletCurrency,
      setIsShowTariffDeactivatedModal,
    } = store;
    const { previousStoragePlanSize } = store.tariff;
    const {
      usedTotalStorageSizeCount,
      maxTotalSizeByQuota,
      isStorageTariffLimit,
    } = store.quotas;

    const t = useCommonTranslation();

    const totalPrice = calculateTotalPrice(
      previousStoragePlanSize,
      storagePriceIncrement,
    );

    const onCloseModal = () => {
      localStorage.setItem(STORAGE_TARIFF_DEACTIVATED, "true");
      setIsShowTariffDeactivatedModal(false);
      onClose?.();
    };

    const onClick = () => {
      if (onOpenPanel) {
        onOpenPanel();
      } else {
        navigate(store.routes.services, { state: { openDialog: true } });
      }

      onCloseModal();
    };

    return (
      <ModalDialog
        visible={visible}
        onClose={onCloseModal}
        autoMaxHeight
        displayType={ModalDialogType.modal}
        isLarge
      >
        <ModalDialog.Header>
          <Text fontSize="21px" isBold>
            {t("Warning")}
          </Text>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Text fontWeight={600}>{t("StorageTariffDeactivated")}</Text>
          <br />
          <Text as="span">
            <CommonTrans
              i18nKey="PreviousPlan"
             
              values={{
                amount: `${previousStoragePlanSize} ${t("Gigabyte")}`,
                price: formatWalletCurrency(totalPrice, 2),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
                2: <Text className={styles.monthPayment} as="span" />,
              }}
            />
          </Text>
          <Text>
            <CommonTrans
              i18nKey="StorageUsed"
             
              values={{
                amount: getConvertedSize(t, usedTotalStorageSizeCount!),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
              }}
            />
          </Text>
          <Text>
            <CommonTrans
              i18nKey="AvailableLimit"
             
              values={{
                amount: getConvertedSize(t, maxTotalSizeByQuota!),
              }}
              components={{
                1: <Text fontWeight={600} as="span" />,
              }}
            />
          </Text>
          <br />
          <Text>{t("TopUpToReactivateStorage")}</Text>
          {isStorageTariffLimit ? (
            <Text as="span">{t("StorageRestrictions")}</Text>
          ) : null}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            className="send-button"
            label={
              onOpenPanel ? t("BuyStorage") : t("GoToService")
            }
            size={ButtonSize.normal}
            primary
            onClick={onClick}
            testId="go_to_service_button"
          />
          <Button
            className="cancel-button"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            onClick={onCloseModal}
            testId="close_storage_tariff_deactivated_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default StorageTariffDeactivated;
