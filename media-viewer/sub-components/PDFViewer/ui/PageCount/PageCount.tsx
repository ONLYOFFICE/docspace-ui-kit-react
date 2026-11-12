import React, { useCallback, useImperativeHandle, useState } from "react";
import { isMobile } from "react-device-detect";

import PanelReactSvg from "../../../../../assets/panel.react.svg";
import classNames from "classnames";
import PageCountProps from "./PageCount.props";

import styles from "./PageCount.module.scss";

const PageCount = ({
  ref,
  isPanelOpen,
  visible,
  className,
  setIsOpenMobileDrawer,
}: PageCountProps) => {
  const [pagesCount, setPagesCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    setPagesCount(pagesCountArg: number) {
      setPagesCount(pagesCountArg);
    },
    setPageNumber: (pageNumberArg: number) => {
      setPageNumber(pageNumberArg);
    },
  }));

  const openMobileDrawer = useCallback(() => {
    setIsOpenMobileDrawer(true);
  }, [setIsOpenMobileDrawer]);

  if (!visible) return;

  return (
    <div
      className={classNames(
        styles.pageCountWrapper,
        {
          [styles.isPanelOpen]: isPanelOpen,
          [styles.isMobile]: isMobile,
        },
        className,
      )}
      data-testid="page-count"
      aria-label="Page counter"
    >
      {isMobile ? (
        <PanelReactSvg
          onClick={openMobileDrawer}
          data-testid="mobile-panel-button"
          aria-label="Open mobile panel"
        />
      ) : null}
      <div data-testid="page-numbers">
        <span data-testid="current-page">{pageNumber}</span> /
        <span data-testid="total-pages">{pagesCount}</span>
      </div>
    </div>
  );
};

PageCount.displayName = "PageCount";

export { PageCount };
