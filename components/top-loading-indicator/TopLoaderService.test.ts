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
