import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import useSearch from "./useSearch";

// The real SearchInput waits for typing to pause; this one reports at once.
vi.mock("../../search-input", () => ({
  SearchInput: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      data-testid="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const Harness = ({
  hostValue,
  onSearch,
}: {
  hostValue: string;
  onSearch: (value: string) => void;
}) => {
  const getSelectedInputValue = React.useCallback(() => hostValue, [hostValue]);
  const { searchComponent } = useSearch({
    onSearch,
    onClearFilter: () => {},
    clearSearch: false,
    setClearSearch: () => {},
    getSelectedInputValue,
    placeholder: "Search",
    isIndexEditingMode: false,
  });
  return searchComponent;
};

describe("useSearch", () => {
  it("ignores every stale echo of a query typed twice", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    fireEvent.change(field, { target: { value: "a" } });
    fireEvent.change(field, { target: { value: "ab" } });
    fireEvent.change(field, { target: { value: "a" } });
    expect(onSearch.mock.calls.map(([v]) => v)).toEqual(["a", "ab", "a"]);

    // The host reports each query back, slowly and in order.
    rerender(<Harness hostValue="a" onSearch={onSearch} />);
    expect(field.value).toBe("a");
    rerender(<Harness hostValue="ab" onSearch={onSearch} />);
    expect(field.value).toBe("a");
    rerender(<Harness hostValue="a" onSearch={onSearch} />);
    expect(field.value).toBe("a");

    // Everything is reported; a value of the host's own is shown.
    rerender(<Harness hostValue="ab" onSearch={onSearch} />);
    expect(field.value).toBe("ab");
  });

  it("forgets the oldest queries of a host that never reports back", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    for (let i = 0; i <= 25; i += 1) {
      fireEvent.change(field, { target: { value: `q${i}` } });
    }

    // q0 fell out of the remembered queries, so it reads as the host's own.
    rerender(<Harness hostValue="q0" onSearch={onSearch} />);
    expect(field.value).toBe("q0");
  });
});
