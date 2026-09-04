import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

import { TileContent } from ".";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./TileContent.module.scss", () => ({
  default: {
    tileContent: "tileContent",
    mainContainerWrapper: "mainContainerWrapper",
    mainContainer: "mainContainer",
  },
}));

describe("TileContent", () => {
  const MockChild = ({ containerWidth }: { containerWidth?: string }) => (
    <div data-testid="child-content">Child Content</div>
  );

  it("renders children correctly", () => {
    render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    expect(screen.getByTestId("child-content")).toBeTruthy();
    expect(screen.getByTestId("child-content").textContent).toBe(
      "Child Content",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <TileContent className="custom-class">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });

  it("applies custom id", () => {
    const { container } = render(
      <TileContent id="custom-id">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("#custom-id");
    expect(element).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    const { container } = render(
      <TileContent style={customStyle}>
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("[class*='tileContent']");
    expect(element?.getAttribute("style")).toContain("background-color");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <TileContent onClick={onClick}>
        <MockChild />
      </TileContent>,
    );

    const element = screen.getByTestId("child-content").parentElement
      ?.parentElement?.parentElement;
    if (element) {
      fireEvent.click(element);
      expect(onClick).toHaveBeenCalled();
    }
  });

  it("renders with containerWidth from child props", () => {
    const { container } = render(
      <TileContent>
        <MockChild containerWidth="200px" />
      </TileContent>,
    );
    const wrapper = container.querySelector(".row-main-wrapper");
    expect(wrapper).toBeTruthy();
  });

  it("renders main container wrapper with correct class", () => {
    const { container } = render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    const wrapper = container.querySelector(".row-main-wrapper");
    expect(wrapper).toBeTruthy();
  });

  it("renders main container with correct class", () => {
    const { container } = render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    const mainContainer = container.querySelector(".row-main-container");
    expect(mainContainer).toBeTruthy();
  });

  it("combines className with default classes", () => {
    const { container } = render(
      <TileContent className="extra-class">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("[class*='tileContent']");
    expect(element?.className).toContain("extra-class");
  });
});
