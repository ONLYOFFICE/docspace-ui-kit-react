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
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { TopLoaderService as TopLoaderServiceType } from "./index";

describe("TopLoaderService", () => {
  let mockElement: HTMLElement;
  let TopLoaderService: typeof TopLoaderServiceType;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();

    const module = await import("./index");
    TopLoaderService = module.TopLoaderService;

    mockElement = document.createElement("div");
    mockElement.id = "ipl-progress-indicator";
    mockElement.style.width = "0%";
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    if (TopLoaderService) TopLoaderService.cancel();
    if (document.body.contains(mockElement)) {
      document.body.removeChild(mockElement);
    }
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should initialize with correct attributes", () => {
    TopLoaderService.start();
    expect(mockElement.getAttribute("role")).toBe("progressbar");
    expect(mockElement.getAttribute("aria-valuemin")).toBe("0");
    expect(mockElement.getAttribute("aria-valuemax")).toBe("100");
    expect(mockElement.getAttribute("data-test-id")).toBe("top-loader");
  });

  it("should progress linearly to 50% within the first second", () => {
    TopLoaderService.start();

    vi.advanceTimersByTime(500);
    expect(mockElement.style.width).toBe("25%");

    vi.advanceTimersByTime(500);
    expect(mockElement.style.width).toBe("50%");
  });

  it("should increase by 10% steps after the first second", () => {
    TopLoaderService.start();

    vi.advanceTimersByTime(1000);

    vi.advanceTimersByTime(50);
    expect(mockElement.style.width).toBe("60%");

    vi.advanceTimersByTime(1000);
    expect(mockElement.style.width).toBe("70%");
  });

  it("should cap at 90% and not exceed it automatically", () => {
    TopLoaderService.start();

    vi.advanceTimersByTime(10000);

    expect(mockElement.style.width).toBe("90%");
  });

  it("should animate to completion when end() is called", () => {
    TopLoaderService.start();
    vi.advanceTimersByTime(500);
    expect(mockElement.style.width).toBe("25%");

    TopLoaderService.end();

    vi.advanceTimersByTime(50);
    const widthVal = parseFloat(mockElement.style.width || "0");
    expect(widthVal).toBeGreaterThan(25);
    expect(widthVal).toBeLessThan(100);

    // End animation takes 1000ms to complete, then resets to 0px
    vi.advanceTimersByTime(1000);
    expect(mockElement.style.width).toBe("0px");
  });

  it("should reset immediately when cancel() is called", () => {
    TopLoaderService.start();
    vi.advanceTimersByTime(500);

    TopLoaderService.cancel();

    expect(mockElement.style.width).toBe("0px");
    expect(mockElement.getAttribute("aria-valuenow")).toBe("0");
  });

  it("should handle restart correctly after cancel", () => {
    TopLoaderService.start();
    vi.advanceTimersByTime(1000);

    TopLoaderService.cancel();
    expect(mockElement.style.width).toBe("0px");

    TopLoaderService.start();
    vi.advanceTimersByTime(500);
    expect(mockElement.style.width).toBe("25%");
  });
});
