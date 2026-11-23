import React, { useCallback, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { isDesktop } from "react-device-detect";

import classNames from "classnames";
import MainPanelProps from "./MainPanel.props";
import styles from "./MainPanel.module.scss";

const MainPanel = ({
  ref,
  isLoading,
  isFistImage,
  isLastImage,
  src,
  onNext,
  onPrev,
}: MainPanelProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [style, api] = useSpring(() => ({
    x: 0,
    scale: 1,
  }));

  const resetState = useCallback(() => {
    api.set({ x: 0 });
  }, [api]);

  useEffect(() => {
    resetState();
  }, [resetState, src]);

  useGesture(
    {
      onDrag: ({ offset: [dx], movement: [mdx] }) => {
        if (isDesktop) return;

        api.start({
          x:
            (isFistImage && mdx > 0) || (isLastImage && mdx < 0)
              ? style.x.get()
              : dx,
          immediate: true,
        });
      },
      onDragEnd: ({ movement: [mdx] }) => {
        if (isDesktop) return;

        const width = window.innerWidth;

        if (mdx < -width / 4) {
          return onNext?.();
        }
        if (mdx > width / 4) {
          return onPrev?.();
        }

        api.start({ x: 0 });
      },
    },
    {
      drag: {
        from: () => [style.x.get(), 0],
        axis: "x",
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 5 },
        from: () => [style.scale.get(), 0],
        threshold: [0.1, 5],
        rubberband: false,
        pinchOnWheel: false,
      },
      target: wrapperRef,
    },
  );

  return (
    // @ts-expect-error - React Spring types issue with React 19
    <animated.section
      ref={wrapperRef}
      style={style}
      className={classNames(styles.wrapper, {
        [styles.isDesktop]: isDesktop,
      })}
      data-testid="main-panel-wrapper"
      role="region"
      aria-label="PDF viewer main panel"
    >
      <div
        id="mainPanel"
        ref={ref}
        className={styles.content}
        data-loading={isLoading}
        data-testid="main-panel-content"
        role="document"
        aria-busy={isLoading}
        aria-label={`PDF document ${src}`}
      />
    </animated.section>
  );
};

MainPanel.displayName = "MainPanel";

export { MainPanel };
