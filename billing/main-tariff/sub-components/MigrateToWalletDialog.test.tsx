import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";

import MigrateToWalletDialog from "./MigrateToWalletDialog";

const mocks = vi.hoisted(() => ({
  store: {} as Record<string, unknown>,
  get: vi.fn(),
  post: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../../store/PaymentStoreProvider", () => ({
  usePaymentStore: () => mocks.store,
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => ({
    rawApiClient: { instance: { get: mocks.get, post: mocks.post } },
  }),
}));

vi.mock("../../../components/toast", () => ({
  toastr: { error: mocks.toastError },
}));

vi.mock("../../shared/top-up-balance/sub-components/WalletInfo", () => ({
  default: () => null,
}));

const subscriptionBalance = {
  currency: "USD",
  daysElapsed: 10,
  periodStart: "2026-10-14T00:00:00",
  periodEnd: "2026-11-14T00:00:00",
  periodUsedUntil: "2026-10-22T00:00:00",
  remainingBalance: 50,
  walletCurrency: "USD",
  remainingBalanceInWalletCurrency: 50,
  totalCost: 80,
};

const createStore = () => {
  const format = (value?: number) => `$${value ?? 0}`;

  return {
    formatPaymentCurrency: format,
    formatFuturePaymentCurrency: format,
    formatWalletCurrency: () => "$541.40",
    futureSubscriptionAmount: 100,
    language: "en",
    walletBalance: 541.4,
    walletCodeCurrency: "USD",
    managersCount: 5,
    fetchBalance: vi.fn(),
    paymentQuotas: {
      planCost: { value: 20 },
      futurePlanCost: { value: 20 },
    },
    quotas: {
      maxCountManagersByQuota: 4,
      fetchPortalQuota: vi.fn(),
    },
    tariff: {
      paymentDate: "November 14, 2026",
      daysUntilPayment: 22,
      fetchPortalTariff: vi.fn(),
    },
  };
};

const confirmMigration = async () => {
  const onClose = vi.fn();
  const onMigrated = vi.fn();

  render(
    <MigrateToWalletDialog visible onClose={onClose} onMigrated={onMigrated} />,
  );

  fireEvent.click(screen.getByTestId("migrate_to_wallet_agree_checkbox"));

  const confirm = screen.getByTestId("migrate_to_wallet_confirm_button");
  await waitFor(() => expect(confirm).toBeEnabled());

  fireEvent.click(confirm);

  await waitFor(() => expect(mocks.post).toHaveBeenCalledTimes(1));

  return { onClose, onMigrated, confirm };
};

describe("<MigrateToWalletDialog /> confirm", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createStore();
    mocks.store = store;
    mocks.get.mockResolvedValue({ data: { response: subscriptionBalance } });
  });

  it("moves the selected number of admins and closes after a successful migration", async () => {
    mocks.post.mockResolvedValue({ data: { response: true } });

    const { onClose, onMigrated } = await confirmMigration();

    expect(mocks.post).toHaveBeenCalledWith(
      "api/2.0/portal/payment/subscription/movetowallet",
      { quantity: { adminwallet: 5 } },
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(onMigrated).toHaveBeenCalledTimes(1);
    expect(mocks.toastError).not.toHaveBeenCalled();
    expect(store.tariff.fetchPortalTariff).not.toHaveBeenCalled();
  });

  it.each([
    [
      "the server answers false",
      () => mocks.post.mockResolvedValue({ data: { response: false } }),
    ],
    ["the request fails", () => mocks.post.mockRejectedValue(new Error("500"))],
  ])("keeps the dialog open with an error when %s", async (_, arrange) => {
    arrange();

    const { onClose, onMigrated, confirm } = await confirmMigration();

    await waitFor(() =>
      expect(store.tariff.fetchPortalTariff).toHaveBeenCalledWith(true),
    );
    expect(store.fetchBalance).toHaveBeenCalledWith(true);
    expect(store.quotas.fetchPortalQuota).toHaveBeenCalledWith(true);
    expect(mocks.toastError).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(onMigrated).not.toHaveBeenCalled();
    await waitFor(() => expect(confirm).toBeEnabled());
  });

  it("lets the user retry after a failure with the same number of admins", async () => {
    mocks.post
      .mockResolvedValueOnce({ data: { response: false } })
      .mockResolvedValueOnce({ data: { response: true } });

    const { onClose, onMigrated, confirm } = await confirmMigration();

    await waitFor(() => expect(confirm).toBeEnabled());
    fireEvent.click(confirm);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(onMigrated).toHaveBeenCalledTimes(1);
    expect(mocks.post).toHaveBeenCalledTimes(2);
    expect(mocks.post).toHaveBeenNthCalledWith(
      2,
      "api/2.0/portal/payment/subscription/movetowallet",
      { quantity: { adminwallet: 5 } },
    );
  });
});
