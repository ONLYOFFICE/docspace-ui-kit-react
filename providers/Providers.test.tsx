import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import enCommon from "../locales/en/Common.json";
import type { TTranslations } from "./translation";

import Providers from "./Providers";

vi.mock("@onlyoffice/docspace-api-sdk", () => {
  class MockConfiguration {}
  class MockProfilesApi {
    getSelfProfile = vi.fn().mockResolvedValue({
      data: { response: { cultureName: "en" } },
    });
  }
  class MockCommonSettingsApi {
    getPortalSettings = vi.fn().mockResolvedValue({
      data: { response: { culture: "en" } },
    });
  }
  class MockFoldersApi {}
  class MockRoomsApi {}
  class MockFilesApi {}
  class MockFilesSettingsApi {}
  class MockGroupApi {}
  class MockPeopleSearchApi {}
  class MockSearchApi {}
  class MockOperationsApi {}
  return {
    Configuration: MockConfiguration,
    ProfilesApi: MockProfilesApi,
    CommonSettingsApi: MockCommonSettingsApi,
    CommonSettingsApiAxiosParamCreator: () => ({
      getPortalColorTheme: vi.fn().mockResolvedValue({ themes: [] }),
    }),
    FoldersApi: MockFoldersApi,
    RoomsApi: MockRoomsApi,
    FilesApi: MockFilesApi,
    FilesSettingsApi: MockFilesSettingsApi,
    GroupApi: MockGroupApi,
    PeopleSearchApi: MockPeopleSearchApi,
    SearchApi: MockSearchApi,
    OperationsApi: MockOperationsApi,
  };
});

vi.mock("./theme/useTheme", () => ({
  default: vi.fn(() => ({
    theme: {
      isBase: true,
      interfaceDirection: "ltr",
      fontFamily: "Open Sans, sans-serif, Arial",
    },
    currentColorTheme: undefined,
  })),
}));

vi.mock("../components/theme-provider", () => ({
  ThemeProviderComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

const baseProps = {
  url: "https://example.com",
  apiKey: "test-api-key",
};

describe("Providers", () => {
  it("renders children through all composed providers", () => {
    render(
      <Providers {...baseProps}>
        <div data-testid="child">Hello</div>
      </Providers>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders with translations", () => {
    render(
      <Providers {...baseProps} translations={translations} locale="en">
        <div data-testid="child">Translated content</div>
      </Providers>,
    );

    expect(screen.getByText("Translated content")).toBeInTheDocument();
  });

  it("passes settings and user through to sub-providers", () => {
    const settings = { culture: "en", timezone: "UTC" };
    const user = { cultureName: "en" };

    render(
      <Providers
        {...baseProps}
        settings={settings as never}
        user={user as never}
        translations={translations}
        locale="en"
      >
        <div data-testid="child">With props</div>
      </Providers>,
    );

    expect(screen.getByText("With props")).toBeInTheDocument();
  });
});
