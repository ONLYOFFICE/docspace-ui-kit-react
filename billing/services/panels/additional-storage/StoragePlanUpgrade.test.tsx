import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import StoragePlanUpgrade from "./StoragePlanUpgrade";

type TCompletionDeps = { isPurchaseCompleted?: () => Promise<boolean> };

const mocks = vi.hoisted(() => ({
  paymentStore: {} as Record<string, unknown>,
  servicesStore: {} as Record<string, unknown>,
  isUpgrade: true,
  isDowngrade: false,
  difference: 0,
  openStripeCheckout: vi.fn(),
  waitForTopUpCompletion: vi.fn(),
  topUpDeposit: vi.fn(),
  updateWalletPayment: vi.fn(),
  navigate: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../../../store/PaymentStoreProvider", () => ({
  usePaymentStore: () => mocks.paymentStore,
}));
vi.mock("../../../store/ServicesStoreProvider", () => ({
  useServicesStore: () => mocks.servicesStore,
}));
vi.mock("../../../../providers/api", () => ({
  useApi: () => ({
    paymentApi: {
      topUpDeposit: mocks.topUpDeposit,
      updateWalletPayment: mocks.updateWalletPayment,
    },
  }),
}));
vi.mock("../../../utils/stripe-flow", () => ({
  openStripeCheckout: mocks.openStripeCheckout,
  waitForTopUpCompletion: mocks.waitForTopUpCompletion,
}));
vi.mock("../../../utils/common", () => ({
  calculateTotalPrice: (amount: number, price: number) => amount * price,
  getConvertedSize: (_t: unknown, bytes: number) => `${bytes / 1024 ** 3} GB`,
}));
vi.mock("../../../../components/toast", () => ({
  toastr: { error: mocks.toastError, success: vi.fn() },
}));
vi.mock("react-router", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("../../hooks/useServicesActions", () => ({
  useServicesActions: () => ({
    isExceedingPlanLimit: () => false,
    isCurrentPlan: () => false,
    calculateDifferenceBetweenPlan: () => mocks.difference,
    isWalletBalanceInsufficient: () => true,
    isPlanUpgrade: () => mocks.isUpgrade,
    isPlanDowngrade: () => mocks.isDowngrade,
  }),
}));
vi.mock("../../context/PaymentContext", () => ({
  PaymentProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("./ButtonContainer", () => ({
  default: ({ onBuy }: { onBuy: () => void }) => (
    <button type="button" data-testid="storage_buy" onClick={onBuy}>
      buy
    </button>
  ),
}));
vi.mock("./CurrentSubscription", () => ({ default: () => null }));
vi.mock("./OrderSummary", () => ({ default: () => null }));
vi.mock("./WalletContainer", () => ({ default: () => null }));
vi.mock("./TopUpContainer", () => ({ default: () => null }));
vi.mock("./StorageWarning", () => ({ default: () => null }));
vi.mock("../../../shared/top-up-balance/SimpleTopUpDialogWrapper", () => ({
  default: () => null,
}));
vi.mock("../../../dialogs/SalesDepartmentRequestDialog", () => ({
  default: () => null,
}));

const createStores = (currentStoragePlanSize: number) => {
  const tariff = {
    hasStorageSubscription: currentStoragePlanSize > 0,
    currentStoragePlanSize,
    hasScheduledStorageChange: false,
    fetchPortalTariff: vi.fn(),
    fetchCustomerInfo: vi.fn(),
    isDelayedPaymentMethod: false,
  };

  mocks.paymentStore = {
    tariff,
    fetchBalance: vi.fn(),
    refreshTransactionHistory: vi.fn(),
    storageServiceName: "disk-storage",
    storagePriceIncrement: 0.14,
    formatWalletCurrency: () => "$0.14",
    walletBalance: 0,
    walletCodeCurrency: "USD",
    isPayer: true,
    isStripeCheckoutRequired: true,
    language: "en",
    routes: { diskStorage: "/billing/addons/disk-storage" },
    resetPreviousStorageSubscription: vi.fn(),
    fetchCardLinked: vi.fn(),
  };
  mocks.servicesStore = {
    isVisibleWalletSettings: false,
    partialUpgradeFee: 0,
    featureCountData: 0,
    setPartialUpgradeFee: vi.fn(),
  };

  return tariff;
};

const buyStorage = async (newSize: string) => {
  const onClose = vi.fn();
  render(
    <StoragePlanUpgrade visible onClose={onClose} previousValue={newSize} />,
  );

  await new Promise((resolve) => {
    setTimeout(resolve, 1100);
  });
  fireEvent.click(screen.getByTestId("storage_buy"));

  return onClose;
};

const successParams = () => mocks.openStripeCheckout.mock.calls[0]?.[3];

const completionCheck = () => {
  const deps: TCompletionDeps | undefined =
    mocks.waitForTopUpCompletion.mock.calls[0]?.[0];
  if (!deps?.isPurchaseCompleted) throw new Error("no purchase check");
  return deps.isPurchaseCompleted;
};

describe("<StoragePlanUpgrade /> Stripe purchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.history.pushState({}, "", "/billing/addons/disk-storage");

    mocks.isUpgrade = true;
    mocks.isDowngrade = false;
    mocks.openStripeCheckout.mockResolvedValue(undefined);
    mocks.waitForTopUpCompletion.mockResolvedValue({
      isDelayedPaymentMethod: false,
    });
  });

  it("hands a new subscription to the callback and does not buy it in this tab", async () => {
    createStores(0);
    mocks.difference = 100;

    const onClose = await buyStorage("100");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(successParams()).toMatchObject({
      storageQuantity: "100",
      storageType: String(ProductQuantityType.Add),
    });
    expect(mocks.updateWalletPayment).not.toHaveBeenCalled();
    expect(mocks.topUpDeposit).not.toHaveBeenCalled();
  });

  it("passes only the difference for an upgrade", async () => {
    createStores(100);
    mocks.difference = 100;

    const onClose = await buyStorage("200");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(successParams()).toMatchObject({
      storageQuantity: "100",
      storageType: String(ProductQuantityType.Add),
    });
    expect(mocks.updateWalletPayment).not.toHaveBeenCalled();
  });

  it("closes the panel once after an upgrade", async () => {
    createStores(100);
    mocks.difference = 100;

    const onClose = await buyStorage("200");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("is completed only once the tariff has the selected storage size", async () => {
    const tariff = createStores(0);
    mocks.difference = 100;

    await buyStorage("100");
    await waitFor(() =>
      expect(mocks.waitForTopUpCompletion).toHaveBeenCalled(),
    );

    const isPurchaseCompleted = completionCheck();
    expect(await isPurchaseCompleted()).toBe(false);

    tariff.fetchPortalTariff.mockImplementation(async () => {
      tariff.currentStoragePlanSize = 100;
    });
    expect(await isPurchaseCompleted()).toBe(true);
    expect(tariff.fetchPortalTariff).toHaveBeenCalledWith(true);
  });

  it("closes without buying when the wait for the purchase fails", async () => {
    createStores(100);
    mocks.difference = 100;
    mocks.waitForTopUpCompletion.mockRejectedValue(
      new Error("Polling timeout"),
    );

    const onClose = await buyStorage("200");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.toastError).toHaveBeenCalledTimes(1);
    expect(mocks.updateWalletPayment).not.toHaveBeenCalled();
  });

  it("schedules a downgrade without Stripe checkout or a top-up", async () => {
    const tariff = createStores(200);
    mocks.isUpgrade = false;
    mocks.isDowngrade = true;
    mocks.updateWalletPayment.mockResolvedValue({ data: { response: true } });
    tariff.fetchPortalTariff.mockResolvedValue({
      quotas: [{ quantity: 200, nextQuantity: 100 }],
    });

    const onClose = await buyStorage("100");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.openStripeCheckout).not.toHaveBeenCalled();
    expect(mocks.waitForTopUpCompletion).not.toHaveBeenCalled();
    expect(mocks.topUpDeposit).not.toHaveBeenCalled();
    expect(mocks.updateWalletPayment).toHaveBeenCalledWith({
      walletQuantityRequestDto: {
        quantity: { storage: 100 },
        productQuantityType: ProductQuantityType.Set,
      },
    });
    expect(mocks.toastError).not.toHaveBeenCalled();
  });
});

describe("<StoragePlanUpgrade /> purchase with a linked card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/billing/addons/disk-storage");

    mocks.isUpgrade = true;
    mocks.difference = 100;
    mocks.topUpDeposit.mockResolvedValue({ data: { response: true } });
    mocks.updateWalletPayment.mockResolvedValue({ data: { response: true } });
  });

  it("refreshes the balance and the history after the first purchase", async () => {
    createStores(0);
    mocks.paymentStore.isStripeCheckoutRequired = false;

    const onClose = await buyStorage("100");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.updateWalletPayment).toHaveBeenCalledTimes(1);
    expect(mocks.paymentStore.fetchBalance).toHaveBeenCalled();
    expect(mocks.paymentStore.refreshTransactionHistory).toHaveBeenCalledWith(
      "disk-storage",
    );
  });
});
