import React, { useEffect } from "react";
import classNames from "classnames";

import ArrowPathReactSvgUrl from "../../../assets/arrow.path.react.svg";
import CrossReactSvgUrl from "../../../assets/icons/17/cross.react.svg";

import { RectangleSkeleton } from "../../rectangle";
import { IconButton } from "../../icon-button";
import { Text } from "../../text";
import { Heading, HeadingSize } from "../../heading";

import type { AsideHeaderProps } from "./AsideHeader.types";
import styles from "./AsideHeader.module.scss";

export type { AsideHeaderProps } from "./AsideHeader.types";

const AsideHeader = (props: AsideHeaderProps) => {
  const {
    isBackButton = false,
    onBackClick,
    onCloseClick,
    header,
    headerIcons = [],
    isCloseable = true,
    className,
    id,
    style,
    isLoading,
    withoutBorder = false,
    headerHeight,
    headerComponent,
    dataTestId,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const backButtonRender = (
    <IconButton
      className={styles.arrowButton}
      iconNode={<ArrowPathReactSvgUrl />}
      size={17}
      onClick={onBackClick}
      isFill
      isClickable
      dataTestId="aside_header_back_icon_button"
    />
  );

  const closeIconRender = (
    <IconButton
      size={17}
      className={styles.closeButton}
      iconNode={<CrossReactSvgUrl />}
      onClick={onCloseClick}
      isClickable
      isStroke
      aria-label="close"
      dataTestId="aside_header_close_icon_button"
    />
  );

  // TODO: Heading is temporary until all dialogues are checked

  const headerComponentRender =
    typeof header === "string" ? (
      <Text fontSize="21px" fontWeight={700} className={styles.headerComponent}>
        {header}
      </Text>
    ) : (
      <Heading className={styles.heading} size={HeadingSize.medium} truncate>
        {header}
      </Heading>
    );

  const mainComponent = (
    <>
      {isBackButton ? backButtonRender : null}
      {header ? headerComponentRender : null}
      {headerIcons.length > 0 ? (
        <div
          className={styles.additionalIconsContainer}
          data-testid="icons-container"
        >
          {headerIcons.map((item) => (
            <IconButton
              key={item.key}
              size={17}
              className={styles.closeButton}
              iconName={item.url}
              iconNode={item.iconNode}
              onClick={item.onClick}
              isClickable
              isFill
            />
          ))}
        </div>
      ) : null}
      {headerComponent ?? null}
      {isCloseable ? closeIconRender : null}
    </>
  );

  const loaderComponent = (
    <RectangleSkeleton data-testid="loader" height="28" width="100%" />
  );

  useEffect(() => {
    if (!containerRef.current) return;

    if (headerHeight) {
      containerRef.current.style.setProperty(
        "--aside-header-custom-height",
        headerHeight,
      );
    }
  }, [headerHeight]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={classNames(styles.container, className, {
        [styles.withoutBorder]: withoutBorder,
        [styles.customHeaderHeight]: headerHeight,
      })}
      style={style}
      data-testid={dataTestId ?? "aside-header"}
    >
      {isLoading ? loaderComponent : mainComponent}
    </div>
  );
};

export { AsideHeader };
