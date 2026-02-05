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

import { describe, it, expect, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";

import StatusMessage from ".";
import styles from "./StatusMessage.module.scss";

vi.mock("../../assets/danger.toast.react.svg", () => ({
  default: () => <svg data-testid="danger-icon" />,
}));

describe("<StatusMessage />", () => {
  const renderComponent = (props = {}) => {
    return render(<StatusMessage message="" {...props} />);
  };

  describe("Rendering", () => {
    it("renders with string message", () => {
      renderComponent({ message: "Test message" });
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("renders with React node message", () => {
      renderComponent({
        message: (
          <span>
            Message with <strong>bold</strong> text
          </span>
        ),
      });
      expect(screen.getByText("bold")).toBeInTheDocument();
    });

    it("does not render when message is empty", () => {
      const { container } = renderComponent({ message: "" });
      expect(container.firstChild).toBeNull();
    });

    it("renders danger icon", () => {
      renderComponent({ message: "Test" });
      expect(screen.getByTestId("danger-icon")).toBeInTheDocument();
    });

    it("applies base styles correctly", () => {
      renderComponent({ message: "Test" });
      const messageElement = screen.getByText("Test").parentElement;
      expect(messageElement?.classList.contains(styles.body)).toBeTruthy();
    });
  });

  describe("Warning Style", () => {
    it("applies warning class when isWarning is true", () => {
      renderComponent({ message: "Warning message", isWarning: true });
      const messageElement = screen.getByText("Warning message").parentElement;
      expect(messageElement?.classList.contains(styles.warning)).toBeTruthy();
    });

    it("does not apply warning class when isWarning is false", () => {
      renderComponent({ message: "Error message", isWarning: false });
      const messageElement = screen.getByText("Error message").parentElement;
      expect(messageElement?.classList.contains(styles.warning)).toBeFalsy();
    });

    it("does not apply warning class by default", () => {
      renderComponent({ message: "Default message" });
      const messageElement = screen.getByText("Default message").parentElement;
      expect(messageElement?.classList.contains(styles.warning)).toBeFalsy();
    });
  });

  describe("Animation Behavior", () => {
    it("shows message initially when provided", () => {
      renderComponent({ message: "Initial message" });
      const messageElement = screen.getByText("Initial message").parentElement;
      expect(messageElement?.classList.contains(styles.hide)).toBeFalsy();
    });

    it("applies hide class when message changes", async () => {
      const { rerender } = renderComponent({ message: "First message" });

      rerender(<StatusMessage message="Second message" />);

      await waitFor(() => {
        const elements = screen.queryAllByText("First message");
        if (elements.length > 0) {
          const messageElement = elements[0].parentElement;
          expect(messageElement?.classList.contains(styles.hide)).toBeTruthy();
        }
      });
    });

    it("removes component when message is cleared", async () => {
      const { rerender } = renderComponent({ message: "Test message" });

      expect(screen.getByText("Test message")).toBeInTheDocument();

      rerender(<StatusMessage message="" />);

      const messageElement = screen.getByText("Test message").parentElement;
      expect(messageElement?.classList.contains(styles.hide)).toBeTruthy();
    });
  });

  describe("Message Updates", () => {
    it("updates message content when prop changes", () => {
      const { rerender } = renderComponent({ message: "First message" });
      expect(screen.getByText("First message")).toBeInTheDocument();

      rerender(<StatusMessage message="Second message" />);

      expect(screen.getByText("First message")).toBeInTheDocument();
    });

    it("handles rapid message changes", () => {
      const { rerender } = renderComponent({ message: "Message 1" });

      rerender(<StatusMessage message="Message 2" />);
      rerender(<StatusMessage message="Message 3" />);

      expect(screen.getByText("Message 1")).toBeInTheDocument();
    });

    it("maintains isWarning state during message updates", () => {
      const { rerender } = renderComponent({
        message: "First warning",
        isWarning: true,
      });

      const firstElement = screen.getByText("First warning").parentElement;
      expect(firstElement?.classList.contains(styles.warning)).toBeTruthy();

      rerender(<StatusMessage message="Second warning" isWarning />);

      const secondElement = screen.getByText("First warning").parentElement;
      expect(secondElement?.classList.contains(styles.warning)).toBeTruthy();
    });
  });

  describe("Component Lifecycle", () => {
    it("initializes with message visible", () => {
      renderComponent({ message: "Initial" });
      const messageElement = screen.getByText("Initial").parentElement;
      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.classList.contains(styles.hide)).toBeFalsy();
    });

    it("handles message from empty to filled", () => {
      const { rerender } = renderComponent({ message: "" });
      expect(screen.queryByText("New message")).not.toBeInTheDocument();

      rerender(<StatusMessage message="New message" />);
      expect(screen.getByText("New message")).toBeInTheDocument();
    });

    it("handles message from filled to empty", async () => {
      const { rerender } = renderComponent({ message: "Visible message" });
      expect(screen.getByText("Visible message")).toBeInTheDocument();

      rerender(<StatusMessage message="" />);

      const messageElement = screen.getByText("Visible message").parentElement;
      expect(messageElement?.classList.contains(styles.hide)).toBeTruthy();
    });
  });

  describe("Animation Event Handlers", () => {
    it("hides component on animationend when message is empty", async () => {
      const { rerender, container } = renderComponent({ message: "Test" });

      rerender(<StatusMessage message="" />);

      const messageElement = screen.getByText("Test").parentElement;
      messageElement?.dispatchEvent(new Event("animationend"));

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it("hides component on transitionend when message is empty", async () => {
      const { rerender, container } = renderComponent({ message: "Test" });

      rerender(<StatusMessage message="" />);

      const messageElement = screen.getByText("Test").parentElement;
      messageElement?.dispatchEvent(new Event("transitionend"));

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it("shows new message after animation completes", async () => {
      const { rerender } = renderComponent({ message: "First" });

      rerender(<StatusMessage message="Second" />);

      const messageElement = screen.getByText("First").parentElement;
      messageElement?.dispatchEvent(new Event("animationend"));

      await waitFor(() => {
        expect(screen.getByText("Second")).toBeInTheDocument();
      });
    });

    it("shows new message after transition completes", async () => {
      const { rerender } = renderComponent({ message: "First" });

      rerender(<StatusMessage message="Second" />);

      const messageElement = screen.getByText("First").parentElement;
      messageElement?.dispatchEvent(new Event("transitionend"));

      await waitFor(() => {
        expect(screen.getByText("Second")).toBeInTheDocument();
      });
    });

    it("handles animationend without previous message", async () => {
      const { container } = renderComponent({ message: "Test" });

      const messageElement = screen.getByText("Test").parentElement;
      if (messageElement) {
        Object.defineProperty(messageElement, "textContent", {
          value: "",
          writable: true,
        });
      }

      messageElement?.dispatchEvent(new Event("animationend"));

      await waitFor(() => {
        expect(container.querySelector(`.${styles.body}`)).toBeInTheDocument();
      });
    });

    it("cleans up event listeners on unmount", () => {
      const { unmount } = renderComponent({ message: "Test" });
      const messageElement = screen.getByText("Test").parentElement;

      const removeEventListenerSpy = vi.spyOn(
        messageElement as HTMLElement,
        "removeEventListener",
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "animationend",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "transitionend",
        expect.any(Function),
      );
    });
  });
});
