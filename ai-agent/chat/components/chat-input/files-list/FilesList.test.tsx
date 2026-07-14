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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import FilesList from "./index";
import type { FilesListProps } from "../../../Chat.types";
import { downloadImageAsBase64 } from "../../../utils";

// Mock implementation of downloadImageAsBase64
vi.mock("../../../utils", () => ({
  downloadImageAsBase64: vi.fn(),
}));

// Mock components
vi.mock("react-svg", () => ({
  ReactSVG: ({ src }: { src: string }) => (
    <div data-testid="file-icon" data-src={src} />
  ),
}));

vi.mock("../../../../../components/text", () => ({
  Text: ({
    children,
    truncate,
  }: {
    children: React.ReactNode;
    truncate?: boolean;
  }) => (
    <div data-testid="text" data-truncate={truncate}>
      {children}
    </div>
  ),
}));

vi.mock("../../../../../components/icon-button", () => ({
  IconButton: (props: Record<string, unknown>) => (
    <button
      onClick={props.onClick as () => void}
      data-testid={props["dataTestId"] as string}
    >
      remove
    </button>
  ),
}));

vi.mock("../../../../../components/scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scrollbar">{children}</div>
  ),
}));

vi.mock("../../../../../components/loader", () => ({
  Loader: () => <div data-testid="loader" />,
  LoaderTypes: { track: "track" },
}));

// Mock Assets
vi.mock("../../../../../assets/remove.session.svg", () => ({
  default: () => <svg />,
}));

describe("<FilesList />", () => {
  const mockGetIcon = vi.fn((size, exst) => `icon-${exst}-${size}`);
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: FilesListProps = {
    files: [{ id: 1, title: "file.docx", fileExst: ".docx", viewUrl: "url" }],
    getIcon: mockGetIcon,
    onRemove: mockOnRemove,
    multimodal: {
      image: { formats: [".png", ".jpg"] },
    } as unknown as FilesListProps["multimodal"],
  };

  it("renders null if no files", () => {
    const { container } = render(<FilesList {...defaultProps} files={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders file icon and title for non-image files", () => {
    render(<FilesList {...defaultProps} />);
    expect(screen.getByTestId("file-icon")).toHaveAttribute(
      "data-src",
      "icon-.docx-24",
    );
    expect(screen.getByText("file")).toBeInTheDocument();
    expect(screen.getByText(".docx")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", () => {
    render(<FilesList {...defaultProps} />);
    const removeButton = screen.getByTestId("remove-file-button");
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith(defaultProps.files[0]);
  });

  it("renders image and handles multimodal download", async () => {
    const imgFile = {
      id: 2,
      title: "image.png",
      fileExst: ".png",
      viewUrl: "img-url",
    };
    vi.mocked(downloadImageAsBase64).mockResolvedValue("base64-content");

    render(<FilesList {...defaultProps} files={[imgFile]} />);

    // Initially loader since download is async
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute("src", "base64-content");
    });

    expect(downloadImageAsBase64).toHaveBeenCalledWith("img-url");
  });
});
