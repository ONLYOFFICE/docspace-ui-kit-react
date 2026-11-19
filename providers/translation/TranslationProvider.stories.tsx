import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { useTranslation } from "react-i18next";

import enCommon from "../../locales/en/Common.json";
import { Button, ButtonSize } from "../../components/button";
import { RadioButtonGroup } from "../../components/radio-button-group";
import { Text } from "../../components/text";
import { getI18NInstance, type TTranslations } from "./i18n";

import TranslationProvider from "./TranslationProvider";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const deCommon = {
  SaveButton: "Speichern",
  CancelButton: "Abbrechen",
  Delete: "Löschen",
  Settings: "Einstellungen",
};

const bilingual: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
  ["de", new Map([["Common", deCommon]])],
]);

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];

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

const TranslatedButtons = () => {
  const { t } = useTranslation("Common");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Button label={t("SaveButton")} size={ButtonSize.small} primary />
      <Button label={t("CancelButton")} size={ButtonSize.small} />
      <Button label={t("Delete")} size={ButtonSize.small} />
      <Button label={t("Settings")} size={ButtonSize.small} />
    </div>
  );
};

const LanguageSwitch = () => {
  const [locale, setLocale] = React.useState("en");

  React.useEffect(
    () => () => {
      getI18NInstance("en", translations);
    },
    [],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
      }}
    >
      <RadioButtonGroup
        name="locale"
        options={LANGUAGES}
        selected={locale}
        spacing="16px"
        onClick={(event) => setLocale(event.target.value)}
      />
      <TranslationProvider translations={bilingual} locale={locale}>
        <TranslatedButtons />
      </TranslationProvider>
      <Text fontSize="12px">
        The buttons read <code>SaveButton</code>, <code>CancelButton</code>,{" "}
        <code>Delete</code> and <code>Settings</code> from the{" "}
        <code>Common</code> namespace.
      </Text>
    </div>
  );
};

export const Default: Story = {
  name: "Language switch",
  render: () => <LanguageSwitch />,
  play: async ({ canvas, userEvent }) => {
    for (const label of ["Save", "Cancel", "Delete", "Settings"]) {
      await expect(canvas.getByRole("button", { name: label })).toBeVisible();
    }

    await userEvent.click(canvas.getByLabelText("Deutsch"));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Speichern" })).toBeVisible(),
    );
    for (const label of ["Abbrechen", "Löschen", "Einstellungen"]) {
      await expect(canvas.getByRole("button", { name: label })).toBeVisible();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Four buttons labelled in English, under a switch between English and German. The same keys resolve against the chosen language's bundle in `translations`.",
      },
      source: {
        code: `const translations = new Map([
  ["en", new Map([["Common", enCommon]])],
  ["de", new Map([["Common", deCommon]])],
]);

<TranslationProvider translations={translations} locale={locale}>
  <App />
</TranslationProvider>`,
      },
    },
  },
};

export const WithoutTranslations: Story = {
  name: "Without translations",
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
          "A paragraph under a provider with no `translations`. The children render as they are, with no i18n instance installed.",
      },
    },
  },
};
