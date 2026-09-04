import React from "react";
import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

import { MCPIcon } from "./MCPIcon";
import styles from "./MCPIcon.module.scss";

describe("<MCPIcon />", () => {
  const renderComponent = (props = {}) => {
    return render(<MCPIcon title="Test" {...props} />);
  };

  it("renders MCPIcon component without errors", () => {
    renderComponent();
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement).toBeInTheDocument();
  });

  it("renders with default size", () => {
    renderComponent();
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement.classList.contains(styles.large)).toBeTruthy();
  });

  it("renders with custom className", () => {
    const customClass = "custom-icon";
    renderComponent({ className: customClass });
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement.className).toContain(customClass);
  });

  it("renders with custom dataTestId", () => {
    renderComponent({ dataTestId: "custom-test-id" });
    const iconElement = screen.getByTestId("custom-test-id");
    expect(iconElement).toBeInTheDocument();
  });

  it("displays first character of title in uppercase", () => {
    renderComponent({ title: "hugging face" });
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("renders image when imgSrc is provided", () => {
    renderComponent({
      title: "Test",
      imgSrc: "https://example.com/icon.svg",
    });
    const imgElement = screen.getByRole("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "https://example.com/icon.svg");
  });

  it("falls back to title when image fails to load", async () => {
    renderComponent({ title: "Fallback", imgSrc: "invalid-url.jpg" });

    const imgElement = screen.getByRole("img");

    act(() => {
      imgElement.dispatchEvent(new Event("error"));
    });

    await waitFor(() => {
      expect(screen.getByText("F")).toBeInTheDocument();
    });
  });

  it("resets error state when imgSrc changes", async () => {
    const { rerender } = renderComponent({
      title: "Test",
      imgSrc: "invalid-url.jpg",
    });

    const imgElement = screen.getByRole("img");

    act(() => {
      imgElement.dispatchEvent(new Event("error"));
    });

    await waitFor(() => {
      expect(screen.getByText("T")).toBeInTheDocument();
    });

    rerender(
      <MCPIcon title="Test" imgSrc="https://example.com/new-icon.svg" />,
    );

    await waitFor(() => {
      const newImgElement = screen.getByRole("img");
      expect(newImgElement).toHaveAttribute(
        "src",
        "https://example.com/new-icon.svg",
      );
    });
  });
});
