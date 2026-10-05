export type TServiceLimitPeriod =
  "None" | "Hour" | "Day" | "Week" | "Month" | "Year" | "ThreeYears";

export type TServiceLimit = {
  id: number;
  serviceName: string;
  participant: string | null;
  amountValue: number | null;
  currency: string | null;
  quantityValue: number | null;
  serviceUnit: string | null;
  period: TServiceLimitPeriod;
  enabled: boolean;
  created: string;
  modified: string;
};

export type TServiceLimitUsage = {
  serviceLimitId: number;
  period: TServiceLimitPeriod;
  periodStart: string;
  periodEnd: string;
  amountValue: number | null;
  amountConsumed: number;
  amountAvailable: number | null;
  currency: string | null;
  quantityValue: number | null;
  quantityConsumed: number;
  quantityAvailable: number | null;
  serviceUnit: string | null;
};

export type TCreateServiceLimitRequest = {
  serviceName: string;
  amountValue: number;
  period: TServiceLimitPeriod;
};

export type TUpdateServiceLimitRequest = {
  id: number;
  amountValue?: number;
  period?: TServiceLimitPeriod;
  enabled?: boolean;
};
