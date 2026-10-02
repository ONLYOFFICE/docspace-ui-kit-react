// The demo portal's billing: a cloud portal on the Business plan, paid from
// its wallet, with extra disk storage, AI tools switched on and a card on
// file. Every amount, name and address is made up, and every "payment" link
// goes nowhere.

import { daysAgo } from "../demoPortal";
import { DEMO_PEOPLE, DEMO_SELF } from "./people";

export const CURRENCY = "USD";

const PRICE = { currencySymbol: "$", isoCurrencySymbol: CURRENCY };

const GB = 1024 * 1024 * 1024;

/** Per admin per month on the Business plan. */
export const ADMIN_PRICE = 20;

/** Per admin per year: two months free. */
const ADMIN_PRICE_YEAR = 200;

/** Storage per admin that comes with the plan. */
const STORAGE_PER_ADMIN = 250 * GB;

/** Extra disk storage, per GB per month. */
export const STORAGE_PRICE_PER_GB = 0.1;

/** A backup beyond the plan's free ones. */
export const BACKUP_PRICE = 2;

/** The accounting service's markup on AI usage, in percent. */
const AI_SERVICE_FEE = 20;

/** Where every checkout, card-linking and customer portal link points. */
export const DEMO_PAYMENT_LINK = "#";

/** A date `days` from now, for due dates and renewals. */
export const daysAhead = (days: number, hour = 10) => daysAgo(-days, hour);

/** The day the plan and the storage subscription renew. */
export const RENEWAL_DATE = daysAhead(18, 0);

// Wallet service ids follow `TenantWalletService`; AI search has none there
// yet and the portal knows it as -18.
export const SERVICE_ID = {
  storage: -11,
  backup: -12,
  aitools: -13,
  aisearch: -18,
} as const;

/** The quota id of the plan billed from the wallet. */
const WALLET_TARIFF_ID = -14;

// Feature images are inline SVG the kit injects as markup. They draw in
// `currentColor`, so they follow the theme rather than carrying a colour.
const icon = (paths: string) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;

const ICONS = {
  storage: icon(
    '<ellipse cx="11" cy="6" rx="7" ry="3"/><path d="M4 6v10c0 1.7 3.1 3 7 3M18 6v5M4 11c0 1.7 3.1 3 7 3"/><path d="M16 18h5M18.5 15.5v5"/>',
  ),
  users: icon(
    '<circle cx="8" cy="8" r="3"/><path d="M3 19c0-2.5 2-5 5-5s5 2.5 5 5"/><circle cx="17" cy="9" r="2"/><path d="M16 14h2c2 0 3 1.5 3 3.5"/>',
  ),
  rooms: icon(
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>',
  ),
  branding: icon(
    '<path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3-3.5 3H15a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 21z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
  ),
  sso: icon(
    '<circle cx="12" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M11 8l-5 8M13 8l5 8"/>',
  ),
  backup: icon(
    '<path d="M7 18H6a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 9a4.5 4.5 0 0 1 0 9h-1"/><path d="M12 12v8M9 15l3-3 3 3"/>',
  ),
  restore: icon(
    '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>',
  ),
  audit: icon(
    '<path d="M12 3l8 2.5c0 6-2 12-8 15.5C6 17.5 4 11.5 4 5.5z"/><path d="M9 12l2 2 4-4"/>',
  ),
  integrations: icon(
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
  ),
  statistics: icon('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  ai: icon(
    '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  ),
  search: icon('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>'),
};

// --- The portal's live state, which the write endpoints change -------------

export type DemoBillingState = {
  balance: number;
  admins: number;
  /** A scheduled change of the admin count at renewal; null for none. */
  nextAdmins: number | null;
  /** Extra disk storage in GB; 0 for no subscription. */
  storageGb: number;
  nextStorageGb: number | null;
  services: { aitools: boolean; aisearch: boolean; backup: boolean };
  autoTopUp: {
    enabled: boolean;
    minBalance: number;
    upToBalance: number;
  };
  restrictedModels: string[];
  operations: DemoOperation[];
};

export const createBillingState = (): DemoBillingState => ({
  balance: 148.5,
  admins: 12,
  nextAdmins: null,
  storageGb: 100,
  nextStorageGb: null,
  services: { aitools: true, aisearch: false, backup: true },
  autoTopUp: { enabled: true, minBalance: 20, upToBalance: 100 },
  restrictedModels: ["deepseek-v3.2"],
  operations: createOperations(),
});

// --- Tariff and quotas -----------------------------------------------------

const featureFlags = (on: boolean) =>
  [
    "branding",
    "oauth",
    "backup",
    "aitools",
    "websearch",
    "ldap",
    "restore",
    "audit",
    "thirdparty",
    "statistic",
  ].map((id) => ({ id, value: id === "branding" ? false : on, type: "flag" }));

/** The benefits a plan lists, with the pictures the plan page draws. */
const planBenefits = () => [
  {
    id: "users",
    title: "Unlimited number of users and guests",
    image: ICONS.users,
    value: -1,
    type: "count",
  },
  {
    id: "room",
    title: "Unlimited number of active rooms",
    image: ICONS.rooms,
    value: -1,
    type: "count",
  },
  {
    id: "customization",
    title: "Branding & customization",
    image: ICONS.branding,
    value: true,
    type: "flag",
  },
  { id: "sso", title: "SSO", image: ICONS.sso, value: true, type: "flag" },
  {
    id: "free_backup",
    title: "2 free backups per month",
    image: ICONS.backup,
    value: 2,
    type: "count",
  },
  {
    id: "restore",
    title: "Data recovery",
    image: ICONS.restore,
    value: true,
    type: "flag",
  },
  {
    id: "audit",
    title: "Tracking logins & actions",
    image: ICONS.audit,
    value: true,
    type: "flag",
  },
  {
    id: "thirdparty",
    title: "Pro integrations",
    image: ICONS.integrations,
    value: true,
    type: "flag",
  },
  {
    id: "statistic",
    title: "Storage quotas & statistic",
    image: ICONS.statistics,
    value: true,
    type: "flag",
  },
];

/** A plan on sale: prices per admin, `manager` and `total_size` are steps. */
const purchasableQuota = (id: number, year: boolean, price: number) => ({
  id,
  title: "Business",
  price: { value: price, ...PRICE },
  nonProfit: false,
  free: false,
  trial: false,
  features: [
    { id: "manager", value: 1, type: "count", priceTitle: "Number of admins" },
    {
      id: "total_size",
      title: "250 GB per admin and ability to add space on request",
      image: ICONS.storage,
      value: STORAGE_PER_ADMIN,
      type: "size",
      priceTitle: "Storage space",
    },
    { id: "file_size", title: "Max file size", value: GB, type: "size" },
    { id: "year", value: year, type: "flag" },
    ...featureFlags(true).filter(
      (f) => !["restore", "audit", "thirdparty", "statistic"].includes(f.id),
    ),
    ...planBenefits(),
    { id: "aiagent", value: -1, type: "count" },
  ],
});

/** `portal/payment/quotas`: monthly, yearly and the wallet-billed plan. */
export const paymentQuotas = () => [
  purchasableQuota(-9, false, ADMIN_PRICE),
  purchasableQuota(-10, true, ADMIN_PRICE_YEAR),
  purchasableQuota(WALLET_TARIFF_ID, false, ADMIN_PRICE),
];

/** `portal/payment/quota`: the plan the portal is on, with what it uses. */
export const currentQuota = (state: DemoBillingState) => ({
  id: WALLET_TARIFF_ID,
  title: "Business",
  // The whole plan's monthly price, not the price per admin.
  price: { value: state.admins * ADMIN_PRICE, ...PRICE },
  nonProfit: false,
  free: false,
  trial: false,
  dueDate: RENEWAL_DATE,
  features: [
    {
      id: "manager",
      value: state.admins,
      type: "count",
      used: { value: 9, title: "Admins added:" },
      priceTitle: "Number of admins",
    },
    {
      id: "total_size",
      title: "250 GB per admin and ability to add space on request",
      value: state.admins * STORAGE_PER_ADMIN + state.storageGb * GB,
      type: "size",
      used: { value: Math.round(684.3 * GB), title: "Storage space used:" },
      priceTitle: "Storage space",
    },
    { id: "file_size", title: "Max file size", value: GB, type: "size" },
    { id: "year", value: false, type: "flag" },
    ...featureFlags(true),
    {
      id: "users",
      title: "Unlimited number of users and guests",
      value: -1,
      type: "count",
      used: { value: DEMO_PEOPLE.length + 14 },
    },
    {
      id: "room",
      title: "Unlimited number of active rooms",
      value: -1,
      type: "count",
      used: { value: 37, title: "Rooms:" },
    },
    {
      id: "free_backup",
      title: "2 free backups per month",
      value: 2,
      type: "count",
      used: { value: 1 },
    },
    { id: "customization", value: true, type: "flag" },
    { id: "sso", value: true, type: "flag" },
    { id: "aiagent", value: -1, type: "count", used: { value: 4 } },
  ],
  usersQuota: { enableQuota: false, defaultQuota: 0 },
  roomsQuota: { enableQuota: false, defaultQuota: 0 },
  aiAgentsQuota: { enableQuota: false, defaultQuota: 0 },
  tenantCustomQuota: { enableQuota: false, quota: 0 },
});

const NO_DATE = "0001-01-01T00:00:00.0000000Z";

/** `portal/tariff`: paid, renewing in a few weeks. */
export const tariff = (state: DemoBillingState) => ({
  id: 1,
  // `TariffState.Paid`
  state: 1,
  dueDate: RENEWAL_DATE,
  delayDueDate: NO_DATE,
  licenseDate: NO_DATE,
  customerId: DEMO_SELF.email,
  // The storage flow reads the first wallet quota as its own, so it goes
  // first. `quantity` is GB for storage and admins for the plan.
  quotas: [
    ...(state.storageGb > 0 || state.nextStorageGb !== null
      ? [
          {
            id: SERVICE_ID.storage,
            quantity: state.storageGb,
            wallet: true,
            additional: true,
            dueDate: RENEWAL_DATE,
            nextQuantity: state.nextStorageGb,
            // `QuotaState.Active`
            state: 0,
          },
        ]
      : []),
    {
      id: WALLET_TARIFF_ID,
      quantity: state.admins,
      wallet: true,
      additional: false,
      dueDate: RENEWAL_DATE,
      nextQuantity: state.nextAdmins,
      state: 0,
    },
  ],
  overdueQuotas: [],
});

/** `portal/tariff/upcoming`: what the wallet pays at the next renewal. */
export const upcomingPayments = (state: DemoBillingState) => {
  const admins = state.nextAdmins ?? state.admins;
  const storage = state.nextStorageGb ?? state.storageGb;
  return [
    {
      id: WALLET_TARIFF_ID,
      name: "adminwallet",
      title: "Business plan",
      unitOfMeasure: "Admins",
      quantity: admins,
      wallet: false,
      dueDate: RENEWAL_DATE,
      amount: admins * ADMIN_PRICE,
      currency: CURRENCY,
    },
    ...(storage > 0
      ? [
          {
            id: SERVICE_ID.storage,
            name: "disk-storage",
            title: "Disk storage",
            unitOfMeasure: "GB",
            quantity: storage,
            wallet: true,
            dueDate: RENEWAL_DATE,
            amount: Number((storage * STORAGE_PRICE_PER_GB).toFixed(2)),
            currency: CURRENCY,
          },
        ]
      : []),
  ];
};

/** `settings/payment`: a cloud portal, so not standalone. */
export const paymentSettings = () => ({
  salesEmail: "sales@example.com",
  feedbackAndSupportUrl: null,
  buyUrl: null,
  standalone: false,
  currentLicense: { trial: false, dueDate: RENEWAL_DATE },
  max: 999,
});

// --- Wallet ----------------------------------------------------------------

/** `portal/payment/customerinfo`: the owner pays, with a card on file. */
export const customerInfo = () => ({
  portalId: null,
  // `PaymentMethodStatus.Set`
  paymentMethodStatus: 1,
  paymentMethodType: "card",
  isDelayedPaymentMethod: false,
  email: DEMO_SELF.email,
  payer: {
    id: DEMO_SELF.id,
    displayName: DEMO_SELF.displayName,
    avatar: "",
    avatarSmall: "",
    avatarMax: "",
    avatarMedium: "",
    avatarOriginal: "",
    profileUrl: "",
    hasAvatar: false,
    isAnonim: false,
  },
});

/** `portal/payment/customer/balance`: an object, so the wallet was topped up. */
export const customerBalance = (state: DemoBillingState) => ({
  accountNumber: 100482,
  subAccountNumber: 1,
  accountName: "Northwind Legal Partners",
  accountCurrency: CURRENCY,
  subAccounts: [
    { currency: CURRENCY, amount: Number(state.balance.toFixed(2)) },
  ],
  lastCredit: {
    date: daysAgo(9),
    amount: 100,
    currency: CURRENCY,
  },
});

export const walletSettings = (state: DemoBillingState) => ({
  ...state.autoTopUp,
  currency: CURRENCY,
  lastModified: daysAgo(40),
});

/** `portal/payment/walletservices`, each with the state it is in now. */
export const walletServices = (state: DemoBillingState) => [
  {
    id: SERVICE_ID.aitools,
    serviceName: "ai-tools",
    title: "AI tools",
    price: { value: 0, ...PRICE },
    nonProfit: false,
    free: false,
    trial: false,
    features: [
      {
        id: "aitools",
        title: "AI tools",
        priceTitle: "Pay as you go",
        image: ICONS.ai,
        value: state.services.aitools,
        type: "flag",
      },
    ],
  },
  {
    id: SERVICE_ID.aisearch,
    serviceName: "ai-search",
    title: "AI search",
    price: { value: 0, ...PRICE },
    nonProfit: false,
    free: false,
    trial: false,
    features: [
      {
        id: "aisearch",
        title: "AI search",
        priceTitle: "Web search for AI agents",
        image: ICONS.search,
        value: state.services.aisearch,
        type: "flag",
      },
    ],
  },
  {
    id: SERVICE_ID.backup,
    serviceName: "backup",
    title: "Backup",
    price: { value: BACKUP_PRICE, ...PRICE },
    nonProfit: false,
    free: false,
    trial: false,
    features: [
      {
        id: "backup",
        title: "Backups",
        priceTitle: "Extra backups beyond the plan",
        image: ICONS.backup,
        value: state.services.backup,
        type: "flag",
      },
    ],
  },
  {
    id: SERVICE_ID.storage,
    serviceName: "disk-storage",
    title: "Disk storage",
    price: { value: STORAGE_PRICE_PER_GB, ...PRICE },
    nonProfit: false,
    free: false,
    trial: false,
    features: [
      {
        id: "total_size",
        title: "Disk storage",
        priceTitle: "Extra storage",
        image: ICONS.storage,
        // One step of extra storage, in bytes; the price is per step.
        value: GB,
        type: "size",
      },
    ],
  },
];

/** `portal/payment/activeservices`, for the overview's add-ons block. */
export const activeServices = (state: DemoBillingState) => [
  ...(state.services.aitools
    ? [
        {
          service: "ai-tools",
          serviceUnit: "Tokens",
          subscription: false,
          title: "AI tools",
          limit: 0,
          used: null,
        },
      ]
    : []),
  ...(state.services.backup
    ? [
        {
          service: "backup",
          serviceUnit: "Backups",
          subscription: false,
          title: "Backup",
          limit: 0,
          used: null,
        },
      ]
    : []),
  ...(state.storageGb > 0
    ? [
        {
          service: "disk-storage",
          serviceUnit: "GB",
          subscription: true,
          title: "Disk storage",
          limit: state.storageGb,
          used: 41,
        },
      ]
    : []),
];

/** `portal/payment/accounting/prices/:service`: the fee the kit shows. */
export const accountingPrices = (service: string) => [
  {
    id: 1,
    accountNumber: 100482,
    serviceId:
      service === "ai-search" ? SERVICE_ID.aisearch : SERVICE_ID.aitools,
    timeUnit: "None",
    costPrice: 0,
    extraCharge: AI_SERVICE_FEE,
    servicePrice: 0,
    status: "Approved",
    created: daysAgo(200),
  },
];

/** `portal/payment/ai-prices`, per million tokens. */
export const aiPrices = () => ({
  currency: { code: CURRENCY, symbol: "$" },
  chat: [
    {
      id: "gpt-5",
      alias: "GPT-5",
      provider: "OpenAI",
      image: "",
      price: { prompt: 1.5, completion: 12 },
    },
    {
      id: "claude-sonnet-4.5",
      alias: "Claude Sonnet 4.5",
      provider: "Anthropic",
      image: "",
      price: { prompt: 3.6, completion: 18 },
    },
    {
      id: "gemini-3-flash",
      alias: "Gemini 3 Flash",
      provider: "Google",
      image: "",
      price: { prompt: 0.6, completion: 3.6 },
    },
    {
      id: "deepseek-v3.2",
      alias: "DeepSeek V3.2",
      provider: "DeepSeek",
      image: "",
      price: { prompt: 0.34, completion: 0.5 },
    },
  ],
  embedding: [
    {
      id: "text-embedding-3-small",
      alias: "Text Embedding 3 Small",
      provider: "OpenAI",
      image: "",
      price: { prompt: 0.024 },
    },
  ],
  webSearch: [
    {
      id: "exa",
      alias: "Exa",
      provider: "Exa",
      image: "",
      price: 6,
    },
  ],
});

// --- Transactions ----------------------------------------------------------

export type DemoOperation = {
  date: string;
  service: string;
  description: string;
  details: string | null;
  serviceUnit: string | null;
  quantity: number;
  currency: string;
  credit: number;
  debit: number;
  participantName: string | null;
  participantDisplayName: string | null;
  sourceType: "Agent" | "File" | "Folder" | "Room" | "Form" | null;
  sourceTitle: string | null;
};

const person = (index: number) => DEMO_PEOPLE[index] ?? DEMO_SELF;

const operation = (
  date: string,
  fields: Partial<DemoOperation> & Pick<DemoOperation, "service">,
): DemoOperation => ({
  date,
  description: "",
  details: null,
  serviceUnit: null,
  quantity: 0,
  currency: CURRENCY,
  credit: 0,
  debit: 0,
  participantName: null,
  participantDisplayName: null,
  sourceType: null,
  sourceTitle: null,
  ...fields,
});

/** A wallet top-up by the payer, as `portal/payment/deposit` records it. */
export const topUpOperation = (
  amount: number,
  date = new Date().toISOString(),
) =>
  operation(date, {
    service: "top-up",
    description: "Wallet top-up",
    details: "Card ending in 4242",
    credit: amount,
    participantName: DEMO_SELF.id,
    participantDisplayName: DEMO_SELF.displayName,
  });

const AI_SOURCES: {
  type: NonNullable<DemoOperation["sourceType"]>;
  title: string;
}[] = [
  { type: "Agent", title: "Contract review assistant" },
  { type: "File", title: "Q3 board presentation.pptx" },
  { type: "Room", title: "Client onboarding" },
  { type: "Agent", title: "Support ticket triage" },
  { type: "File", title: "Supplier agreement draft.docx" },
  { type: "Form", title: "Expense claims" },
];

const AI_USERS = [0, 1, 2, 3, 6];

const MODELS = ["GPT-5", "Claude Sonnet 4.5", "Gemini 3 Flash"];

/**
 * What `tokens` cost, in cents that never end in zero: the transaction
 * table prints amounts without trailing zeros, and "-$0.4" next to "-$0.25"
 * looks like a bug in the fixtures rather than the portal.
 */
const tokenCost = (tokens: number) => {
  const cents = Math.max(1, Math.round(tokens * 0.00096));
  return (cents % 10 === 0 ? cents + 1 : cents) / 100;
};

/** About four months of activity, newest first. */
const createOperations = (): DemoOperation[] => {
  const ops: DemoOperation[] = [];

  for (let day = 1; day <= 120; day += 1) {
    // AI usage most days, from a handful of people and sources.
    if (day % 7 !== 0 && day % 7 !== 6) {
      const who = person(AI_USERS[day % AI_USERS.length]);
      const source = AI_SOURCES[day % AI_SOURCES.length];
      const tokens = 18000 + ((day * 7919) % 64000);
      ops.push(
        operation(daysAgo(day, 9 + (day % 8)), {
          service: "ai-tools",
          description: "AI tools",
          details: MODELS[day % MODELS.length],
          serviceUnit: "Tokens",
          quantity: tokens,
          debit: tokenCost(tokens),
          participantName: who.id,
          participantDisplayName: who.displayName,
          sourceType: source.type,
          sourceTitle: source.title,
        }),
      );
    }

    // A paid backup now and then, once the two free ones are used.
    if (day % 11 === 3) {
      ops.push(
        operation(daysAgo(day, 3), {
          service: "backup",
          description: "Backup",
          details: "Scheduled portal backup",
          serviceUnit: "Backups",
          quantity: 1,
          debit: BACKUP_PRICE,
          participantName: person(1).id,
          participantDisplayName: person(1).displayName,
        }),
      );
    }

    // The monthly renewal of the plan and the extra storage.
    if ((day + 12) % 30 === 0) {
      ops.push(
        operation(daysAgo(day, 0), {
          service: "disk-storage",
          description: "Disk storage",
          details: "Monthly renewal",
          serviceUnit: "GB",
          quantity: 100,
          debit: 100 * STORAGE_PRICE_PER_GB,
        }),
        operation(daysAgo(day, 0), {
          service: "adminwallet",
          description: "Business plan",
          details: "Monthly renewal",
          serviceUnit: "Admins",
          quantity: 12,
          debit: 12 * ADMIN_PRICE,
        }),
      );
    }

    // Top-ups: the automatic ones, and one by hand.
    if (day % 16 === 9) {
      const manual = day === 9;
      ops.push({
        ...topUpOperation(manual ? 100 : 80, daysAgo(day, 14)),
        // Automatic top-ups are the wallet's own, so nobody made them.
        ...(manual
          ? {}
          : {
              details: "Automatic",
              participantName: null,
              participantDisplayName: null,
            }),
      });
    }
  }

  return ops.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

const USAGE_META: Record<
  string,
  { title: string; unit: string; price: number; subscription: boolean }
> = {
  "ai-tools": {
    title: "AI tools",
    unit: "Tokens",
    price: 0,
    subscription: false,
  },
  "ai-search": {
    title: "AI search",
    unit: "Requests",
    price: 0,
    subscription: false,
  },
  backup: {
    title: "Backup",
    unit: "Backups",
    price: BACKUP_PRICE,
    subscription: false,
  },
  "disk-storage": {
    title: "Disk storage",
    unit: "GB",
    price: STORAGE_PRICE_PER_GB,
    subscription: true,
  },
  adminwallet: {
    title: "Business plan",
    unit: "Admins",
    price: ADMIN_PRICE,
    subscription: true,
  },
};

/** Spending per service over `ops`, as `portal/payment/customer/usage` sums it. */
export const serviceUsage = (ops: DemoOperation[]) => {
  const byService = new Map<string, DemoOperation[]>();
  for (const op of ops) {
    if (!op.debit || !USAGE_META[op.service]) continue;
    byService.set(op.service, [...(byService.get(op.service) ?? []), op]);
  }
  return [...byService.entries()].map(([service, list]) => {
    const meta = USAGE_META[service];
    return {
      service,
      serviceUnit: meta.unit,
      currency: CURRENCY,
      totalQuantity: list.reduce((sum, op) => sum + op.quantity, 0),
      totalAmount: Number(
        list.reduce((sum, op) => sum + op.debit, 0).toFixed(2),
      ),
      operationCount: list.length,
      title: meta.title,
      price: meta.price,
      subscription: meta.subscription,
    };
  });
};

/** Spending per calendar month, for `customer/usage/monthly`. */
export const monthlyUsage = (ops: DemoOperation[]) => {
  const byMonth = new Map<
    string,
    { year: number; month: number; total: number; count: number }
  >();
  for (const op of ops) {
    if (!op.debit) continue;
    const date = new Date(op.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = byMonth.get(key) ?? {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      total: 0,
      count: 0,
    };
    bucket.total += op.debit;
    bucket.count += 1;
    byMonth.set(key, bucket);
  }
  return [...byMonth.values()]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((bucket) => ({
      year: bucket.year,
      month: bucket.month,
      currency: CURRENCY,
      totalAmount: Number(bucket.total.toFixed(2)),
      operationCount: bucket.count,
    }));
};
