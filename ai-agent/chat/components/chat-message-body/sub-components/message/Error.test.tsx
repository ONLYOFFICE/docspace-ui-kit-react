import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Error from "./Error";
import { ContentType } from "../../../../../../enums";
import type { TMessage, TContent } from "../../../../../../types/ai";

vi.mock("../../../../../../components/status-message", () => ({
  default: ({ message }: { message: string }) => <div data-testid="status-message">{message}</div>,
}));

describe("Error component", () => {
  it("renders status message when content type is text", () => {
    const mockContent = {
      type: ContentType.Text,
      text: "Error occurred",
    } as TMessage["contents"][0];

    render(<Error content={mockContent} />);

    const statusMessage = screen.getByTestId("status-message");
    expect(statusMessage).toBeInTheDocument();
    expect(statusMessage).toHaveTextContent("Error occurred");
  });

  it("returns null when content type is not text", () => {
    const mockContent = {
      type: ContentType.Files,
      id: 1,
      title: "test.txt",
      extension: ".txt",
    } as TContent;

    const { container } = render(<Error content={mockContent} />);
    expect(container.firstChild).toBeNull();
  });
});
