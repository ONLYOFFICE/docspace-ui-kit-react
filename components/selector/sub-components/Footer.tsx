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
