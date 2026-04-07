// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { useState, useMemo } from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import classNames from "classnames";
import type { DateTime } from "luxon";
import { parseToDateTime, isSameDay, now } from "../../../utils/date";
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
import PeopleSelector from "../../../selectors/People";
import type { PeopleFilter } from "../../../selectors/People/PeopleSelector.types";

import FilterPanel from "./sub-components/FilterPanel";
import TransactionBody from "./sub-components/TransactionBody";
import styles from "./styles/TransactionHistory.module.scss";
import TableLoader from "./sub-components/TableLoader";
import { Link } from "../../../components/link";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { AI_TOOLS } from "../../constants";

type TransactionHistoryReportResponse = {
  error?: string;
  isCompleted: boolean;
  resultFileUrl?: string;
};

type TContact = Pick<TSelectorItem, "displayName" | "label"> & { id: string };

type TransactionHistoryProps = {
  openOnNewPage?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  withoutHeader?: boolean;
  serviceName?: string;
  headerTitle?: string;
  hideTypeFilter?: boolean;
};

const getTransactionType = (key: string) => {
  return {
    isCredit: key !== "debit",
    isDebit: key !== "credit",
  };
};

const filter = (): PeopleFilter => ({
  employeeStatus: EmployeeStatus.Active,
  // newFilter.role = [EmployeeType.Admin];
});

let timerId = null;

const useInitialState = (
  getStartTransactionDate: () => string,
  getEndTransactionDate: () => string,
  initialType: TOption,
) => {
  const initialState = useMemo(() => {
    return {
      selectedType: initialType,
      startDate: parseToDateTime(getStartTransactionDate()) ?? now(),
      endDate: parseToDateTime(getEndTransactionDate()) ?? now(),
      selectedContact: null as TContact | null,
      isChanged: false,
    };
  }, []);

  const isStateModified = (currentState: {
    selectedType: TOption;
    startDate: DateTime;
    endDate: DateTime;
    selectedContact: TContact | null;
  }) => {
    return (
      currentState.selectedType.key !== initialState.selectedType.key ||
      !isSameDay(currentState.startDate, initialState.startDate) ||
      !isSameDay(currentState.endDate, initialState.endDate) ||
      currentState.selectedContact !== initialState.selectedContact
    );
  };

  return { initialState, isStateModified };
};

const fetchTransactions = async (
  fetchTransactionHistory: (
    startDate: DateTime,
    endDate: DateTime,
    isCredit: boolean,
    isDebit: boolean,
    participantName?: string,
    serviceName?: string,
  ) => Promise<void>,
  setIsLoading: (loading: boolean) => void,
  selectedType: string,
  startDate: DateTime,
  endDate: DateTime,
  participantName?: string,
  serviceName?: string,
) => {
  timerId = setTimeout(() => setIsLoading(true), 500);

  const { isCredit, isDebit } = getTransactionType(selectedType as string);

  try {
    await fetchTransactionHistory(
      startDate,
      endDate,
      isCredit,
      isDebit,
      participantName,
      serviceName,
    );

    setIsLoading(false);
    if (timerId) clearTimeout(timerId);
    timerId = null;
  } catch (e) {
    toastr.error(e as Error);
  }
};

const TransactionHistory = (props: TransactionHistoryProps) => {
  const {
    openOnNewPage,
    isMobile,
    isTablet,
    withoutHeader,
    serviceName,
    headerTitle,
    hideTypeFilter,
  } = props;

  const { paymentApi } = useApi();
  const store = usePaymentStore();

  const {
    getStartTransactionDate,
    getEndTransactionDate,
    isTransactionHistoryExist,
    formatDate,
    fetchTransactionHistory,
  } = store;

  const { isNotPaidPeriod } = store.tariff;

  const t = useCommonTranslation(["Payments", "Settings"]);

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

  const { initialState, isStateModified } = useInitialState(
    getStartTransactionDate!,
    getEndTransactionDate!,
    typeOfHistoty[0],
  );

  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<TOption>(
    initialState.selectedType,
  );
  const [startDate, setStartDate] = useState<DateTime>(initialState.startDate);
  const [endDate, setEndDate] = useState<DateTime>(initialState.endDate);
  const [selectedContact, setSelectedContact] = useState<TContact | null>(
    initialState.selectedContact,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFormationHistory, setIsFormationHistory] = useState(false);
  const [isFilterDialogVisible, setIsFilterDialogVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(initialState.isChanged);

  // Mobile filter state for dialog
  const [mobileFilterState, setMobileFilterState] = useState({
    selectedType: selectedType,
    startDate: startDate,
    endDate: endDate,
    selectedContact: selectedContact,
  });

  const openFilterDialog = () => {
    // Initialize mobile filter state with current state when opening dialog
    setMobileFilterState({
      selectedType: selectedType,
      startDate: startDate,
      endDate: endDate,
      selectedContact: selectedContact,
    });
    setIsFilterDialogVisible(true);
  };

  const closeFilterDialog = () => {
    // Reset mobile filter state to current state values when canceling dialog
    setMobileFilterState({
      selectedType: selectedType,
      startDate: startDate,
      endDate: endDate,
      selectedContact: selectedContact,
    });
    setIsFilterDialogVisible(false);
  };

  const onClearFilter = async () => {
    // Reset both state and mobile filter state to initial values
    setSelectedType(initialState.selectedType);
    setStartDate(initialState.startDate);
    setEndDate(initialState.endDate);
    setSelectedContact(initialState.selectedContact);
    setIsChanged(initialState.isChanged);

    // Also reset the mobile filter state
    setMobileFilterState({
      selectedType: initialState.selectedType,
      startDate: initialState.startDate,
      endDate: initialState.endDate,
      selectedContact: initialState.selectedContact,
    });

    if (isMobile) closeFilterDialog();

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        initialState.selectedType.key as string,
        initialState.startDate,
        initialState.endDate,
        initialState.selectedContact?.id,
        serviceName,
      );
    }
  };

  const shouldShowClearButton = isStateModified({
    selectedType,
    startDate,
    endDate,
    selectedContact,
  });

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

    setSelectedType(option);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        option.key as string,
        startDate,
        endDate,
        selectedContact?.id,
        serviceName,
      );
    }
  };

  const onStartDateChange = async (date: DateTime | null): Promise<void> => {
    if (!date) {
      return;
    }

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        startDate: date,
      }));
      setIsChanged(true);
      return;
    }

    setStartDate(date);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        selectedType.key as string,
        date,
        endDate,
        selectedContact?.id,
        serviceName,
      );
    }
  };

  const onEndDateChange = async (date: DateTime | null): Promise<void> => {
    if (!date) {
      return;
    }

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({
        ...prev,
        endDate: date,
      }));
      setIsChanged(true);
      return;
    }

    setEndDate(date);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        selectedType.key as string,
        startDate,
        date,
        selectedContact?.id,
        serviceName,
      );
    }
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

    setSelectedContact(contact);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        selectedType.key as string,
        startDate,
        endDate,
        contact.id,
        serviceName,
      );
    }
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

    setSelectedContact(null);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        selectedType.key as string,
        startDate,
        endDate,
        serviceName,
      );
    }
  };

  const onApplyFilter = async () => {
    // Apply all mobile filter state values to actual state
    setSelectedType(mobileFilterState.selectedType);
    setStartDate(mobileFilterState.startDate);
    setEndDate(mobileFilterState.endDate);
    setSelectedContact(mobileFilterState.selectedContact);

    setIsFilterDialogVisible(false);
    setIsChanged(false);

    if (fetchTransactionHistory) {
      await fetchTransactions(
        fetchTransactionHistory,
        setIsLoading,
        mobileFilterState.selectedType.key as string,
        mobileFilterState.startDate,
        mobileFilterState.endDate,
        mobileFilterState.selectedContact?.id,
        serviceName,
      );
    }
  };

  const getReport = async () => {
    const reportTimerId = setTimeout(() => setIsFormationHistory(true), 200);

    const isCredit = selectedType.key !== "debit";
    const isDebit = selectedType.key !== "credit";

    try {
      await paymentApi.createCustomerOperationsReport({
        startDate: formatDate!(startDate),
        endDate: formatDate!(endDate),
        credit: isCredit,
        debit: isDebit,
        participantName: selectedContact?.id,
        serviceName,
        ...(serviceName === AI_TOOLS
          ? { writeOffServiceQuota: true }
          : {}),
      });

      const result = await new Promise<TransactionHistoryReportResponse>(
        (resolve, reject) => {
          const checkStatus = async () => {
            try {
              const checkRes = await paymentApi.getCustomerOperationsReport();
              const response = checkRes?.data
                ?.response as unknown as TransactionHistoryReportResponse;

              if (!response) {
                reject(new Error(t("Common:UnexpectedError")));
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
        throw new Error(t("Common:UnexpectedError"));
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

  const datesComponent = (
    <div className={styles.transactionDates}>
      <CommonTrans
        namespaces={["Payments"]}
        i18nKey="FromTo"
        components={{
          1: (
            <DatePicker
              key="start-date-picker"
              initialDate={
                isFilterDialogVisible ? mobileFilterState.startDate : startDate
              }
              onChange={onStartDateChange}
              selectDateText={t("Common:SelectDate")}
              locale={getCookie(LANGUAGE) ?? "en"}
              openDate={
                isFilterDialogVisible ? mobileFilterState.startDate : startDate
              }
              minDate={undefined}
              maxDate={
                isFilterDialogVisible ? mobileFilterState.endDate : endDate
              }
              outerDate={
                isFilterDialogVisible ? mobileFilterState.startDate : startDate
              }
              hideCross
              autoPosition={isTablet}
              testId="transaction_start_date_picker"
            />
          ),
          2: (
            <DatePicker
              key="end-date-picker"
              initialDate={
                isFilterDialogVisible ? mobileFilterState.endDate : endDate
              }
              onChange={onEndDateChange}
              selectDateText={t("Common:SelectDate")}
              locale={getCookie(LANGUAGE) ?? "en"}
              openDate={
                isFilterDialogVisible ? mobileFilterState.endDate : endDate
              }
              minDate={
                isFilterDialogVisible ? mobileFilterState.startDate : startDate
              }
              maxDate={initialState.endDate}
              outerDate={
                isFilterDialogVisible ? mobileFilterState.endDate : endDate
              }
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
    : selectedContact;

  const contactSelector = !currentContact ? (
    <AddButton label={t("SelectContact")} onClick={onSelectorAddButtonClick} />
  ) : (
    <SelectedItemPure
      key={`${currentContact}`}
      propKey={currentContact.id}
      label={currentContact.displayName}
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
      {shouldShowClearButton ? (
        <Link
          onClick={onClearFilter}
          textDecoration="underline dotted"
          dataTestId="clear_filter_button"
          className={styles.clearFilter}
        >
          {t("Common:ClearFilter")}
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
        isShowIndicator={shouldShowClearButton}
        dataTestId="transaction_filter_icon"
      />
    </div>
  );

  const selectorComponent = isSelectorVisible ? (
    <PeopleSelector
      withCancelButton
      onCancel={onCloseContactSelector}
      cancelButtonLabel=""
      disableSubmitButton={false}
      submitButtonLabel={t("Common:SelectAction")}
      onSubmit={onSubmitContactSelector}
      withHeader
      headerProps={{
        onCloseClick: onCloseContactSelector,
        isCloseable: true,
        headerLabel: t("ListContacts"),
      }}
      filter={filter}
      withInfo
      infoText={t("OnlyPortalAdminsShown", {
        productName: t("Common:ProductName"),
      })}
      emptyScreenHeader={t("Common:NotFoundMembers")}
      emptyScreenDescription={t("CreateEditRoomDialog:PeopleSelectorInfo", {
        productName: t("Common:ProductName"),
      })}
    />
  ) : null;

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

      {isLoading ? (
        <TableLoader isMobile={isMobile} isTablet={isTablet} />
      ) : (
        <TransactionBody
          hasAppliedDateFilter={shouldShowClearButton}
          isTransactionHistoryExist={isTransactionHistoryExist!}
        />
      )}

      {isTransactionHistoryExist && !isLoading ? (
        <>
          <Text className={styles.transactionsLimit}>
            {t("TransactionsLimit", {
              buttonName: t("Settings:DownloadReportBtnText"),
            })}
          </Text>

          <div
            className={classNames(styles.downloadWrapper, {
              [styles.isMobileButton]: isMobile,
            })}
          >
            <Button
              label={t("Settings:DownloadReportBtnText")}
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              minWidth="auto"
              onClick={getReport}
              isLoading={isFormationHistory}
              isDisabled={isNotPaidPeriod}
              scale={isMobile}
              testId="download_report_button"
            />
            <Text as="span" className={styles.downloadReportDescription}>
              {t("Settings:ReportSaveLocation", {
                sectionName: t("Common:MyDocuments"),
              })}
            </Text>
          </div>
        </>
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
          shouldShowClearButton={shouldShowClearButton}
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

