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
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Images from "./index";
import { ContentType } from "../../../../../../../enums";
import type { TContent } from "../../../../../../../types/ai";
import { downloadImageAsBase64 } from "../../../../../utils";

vi.mock("../../../../../utils", () => ({
  downloadImageAsBase64: vi.fn().mockResolvedValue("data:image/png;base64,mock"),
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
      />
    );

    // Initial state: loaders
    expect(screen.getAllByTestId("loader")).toHaveLength(2);

    // Wait for downloadImageAsBase64
    await waitFor(() => {
      const renderedImages = screen.getAllByTestId("message-image");
      expect(renderedImages).toHaveLength(2);
      expect(renderedImages[0]).toHaveAttribute("src", "data:image/png;base64,mock");
    });
  });

  it("calls onClick handlers when image is clicked", async () => {
    render(
      <Images
        images={images}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />
    );

    await waitFor(() => {
        expect(screen.getAllByTestId("message-image")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("message-image")[0]);

    expect(setMediaViewerVisible).toHaveBeenCalledWith(true);
    expect(setAiPlaylistImages).toHaveBeenCalledWith([{
        title: "Test.jpg",
        fileId: 1,
        src: "https://example.com/image1.jpg"
    }]);
  });

  it("returns null when images list is empty", () => {
    const { container } = render(
      <Images
        images={[]}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />
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
