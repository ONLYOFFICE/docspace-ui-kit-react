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
import { useCommonTranslation } from "../../../utils/i18n";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";

interface ConfirmationDialogProps {
  visible: boolean;
  onClose: () => void;
  bodyText: React.ReactNode | React.ReactNode[];
  title: string;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  onClose,
  bodyText,
  title,
  onConfirm,
}) => {
  const t = useCommonTranslation();

  const bodyItems = Array.isArray(bodyText) ? bodyText : [bodyText];

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      withBodyScroll
    >
      <ModalDialog.Header>{title}</ModalDialog.Header>
      <ModalDialog.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {bodyItems.map((item, index) => (
            <Text as="span" key={index}>
              {item}
            </Text>
          ))}
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={t("ContinueButton")}
          size={ButtonSize.normal}
          onClick={onConfirm}
          primary
          scale
          testId="service-confirmation-dialog-continue-button"
        />
        <Button
          label={t("CancelButton")}
          size={ButtonSize.normal}
          onClick={onClose}
          testId="service-confirmation-dialog-close-button"
          scale
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ConfirmationDialog;
