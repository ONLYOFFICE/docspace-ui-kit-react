import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import type { TTranslations } from "./i18n";

import TranslationProvider from "./TranslationProvider";

const enCommon: Record<string, string> = { SaveButton: "Save" };

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const TranslatedContent = () => {
  const { t } = useTranslation("Common");
  return <span data-testid="translated">{t("SaveButton")}</span>;
};

describe("TranslationProvider", () => {
  beforeEach(() => {
    const win = window as unknown as { i18n?: { t?: unknown } };
    delete win.i18n;
  });

  it("renders children without translations", () => {
    render(
      <TranslationProvider>
        <div data-testid="child">Hello</div>
      </TranslationProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders children with translations", () => {
    render(
      <TranslationProvider translations={translations} locale="en">
        <div data-testid="child">Hello</div>
      </TranslationProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("provides i18n context when translations exist", () => {
    render(
      <TranslationProvider translations={translations} locale="en">
        <TranslatedContent />
      </TranslationProvider>,
    );

    expect(screen.getByTestId("translated")).toHaveTextContent("Save");
  });

  it("renders children without i18n when no translations are provided", () => {
    render(
      <TranslationProvider>
        <div data-testid="child">Plain content</div>
      </TranslationProvider>,
    );

    expect(screen.getByText("Plain content")).toBeInTheDocument();
  });

  it("sets window.i18n.t after mount with translations", () => {
    render(
      <TranslationProvider translations={translations} locale="en">
        <span>Content</span>
      </TranslationProvider>,
    );

    const win = window as unknown as { i18n?: { t?: unknown } };
    expect(win.i18n?.t).toBeDefined();
    expect(typeof win.i18n?.t).toBe("function");
  });

  it("sets window.i18n.loaded with translation data", () => {
    render(
      <TranslationProvider translations={translations} locale="en">
        <span>Content</span>
      </TranslationProvider>,
    );

    const win = window as unknown as {
      i18n?: { loaded?: Record<string, { data: Record<string, string> }> };
    };
    expect(win.i18n?.loaded).toBeDefined();
    expect(win.i18n?.loaded?.["en/Common.json"]).toBeDefined();
    expect(win.i18n?.loaded?.["en/Common.json"]?.data?.SaveButton).toBe("Save");
  });
});
