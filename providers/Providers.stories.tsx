import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import enCommon from "../locales/en/Common.json";
import type { TTranslations } from "./translation";

import Providers from "./Providers";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const meta: Meta<typeof Providers> = {
  title: "Providers/Providers",
  component: Providers,
  parameters: {
    docs: {
      description: {
        component: `Providers is the all-in-one composition of ApiProvider, TranslationProvider, and ThemeProvider.

### Features

- Composes all three providers in one component
- Fetches settings and user data from the API if not provided as props
- Inner component accesses API context to auto-fetch data

### Usage

\`\`\`tsx
import { Providers } from "@docspace/ui-kit/providers";
import enCommon from "@docspace/ui-kit/locales/en/Common.json";
import type { TTranslations } from "@docspace/ui-kit/providers/translation";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

<Providers
  url="https://your-docspace.com"
  apiKey="your-api-key"
  translations={translations}
  locale="en"
>
  <App />
</Providers>
\`\`\``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Providers>;

const DemoContent = () => {
  let translatedText = "Translations not loaded";
  try {
    const { t } = useTranslation("Common");
    translatedText = t("SaveButton");
  } catch {
    // i18n not available
  }

  return (
    <div style={{ padding: "16px" }}>
      <h3>All Providers Active</h3>
      <p>API, Translation, and Theme providers are all composed.</p>
      <p>Translation test: {translatedText}</p>
    </div>
  );
};

export const Default: Story = {
  args: {
    url: "https://example.com",
    apiKey: "demo-api-key",
    translations,
    locale: "en",
    children: <DemoContent />,
  },
};

export const WithoutTranslations: Story = {
  args: {
    url: "https://example.com",
    apiKey: "demo-api-key",
    children: (
      <div style={{ padding: "16px" }}>
        <p>Providers active without translation resources.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Providers without translations — only API and Theme are active.",
      },
    },
  },
};
