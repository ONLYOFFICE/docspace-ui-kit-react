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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import { ChatNoAccessScreen } from "./index";
import { EmptyView } from "../../../../components/empty-view";

// Mock EmptyView to verify props
vi.mock("../../../../components/empty-view", () => ({
  EmptyView: vi.fn(({ title, description, options, icon }) => (
    <div data-testid="empty-view-mock">
      <div data-testid="empty-view-title">{title}</div>
      <div data-testid="empty-view-description">{description}</div>
      <div data-testid="empty-view-icon">{icon}</div>
      {options && options.length > 0 && (
        <div data-testid="empty-view-options">
          {options.map(
            (opt: { key: string; title: string; onClick?: () => void }) => (
              <button
                key={opt.key}
                onClick={opt.onClick}
                data-testid={`option-${opt.key}`}
              >
                {opt.title}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )),
}));

// Mock useTheme
vi.mock("../../../../context/ThemeContext", () => ({
  useTheme: () => ({ isBase: true }),
}));

// Mock translations
vi.mock("../../../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../utils")>();
  return {
    ...actual,
    getCommonTranslation: vi.fn((key) => key),
  };
});

describe("<ChatNoAccessScreen />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    aiReady: false,
    standalone: false,
    isPortalAdmin: false,
    goToAISettings: vi.fn(),
    allowExternalNavigation: true,
  };

  it("renders with user description when not an admin", () => {
    render(<ChatNoAccessScreen {...defaultProps} />);

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "AIFeaturesAreCurrentlyDisabled",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyChatAIDisabledUserDescription",
    );
    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();

    expect(EmptyView).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "AIFeaturesAreCurrentlyDisabled",
        description: "EmptyChatAIDisabledUserDescription",
        options: [],
      }),
      undefined,
    );
  });

  it("renders with standalone admin title and description", () => {
    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        standalone={true}
      />,
    );

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "EmptyAIAgentsAIDisabledStandaloneAdminTitle",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIAgentsAIDisabledStandaloneAdminDescription",
    );

    // Check for "Go to Settings" button
    expect(
      screen.getByTestId("option-go-to-ai-provider-settings"),
    ).toBeInTheDocument();

    expect(EmptyView).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "EmptyAIAgentsAIDisabledStandaloneAdminTitle",
        description: "EmptyAIAgentsAIDisabledStandaloneAdminDescription",
        options: [
          expect.objectContaining({ key: "go-to-ai-provider-settings" }),
        ],
      }),
      undefined,
    );
  });

  it("renders with saas admin description", () => {
    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        standalone={false}
      />,
    );

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "AIFeaturesAreCurrentlyDisabled",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyChatAIDisabledSaasAdminDescription",
    );

    // Check for "Go to Settings" button
    expect(screen.getByTestId("option-go-to-services")).toBeInTheDocument();

    expect(EmptyView).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "AIFeaturesAreCurrentlyDisabled",
        description: "EmptyChatAIDisabledSaasAdminDescription",
        options: [expect.objectContaining({ key: "go-to-services" })],
      }),
      undefined,
    );
  });


  it("hides settings button if goToAISettings is not provided", () => {
    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        goToAISettings={undefined}
      />,
    );

    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();
  });
});
