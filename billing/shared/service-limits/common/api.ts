import type { AxiosInstance } from "axios";

import type {
  TCreateServiceLimitRequest,
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitScope,
  TServiceLimitUsage,
  TUpdateServiceLimitRequest,
} from "./types";

const BASE_PATH = "api/2.0/portal/payment/servicelimit";

const PERIODS: TServiceLimitPeriod[] = ["Day", "Week", "Month", "Lifetime"];

const SCOPES: TServiceLimitScope[] = ["Total", "Global", "Custom"];

const normalizeEnum = <T extends string>(
  values: T[],
  value: unknown,
  fallback: T,
): T => {
  if (typeof value === "number") return values[value - 1] ?? fallback;
  if (typeof value === "string") {
    const found = values.find(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );
    if (found) return found;
    const code = Number(value);
    if (!Number.isNaN(code)) return values[code - 1] ?? fallback;
  }
  return fallback;
};

const normalizePeriod = (value: unknown): TServiceLimitPeriod =>
  normalizeEnum(PERIODS, value, "Day");

const normalizeScope = (value: unknown): TServiceLimitScope =>
  normalizeEnum(SCOPES, value, "Total");

const toNullableNumber = (value: unknown): number | null =>
  value === null || value === undefined || value === "" ? null : Number(value);

const toNullableString = (value: unknown): string | null =>
  value === null || value === undefined || value === "" ? null : String(value);

const normalizeUsage = (raw: Record<string, unknown>): TServiceLimitUsage => ({
  periodStart: String(raw.periodStart ?? ""),
  periodEnd: toNullableString(raw.periodEnd),
  amountConsumed: Number(raw.amountConsumed ?? 0),
  amountAvailable: toNullableNumber(raw.amountAvailable),
  quantityConsumed: Number(raw.quantityConsumed ?? 0),
  quantityAvailable: toNullableNumber(raw.quantityAvailable),
});

const normalizeLimit = (raw: Record<string, unknown>): TServiceLimit => ({
  id: Number(raw.id),
  serviceGroupName: String(raw.serviceGroupName ?? ""),
  scope: normalizeScope(raw.scope),
  participant: toNullableString(raw.participant),
  amountValue: toNullableNumber(raw.amountValue),
  currency: toNullableString(raw.currency),
  quantityValue: toNullableNumber(raw.quantityValue),
  serviceUnit: toNullableString(raw.serviceUnit),
  period: normalizePeriod(raw.period),
  usageFrom: toNullableString(raw.usageFrom),
  enabled: Boolean(raw.enabled),
  created: String(raw.created ?? ""),
  modified: String(raw.modified ?? ""),
  usage:
    raw.usage && typeof raw.usage === "object"
      ? normalizeUsage(raw.usage as Record<string, unknown>)
      : null,
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

const getLimit = async (
  api: AxiosInstance,
  path: string,
): Promise<TServiceLimit | null> => {
  try {
    const { data } = await api.get(path);
    const raw = unwrap<Record<string, unknown>>(data);
    return raw ? normalizeLimit(raw) : null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
};

export const getTotalServiceLimit = (
  api: AxiosInstance,
): Promise<TServiceLimit | null> => getLimit(api, `${BASE_PATH}/total`);

export const getGlobalServiceLimit = (
  api: AxiosInstance,
): Promise<TServiceLimit | null> => getLimit(api, `${BASE_PATH}/global`);

export const getServiceLimit = (
  api: AxiosInstance,
  id: number,
): Promise<TServiceLimit | null> => getLimit(api, `${BASE_PATH}/${id}`);

export const createServiceLimit = async (
  api: AxiosInstance,
  request: TCreateServiceLimitRequest,
): Promise<TServiceLimit> => {
  const { data } = await api.post(BASE_PATH, {
    scope: request.scope,
    ...(request.userId ? { userId: request.userId } : {}),
    amountValue: request.amountValue,
    period: request.period,
  });
  const raw = unwrap<Record<string, unknown>>(data);
  if (!raw) throw new Error("Service limit was not created");
  return normalizeLimit(raw);
};

export const updateServiceLimit = async (
  api: AxiosInstance,
  request: TUpdateServiceLimitRequest,
): Promise<TServiceLimit> => {
  const { data } = await api.put(BASE_PATH, {
    id: request.id,
    ...(request.amountValue !== undefined
      ? { amountValue: request.amountValue }
      : {}),
    ...(request.enabled !== undefined ? { enabled: request.enabled } : {}),
  });
  const raw = unwrap<Record<string, unknown>>(data);
  if (!raw) throw new Error("Service limit was not updated");
  return normalizeLimit(raw);
};

export const deleteServiceLimit = async (
  api: AxiosInstance,
  id: number,
): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};
