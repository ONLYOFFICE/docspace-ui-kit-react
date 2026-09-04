import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { LoaderWrapper } from ".";

describe("LoaderWrapper", () => {
  it("renders children and keeps interactions enabled when idle", () => {
    render(
      <LoaderWrapper isLoading={false}>
        <span>Idle content</span>
      </LoaderWrapper>,
    );

    const wrapper = screen.getByTestId("loader-wrapper");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent("Idle content");
    // opacity uses a CSS variable for external customization
    expect(wrapper.style.opacity).toMatch(/var\(--loader-wrapper-idle-opacity/);
    expect(wrapper).toHaveStyle({ pointerEvents: "auto" });
  });

  it("dims children and disables pointer events when loading", () => {
    render(
      <LoaderWrapper isLoading>
        <button type="button">Action</button>
      </LoaderWrapper>,
    );

    const wrapper = screen.getByTestId("loader-wrapper");
    // opacity uses a CSS variable for external customization
    expect(wrapper.style.opacity).toMatch(/var\(--loader-wrapper-loading-opacity/);
    expect(wrapper).toHaveStyle({ pointerEvents: "none" });
  });
});
