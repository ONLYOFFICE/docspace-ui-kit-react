import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { PaymentApi } from "@onlyoffice/docspace-api-sdk";

import SimpleTopUpDialog from "./SimpleTopUpDialog";

const mocks = vi.hoisted(() => ({
  openStripeCheckout: vi.fn(),
  waitForTopUpCompletion: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../../utils/stripe-flow", () => ({
  openStripeCheckout: mocks.openStripeCheckout,
  waitForTopUpCompletion: mocks.waitForTopUpCompletion,
}));

vi.mock("../../../components/toast", () => ({
  toastr: { error: mocks.toastError, success: vi.fn() },
}));

vi.mock("./sub-components/Amount", () => ({ default: () => null }));

const renderDialog = (isPurchaseCompleted?: () => Promise<boolean>) => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  render(
    <SimpleTopUpDialog
      visible
      onClose={onClose}
      onConfirm={onConfirm}
      minValue="80"
      isPurchaseCompleted={isPurchaseCompleted}
      paymentApi={new PaymentApi()}
      formatWalletCurrency={() => "$0"}
      walletCodeCurrency="USD"
      fetchBalance={vi.fn().mockResolvedValue(0)}
      walletCustomerStatusNotActive
      isDelayedPaymentMethod={false}
      isStripeCheckoutRequired
      language="en"
      fetchCardLinked={vi.fn()}
      walletBalance={0}
      fetchCustomerInfo={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByTestId("first_topup_continue_to_stripe"));

  return { onClose, onConfirm };
};

describe("<SimpleTopUpDialog /> Stripe flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.openStripeCheckout.mockResolvedValue(undefined);
  });

  it("passes the purchase check to the completion wait and closes once it is applied", async () => {
    const isPurchaseCompleted = vi.fn();
    mocks.waitForTopUpCompletion.mockResolvedValue({
      isDelayedPaymentMethod: false,
    });

    const { onClose } = renderDialog(isPurchaseCompleted);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(mocks.waitForTopUpCompletion).toHaveBeenCalledWith(
      expect.objectContaining({ isPurchaseCompleted }),
      expect.anything(),
    );
    expect(mocks.toastError).not.toHaveBeenCalled();
  });

  it("closes instead of offering another top-up when the purchase wait fails", async () => {
    mocks.waitForTopUpCompletion.mockRejectedValue(
      new Error("Polling timeout"),
    );

    const { onClose, onConfirm } = renderDialog(vi.fn());

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(mocks.toastError).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("stays open after a failed plain top-up so it can be retried", async () => {
    mocks.waitForTopUpCompletion.mockRejectedValue(
      new Error("Polling timeout"),
    );

    const { onClose } = renderDialog();

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledTimes(1));
    expect(onClose).not.toHaveBeenCalled();
  });
});
