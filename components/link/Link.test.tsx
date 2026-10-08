import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { Link, LinkType } from "./index";

// Mock CSS modules - return default export for CSS Modules
vi.mock("./Link.module.scss", () => ({
  default: {
    link: "link",
    semitransparent: "semitransparent",
    isHovered: "isHovered",
    textOverflow: "textOverflow",
    noHover: "noHover",
    enableUserSelect: "enableUserSelect",
    page: "page",
  },
}));

const baseProps = {
  type: LinkType.page,
  color: "black",
  href: "https://github.com",
};

describe("<Link />", () => {
  it("renders without error", () => {
    render(<Link {...baseProps}>link</Link>);
    expect(screen.queryByTestId("link")).toBeInTheDocument();
  });

  it("renders with custom data-testid", () => {
    render(
      <Link {...baseProps} dataTestId="custom-link">
        link
      </Link>,
    );
    expect(screen.queryByTestId("custom-link")).toBeInTheDocument();
  });

  it("renders with isBold prop", () => {
    render(
      <Link {...baseProps} isBold>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveStyle({ fontWeight: "700" });
  });

  it("renders with isHovered prop", () => {
    render(
      <Link {...baseProps} isHovered>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("isHovered");
  });

  it("renders with isSemitransparent prop", () => {
    render(
      <Link {...baseProps} isSemitransparent>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("semitransparent");
  });

  it("renders with isTextOverflow prop", () => {
    render(
      <Link {...baseProps} isTextOverflow>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("textOverflow");
  });

  it("renders with noHover prop", () => {
    render(
      <Link {...baseProps} noHover>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("noHover");
  });

  it("renders with enableUserSelect prop", () => {
    render(
      <Link {...baseProps} enableUserSelect>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("enableUserSelect");
  });

  it("renders with type prop action", () => {
    render(
      <Link {...baseProps} type={LinkType.action}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).not.toContain("page");
  });

  it("renders with custom fontSize and lineHeight", () => {
    render(
      <Link {...baseProps} fontSize="16px" lineHeight="24px">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveStyle({ fontSize: "16px", lineHeight: "24px" });
  });

  it("accepts id", () => {
    render(
      <Link {...baseProps} id="testId">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("id", "testId");
  });

  it("accepts className", () => {
    const className = "custom-class";
    render(
      <Link {...baseProps} className={className}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveClass(className);
  });

  it("sets aria-label", () => {
    render(
      <Link {...baseProps} ariaLabel="Custom label">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("aria-label", "Custom label");
  });

  it("uses children as aria-label when ariaLabel prop is not provided", () => {
    render(<Link {...baseProps}>Custom text</Link>);
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("aria-label", "Custom text");
  });

  it("renders with custom rel attribute", () => {
    render(
      <Link {...baseProps} rel="noopener">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("renders with custom tabIndex", () => {
    render(
      <Link {...baseProps} tabIndex={-1}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("tabindex", "-1");
  });
});
