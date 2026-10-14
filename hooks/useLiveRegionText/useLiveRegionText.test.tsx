import React from "react";
import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

import { LIVE_REGION_DELAY, useLiveRegionTextOf } from ".";

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

  it("follows DOM changes in an element swapped in under the same ref", async () => {
    const Swapper = ({ second }: { second: boolean }) => {
      const ref = React.useRef<HTMLDivElement>(null);
      const text = useLiveRegionTextOf(ref);

      return (
        <>
          {second ? (
            <div key="second" ref={ref} data-testid="second">
              Second
            </div>
          ) : (
            <div key="first" ref={ref}>
              First
            </div>
          )}
          <span role="status">{text}</span>
        </>
      );
    };

    const { rerender } = render(<Swapper second={false} />);
    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("First"));

    rerender(<Swapper second />);
    await waitFor(() => expect(status).toHaveTextContent("Second"));

    // Changed outside React: only a MutationObserver on the new node sees it.
    act(() => {
      screen.getByTestId("second").textContent = "Updated";
    });

    await waitFor(() => expect(status).toHaveTextContent("Updated"));
  });
  it("follows DOM changes in an element mounted after the delay", async () => {
    const Late = ({ shown }: { shown: boolean }) => {
      const ref = React.useRef<HTMLDivElement>(null);
      const text = useLiveRegionTextOf(ref);

      return (
        <>
          {shown ? (
            <div ref={ref} data-testid="late">
              Late
            </div>
          ) : null}
          <span role="status">{text}</span>
        </>
      );
    };

    const { rerender } = render(<Late shown={false} />);
    // Past LIVE_REGION_DELAY with nothing under the ref.
    await new Promise((resolve) => setTimeout(resolve, LIVE_REGION_DELAY * 2));

    rerender(<Late shown />);
    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("Late"));

    act(() => {
      screen.getByTestId("late").textContent = "Updated";
    });

    await waitFor(() => expect(status).toHaveTextContent("Updated"));
  });
});
