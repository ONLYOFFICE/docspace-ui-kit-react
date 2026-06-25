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
import { render, screen } from "@testing-library/react";
import { ImageEditor } from "./index";
import { TImage } from "./ImageEditor.types";

vi.mock("react-avatar-editor", () => ({
  default: function AvatarEditor() {
    return null;
  },
}));

vi.mock("react-svg", () => ({
  ReactSVG: () => null,
}));

const mockT = (key: string) => key;
const mockOnChangeImage = vi.fn();
const mockSetPreview = vi.fn();
const mockOnChangeFile = vi.fn();

const defaultProps = {
  t: mockT,
  image: {
    uploadedFile: undefined,
    zoom: 1,
    x: 0,
    y: 0,
  } as TImage,
  onChangeImage: mockOnChangeImage,
  Preview: <div data-testid="preview">Preview</div>,
  setPreview: mockSetPreview,
  isDisabled: false,
  editorBorderRadius: 8,
  onChangeFile: mockOnChangeFile,
};

describe("ImageEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<ImageEditor {...defaultProps} />);
  });

  it("does not render preview for default avatar", () => {
    const props = {
      ...defaultProps,
      image: {
        ...defaultProps.image,
        uploadedFile: "default_user_photo.jpg",
      },
    };

    render(<ImageEditor {...props} />);
    expect(screen.queryByTestId("preview")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const className = "custom-class";
    render(<ImageEditor {...defaultProps} className={className} />);
    expect(screen.getByRole("region")).toHaveClass(className);
  });

  it("handles image rescaling when enabled", () => {
    const props = {
      ...defaultProps,
      image: {
        uploadedFile: new File([""], "test.jpg", { type: "image/jpeg" }),
        zoom: 1,
        x: 0,
        y: 0,
      } as TImage,
      disableImageRescaling: false,
    };

    render(<ImageEditor {...props} />);
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("disables editor when isDisabled is true", () => {
    const props = {
      ...defaultProps,
      image: {
        uploadedFile: new File([""], "test.jpg", { type: "image/jpeg" }),
        zoom: 1,
        x: 0,
        y: 0,
      } as TImage,
      isDisabled: true,
    };

    render(<ImageEditor {...props} />);
    expect(screen.getByTestId("image-cropper")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
