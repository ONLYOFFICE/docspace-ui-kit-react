/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Files from "./index";
import { ContentType } from "../../../../../../../enums";
import type { TContent } from "../../../../../../../types/ai";
import { openFileInEditor } from "../../../../../utils";

vi.mock("../../../../../utils", () => ({
  openFileInEditor: vi.fn(),
}));

vi.mock("../../../../../../../providers/api", () => ({
  useApi: () => ({ baseUrl: "mock-url" }),
}));

vi.mock("../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("react-svg", () => ({
  ReactSVG: ({ src }: { src: string }) => (
    <div data-testid="file-icon" data-src={src} />
  ),
}));

describe("Files component", () => {
  const mockGetIcon = vi.fn((size, ext) => `icon-${size}-${ext}`);
  const defaultProps = {
    files: [
      {
        type: ContentType.Files,
        id: 1,
        title: "document.docx",
        extension: ".docx",
      },
      {
        type: ContentType.Files,
        id: 2,
        title: "image.png",
        extension: ".png",
      },
    ] as TContent[],
    getIcon: mockGetIcon,
    openFile: vi.fn(),
  };

  it("renders list of files with correct information", () => {
    render(<Files {...defaultProps} />);

    const fileItems = screen.getAllByTestId("file-item");
    expect(fileItems).toHaveLength(2);

    expect(screen.getByText("document")).toBeInTheDocument();
    expect(screen.getByText(".docx")).toBeInTheDocument();
    expect(screen.getByText("image")).toBeInTheDocument();
    expect(screen.getByText(".png")).toBeInTheDocument();
  });

  it("calls openFile prop when a file item is clicked", () => {
    render(<Files {...defaultProps} />);

    const fileItems = screen.getAllByTestId("file-item");
    fireEvent.click(fileItems[0]);

    expect(defaultProps.openFile).toHaveBeenCalledWith("1");
  });

  it("calls openFileInEditor from utils when openFile prop is not provided", () => {
    const propsWithoutOpenFile = { ...defaultProps, openFile: undefined };
    render(<Files {...propsWithoutOpenFile} />);

    const fileItems = screen.getAllByTestId("file-item");
    fireEvent.click(fileItems[0]);

    expect(openFileInEditor).toHaveBeenCalledWith("1", "mock-url");
  });

  it("returns null when files list is empty", () => {
    const { container } = render(<Files {...defaultProps} files={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies reverse class when reverse prop is true", () => {
    // We can check classes if we mock styles, but here we can just verify it renders
    const { container } = render(<Files {...defaultProps} reverse={true} />);
    expect(container.firstChild).toHaveClass(/reverse/);
  });

  it("handles non-file content types by not rendering them", () => {
    const mixedFiles = [
      ...defaultProps.files,
      { type: ContentType.Text, text: "should not render" } as TContent,
    ];
    render(<Files {...defaultProps} files={mixedFiles} />);

    expect(screen.getAllByTestId("file-item")).toHaveLength(2);
  });
});
