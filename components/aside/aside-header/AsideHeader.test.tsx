import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { AsideHeader } from ".";
import styles from "./AsideHeader.module.scss";

describe("AsideHeader", () => {
  it("renders header text correctly", () => {
    const headerText = "Test Header";
    render(<AsideHeader header={headerText} />);
    expect(screen.getByTestId("text")).toHaveTextContent(headerText);
  });

  it("renders back button when isBackButton is true and handle click on it", () => {
    const onBackClick = vi.fn();
    const { container } = render(
      <AsideHeader isBackButton onBackClick={onBackClick} />,
    );

    const backButton = container.querySelector(`.${styles.arrowButton}`);
    expect(backButton).toBeInTheDocument();

    if (backButton) {
      fireEvent.click(backButton);
    }
    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it("renders close button when isCloseable is true", () => {
    const onCloseClick = vi.fn();
    render(<AsideHeader isCloseable onCloseClick={onCloseClick} />);

    const closeButton = screen.getByTestId("aside_header_close_icon_button");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });

  // The cross was named "close" in every language, the back arrow not at all.
  it("names the close cross and the back arrow from the translation", () => {
    const saved = Reflect.get(window, "i18n");
    Reflect.set(window, "i18n", {
      loaded: {
        "en/Common.json": {
          data: { CloseButton: "Schliessen", Back: "Zurueck" },
        },
      },
    });
    try {
      render(<AsideHeader isBackButton onBackClick={vi.fn()} />);
      expect(
        screen.getByTestId("aside_header_close_icon_button"),
      ).toHaveAttribute("aria-label", "Schliessen");
      expect(
        screen.getByTestId("aside_header_back_icon_button"),
      ).toHaveAttribute("aria-label", "Zurueck");
    } finally {
      Reflect.set(window, "i18n", saved);
    }
  });

  it("takes the names of the cross and the arrow from props", () => {
    render(
      <AsideHeader
        isBackButton
        onBackClick={vi.fn()}
        closeLabel="Close panel"
        backLabel="Previous step"
      />,
    );
    expect(
      screen.getByTestId("aside_header_close_icon_button"),
    ).toHaveAttribute("aria-label", "Close panel");
    expect(screen.getByTestId("aside_header_back_icon_button")).toHaveAttribute(
      "aria-label",
      "Previous step",
    );
  });

  it("renders custom header icons", () => {
    const headerIcons = [
      {
        key: "settings",
        url: "/images/settings.react.svg",
        onClick: vi.fn(),
      },
      {
        key: "info",
        url: "/images/info.react.svg",
        onClick: vi.fn(),
      },
    ];

    render(<AsideHeader headerIcons={headerIcons} />);

    const iconsContainer = screen.getByTestId("icons-container");
    expect(iconsContainer).toBeInTheDocument();
    expect(iconsContainer.children).toHaveLength(2);
  });

  it("applies custom height when headerHeight is provided", () => {
    render(<AsideHeader headerHeight="70px" />);

    const header = screen.getByTestId("aside-header");
    expect(header).toHaveClass(styles.customHeaderHeight);
  });

  it("shows loading state when isLoading is true", () => {
    render(<AsideHeader isLoading />);

    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders without border when withoutBorder is true", () => {
    render(<AsideHeader withoutBorder />);

    const header = screen.getByTestId("aside-header");
    expect(header).toHaveClass(styles.withoutBorder);
  });

  it("renders ReactNode as header content", () => {
    const CustomHeader = () => (
      <div data-testid="custom-header">Custom Header</div>
    );
    render(<AsideHeader header={<CustomHeader />} />);

    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
  });
});
