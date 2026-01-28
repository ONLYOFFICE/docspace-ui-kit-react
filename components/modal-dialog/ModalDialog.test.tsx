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

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ModalDialog } from ".";
import { ModalDialogType } from "./ModalDialog.enums";

vi.mock("react-device-detect", () => ({
  isSafari: false,
  isTablet: false,
  isMobileOnly: false,
  isMobile: false,
}));

describe("ModalDialog", () => {
  const mockOnClose = vi.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal dialog with header, body and footer", () => {
    render(
      <ModalDialog {...defaultProps}>
        <ModalDialog.Header>Modal Header</ModalDialog.Header>
        <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        <ModalDialog.Footer>Modal Footer</ModalDialog.Footer>
      </ModalDialog>,
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Header")).toBeInTheDocument();
    expect(screen.getByText("Modal Body Content")).toBeInTheDocument();
    expect(screen.getByText("Modal Footer")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    render(
      <ModalDialog {...defaultProps}>
        <ModalDialog.Header>Modal Header</ModalDialog.Header>
        <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
      </ModalDialog>,
    );

    const closeButton = screen.getByLabelText("close");
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not show close button when isCloseable is false", () => {
    render(
      <ModalDialog {...defaultProps} isCloseable={false}>
        <ModalDialog.Header>Modal Header</ModalDialog.Header>
        <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
      </ModalDialog>,
    );

    const closeButton = screen.queryByLabelText("close");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(
      <ModalDialog {...defaultProps} isLoading>
        <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
      </ModalDialog>,
    );

    const modal = screen.getByTestId("modal");
    const loaderElements = modal.getElementsByClassName("dialog-loader-header");
    expect(loaderElements.length).toBeGreaterThan(0);
    expect(screen.queryByText("Modal Body Content")).not.toBeInTheDocument();
  });

  it("renders container when containerVisible is true (aside only)", () => {
    render(
      <ModalDialog
        {...defaultProps}
        displayType={ModalDialogType.aside}
        containerVisible
      >
        <ModalDialog.Container>Container Content</ModalDialog.Container>
      </ModalDialog>,
    );

    expect(screen.getByText("Container Content")).toBeInTheDocument();
  });

  it("does not render container when containerVisible is false", () => {
    render(
      <ModalDialog
        {...defaultProps}
        displayType={ModalDialogType.aside}
        containerVisible={false}
      >
        <ModalDialog.Container>Container Content</ModalDialog.Container>
        <ModalDialog.Body>Body Content</ModalDialog.Body>
      </ModalDialog>,
    );

    expect(screen.queryByText("Container Content")).not.toBeInTheDocument();
    expect(screen.getByText("Body Content")).toBeInTheDocument();
  });

  it("does not render container for modal type even when containerVisible is true", () => {
    render(
      <ModalDialog
        {...defaultProps}
        displayType={ModalDialogType.modal}
        containerVisible
      >
        <ModalDialog.Container>Container Content</ModalDialog.Container>
        <ModalDialog.Body>Body Content</ModalDialog.Body>
      </ModalDialog>,
    );

    expect(screen.queryByText("Container Content")).not.toBeInTheDocument();
    expect(screen.getByText("Body Content")).toBeInTheDocument();
  });

  describe("Keyboard events", () => {
    it("calls onClose when Escape key is pressed", async () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Esc key is pressed", async () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose on Escape when isCloseable is false", async () => {
      render(
        <ModalDialog {...defaultProps} isCloseable={false}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("does not call onClose on Escape when visible is false", async () => {
      render(
        <ModalDialog {...defaultProps} visible={false}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("calls onBackClick when Backspace key is pressed", async () => {
      const mockOnBackClick = vi.fn();
      render(
        <ModalDialog {...defaultProps} onBackClick={mockOnBackClick}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{backspace}");

      expect(mockOnBackClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onBackClick when Backspace is pressed in input", async () => {
      const mockOnBackClick = vi.fn();
      render(
        <ModalDialog {...defaultProps} onBackClick={mockOnBackClick}>
          <ModalDialog.Body>
            <input type="text" data-testid="test-input" />
          </ModalDialog.Body>
        </ModalDialog>,
      );

      const input = screen.getByTestId("test-input");
      input.focus();

      await userEvent.keyboard("{backspace}");

      expect(mockOnBackClick).not.toHaveBeenCalled();
    });

    it("does not call onBackClick when Backspace is pressed in textarea", async () => {
      const mockOnBackClick = vi.fn();
      render(
        <ModalDialog {...defaultProps} onBackClick={mockOnBackClick}>
          <ModalDialog.Body>
            <textarea data-testid="test-textarea" />
          </ModalDialog.Body>
        </ModalDialog>,
      );

      const textarea = screen.getByTestId("test-textarea");
      textarea.focus();

      await userEvent.keyboard("{backspace}");

      expect(mockOnBackClick).not.toHaveBeenCalled();
    });
  });

  describe("Display types and sizes", () => {
    it("renders as modal type by default", () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("displayTypeModal");
    });

    it("renders as aside type when displayType is aside", () => {
      render(
        <ModalDialog {...defaultProps} displayType={ModalDialogType.aside}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("displayTypeAside");
    });

    it("applies large class when isLarge is true", () => {
      render(
        <ModalDialog {...defaultProps} isLarge>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("large");
    });

    it("applies huge class when isHuge is true", () => {
      render(
        <ModalDialog {...defaultProps} isHuge>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("huge");
    });

    it("applies autoMaxHeight class when autoMaxHeight is true", () => {
      render(
        <ModalDialog {...defaultProps} autoMaxHeight>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("autoMaxHeight");
    });

    it("applies autoMaxWidth class when autoMaxWidth is true", () => {
      render(
        <ModalDialog {...defaultProps} autoMaxWidth>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const content = modal.querySelector(".content");
      expect(content).toHaveClass("autoMaxWidth");
    });
  });

  describe("Backdrop and visibility", () => {
    it("shows backdrop when backdropVisible is true (default)", () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const backdrop = modal.querySelector(".modalBackdropActive");
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).not.toHaveClass("hideBackdrop");
    });

    it("hides backdrop when backdropVisible is false", () => {
      render(
        <ModalDialog {...defaultProps} backdropVisible={false}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const backdrop = modal.querySelector(".modalBackdropActive");
      expect(backdrop).toHaveClass("hideBackdrop");
    });

    it("applies visible class when visible is true", () => {
      render(
        <ModalDialog {...defaultProps} visible>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveClass("modalActive");
    });

    it("does not apply visible class when visible is false", () => {
      render(
        <ModalDialog {...defaultProps} visible={false}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      expect(modal).not.toHaveClass("modalActive");
    });

    it("calls onClose when backdrop is clicked and closeOnBackdropClick is true", async () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const backdrop = screen.getByRole("dialog");
      await userEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("hides content when hideContent is true", () => {
      render(
        <ModalDialog {...defaultProps} hideContent>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      expect(screen.queryByText("Modal Body Content")).not.toBeInTheDocument();
    });
  });

  describe("Embedded mode", () => {
    it("does not call onClose when embedded is true", async () => {
      render(
        <ModalDialog {...defaultProps} embedded>
          <ModalDialog.Header>Modal Header</ModalDialog.Header>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const closeButton = screen.queryByLabelText("close");
      expect(closeButton).not.toBeInTheDocument();
    });

    it("does not call onClose on Escape when embedded is true", async () => {
      render(
        <ModalDialog {...defaultProps} embedded>
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      await userEvent.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Form functionality", () => {
    it("wraps content in form when withForm is true", () => {
      render(
        <ModalDialog {...defaultProps} withForm>
          <ModalDialog.Body>
            <input type="text" data-testid="form-input" />
          </ModalDialog.Body>
        </ModalDialog>,
      );

      const input = screen.getByTestId("form-input");
      const form = input.closest("form");
      expect(form).toBeInTheDocument();
    });

    it("calls onSubmit when form is submitted", async () => {
      const mockOnSubmit = vi.fn((e) => e.preventDefault());
      render(
        <ModalDialog {...defaultProps} withForm onSubmit={mockOnSubmit}>
          <ModalDialog.Body>
            <button type="submit" data-testid="submit-btn">
              Submit
            </button>
          </ModalDialog.Body>
        </ModalDialog>,
      );

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Footer and body styling", () => {
    it("applies withFooterBorder class when withFooterBorder is true", () => {
      render(
        <ModalDialog {...defaultProps} withFooterBorder>
          <ModalDialog.Body>Body</ModalDialog.Body>
          <ModalDialog.Footer>Footer</ModalDialog.Footer>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const footer = modal.querySelector(".footer");
      expect(footer).toHaveClass("withFooterBorder");
    });

    it("applies doubleFooterLine class when isDoubleFooterLine is true", () => {
      render(
        <ModalDialog {...defaultProps} isDoubleFooterLine>
          <ModalDialog.Body>Body</ModalDialog.Body>
          <ModalDialog.Footer>Footer</ModalDialog.Footer>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const footer = modal.querySelector(".footer");
      expect(footer).toHaveClass("doubleFooterLine");
    });

    it("applies withoutPadding class when withoutPadding is true", () => {
      render(
        <ModalDialog {...defaultProps} withoutPadding>
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const body = modal.querySelector(".body");
      expect(body).toHaveClass("withoutPadding");
    });

    it("applies withoutHeaderMargin class when withoutHeaderMargin is true", () => {
      render(
        <ModalDialog {...defaultProps} withoutHeaderMargin>
          <ModalDialog.Header>Header</ModalDialog.Header>
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const header = modal.querySelector(".header");
      expect(header).toHaveClass("withoutHeaderMargin");
    });

    it("applies withBodyScroll class when withBodyScroll is true for aside", () => {
      render(
        <ModalDialog
          {...defaultProps}
          displayType={ModalDialogType.aside}
          withBodyScroll
        >
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const body = modal.querySelector(".body");
      expect(body).toHaveClass("withBodyScroll");
    });

    it("applies scrollLocked class when isScrollLocked is true", () => {
      render(
        <ModalDialog
          {...defaultProps}
          displayType={ModalDialogType.aside}
          withBodyScroll
          isScrollLocked
        >
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const body = modal.querySelector(".body");
      expect(body).toHaveClass("scrollLocked");
    });
  });

  describe("Loading states", () => {
    it("shows aside loading skeleton when isLoading is true for aside", () => {
      render(
        <ModalDialog
          {...defaultProps}
          displayType={ModalDialogType.aside}
          isLoading
        >
          <ModalDialog.Body>Modal Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      const skeleton = screen.getByTestId("dialog-aside-skeleton");
      expect(skeleton).toBeInTheDocument();

      const modal = screen.getByTestId("modal");
      const loaderElements = modal.getElementsByClassName(
        "dialog-loader-header",
      );
      expect(loaderElements.length).toBeGreaterThan(0);
      expect(screen.queryByText("Modal Body Content")).not.toBeInTheDocument();
    });
  });

  describe("Custom props", () => {
    it("applies custom className", () => {
      render(
        <ModalDialog {...defaultProps} className="custom-modal">
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const dialog = modal.querySelector(".dialog");
      expect(dialog).toHaveClass("custom-modal");
    });

    it("applies custom id", () => {
      render(
        <ModalDialog {...defaultProps} id="custom-modal-id">
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = document.getElementById("custom-modal-id");
      expect(modal).toBeInTheDocument();
    });

    it("applies custom zIndex", () => {
      render(
        <ModalDialog {...defaultProps} zIndex={999}>
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      const modal = screen.getByTestId("modal");
      const backdrop = modal.querySelector(".modalBackdropActive");
      expect(backdrop).toHaveStyle({ zIndex: "999" });
    });

    it("uses custom dataTestId", () => {
      render(
        <ModalDialog {...defaultProps} dataTestId="custom-test-id">
          <ModalDialog.Body>Body</ModalDialog.Body>
        </ModalDialog>,
      );

      expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
    });
  });

  describe("Modal without sections", () => {
    it("renders modal without header", () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Body Content</ModalDialog.Body>
          <ModalDialog.Footer>Footer Content</ModalDialog.Footer>
        </ModalDialog>,
      );

      expect(screen.getByText("Body Content")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
      const modal = screen.getByTestId("modal");
      const header = modal.querySelector(".header");
      expect(header).not.toBeInTheDocument();
    });

    it("renders modal without footer", () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Header>Header Content</ModalDialog.Header>
          <ModalDialog.Body>Body Content</ModalDialog.Body>
        </ModalDialog>,
      );

      expect(screen.getByText("Header Content")).toBeInTheDocument();
      expect(screen.getByText("Body Content")).toBeInTheDocument();
      const modal = screen.getByTestId("modal");
      const footer = modal.querySelector(".footer");
      expect(footer).not.toBeInTheDocument();
    });

    it("renders modal with only body", () => {
      render(
        <ModalDialog {...defaultProps}>
          <ModalDialog.Body>Body Content Only</ModalDialog.Body>
        </ModalDialog>,
      );

      expect(screen.getByText("Body Content Only")).toBeInTheDocument();
      const modal = screen.getByTestId("modal");
      const header = modal.querySelector(".header");
      const footer = modal.querySelector(".footer");
      expect(header).not.toBeInTheDocument();
      expect(footer).not.toBeInTheDocument();
    });
  });
});
