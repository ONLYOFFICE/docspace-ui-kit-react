import type { TenantQuotaFeatureDto } from "@onlyoffice/docspace-api-sdk";
import type { TAiToolsPrices, TWalletServiceQuota, TServiceFeatureWithPrice } from "../types";

export const parseAiPrices = (response: unknown): TAiToolsPrices | null =>
  response ? (response as TAiToolsPrices) : null;

export const buildServiceFeatureWithPrice = (service: TWalletServiceQuota) => {
  const feature = service.features?.[0];

  return {
    ...feature,
    price: service.price,
    serviceName: service.serviceName,
  } as TServiceFeatureWithPrice;
};

export const applyServiceQuotaToMap = (
  service: TWalletServiceQuota,
  map: Map<string, TenantQuotaFeatureDto | TServiceFeatureWithPrice>,
): void => {
  const featureWithPrice = buildServiceFeatureWithPrice(service);

  const existingEntry = Array.from(map.entries()).find(
    ([, value]) =>
      (value as TServiceFeatureWithPrice).serviceName === service.serviceName,
  );

  const key = existingEntry
    ? existingEntry[0]
    : (service.features?.[0]?.id?.toString() ?? "");

  map.set(key, featureWithPrice);
};

export const parseServicesQuotasMap = (
  response: unknown,
): Map<string, TenantQuotaFeatureDto | TServiceFeatureWithPrice> => {
  const services = response as TWalletServiceQuota[];

  const map: Map<string, TenantQuotaFeatureDto | TServiceFeatureWithPrice> = new Map();

  services.forEach((service) => applyServiceQuotaToMap(service, map));

  return map;
};

