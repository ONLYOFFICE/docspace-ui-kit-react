export type TServiceLimitScope = "Total" | "Global" | "Custom";
export type TServiceLimitPeriod = "Day" | "Week" | "Month" | "Lifetime";

export type TServiceLimitUsage = {
  periodStart: string;
  periodEnd: string | null;
  amountConsumed: number;
  amountAvailable: number | null;
  quantityConsumed: number;
  quantityAvailable: number | null;
};

export type TServiceLimit = {
  id: number;
  serviceGroupName: string;
  scope: TServiceLimitScope;
  userId: string | null;
  amountValue: number | null;
  currency: string | null;
  quantityValue: number | null;
  serviceUnit: string | null;
  period: TServiceLimitPeriod;
  periodEnd: string | null;
  usageFrom: string | null;
  enabled: boolean;
  created: string;
  modified: string;
  usage: TServiceLimitUsage | null;
};

export type TCreateServiceLimitRequest = {
  scope: TServiceLimitScope;
  userId?: string;
  amountValue: number;
  period: TServiceLimitPeriod;
};

export type TUpdateServiceLimitRequest = {
  id: number;
  amountValue?: number;
  enabled?: boolean;
};
