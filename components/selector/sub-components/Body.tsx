import React, { useLayoutEffect, useRef, useState } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import classNames from "classnames";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import type { Nullable } from "../../../types";
import styles from "../Selector.module.scss";
import { Scrollbar } from "../../scrollbar";
import { Text } from "../../text";
import { consumeKey } from "../../../utils/consume-key";

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
import { ListboxContext } from "../contexts/Listbox";
import { Tabs } from "../../tabs";
import InputItem from "./InputItem";
import { isCreateNewItemShown } from "../Selector.utils";
import { DROPDOWN_CLASS_NAME } from "./NewItemDropDown";

const DimmedEmptyScreen = ({
  emptyScreenCtx,
  wasSearchActive,
  displayItems,
  inputItemVisible,
  hideBackButton,
  height,
}: {
  emptyScreenCtx: TSelectorEmptyScreen;
  wasSearchActive: boolean;
  displayItems: TSelectorItem[];
  inputItemVisible: boolean;
  hideBackButton?: boolean;
  height: number;
}) => (
  <div className={styles.dimmedEmptyScreen} style={{ height }}>
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
// How many frames a row scrolled back on screen is waited for to be drawn.
const ROW_FRAMES = 10;

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
  listLabel,
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

  // What the loader looks for rows to load in. The row after the loaded ones
  // draws the loader and counts as loaded, so the first row to ask for is the
  // one after it: a total one above the loaded rows - a last page of one row -
  // or one a caller counted short leaves none in range, and the list ended on
  // its loader. While there is a next page the range always holds that row.
  const loaderItemCount = displayHasNextPage
    ? Math.max(displayTotal, itemsCount + 1)
    : displayTotal;

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
  const showSelectAll =
    (isMultiSelect && withSelectAll && !effectiveIsSearch) || false;

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

  // The keyboard's place in the list. The list's scroll container holds the
  // focus (one Tab stop for the whole list, as only the rows near the viewport
  // exist), the arrows move this index, and Enter or Space click the row, so a
  // key does what the pointer does there.
  const listboxId = React.useId();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const activeIndexRef = React.useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const listItems = isEmptyInput ? [displayItems[1]] : displayItems;

  // The rows Item greys out: disabled, or unticked once the limit is reached.
  const isPickable = (index: number) => {
    const item = listItems[index];
    if (!item || !item.id || item.isSeparator || item.isInputItem) return false;
    if (item.isDisabled) return false;
    // The "create new" row is an action, not a pick: the limit leaves it be.
    // It is reachable only where Item draws it.
    if (item.isCreateNewItem) return isCreateNewItemShown(listItems);
    return !(
      isMultiSelect &&
      isLimitReached &&
      !item.isSelected &&
      !item.isFolder
    );
  };

  const stepFrom = (from: number, step: 1 | -1) => {
    for (
      let index = from + step;
      index >= 0 && index < listItems.length;
      index += step
    )
      if (isPickable(index)) return index;
    return from;
  };

  // Rows on screen, from react-window: focus lands on one of them rather than
  // scrolling the list to a row further down.
  const visibleRangeRef = React.useRef({ start: 0, stop: 0 });

  const moveTo = (index: number) => {
    if (index < 0) return;
    setActiveIndex(index);
    listRef.current?.scrollToItem(index);
  };

  // Clicks the row the keyboard is on. The keys scrolled it on screen, but the
  // wheel may have taken it away since, and react-window drew it out: it is
  // scrolled back and clicked once drawn, a few frames later at most.
  const clickRow = (index: number) => {
    const optionId = `${listboxId}-option-${index}`;
    const click = () => {
      const row = document.getElementById(optionId);
      row?.click();
      return !!row;
    };
    if (click()) return;

    listRef.current?.scrollToItem(index);
    const retry = (framesLeft: number) => {
      if (!framesLeft || click()) return;
      requestAnimationFrame(() => retry(framesLeft - 1));
    };
    requestAnimationFrame(() => retry(ROW_FRAMES));
  };

  // A row opened from the keyboard swaps the list for the folder's: the
  // keyboard starts again on its first row while the list keeps the focus.
  // Only a new list does that - not a pick re-rendering the same rows (the
  // items array is rebuilt on every Selector render), nor the next page
  // appended below them.
  const itemIdsRef = React.useRef<unknown[]>([]);
  React.useEffect(() => {
    const ids = items.map((item) => item?.id);
    const previous = itemIdsRef.current;
    itemIdsRef.current = ids;
    // An empty list before is no "same list": a folder that loads through an
    // empty one would keep the keyboard on a row index of the list before it.
    const sameList =
      previous.length > 0 && previous.every((id, index) => ids[index] === id);
    if (sameList || activeIndexRef.current < 0) return;

    const list = document.activeElement;
    const keepsFocus =
      list?.getAttribute("role") === "listbox" &&
      !!bodyRef.current?.contains(list);
    if (keepsFocus) moveTo(stepFrom(-1, 1));
    else setActiveIndex(-1);
  }, [items]);

  // Where the first arrow press lands: on the selected row if it is on
  // screen, or else on the first row on screen, or the first row at all.
  const getStartIndex = () => {
    const { start, stop } = visibleRangeRef.current;
    const selected = listItems.findIndex(
      (item, index) =>
        item?.isSelected &&
        isPickable(index) &&
        index >= start &&
        index <= stop,
    );
    if (selected >= 0) return selected;
    const firstOnScreen = stepFrom(start - 1, 1);
    return firstOnScreen >= start && firstOnScreen <= stop
      ? firstOnScreen
      : stepFrom(-1, 1);
  };

  // The pointer took over the list: the keyboard leaves its row, and Enter
  // goes to the Selector's submit again, as for a row picked with the pointer
  // it should. A focus that press brings is the pointer's too. The next key
  // gives the list back to the keyboard, from the row the pointer pressed.
  const pointerRef = React.useRef(false);
  const pointerRowRef = React.useRef(-1);

  // Focused, the list shows where the keyboard is: on the selected row on
  // screen, or else the first one. Enter there picks that row - except on
  // the row already picked in single select, where it submits the choice
  // instead of unpicking it.
  const listbox = {
    label: listLabel,
    multiselectable: !!isMultiSelect,
    activeOptionId:
      activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined,
    onPointerDown: (e: PointerEvent) => {
      const optionPrefix = `${listboxId}-option-`;
      const option =
        e.target instanceof Element
          ? e.target.closest('[role="option"]')
          : null;
      pointerRef.current = true;
      pointerRowRef.current = option?.id.startsWith(optionPrefix)
        ? Number(option.id.slice(optionPrefix.length))
        : -1;
      setActiveIndex(-1);
    },
    onFocus: () => {
      if (pointerRef.current || activeIndexRef.current >= 0) return;
      const index = getStartIndex();
      if (index >= 0) setActiveIndex(index);
    },
    // The New row's menu takes the focus to its entries and gives it back:
    // the keyboard stays on that row meanwhile, so it is ringed again after.
    onBlur: (e: FocusEvent) => {
      const next = e.relatedTarget;
      if (next instanceof Element && next.closest(`.${DROPDOWN_CLASS_NAME}`))
        return;
      setActiveIndex(-1);
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.target !== e.currentTarget) return;
      const pointerRow = pointerRowRef.current;
      pointerRef.current = false;
      pointerRowRef.current = -1;
      const last = stepFrom(listItems.length, -1);
      const startIndex =
        pointerRow >= 0 && isPickable(pointerRow)
          ? pointerRow
          : getStartIndex();

      switch (e.key) {
        case "ArrowDown":
          moveTo(activeIndex < 0 ? startIndex : stepFrom(activeIndex, 1));
          break;
        case "ArrowUp":
          moveTo(activeIndex < 0 ? startIndex : stepFrom(activeIndex, -1));
          break;
        case "Home":
          moveTo(stepFrom(-1, 1));
          break;
        case "End":
          moveTo(last);
          break;
        case "Enter":
        case " ": {
          // A dimmed list is on its way out: the pointer cannot reach it, and
          // neither can the keys, which would pick a row of the list before.
          if (isDimmed) break;
          if (activeIndex < 0 || !isPickable(activeIndex)) return;
          // Enter on the row already picked in single select is the Selector's
          // submit: the choice stands.
          if (
            e.key === "Enter" &&
            !isMultiSelect &&
            listItems[activeIndex]?.isSelected
          )
            return;
          clickRow(activeIndex);
          break;
        }
        default:
          return;
      }

      e.preventDefault();
      consumeKey(e);
    },
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
          height={listHeight}
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
            <ListboxContext value={listbox}>
              <InfiniteLoader
                ref={listOptionsRef}
                isItemLoaded={isItemLoaded}
                itemCount={loaderItemCount}
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
                      listboxId,
                      activeIndex,
                    }}
                    itemSize={getItemSize}
                    onItemsRendered={(props) => {
                      visibleRangeRef.current = {
                        start: props.visibleStartIndex,
                        stop: props.visibleStopIndex,
                      };
                      onItemsRendered(props);
                    }}
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
            </ListboxContext>
          )}
        </div>
      )}
    </div>
  );
};

export { Body };
