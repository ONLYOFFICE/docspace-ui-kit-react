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

import React from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { getBrandName } from "../../../../constants/brands";

type GracePeriodModalProps = {
  visible: boolean;
  onClose: () => void;
};

const GracePeriodModal: React.FC<GracePeriodModalProps> = ({
  visible,
  onClose,
}) => {
  const paymentStore = usePaymentStore();
  const { paymentDate, gracePeriodEndDate, delayDaysCount } =
    paymentStore.tariff;
  const { tariffPlanTitle } = paymentStore.paymentQuotas;

  const t = useCommonTranslation();
  const navigate = useNavigate();
  const onClick = () => {
    navigate(paymentStore.routes.portalPayments);
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      autoMaxHeight
      isLarge
    >
      <ModalDialog.Header>{t("Warning")}</ModalDialog.Header>
      <ModalDialog.Body>
        <Text fontWeight={600}>
          {t("ServiceManagementUnavailable", { planName: tariffPlanTitle })}
        </Text>
        <br />
        <Text fontWeight={600}>{t("Reminder")}</Text>
        <Text as="span" dataTestId="grace_period_info">
          <CommonTrans
           
            i18nKey="GracePeriodActivatedInfo"
            values={{
              fromDate: paymentDate,
              byDate: gracePeriodEndDate,
              delayDaysCount,
            }}
            components={{
              1: <Text as="span" />,
            }}
          />
        </Text>{" "}
        <Text as="span">
          {t("GracePeriodActivatedDescription", {
            productName: getBrandName("ProductName"),
          })}
        </Text>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          key="OkButton"
          label={t("GoToTariffPlan")}
          size={ButtonSize.normal}
          primary
          onClick={onClick}
          testId="grace_period_ok_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          onClick={onClose}
          testId="grace_period_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(GracePeriodModal);
