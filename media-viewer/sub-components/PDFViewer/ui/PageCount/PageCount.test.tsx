import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { PageCount } from "./PageCount";
import { PageCountRef } from "./PageCount.props";

vi.mock("react-device-detect", () => ({
  isMobile: false,
}));

// Mock PanelReactSvg
vi.mock("../../../../../assets/panel.react.svg", () => {
  return {
    default: function DummyPanelSvg() {
      return <div>Panel Icon</div>;
    },
  };
});

// Mock classnames
vi.mock("classnames", () => {
  return {
    default: function dummyClassnames(...args: unknown[]) {
      return args.join(" ");
    },
  };
});

describe("PageCount", () => {
  const defaultProps = {
    visible: true,
    isPanelOpen: false,
    setIsOpenMobileDrawer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const ref = React.createRef<PageCountRef>();
    render(<PageCount {...defaultProps} ref={ref} />);

    expect(screen.getByTestId("page-count")).toBeInTheDocument();
    expect(screen.getByTestId("page-numbers")).toBeInTheDocument();
    expect(screen.getByTestId("current-page")).toHaveTextContent("0");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("0");
  });

  it("does not render when not visible", () => {
    const ref = React.createRef<PageCountRef>();
    render(<PageCount {...defaultProps} visible={false} ref={ref} />);

    expect(screen.queryByTestId("page-count")).not.toBeInTheDocument();
  });
});
