import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmptyScreen from "./EmptyScreen";

vi.mock("../../../../../components/rectangle", () => ({
  RectangleSkeleton: () => <div data-testid="rectangle-skeleton" />,
}));

vi.mock("../../../../../components/text", () => ({
  Text: ({ children, dataTestId }: { children?: React.ReactNode; dataTestId?: string }) => (
    <div data-testid={dataTestId ?? "text"}>{children}</div>
  ),
}));

vi.mock("../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key: string) => `translated-${key}`),
}));

describe("EmptyScreen component", () => {
  it("renders skeleton when isLoading is true", () => {
    render(<EmptyScreen isLoading={true} />);
    expect(screen.getByTestId("rectangle-skeleton")).toBeInTheDocument();
    expect(screen.queryByText(/translated-/)).not.toBeInTheDocument();
  });

  it("renders translated message when isLoading is false", () => {
    render(<EmptyScreen isLoading={false} />);
    expect(screen.queryByTestId("rectangle-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText("translated-AIChatOfferHelp")).toBeInTheDocument();
  });

  it("renders translated message when isLoading is undefined", () => {
    render(<EmptyScreen />);
    expect(screen.queryByTestId("rectangle-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText("translated-AIChatOfferHelp")).toBeInTheDocument();
  });

  it("has correct dataTestId on Text component", () => {
    render(<EmptyScreen />);
    expect(screen.getByTestId("chat-empty-screen")).toBeInTheDocument();
  });
});
