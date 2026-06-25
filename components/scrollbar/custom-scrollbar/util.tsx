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

import * as React from "react";
import { ElementPropsWithElementRefAndRenderer, ElementRef } from "./types";

let doc: Document | null = typeof document === "object" ? document : null;

export const isBrowser =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  typeof document !== "undefined";

export const isUndef = (v: unknown): v is Exclude<typeof v, undefined> => {
  return typeof v === "undefined";
};

export const isFun = (v: unknown): v is CallableFunction => {
  return typeof v === "function";
};

export const isNum = (v: unknown): v is number => {
  return typeof v === "number";
};

/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */
export const renderDivWithRenderer = (
  props: ElementPropsWithElementRefAndRenderer,
  elementRef: ElementRef,
): React.ReactElement | null => {
  if (isFun(props.renderer)) {
    props.elementRef = elementRef;

    const { renderer } = props;

    delete props.renderer;

    // @ts-expect-error error from custom scrollbar
    return renderer(props);
  }

  delete props.elementRef;

  return <div {...props} key={props.key} ref={elementRef} />;
};

const getInnerSize = (
  el: HTMLElement,
  dimension: string,
  padding1: string,
  padding2: string,
): number => {
  const styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return Math.max(
      0, // @ts-expect-error error from custom scrollbar
      (Number.parseFloat(styles[dimension] as string) || 0) -
        // @ts-expect-error error from custom scrollbar
        (Number.parseFloat(styles[padding1] as string) || 0) -
        // @ts-expect-error error from custom scrollbar
        (Number.parseFloat(styles[padding2] as string) || 0),
    );
  }
  // @ts-expect-error error from custom scrollbar
  return Number.parseFloat(styles[dimension] as string) || 0;
};

/**
 * @description Return element's height without padding
 */
export const getInnerHeight = (el: HTMLElement): number => {
  return getInnerSize(el, "height", "paddingTop", "paddingBottom");
};

/**
 * @description Return element's width without padding
 */
export const getInnerWidth = (el: HTMLElement): number => {
  return getInnerSize(el, "width", "paddingLeft", "paddingRight");
};

/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */
export const calcThumbSize = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  minimalSize?: number,
  maximalSize?: number,
): number => {
  if (viewportSize >= contentSize) {
    return 0;
  }

  let thumbSize = (viewportSize / contentSize) * trackSize;

  if (isNum(maximalSize)) {
    thumbSize = Math.min(maximalSize, thumbSize);
  }
  if (isNum(minimalSize)) {
    thumbSize = Math.max(minimalSize, thumbSize);
  }

  return thumbSize;
};

/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */
export const calcThumbOffset = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  scroll: number,
): number => {
  if (!scroll || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return ((trackSize - thumbSize) * scroll) / (contentSize - viewportSize);
};

/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */
export const calcScrollForThumbOffset = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  thumbOffset: number,
): number => {
  if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return (thumbOffset * (contentSize - viewportSize)) / (trackSize - thumbSize);
};

/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export const _dbgSetDocument = (v: Document | null): Document | null => {
  if (v === null || v instanceof HTMLDocument) {
    doc = v;
    return doc;
  }

  throw new TypeError(
    `override value expected to be an instance of HTMLDocument or null, got ${typeof v}`,
  );
};

/**
 * @description Return current document node
 */
export const _dbgGetDocument = (): Document | null => doc;

interface GetScrollbarWidthFN {
  _cache?: number;

  (force?: boolean): number | undefined;
}

/**
 * @description Returns scrollbar width specific for current environment. Can return undefined if DOM is not ready yet.
 */
export const getScrollbarWidth: GetScrollbarWidthFN = (
  force = false,
): number | undefined => {
  if (!doc) {
    getScrollbarWidth._cache = 0;

    return getScrollbarWidth._cache;
  }

  if (!force && !isUndef(getScrollbarWidth._cache)) {
    return getScrollbarWidth._cache as number;
  }

  const el = doc.createElement("div");
  el.setAttribute(
    "style",
    "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;",
  );

  doc.body.append(el);

  /* istanbul ignore next */
  if (el.clientWidth === 0) {
    // Do not even cache this value because there is no calculations. Issue https://github.com/xobotyi/react-scrollbars-custom/issues/123
    el.remove();
    return;
  }
  getScrollbarWidth._cache = 100 - el.clientWidth;
  el.remove();

  return getScrollbarWidth._cache;
};

interface ShouldReverseRtlScroll {
  _cache?: boolean;

  (force?: boolean): boolean;
}

/**
 * @description Detect need of horizontal scroll reverse while RTL.
 */
export const shouldReverseRtlScroll: ShouldReverseRtlScroll = (
  force = false,
): boolean => {
  if (!force && !isUndef(shouldReverseRtlScroll._cache)) {
    return shouldReverseRtlScroll._cache as boolean;
  }

  if (!doc) {
    shouldReverseRtlScroll._cache = false;

    return shouldReverseRtlScroll._cache;
  }

  const el = doc.createElement("div");
  const child = doc.createElement("div");

  el.append(child);

  el.setAttribute(
    "style",
    "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;direction:rtl",
  );
  child.setAttribute("style", "width:1000px;height:1000px");

  doc.body.append(el);

  el.scrollLeft = -50;
  shouldReverseRtlScroll._cache = el.scrollLeft === -50;

  el.remove();

  return shouldReverseRtlScroll._cache;
};
