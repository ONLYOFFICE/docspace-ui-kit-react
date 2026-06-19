/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
vi.mock("../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<ChatNoAccessScreen />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    aiReady: false,
    standalone: false,
    isPortalAdmin: false,
    goToAISettings: vi.fn(),
  };

  it("renders with saas user title and description when not an admin", () => {
    render(<ChatNoAccessScreen {...defaultProps} />);

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "EmptyAIAgentsNotActiveYetTitle",
    );
    const description = screen.getByTestId("empty-view-description");
    expect(description).toHaveTextContent(
      "EmptyAIAgentsAIDisabledDescriptionLine1",
    );
    expect(description).toHaveTextContent(
      "EmptyAIAgentsAIDisabledDescriptionLine2",
    );
    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();

    expect(EmptyView).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "EmptyAIAgentsNotActiveYetTitle",
        options: [],
      }),
      undefined,
    );
  });

  it("renders standalone user description", () => {
    render(<ChatNoAccessScreen {...defaultProps} standalone={true} />);

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "AIFeaturesAreCurrentlyDisabled",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIAgentsAIDisabledDescription",
    );
    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();
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
      "EmptyAIAgentsNotActiveYetTitle",
    );
    const description = screen.getByTestId("empty-view-description");
    expect(description).toHaveTextContent("EmptyAIAgentsNotActiveYetDescription");
    expect(description).toHaveTextContent(
      "EmptyAIAgentsNotActiveYetDescriptionLine2",
    );

    // Check for "Go to Settings" button
    expect(screen.getByTestId("option-go-to-services")).toBeInTheDocument();

    expect(EmptyView).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "EmptyAIAgentsNotActiveYetTitle",
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
