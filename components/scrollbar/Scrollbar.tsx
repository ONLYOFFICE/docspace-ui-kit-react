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
