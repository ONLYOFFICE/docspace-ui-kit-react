import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Badge } from ".";
import styles from "./Badge.module.scss";

describe("<Badge />", () => {
  const renderComponent = (props = {}) => {
    return render(<Badge {...props} />);
  };

  describe("Rendering", () => {
    it("renders Badge component", () => {
      renderComponent();
      const badgeElement = screen.getByRole("generic");
      expect(badgeElement).toBeInTheDocument();
    });

    it("renders Badge with correct text", () => {
      renderComponent({ label: "Test Badge" });
      const badgeElement = screen.getByText("Test Badge");
      expect(badgeElement).toBeInTheDocument();
    });

    it("displays label correctly", () => {
      renderComponent({ label: "10" });
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("renders with default props", () => {
      renderComponent();
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("aria-atomic", "true");
      expect(badge).toHaveAttribute("aria-live", "polite");
    });

    it("applies base styles correctly", () => {
      renderComponent({ label: "10" });
      const badge = screen.getByTestId("badge");

      expect(badge.classList.contains(styles.badge)).toBeTruthy();
      expect(badge.classList.contains(styles.themed)).toBeTruthy();
    });

    it("applies custom styles correctly", () => {
      const customProps = {
        fontSize: "14px",
        color: "red",
        backgroundColor: "blue",
        borderRadius: "5px",
        padding: "10px",
        maxWidth: "100px",
        height: "30px",
        border: "1px solid black",
        label: "10",
      };

      renderComponent(customProps);
      const badge = screen.getByTestId("badge");

      expect(badge.style.height).toBe("30px");
      expect(badge.style.border).toBe("1px solid black");
      expect(badge.style.borderRadius).toBe("5px");
    });
  });

  describe("Styling", () => {
    it("renders Badge with custom className", () => {
      const customClass = "custom-badge";
      renderComponent({ className: customClass });
      const badgeElement = screen.getByTestId("badge");
      expect(badgeElement.className).toContain(customClass);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes when non-interactive", () => {
      renderComponent({ label: "5" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("aria-label", "5 ");
      expect(badge).toHaveAttribute("aria-live", "polite");
      expect(badge).toHaveAttribute("aria-atomic", "true");
    });
  });

  describe("Interactions", () => {
    it("handles click events", async () => {
      const onClick = vi.fn();
      renderComponent({ label: "Click", onClick });

      const badge = screen.getByTestId("badge");
      await userEvent.click(badge);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Display Logic", () => {
    it("does not display when label is 0", () => {
      renderComponent({ label: "0" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("data-hidden", "true");
    });

    it("displays when label is non-zero", () => {
      renderComponent({ label: "1" });
      const badge = screen.getByTestId("badge");
      expect(badge).not.toHaveAttribute("data-hidden", "true");
    });

    it("applies high priority styling", () => {
      renderComponent({ label: "High", type: "high" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("data-type", "high");
    });
  });
});
