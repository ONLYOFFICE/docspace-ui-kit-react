import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import styles from "./EmptyScreenContainer.module.scss";

import { EmptyScreenContainer } from ".";

const baseProps = {
  imageSrc: "empty_screen_filter.png",
  imageAlt: "Empty Screen Filter image",
  headerText: "No results found",
  descriptionText: "No results matching your search could be found",
  buttons: <a href="/">Go to home</a>,
};

describe("<EmptyScreenContainer />", () => {
  it("renders without error", () => {
    render(<EmptyScreenContainer {...baseProps} />);
    expect(screen.getByTestId("empty-screen-container")).toBeInTheDocument();
  });

  it("renders all provided content correctly", () => {
    render(<EmptyScreenContainer {...baseProps} />);

    expect(
      screen.getByRole("img", { name: baseProps.imageAlt }),
    ).toBeInTheDocument();
    expect(screen.getByText(baseProps.headerText)).toBeInTheDocument();
    expect(screen.getByText(baseProps.descriptionText)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to home" }),
    ).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-class";
    render(<EmptyScreenContainer {...baseProps} className={customClass} />);

    const container = screen.getByTestId("empty-screen-container");
    expect(container).toHaveClass(customClass);
  });

  it("renders with subheading text when provided", () => {
    const subheadingText = "This is a subheading";
    render(
      <EmptyScreenContainer {...baseProps} subheadingText={subheadingText} />,
    );

    expect(screen.getByText(subheadingText)).toBeInTheDocument();
    expect(screen.getByTestId("empty-screen-container")).toHaveClass(
      styles.withSubheading,
    );
  });

  it("applies withoutFilter class when prop is true", () => {
    render(<EmptyScreenContainer {...baseProps} withoutFilter />);

    expect(screen.getByTestId("empty-screen-container")).toHaveClass(
      styles.withoutFilter,
    );
  });

  it("applies custom styles to image when provided", () => {
    const imageStyle = { width: "200px" };
    render(<EmptyScreenContainer {...baseProps} imageStyle={imageStyle} />);

    const image = screen.getByRole("img", { name: baseProps.imageAlt });
    expect(image).toHaveStyle(imageStyle);
  });

  it("applies custom styles to buttons when provided", () => {
    const buttonStyle = { marginTop: "20px" };
    render(<EmptyScreenContainer {...baseProps} buttonStyle={buttonStyle} />);

    const buttonsContainer = screen.getByRole("link", {
      name: "Go to home",
    }).parentElement;
    expect(buttonsContainer).toHaveStyle(buttonStyle);
  });
});
