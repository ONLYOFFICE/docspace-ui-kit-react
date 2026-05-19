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
import isEqual from "lodash/isEqual";

import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { SectionContextMenuProps } from "../Section.types";

const areEqual = (
  prevProps: SectionContextMenuProps,
  nextProps: SectionContextMenuProps,
) => {
  return isEqual(prevProps, nextProps);
};

const SectionContextMenu = React.memo(
  ({ getContextModel }: SectionContextMenuProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const cmRef = React.useRef<ContextMenuRefType>(null);

    const onHide = () => {
      setIsOpen(false);
    };

    const onContextMenu = React.useCallback(
      (e: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        const bodyElem = document.getElementsByClassName(
          "section-body",
        )[0] as HTMLDivElement;

        const target = e.target as Node;

        if (
          !getContextModel ||
          !getContextModel() ||
          !bodyElem ||
          !bodyElem.contains(target)
        )
          return;

        e.stopPropagation();
        e.preventDefault();

        // if (cmRef.current) cmRef.current.toggle(e);
        if (cmRef.current) {
          if (!isOpen) cmRef?.current?.show(e);
          else cmRef?.current?.hide(e);
          setIsOpen(!isOpen);
        }
      },
      [getContextModel, isOpen],
    );

    React.useEffect(() => {
      document.addEventListener("contextmenu", onContextMenu);

      return () => {
        document.removeEventListener("contextmenu", onContextMenu);
      };
    }, [onContextMenu]);

    return (
      <ContextMenu
        ref={cmRef}
        onHide={onHide}
        getContextModel={getContextModel}
        withBackdrop
        model={[]}
      />
    );
  },
  areEqual,
);
SectionContextMenu.displayName = "SectionContextMenu";

export default SectionContextMenu;
