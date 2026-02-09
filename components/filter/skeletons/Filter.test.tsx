import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { FilterLoader } from "./FilterLoader";
import { FilterBlockLoader } from "./FilterBlockLoader";
import filterLoaderStyles from "./FilterLoader/FilterLoader.module.scss";
import filterBlockLoaderStyles from "./FilterBlockLoader/FilterBlockLoader.module.scss";

describe("Filter Skeleton Components", () => {
  describe("FilterLoader", () => {
    it("renders without crashing", () => {
      render(<FilterLoader />);
      const skeleton = screen.getByTestId("filter-loader");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass(filterLoaderStyles.filterLoader);
    });

    it("applies custom className", () => {
      const customClass = "custom-class";
      render(<FilterLoader className={customClass} />);
      const skeleton = screen.getByTestId("filter-loader");
      expect(skeleton).toHaveClass(customClass);
      expect(skeleton).toHaveClass(filterLoaderStyles.filterLoader);
    });
  });

  describe("FilterBlockLoader", () => {
    it("renders without crashing", () => {
      render(<FilterBlockLoader />);
      const container = screen.getByTestId("filter-block-loader");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(filterBlockLoaderStyles.filterContainer);
    });
  });
});
