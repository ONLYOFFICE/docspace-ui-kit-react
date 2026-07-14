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
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Images from "./index";
import { ContentType } from "../../../../../../../enums";
import type { TContent } from "../../../../../../../types/ai";
import { downloadImageAsBase64 } from "../../../../../utils";

vi.mock("../../../../../utils", () => ({
  downloadImageAsBase64: vi
    .fn()
    .mockResolvedValue("data:image/png;base64,mock"),
}));

vi.mock("../../../../../../../components/loader", () => ({
  Loader: () => <div data-testid="loader" />,
  LoaderTypes: { track: "track" },
}));

describe("Images component", () => {
  const images: TContent[] = [
    {
      type: ContentType.Images,
      id: 1,
      url: "https://example.com/image1.jpg",
      fileType: 1,
    } as TContent,
    {
      type: ContentType.Images,
      id: 2,
      url: "https://example.com/image2.jpg",
      fileType: 1,
    } as TContent,
  ];

  const setAiPlaylistImages = vi.fn();
  const setMediaViewerVisible = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader initially and then images", async () => {
    render(
      <Images
        images={images}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />,
    );

    // Initial state: loaders
    expect(screen.getAllByTestId("loader")).toHaveLength(2);

    // Wait for downloadImageAsBase64
    await waitFor(() => {
      const renderedImages = screen.getAllByTestId("message-image");
      expect(renderedImages).toHaveLength(2);
      expect(renderedImages[0]).toHaveAttribute(
        "src",
        "data:image/png;base64,mock",
      );
    });
  });

  it("calls onClick handlers when image is clicked", async () => {
    render(
      <Images
        images={images}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("message-image")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("message-image")[0]);

    expect(setMediaViewerVisible).toHaveBeenCalledWith(true);
    expect(setAiPlaylistImages).toHaveBeenCalledWith([
      {
        title: "Test.jpg",
        fileId: 1,
        src: "https://example.com/image1.jpg",
      },
    ]);
  });

  it("returns null when images list is empty", () => {
    const { container } = render(
      <Images
        images={[]}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not call handlers when not provided", async () => {
    render(<Images images={images} />);

    await waitFor(() => {
      expect(screen.getAllByTestId("message-image")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("message-image")[0]);

    expect(setMediaViewerVisible).not.toHaveBeenCalled();
    expect(setAiPlaylistImages).not.toHaveBeenCalled();
  });
});
