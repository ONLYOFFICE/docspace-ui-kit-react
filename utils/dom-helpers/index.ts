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

export default class DomHelpers {
  static calculatedScrollbarWidth: number | null = null;

  static zIndex: number;

  static getViewport() {
    if (typeof window !== "undefined") {
      const win = window;
      const d = document;
      const e = d.documentElement;
      const g = d.getElementsByTagName("body")[0];
      const w = win.innerWidth || e.clientWidth || g.clientWidth;
      const h = win.innerHeight || e.clientHeight || g.clientHeight;

      return { width: w, height: h };
    }
    return { width: 0, height: 0 };
  }

  static getOffset(el?: HTMLElement | null) {
    if (el) {
      const rect = el.getBoundingClientRect();

      return {
        top:
          rect.top +
          (window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0),
        left:
          rect.left +
          (window.pageXOffset ||
            document.documentElement.scrollLeft ||
            document.body.scrollLeft ||
            0),
      };
    }

    return {
      top: "auto",
      left: "auto",
    };
  }

  static getOuterWidth(el: HTMLElement, margin?: string) {
    if (el) {
      let width = el.offsetWidth;

      if (margin) {
        const style = getComputedStyle(el);
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }

      return width;
    }
    return 0;
  }

  static getHiddenElementOuterWidth(elementParam: HTMLElement | null) {
    const element = elementParam;

    if (element) {
      const prevVisibility = element.style.visibility;
      const prevDisplay = element.style.display;

      element.style.visibility = "hidden";
      element.style.display = "block";

      const elementWidth = element.offsetWidth;

      element.style.display = prevDisplay;
      element.style.visibility = prevVisibility;

      return elementWidth;
    }
    return 0;
  }

  static getHiddenElementOuterHeight(elementParam: HTMLElement | null) {
    const element = elementParam;
    if (element) {
      const prevVisibility = element.style.visibility;
      const prevDisplay = element.style.display;

      element.style.visibility = "hidden";
      element.style.display = "block";

      const elementHeight = element.offsetHeight;

      element.style.display = prevDisplay;
      element.style.visibility = prevVisibility;

      return elementHeight;
    }
    return 0;
  }

  static calculateScrollbarWidth(el?: HTMLElement) {
    if (el) {
      const style = getComputedStyle(el);
      return (
        el.offsetWidth -
        el.clientWidth -
        parseFloat(style.borderLeftWidth) -
        parseFloat(style.borderRightWidth)
      );
    }
    if (DomHelpers.calculatedScrollbarWidth != null)
      return this.calculatedScrollbarWidth;

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "p-scrollbar-measure";
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollbarWidth = scrollbarWidth;

    return scrollbarWidth;
  }

  static generateZIndex() {
    this.zIndex = this.zIndex || 1000;

    this.zIndex += 1;

    return this.zIndex;
  }

  static revertZIndex() {
    this.zIndex = this.zIndex > 1000 ? this.zIndex - 1 : 1000;
  }

  static getCurrentZIndex() {
    return this.zIndex;
  }
}
