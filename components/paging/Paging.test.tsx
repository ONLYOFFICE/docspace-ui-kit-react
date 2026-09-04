import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { TOption } from "../combobox";

import { Paging } from "./Paging";

const mockPageItems: TOption[] = [
  { label: "1", key: 1 },
  { label: "2", key: 2 },
];

const mockCountItems: TOption[] = [
  { label: "10", key: 10 },
  { label: "20", key: 20 },
];

describe("Paging", () => {
  it("renders with basic props", () => {
    render(
      <Paging
        previousLabel="Previous"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
        onSelectPage={vi.fn()}
        onSelectCount={vi.fn()}
      />,
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByTestId("paging")).toBeInTheDocument();
  });

  it("calls previousAction and nextAction when buttons clicked", () => {
    const prev = vi.fn();
    const next = vi.fn();

    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={prev}
        nextAction={next}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    fireEvent.click(screen.getByText("Prev"));
    fireEvent.click(screen.getByText("Next"));

    expect(prev).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("disables buttons based on props", () => {
    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        disablePrevious
        disableNext
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    const prevButton = screen.getByRole("button", { name: "Prev" });
    const nextButton = screen.getByRole("button", { name: "Next" });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("does not render count selector if showCountItem is false", () => {
    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        showCountItem={false}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("20")).not.toBeInTheDocument();
  });

  it("calls onSelectPage and onSelectCount", () => {
    const onSelectPage = vi.fn();
    const onSelectCount = vi.fn();

    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        onSelectPage={onSelectPage}
        onSelectCount={onSelectCount}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    expect(onSelectPage).not.toHaveBeenCalled();
    expect(onSelectCount).not.toHaveBeenCalled();
  });
});
