import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import { ChatInfoBlock } from "./index";
import PublicRoomBar from "../../components/public-room-bar";

// Mock PublicRoomBar to verify props
vi.mock("../../components/public-room-bar", () => ({
  default: vi.fn(({ headerText, bodyText, dataTestId }) => (
    <div data-testid={dataTestId}>
      <div data-testid="bar-header">{headerText}</div>
      <div data-testid="bar-body">{bodyText}</div>
    </div>
  )),
}));

// Mock translations
vi.mock("../../utils/i18n", () => ({
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

  it("renders activate and benefits links for a saas admin", () => {
    render(
      <ChatInfoBlock
        isPortalAdmin={true}
        standalone={false}
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
    expect(body).not.toHaveTextContent("Benefits");
  });
});
