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

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  screen,
  createEvent,
  fireEvent,
  act,
  render,
} from "@testing-library/react";
import Dropzone from "./index";
import styles from "./Dropzone.module.scss";

describe("Dropzone", () => {
  const defaultProps = {
    isLoading: false,
    linkMainText: "Click to upload",
    linkSecondaryText: "or drag and drop files here",
    exstsText: "Supported file types: PDF, DOC, DOCX",
    accept: [".pdf", ".doc", ".docx"],

    onDrop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<Dropzone {...defaultProps} />);

    const dropzone = screen.getByTestId("dropzone");
    expect(dropzone).toBeInTheDocument();
    expect(dropzone).toHaveAttribute("aria-disabled", "false");
    expect(dropzone).toHaveAttribute("aria-busy", "false");

    expect(screen.getByTestId("dropzone-main-text")).toHaveTextContent(
      defaultProps.linkMainText,
    );
    expect(screen.getByTestId("dropzone-secondary-text")).toHaveTextContent(
      defaultProps.linkSecondaryText,
    );
    expect(screen.getByTestId("dropzone-file-types")).toHaveTextContent(
      defaultProps.exstsText,
    );
  });

  it("shows loader when isLoading is true", () => {
    render(<Dropzone {...defaultProps} isLoading />);

    const dropzone = screen.getByTestId("dropzone");
    expect(dropzone).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("disables dropzone when isDisabled is true", () => {
    render(<Dropzone {...defaultProps} isDisabled />);

    const dropzone = screen.getByTestId("dropzone");
    expect(dropzone).toHaveAttribute("aria-disabled", "true");

    const input = screen.getByTestId("dropzone-input");
    expect(input).toHaveAttribute("disabled");
  });

  it("handles file upload correctly", async () => {
    const onDrop = vi.fn();

    render(<Dropzone {...defaultProps} onDrop={onDrop} />);

    const file = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });

    const dropzone = screen.getByTestId("dropzone-input");

    const dropEvent = createEvent.drop(dropzone);
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: {
        files: [file],
        types: ["Files"],
        items: [
          {
            kind: "file",
            type: file.type,
            getAsFile: () => file,
            webkitGetAsEntry: () => ({
              isFile: true,
              isDirectory: false,
              name: file.name,
              file: (callback: (f: File) => void) => callback(file),
            }),
          },
        ],
        length: 1,
      },
    });

    await act(async () => {
      fireEvent(dropzone, dropEvent);
    });
    await new Promise(process.nextTick);
    expect(onDrop).toHaveBeenCalledWith([file]);
  });

  it("applies loading styles when isLoading is true", () => {
    render(<Dropzone {...defaultProps} isLoading />);

    const wrapper = screen.getByTestId("dropzone");
    expect(wrapper).toHaveClass(styles.isLoading);
    expect(wrapper).toHaveAttribute("aria-busy", "true");
  });

  it("renders custom text content", () => {
    const customProps = {
      ...defaultProps,
      linkMainText: "Custom upload text",
      linkSecondaryText: "Custom secondary text",
      exstsText: "Custom file types",
    };

    render(<Dropzone {...customProps} />);

    expect(screen.getByTestId("dropzone-main-text")).toHaveTextContent(
      customProps.linkMainText,
    );
    expect(screen.getByTestId("dropzone-secondary-text")).toHaveTextContent(
      customProps.linkSecondaryText,
    );
    expect(screen.getByTestId("dropzone-file-types")).toHaveTextContent(
      customProps.exstsText,
    );
  });

  it("has correct accessibility attributes", () => {
    render(<Dropzone {...defaultProps} />);

    const dropzone = screen.getByTestId("dropzone");
    const inputArea = screen.getByTestId("dropzone-input-area");
    const input = screen.getByTestId("dropzone-input");
    const textArea = screen.getByTestId("dropzone-text");
    const fileTypes = screen.getByTestId("dropzone-file-types");

    // Check ARIA attributes
    expect(dropzone).toHaveAttribute("aria-disabled", "false");
    expect(dropzone).toHaveAttribute("aria-busy", "false");

    expect(inputArea).toHaveAttribute("aria-label", "File upload area");
    expect(input).toHaveAttribute("aria-label", "File input");
    expect(textArea).toHaveAttribute("aria-live", "polite");
    expect(textArea).toHaveAttribute("aria-relevant", "additions removals");
    expect(fileTypes).toHaveAttribute("aria-label", "Supported file types");
  });
});
