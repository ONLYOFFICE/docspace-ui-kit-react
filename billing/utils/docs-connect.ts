import {
  DOCS_CONNECT,
  DOCS_CONNECT_DEVPACK_PRODUCT,
  DOCS_CONNECT_PRODUCT,
} from "../constants";

export type TDocsConnectServiceLike = {
  serviceName?: string | null;
  features?: ({ id?: string | null } | null | undefined)[] | null;
};

const hasProduct = (service: TDocsConnectServiceLike, product: string) =>
  (service.features ?? []).some((feature) => feature?.id === product);

export const isDocsConnectDevPackService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_DEVPACK_PRODUCT);

export const isDocsConnectBaseService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_PRODUCT) &&
  !isDocsConnectDevPackService(service);

export const isDocsConnectService = (service: TDocsConnectServiceLike) =>
  hasProduct(service, DOCS_CONNECT_PRODUCT) ||
  isDocsConnectDevPackService(service);

export const findDocsConnectServices = <T extends TDocsConnectServiceLike>(
  services: readonly T[] | null | undefined,
) => ({
  base: (services ?? []).find(isDocsConnectBaseService) ?? null,
  devPack: (services ?? []).find(isDocsConnectDevPackService) ?? null,
});

export const isDocsConnectServiceName = (name?: string | null) => {
  const value = (name ?? "").toLowerCase();

  return (
    value.startsWith(DOCS_CONNECT_PRODUCT) || value.startsWith(DOCS_CONNECT)
  );
};

export type TDocsConnectScheduleInput = {
  hasSubscription: boolean;
  currentUsers: number;
  scheduledUsers: number | null;
  scheduledOnDevPack: boolean;
  nextDevPackEnabled: boolean;
};

export type TDocsConnectScheduleFlags = {
  hasScheduledChange: boolean;
  isCancellation: boolean;
  usersAdjusting: boolean;
  devPackDisabling: boolean;
};

export const getDocsConnectScheduleFlags = ({
  hasSubscription,
  currentUsers,
  scheduledUsers,
  scheduledOnDevPack,
  nextDevPackEnabled,
}: TDocsConnectScheduleInput): TDocsConnectScheduleFlags => {
  const hasScheduledChange = hasSubscription && scheduledUsers != null;
  const isCancellation = hasScheduledChange && scheduledUsers === 0;

  return {
    hasScheduledChange,
    isCancellation,
    usersAdjusting: hasScheduledChange && scheduledUsers !== currentUsers,
    devPackDisabling:
      hasScheduledChange &&
      !isCancellation &&
      scheduledOnDevPack &&
      !nextDevPackEnabled,
  };
};
