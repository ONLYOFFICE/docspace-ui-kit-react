import { describe, it, expect, vi } from "vitest";
import type { AxiosRequestConfig } from "axios";
import {
  CommonSettingsApi,
  PaymentApi,
  PortalQuotaApi,
  ProfilesApi,
} from "@onlyoffice/docspace-api-sdk";

import { createApiClient } from "../../providers/api/ApiProvider";

import PaymentStore from "./PaymentStore";
import ServicesStore from "./ServicesStore";

vi.mock("@onlyoffice/docspace-api-sdk", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@onlyoffice/docspace-api-sdk")>();

  class MockPaymentApi {
    getCustomerBalance = vi.fn().mockResolvedValue({ data: {} });

    getCustomerInfo = vi.fn().mockResolvedValue({ data: {} });
  }

  class MockApi {}

  return {
    ...original,
    PaymentApi: MockPaymentApi,
    PortalQuotaApi: MockApi,
    ProfilesApi: MockApi,
    CommonSettingsApi: MockApi,
  };
});

type TPendingRequest = {
  url: string;
  respond: (amount: number) => void;
};

const createStores = () => {
  const apiClient = createApiClient("http://localhost", "");
  const pending: TPendingRequest[] = [];

  vi.spyOn(apiClient.instance, "get").mockImplementation(
    (url: string, config?: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        config?.signal?.addEventListener?.("abort", () => {
          const error = new Error("canceled");
          error.name = "CanceledError";
          reject(error);
        });

        pending.push({
          url,
          respond: (amount) =>
            resolve({
              data: {
                response: url.endsWith("/monthly")
                  ? [{ month: "2026-10", totalAmount: amount }]
                  : {
                      collection: [{ service: "backup", totalAmount: amount }],
                    },
              },
            }),
        });
      }),
  );

  const paymentStore = new PaymentStore(
    new PaymentApi(),
    new ProfilesApi(),
    new PortalQuotaApi(),
    new CommonSettingsApi(),
    apiClient,
  );
  const servicesStore = new ServicesStore(
    new PaymentApi(),
    paymentStore,
    apiClient,
  );

  return { servicesStore, pending };
};

const usageRequests = (pending: TPendingRequest[]) =>
  pending.filter(({ url }) => url.includes("customer/usage"));

describe("ServicesStore.initUsageData", () => {
  it("keeps the rows of the latest period when an earlier one answers last", async () => {
    const { servicesStore, pending } = createStores();

    const yearLoad = servicesStore.initUsageData("last12Months");
    await vi.waitFor(() => expect(usageRequests(pending)).toHaveLength(2));
    const [yearUsage, yearMonthly] = usageRequests(pending);

    const monthLoad = servicesStore.initUsageData("thisMonth");
    await vi.waitFor(() => expect(usageRequests(pending)).toHaveLength(4));
    const [, , monthUsage, monthMonthly] = usageRequests(pending);

    monthUsage.respond(11);
    monthMonthly.respond(11);
    yearUsage.respond(999);
    yearMonthly.respond(999);
    await Promise.all([yearLoad, monthLoad]);

    expect(servicesStore.serviceUsage).toEqual([
      { service: "backup", totalAmount: 11 },
    ]);
    expect(servicesStore.serviceUsageMonthly).toEqual([
      { month: "2026-10", totalAmount: 11 },
    ]);
  });
});
