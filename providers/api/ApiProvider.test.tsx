import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";

import ApiProvider, { useApi } from "./ApiProvider";

vi.mock("@onlyoffice/docspace-api-sdk", () => {
  class MockConfiguration {}
  class MockProfilesApi {
    getSelfProfile = vi.fn();
  }
  class MockCommonSettingsApi {
    getPortalSettings = vi.fn();
  }
  class MockFoldersApi {}
  class MockRoomsApi {}
  class MockFilesApi {}
  class MockFilesSettingsApi {}
  class MockGroupApi {}
  class MockPeopleSearchApi {}
  class MockSearchApi {}
  return {
    Configuration: MockConfiguration,
    ProfilesApi: MockProfilesApi,
    CommonSettingsApi: MockCommonSettingsApi,
    FoldersApi: MockFoldersApi,
    RoomsApi: MockRoomsApi,
    FilesApi: MockFilesApi,
    FilesSettingsApi: MockFilesSettingsApi,
    GroupApi: MockGroupApi,
    PeopleSearchApi: MockPeopleSearchApi,
    SearchApi: MockSearchApi,
  };
});

const baseProps = {
  url: "https://example.com",
  apiKey: "test-api-key",
};

describe("ApiProvider", () => {
  it("renders children", () => {
    render(
      <ApiProvider {...baseProps}>
        <div data-testid="child">Hello</div>
      </ApiProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("useApi throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useApi());
    }).toThrow("useApi must be used within an ApiProvider");
  });

  it("useApi returns profilesApi and commonSettingsApi", () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: ({ children }) => (
        <ApiProvider {...baseProps}>{children}</ApiProvider>
      ),
    });

    expect(result.current.profilesApi).toBeDefined();
    expect(result.current.commonSettingsApi).toBeDefined();
  });
});
