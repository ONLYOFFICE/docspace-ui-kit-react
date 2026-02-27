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
vi.mock("../../../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../utils")>();
  return {
    ...actual,
    getCommonTranslation: vi.fn((key) => key),
  };
});

describe("<ChatInfoBlock />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with user description when not a portal admin", () => {
    render(<ChatInfoBlock isPortalAdmin={false} standalone={false} />);
    
    expect(screen.getByTestId("chat-info-block")).toBeInTheDocument();
    expect(screen.getByTestId("bar-header")).toHaveTextContent("AIFeaturesAreCurrentlyDisabled");
    expect(screen.getByTestId("bar-body")).toHaveTextContent("AIDisabledInfoBlockUserDescription");
    
    expect(PublicRoomBar).toHaveBeenCalledWith(
      expect.objectContaining({
        bodyText: "AIDisabledInfoBlockUserDescription",
      }),
      undefined
    );
  });

  it("renders with admin standalone description when portal admin and standalone", () => {
    render(<ChatInfoBlock isPortalAdmin={true} standalone={true} />);
    
    expect(screen.getByTestId("bar-body")).toHaveTextContent("AIDisabledInfoBlockAdminStandaloneDescription");
    
    expect(PublicRoomBar).toHaveBeenCalledWith(
      expect.objectContaining({
        bodyText: "AIDisabledInfoBlockAdminStandaloneDescription",
      }),
      undefined
    );
  });

  it("renders with admin saas description when portal admin and not standalone", () => {
    render(<ChatInfoBlock isPortalAdmin={true} standalone={false} />);
    
    expect(screen.getByTestId("bar-body")).toHaveTextContent("AIDisabledInfoBlockAdminSaasDescription");
    
    expect(PublicRoomBar).toHaveBeenCalledWith(
      expect.objectContaining({
        bodyText: "AIDisabledInfoBlockAdminSaasDescription",
      }),
      undefined
    );
  });
});
