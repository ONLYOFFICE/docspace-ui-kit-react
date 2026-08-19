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
