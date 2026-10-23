import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import {
  PaymentMethodStatus,
  ProductQuantityType,
} from "@onlyoffice/docspace-api-sdk";

import PaymentCompletePage from "./PaymentCompletePage";
import {
  BACKUP_REDIRECT_URL,
  DOCS_CONNECT_REDIRECT_URL,
  PaymentFlavor,
  getFlavorContent,
} from "./PaymentCompletePage.utils";
import { DOCS_CONNECT_ROUTE } from "../constants";

const mocks = vi.hoisted(() => ({
  getCustomerInfo: vi.fn(),
  topUpDeposit: vi.fn(),
  changeTenantWalletServiceState: vi.fn(),
  updateWalletPayment: vi.fn(),
}));

vi.mock("../../providers/api", () => ({
  useApi: () => ({ paymentApi: mocks }),
}));

vi.mock("../../components/toast", () => ({
  toastr: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("./sub-components/ProcessingCard", () => ({
  default: () => <div data-testid="processing" />,
}));
vi.mock("./sub-components/DelayedCard", () => ({
  default: () => <div data-testid="delayed" />,
}));
vi.mock("./sub-components/SuccessCard", () => ({
  default: () => <div data-testid="success" />,
}));
vi.mock("./sub-components/ErrorCard", () => ({
  default: () => <div data-testid="error" />,
}));

const STORAGE_CALLBACK =
  "/billing/payment-complete?currency=USD&amount=14&type=wallet&language=en&service=disk-storage&storage=100%20GB&price=14";

const openCallback = (search: string) => {
  window.history.pushState({}, "", search);
  render(<PaymentCompletePage />);
};

const storageUpdates = () =>
  mocks.updateWalletPayment.mock.calls.map(
    ([request]) => request.walletQuantityRequestDto,
  );

describe("<PaymentCompletePage /> storage purchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.getCustomerInfo.mockResolvedValue({
      data: {
        response: {
          paymentMethodStatus: PaymentMethodStatus.Set,
          isDelayedPaymentMethod: false,
        },
      },
    });
    mocks.topUpDeposit.mockResolvedValue({ data: { response: true } });
    mocks.changeTenantWalletServiceState.mockResolvedValue({
      data: { response: true },
    });
    mocks.updateWalletPayment.mockResolvedValue({ data: { response: true } });
  });

  it("buys the storage from the callback after the top-up", async () => {
    openCallback(`${STORAGE_CALLBACK}&storageQuantity=100&storageType=1`);

    await waitFor(
      () => expect(screen.getByTestId("success")).toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
    expect(mocks.topUpDeposit).toHaveBeenCalledTimes(1);
    expect(storageUpdates()).toEqual([
      {
        quantity: { storage: 100 },
        productQuantityType: ProductQuantityType.Add,
      },
    ]);
  });

  it("sets the storage size when the type is not an addition", async () => {
    openCallback(`${STORAGE_CALLBACK}&storageQuantity=300&storageType=0`);

    await waitFor(
      () => expect(screen.getByTestId("success")).toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
    expect(storageUpdates()).toEqual([
      {
        quantity: { storage: 300 },
        productQuantityType: ProductQuantityType.Set,
      },
    ]);
  });

  it("shows the activation error when the storage purchase is refused", async () => {
    mocks.updateWalletPayment.mockResolvedValue({ data: { response: false } });

    openCallback(`${STORAGE_CALLBACK}&storageQuantity=100&storageType=1`);

    await waitFor(() =>
      expect(screen.getByTestId("error")).toBeInTheDocument(),
    );
    expect(screen.queryByTestId("success")).not.toBeInTheDocument();
  });

  it("only tops up for a callback link without a storage quantity", async () => {
    openCallback(STORAGE_CALLBACK);

    await waitFor(
      () => expect(screen.getByTestId("success")).toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
    expect(mocks.topUpDeposit).toHaveBeenCalledTimes(1);
    expect(mocks.updateWalletPayment).not.toHaveBeenCalled();
  });
});

describe("getFlavorContent redirects", () => {
  const t = (key: string) => key;
  const params = { plan: "", service: "", storage: "" };

  it("sends a failed Docs Connect purchase to the billing add-on page", () => {
    const content = getFlavorContent(t, PaymentFlavor.DocsConnect, params);

    expect(content.redirectUrl).toBe(DOCS_CONNECT_ROUTE);
    expect(content.errorRedirectUrl).toBe(DOCS_CONNECT_REDIRECT_URL);
  });

  it("keeps one address for the other flavors", () => {
    const content = getFlavorContent(t, PaymentFlavor.Backup, params);

    expect(content.redirectUrl).toBe(BACKUP_REDIRECT_URL);
    expect(content.errorRedirectUrl).toBeUndefined();
  });
});
