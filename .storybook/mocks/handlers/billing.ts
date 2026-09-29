import { http, type AnyHandler } from "msw";

import { api, ok } from "../demoPortal";
import {
  ADMIN_PRICE,
  CURRENCY,
  DEMO_PAYMENT_LINK,
  RENEWAL_DATE,
  SERVICE_ID,
  STORAGE_PRICE_PER_GB,
  accountingPrices,
  activeServices,
  aiPrices,
  createBillingState,
  currentQuota,
  customerBalance,
  customerInfo,
  monthlyUsage,
  paymentQuotas,
  paymentSettings,
  serviceUsage,
  tariff,
  topUpOperation,
  upcomingPayments,
  walletServices,
  walletSettings,
  type DemoOperation,
} from "../fixtures/billing";

// One portal per page load: top-ups, service toggles and plan changes stick
// until the preview reloads, so a story reflects what was just done in it.
const state = createBillingState();

type TQuantity = Record<string, number | null> | null | undefined;

type TWalletQuantityBody = {
  quantity?: TQuantity;
  productQuantityType?: number;
};

const readJson = async <T>(request: Request): Promise<T> => {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
};

const toBool = (value: string | null) =>
  value === null ? true : value.toLowerCase() !== "false";

// Query dates come as local `yyyy-MM-ddTHH:mm:ss`, no zone.
const toTime = (value: string | null, fallback: number) => {
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(time) ? fallback : time;
};

/** The operations a `customer/operations` or `customer/usage` query selects. */
const selectOperations = (url: URL): DemoOperation[] => {
  const params = url.searchParams;
  const services = [
    ...params.getAll("ServiceName"),
    ...params.getAll("serviceName"),
  ].filter(Boolean);
  const from = toTime(params.get("StartDate") ?? params.get("startDate"), 0);
  const to = toTime(
    params.get("EndDate") ?? params.get("endDate"),
    Number.POSITIVE_INFINITY,
  );
  const credit = toBool(params.get("Credit") ?? params.get("credit"));
  const debit = toBool(params.get("Debit") ?? params.get("debit"));
  const participant =
    params.get("ParticipantName") ?? params.get("participantName");

  return state.operations.filter((op) => {
    const time = Date.parse(op.date);
    if (time < from || time > to) return false;
    if (services.length && !services.includes(op.service)) return false;
    if (!credit && op.credit > 0) return false;
    if (!debit && op.debit > 0) return false;
    if (
      participant &&
      op.participantName !== participant &&
      op.participantDisplayName !== participant
    )
      return false;
    return true;
  });
};

/** The paged envelope the accounting endpoints answer with. */
const collection = <T>(items: T[], url: URL) => {
  const offset = Number(url.searchParams.get("offset") ?? 0) || 0;
  const limit = Number(url.searchParams.get("limit") ?? 25) || 25;
  return {
    collection: items.slice(offset, offset + limit),
    offset,
    limit,
    totalQuantity: items.length,
    totalPage: Math.max(1, Math.ceil(items.length / limit)),
    currentPage: Math.floor(offset / limit) + 1,
  };
};

// What renewal is left of the month, so a mid-period upgrade costs a share.
const proratedShare = () => {
  const left = Date.parse(RENEWAL_DATE) - Date.now();
  return Math.min(1, Math.max(0, left / (30 * 24 * 60 * 60 * 1000)));
};

const charge = (amount: number, fields: Partial<DemoOperation>) => {
  const debit = Number(amount.toFixed(2));
  if (debit <= 0) return;
  state.balance = Math.max(0, state.balance - debit);
  state.operations.unshift({
    date: new Date().toISOString(),
    service: "adminwallet",
    description: "",
    details: "Prorated charge",
    serviceUnit: null,
    quantity: 0,
    currency: CURRENCY,
    credit: 0,
    debit,
    participantName: null,
    participantDisplayName: null,
    sourceType: null,
    sourceTitle: null,
    ...fields,
  });
};

/** `calculatewallet`: the prorated amount due today for an addition. */
const calculate = (quantity: TQuantity) => {
  const admins = quantity?.adminwallet ?? 0;
  const storage = quantity?.storage ?? 0;
  const full = admins * ADMIN_PRICE + storage * STORAGE_PRICE_PER_GB;
  return {
    operationId: 1,
    amount: Number((full * proratedShare()).toFixed(2)),
    currency: CURRENCY,
    quantity: admins || storage,
  };
};

/**
 * `updatewallet`: `Add` (1) buys more now and charges the prorated share;
 * `Set` (0) schedules the count for the renewal, and `null` drops a
 * scheduled change.
 */
const updateWallet = ({
  quantity,
  productQuantityType,
}: TWalletQuantityBody) => {
  const add = productQuantityType === 1;

  if (quantity && "adminwallet" in quantity) {
    const value = quantity.adminwallet;
    if (add && value) {
      charge(value * ADMIN_PRICE * proratedShare(), {
        service: "adminwallet",
        description: "Business plan",
        serviceUnit: "Admins",
        quantity: value,
      });
      state.admins += value;
      state.nextAdmins = null;
    } else {
      state.nextAdmins = value === state.admins ? null : value;
    }
  }

  if (quantity && "storage" in quantity) {
    const value = quantity.storage;
    if (add && value) {
      charge(value * STORAGE_PRICE_PER_GB * proratedShare(), {
        service: "disk-storage",
        description: "Disk storage",
        serviceUnit: "GB",
        quantity: value,
      });
      state.storageGb += value;
      state.nextStorageGb = null;
    } else if (state.storageGb === 0 && value) {
      // A first subscription starts now whichever way it is asked for.
      state.storageGb = value;
      state.nextStorageGb = null;
    } else {
      state.nextStorageGb = value === state.storageGb ? null : value;
    }
  }

  // No quantity at all is a cancelled scheduled storage change.
  if (!quantity) state.nextStorageGb = null;

  return true;
};

const SERVICE_BY_ENUM: Record<string, keyof typeof state.services | "storage"> =
  {
    aitools: "aitools",
    aisearch: "aisearch",
    backup: "backup",
    storage: "storage",
    [SERVICE_ID.aitools]: "aitools",
    [SERVICE_ID.aisearch]: "aisearch",
    [SERVICE_ID.backup]: "backup",
    [SERVICE_ID.storage]: "storage",
  };

const SERVICE_ID_BY_KEY = {
  aitools: SERVICE_ID.aitools,
  aisearch: SERVICE_ID.aisearch,
  backup: SERVICE_ID.backup,
  storage: SERVICE_ID.storage,
} as const;

const REPORT_UNAVAILABLE = {
  isCompleted: true,
  error: "Reports are not generated on the demo portal.",
};

export const billingHandlers: AnyHandler[] = [
  // Tariff and plans
  http.get(api("portal/tariff"), () => ok(tariff(state))),
  http.get(api("portal/tariff/upcoming"), () => ok(upcomingPayments(state))),
  http.get(api("portal/payment/quota"), () => ok(currentQuota(state))),
  http.get(api("portal/payment/quotas"), () => ok(paymentQuotas())),
  http.get(api("settings/payment"), () => ok(paymentSettings())),

  // Payer and wallet
  http.get(api("portal/payment/customerinfo"), () => ok(customerInfo())),
  http.get(api("portal/payment/customer/balance"), () =>
    ok(customerBalance(state)),
  ),
  http.get(api("portal/payment/topupsettings"), () =>
    ok(walletSettings(state)),
  ),
  http.post(api("portal/payment/topupsettings"), async ({ request }) => {
    const body = await readJson<{
      settings?: {
        enabled?: boolean;
        minBalance?: number;
        upToBalance?: number;
      };
    }>(request);
    const settings = body.settings ?? {};
    state.autoTopUp = {
      enabled: settings.enabled ?? state.autoTopUp.enabled,
      minBalance: settings.minBalance ?? state.autoTopUp.minBalance,
      upToBalance: settings.upToBalance ?? state.autoTopUp.upToBalance,
    };
    return ok(walletSettings(state));
  }),
  http.post(api("portal/payment/deposit"), async ({ request }) => {
    const body = await readJson<{ amount?: number }>(request);
    const amount = Number(body.amount) || 0;
    if (amount > 0) {
      state.balance += amount;
      state.operations.unshift(topUpOperation(amount));
    }
    return ok(true);
  }),

  // Links that would lead to the payment provider lead nowhere here.
  http.get(api("portal/payment/account"), () => ok(DEMO_PAYMENT_LINK)),
  http.get(api("portal/payment/checkoutsetupurl"), () => ok(DEMO_PAYMENT_LINK)),
  http.put(api("portal/payment/url"), () => ok(DEMO_PAYMENT_LINK)),
  http.post(api("portal/payment/request"), () => ok(true)),

  // Plan and storage changes paid from the wallet
  http.put(api("portal/payment/calculatewallet"), async ({ request }) => {
    const body = await readJson<TWalletQuantityBody>(request);
    return ok(calculate(body.quantity));
  }),
  http.put(api("portal/payment/updatewallet"), async ({ request }) =>
    ok(updateWallet(await readJson<TWalletQuantityBody>(request))),
  ),

  // Wallet services
  http.get(api("portal/payment/walletservices"), () =>
    ok(walletServices(state)),
  ),
  http.get(api("portal/payment/walletservice"), ({ request }) => {
    const key =
      SERVICE_BY_ENUM[new URL(request.url).searchParams.get("service") ?? ""];
    const id = key ? SERVICE_ID_BY_KEY[key] : undefined;
    return ok(walletServices(state).find((service) => service.id === id));
  }),
  http.post(api("portal/payment/servicestate"), async ({ request }) => {
    const body = await readJson<{ service?: number; enabled?: boolean }>(
      request,
    );
    const key = SERVICE_BY_ENUM[String(body.service)];
    if (key && key !== "storage") state.services[key] = !!body.enabled;
    // Switching AI tools off takes AI search with it, as on a real portal.
    if (key === "aitools" && !body.enabled) state.services.aisearch = false;
    return ok(true);
  }),
  http.get(api("portal/payment/activeservices"), () =>
    ok(activeServices(state)),
  ),
  http.get(api("portal/payment/accounting/prices/:service"), ({ params }) =>
    ok(accountingPrices(String(params.service))),
  ),
  http.get(api("portal/payment/ai-prices"), () => ok(aiPrices())),
  http.get(api("portal/payment/ai-model/restrictions"), () =>
    ok({ models: state.restrictedModels }),
  ),
  http.put(api("portal/payment/ai-model/restrictions"), async ({ request }) => {
    const body = await readJson<{ models?: string[] }>(request);
    state.restrictedModels = Array.isArray(body.models) ? body.models : [];
    return ok({ models: state.restrictedModels });
  }),

  // Transactions and usage
  http.get(api("portal/payment/customer/operations"), ({ request }) => {
    const url = new URL(request.url);
    return ok(collection(selectOperations(url), url));
  }),
  http.get(api("portal/payment/customer/usage"), ({ request }) => {
    const url = new URL(request.url);
    return ok(collection(serviceUsage(selectOperations(url)), url));
  }),
  http.get(api("portal/payment/customer/usage/monthly"), ({ request }) =>
    ok(monthlyUsage(selectOperations(new URL(request.url)))),
  ),
  // Reports are files a real portal builds; the demo one says it does not.
  http.post(api("portal/payment/customer/operationsreport"), () => ok(true)),
  http.get(api("portal/payment/customer/operationsreport"), () =>
    ok(REPORT_UNAVAILABLE),
  ),
  http.post(api("portal/payment/customer/usage/report"), () => ok(true)),
  http.get(api("portal/payment/customer/usage/report"), () =>
    ok(REPORT_UNAVAILABLE),
  ),
  http.post(api("portal/payment/customer/usage/monthly/report"), () =>
    ok(true),
  ),
  http.get(api("portal/payment/customer/usage/monthly/report"), () =>
    ok(REPORT_UNAVAILABLE),
  ),

  // Backups this month, free and paid
  http.get(api("backup/getbackupscount"), () => ok(4)),
  http.get(api("backup/getbackupscountbypaid"), () => ok({ free: 1, paid: 3 })),
];
