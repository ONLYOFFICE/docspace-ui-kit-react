import React from "react";
import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

import { useLiveRegionTextOf } from ".";

// A child that changes its own text, without its parent rendering again.
let setChildText: (text: string) => void = () => {};
const Child = () => {
  const [text, setText] = React.useState("Loading");
  setChildText = setText;
  return <span>{text}</span>;
};

const Host = React.memo(() => {
  const ref = React.useRef<HTMLDivElement>(null);
  const text = useLiveRegionTextOf(ref);

  return (
    <>
      <div ref={ref}>
        <Child />
        <span aria-hidden="true">icon</span>
      </div>
      <span role="status">{text}</span>
    </>
  );
});

describe("useLiveRegionTextOf", () => {
  it("leaves out what is aria-hidden", async () => {
    render(<Host />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Loading"),
    );
    expect(screen.getByRole("status")).not.toHaveTextContent("icon");
  });

  it("follows content that changes without the host rendering", async () => {
    render(<Host />);
    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("Loading"));

    act(() => setChildText("Quota exceeded"));

    await waitFor(() => expect(status).toHaveTextContent("Quota exceeded"));
  });
});
