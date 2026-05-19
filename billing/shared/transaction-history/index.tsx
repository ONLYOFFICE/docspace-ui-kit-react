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

import React, { useState, useEffect } from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import classNames from "classnames";
import type { DateTime } from "luxon";
import { getCookie } from "../../../utils/cookie";
import { LANGUAGE } from "../../../constants";

import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { ComboBox, ComboBoxSize, TOption } from "../../../components/combobox";
import { DatePicker } from "../../../components/date-picker";
import { toastr } from "../../../components/toast";
import { useApi } from "../../../providers";
import { EmployeeStatus } from "@onlyoffice/docspace-api-sdk";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import FilterIcon from "../../../components/filter/sub-components/FilterIcon";
import { AddButton } from "../../../components/add-button";
import { SelectedItemPure } from "../../../components/selected-item";
import { TSelectorItem } from "../../../components/selector";
import { PeopleSelector } from "../../../selectors/People";
import type { PeopleFilter } from "../../../selectors/People/PeopleSelector.types";
import { EmployeeType } from "../../../enums";
import FilterPanel from "./sub-components/FilterPanel";
import TransactionBody from "./sub-components/TransactionBody";
import styles from "./styles/TransactionHistory.module.scss";
import TableLoader from "./sub-components/TableLoader";
import { Link } from "../../../components/link";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { getBrandName } from "../../../constants/brands";
import { Encoder } from "../../../utils/encoder";

type TransactionHistoryReportResponse = {
  error?: string;
  isCompleted: boolean;
  resultFileUrl?: string;
};

type TContact = { id: string; displayName?: string };

type TransactionHistoryProps = {
  isMobile?: boolean;
  isTablet?: boolean;
  withoutHeader?: boolean;
  serviceName?: string;
  headerTitle?: string;
  hideTypeFilter?: boolean;
  withoutRoleFilter?: boolean;
  maxWidth?: number | string;
};

const filter = (withoutRoleFilter?: boolean): PeopleFilter => ({
  employeeStatus: EmployeeStatus.Active,
  ...(withoutRoleFilter ? {} : { role: [EmployeeType.Admin] }),
});

const TransactionHistory = (props: TransactionHistoryProps) => {
  const {
    isMobile,
    isTablet,
    withoutHeader,
    serviceName,
    headerTitle,
    hideTypeFilter,
    withoutRoleFilter,
    maxWidth,
  } = props;

  const { paymentApi } = useApi();
  const store = usePaymentStore();

  const {
    isTransactionHistoryExist,
    formatDate,
    fetchTransactionHistory,
    isTransactionLoading,
    filterSelectedTypeKey,
    filterStartDate,
    filterEndDate,
    filterContact,
    defaultFilterStartDate,
    defaultFilterEndDate,
    isTransactionFilterModified,
    setFilterSelectedTypeKey,
    setFilterStartDate,
    setFilterEndDate,
    setFilterContact,
    resetTransactionFilter,
    openOnNewPage,
  } = store;

  const { isNotPaidPeriod } = store.tariff;

  const t = useCommonTranslation();

  const typeOfHistoty: TOption[] = [
    {
      key: "allTransactions",
      label: t("AllTransactions"),
      dataTestId: "all_transactions_option",
    },
    {
      key: "credit",
      label: t("Credit"),
      dataTestId: "credit_transactions_option",
    },
    {
      key: "debit",
      label: t("Debit"),
      dataTestId: "debit_transactions_option",
    },
  ];

  const selectedType =
    typeOfHistoty.find((o) => o.key === filterSelectedTypeKey) ??
    typeOfHistoty[0];

  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [isFormationHistory, setIsFormationHistory] = useState(false);
  const [isFilterDialogVisible, setIsFilterDialogVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const [reservedSpacer, setReservedSpacer] = useState<number | undefined>();
  const isReserveActive = reservedSpacer !== undefined;

  const getScrollEl = (): HTMLElement | null =>
    (document.querySelector(
      "#sectionScroll .scroll-wrapper > .scroller",
    ) as HTMLElement | null) ??
    (document.querySelector(
      "#customScrollBar .scroll-wrapper > .scroller",
    ) as HTMLElement | null);

  const runFetch = () => {
    const scrollEl = getScrollEl();
    if (scrollEl) {
      setReservedSpacer(scrollEl.scrollTop + scrollEl.clientHeight);
    }
    return fetchTransactionHistory(serviceName);
  };

  useEffect(() => {
    if (isTransactionLoading || !isReserveActive) return;

    const scrollEl = getScrollEl();
    if (!scrollEl) return;

    const onScroll = () => {
      setReservedSpacer((prev) => {
        if (prev === undefined) return prev;
        const required = scrollEl.scrollTop + scrollEl.clientHeight;
        const contentOnly = scrollEl.scrollHeight - prev;
        const next = Math.max(0, required - contentOnly);
        if (next >= prev) return prev;
        return next > 0 ? next : undefined;
      });
    };
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [isTransactionLoading, isReserveActive]);

  // Mobile filter local state — applied to store only via onApplyFilter
  const [mobileFilterState, setMobileFilterState] = useState({
    selectedType: selectedType,
    startDate: filterStartDate,
    endDate: filterEndDate,
    selectedContact: filterContact as TContact | null,
  });

  const openFilterDialog = () => {
    setMobileFilterState({
      selectedType,
      startDate: filterStartDate,
      endDate: filterEndDate,
      selectedContact: filterContact,
    });
    setIsFilterDialogVisible(true);
  };

  const closeFilterDialog = () => {
    setIsFilterDialogVisible(false);
  };

  const onClearFilter = async () => {
    resetTransactionFilter();

    setMobileFilterState({
      selectedType: typeOfHistoty[0],
      startDate: defaultFilterStartDate,
      endDate: defaultFilterEndDate,
      selectedContact: null,
    });
    setIsChanged(false);

    if (isMobile) closeFilterDialog();

    await runFetch();
  };

  const onCloseContactSelector = () => {
    setIsSelectorVisible(false);
  };

  const onSelectorAddButtonClick = () => {
    setIsSelectorVisible(true);
  };

  const onSelectType = async (option: TOption) => {
    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        selectedType: option,
      }));
      setIsChanged(true);
      return;
    }

    setFilterSelectedTypeKey(option.key as string);
    await runFetch();
  };

  const onStartDateChange = async (date: DateTime | null): Promise<void> => {
    if (!date) return;

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        startDate: date,
      }));
      setIsChanged(true);
      return;
    }

    setFilterStartDate(date);
    await runFetch();
  };

  const onEndDateChange = async (date: DateTime | null): Promise<void> => {
    if (!date) return;

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        endDate: date,
      }));
      setIsChanged(true);
      return;
    }

    setFilterEndDate(date);
    await runFetch();
  };

  const onSubmitContactSelector = async (contacts: TSelectorItem[]) => {
    const contact = contacts[0] as unknown as TContact;
    setIsSelectorVisible(false);

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        selectedContact: contact,
      }));
      setIsChanged(true);
      return;
    }

    setFilterContact(contact);
    await runFetch();
  };

  const onCloseSelectedContact = async () => {
    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        selectedContact: null,
      }));
      setIsChanged(true);
      return;
    }

    setFilterContact(null);
    await runFetch();
  };

  const onApplyFilter = async () => {
    setFilterSelectedTypeKey(mobileFilterState.selectedType.key as string);
    setFilterStartDate(mobileFilterState.startDate);
    setFilterEndDate(mobileFilterState.endDate);
    setFilterContact(mobileFilterState.selectedContact);

    setIsFilterDialogVisible(false);
    setIsChanged(false);

    await runFetch();
  };

  const getReport = async () => {
    const reportTimerId = setTimeout(() => setIsFormationHistory(true), 200);

    const isCredit = filterSelectedTypeKey !== "debit";
    const isDebit = filterSelectedTypeKey !== "credit";

    try {
      await paymentApi.createCustomerOperationsReport({
        customerOperationsReportRequestDto: {
          startDate: formatDate!(filterStartDate),
          endDate: formatDate!(filterEndDate),
          credit: isCredit,
          debit: isDebit,
          participantName: filterContact?.id,
          serviceName,
        },
      });

      const result = await new Promise<TransactionHistoryReportResponse>(
        (resolve, reject) => {
          const checkStatus = async () => {
            try {
              const checkRes = await paymentApi.getCustomerOperationsReport();
              const response = checkRes?.data
                ?.response as unknown as TransactionHistoryReportResponse;

              if (!response) {
                reject(new Error(t("UnexpectedError")));
                return;
              }

              if (response.error) {
                reject(new Error(response.error));
                return;
              }

              if (response.isCompleted) {
                resolve(response);
                return;
              }

              setTimeout(checkStatus, 1000);
            } catch (err) {
              reject(err);
            }
          };

          checkStatus();
        },
      );

      if (!result || !result.resultFileUrl) {
        throw new Error(t("UnexpectedError"));
      }

      setTimeout(
        () =>
          window.open(result.resultFileUrl, openOnNewPage ? "_blank" : "_self"),
        100,
      );
    } catch (e) {
      toastr.error(e as Error);
    }

    setIsFormationHistory(false);
    clearTimeout(reportTimerId);
  };

  const startDate = isFilterDialogVisible
    ? mobileFilterState.startDate
    : filterStartDate;
  const endDate = isFilterDialogVisible
    ? mobileFilterState.endDate
    : filterEndDate;

  const datesComponent = (
    <div className={styles.transactionDates}>
      <CommonTrans
        i18nKey="FromTo"
        components={{
          1: (
            <DatePicker
              key="start-date-picker"
              initialDate={startDate}
              onChange={onStartDateChange}
              selectDateText={t("SelectDate")}
              locale={getCookie(LANGUAGE) ?? "en"}
              openDate={startDate}
              minDate={undefined}
              maxDate={endDate}
              outerDate={startDate}
              hideCross
              autoPosition={isTablet}
              testId="transaction_start_date_picker"
            />
          ),
          2: (
            <DatePicker
              key="end-date-picker"
              initialDate={endDate}
              onChange={onEndDateChange}
              selectDateText={t("SelectDate")}
              locale={getCookie(LANGUAGE) ?? "en"}
              openDate={endDate}
              minDate={startDate}
              maxDate={defaultFilterEndDate}
              outerDate={endDate}
              hideCross
              autoPosition={isTablet}
              testId="transaction_end_date_picker"
            />
          ),
        }}
      />
    </div>
  );

  const currentContact = isFilterDialogVisible
    ? mobileFilterState.selectedContact
    : filterContact;

  const contactSelector = !currentContact ? (
    <AddButton label={t("SelectContact")} onClick={onSelectorAddButtonClick} />
  ) : (
    <SelectedItemPure
      key={`${currentContact}`}
      propKey={currentContact.id}
      label={Encoder.htmlDecode(currentContact.displayName ?? "")}
      onClose={onCloseSelectedContact}
      className={styles.selectedContactItem}
    />
  );

  const filterCombobox = (
    <div className={styles.transactionHistoryCombobox}>
      {!hideTypeFilter ? (
        <ComboBox
          className={styles.transactionTypeCombobox}
          tabIndex={1}
          options={typeOfHistoty}
          selectedOption={selectedType}
          onSelect={onSelectType}
          directionY="both"
          noBorder={false}
          dropDownMaxHeight={300}
          showDisabledItems
          size={ComboBoxSize.content}
          scaled={false}
          dataTestId="transaction_type_combobox"
          dropDownTestId="transaction_type_dropdown"
        />
      ) : null}
      {datesComponent}
      {contactSelector}
      {isTransactionFilterModified ? (
        <Link
          onClick={onClearFilter}
          textDecoration="underline dotted"
          dataTestId="clear_filter_button"
          className={styles.clearFilter}
        >
          {t("ClearFilter")}
        </Link>
      ) : null}
    </div>
  );

  const mobileFilter = (
    <div className={styles.filterIconWrapper}>
      <FilterIcon
        id="filter-button"
        onClick={openFilterDialog}
        isOpen={isFilterDialogVisible}
        isShowIndicator={isTransactionFilterModified}
        dataTestId="transaction_filter_icon"
      />
    </div>
  );

  const infoProps = withoutRoleFilter
    ? {}
    : {
        withInfo: true as const,
        infoText: t("OnlyPortalAdminsShown", {
          productName: getBrandName("ProductName"),
        }),
      };

  const selectorComponent = isSelectorVisible ? (
    <PeopleSelector
      withCancelButton
      onCancel={onCloseContactSelector}
      cancelButtonLabel=""
      disableSubmitButton={false}
      submitButtonLabel={t("SelectAction")}
      onSubmit={onSubmitContactSelector}
      withHeader
      headerProps={{
        onCloseClick: onCloseContactSelector,
        isCloseable: true,
        headerLabel: t("ListContacts"),
      }}
      filter={() => filter(withoutRoleFilter)}
      {...infoProps}
      emptyScreenHeader={t("NotFoundMembers")}
      emptyScreenDescription={t("PeopleSelectorInfo", {
        productName: getBrandName("ProductName"),
      })}
    />
  ) : null;

  console.log("isTransactionLoading", isTransactionLoading);
  return (
    <>
      <div className={styles.transactionHistoryHeader}>
        {withoutHeader ? null : (
          <Text
            isBold
            fontSize="16px"
            className={styles.transactionHistoryTitle}
          >
            {headerTitle ?? t("TransactionHistory")}
          </Text>
        )}
        {isMobile ? mobileFilter : null}
      </div>
      {!isMobile ? filterCombobox : null}

      {isTransactionLoading ? (
        <TableLoader isMobile={isMobile} isTablet={isTablet} />
      ) : (
        <TransactionBody
          hasAppliedDateFilter={isTransactionFilterModified}
          isTransactionHistoryExist={isTransactionHistoryExist!}
          serviceName={serviceName}
          maxWidth={maxWidth}
        />
      )}

      {isTransactionHistoryExist && !isTransactionLoading ? (
        <>
          <Text className={styles.transactionsLimit}>
            {t("TransactionsLimit", {
              buttonName: t("DownloadReportBtnText"),
            })}
          </Text>

          <div
            className={classNames(styles.downloadWrapper, {
              [styles.isMobileButton]: isMobile,
            })}
          >
            <Button
              label={t("DownloadReportBtnText")}
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              minWidth="auto"
              onClick={getReport}
              isLoading={isFormationHistory}
              isDisabled={isNotPaidPeriod}
              scale={isMobile}
              testId="download_report_button"
            />
            <Text as="span" className={styles.downloadReportDescription}>
              {t("ReportSaveLocation", {
                sectionName: t("MyDocuments"),
              })}
            </Text>
          </div>
        </>
      ) : null}

      {reservedSpacer ? (
        <div style={{ height: reservedSpacer }} aria-hidden="true" />
      ) : null}

      {isFilterDialogVisible ? (
        <FilterPanel
          isFilterDialogVisible={isFilterDialogVisible}
          closeFilterDialog={closeFilterDialog}
          isSelectorVisible={isSelectorVisible}
          selectorComponent={selectorComponent}
          datesComponent={datesComponent}
          contactSelector={contactSelector}
          typeOfHistoty={typeOfHistoty}
          selectedType={
            isFilterDialogVisible
              ? mobileFilterState.selectedType
              : selectedType
          }
          onSelectType={onSelectType}
          hideTypeFilter={hideTypeFilter}
          onApplyFilter={onApplyFilter}
          isChanged={isChanged}
          clearFilter={onClearFilter}
          shouldShowClearButton={isTransactionFilterModified}
        />
      ) : null}

      {isSelectorVisible ? (
        <ModalDialog
          visible={isSelectorVisible}
          onClose={onCloseContactSelector}
          displayType={ModalDialogType.aside}
          withoutPadding
        >
          <ModalDialog.Body>{selectorComponent}</ModalDialog.Body>
        </ModalDialog>
      ) : null}
    </>
  );
};

export default observer(TransactionHistory);
