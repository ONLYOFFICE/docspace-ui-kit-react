import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useTranslation } from "react-i18next";

import enCommon from "../../locales/en/Common.json";
import type { TTranslations } from "./i18n";

import TranslationProvider from "./TranslationProvider";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const meta: Meta<typeof TranslationProvider> = {
  title: "Components/Providers/TranslationProvider",
  component: TranslationProvider,
  decorators: [
    (Story) => (
      <TranslationProvider translations={translations} locale="en">
        <Story />
      </TranslationProvider>
    ),
  ],
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
  play: async ({ canvas }) => {
    // Keys resolve to the English bundle.
    for (const line of [
      "SaveButton: Save",
      "CancelButton: Cancel",
      "Delete: Delete",
      "Settings: Settings",
    ]) {
      await expect(canvas.getByText(line)).toBeVisible();
    }
  },
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
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("No translations provided — children render as-is."),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no translations are provided, the provider renders children directly without i18n.",
      },
    },
  },
};
