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

  it("announces the wait through a status region", () => {
    render(<AppLoader />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading content, please wait.",
    );
    expect(screen.getByTestId("app-loader")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("announces the label it is given", () => {
    render(<AppLoader label="Starting the portal" />);

    expect(screen.getByRole("status")).toHaveTextContent("Starting the portal");
  });
});
