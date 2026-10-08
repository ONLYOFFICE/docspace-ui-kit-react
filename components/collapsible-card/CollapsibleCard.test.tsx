import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { CollapsibleCard } from "./CollapsibleCard";

const getHeader = () => screen.getByRole("button", { name: /details/i });

const expectCollapsed = () => {
  const header = getHeader();
  expect(header).toHaveAttribute("aria-expanded", "false");
  expect(header).not.toHaveAttribute("aria-controls");
  expect(screen.queryByText("Body content")).not.toBeInTheDocument();
};

const expectExpanded = () => {
  const header = getHeader();
  expect(header).toHaveAttribute("aria-expanded", "true");
  const controls = header.getAttribute("aria-controls");
  expect(controls).toBeTruthy();
  const body = document.getElementById(controls as string);
  expect(body).toBeInTheDocument();
  expect(body).toHaveTextContent("Body content");
};

describe("CollapsibleCard", () => {
  describe("uncontrolled", () => {
    it("starts collapsed with no aria-controls by default", () => {
      render(<CollapsibleCard title="Details">Body content</CollapsibleCard>);
      expectCollapsed();
    });

    it("starts expanded with aria-controls naming the body when defaultOpen", () => {
      render(
        <CollapsibleCard title="Details" defaultOpen>
          Body content
        </CollapsibleCard>,
      );
      expectExpanded();
    });

    it("toggles its own state and reports each change via onToggle", () => {
      const onToggle = vi.fn();
      render(
        <CollapsibleCard title="Details" onToggle={onToggle}>
          Body content
        </CollapsibleCard>,
      );

      fireEvent.click(getHeader());
      expect(onToggle).toHaveBeenLastCalledWith(true);
      expectExpanded();

      fireEvent.click(getHeader());
      expect(onToggle).toHaveBeenLastCalledWith(false);
      expectCollapsed();
    });

    it("omits aria-controls when open without children", () => {
      render(<CollapsibleCard title="Details" defaultOpen />);
      const header = getHeader();
      expect(header).toHaveAttribute("aria-expanded", "true");
      expect(header).not.toHaveAttribute("aria-controls");
    });
  });

  describe("controlled", () => {
    it("does not change state on click until the parent updates isOpen", () => {
      const onToggle = vi.fn();
      const { rerender } = render(
        <CollapsibleCard title="Details" isOpen={false} onToggle={onToggle}>
          Body content
        </CollapsibleCard>,
      );

      fireEvent.click(getHeader());
      expect(onToggle).toHaveBeenCalledWith(true);
      expectCollapsed();

      rerender(
        <CollapsibleCard title="Details" isOpen onToggle={onToggle}>
          Body content
        </CollapsibleCard>,
      );
      expectExpanded();
    });

    it("follows isOpen driven by a parent through onToggle", () => {
      const Parent = () => {
        const [open, setOpen] = useState(true);
        return (
          <CollapsibleCard title="Details" isOpen={open} onToggle={setOpen}>
            Body content
          </CollapsibleCard>
        );
      };
      render(<Parent />);

      expectExpanded();
      fireEvent.click(getHeader());
      expectCollapsed();
      fireEvent.click(getHeader());
      expectExpanded();
    });
  });
});
