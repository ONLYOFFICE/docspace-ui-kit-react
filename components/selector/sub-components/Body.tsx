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

import React, { useLayoutEffect, useRef, useState } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import classNames from "classnames";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import type { Nullable } from "../../../types";
import styles from "../Selector.module.scss";
import { Scrollbar } from "../../scrollbar";
import { Text } from "../../text";

import { SearchContext, SearchValueContext } from "../contexts/Search";
import { BreadCrumbsContext } from "../contexts/BreadCrumbs";
import { TabsContext } from "../contexts/Tabs";
import { SelectAllContext } from "../contexts/SelectAll";
import { InfoBarContext } from "../contexts/InfoBar";
import {
  EmptyScreenContext,
  EmptyScreenProvider,
} from "../contexts/EmptyScreen";

import type {
  BodyProps,
  TSelectorEmptyScreen,
  TSelectorItem,
} from "../Selector.types";

import { InfoBar } from "./InfoBar";
import { Search } from "./Search";
import { SelectAll } from "./SelectAll";
import { EmptyScreen } from "./EmptyScreen";
import { BreadCrumbs } from "./BreadCrumbs";
import { Item } from "./Item";
import { Info } from "./Info";
import { VirtualScroll } from "./VirtualScroll";
import { Tabs } from "../../tabs";
import InputItem from "./InputItem";

const DimmedEmptyScreen = ({
  emptyScreenCtx,
  wasSearchActive,
  displayItems,
  inputItemVisible,
  hideBackButton,
}: {
  emptyScreenCtx: TSelectorEmptyScreen;
  wasSearchActive: boolean;
  displayItems: TSelectorItem[];
  inputItemVisible: boolean;
  hideBackButton?: boolean;
}) => (
  <div className={styles.dimmedEmptyScreen}>
    <EmptyScreenProvider {...emptyScreenCtx}>
      <EmptyScreen
        withSearch={wasSearchActive}
        items={displayItems}
        inputItemVisible={inputItemVisible}
        hideBackButton={hideBackButton}
      />
    </EmptyScreenProvider>
  </div>
);

const CONTAINER_PADDING = 16;
const HEADER_HEIGHT = 54;
const TABS_HEIGHT = 33;
const BREAD_CRUMBS_HEIGHT = 38;
const SEARCH_HEIGHT = 44;
const INFO_BLOCK_MARGIN = 12;
const BODY_DESCRIPTION_TEXT_HEIGHT = 32;
const SELECT_ALL_HEIGHT = 61;
const FOOTER_HEIGHT = 73;
const FOOTER_WITH_NEW_NAME_HEIGHT = 145;
const FOOTER_WITH_CHECKBOX_HEIGHT = 110;
const FOOTER_WITH_NEW_NAME_AND_CHECKBOX_HEIGHT = 181;
const ERROR_FOOTER_HEIGHT = 20;

const Body = ({
  footerVisible,

  items,
  onSelect,
  isMultiSelect,

  loadMoreItems,
  hasNextPage,
  totalItems,
  renderCustomItem,
  isLoading,
  isContentLoading,

  rowLoader,

  withFooterInput,
  withFooterCheckbox,
  descriptionText,
  withHeader,
  withPadding,

  withInfo,
  infoText,
  withInfoBadge,
  setInputItemVisible,
  inputItemVisible,
  injectedElement,

  isSSR,

  hideBackButton,
  withErrorFooter,
  isLimitReached,

  displayFileExtension,
  forceIsMultiSelect,
}: BodyProps) => {
  const infoBarRef = useRef<HTMLDivElement>(null);
  const injectedElementRef = useRef<HTMLElement>(null);
  const [infoBarHeight, setInfoBarHeight] = useState(0);
  const [injectedElementHeight, setInjectedElementHeight] = useState(0);

  const { withSearch } = React.use(SearchContext);
  const isSearch = React.use(SearchValueContext);
  const { withInfoBar } = React.use(InfoBarContext);
  const emptyScreenCtx = React.use(EmptyScreenContext);

  const { withBreadCrumbs, isBreadCrumbsLoading } =
    React.useContext(BreadCrumbsContext);

  const { withTabs, tabsData, activeTabId } = React.use(TabsContext);

  const { withSelectAll } = React.use(SelectAllContext);

  const [bodyHeight, setBodyHeight] = React.useState(0);
  const [savedInputValue, setSavedInputValue] =
    React.useState<Nullable<string>>(null);

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const listOptionsRef = React.useRef<null | InfiniteLoader>(null);
  const listRef = React.useRef<List | null>(null);
  const resizeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // A content refresh dims the body and wins over the skeleton
  const loadingMode: "skeleton" | "dimmed" | "none" = isContentLoading
    ? "dimmed"
    : isLoading
      ? "skeleton"
      : "none";
  const isDimmed = loadingMode === "dimmed";

  // Store previous items for dimming display during content loading
  const previousItemsRef = React.useRef(items);
  const previousTotalRef = React.useRef(totalItems);

  // Save EmptyScreen context when empty screen is actually displayed
  const savedEmptyScreenCtxRef = React.useRef(emptyScreenCtx);

  // Track whether search was active before content loading started
  const wasSearchActiveRef = React.useRef(false);

  // Track whether the last settled render displayed the EmptyScreen, so a
  // refresh started from it dims that empty screen, not a stale list
  const wasEmptyScreenRef = React.useRef(false);

  const wasEmptyScreen = wasEmptyScreenRef.current;

  // Use previous items when content is loading and current items are empty,
  // but only if the EmptyScreen was not displayed before the refresh
  const displayItems =
    isDimmed && items.length === 0 && !wasEmptyScreen
      ? previousItemsRef.current
      : items;

  const displayTotal =
    isDimmed && items.length === 0 && !wasEmptyScreen
      ? previousTotalRef.current
      : totalItems;

  const isEmptyInput =
    displayItems.length === 2 &&
    displayItems[1].isInputItem &&
    displayItems[0].isCreateNewItem;

  const displayHasNextPage = isDimmed ? false : hasNextPage;

  const itemsCount = displayHasNextPage
    ? displayItems.length + 1
    : displayItems.length === 1 && displayItems[0].isCreateNewItem
      ? 0
      : isEmptyInput
        ? 1
        : displayItems.length;

  const showsEmptyScreen = itemsCount === 0 && loadingMode === "none";

  React.useEffect(() => {
    if (!isDimmed) {
      wasSearchActiveRef.current = isSearch;
      previousItemsRef.current = items;
      previousTotalRef.current = totalItems;
      savedEmptyScreenCtxRef.current = emptyScreenCtx;
      wasEmptyScreenRef.current = showsEmptyScreen;
    }
  }, [isDimmed, isSearch, items, totalItems, emptyScreenCtx, showsEmptyScreen]);

  const isShareFormEmpty =
    itemsCount === 0 &&
    !isSearch &&
    Boolean(items?.[0]?.isRoomsOnly) &&
    (Boolean(items?.[0]?.createDefineRoomType === RoomType.FillingFormsRoom) ||
      Boolean(items?.[0]?.createDefineRoomType === RoomType.VirtualDataRoom));

  const visibleInfoBar = !isShareFormEmpty && !isBreadCrumbsLoading;

  const resetCache = React.useCallback(() => {
    if (listOptionsRef && listOptionsRef.current) {
      listOptionsRef.current.resetloadMoreItemsCache(true);
    }
  }, []);

  React.useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [items]);

  const onBodyResize = React.useCallback(() => {
    if (bodyRef && bodyRef.current) {
      resizeTimerRef.current = setTimeout(() => {
        if (bodyRef.current) {
          setBodyHeight(bodyRef.current.offsetHeight);
        }
      }, 20);
    }
  }, []);

  const isItemLoaded = React.useCallback(
    (index: number) => {
      return !hasNextPage || index < itemsCount;
    },
    [hasNextPage, itemsCount],
  );

  const onLoadMoreItems = React.useCallback(
    (startIndex: number) => {
      // first page loads in selector's useEffect
      if (startIndex === 1) return;

      loadMoreItems(startIndex);
    },
    [loadMoreItems],
  );

  React.useEffect(() => {
    window.addEventListener("resize", onBodyResize);

    return () => {
      window.removeEventListener("resize", onBodyResize);
    };
  }, [onBodyResize]);

  React.useEffect(() => {
    onBodyResize();
  }, [isLoading, footerVisible, onBodyResize]);

  React.useEffect(() => {
    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    resetCache();
  }, [resetCache, hasNextPage]);

  // scroll to top after changing tab
  React.useEffect(() => {
    if (!withTabs) return;
    const scrollElement = document.querySelector(".selector-body-scroll");

    if (scrollElement) {
      scrollElement.scrollTo(0, 0);
    }
  }, [withTabs, activeTabId]);

  useLayoutEffect(() => {
    if (withInfoBar && itemsCount !== 0) {
      const infoEl = infoBarRef.current;

      if (infoEl) {
        const { height } = infoEl.getBoundingClientRect();
        setInfoBarHeight(height + CONTAINER_PADDING);
        return;
      }
    }

    setInfoBarHeight(0);
  }, [withInfoBar, itemsCount, visibleInfoBar]);
  useLayoutEffect(() => {
    if (injectedElement) {
      const element = injectedElementRef.current;

      if (element) {
        const { height } = element.getBoundingClientRect();
        setInjectedElementHeight(height);
      }
    }
  }, [injectedElement, itemsCount]);

  let listHeight = bodyHeight - infoBarHeight - injectedElementHeight;

  const effectiveIsSearch =
    isSearch || (isDimmed && wasSearchActiveRef.current);
  const showSearch = withSearch && (effectiveIsSearch || itemsCount > 0);
  const showSelectAll = (isMultiSelect && withSelectAll && !isSearch) || false;

  if (withPadding) {
    listHeight -= CONTAINER_PADDING;
  }

  if (showSearch) {
    listHeight -= SEARCH_HEIGHT;
  }
  if (withTabs) listHeight -= TABS_HEIGHT;
  if (withInfo) {
    const infoEl = document.getElementById("selector-info-text");
    if (infoEl) {
      const height = infoEl.getClientRects()[0].height + INFO_BLOCK_MARGIN;
      listHeight -= height;
    }
  }

  if (withBreadCrumbs) listHeight -= BREAD_CRUMBS_HEIGHT;

  if (showSelectAll) listHeight -= SELECT_ALL_HEIGHT;

  if (descriptionText) listHeight -= BODY_DESCRIPTION_TEXT_HEIGHT;

  const getFooterHeight = () => {
    if (withFooterCheckbox && withFooterInput)
      return withErrorFooter
        ? FOOTER_WITH_NEW_NAME_AND_CHECKBOX_HEIGHT + ERROR_FOOTER_HEIGHT
        : FOOTER_WITH_NEW_NAME_AND_CHECKBOX_HEIGHT;
    if (withFooterCheckbox) return FOOTER_WITH_CHECKBOX_HEIGHT;
    if (withFooterInput) return FOOTER_WITH_NEW_NAME_HEIGHT;
    return FOOTER_HEIGHT;
  };

  const getHeaderHeight = () => {
    if (withTabs) return HEADER_HEIGHT;
    return HEADER_HEIGHT + CONTAINER_PADDING;
  };

  const cloneProps = { ref: injectedElementRef };

  const getItemSize = (index: number): number => {
    const item = items[index];
    if (item?.isSeparator) {
      return item?.isSectionSeparator ? 25 : 16;
    }

    return 48;
  };

  return (
    <div
      ref={bodyRef}
      className={classNames(
        styles.body,
        {
          [styles.withHeaderAndFooter]: footerVisible && withHeader,
          [styles.withFooterOnly]: footerVisible && !withHeader,
          [styles.withHeaderOnly]: !footerVisible && withHeader,
          [styles.noHeaderFooter]: !footerVisible && !withHeader,
          [styles.withPadding]: !withTabs && withPadding,
        },
        "selector_body",
      )}
      style={
        {
          "--footer-height": `${getFooterHeight()}px`,
          "--header-height": `${getHeaderHeight()}px`,
        } as React.CSSProperties
      }
    >
      <InfoBar
        ref={infoBarRef}
        visible={visibleInfoBar}
        className={styles.selectorInfoBar}
      />
      <BreadCrumbs visible={!isShareFormEmpty} />

      {injectedElement ? React.cloneElement(injectedElement, cloneProps) : null}

      {withTabs && tabsData ? (
        <Tabs
          items={tabsData}
          selectedItemId={activeTabId}
          className={classNames(styles.tabs, "selector_body_tabs")}
        />
      ) : null}

      <Search isSearch={itemsCount > 0 || !!effectiveIsSearch} />

      {withInfo && loadingMode !== "skeleton" ? (
        <Info
          withInfo={withInfo}
          infoText={infoText}
          withInfoBadge={withInfoBadge}
        />
      ) : null}

      {loadingMode === "skeleton" ? (
        <Scrollbar style={{ height: listHeight > 0 ? listHeight : "100%" }}>
          {rowLoader}
        </Scrollbar>
      ) : showsEmptyScreen ? (
        <div style={{ height: listHeight }}>
          <EmptyScreen
            withSearch={isSearch}
            items={items}
            inputItemVisible={inputItemVisible}
            hideBackButton={hideBackButton}
          />
        </div>
      ) : isDimmed && wasEmptyScreen ? (
        <DimmedEmptyScreen
          emptyScreenCtx={savedEmptyScreenCtxRef.current}
          wasSearchActive={wasSearchActiveRef.current}
          displayItems={displayItems}
          inputItemVisible={inputItemVisible}
          hideBackButton={hideBackButton}
        />
      ) : (
        <div
          className={classNames(
            styles.bodyContentWrapper,
            isDimmed && styles.bodyContentDimmed,
          )}
        >
          {descriptionText ? (
            <Text className={styles.bodyDescriptionText}>
              {descriptionText}
            </Text>
          ) : null}

          <SelectAll
            show={showSelectAll}
            isLoading={isLoading}
            rowLoader={rowLoader}
          />

          {isSSR && !bodyHeight ? (
            <Scrollbar
              style={
                {
                  height: `calc(100% - ${Math.abs(listHeight + CONTAINER_PADDING)}px)`,
                  overflow: "hidden",
                  "--scrollbar-padding-inline-end": 0,
                  "--scrollbar-padding-inline-end-mobile": 0,
                } as React.CSSProperties
              }
            >
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    height: 48,
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <Item
                    index={index}
                    style={{ flexGrow: 1 }}
                    data={{
                      items: displayItems,
                      onSelect,
                      isMultiSelect: isMultiSelect || false,
                      rowLoader,
                      isItemLoaded,
                      renderCustomItem,
                      setInputItemVisible,
                      inputItemVisible,
                      savedInputValue,
                      setSavedInputValue,
                      listHeight,
                      isLimitReached,
                      displayFileExtension,
                    }}
                  />
                </div>
              ))}
            </Scrollbar>
          ) : displayItems.length === 2 && displayItems[1]?.isInputItem ? (
            <InputItem
              defaultInputValue={
                savedInputValue ?? displayItems[1].defaultInputValue
              }
              onAcceptInput={displayItems[1].onAcceptInput}
              onCancelInput={displayItems[1].onCancelInput}
              style={{}}
              color={displayItems[1].color}
              roomType={displayItems[1].roomType}
              cover={displayItems[1].cover}
              icon={displayItems[1].icon}
              setInputItemVisible={setInputItemVisible}
              setSavedInputValue={setSavedInputValue}
              placeholder={displayItems[1].placeholder}
            />
          ) : (
            <InfiniteLoader
              ref={listOptionsRef}
              isItemLoaded={isItemLoaded}
              itemCount={displayTotal}
              loadMoreItems={onLoadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className="items-list"
                  height={listHeight}
                  width="100%"
                  itemCount={itemsCount}
                  itemData={{
                    items: isEmptyInput ? [displayItems[1]] : displayItems,
                    onSelect,
                    isMultiSelect: isMultiSelect || false,
                    rowLoader,
                    isItemLoaded,
                    renderCustomItem,
                    setInputItemVisible,
                    inputItemVisible,
                    savedInputValue,
                    setSavedInputValue,
                    listHeight,
                    isLimitReached,
                    displayFileExtension,
                    forceIsMultiSelect,
                  }}
                  itemSize={getItemSize}
                  onItemsRendered={onItemsRendered}
                  ref={(node: List | null) => {
                    if (typeof ref === "function") {
                      (ref as (r: List | null) => void)(node);
                    }
                    listRef.current = node;
                  }}
                  outerElementType={VirtualScroll}
                >
                  {Item}
                </List>
              )}
            </InfiniteLoader>
          )}
        </div>
      )}
    </div>
  );
};

export { Body };
