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

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MIN_LOADER_TIMER } from "../constants";
import useLoadersHelper from "./useLoadersHelper";

describe("useLoadersHelper", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with visible loaders and an active full load", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    expect(result.current.isFullLoadActive).toBe(true);
    expect(result.current.showBreadCrumbsLoader).toBe(true);
    expect(result.current.showBodyLoader).toBe(true);
    expect(result.current.showSearchLoader).toBe(true);
    expect(result.current.isContentLoading).toBe(false);
  });

  it("starts settled when mounted with preloaded data", () => {
    const { result } = renderHook(() => useLoadersHelper({ withInit: true }));

    expect(result.current.isFullLoadActive).toBe(false);
    expect(result.current.showBreadCrumbsLoader).toBe(false);
    expect(result.current.showBodyLoader).toBe(false);
    expect(result.current.showSearchLoader).toBe(false);
  });

  it("ignores hideSectionLoader while a full load is active", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER);
      result.current.hideSectionLoader("breadcrumbs");
    });

    expect(result.current.showBreadCrumbsLoader).toBe(true);
  });

  it("keeps loaders visible for MIN_LOADER_TIMER after finishFullLoad", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(100);
      result.current.finishFullLoad();
    });

    expect(result.current.isFullLoadActive).toBe(false);
    expect(result.current.showBodyLoader).toBe(true);
    expect(result.current.showBreadCrumbsLoader).toBe(true);

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER - 100);
    });

    expect(result.current.showBodyLoader).toBe(false);
    expect(result.current.showBreadCrumbsLoader).toBe(false);
  });

  it("hides loaders immediately when they were visible long enough", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER);
      result.current.finishFullLoad();
    });

    expect(result.current.showBodyLoader).toBe(false);
    expect(result.current.showBreadCrumbsLoader).toBe(false);
  });

  it("does not dim a repeated full load until the first one completes", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => result.current.startFullLoad());

    expect(result.current.isContentLoading).toBe(false);
  });

  it("dims repeated full loads and undims on finishFullLoad", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER);
      result.current.finishFullLoad();
    });

    act(() => result.current.startFullLoad());
    expect(result.current.isFullLoadActive).toBe(true);
    expect(result.current.isContentLoading).toBe(true);
    // dimming replaces the skeleton on repeated loads
    expect(result.current.showBodyLoader).toBe(false);

    act(() => result.current.finishFullLoad());
    expect(result.current.isFullLoadActive).toBe(false);
    expect(result.current.isContentLoading).toBe(false);
  });

  it("skips dimming when startFullLoad is called with dim: false", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER);
      result.current.finishFullLoad();
    });

    act(() => result.current.startFullLoad({ dim: false }));

    expect(result.current.isFullLoadActive).toBe(true);
    expect(result.current.isContentLoading).toBe(false);
  });

  it("hides a section on hideSectionLoader once the full load is over", () => {
    const { result } = renderHook(() => useLoadersHelper({}));

    act(() => {
      vi.advanceTimersByTime(MIN_LOADER_TIMER);
      result.current.finishFullLoad();
      result.current.startFullLoad({ dim: false });
      result.current.finishFullLoad();
    });

    expect(result.current.showBreadCrumbsLoader).toBe(false);
  });
});
