import type { AxiosInstance } from "axios";

import type {
  TCreateServiceLimitRequest,
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitUsage,
  TUpdateServiceLimitRequest,
} from "./types";

const BASE_PATH = "api/2.0/portal/payment/servicelimit";

const PERIOD_BY_CODE: TServiceLimitPeriod[] = [
  "None",
  "Hour",
  "Day",
  "Week",
  "Month",
  "Year",
  "ThreeYears",
];

export const periodToCode = (period: TServiceLimitPeriod): number =>
  Math.max(0, PERIOD_BY_CODE.indexOf(period));

const normalizePeriod = (value: unknown): TServiceLimitPeriod => {
  if (typeof value === "number") return PERIOD_BY_CODE[value] ?? "None";
  if (typeof value === "string") {
    const found = PERIOD_BY_CODE.find(
      (period) => period.toLowerCase() === value.toLowerCase(),
    );
    if (found) return found;
    const code = Number(value);
    if (!Number.isNaN(code)) return PERIOD_BY_CODE[code] ?? "None";
  }
  return "None";
};

const toNullableNumber = (value: unknown): number | null =>
  value === null || value === undefined || value === "" ? null : Number(value);

const normalizeLimit = (raw: Record<string, unknown>): TServiceLimit => ({
  id: Number(raw.id),
  serviceName: String(raw.serviceName ?? ""),
  participant: raw.participant ? String(raw.participant) : null,
  amountValue: toNullableNumber(raw.amountValue),
  currency: raw.currency ? String(raw.currency) : null,
  quantityValue: toNullableNumber(raw.quantityValue),
  serviceUnit: raw.serviceUnit ? String(raw.serviceUnit) : null,
  period: normalizePeriod(raw.period),
  enabled: Boolean(raw.enabled),
  created: String(raw.created ?? ""),
  modified: String(raw.modified ?? ""),
});

const normalizeUsage = (raw: Record<string, unknown>): TServiceLimitUsage => ({
  serviceLimitId: Number(raw.serviceLimitId),
  period: normalizePeriod(raw.period),
  periodStart: String(raw.periodStart ?? ""),
  periodEnd: String(raw.periodEnd ?? ""),
  amountValue: toNullableNumber(raw.amountValue),
  amountConsumed: Number(raw.amountConsumed ?? 0),
  amountAvailable: toNullableNumber(raw.amountAvailable),
  currency: raw.currency ? String(raw.currency) : null,
  quantityValue: toNullableNumber(raw.quantityValue),
  quantityConsumed: Number(raw.quantityConsumed ?? 0),
  quantityAvailable: toNullableNumber(raw.quantityAvailable),
  serviceUnit: raw.serviceUnit ? String(raw.serviceUnit) : null,
});

const isNotFound = (error: unknown): boolean =>
  (error as { response?: { status?: number } })?.response?.status === 404;

const unwrap = <T>(data: unknown): T | null => {
  const body = data as { response?: T } | null | undefined;
  const response = body?.response;
  if (response === null || response === undefined) return null;
  if (typeof response === "object" && Object.keys(response).length === 0)
    return null;
  return response;
};

export const getCustomerServiceLimit = async (
  api: AxiosInstance,
  serviceName: string,
): Promise<TServiceLimit | null> => {
  try {
    const { data } = await api.get(
      `${BASE_PATH}/customer/${encodeURIComponent(serviceName)}`,
    );
    const raw = unwrap<Record<string, unknown>>(data);
    return raw ? normalizeLimit(raw) : null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
};

export const getServiceLimitUsage = async (
  api: AxiosInstance,
  id: number,
): Promise<TServiceLimitUsage | null> => {
  try {
    const { data } = await api.get(`${BASE_PATH}/${id}/usage`);
    const raw = unwrap<Record<string, unknown>>(data);
    return raw ? normalizeUsage(raw) : null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
};

export const createServiceLimit = async (
  api: AxiosInstance,
  request: TCreateServiceLimitRequest,
): Promise<TServiceLimit> => {
  const { data } = await api.post(BASE_PATH, {
    serviceName: request.serviceName,
    amountValue: request.amountValue,
    period: periodToCode(request.period),
  });
  const raw = unwrap<Record<string, unknown>>(data);
  if (!raw) throw new Error("Service limit was not created");
  return normalizeLimit(raw);
};

export const updateServiceLimit = async (
  api: AxiosInstance,
  request: TUpdateServiceLimitRequest,
): Promise<TServiceLimit> => {
  const { data } = await api.put(BASE_PATH, request);
  const raw = unwrap<Record<string, unknown>>(data);
  if (!raw) throw new Error("Service limit was not updated");
  return normalizeLimit(raw);
};
