import React, { useState } from "react";
import ViewRowsIcon from "../../../../../assets/view-rows.react.svg";
import ViewTilesIcon from "../../../../../assets/view-tiles.react.svg";
import ArticleShowMenuReactSvgUrl from "../../../../../assets/article-show-menu.react.svg";
import classNames from "classnames";
import { Bookmarks } from "../Bookmarks";
import styles from "../../PDFViewer.module.scss";
import SidebarProps from "./Sidebar.props";

import { useInterfaceDirection } from "../../../../../context/InterfaceDirectionContext";

export const Sidebar = ({
  bookmarks,
  isPanelOpen,
  setIsPDFSidebarOpen,
  navigate,
}: SidebarProps) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const { isRTL } = useInterfaceDirection();
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const closeSidebar = () => setIsPDFSidebarOpen(false);

  return (
    <aside
      className={classNames(styles.sidebarContainer, {
        [styles.isPanelOpen]: isPanelOpen,
      })}
      data-testid="pdf-sidebar"
      aria-label="PDF sidebar"
    >
      <div className={styles.sidebarHeader} data-testid="sidebar-header">
        {bookmarks.length > 0
          ? React.createElement(toggle ? ViewTilesIcon : ViewRowsIcon, {
              onClick: handleToggle,
            })
          : null}
        <ArticleShowMenuReactSvgUrl
          className={styles.hideSidebarIcon}
          onClick={closeSidebar}
          data-interface-dir={isRTL ? "rtl" : "ltr"}
          data-testid="close-sidebar-button"
          aria-label="Close sidebar"
        />
      </div>
      {toggle ? (
        <Bookmarks
          bookmarks={bookmarks}
          navigate={navigate}
          data-testid="bookmarks-component"
        />
      ) : null}
      <section
        id="viewer-thumbnail"
        className={classNames(styles.thumbnails, { [styles.visible]: !toggle })}
        data-testid="viewer-thumbnail"
        aria-label="PDF thumbnails"
      />
    </aside>
  );
};
