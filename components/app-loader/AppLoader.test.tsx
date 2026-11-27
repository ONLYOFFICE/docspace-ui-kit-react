import React from "react";
import { describe, it, expect } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";

import AppLoader from "./index";

describe("AppLoader", () => {
  it("renders loader with correct props", () => {
    render(<AppLoader />);

    const loader = screen.getByTestId("app-loader");
    expect(loader).toBeInTheDocument();
  });

  it("puts a passed aria-* on the status region", () => {
    render(<AppLoader aria-label="Opening the portal" />);

    expect(
      screen.getByRole("status", { name: "Opening the portal" }),
    ).toBeInTheDocument();
  });

  it("announces the wait through a status region", async () => {
    render(<AppLoader />);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Loading..."),
    );
    expect(screen.getByTestId("app-loader")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("announces the label it is given", async () => {
    render(<AppLoader label="Starting the portal" />);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Starting the portal",
      ),
    );
  });
});
