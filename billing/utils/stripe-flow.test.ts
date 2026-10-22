import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { waitForTopUpCompletion } from "./stripe-flow";

const FIVE_MINUTES = 5 * 60 * 1000;

const createDeps = () => ({
  walletBalance: 0,
  fetchCustomerInfo: vi.fn().mockResolvedValue({ email: "payer@example.com" }),
  fetchBalance: vi.fn().mockResolvedValue(0),
});

describe("waitForTopUpCompletion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("finishes once the purchase is applied although the balance never grows", async () => {
    const deps = createDeps();
    const isPurchaseCompleted = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);

    const completion = waitForTopUpCompletion(
      { ...deps, isPurchaseCompleted },
      new AbortController().signal,
    );
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(completion).resolves.toEqual({
      isDelayedPaymentMethod: false,
    });
    expect(isPurchaseCompleted).toHaveBeenCalledTimes(3);
    expect(deps.fetchBalance).not.toHaveBeenCalled();
  });

  it("times out when the purchase is never applied", async () => {
    const deps = createDeps();
    const isPurchaseCompleted = vi.fn().mockResolvedValue(false);

    const completion = waitForTopUpCompletion(
      { ...deps, isPurchaseCompleted },
      new AbortController().signal,
    );
    const assertion = expect(completion).rejects.toThrow("Polling timeout");
    await vi.advanceTimersByTimeAsync(FIVE_MINUTES + 10_000);

    await assertion;
  });

  it("still waits for a balance increase when no purchase check is given", async () => {
    const deps = createDeps();
    deps.fetchBalance
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValue(30);

    const completion = waitForTopUpCompletion(
      deps,
      new AbortController().signal,
    );
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(completion).resolves.toEqual({
      isDelayedPaymentMethod: false,
    });
    expect(deps.fetchBalance).toHaveBeenCalledTimes(3);
  });

  it("skips waiting for the purchase with a delayed payment method", async () => {
    const deps = createDeps();
    deps.fetchCustomerInfo.mockResolvedValue({
      email: "payer@example.com",
      isDelayedPaymentMethod: true,
    });
    const isPurchaseCompleted = vi.fn();

    await expect(
      waitForTopUpCompletion(
        { ...deps, isPurchaseCompleted },
        new AbortController().signal,
      ),
    ).resolves.toEqual({ isDelayedPaymentMethod: true });
    expect(isPurchaseCompleted).not.toHaveBeenCalled();
  });
});
