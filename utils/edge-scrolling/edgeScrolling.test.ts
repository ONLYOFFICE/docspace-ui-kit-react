// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

import { clearEdgeScrollingTimer, onEdgeScrolling } from ".";

type ScrollElement = HTMLDivElement & {
  scrollTo: (x: number, y: number) => void;
};

const setViewportHeight = (height: number) =>
  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    value: height,
  });

describe("edge scrolling utils", () => {
  let section: ScrollElement;
  const viewportHeight = 800;

  const createScrollContainer = (scrollTop = 100, scrollHeight = 2000) => {
    const el = document.createElement("div") as ScrollElement;
    el.className = "section-scroll";

    Object.defineProperty(el, "scrollHeight", {
      configurable: true,
      value: scrollHeight,
    });

    Object.defineProperty(el, "scrollTop", {
      configurable: true,
      writable: true,
      value: scrollTop,
    });

    el.scrollTo = vi.fn((_: number, y: number) => {
      el.scrollTop = y;
    }) as unknown as ScrollElement["scrollTo"];

    return el;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    setViewportHeight(viewportHeight);
    section = createScrollContainer();
    document.body.appendChild(section);
  });

  afterEach(() => {
    clearEdgeScrollingTimer();
    vi.clearAllTimers();
    vi.restoreAllMocks();
    section.remove();
  });

  it("does nothing when scroll container is missing", () => {
    section.remove();
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");

    onEdgeScrolling(new MouseEvent("mousemove", { clientY: 10 }));

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it("scrolls upward near the top edge and schedules the next check", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");
    const event = new MouseEvent("mousemove", { clientY: 0 });

    onEdgeScrolling(event);

    expect(section.scrollTo).toHaveBeenCalledWith(0, 50);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30);
  });

  it("scrolls downward near the bottom edge", () => {
    const event = new MouseEvent("mousemove", { clientY: viewportHeight - 1 });

    onEdgeScrolling(event);

    const [, nextScrollY] = (section.scrollTo as unknown as Mock).mock.calls[0];
    expect(nextScrollY).toBeCloseTo(149.75, 2);
  });

  it("does not scroll when already at the top and no more space", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");
    section.remove();
    // recreate container with no scrollable area
    section = createScrollContainer(0, viewportHeight);
    document.body.appendChild(section);

    onEdgeScrolling(new MouseEvent("mousemove", { clientY: 0 }));

    expect(section.scrollTo).not.toHaveBeenCalled();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it("clears the timer when pointer leaves the edge zone", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");

    onEdgeScrolling(new MouseEvent("mousemove", { clientY: 0 }));
    onEdgeScrolling(
      new MouseEvent("mousemove", { clientY: viewportHeight / 2 }),
    );

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  });
});
