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
