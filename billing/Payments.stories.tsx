// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { withPaymentsSetup } from "./storybook-helpers/decorators/withPaymentsSetup";
import { Toast } from "../components/toast";

import PaymentDashboard from "./main-tariff";
import PaymentWallet from "./wallet";
import PaymentMethod from "./payment-method";
import PaymentServicesList from "./services";
import AiPage from "./services/pages/ai-tools/AiPage";
import BackupPage from "./services/pages/backup/BackupPage";
import AdditionalStoragePage from "./services/pages/additional-storage/AdditionalStoragePage";
import PaymentsLoader from "./loader";
import WalletLoader from "./wallet/WalletLoader";
import PaymentMethodLoader from "./payment-method/PaymentMethodLoader";
import ServicesLoader from "./services/ServicesLoader";
import AiPageLoader from "./services/pages/ai-tools/AiPageLoader";
import BackupPageLoader from "./services/pages/backup/BackupPageLoader";
import AdditionalStoragePageLoader from "./services/pages/additional-storage/AdditionalStoragePageLoader";

import styles from "./Payments.stories.module.scss";

const meta: Meta = {
  title: "Components/Billing",
  decorators: [
    (Story) => (
      <div className={styles.storyWrapper}>
        <Toast />
        <Story />
      </div>
    ),
    withPaymentsSetup,
  ],
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Payments is the complete billing and subscription management system for DocSpace SaaS. It consists of four self-contained pages, each handling a specific area of payment operations, all sharing a common store layer provided by \`PaymentsRoot\`.

### Architecture

All pages must be wrapped in \`PaymentsRoot\`, which initializes \`PaymentStore\` and \`ServicesStore\` via React context. The stores handle all API communication, caching, and reactive state — pages are pure observers.

\`\`\`
PaymentsRoot (config)
  \u251C\u2500 PaymentStoreProvider  \u2192 tariff, quotas, balance, payer info
  \u2514\u2500 ServicesStoreProvider  \u2192 AI tools, backup, storage services
       \u2514\u2500 <Page />           \u2192 Main Tariff | Wallet | Method | Services
\`\`\`

### Pages

| Page | Component | Description |
|------|-----------|-------------|
| **Main Tariff** | \`PaymentDashboard\` | Current plan, pricing slider, upgrade/downgrade |
| **Wallet** | \`PaymentWallet\` | Portal wallet for paying services, top-up, transaction history |
| **Payment Method** | \`PaymentMethod\` | Payer info, linked card, Stripe portal |
| **Services** | \`PaymentServicesList\` | AI tools, backup, disk storage toggles |

### Shared components

Reusable building blocks used across pages:

- **BalanceAmount** \u2014 locale-aware currency display with refresh
- **CardInformation** \u2014 linked card status with active/warning states
- **PayerInformation** \u2014 payer avatar, email, Stripe management
- **TransactionHistory** \u2014 filterable transaction table with report export
- **TopUpModal** \u2014 wallet deposit with amount input and auto-payment setup

### Usage

\`\`\`tsx
import {
  PaymentsRoot,
  PaymentDashboard,
  PaymentWallet,
  PaymentMethod,
  PaymentServicesList,
} from "@docspace/ui-kit/billing";

// Wrap any payment page in PaymentsRoot
<PaymentsRoot config={{
  language: "en",
  routes: {
    portalPayments: "/portal-settings/payments",
    services: "/portal-settings/payments/services",
    aiServices: "/portal-settings/payments/services/ai",
    backup: "/portal-settings/payments/services/backup",
    diskStorage: "/portal-settings/payments/services/disk-storage",
  },
}}>
  <PaymentDashboard />
</PaymentsRoot>
\`\`\`

### Configuration

\`PaymentsRoot\` accepts a \`TPaymentConfig\`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| \`language\` | \`string\` | Yes | Locale code (e.g. \`"en"\`) |
| \`routes\` | \`TPaymentRoutes\` | Yes | Navigation routes for all payment pages |
| \`logoText\` | \`string\` | No | Organization name shown in dialogs |
| \`user\` | \`TPaymentUser\` | No | Current user; if omitted, fetched from API |
`,
      },
    },
  },
};

export default meta;

// ── Main Tariff ──

export const MainTariff: StoryObj = {
  render: () => <PaymentDashboard />,
  parameters: {
    docs: {
      description: {
        story:
          "Main billing dashboard. Displays the current tariff plan with a manager count slider, per-user pricing, total cost, and upgrade/downgrade actions. On mount it fetches tariff status, portal quotas, payment plans, and payer information. Shows a skeleton loader until all data is ready.\n\n**Non-payer admins:** the pricing slider is disabled and upgrade/downgrade actions are hidden. The page is read-only — only the payer can modify the tariff.",
      },
      source: {
        code: `<PaymentsRoot config={config}>
  <PaymentDashboard />
</PaymentsRoot>`,
      },
    },
  },
};

// ── Wallet ──

export const Wallet: StoryObj = {
  render: () => <PaymentWallet showPortalSettingsLoader={false} />,
  parameters: {
    docs: {
      description: {
        story:
          "Portal wallet — the central balance used to pay for all DocSpace services (AI tools, backup, disk storage). Shows the current balance with locale-aware currency formatting. Includes a full transaction history with filtering by date range, type (all/credit/debit), and participant, plus report export. In service pages the transaction history is scoped to the specific service with date and participant filters only.\n\n**Non-payer admins:** the top-up button and auto-payment settings are hidden. The page shows balance and transaction history in read-only mode.",
      },
      source: {
        code: `<div style={{ maxHeight: 1500, overflow: "hidden" }}>
  <PaymentsRoot config={config}>
    <PaymentWallet showPortalSettingsLoader={false} />
  </PaymentsRoot>
</div>`,
      },
    },
  },
};

// ── Payment Method ──

export const Method: StoryObj = {
  render: () => <PaymentMethod />,
  parameters: {
    docs: {
      description: {
        story:
          "Payment method page with multiple states. **Card linked**: shows payer details (avatar, name, email), card status with check/warning icon, and a button to the Stripe customer portal. **Payer not found**: if the payer email doesn't match any portal user, a message is shown suggesting to choose a new payer (for owners) or contact the owner (for admins). **No card**: shows an \"Add payment method\" button that redirects to card linking.\n\n**Non-payer admins:** the Stripe customer portal button is hidden. Only the portal owner or the payer themselves can access Stripe to manage payment details or reassign the payer role.",
      },
      source: {
        code: `<PaymentsRoot config={config}>
  <PaymentMethod />
</PaymentsRoot>`,
      },
    },
  },
};

// ── Services ──

export const Services: StoryObj = {
  render: () => <PaymentServicesList showPortalSettingsLoader={false} />,
  parameters: {
    docs: {
      description: {
        story:
          "Services management page with three service cards: **AI Tools** (enable/disable, balance top-up, model pricing), **Backup** (enable/disable, available backup count), and **Disk Storage** (purchase additional storage on top of the base tariff, manage or cancel the subscription). Each service has toggles with confirmation dialogs, and enabling a service without a linked card triggers the top-up flow.",
      },
      source: {
        code: `<PaymentsRoot config={config}>
  <PaymentServicesList
    showPortalSettingsLoader={false}
    getAIConfig={refreshAIConfig}
  />
</PaymentsRoot>`,
      },
    },
  },
};

// ── AI Tools ──

export const AITools: StoryObj = {
  render: () => <AiPage />,
  parameters: {
    docs: {
      description: {
        story:
          "AI tools service page. Manages a separate AI credits balance (sub-account of the portal wallet) used to pay for AI model usage across DocSpace.\n\n**Features:** service toggle, dedicated AI balance with top-up, low balance indicator, pricing & billing link with per-model token costs. Two tabs: **Usage** (transaction history scoped to AI) and **Model Settings** (enable/disable individual AI models).",
      },
    },
  },
};

// ── Backup ──

export const Backup: StoryObj = {
  render: () => <BackupPage />,
  parameters: {
    docs: {
      description: {
        story:
          "Backup service page. Shows free and paid backup quotas with a toggle to enable/disable paid backups.\n\n**Features:** free monthly backup count with renewal date, paid backup count based on wallet balance and price per backup, service toggle with context-specific confirmations (different messages for free vs. paid tariffs), transaction history scoped to backup service.",
      },
    },
  },
};

// ── Disk Storage ──

export const DiskStorage: StoryObj = {
  render: () => <AdditionalStoragePage />,
  parameters: {
    docs: {
      description: {
        story:
          "Additional disk storage page. Allows purchasing extra storage on top of the base tariff plan.\n\n**Features:** subscription card with current storage size and monthly price, edit/cancel subscription actions, scheduled change indicators (upgrade, downgrade, or cancellation pending for next billing cycle), renewal information, transaction history scoped to storage service.",
      },
    },
  },
};

// ── Loading States ──

const loaderTabs = [
  { key: "mainTariff", label: "Main Tariff", component: <PaymentsLoader /> },
  { key: "wallet", label: "Wallet", component: <WalletLoader /> },
  { key: "method", label: "Payment Method", component: <PaymentMethodLoader /> },
  { key: "services", label: "Services", component: <ServicesLoader /> },
  { key: "aiTools", label: "AI Tools", component: <AiPageLoader /> },
  { key: "backup", label: "Backup", component: <BackupPageLoader /> },
  { key: "storage", label: "Disk Storage", component: <AdditionalStoragePageLoader /> },
] as const;

const LoadingStatesRender = () => {
  const [active, setActive] = React.useState("mainTariff");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {loaderTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid var(--border-service-color, #eceef1)",
              background: active === key ? "var(--color-scheme-main-accent, #4781D1)" : "transparent",
              color: active === key ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {loaderTabs.find((t) => t.key === active)?.component}
    </div>
  );
};

export const LoadingStates: StoryObj = {
  render: () => <LoadingStatesRender />,
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton loaders for each payment page. Every page shows its own loading skeleton while fetching data on mount. Switch between tabs to preview each loader: Main Tariff, Wallet, Payment Method, Services, AI Tools, Backup, Disk Storage.",
      },
    },
  },
};
