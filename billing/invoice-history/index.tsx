import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import type { DateTime } from "luxon";

import { Consumer } from "../../utils";
import { getCookie } from "../../utils/cookie";
import { LANGUAGE } from "../../constants";
import { Text } from "../../components/text";
import { Link } from "../../components/link";
import { EmptyView } from "../../components/empty-view";
import { RectangleSkeleton } from "../../components/rectangle";
import { ComboBox, ComboBoxSize, TOption } from "../../components/combobox";
import { DatePicker } from "../../components/date-picker";
import FilterIcon from "../../components/filter/sub-components/FilterIcon";
import { DeviceType } from "../../enums";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { useTheme } from "../../context/ThemeContext";

import NoInvoicesIcon from "../../assets/no.transactions.filter.react.svg";
import NoInvoicesDarkIcon from "../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import useDeviceType from "../hooks/useDeviceType";
import useViewEffect from "../../hooks/useViewEffect";
import TableLoader from "../shared/transaction-history/sub-components/TableLoader";
import FilterPanel from "../shared/transaction-history/sub-components/FilterPanel";
import type { TInvoiceInitiatorFilter } from "../types";

import TableView from "./TableView";
import RowView from "./RowView";
import styles from "./InvoiceHistory.module.scss";

type TMobileFilterState = {
  initiator: TOption;
  startDate: DateTime;
  endDate: DateTime;
};

const InvoiceHistory = () => {
  const {
    invoices,
    isInitInvoices,
    isInvoicesLoading,
    invoiceHistoryInit,
    fetchInvoices,
    openInvoice,
    invoiceFilterInitiator,
    invoiceFilterStartDate,
    invoiceFilterEndDate,
    defaultFilterStartDate,
    defaultFilterEndDate,
    isInvoiceFilterModified,
    setInvoiceFilterInitiator,
    setInvoiceFilterStartDate,
    setInvoiceFilterEndDate,
    resetInvoiceFilter,
    mobileBreakpoint,
    desktopBreakpoint,
  } = usePaymentStore();
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const [viewAs, setViewAs] = useState("table");
  const [isFilterDialogVisible, setIsFilterDialogVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  const isMobile = currentDeviceType === DeviceType.mobile;
  const isTablet = currentDeviceType === DeviceType.tablet;

  useViewEffect({ view: viewAs, setView: setViewAs, currentDeviceType });

  useEffect(() => {
    invoiceHistoryInit();
  }, [invoiceHistoryInit]);

  useEffect(
    () => () => {
      resetInvoiceFilter();
    },
    [resetInvoiceFilter],
  );

  const initiatorOptions: TOption[] = [
    {
      key: "all",
      label: t("AllTopUps"),
      dataTestId: "all_top_ups_option",
    },
    {
      key: "Manual",
      label: t("ManualTopUps"),
      dataTestId: "manual_top_ups_option",
    },
    {
      key: "Automatic",
      label: t("AutomaticTopUps"),
      dataTestId: "automatic_top_ups_option",
    },
  ];

  const selectedInitiator =
    initiatorOptions.find((o) => o.key === invoiceFilterInitiator) ??
    initiatorOptions[0];

  const [mobileFilterState, setMobileFilterState] =
    useState<TMobileFilterState>({
      initiator: selectedInitiator,
      startDate: invoiceFilterStartDate,
      endDate: invoiceFilterEndDate,
    });

  const onOpenInvoice = (id: number) => openInvoice(id, t);

  const onOpenFilterDialog = () => {
    setMobileFilterState({
      initiator: selectedInitiator,
      startDate: invoiceFilterStartDate,
      endDate: invoiceFilterEndDate,
    });
    setIsChanged(false);
    setIsFilterDialogVisible(true);
  };

  const onCloseFilterDialog = () => {
    setIsFilterDialogVisible(false);
  };

  const onSelectInitiator = async (option: TOption) => {
    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({ ...prev, initiator: option }));
      setIsChanged(true);
      return;
    }

    setInvoiceFilterInitiator(option.key as TInvoiceInitiatorFilter);
    await fetchInvoices();
  };

  const onStartDateChange = async (date: DateTime | null) => {
    if (!date) return;

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({ ...prev, startDate: date }));
      setIsChanged(true);
      return;
    }

    setInvoiceFilterStartDate(date);
    await fetchInvoices();
  };

  const onEndDateChange = async (date: DateTime | null) => {
    if (!date) return;

    if (isFilterDialogVisible) {
      setMobileFilterState((prev) => ({ ...prev, endDate: date }));
      setIsChanged(true);
      return;
    }

    setInvoiceFilterEndDate(date);
    await fetchInvoices();
  };

  const onApplyFilter = async () => {
    setInvoiceFilterInitiator(
      mobileFilterState.initiator.key as TInvoiceInitiatorFilter,
    );
    setInvoiceFilterStartDate(mobileFilterState.startDate);
    setInvoiceFilterEndDate(mobileFilterState.endDate);

    setIsFilterDialogVisible(false);
    setIsChanged(false);

    await fetchInvoices();
  };

  const onClearFilter = async () => {
    resetInvoiceFilter();

    setMobileFilterState({
      initiator: initiatorOptions[0],
      startDate: defaultFilterStartDate,
      endDate: defaultFilterEndDate,
    });
    setIsChanged(false);
    setIsFilterDialogVisible(false);

    await fetchInvoices();
  };

  if (!isInitInvoices) {
    return (
      <div className={styles.invoiceHistory}>
        <div className={styles.introLoader}>
          <RectangleSkeleton
            uniqueKey="invoice-history-description"
            height="20px"
            borderRadius="3px"
            width="100%"
          />
        </div>
        <TableLoader isMobile={isMobile} isTablet={isTablet} />
      </div>
    );
  }

  const startDate = isFilterDialogVisible
    ? mobileFilterState.startDate
    : invoiceFilterStartDate;
  const endDate = isFilterDialogVisible
    ? mobileFilterState.endDate
    : invoiceFilterEndDate;
  const locale = getCookie(LANGUAGE) ?? "en";

  const datesComponent = (
    <div className={styles.filterDates}>
      <CommonTrans
        i18nKey="FromTo"
        components={{
          1: (
            <DatePicker
              key="invoice-start-date-picker"
              initialDate={startDate}
              onChange={onStartDateChange}
              selectDateText={t("SelectDate")}
              locale={locale}
              openDate={startDate}
              maxDate={endDate}
              outerDate={startDate}
              hideCross
              autoPosition={isTablet}
              testId="invoice_start_date_picker"
            />
          ),
          2: (
            <DatePicker
              key="invoice-end-date-picker"
              initialDate={endDate}
              onChange={onEndDateChange}
              selectDateText={t("SelectDate")}
              locale={locale}
              openDate={endDate}
              minDate={startDate}
              maxDate={defaultFilterEndDate}
              outerDate={endDate}
              hideCross
              autoPosition={isTablet}
              testId="invoice_end_date_picker"
            />
          ),
        }}
      />
    </div>
  );

  const filterRow = (
    <div className={styles.filterRow}>
      <ComboBox
        className={styles.initiatorCombobox}
        options={initiatorOptions}
        selectedOption={selectedInitiator}
        onSelect={onSelectInitiator}
        directionY="both"
        noBorder={false}
        dropDownMaxHeight={300}
        size={ComboBoxSize.content}
        scaled={false}
        dataTestId="invoice_initiator_combobox"
        dropDownTestId="invoice_initiator_dropdown"
      />
      {datesComponent}
      {isInvoiceFilterModified ? (
        <Link
          onClick={onClearFilter}
          textDecoration="underline dotted"
          className={styles.clearFilter}
          dataTestId="invoice_clear_filter_button"
        >
          {t("ClearFilter")}
        </Link>
      ) : null}
    </div>
  );

  const emptyView = (
    <EmptyView
      icon={isBase ? <NoInvoicesIcon /> : <NoInvoicesDarkIcon />}
      title={isInvoiceFilterModified ? t("NoFindingsFound2") : t("NoInvoices")}
      description={
        isInvoiceFilterModified
          ? t("NoInvoicesFilter")
          : t("NoInvoicesDescription")
      }
      options={null}
    />
  );

  const invoicesView = (
    <Consumer>
      {(context) =>
        viewAs === "table" ? (
          <TableView
            sectionWidth={context.sectionWidth || 0}
            invoices={invoices}
            onOpenInvoice={onOpenInvoice}
          />
        ) : (
          <RowView
            sectionWidth={context.sectionWidth || 0}
            invoices={invoices}
            onOpenInvoice={onOpenInvoice}
          />
        )
      }
    </Consumer>
  );

  const renderBody = () => {
    if (isInvoicesLoading) {
      return <TableLoader isMobile={isMobile} isTablet={isTablet} />;
    }

    return invoices.length ? invoicesView : emptyView;
  };

  return (
    <div className={styles.invoiceHistory}>
      <div className={styles.introText}>
        <Text>{t("InvoiceHistoryDescription")}</Text>
      </div>
      {isMobile ? (
        <div className={styles.filterIconRow}>
          <FilterIcon
            id="invoice-filter-button"
            onClick={onOpenFilterDialog}
            isOpen={isFilterDialogVisible}
            isShowIndicator={isInvoiceFilterModified}
            dataTestId="invoice_filter_icon"
          />
        </div>
      ) : (
        filterRow
      )}
      {renderBody()}

      {isFilterDialogVisible ? (
        <FilterPanel
          isFilterDialogVisible={isFilterDialogVisible}
          closeFilterDialog={onCloseFilterDialog}
          isSelectorVisible={false}
          selectorComponent={null}
          datesComponent={datesComponent}
          contactSelector={null}
          typeOfHistoty={initiatorOptions}
          selectedType={mobileFilterState.initiator}
          onSelectType={onSelectInitiator}
          onApplyFilter={onApplyFilter}
          isChanged={isChanged}
          clearFilter={onClearFilter}
          shouldShowClearButton={isInvoiceFilterModified}
          periodLabel={t("TopUpPeriod")}
          typeComboboxTestId="invoice_initiator_combobox"
          typeDropdownTestId="invoice_initiator_dropdown"
        />
      ) : null}
    </div>
  );
};

export default observer(InvoiceHistory);
