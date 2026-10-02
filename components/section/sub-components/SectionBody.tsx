import React from "react";
import classNames from "classnames";

import { DragAndDrop } from "../../drag-and-drop";

import styles from "../Section.module.scss";
import { SectionBodyProps } from "../Section.types";

import SectionContextMenu from "./SectionContextMenu";

const SectionBody = React.memo(
  ({
    autoFocus = false,
    children,
    onDrop,
    viewAs,
    withScroll = true,

    isDesktop,
    settingsStudio = false,
    getContextModel,
    isIndexEditingMode,
    pathname,
    withoutFooter,
    onDragLeaveEmpty,
    onDragOverEmpty,
    fullHeightBody,
  }: SectionBodyProps) => {
    const focusRef = React.useRef<HTMLDivElement | null>(null);

    const focusSectionBody = React.useCallback(() => {
      if (focusRef.current) focusRef.current.focus({ preventScroll: true });
    }, []);

    const onBodyFocusOut = React.useCallback(
      (e: FocusEvent) => {
        if (e.relatedTarget !== null) return;
        focusSectionBody();
      },
      [focusSectionBody],
    );

    React.useEffect(() => {
      if (!autoFocus) return;

      focusSectionBody();
    }, [autoFocus, pathname, focusSectionBody]);

    React.useEffect(() => {
      if (!autoFocus) return;

      const customScrollbar = document.querySelector(
        "#customScrollBar > .scroll-wrapper > .scroller > .scroll-body",
      );
      customScrollbar?.removeAttribute("tabIndex");

      document.body.addEventListener("focusout", onBodyFocusOut);

      return () => {
        customScrollbar?.setAttribute("tabIndex", "-1");
        document.body.removeEventListener("focusout", onBodyFocusOut);
      };
    }, [autoFocus, onBodyFocusOut]);

    const focusProps = autoFocus
      ? {
          ref: focusRef,
        }
      : {};

    return (
      <DragAndDrop
        className={classNames(
          {
            [styles.dropzone]: true,
            [styles.withScroll]: withScroll,
            [styles.isDesktop]: isDesktop,
            [styles.isRowView]: viewAs === "row",
            [styles.isTile]: viewAs === "tile",
            [styles.isSettingsView]: viewAs === "settings",
            [styles.isProfileView]: viewAs === "profile",
            [styles.isStudio]: settingsStudio,
            [styles.fullHeightBody]: fullHeightBody,
            [styles.common]: true,
          },
          "section-body",
        )}
        onDrop={onDrop}
        onDragOver={onDragOverEmpty}
        onDragLeave={onDragLeaveEmpty}
        isDropZone
      >
        {withScroll ? (
          <div className="section-wrapper">
            <div className="section-wrapper-content" {...focusProps}>
              {children}
              {withoutFooter ? null : (
                <div className={classNames(styles.spacer)} />
              )}
            </div>
          </div>
        ) : (
          <div className="section-wrapper">
            {children}
            {withoutFooter ? null : (
              <div className={classNames(styles.spacer)} />
            )}
          </div>
        )}

        {!isIndexEditingMode && getContextModel ? (
          <SectionContextMenu getContextModel={getContextModel} />
        ) : null}
      </DragAndDrop>
    );
    //   <div
    //     className={classNames(
    //       styles.sectionBody,
    //       {
    //         [styles.withScroll]: withScroll,
    //         [styles.isDesktop]: isDesktop,
    //         [styles.isRowView]: viewAs === "row",
    //         [styles.isTile]: viewAs === "tile",
    //         [styles.isSettingsView]: viewAs === "settings",
    //         [styles.isProfileView]: viewAs === "profile",
    //         [styles.isStudio]: settingsStudio,
    //         [styles.common]: true,
    //       },
    //       "section-body",
    //     )}
    //   >
    //     {withScroll ? (
    //       <div className="section-wrapper">
    //         <div className="section-wrapper-content" {...focusProps}>
    //           {children}
    //           <div className={classNames(styles.spacer, "settings-mobile")} />
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="section-wrapper">{children}</div>
    //     )}
    //     <SectionContextMenu getContextModel={getContextModel} />
    //   </div>
    // );
  },
);

SectionBody.displayName = "SectionBody";

export default SectionBody;
