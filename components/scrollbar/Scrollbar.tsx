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

"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import throttle from "lodash/throttle";
import classNames from "classnames";

import { isTouchDevice } from "../../utils";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";

import { Scrollbar as CustomScrollbar } from "./custom-scrollbar";
import styles from "./Scrollbar.module.scss";
import type { ScrollbarProps } from "./Scrollbar.types";

const Scrollbar = (props: ScrollbarProps) => {
  const {
    ref,
    contentRef,
    onScroll,
    autoHide = true,
    scrollClass,
    fixedSize = false,
    className,
    scrollBodyClassName,
    autoFocus,
    tabIndex = -1,
    paddingAfterLastItem,
    paddingInlineEnd,
    rtl: rtlProp,
    ...rest
  } = props;

  const { isRTL } = useInterfaceDirection();

  const [scrollVisible, setScrollVisible] = useState(false);
  const timerId = useRef<null | ReturnType<typeof setTimeout>>(null);

  const scrollRef = useRef<null | CustomScrollbar>(null);

  // onScroll handler placed here on Scroller element to get native event instead of parameters that library put
  const renderScroller = React.useCallback(
    (libProps: { elementRef?: React.Ref<HTMLDivElement> }) => {
      const { elementRef, ...restLibProps } = libProps;

      return (
        <div
          {...restLibProps}
          key="scroll-renderer-div"
          className={classNames(styles.scroller, "scroller", scrollClass)}
          ref={elementRef}
          onScroll={onScroll}
          data-testid="scroller"
        />
      );
    },
    [onScroll, scrollClass],
  );

  const showTracks = useMemo(
    () =>
      throttle(
        () => {
          setScrollVisible(true);

          if (timerId.current) {
            clearTimeout(timerId.current);
          }

          timerId.current = setTimeout(() => setScrollVisible(false), 3000);
        },
        500,
        { trailing: false },
      ),
    [],
  );

  const refSetter = (elementRef: CustomScrollbar) => {
    // react-window passes a function ref
    if (typeof ref === "function") {
      ref(elementRef);
    } else if (ref) {
      ref.current = elementRef;
    }
    scrollRef.current = elementRef;

    if (contentRef) {
      contentRef.current = elementRef?.contentElement;
    }
  };

  const autoHideContainerProps = autoHide ? { onScroll: showTracks } : {};

  const autoHideContentProps =
    autoHide && !isTouchDevice ? { onMouseMove: showTracks } : {};
  const tabIndexProp = tabIndex !== null ? { tabIndex } : {};

  const renderScrollBody = (libProps: {
    elementRef?: React.Ref<HTMLDivElement>;
  }) => {
    const { elementRef, ...restLibProps } = libProps;

    return (
      <div
        {...restLibProps}
        key="scroll-body-renderer-div"
        ref={elementRef}
        data-testid="scroll-body"
        className={classNames(
          styles.scrollBody,
          "scroll-body",
          scrollBodyClassName,
        )}
        {...tabIndexProp}
        {...autoHideContentProps}
      />
    );
  };

  useEffect(() => {
    return () => {
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  useEffect(() => {
    if (autoFocus) {
      scrollRef.current?.contentElement?.focus();
    }
  }, [autoFocus]);

  useLayoutEffect(() => {
    if (!scrollRef.current?.holderElement) return;

    if (paddingAfterLastItem) {
      scrollRef.current.holderElement.style.setProperty(
        "--scrollbar-padding-after-last-item",
        paddingAfterLastItem,
      );
    }

    if (paddingInlineEnd) {
      scrollRef.current.holderElement.style.setProperty(
        "--scrollbar-padding-inline-end",
        paddingInlineEnd,
      );
      scrollRef.current.holderElement.style.setProperty(
        "--scrollbar-padding-inline-end-mobile",
        paddingInlineEnd,
      );
    }
  }, [paddingAfterLastItem, paddingInlineEnd]);

  return (
    <CustomScrollbar
      {...rest}
      data-testid="scrollbar"
      disableTracksWidthCompensation
      rtl={rtlProp ?? isRTL}
      className={classNames(styles.scrollbar, className, {
        [styles.fixedSize]: fixedSize,
        [styles.paddingAfterLastItem]: paddingAfterLastItem,
        [styles.autoHide]: autoHide,
        [styles.scrollVisible]: autoHide && scrollVisible,
        [styles.noScrollY]: rest.noScrollY,
      })}
      wrapperProps={{ className: "scroll-wrapper" }}
      scrollerProps={{ renderer: renderScroller }}
      contentProps={{
        renderer: renderScrollBody,
      }}
      thumbYProps={{
        className: classNames(
          styles.thumb,
          styles.thumbVertical,
          "thumb",
          "thumb-vertical",
        ),
      }}
      thumbXProps={{
        className: classNames(
          styles.thumb,
          styles.thumbHorizontal,
          "thumb",
          "thumb-horizontal",
        ),
      }}
      trackYProps={{
        className: classNames(
          styles.track,
          styles.trackVertical,
          "track",
          "track-vertical",
        ),
      }}
      trackXProps={{
        className: classNames(
          styles.track,
          styles.trackHorizontal,
          "track",
          "track-horizontal",
        ),
      }}
      // @ts-expect-error error from custom scrollbar
      ref={refSetter}
      {...autoHideContainerProps}
    />
  );
};

Scrollbar.displayName = "Scrollbar";

export { Scrollbar };
