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

  /**
   * Size of the layout viewport - the box an absolutely positioned element is
   * laid out in. Unlike `getViewport`, which reads `window.innerWidth/Height`
   * (the visual viewport), this is not affected by pinch zoom or by the
   * zoom-to-fit mobile browsers apply, and it excludes the classic scrollbar.
   * Use it to keep overlays on screen; `innerWidth` can be noticeably larger
   * than the layout viewport on mobile browsers.
   */
  static getLayoutViewport() {
    if (typeof window !== "undefined") {
      const e = document.documentElement;
      const g = document.getElementsByTagName("body")[0];

      return {
        width: e?.clientWidth || g?.clientWidth || window.innerWidth || 0,
        height: e?.clientHeight || g?.clientHeight || window.innerHeight || 0,
      };
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
