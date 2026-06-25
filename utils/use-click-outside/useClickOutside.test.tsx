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

import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { useClickOutside } from "./index";

const TestComponent = ({ onClickOutside }: { onClickOutside: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClickOutside);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside Element
      </div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

const TestComponentWithDeps = ({
  onClickOutside,
  enabled,
}: {
  onClickOutside: () => void;
  enabled: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClickOutside, undefined, enabled);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside Element
      </div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

const TestComponentWithState = () => {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div>
      {isOpen && (
        <div ref={ref} data-testid="dropdown">
          Dropdown Content
        </div>
      )}
      <button data-testid="toggle" type="button">
        Toggle
      </button>
      <div data-testid="status">{isOpen ? "open" : "closed"}</div>
    </div>
  );
};

const TestComponentWithNestedElements = ({
  onClickOutside,
}: {
  onClickOutside: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClickOutside);

  return (
    <div>
      <div ref={ref} data-testid="container">
        <div data-testid="nested-child">
          <span data-testid="deeply-nested">Deeply Nested</span>
        </div>
      </div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

describe("useClickOutside", () => {
  describe("Basic functionality", () => {
    it("should call handler when clicking outside the element", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      const outsideElement = screen.getByTestId("outside");
      fireEvent.mouseDown(outsideElement);

      expect(handleClickOutside).toHaveBeenCalledTimes(1);
    });

    it("should not call handler when clicking inside the element", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      const insideElement = screen.getByTestId("inside");
      fireEvent.mouseDown(insideElement);

      expect(handleClickOutside).not.toHaveBeenCalled();
    });

    it("should not call handler when clicking on nested children", () => {
      const handleClickOutside = vi.fn();
      render(
        <TestComponentWithNestedElements onClickOutside={handleClickOutside} />,
      );

      const nestedChild = screen.getByTestId("nested-child");
      fireEvent.mouseDown(nestedChild);

      expect(handleClickOutside).not.toHaveBeenCalled();
    });

    it("should not call handler when clicking on deeply nested elements", () => {
      const handleClickOutside = vi.fn();
      render(
        <TestComponentWithNestedElements onClickOutside={handleClickOutside} />,
      );

      const deeplyNested = screen.getByTestId("deeply-nested");
      fireEvent.mouseDown(deeplyNested);

      expect(handleClickOutside).not.toHaveBeenCalled();
    });
  });

  describe("Event handling", () => {
    it("should respond to mousedown events", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      const outsideElement = screen.getByTestId("outside");
      fireEvent.mouseDown(outsideElement);

      expect(handleClickOutside).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple clicks outside", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      const outsideElement = screen.getByTestId("outside");
      fireEvent.mouseDown(outsideElement);
      fireEvent.mouseDown(outsideElement);
      fireEvent.mouseDown(outsideElement);

      expect(handleClickOutside).toHaveBeenCalledTimes(3);
    });
  });

  describe("State management", () => {
    it("should work with component state (close dropdown on outside click)", () => {
      render(<TestComponentWithState />);

      expect(screen.getByTestId("status")).toHaveTextContent("open");
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();

      const toggleButton = screen.getByTestId("toggle");
      fireEvent.mouseDown(toggleButton);

      expect(screen.getByTestId("status")).toHaveTextContent("closed");
      expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
    });

    it("should not close when clicking inside the dropdown", () => {
      render(<TestComponentWithState />);

      const dropdown = screen.getByTestId("dropdown");
      fireEvent.mouseDown(dropdown);

      expect(screen.getByTestId("status")).toHaveTextContent("open");
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });
  });

  describe("Cleanup", () => {
    it("should remove event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
      const handleClickOutside = vi.fn();

      const { unmount } = render(
        <TestComponent onClickOutside={handleClickOutside} />,
      );
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it("should add event listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");
      const handleClickOutside = vi.fn();

      render(<TestComponent onClickOutside={handleClickOutside} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
        undefined,
      );

      addEventListenerSpy.mockRestore();
    });
  });

  describe("Dependencies", () => {
    it("should work with additional dependencies", () => {
      const handleClickOutside = vi.fn();
      const { rerender } = render(
        <TestComponentWithDeps onClickOutside={handleClickOutside} enabled />,
      );

      const outsideElement = screen.getByTestId("outside");
      fireEvent.mouseDown(outsideElement);

      expect(handleClickOutside).toHaveBeenCalledTimes(1);

      // Rerender with different dep
      rerender(
        <TestComponentWithDeps
          onClickOutside={handleClickOutside}
          enabled={false}
        />,
      );

      fireEvent.mouseDown(outsideElement);

      expect(handleClickOutside).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge cases", () => {
    it("should handle clicking on document body", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      fireEvent.mouseDown(document.body);

      expect(handleClickOutside).toHaveBeenCalledTimes(1);
    });

    it("should handle rapid successive clicks", () => {
      const handleClickOutside = vi.fn();
      render(<TestComponent onClickOutside={handleClickOutside} />);

      const outsideElement = screen.getByTestId("outside");

      for (let i = 0; i < 10; i++) {
        fireEvent.mouseDown(outsideElement);
      }

      expect(handleClickOutside).toHaveBeenCalledTimes(10);
    });
  });
});
