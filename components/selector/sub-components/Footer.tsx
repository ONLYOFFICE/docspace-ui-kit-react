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

import React, { useRef } from "react";
import classNames from "classnames";
import { useCommonTranslation } from "../../../utils";

import { Button, ButtonSize } from "../../button";
import { TextInput, InputSize, InputType } from "../../text-input";
import { Checkbox } from "../../checkbox";
import { Text } from "../../text";

import styles from "../Selector.module.scss";

import type { FooterProps } from "../Selector.types";
import AccessSelector from "./AccessSelector";

const Footer = React.memo(
  ({
    isMultiSelect,
    submitButtonLabel,
    selectedItemsCount,
    withCancelButton,
    cancelButtonLabel,
    withAccessRights,
    accessRights,
    selectedAccessRight,
    onSubmit,
    disableSubmitButton,
    onCancel,
    onAccessRightsChange,
    accessRightsMode,

    withFooterCheckbox,
    withFooterInput,
    footerInputHeader,
    footerCheckboxLabel,
    currentFooterInputValue,
    setNewFooterInputValue,
    isChecked,
    setIsFooterCheckboxChecked,
    submitButtonId,
    cancelButtonId,

    requestRunning,
    withErrorFooter,
  }: FooterProps) => {
    const t = useCommonTranslation();
    const ref = useRef<HTMLDivElement>(null);

    const label =
      selectedItemsCount && isMultiSelect
        ? `${submitButtonLabel} (${selectedItemsCount})`
        : submitButtonLabel;

    const onChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNewFooterInputValue?.(value);
    };

    const onChangeCheckbox = () => {
      setIsFooterCheckboxChecked?.((value: boolean) => !value);
    };

    return (
      <div
        ref={ref}
        className={classNames(styles.footer, "selector-footer", {
          [styles.withFooterCheckbox]: withFooterCheckbox && !withFooterInput,
          [styles.withFooterInput]: !withFooterCheckbox && withFooterInput,
          [styles.defaultHeight]: !withFooterCheckbox && !withFooterInput,
          [styles.withErrorFooter]: withErrorFooter,
        })}
      >
        {withFooterInput ? (
          <div className={styles.newNameContainer}>
            <Text
              className={styles.newNameHeader}
              lineHeight="20px"
              fontWeight={600}
              fontSize="13px"
            >
              {footerInputHeader}
            </Text>
            <div className={styles.newFileInputContainer}>
              <TextInput
                type={InputType.text}
                size={InputSize.base}
                className={styles.newFileInput}
                value={currentFooterInputValue || ""}
                scale
                onChange={onChangeFileName}
                testId="selector_footer_input"
                hasError={withErrorFooter}
              />

              {withErrorFooter ? (
                <Text
                  className={styles.errorText}
                  fontSize="12px"
                  lineHeight="16px"
                >
                  {t("ContainsSpecCharacter") || ""}
                </Text>
              ) : null}
            </div>

            {withFooterCheckbox ? (
              <Checkbox
                label={footerCheckboxLabel}
                isChecked={isChecked}
                onChange={onChangeCheckbox}
              />
            ) : null}
          </div>
        ) : null}

        {withFooterCheckbox && !withFooterInput ? (
          <Checkbox
            label={footerCheckboxLabel}
            isChecked={isChecked}
            onChange={onChangeCheckbox}
            className="selector_footer-checkbox"
            dataTestId="selector_footer_checkbox"
          />
        ) : null}

        <div className={styles.buttonContainer}>
          <Button
            id={submitButtonId}
            className={styles.button}
            label={label}
            primary
            scale
            size={ButtonSize.normal}
            isLoading={requestRunning}
            isDisabled={
              !withFooterInput
                ? disableSubmitButton
                : disableSubmitButton || !currentFooterInputValue.trim()
            }
            onClick={onSubmit}
            testId="selector_submit_button"
          />

          {withAccessRights ? (
            <AccessSelector
              accessRights={accessRights}
              selectedAccessRight={selectedAccessRight}
              onAccessRightsChange={onAccessRightsChange}
              footerRef={ref}
              accessRightsMode={accessRightsMode}
            />
          ) : null}

          {withCancelButton ? (
            <Button
              className={styles.button}
              id={cancelButtonId}
              label={cancelButtonLabel || ""}
              scale
              size={ButtonSize.normal}
              onClick={onCancel}
              isDisabled={requestRunning}
              testId="selector_cancel_button"
            />
          ) : null}
        </div>
      </div>
    );
  },
);

Footer.displayName = "Footer";

export { Footer };
