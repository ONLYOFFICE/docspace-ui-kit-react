import React, { useRef, useEffect, useCallback, useState } from "react";
import classNames from "classnames";
import { ReactSVG } from "react-svg";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import ArrowReactUrl from "../../assets/arrow.left.react.svg";
import type { TTabItem, TabsProps } from "./Tabs.types";
import { Scrollbar, type ScrollbarType } from "../scrollbar";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import {
  MAX_TAB_WIDTH,
  TAB_PADDING,
  TABS_GAP,
  ARROW_WIDTH,
} from "./Tabs.constants";
import styles from "./Tabs.module.scss";
import useTabsHotkeys from "./hooks/use-tabs-hotkeys/useTabsHotkeys";
import { useViewTab } from "./hooks/use-view-tab/useViewTab";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";

const SecondaryTabs = (props: TabsProps) => {
  const {
    items,
    selectedItemId,
    stickyTop,
    onSelect,
    withoutStickyIntend = false,
    layoutId,
    isLoading,
    scaled,
    hotkeysId,
    className,
    ...rest
  } = props;

  const selectedItemIndex = !selectedItemId
    ? 0
    : items.findIndex((item) => item.id === selectedItemId);

  // The roving tab stop: the one tab Tab lands on, and the one the arrow
  // keys move from. It follows the selection until the keyboard moves it.
  const [focusedTabIndex, setFocusedTabIndex] = useState(
    Math.max(selectedItemIndex, 0),
  );
  const [tabsCountInContainer, setTabsCountInContainer] = useState(0);

  const { interfaceDirection } = useInterfaceDirection();

  const [referenceTabSize, setReferenceTabSize] = useState<number | null>(null);
  const [tabsIsOverflowing, setTabsIsOverflowing] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollbarType>(null);
  const tabItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const isViewFirstTab = useViewTab(scrollRef, tabsRef, 0);
  const isViewLastTab = useViewTab(scrollRef, tabsRef, items.length - 1);

  const scrollToTab = useCallback(
    (index: number): void => {
      if (!scrollRef.current || !tabsRef.current) return;

      const containerElement = scrollRef.current.scrollerElement;
      const tabElement = tabsRef.current.children[index] as HTMLDivElement;

      if (!containerElement || !tabElement) return;

      const containerWidth = containerElement.offsetWidth;
      const tabWidth = tabElement?.offsetWidth;
      const tabOffsetLeft = tabElement?.offsetLeft;
      const arrowsWidth = isMobile ? 0 : ARROW_WIDTH;

      if (tabOffsetLeft - TABS_GAP < containerElement.scrollLeft) {
        scrollRef.current.scrollTo(tabOffsetLeft - TABS_GAP - arrowsWidth);
      } else if (
        tabOffsetLeft + tabWidth >
        containerElement.scrollLeft + containerWidth
      ) {
        const tabsWidth = (tabsCountInContainer - 1) * tabWidth;
        scrollRef.current.scrollTo(
          tabOffsetLeft - TABS_GAP - arrowsWidth - tabsWidth,
        );
      }
    },
    [tabsCountInContainer],
  );

  useEffect(() => {
    setFocusedTabIndex(Math.max(selectedItemIndex, 0));
  }, [selectedItemIndex]);

  const setSelectedItem = (selectedTabItem: TTabItem, index: number): void => {
    onSelect?.(selectedTabItem);
    setFocusedTabIndex(index);

    scrollToTab(index);
  };

  const selectTab = (index: number) => {
    const item = items[index];
    if (!item || item.isDisabled || index === selectedItemIndex) return;
    item.onClick?.();
    setSelectedItem(item, index);
  };

  const focusTab = (index: number) => {
    setFocusedTabIndex(index);
    tabItemsRef.current[index]?.focus();
    scrollToTab(index);
  };

  const { onKeyDown } = useTabsHotkeys({
    items,
    focusedTabIndex,
    focusTab,
    selectTab,
  });

  useEffect(() => {
    if (isLoading) return;

    if (scaled) {
      // A scaled tab is stretched to its share of the row, so its own width
      // says nothing about what it holds. The label keeps its natural width
      // even when truncated, so measure that, plus the icon beside it.
      const contents = tabItemsRef.current.map((ref) => {
        if (!ref) return 0;
        const label = ref.querySelector<HTMLElement>(`.${styles.tabText}`);
        const icon = ref.querySelector<HTMLElement>(`.${styles.tabIcon}`);
        return (
          (label?.scrollWidth ?? 0) + (icon ? icon.offsetWidth + TABS_GAP : 0)
        );
      });
      setReferenceTabSize(Math.min(Math.max(...contents), MAX_TAB_WIDTH));
      return;
    }

    const widths = tabItemsRef.current.map((ref) =>
      ref ? ref.offsetWidth : 0,
    );

    const max = Math.max(...widths);

    setReferenceTabSize(
      max > MAX_TAB_WIDTH ? MAX_TAB_WIDTH : max - TAB_PADDING,
    );
  }, [setReferenceTabSize, isLoading, scaled]);

  useEffect(() => {
    if (tabsIsOverflowing) return;

    const tabsContainerWidth = tabsContainerRef.current?.offsetWidth ?? 0;

    if (tabsContainerWidth && referenceTabSize) {
      let maxTabsCount = Math.floor(
        tabsContainerWidth / (referenceTabSize + TABS_GAP + TAB_PADDING),
      );
      if (maxTabsCount < items.length) {
        setTabsIsOverflowing(true);

        if (isMobile) return;

        const arrowsWidth = ARROW_WIDTH * 2;

        maxTabsCount = Math.floor(
          (tabsContainerWidth - arrowsWidth) /
            (referenceTabSize + TABS_GAP + TAB_PADDING),
        );

        const size =
          Math.round(tabsContainerWidth - arrowsWidth) / maxTabsCount -
          TAB_PADDING -
          TABS_GAP;

        setReferenceTabSize(size);
        setTabsCountInContainer(maxTabsCount);
      }
    }
  }, [referenceTabSize, items.length, tabsIsOverflowing]);

  useEffect(() => {
    scrollToTab(selectedItemIndex);
  }, [selectedItemIndex, items, scrollToTab]);

  const classes = classNames({
    [styles.secondary]: true,
  });

  // The nearest tab in a direction that can be selected, skipping disabled
  // ones; -1 when there is none.
  const findEnabled = (from: number, step: 1 | -1) => {
    for (let i = from + step; i >= 0 && i < items.length; i += step) {
      if (!items[i].isDisabled) return i;
    }
    return -1;
  };

  const prevIndex = findEnabled(selectedItemIndex, -1);
  const nextIndex = findEnabled(selectedItemIndex, 1);

  const onSelectPrev = () => {
    if (prevIndex < 0) return;
    onSelect?.(items[prevIndex]);
  };

  const onSelectNext = () => {
    if (nextIndex < 0) return;
    onSelect?.(items[nextIndex]);
  };

  const containerW =
    tabsIsOverflowing && referenceTabSize
      ? items.length * (referenceTabSize + TAB_PADDING) +
        ARROW_WIDTH +
        ARROW_WIDTH +
        items.length * TABS_GAP
      : null;

  const withArrows = tabsIsOverflowing && !isMobile;

  const renderContent = (
    <div
      id={layoutId}
      style={
        {
          "--tabs-count": items.length,
          "--tabs-width": `${containerW}px`,
        } as React.CSSProperties
      }
      className={classNames(
        styles.tabList,
        { [styles.withArrows]: withArrows },
        { [styles.referenceSize]: !!referenceTabSize },
        { [styles.scaled]: scaled },
        classes,
      )}
      ref={tabsRef}
      role="tablist"
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const isSelected = index === selectedItemIndex;

        return (
          <div
            key={item.id}
            ref={(el) => {
              tabItemsRef.current[index] = el;
            }}
            className={classNames(
              styles.tab,
              {
                [styles.selected]: isSelected,
                [styles.disabled]: item.isDisabled,
              },
              classes,
              "tab",
            )}
            role="tab"
            aria-selected={isSelected}
            aria-disabled={item.isDisabled || undefined}
            tabIndex={index === focusedTabIndex ? 0 : -1}
            onClick={() => selectTab(index)}
            style={
              scaled
                ? {}
                : {
                    width: referenceTabSize ?? "fit-content",
                    minWidth: referenceTabSize ?? "unset",
                  }
            }
            data-testid={`${item.id}_subtab`}
          >
            {item.iconName ? (
              <ReactSVG className={styles.tabIcon} src={item.iconName} />
            ) : null}

            {isSelected ? (
              <motion.span
                layoutId={layoutId ?? "motionLayoutId"}
                className={styles.motionBackground}
                transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
              />
            ) : null}

            <Text
              as="span"
              fontWeight={600}
              truncate
              className={styles.tabText}
            >
              {item.name}
            </Text>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={tabsContainerRef}
      className={classNames(styles.tabs, classes, className)}
      {...rest}
    >
      <div
        data-sticky
        className={classNames(styles.sticky, classes, "sticky")}
        style={{ top: stickyTop }}
      >
        {withArrows ? (
          <IconButton
            className={classNames(styles.arrowIcon, styles.arrowLeft, {
              [styles.disabled]: prevIndex < 0,
            })}
            isFill
            onClick={onSelectPrev}
            iconNode={<ArrowReactUrl />}
          />
        ) : null}

        {!isViewFirstTab ? (
          <div
            className={classNames(styles.blurAhead, classes)}
            dir={interfaceDirection}
            data-direction={interfaceDirection}
          />
        ) : null}

        <Scrollbar
          ref={scrollRef}
          autoHide={false}
          noScrollY
          paddingInlineEnd="0"
          scrollBodyClassName={
            hotkeysId ? `secondary-tabs-scroll-${hotkeysId}` : undefined
          }
          className={classNames(styles.scroll, classes)}
        >
          {renderContent}
        </Scrollbar>

        {!isViewLastTab ? (
          <div
            className={classNames(styles.blurBack, classes)}
            dir={interfaceDirection}
            data-direction={interfaceDirection}
          />
        ) : null}

        {withArrows ? (
          <IconButton
            className={classNames(styles.arrowIcon, styles.arrowRight, {
              [styles.disabled]: nextIndex < 0,
            })}
            isFill
            onClick={onSelectNext}
            iconNode={<ArrowReactUrl />}
          />
        ) : null}
      </div>

      {withoutStickyIntend ? null : (
        <div className={classNames(styles.stickyIndent, "sticky-indent")} />
      )}
      {items[selectedItemIndex]?.content ? (
        <div
          // style={{ overflow: "hidden" }}
          className={`${styles.tabsBody} tabs-body`}
        >
          {items[selectedItemIndex].content}
        </div>
      ) : null}
    </div>
  );
};

export { SecondaryTabs };
