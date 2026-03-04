import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTranslation } from "react-i18next";

import enCommon from "../../locales/en/Common.json";
import type { TTranslations } from "./i18n";

import TranslationProvider from "./TranslationProvider";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const meta: Meta<typeof TranslationProvider> = {
  title: "Components/Providers/TranslationProvider",
  tags: ["!autodocs"],
  component: TranslationProvider,
  decorators: [
    (Story) => (
      <TranslationProvider translations={translations} locale="en">
        <Story />
      </TranslationProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `TranslationProvider wraps children with \`I18nextProvider\` when translations are available.

### Features

- Initializes i18next with the provided translations map
- Falls back to rendering children directly when no translations exist
- Sets \`window.i18n.t\` for global access
- Determines language from \`locale\`, \`user.cultureName\`, or \`settings.culture\`

### Usage

\`\`\`tsx
import { TranslationProvider } from "@docspace/ui-kit/providers/translation";
import type { TTranslations } from "@docspace/ui-kit/providers/translation";
import enCommon from "@docspace/ui-kit/locales/en/Common.json";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

<TranslationProvider translations={translations} locale="en">
  <App />
</TranslationProvider>
\`\`\``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TranslationProvider>;

const TranslatedDemo = () => {
  const { t } = useTranslation("Common");

  return (
    <div style={{ padding: "16px" }}>
      <h3>Translation Demo</h3>
      <ul>
        <li>SaveButton: {t("SaveButton")}</li>
        <li>CancelButton: {t("CancelButton")}</li>
        <li>Delete: {t("Delete")}</li>
        <li>Settings: {t("Settings")}</li>
      </ul>
    </div>
  );
};

export const Default: Story = {
  render: () => <TranslatedDemo />,
  parameters: {
    docs: {
      description: {
        story: "Shows translated strings read via the `useTranslation()` hook.",
      },
    },
  },
};

export const WithoutTranslations: Story = {
  decorators: [
    (Story) => (
      <TranslationProvider>
        <Story />
      </TranslationProvider>
    ),
  ],
  render: () => (
    <div style={{ padding: "16px" }}>
      <p>No translations provided — children render as-is.</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When no translations are provided, the provider renders children directly without i18n.",
      },
    },
  },
};
