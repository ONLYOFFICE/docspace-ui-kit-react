import { describe, it, expect, vi, beforeEach } from "vitest";
import { runInAction } from "mobx";
import {
  CommonSettingsApi,
  PaymentApi,
  PortalQuotaApi,
  ProfilesApi,
  type Tariff,
} from "@onlyoffice/docspace-api-sdk";

import type { TApiClient } from "../../providers/api/ApiProvider";

import PaymentStore from "./PaymentStore";

// Every generated API method answers with an empty payload, so walletInit runs
// through without a server; only the raw client below is inspected.
vi.mock("@onlyoffice/docspace-api-sdk", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@onlyoffice/docspace-api-sdk")>();

  class MockApi {
    constructor() {
      return new Proxy(this, {
        get: () => () => Promise.resolve({ data: { response: null } }),
      });
    }
  }

  return {
    ...original,
    PaymentApi: MockApi,
    PortalQuotaApi: MockApi,
    ProfilesApi: MockApi,
    CommonSettingsApi: MockApi,
  };
});

vi.mock("../../components/toast", () => ({
  toastr: { error: vi.fn(), success: vi.fn() },
}));

// TariffState: Paid = 1, NotPaid = 3.
const PAID = 1;
const NOT_PAID = 3;

const PRICES_PATH = "portal/payment/accounting/prices/";

const t = (key: string) => key;

const rawGet = vi.fn((_url: string) =>
  Promise.resolve({ data: { response: [] } }),
);

const priceRequests = () =>
  rawGet.mock.calls
    .map(([url]) => url)
    .filter((url) => url.includes(PRICES_PATH))
    .map((url) => url.slice(url.indexOf(PRICES_PATH) + PRICES_PATH.length))
    .sort();

/**
 * A paid-plan portal (no free or non-profit quota), so the wallet counts the
 * card as linked and walletInit takes the branch that loads the AI fee rates.
 */
const createStore = (tariffState: number) => {
  const store = new PaymentStore(
    new PaymentApi(),
    new ProfilesApi(),
    new PortalQuotaApi(),
    new CommonSettingsApi(),
    { instance: { get: rawGet } } as unknown as TApiClient,
  );

  runInAction(() => {
    store.tariff.portalTariffStatus = { state: tariffState } as Tariff;
  });

  return store;
};

describe("PaymentStore.walletInit", () => {
  beforeEach(() => {
    rawGet.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("loads the AI fee rates on a paid portal", async () => {
    const store = createStore(PAID);

    await store.walletInit(t, "");

    expect(store.isCardLinkedToPortal).toBe(true);
    expect(priceRequests()).toEqual(["ai-search", "ai-tools", "ai-tools-byok"]);
  });

  it("does not ask for the AI fee rates on an unpaid portal", async () => {
    const store = createStore(NOT_PAID);

    await store.walletInit(t, "");

    expect(store.isCardLinkedToPortal).toBe(true);
    expect(priceRequests()).toEqual([]);
  });
});
