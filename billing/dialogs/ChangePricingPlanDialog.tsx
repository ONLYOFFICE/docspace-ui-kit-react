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
import { ModalDialog } from "../../components/modal-dialog";
import { getConvertedSize } from "../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./ChangePricingPlan.module.scss";
import { getBrandName } from "../../constants/brands";

type ChangePricingPlanDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const ChangePricingPlanDialog = observer(
  ({ visible, onClose }: ChangePricingPlanDialogProps) => {
    const store = usePaymentStore();
    const { managersCount, allowedStorageSizeByQuota } = store;
    const { addedManagersCount, usedTotalStorageSizeCount } = store.quotas;

    const t = useCommonTranslation();

    const onCloseModal = () => {
      onClose?.();
    };

    const allowedStorageSpace = getConvertedSize(t, allowedStorageSizeByQuota);
    const currentStorageSpace = getConvertedSize(t, usedTotalStorageSizeCount);

    const planUsersLimitations = (
      <Text as="span" fontSize="13px">
        <CommonTrans
          i18nKey="PlanUsersLimit"
         
          values={{
            usersCount: managersCount,
            productName: getBrandName("ProductName"),
            currentUsersCount: addedManagersCount,
          }}
          components={{
            1: <Text as="span" fontWeight={700} />,
          }}
        />
      </Text>
    );

    const storagePlanLimitations = (
      <Text as="span" fontSize="13px">
        <CommonTrans
          i18nKey="PlanStorageLimit"
         
          values={{
            storageValue: allowedStorageSpace,
            currentStorageValue: currentStorageSpace,
          }}
          components={{
            1: <Text as="span" fontWeight={700} />,
          }}
        />
      </Text>
    );

    return (
      <ModalDialog
        visible={visible}
        onClose={onCloseModal}
        autoMaxHeight
        isLarge
      >
        <ModalDialog.Header>{t("ChangePricingPlan")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.content}>
            <Text fontSize="13px" isBold className={styles.cannotDowngradePlan}>
              {t("CannotChangePlan")}
            </Text>
            {planUsersLimitations}
            <br />
            {storagePlanLimitations}

            <Text fontSize="13px" className={styles.saveOrChange}>
              {t("SaveOrChange")}
            </Text>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            className="ok-button"
            label={t("OKButton")}
            size={ButtonSize.normal}
            primary
            onClick={onCloseModal}
            tabIndex={3}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default ChangePricingPlanDialog;

