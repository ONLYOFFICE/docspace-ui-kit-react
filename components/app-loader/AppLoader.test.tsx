import React from "react";
import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";

import AppLoader from "./index";

describe("AppLoader", () => {
  it("renders loader with correct props", () => {
    render(<AppLoader />);

    const loader = screen.getByTestId("app-loader");
    expect(loader).toBeInTheDocument();
  });
});
