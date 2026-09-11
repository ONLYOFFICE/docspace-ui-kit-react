import type {
  TenantQuotaFeatureDto,
  Balance,
  CustomerInfoDto,
  QuotaDto,
} from "@onlyoffice/docspace-api-sdk";

/** Feature with a numeric value (e.g. manager count, storage size). */
export type TNumericPaymentFeature = TenantQuotaFeatureDto & { value: number };

/** Feature with a boolean value (e.g. SSO enabled). */
export type TBooleanPaymentFeature = TenantQuotaFeatureDto & { value: boolean };

/** Balance from the wallet API — can be a Balance object, 0, or null. */
export type TBalance = Balance | 0 | null;

/** QuotaDto extended with serviceName (returned by wallet service endpoints). */
export type TWalletServiceQuota = QuotaDto & { serviceName?: string };

/** CustomerInfoDto with the payment method fields the SDK does not declare yet. */
export type TCustomerInfo = CustomerInfoDto & {
  paymentMethodType?: string | null;
  isDelayedPaymentMethod?: boolean;
};

export type TServiceFeatureWithPrice = TNumericPaymentFeature & {
  price: {
    value: number;
    currencySymbol?: string;
  };
  serviceName?: string;
};

export type TDocsConnectCardState = {
  subscribed: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  trialEndingSoon: boolean;
  trialExpired: boolean;
  trialEndDate: string;
  tariffPrice: number;
  tariffUsers: number;
  scheduledUsers: number | null;
  scheduledDate: string;
  nextDevPackEnabled: boolean;
  scheduledOnDevPack: boolean;
  deactivated: boolean;
  canceled: boolean;
};

export type TDocsConnectScheduledChange = {
  nextUsers: number;
  dueDate: string;
  nextDevPackEnabled: boolean;
  scheduledOnDevPack: boolean;
};

export type TDocsConnectPageState = {
  isPaid: boolean;
  expired: boolean;
  daysLeft: number;
  totalDays: number;
  spentPercent: number;
  endDate: string;
  currency: string;
  credits: number;
  planUsers: number;
  pricePerUser: number;
  basePricePerUser: number;
  devPackEnabled: boolean;
  monthlyCharge: number;
  scheduledChange: TDocsConnectScheduledChange | null;
  deactivated: boolean;
  canceled: boolean;
};

type TAiToolsChatPrice = {
  prompt: number;
  completion: number;
};

type TAiToolsEmbeddingPrice = {
  prompt: number;
};

type TAiToolsChatModelPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: TAiToolsChatPrice;
};

type TAiToolsEmbeddingModelPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: TAiToolsEmbeddingPrice;
};

type TAiToolsWebSearchPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: number;
};

export type TAiToolsPrices = {
  currency?: {
    code: string;
    symbol: string;
  };
  chat?: TAiToolsChatModelPrice[];
  image?: TAiToolsChatModelPrice[];
  embedding?: TAiToolsEmbeddingModelPrice[];
  webSearch?: TAiToolsWebSearchPrice[];
};

export type TPaymentUser = {
  id: string;
  email: string;
  isOwner: boolean;
};

export type TUpcomingPaymentActionType = "edit-plan" | "edit-subscription";

export type TUpcomingPayment = {
  id: string;
  renewalDate: string;
  /** Short, localized "month day" date (no year), e.g. "July 1". */
  renewalDateShort: string;
  /** Raw ISO due date, used for filtering (e.g. current month). */
  dueDate: string;
  title: string;
  quantity: number;
  unitOfMeasure: string;
  amount: number;
  actionType?: TUpcomingPaymentActionType;
  actionRoute?: string;
};

export type TUpcomingPaymentResponse = {
  id: number;
  name: string;
  title: string;
  unitOfMeasure: string;
  quantity: number;
  wallet: boolean;
  dueDate: string;
  amount: number;
  currency: string;
};

export type TServiceUsage = {
  service: string;
  serviceUnit: string;
  currency: string;
  totalQuantity: number;
  totalAmount: number;
  operationCount: number;
  title: string;
  /** Per-unit price for the service. */
  price: number;
  /** Whether the service is billed as a recurring subscription. */
  subscription: boolean;
};

/** A single active service from the active-services endpoint. */
export type TActiveService = {
  service: string;
  serviceUnit: string;
  subscription: boolean;
  title: string;
  limit: number;
  used: number | null;
};

/** A price record of a wallet service from the accounting service. */
export type TAccountingPrice = {
  id: number;
  accountNumber: number;
  serviceId: number;
  timeUnit: string;
  costPrice: number;
  /** Markup on top of the cost price, in percent. */
  extraCharge: number;
  servicePrice: number;
  timeBound?: { startDate?: string; endDate?: string };
  status: "Draft" | "Approved" | "Rejected";
  created: string;
};

/** A single month bucket from the monthly usage endpoint. */
export type TServiceUsageMonthly = {
  year: number;
  month: number;
  currency: string;
  totalAmount: number;
  operationCount: number;
};

/** Selectable period for the Usage page spending breakdown. */
export type TUsagePeriodKey =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "last6Months"
  | "last12Months"
  | "thisYear"
  | "lastYear";

export type TPaymentRoutes = {
  portalPayments: string;
  services: string;
  aiServices: string;
  aiSearch: string;
  backup: string;
  diskStorage: string;
  docsConnect?: string;
  wallet?: string;
};

export type TPaymentConfig = {
  language: string;
  routes?: TPaymentRoutes;
  logoText?: string;
  walletHelpUrl?: string;
  user?: TPaymentUser;
  mobileBreakpoint?: number;
  desktopBreakpoint?: number;
  openOnNewPage?: boolean;
  onServicesInit?: () => Promise<unknown>;
};

export type TPaymentNavigationEvent =
  | { action: "open-main-tariff" }
  | { action: "open-wallet" }
  | { action: "open-payment-method" }
  | { action: "open-services" }
  | { action: "open-disk-storage" }
  | { action: "open-ai-services" }
  | { action: "open-backup" };

