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

import { useState } from "react";
import { useCommonTranslation } from "../../utils/i18n";
import type { TTranslation } from "../../utils/common";
import { observer } from "mobx-react";

import { FieldContainer } from "../../components/field-container";
import { Button, ButtonSize } from "../../components/button";
import { TextInput, InputType, InputSize } from "../../components/text-input";
import { Text } from "../../components/text";
import { Textarea } from "../../components/textarea";
import {
  ModalDialog,
  ModalDialogType,
} from "../../components/modal-dialog";
import { EmailInput } from "../../components/email-input";
import type { TValidate } from "../../components/email-input";
import { ErrorKeys } from "../../enums";

import { usePaymentStore } from "../store/PaymentStoreProvider";

type SalesDepartmentRequestDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const SalesDepartmentRequestDialog = observer(
  ({ visible, onClose }: SalesDepartmentRequestDialogProps) => {
    const paymentStore = usePaymentStore();
    const { sendPaymentRequest } = paymentStore;

    const t = useCommonTranslation();

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [emailError, setEmailError] = useState("");

    const [description, setDescription] = useState("");
    const [isValidDescription, setIsValidDescription] = useState(true);

    const [name, setName] = useState("");
    const [isValidName, setIsValidName] = useState(true);

    const onCloseModal = () => {
      onClose?.();
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.currentTarget.value);
      setIsValidEmail(true);
    };

    const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.currentTarget.value);
      setIsValidName(true);
    };

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.currentTarget.value);
      setIsValidDescription(true);
    };

    const onSendRequest = async () => {
      const isEmailValid = email.trim();
      const isDescriptionValid = description.trim();
      const isNameValid = name.trim();

      if (!isEmailValid || !isDescriptionValid || !isNameValid) {
        setIsValidEmail(!!isEmailValid);
        setIsValidName(!!isNameValid);
        setIsValidDescription(!!isDescriptionValid);
        return;
      }

      if (emailError) {
        setIsValidEmail(false);
        return;
      }

      setIsLoading(true);

      await sendPaymentRequest(email, name, description, t as TTranslation);

      onClose?.();
    };

    const onValidateEmailInput = (result: TValidate) => {
      if (result.isValid) {
        setEmailError("");
        return;
      }

      const translatedErrors = result.errors?.map((errorKey: string) => {
        switch (errorKey) {
          case ErrorKeys.LocalDomain:
            return t("LocalDomain");
          case ErrorKeys.IncorrectDomain:
            return t("IncorrectDomain");
          case ErrorKeys.DomainIpAddress:
            return t("DomainIpAddress");
          case ErrorKeys.PunycodeDomain:
            return t("PunycodeDomain");
          case ErrorKeys.PunycodeLocalPart:
            return t("PunycodeLocalPart");
          case ErrorKeys.IncorrectLocalPart:
            return t("IncorrectLocalPart");
          case ErrorKeys.SpacesInLocalPart:
            return t("SpacesInLocalPart");
          case ErrorKeys.MaxLengthExceeded:
            return t("MaxLengthExceeded");
          case ErrorKeys.IncorrectEmail:
            return t("IncorrectEmail");
          case ErrorKeys.ManyEmails:
            return t("ManyEmails");
          case ErrorKeys.EmptyEmail:
            return t("EmptyEmail");
          default:
            throw new Error("Unknown translation key");
        }
      });

      if (translatedErrors) setEmailError(translatedErrors[0]);
    };

    return (
      <ModalDialog
        visible={visible}
        onClose={onCloseModal}
        autoMaxHeight
        displayType={ModalDialogType.modal}
      >
        <ModalDialog.Header>
          <Text isBold fontSize="21px">
            {t("SalesDepartmentRequest")}
          </Text>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Text
            key="text-body"
            className="text-body"
            isBold={false}
            fontSize="13px"
          >
            {t("YouWillBeContacted")}
          </Text>

          <br />
          <FieldContainer
            className="name_field"
            key="name"
            isVertical
            hasError={!isValidName}
            labelVisible={false}
            errorMessage={t("RequiredField")}
            dataTestId="request_name_field"
          >
            <TextInput
              id="your-name"
              hasError={!isValidName}
              name="name"
              type={InputType.text}
              size={InputSize.base}
              scale
              tabIndex={1}
              placeholder={t("YourName")}
              isAutoFocussed
              isDisabled={isLoading}
              value={name}
              onChange={onChangeName}
              testId="request_name_input"
            />
          </FieldContainer>

          <FieldContainer
            className="e-mail_field"
            key="e-mail"
            isVertical
            labelVisible={false}
            hasError={!isValidEmail}
            errorMessage={emailError}
            dataTestId="request_email_field"
          >
            <EmailInput
              id="registration-email"
              name="e-mail"
              scale
              value={email}
              onChange={onChangeEmail}
              onValidateInput={onValidateEmailInput}
              hasError={!isValidEmail}
              placeholder={t("EnterEmail")}
              dataTestId="request_email_input"
            />
          </FieldContainer>

          <FieldContainer
            className="description_field"
            key="text-description"
            isVertical
            hasError={!isValidDescription}
            labelVisible={false}
            errorMessage={t("RequiredField")}
            dataTestId="request_description_field"
          >
            <Textarea
              id="request-details"
              heightScale={false}
              hasError={!isValidDescription}
              placeholder={t("RequestDetails")}
              tabIndex={3}
              value={description}
              onChange={onChangeDescription}
              isDisabled={isLoading}
              heightTextArea={100}
              maxLength={255}
              dataTestId="request_description_textarea"
            />
          </FieldContainer>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            className="send-button"
            label={isLoading ? t("Sending") : t("SendButton")}
            size={ButtonSize.normal}
            primary
            onClick={onSendRequest}
            isLoading={isLoading}
            isDisabled={isLoading}
            tabIndex={3}
            testId="send_sales_request_button"
          />
          <Button
            className="cancel-button"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            onClick={onCloseModal}
            isLoading={isLoading}
            isDisabled={isLoading}
            tabIndex={3}
            testId="cancel_sales_request_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default SalesDepartmentRequestDialog;
