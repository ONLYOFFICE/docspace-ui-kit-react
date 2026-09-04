import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import { ChatNoAccessScreen } from "./index";
import { EmptyView } from "../../../../components/empty-view";

// Mock EmptyView to verify props
vi.mock("../../../../components/empty-view", () => ({
  EmptyView: vi.fn(({ title, description, options, icon, extraContent }) => (
    <div data-testid="empty-view-mock">
      <div data-testid="empty-view-title">{title}</div>
      <div data-testid="empty-view-description">{description}</div>
      <div data-testid="empty-view-icon">{icon}</div>
      {extraContent ? (
        <div data-testid="empty-view-extra">{extraContent}</div>
      ) : null}
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

  // The agents section keeps its own wording; the AI chat panel copy is
  // covered by the describe block below.
  const defaultProps = {
    standalone: false,
    isPortalAdmin: false,
    isAgents: true,
    goToAISettings: vi.fn(),
  };

  it("renders with saas user title and description when not an admin", () => {
    render(<ChatNoAccessScreen {...defaultProps} />);

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "EmptyAIAgentsNotActiveYetTitle",
    );
    const description = screen.getByTestId("empty-view-description");
    expect(description).toHaveTextContent(
      "EmptyAIDisabledContactAdminDesc",
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

  it("renders saas admin with the activate button and no benefits option", () => {
    const onActivateAI = vi.fn();

    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        standalone={false}
        isCardLinkedToPortal={true}
        onActivateAI={onActivateAI}
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

    expect(screen.getByTestId("option-activate-ai")).toBeInTheDocument();
    expect(screen.queryByTestId("option-ai-benefits")).not.toBeInTheDocument();
  });

  it("shows top up button for saas admin without a linked card", () => {
    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        standalone={false}
        isCardLinkedToPortal={false}
        onTopUpAndActivateAI={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId("option-top-up-and-activate-ai"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("option-ai-benefits")).not.toBeInTheDocument();
  });

  it("shows activate button for any saas admin, not only the payer", () => {
    render(
      <ChatNoAccessScreen
        {...defaultProps}
        isPortalAdmin={true}
        standalone={false}
        isCardLinkedToPortal={true}
        onActivateAI={vi.fn()}
      />,
    );

    expect(screen.getByTestId("option-activate-ai")).toBeInTheDocument();
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

describe("<ChatNoAccessScreen /> chat panel copy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const chatProps = {
    standalone: false,
    isPortalAdmin: false,
    goToAISettings: vi.fn(),
  };

  it("asks a saas user to contact the admin and lists the AI benefits", () => {
    render(<ChatNoAccessScreen {...chatProps} />);

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "EmptyAIChatNotActiveYetTitle",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIChatNotActiveYetUserDescription",
    );
    expect(screen.getByTestId("chat-ai-benefits")).toBeInTheDocument();
    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();
  });

  it("offers a saas admin the top up & activate button next to the benefits", () => {
    render(
      <ChatNoAccessScreen
        {...chatProps}
        isPortalAdmin={true}
        isCardLinkedToPortal={false}
        onTopUpAndActivateAI={vi.fn()}
      />,
    );

    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIChatNotActiveYetAdminDescription",
    );
    expect(screen.getByTestId("chat-ai-benefits")).toBeInTheDocument();
    expect(
      screen.getByTestId("option-top-up-and-activate-ai"),
    ).toBeInTheDocument();
  });

  it("sends a standalone admin to the AI settings and drops the benefits", () => {
    render(
      <ChatNoAccessScreen {...chatProps} standalone={true} isPortalAdmin />,
    );

    expect(screen.getByTestId("empty-view-title")).toHaveTextContent(
      "EmptyAIChatNotAvailableYetTitle",
    );
    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIChatNotAvailableYetAdminDescription",
    );
    expect(screen.queryByTestId("chat-ai-benefits")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("option-go-to-ai-provider-settings"),
    ).toBeInTheDocument();
  });

  it("shows a standalone user the read-only copy", () => {
    render(<ChatNoAccessScreen {...chatProps} standalone={true} />);

    expect(screen.getByTestId("empty-view-description")).toHaveTextContent(
      "EmptyAIChatNotAvailableYetUserDescription",
    );
    expect(screen.queryByTestId("chat-ai-benefits")).not.toBeInTheDocument();
    expect(screen.queryByTestId("empty-view-options")).not.toBeInTheDocument();
  });
});
