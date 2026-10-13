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
  revision = 0,
  clearSearch = false,
}: {
  hostValue: string;
  onSearch: (value: string) => void;
  // A new getter for the same value, as the host makes on any filter change.
  revision?: number;
  clearSearch?: boolean;
}) => {
  const getSelectedInputValue = React.useCallback(
    () => hostValue,
    [hostValue, revision],
  );
  const { searchComponent } = useSearch({
    onSearch,
    onClearFilter: () => {},
    clearSearch,
    setClearSearch: () => {},
    getSelectedInputValue,
    placeholder: "Search",
    isIndexEditingMode: false,
  });
  return searchComponent;
};

describe("useSearch", () => {
  it("ignores a stale echo of a query the user has replaced", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    fireEvent.change(field, { target: { value: "a" } });
    fireEvent.change(field, { target: { value: "ab" } });
    expect(onSearch.mock.calls.map(([v]) => v)).toEqual(["a", "ab"]);

    // The host reports "a" late, after the user has typed on.
    rerender(<Harness hostValue="a" onSearch={onSearch} />);
    expect(field.value).toBe("ab");
  });

  // The portal aborts the search a newer one replaces, so it reports only the
  // last query of a burst.
  it("settles a burst when only its last query is reported", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    fireEvent.change(field, { target: { value: "a" } });
    fireEvent.change(field, { target: { value: "ab" } });
    fireEvent.change(field, { target: { value: "a" } });

    rerender(<Harness hostValue="a" onSearch={onSearch} />);
    expect(field.value).toBe("a");

    // Nothing is pending any more, so the host's own "ab" (a saved filter,
    // navigation) is shown.
    rerender(<Harness hostValue="ab" onSearch={onSearch} />);
    expect(field.value).toBe("ab");
  });

  // The burst ends on the value the host already has, so its report is the
  // same value again; the burst is settled all the same.
  it("settles a burst that ends on the value the host already has", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="a" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;
    expect(field.value).toBe("a");

    fireEvent.change(field, { target: { value: "ab" } });
    fireEvent.change(field, { target: { value: "a" } });

    rerender(<Harness hostValue="a" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("a");

    // Back navigation restores the host's own "ab" later on.
    rerender(<Harness hostValue="ab" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("ab");
  });

  // The known cost of settling on a repeat: a new getter for another filter
  // looks like the echo, so a late "ab" the host applied before aborting it
  // is shown until its "a" arrives. Pinned so a change to it is deliberate.
  it("shows a late replaced query briefly after an unrelated getter change", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="a" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    fireEvent.change(field, { target: { value: "ab" } });
    fireEvent.change(field, { target: { value: "a" } });

    // Another filter changes before the search is answered.
    rerender(<Harness hostValue="a" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("a");

    rerender(<Harness hostValue="ab" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("ab");

    rerender(<Harness hostValue="a" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("a");
  });

  it("takes the host's previous value again after a clear", () => {
    const onSearch = vi.fn();
    const { rerender } = render(<Harness hostValue="a" onSearch={onSearch} />);
    const field = screen.getByTestId("search") as HTMLInputElement;

    rerender(<Harness hostValue="a" clearSearch onSearch={onSearch} />);
    expect(field.value).toBe("");

    // The host resets clearSearch and hands back its value under a new getter.
    rerender(<Harness hostValue="a" revision={1} onSearch={onSearch} />);
    expect(field.value).toBe("a");
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
