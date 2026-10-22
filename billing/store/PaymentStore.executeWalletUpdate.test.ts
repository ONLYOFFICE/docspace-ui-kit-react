import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CommonSettingsApi,
  PaymentApi,
  PortalQuotaApi,
  ProductQuantityType,
  ProfilesApi,
} from "@onlyoffice/docspace-api-sdk";

import { createApiClient } from "../../providers/api/ApiProvider";

import PaymentStore from "./PaymentStore";

const server = vi.hoisted(() => ({
  balance: 0,
  depositReplies: [] as ("ok" | "fail")[],
  updateReplies: [] as ("ok" | "false" | "fail")[],
  topUpDeposit: vi.fn(),
  updateWalletPayment: vi.fn(),
  getCustomerBalance: vi.fn(),
}));

vi.mock("@onlyoffice/docspace-api-sdk", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@onlyoffice/docspace-api-sdk")>();

  class MockPaymentApi {
    topUpDeposit = server.topUpDeposit;

    updateWalletPayment = server.updateWalletPayment;

    getCustomerBalance = server.getCustomerBalance;

    getQuotaPaymentInformation = vi.fn().mockResolvedValue({ data: {} });
  }

  class MockPortalQuotaApi {
    getPortalTariff = vi.fn().mockResolvedValue({ data: {} });
  }

  class MockApi {}

  return {
    ...original,
    PaymentApi: MockPaymentApi,
    PortalQuotaApi: MockPortalQuotaApi,
    ProfilesApi: MockApi,
    CommonSettingsApi: MockApi,
  };
});

vi.mock("../../components/toast", () => ({
  toastr: { error: vi.fn(), success: vi.fn() },
}));

const DUE_TODAY = 15;
const t = (key: string) => key;

const createStore = async (balance: number, dueToday = DUE_TODAY) => {
  server.balance = balance;

  const store = new PaymentStore(
    new PaymentApi(),
    new ProfilesApi(),
    new PortalQuotaApi(),
    new CommonSettingsApi(),
    createApiClient("http://localhost", ""),
  );

  await store.fetchBalance();
  store.setTariffDueTodayAmount(dueToday);
  server.getCustomerBalance.mockClear();

  return store;
};

const upgrade = (store: PaymentStore) =>
  store.executeWalletUpdate(1, ProductQuantityType.Add, t);

const depositedAmounts = () =>
  server.topUpDeposit.mock.calls.map(
    ([request]) => request.topUpDepositRequestDto.amount,
  );

describe("PaymentStore.executeWalletUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.depositReplies = [];
    server.updateReplies = [];

    server.getCustomerBalance.mockImplementation(async () => ({
      data: {
        response: {
          subAccounts: [{ amount: server.balance, currency: "USD" }],
        },
      },
    }));
    server.topUpDeposit.mockImplementation(
      async ({ topUpDepositRequestDto }) => {
        if (server.depositReplies.shift() === "fail")
          throw new Error("declined");
        server.balance += topUpDepositRequestDto.amount;
        return { data: { response: true } };
      },
    );
    server.updateWalletPayment.mockImplementation(async () => {
      const reply = server.updateReplies.shift() ?? "ok";
      if (reply === "fail") throw new Error("500");
      if (reply === "false") return { data: { response: false } };
      server.balance -= DUE_TODAY;
      return { data: { response: true } };
    });
  });

  it.each(["fail", "false"] as const)(
    "does not top up again when retrying after updatewallet answered %s",
    async (firstReply) => {
      server.updateReplies = [firstReply, "ok"];
      const store = await createStore(0);

      expect(await upgrade(store)).toBe(false);
      expect(server.getCustomerBalance).toHaveBeenCalledWith(
        { refresh: true },
        expect.anything(),
      );
      expect(store.walletBalance).toBe(DUE_TODAY);

      expect(await upgrade(store)).toBe(true);

      expect(depositedAmounts()).toEqual([DUE_TODAY]);
      expect(server.updateWalletPayment).toHaveBeenCalledTimes(2);
    },
  );

  it("tops up again on retry when the first top-up itself was declined", async () => {
    server.depositReplies = ["fail", "ok"];
    const store = await createStore(0);

    expect(await upgrade(store)).toBe(false);
    expect(store.walletBalance).toBe(0);

    expect(await upgrade(store)).toBe(true);

    expect(depositedAmounts()).toEqual([DUE_TODAY, DUE_TODAY]);
    expect(server.balance).toBe(0);
  });

  it("tops up once and does not refresh the balance twice on success", async () => {
    const store = await createStore(0);

    expect(await upgrade(store)).toBe(true);

    expect(depositedAmounts()).toEqual([DUE_TODAY]);
    expect(server.getCustomerBalance).toHaveBeenCalledTimes(1);
  });

  it("does not top up when the balance already covers the upgrade", async () => {
    const store = await createStore(100);

    expect(await upgrade(store)).toBe(true);

    expect(server.topUpDeposit).not.toHaveBeenCalled();
    expect(server.updateWalletPayment).toHaveBeenCalledTimes(1);
  });

  describe("with a fractional amount due today", () => {
    const tWithValues = (key: string, params?: Record<string, unknown>) =>
      params?.amount ? `${key}: ${params.amount}` : key;

    it("upgrades without a top-up when the balance covers the exact amount", async () => {
      const store = await createStore(10.5, 10.2);

      expect(store.getConfirmButtonLabel(tWithValues)).toBe(
        "PayAndUpgrade: $10.20",
      );
      expect(await upgrade(store)).toBe(true);

      expect(server.topUpDeposit).not.toHaveBeenCalled();
      expect(server.updateWalletPayment).toHaveBeenCalledTimes(1);
    });

    it("rounds only the top-up up to a whole unit", async () => {
      const store = await createStore(10, 10.2);

      expect(store.getConfirmButtonLabel(tWithValues)).toBe("TopUpAndUpgrade");
      expect(await upgrade(store)).toBe(true);

      expect(depositedAmounts()).toEqual([1]);
    });

    it("formats whole amounts without and fractional amounts with cents", async () => {
      const store = await createStore(0);

      expect(store.formatDueTodayAmount(15)).toBe("$15");
      expect(store.formatDueTodayAmount(10.2)).toBe("$10.20");
      expect(store.formatDueTodayAmount(14.74)).toBe("$14.74");
    });
  });
});
