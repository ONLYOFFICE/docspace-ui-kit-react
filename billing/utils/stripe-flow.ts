import { isIOS } from "react-device-detect";

import { toAbsoluteUrl } from "./url";

export const PAYMENT_CALLBACK_PATH = "/billing/payment-complete";

const POLL_INITIAL_INTERVAL_MS = 2000;
const POLL_MAX_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export type TPollOptions = {
  initialIntervalMs?: number;
  maxIntervalMs?: number;
  timeoutMs?: number;
};

export const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

export const pollUntil = async (
  check: () => Promise<boolean>,
  signal: AbortSignal,
  options?: TPollOptions,
) => {
  const {
    initialIntervalMs = POLL_INITIAL_INTERVAL_MS,
    maxIntervalMs = POLL_MAX_INTERVAL_MS,
    timeoutMs = POLL_TIMEOUT_MS,
  } = options ?? {};

  const startedAt = Date.now();
  let interval = initialIntervalMs;
  while (!signal.aborted) {
    if (await check()) return;
    if (signal.aborted) return;
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Polling timeout");
    }
    await sleep(interval, signal);
    interval = Math.min(interval * 2, maxIntervalMs);
  }
};

export type TStripeCheckoutDeps = {
  walletCodeCurrency: string;
  language: string;
  fetchCardLinked: (
    backUrl?: string,
    successUrl?: string,
  ) => Promise<string | null | undefined>;
};

export const openStripeCheckout = async (
  { walletCodeCurrency, language, fetchCardLinked }: TStripeCheckoutDeps,
  amount: string,
  service?: string,
  successParams?: Record<string, string>,
) => {
  const useSameTab = isIOS;

  const currency = walletCodeCurrency || "USD";
  const lang = language || "en";
  const backUrl = `${window.location.origin}${window.location.pathname}`;

  const serviceParam = service ? `&service=${service}` : "";
  const extraParams = successParams
    ? Object.entries(successParams)
        .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
        .join("")
    : "";
  const successUrl = `${window.location.origin}${PAYMENT_CALLBACK_PATH}?currency=${currency}&amount=${amount}&type=wallet&language=${lang}${serviceParam}${extraParams}`;

  const linkUrl = await fetchCardLinked(backUrl, successUrl);

  if (!linkUrl) throw new Error("Missing Stripe checkout URL");

  const checkoutUrl = toAbsoluteUrl(linkUrl);

  if (useSameTab) window.location.href = checkoutUrl;
  else window.open(checkoutUrl, "_blank");
};

export type TTopUpCompletionDeps = {
  walletBalance: number;
  fetchCustomerInfo: (refresh?: boolean) => Promise<string | null | undefined>;
  fetchBalance: (isRefresh?: boolean) => Promise<number>;
};

export const waitForTopUpCompletion = async (
  {
    walletBalance: initialBalance,
    fetchCustomerInfo,
    fetchBalance,
  }: TTopUpCompletionDeps,
  signal: AbortSignal,
) => {
  await pollUntil(async () => {
    const email = await fetchCustomerInfo(true);
    return !!email;
  }, signal);

  await pollUntil(async () => {
    const newBalance = await fetchBalance(true);
    return newBalance > initialBalance;
  }, signal);
};

