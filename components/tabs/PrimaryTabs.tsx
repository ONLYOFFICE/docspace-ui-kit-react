import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { useAnimation, AnimationEvents } from "../../hooks/useAnimation";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";
import { useEventListener } from "../../hooks/useEventListener";

import { Scrollbar, ScrollbarType } from "../scrollbar";
import { LoaderWrapper } from "../loader-wrapper";

import { useViewTab } from "./hooks/use-view-tab/useViewTab";
import useTabsHotkeys from "./hooks/use-tabs-hotkeys/useTabsHotkeys";
import useTabPanel from "./hooks/use-tab-panel/useTabPanel";
import { type TTabItem, type TabsProps } from "./Tabs.types";
import { OFFSET_RIGHT, OFFSET_LEFT } from "./Tabs.constants";
import styles from "./Tabs.module.scss";

const PrimaryTabs = (props: TabsProps) => {
  const {
    items,
    selectedItemId,
    stickyTop,
    onSelect,
    withoutStickyIntend = false,
    id,
    withAnimation,
    stickyHeader,
    className,
    ...rest
  } = props;

  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stickyHeaderRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setStickyHeaderHeight(el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyHeader]);

  const { interfaceDirection } = useInterfaceDirection();

  const selectedItemIndex = !selectedItemId
    ? 0
    : items.findIndex((item) => item.id === selectedItemId);

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollbarType>(null);
  const tabItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // The roving tab stop: the one tab Tab lands on, and the one the arrow
  // keys move from. It follows the selection until the keyboard moves it.
  const [focusedTabIndex, setFocusedTabIndex] = useState(
    Math.max(selectedItemIndex, 0),
  );

  useEffect(() => {
    setFocusedTabIndex(Math.max(selectedItemIndex, 0));
  }, [selectedItemIndex]);

  // A shorter list must not leave the tab stop past its end, where no tab
  // would carry tabIndex 0 and Tab would skip the whole bar.
  const lastTabIndex = Math.max(items.length - 1, 0);
  const rovingTabIndex = Math.min(focusedTabIndex, lastTabIndex);

  useEffect(() => {
    setFocusedTabIndex((index) => Math.min(index, lastTabIndex));
  }, [lastTabIndex]);

  const isViewFirstTab = useViewTab(scrollRef, tabsRef, 0);
  const isViewLastTab = useViewTab(scrollRef, tabsRef, items.length - 1);

  const [selectedContent, setSelectedContent] = React.useState(
    items[selectedItemIndex]?.content,
  );
  const [requestRunning, setRequestRunning] = React.useState(false);

  // Use same animation logic as ArticleItem
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(true); // Always active for tabs

  useEventListener(AnimationEvents.Forced_Animation, () => {
    triggerAnimation();
  });

  const scrollToTab = useCallback(
    (index: number): void => {
      if (!scrollRef.current || !tabsRef.current) return;

      const containerElement = scrollRef.current.scrollerElement;
      const tabElement = tabsRef.current.children[index] as HTMLDivElement;

      if (!containerElement || !tabElement) return;

      const containerWidth = containerElement.offsetWidth;
      const tabWidth = tabElement?.offsetWidth;
      const tabOffsetLeft = tabElement?.offsetLeft;

      if (interfaceDirection === "ltr") {
        if (tabOffsetLeft - OFFSET_LEFT < containerElement.scrollLeft) {
          scrollRef.current.scrollTo(tabOffsetLeft - OFFSET_LEFT);
        } else if (
          tabOffsetLeft + tabWidth >
          containerElement.scrollLeft + containerWidth
        ) {
          scrollRef.current.scrollTo(
            tabOffsetLeft - containerWidth + tabWidth + OFFSET_RIGHT,
          );
        }

        return;
      }

      const rect = tabElement?.getBoundingClientRect();

      if (rect.left - OFFSET_LEFT < 0) {
        scrollRef.current.scrollTo(
          -(
            Math.abs(rect.left) +
            OFFSET_LEFT +
            Math.abs(containerElement.scrollLeft)
          ),
        );
      } else if (rect.right > containerWidth && containerElement.scrollLeft) {
        scrollRef.current.scrollTo(
          rect.right -
            containerWidth +
            containerElement.scrollLeft +
            OFFSET_RIGHT,
        );
      }
    },
    [interfaceDirection],
  );

  useEffect(() => {
    if (!requestRunning) {
      setSelectedContent(items[selectedItemIndex]?.content);
    }
  }, [selectedItemIndex, items, requestRunning]);

  useEffect(() => {
    scrollToTab(selectedItemIndex);
  }, [selectedItemIndex, items, scrollToTab]);

  const setSelectedItem = async (selectedTabItem: TTabItem, index: number) => {
    // Trigger animation if withAnimation is true
    if (withAnimation) {
      triggerAnimation();
    }

    // setCurrentItem(index);
    onSelect?.(selectedTabItem);

    if (selectedTabItem.onClick && withAnimation) {
      setRequestRunning(true);

      await selectedTabItem.onClick();

      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));

      setRequestRunning(false);
    }

    scrollToTab(index);
  };

  // A click and Enter or Space on the focused tab select the same way.
  const selectTab = (index: number) => {
    const item = items[index];
    if (!item || item.isDisabled || index === selectedItemIndex) return;
    if (!withAnimation) item.onClick?.();
    setSelectedItem(item, index);
  };

  const focusTab = (index: number) => {
    setFocusedTabIndex(index);
    tabItemsRef.current[index]?.focus();
    scrollToTab(index);
  };

  const { onKeyDown } = useTabsHotkeys({
    items,
    focusedTabIndex: rovingTabIndex,
    focusTab,
    selectTab,
  });

  const { getTabProps, panelProps } = useTabPanel(
    selectedItemIndex,
    !!selectedContent,
  );

  const classes = classNames({
    [styles.primary]: true,
  });

  const renderContent = (
    <div
      className={classNames(styles.tabList, classes)}
      ref={tabsRef}
      id={id}
      role="tablist"
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const isSelected = index === selectedItemIndex;

        const isAnimationProgress = isSelected && animationPhase === "progress";

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
            )}
            role="tab"
            {...getTabProps(index)}
            aria-selected={isSelected}
            aria-disabled={item.isDisabled || undefined}
            tabIndex={index === rovingTabIndex ? 0 : -1}
            // Whatever put focus here -- a click on the tab already selected,
            // a script -- the arrows have to start from this tab.
            onFocus={() => setFocusedTabIndex(index)}
            onClick={() => selectTab(index)}
            data-testid={`${item.id}_tab`}
          >
            <span className={styles.tabText} suppressHydrationWarning>
              {item.name}
            </span>
            <div
              className={classNames(
                styles.tabSubLine,
                {
                  [styles.selected]: isSelected,
                  [styles.animationReady]: isAnimationReady,
                  [styles.animatedProgress]: isAnimationProgress,
                },
                classes,
              )}
              ref={isSelected ? parentElementRef : null}
            >
              <div
                className={classNames(
                  styles.tabSubLineSibling,
                  {
                    [styles.selected]: isSelected,
                    [styles.animationReady]: isAnimationReady,
                    [styles.animatedProgress]: isAnimationProgress,
                    [styles.animatedFinish]: animationPhase === "finish",
                  },
                  classes,
                )}
                style={{ "--end-width": `${endWidth}%` } as React.CSSProperties}
                ref={isSelected ? animationElementRef : null}
              />
            </div>

            {item.badge ? (
              <span className={styles.tabBadge} suppressHydrationWarning>
                {item.badge}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={classNames(styles.tabs, className, classes)} {...rest}>
      {stickyHeader ? (
        <div
          ref={stickyHeaderRef}
          className={classNames(styles.stickyHeaderOuter, "sticky")}
          style={{ top: stickyTop }}
        >
          {stickyHeader}
        </div>
      ) : null}

      <div
        data-sticky
        className={classNames(styles.sticky, classes, "sticky")}
        style={{
          top: stickyHeader
            ? `calc(${stickyTop ?? "0px"} + ${stickyHeaderHeight - 1}px)`
            : stickyTop,
        }}
      >
        {!isViewFirstTab ? (
          <div
            className={styles.blurAhead}
            dir={interfaceDirection}
            data-direction={interfaceDirection}
          />
        ) : null}
        <Scrollbar
          ref={scrollRef}
          autoHide={false}
          noScrollY
          paddingInlineEnd="0"
          className={classNames(styles.scroll, classes)}
        >
          {renderContent}
        </Scrollbar>
        {!isViewLastTab ? (
          <div
            className={styles.blurBack}
            dir={interfaceDirection}
            data-direction={interfaceDirection}
          />
        ) : null}
      </div>

      {withoutStickyIntend ? null : (
        <div className={classNames(styles.stickyIndent, "sticky-indent")} />
      )}
      <LoaderWrapper isLoading={animationPhase === "progress"}>
        {selectedContent ? (
          <div className={`${styles.tabsBody} tabs-body`} {...panelProps}>
            {selectedContent}
          </div>
        ) : null}
      </LoaderWrapper>
    </div>
  );
};

export { PrimaryTabs };
