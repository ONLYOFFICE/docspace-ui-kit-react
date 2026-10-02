import React from "react";
import classNames from "classnames";

import { ButtonSize, Button } from "../button";
import { ComboBox, TOption } from "../combobox";

import { PagingProps } from "./Paging.types";
import styles from "./Paging.module.scss";

const Paging = (props: PagingProps) => {
  const {
    previousLabel,
    nextLabel,
    previousAction,
    nextAction,
    pageItems,
    countItems,
    openDirection,
    disablePrevious = false,
    disableNext = false,
    selectedPageItem,
    selectedCountItem,
    id,
    className,
    style,
    showCountItem = true,
    onSelectPage,
    onSelectCount,
    dataTestId,
  } = props;

  const onSelectPageAction = (option: TOption) => {
    onSelectPage?.(option);
  };

  const onSelectCountAction = (option: TOption) => {
    onSelectCount?.(option);
  };

  const setDropDownMaxHeight =
    pageItems && pageItems.length > 6 ? { dropDownMaxHeight: 200 } : {};

  return (
    <div
      data-testid={dataTestId ?? "paging"}
      id={id}
      className={classNames(styles.paging, className)}
      style={style}
    >
      <div className={styles.leftButtonsContainer}>
        <Button
          className={classNames(styles.prevButton, "not-selectable")}
          size={ButtonSize.small}
          scale
          label={previousLabel}
          onClick={previousAction}
          isDisabled={disablePrevious}
          testId="paging_previous_button"
        />
        {pageItems ? (
          <div className={styles.page}>
            <ComboBox
              isDisabled={disablePrevious ? disableNext : false}
              className={styles.manualWidth}
              directionY={openDirection}
              options={pageItems}
              onSelect={onSelectPageAction}
              scaledOptions={pageItems.length < 6}
              selectedOption={selectedPageItem}
              dataTestId="paging_page_items_combobox"
              {...setDropDownMaxHeight}
            />
          </div>
        ) : null}
        <Button
          className={classNames(styles.nextButton, "not-selectable")}
          size={ButtonSize.small}
          scale
          label={nextLabel}
          onClick={nextAction}
          isDisabled={disableNext}
          testId="paging_next_button"
        />
      </div>
      {showCountItem
        ? countItems && (
            <div className={styles.onPage}>
              <ComboBox
                className={styles.hideDisabled}
                directionY={openDirection}
                directionX="right"
                options={countItems}
                scaledOptions
                onSelect={onSelectCountAction}
                selectedOption={selectedCountItem}
                dataTestId="paging_count_items_combobox"
              />
            </div>
          )
        : null}
    </div>
  );
};

export { Paging };
