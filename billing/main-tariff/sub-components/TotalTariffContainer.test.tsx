import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";

import TotalTariffContainer from "./TotalTariffContainer";

const mocks = vi.hoisted(() => ({
  store: {} as Record<string, unknown>,
  calculateWalletPayment: vi.fn(),
}));

vi.mock("../../store/PaymentStoreProvider", () => ({
  usePaymentStore: () => mocks.store,
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => ({
    paymentApi: { calculateWalletPayment: mocks.calculateWalletPayment },
  }),
}));

vi.mock("./PriceDetailsDialog", () => ({ default: () => null }));

const t = (key: string) => key;

const createStore = () => ({
  totalPrice: 100,
  isNeedRequest: false,
  maxAvailableManagersCount: 999,
  managersCount: 5,
  formatPaymentCurrency: (value: number) => `$${value}`,
  formatDueTodayAmount: (value: number) => `$${value}`,
  tariffDueTodayAmount: null,
  setTariffDueTodayAmount: vi.fn(),
  isTariffDueTodayCalculating: false,
  setIsTariffDueTodayCalculating: vi.fn(),
  needsWalletMigration: false,
  quotas: {
    isYearTariff: false,
    maxCountManagersByQuota: 4,
    isFreeTariff: false,
  },
});

describe("<TotalTariffContainer /> due today", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([10.2, 14.74, 15])(
    "stores the exact amount %s returned by calculatewallet",
    async (amount) => {
      const store = createStore();
      mocks.store = store;
      mocks.calculateWalletPayment.mockResolvedValue({
        data: { response: { amount } },
      });

      render(<TotalTariffContainer t={t} isDisabled={false} />);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      expect(mocks.calculateWalletPayment).toHaveBeenCalledTimes(1);
      expect(store.setTariffDueTodayAmount).toHaveBeenLastCalledWith(amount);
    },
  );
});
