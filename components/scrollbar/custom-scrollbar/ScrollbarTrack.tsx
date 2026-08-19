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

import { cnb } from "cnbuilder";
import React from "react";
import {
  AxisDirection,
  type ElementPropsWithElementRefAndRenderer,
} from "./types";
import { isFun, isUndef, renderDivWithRenderer } from "./util";

export interface ScrollbarTrackClickParameters {
  axis: AxisDirection;
  offset: number;
}

export type ScrollbarTrackProps = ElementPropsWithElementRefAndRenderer & {
  axis: AxisDirection;

  onClick?: (ev: MouseEvent, values: ScrollbarTrackClickParameters) => void;

  ref?: (ref: ScrollbarTrack | null) => void;
};

class ScrollbarTrack extends React.Component<ScrollbarTrackProps, unknown> {
  public element: HTMLDivElement | null = null;

  public componentDidMount(): void {
    if (!this.element) {
      this.setState(() => {
        // throw new Error(
        //   "Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.",
        // );
      });
      return;
    }

    this.element?.addEventListener("click", this.handleClick);
  }

  public componentWillUnmount(): void {
    if (this.element) {
      this.element.removeEventListener("click", this.handleClick);
      this.element = null;

      this.elementRef(null);
    }
  }

  private elementRef = (ref: HTMLDivElement | null): void => {
    if (!ref && this.element) return;
    if (isFun(this.props.elementRef)) this.props.elementRef(ref);
    this.element = ref;
  };

  private handleClick = (ev: MouseEvent) => {
    if (!ev || !this.element || ev.button !== 0) {
      return;
    }

    if (isFun(this.props.onClick) && ev.target === this.element) {
      if (!isUndef(ev.offsetX)) {
        this.props.onClick(ev, {
          axis: this.props.axis,
          offset: this.props.axis === AxisDirection.X ? ev.offsetX : ev.offsetY,
        });
      } else {
        // support for old browsers
        /* istanbul ignore next */
        const rect: ClientRect = this.element.getBoundingClientRect();
        /* istanbul ignore next */
        this.props.onClick(ev, {
          axis: this.props.axis,
          offset:
            this.props.axis === AxisDirection.X
              ? (ev.clientX ||
                  (ev as unknown as TouchEvent).touches[0].clientX) - rect.left
              : (ev.clientY ||
                  (ev as unknown as TouchEvent).touches[0].clientY) - rect.top,
        });
      }
    }

    return true;
  };

  public render(): React.ReactElement<unknown> | null {
    const {
      elementRef,
      axis,
      onClick,

      ...props
    } = this.props as ScrollbarTrackProps;

    props.className = cnb(
      "ScrollbarsCustom-Track",
      axis === AxisDirection.X
        ? "ScrollbarsCustom-TrackX"
        : "ScrollbarsCustom-TrackY",
      props.className,
    );

    if (props.renderer) {
      (props as ScrollbarTrackProps).axis = axis;
    }

    return renderDivWithRenderer(props, this.elementRef);
  }
}

export default ScrollbarTrack;
