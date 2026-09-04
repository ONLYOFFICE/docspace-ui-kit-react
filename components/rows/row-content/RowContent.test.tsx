import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { Link, LinkType } from "../../link";
import { RowContent } from ".";
import { globalColors } from "../../../providers/theme";
import styles from "./RowContent.module.scss";

const mainLink = (
  <div style={{ width: "140px" }}>
    <Link
      type={LinkType.page}
      title="Main"
      isBold
      fontSize="15px"
      color={globalColors.black}
    >
      Main
    </Link>
  </div>
);

const iconLink = (
  <div>
    <Link
      type={LinkType.action}
      title="Icon"
      fontSize="12px"
      color={globalColors.gray}
    >
      Icon
    </Link>
  </div>
);

const sideLink = (
  <div style={{ width: "80px" }}>
    <Link
      type={LinkType.page}
      title="Side"
      fontSize="12px"
      color={globalColors.gray}
    >
      Side
    </Link>
  </div>
);

describe("<RowContent />", () => {
  it("renders without error", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Side")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <RowContent className={customClass}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toHaveClass(customClass);
  });

  it("applies custom id", () => {
    const customId = "custom-id";
    render(
      <RowContent id={customId}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toHaveAttribute("id", customId);
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <RowContent style={customStyle}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content").style.backgroundColor).toBe("red");
  });

  it("handles onClick event", () => {
    const onClick = vi.fn();
    render(
      <RowContent onClick={onClick}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    fireEvent.click(screen.getByTestId("row-content"));
    expect(onClick).toHaveBeenCalled();
  });

  it("disables side info when disableSideInfo is true", () => {
    render(
      <RowContent disableSideInfo>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.queryByTestId("row-content")).not.toHaveClass(
      "tabletSideInfo",
    );
  });

  it("applies side color", () => {
    const sideColor = "rgb(255, 0, 0)";
    render(
      <RowContent sideColor={sideColor}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const sideInfo = screen.getByTestId("tablet-side-info");
    expect(sideInfo).toHaveStyle({ color: sideColor });
  });

  it("renders main container with correct width", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const mainContainer = screen.getByTestId("main-container-wrapper");
    expect(mainContainer).toHaveStyle({ "--main-container-width": "140px" });
  });

  it("renders side container with correct width", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const sideContainer = screen.getByTestId("side-container");
    expect(sideContainer).toHaveStyle({ width: "40px" });
  });
});
