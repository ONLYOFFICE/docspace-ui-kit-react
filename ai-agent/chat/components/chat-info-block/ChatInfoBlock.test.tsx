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

import { ChatInfoBlock } from "./index";
import PublicRoomBar from "../../../../components/public-room-bar";

// Mock PublicRoomBar to verify props
vi.mock("../../../../components/public-room-bar", () => ({
  default: vi.fn(({ headerText, bodyText, dataTestId }) => (
    <div data-testid={dataTestId}>
      <div data-testid="bar-header">{headerText}</div>
      <div data-testid="bar-body">{bodyText}</div>
    </div>
  )),
}));

// Mock translations
vi.mock("../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<ChatInfoBlock />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders contact-admin description when not a portal admin", () => {
    render(<ChatInfoBlock isPortalAdmin={false} standalone={false} />);

    expect(screen.getByTestId("chat-info-block")).toBeInTheDocument();
    expect(screen.getByTestId("bar-header")).toHaveTextContent(
      "AIFeaturesNotActive",
    );
    expect(screen.getByTestId("bar-body")).toHaveTextContent(
      "AIDisabledInfoBlockContactAdminDescription",
    );
  });

  it("renders admin standalone description when portal admin and standalone", () => {
    render(<ChatInfoBlock isPortalAdmin={true} standalone={true} />);

    expect(screen.getByTestId("bar-header")).toHaveTextContent(
      "AIFeaturesAreCurrentlyDisabled",
    );
    expect(screen.getByTestId("bar-body")).toHaveTextContent(
      "AIDisabledInfoBlockStandaloneDescription",
    );
  });

  it("renders activate and benefits links for a saas payer admin", () => {
    render(
      <ChatInfoBlock
        isPortalAdmin={true}
        standalone={false}
        isPayer={true}
        isCardLinkedToPortal={true}
        onActivateAI={vi.fn()}
        onShowAIBenefits={vi.fn()}
      />,
    );

    expect(screen.getByTestId("bar-header")).toHaveTextContent(
      "AIFeaturesNotActive",
    );
    const body = screen.getByTestId("bar-body");
    expect(body).toHaveTextContent(
      "AIDisabledInfoBlockActivateWalletDescription",
    );
    expect(body).toHaveTextContent("Activate");
    expect(body).toHaveTextContent("Benefits");
  });
});
