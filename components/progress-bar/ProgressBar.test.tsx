/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProgressBar, PreparationPortalProgress } from ".";
import styles from "./ProgressBar.module.scss";

describe("<ProgressBar />", () => {
  const defaultProps = {
    percent: 50,
  };

  it("renders without error", () => {
    render(<ProgressBar {...defaultProps} />);
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
  });

  describe("Label", () => {
    it("renders label when provided", () => {
      const label = "Uploading files...";
      render(<ProgressBar {...defaultProps} label={label} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(label)).toHaveClass(styles.fullText);
    });

    it("sets label as title attribute", () => {
      const label = "Uploading files...";
      render(<ProgressBar {...defaultProps} label={label} />);
      expect(screen.getByText(label)).toHaveAttribute("title", label);
    });
  });

  describe("Progress behavior", () => {
    it("caps progress at 100% when exceeding", () => {
      render(<ProgressBar {...defaultProps} percent={150} />);
      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar).toHaveAttribute("data-progress", "100");
    });

    it("shows infinite progress animation when enabled", () => {
      render(<ProgressBar {...defaultProps} isInfiniteProgress />);
      expect(screen.getByTestId("progress-bar-animation")).toBeInTheDocument();
    });

    it("shows regular progress bar when not infinite", () => {
      render(<ProgressBar {...defaultProps} />);
      expect(screen.getByTestId("progress-bar-percent")).toBeInTheDocument();
    });
  });

  describe("Status and error states", () => {
    it("displays status message", () => {
      const status = "Processing...";
      render(<ProgressBar {...defaultProps} status={status} />);
      const statusElement = screen.getByText(status);
      expect(statusElement.className).toContain("statusText");
      expect(statusElement).toHaveAttribute("title", status);
    });

    it("displays error message with error styling", () => {
      const error = "Upload failed";
      render(<ProgressBar {...defaultProps} error={error} />);
      const errorElement = screen.getByText(error);
      expect(errorElement.className).toContain("statusError");
      expect(errorElement).toHaveAttribute("title", error);
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-progress";
    render(<ProgressBar {...defaultProps} className={customClass} />);
    expect(screen.getByTestId("progress-bar").className).toContain(customClass);
  });
});

describe("<PreparationPortalProgress />", () => {
  it("renders without error", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(
      screen.getByTestId("preparation-portal-progress"),
    ).toBeInTheDocument();
  });

  it("renders with given percent", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(screen.getByText("42 %")).toBeInTheDocument();
  });

  it("renders with given text", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(screen.getByText("Preparation portal...")).toBeInTheDocument();
  });
});
