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

import React, { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";

import { useAnimation, AnimationEvents } from "../../hooks/useAnimation";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";
import { useEventListener } from "../../hooks/useEventListener";

import { Scrollbar, ScrollbarType } from "../scrollbar";
import { LoaderWrapper } from "../loader-wrapper";

import { useViewTab } from "./hooks/use-view-tab/useViewTab";
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
    className,
    ...rest
  } = props;

  const { interfaceDirection } = useInterfaceDirection();

  const selectedItemIndex = !selectedItemId
    ? 0
    : items.findIndex((item) => item.id === selectedItemId);

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollbarType>(null);

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
      } else if (rect.right > containerWidth && !!containerElement.scrollLeft) {
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

  const classes = classNames({
    [styles.primary]: true,
  });

  const renderContent = (
    <div className={classNames(styles.tabList, classes)} ref={tabsRef} id={id}>
      {items.map((item, index) => {
        const isSelected = index === selectedItemIndex;

        const isAnimationProgress = isSelected && animationPhase === "progress";

        return (
          <div
            key={item.id}
            className={classNames(
              styles.tab,
              {
                [styles.selected]: isSelected,
                [styles.disabled]: item.isDisabled,
              },
              classes,
            )}
            onClick={() => {
              if (index === selectedItemIndex) return;
              if (!withAnimation) item.onClick?.();
              setSelectedItem(item, index);
            }}
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
      <div
        data-sticky
        className={classNames(styles.sticky, classes, "sticky")}
        style={{ top: stickyTop }}
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
          <div className={`${styles.tabsBody} tabs-body`}>
            {selectedContent}
          </div>
        ) : null}
      </LoaderWrapper>
    </div>
  );
};

export { PrimaryTabs };
