import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import UpdatePlanButtonContainer from "./UpdatePlanButtonContainer";

const mockStore = vi.hoisted(() => ({
  current: {} as Record<string, unknown>,
  isPurchaseCompleted: undefined as (() => Promise<boolean>) | undefined,
}));

vi.mock("../../store/PaymentStoreProvider", () => ({
  usePaymentStore: () => mockStore.current,
}));

vi.mock("../../shared/top-up-balance/SimpleTopUpDialogWrapper", () => ({
  default: ({
    onConfirm,
    isPurchaseCompleted,
  }: {
    onConfirm?: () => void;
    isPurchaseCompleted?: () => Promise<boolean>;
  }) => {
    mockStore.isPurchaseCompleted = isPurchaseCompleted;
    return (
      <div
        data-testid="top-up-dialog"
        data-flow={onConfirm ? "instant" : "stripe"}
      />
    );
  },
}));

vi.mock("./MigrateToWalletDialog", () => ({ default: () => null }));
vi.mock("./DowngradePlanButtonContainer", () => ({ default: () => null }));
vi.mock("../../dialogs/ChangePricingPlanDialog", () => ({
  default: () => null,
}));
vi.mock("../../utils/common", () => ({ getConvertedSize: () => "1 TB" }));

const t = (key: string) => key;

const createStore = (overrides: {
  isCardLinkedToPortal?: boolean;
  isCardMissingOrInactive?: boolean;
  walletBalance?: number;
  isFreeTariff?: boolean;
  isNotPaidPeriod?: boolean;
  isDelayedPaymentMethod?: boolean;
}) => {
  const {
    isCardLinkedToPortal = true,
    isCardMissingOrInactive = false,
    walletBalance = 0,
    isFreeTariff = false,
    isNotPaidPeriod = true,
    isDelayedPaymentMethod = false,
  } = overrides;

  return {
    managersCount: 4,
    isLoading: false,
    isLessCountThanAcceptable: false,
    canPayTariff: true,
    totalPrice: 80,
    formatPaymentCurrency: (value: number) => `$${value}`,
    canDowngradeTariff: true,
    fetchBalance: vi.fn(),
    walletBalance,
    tariffDueTodayAmount: null,
    isTariffDueTodayCalculating: false,
    isCardLinkedToPortal,
    allowedStorageSizeByQuota: 0,
    isCardMissingOrInactive,
    needsWalletMigration: false,
    getConfirmButtonLabel: () => "",
    executeWalletUpdate: vi.fn(),
    resetTariffContainerToBasic: vi.fn(),
    quotas: {
      maxCountManagersByQuota: 4,
      currentTariffPlanTitle: "Business",
      fetchPortalQuota: vi.fn(),
      isFreeTariff,
    },
    paymentQuotas: {
      tariffPlanTitle: "Business",
      fetchPaymentQuotas: vi.fn(),
    },
    tariff: {
      fetchPortalTariff: vi.fn(),
      hasScheduledTariffAdminsChange: false,
      isGracePeriod: false,
      isNotPaidPeriod,
      isDelayedPaymentMethod,
    },
  };
};

const renderWithStore = (store: ReturnType<typeof createStore>) => {
  mockStore.current = store;
  render(<UpdatePlanButtonContainer t={t} />);
  return screen.getByTestId("upgrade_plan_button");
};

describe("<UpdatePlanButtonContainer /> repurchase", () => {
  beforeEach(() => {
    mockStore.current = {};
    mockStore.isPurchaseCompleted = undefined;
  });

  it("opens the Stripe top-up instead of charging when a paid quota has no active card", () => {
    const store = createStore({
      isCardLinkedToPortal: true,
      isCardMissingOrInactive: true,
    });
    const button = renderWithStore(store);

    expect(button).toHaveTextContent("TopUpAndUpgrade");

    fireEvent.click(button);

    expect(store.executeWalletUpdate).not.toHaveBeenCalled();
    expect(screen.getByTestId("top-up-dialog")).toHaveAttribute(
      "data-flow",
      "stripe",
    );
  });

  it("tops up and upgrades in place when the card is linked and the balance is short", () => {
    const store = createStore({ walletBalance: 0 });
    const button = renderWithStore(store);

    expect(button).toHaveTextContent("TopUpAndUpgrade");

    fireEvent.click(button);

    expect(store.executeWalletUpdate).toHaveBeenCalledWith(
      4,
      ProductQuantityType.Add,
      t,
    );
    expect(screen.queryByTestId("top-up-dialog")).not.toBeInTheDocument();
  });

  it("upgrades without a top-up when the card is linked and the balance covers the plan", () => {
    const store = createStore({ walletBalance: 100 });
    const button = renderWithStore(store);

    expect(button).toHaveTextContent("UpgradeNow");

    fireEvent.click(button);

    expect(store.executeWalletUpdate).toHaveBeenCalledWith(
      4,
      ProductQuantityType.Add,
      t,
    );
  });

  it("opens the top-up dialog for a delayed payment method with a short balance", () => {
    const store = createStore({ isDelayedPaymentMethod: true });
    const button = renderWithStore(store);

    expect(button).toHaveTextContent("TopUpWallet");

    fireEvent.click(button);

    expect(store.executeWalletUpdate).not.toHaveBeenCalled();
    expect(screen.getByTestId("top-up-dialog")).toHaveAttribute(
      "data-flow",
      "instant",
    );
  });

  it("keeps the Stripe flow for a free tariff without a card", () => {
    const store = createStore({
      isFreeTariff: true,
      isNotPaidPeriod: false,
      isCardLinkedToPortal: false,
      isCardMissingOrInactive: true,
    });
    const button = renderWithStore(store);

    expect(button).toHaveTextContent("TopUpAndUpgrade");

    fireEvent.click(button);

    expect(store.executeWalletUpdate).not.toHaveBeenCalled();
    expect(screen.getByTestId("top-up-dialog")).toHaveAttribute(
      "data-flow",
      "stripe",
    );
  });
});

describe("<UpdatePlanButtonContainer /> Stripe purchase completion", () => {
  const openStripeTopUp = () => {
    const store = createStore({ isCardMissingOrInactive: true });
    fireEvent.click(renderWithStore(store));
    return store;
  };

  const purchaseCheck = () => {
    const check = mockStore.isPurchaseCompleted;
    if (!check) throw new Error("isPurchaseCompleted was not passed");
    return check;
  };

  beforeEach(() => {
    mockStore.current = {};
    mockStore.isPurchaseCompleted = undefined;
  });

  it("is not completed while the portal is still not paid", async () => {
    const store = openStripeTopUp();

    expect(await purchaseCheck()()).toBe(false);

    expect(store.tariff.fetchPortalTariff).toHaveBeenCalledWith(true);
    expect(store.quotas.fetchPortalQuota).toHaveBeenCalledWith(true);
    expect(store.resetTariffContainerToBasic).not.toHaveBeenCalled();
  });

  it("is completed once the refreshed tariff is paid and refreshes the page", async () => {
    const store = openStripeTopUp();
    store.tariff.fetchPortalTariff.mockImplementation(async () => {
      store.tariff.isNotPaidPeriod = false;
    });

    expect(await purchaseCheck()()).toBe(true);

    expect(store.fetchBalance).toHaveBeenCalledWith(true);
    expect(store.paymentQuotas.fetchPaymentQuotas).toHaveBeenCalled();
    expect(store.resetTariffContainerToBasic).toHaveBeenCalled();
  });

  it("is not completed while the quota has fewer admins than selected", async () => {
    const store = openStripeTopUp();
    store.tariff.fetchPortalTariff.mockImplementation(async () => {
      store.tariff.isNotPaidPeriod = false;
    });
    store.quotas.maxCountManagersByQuota = 3;

    expect(await purchaseCheck()()).toBe(false);
  });

  it("is not completed while the quota is still free", async () => {
    const store = openStripeTopUp();
    store.tariff.fetchPortalTariff.mockImplementation(async () => {
      store.tariff.isNotPaidPeriod = false;
    });
    store.quotas.isFreeTariff = true;

    expect(await purchaseCheck()()).toBe(false);
  });
});
