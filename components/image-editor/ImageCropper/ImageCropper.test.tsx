// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ImageCropper from "./index";
import type { ImageCropperProps, TImage } from "../ImageEditor.types";

const mockToDataURL = vi.fn(() => "mock-preview");
const mockGetImageScaledToCanvas = vi.fn(() => ({
  toDataURL: mockToDataURL,
}));
const mockEditorInstance = {
  getImageScaledToCanvas: mockGetImageScaledToCanvas,
};
let avatarEditorProps: any;
const mockUseTheme = vi.fn(() => ({ isBase: true }));

vi.mock("react-avatar-editor", () => {
  const React = require("react");
  const AvatarEditor = React.forwardRef((props: any, ref: any) => {
    avatarEditorProps = props;
    if (typeof ref === "function") {
      ref(mockEditorInstance);
    } else if (ref) {
      ref.current = mockEditorInstance;
    }

    return <div data-testid="avatar-editor-mock" />;
  });

  it("caps zoom in at maximum value", () => {
    const props = createProps({ image: { uploadedFile: createFile(), zoom: 4.8, x: 0, y: 0 } });
    render(<ImageCropper {...props} />);

    fireEvent.click(screen.getByTestId("zoom_in_icon_button"));

    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 5 }),
    );
  });

  it("floors zoom out at minimum value", () => {
    const props = createProps({ image: { uploadedFile: createFile(), zoom: 1.2, x: 0, y: 0 } });
    render(<ImageCropper {...props} />);

    fireEvent.click(screen.getByTestId("zoom_out_icon_button"));

    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 1 }),
    );
  });

  AvatarEditor.displayName = "MockAvatarEditor";

  return {
    __esModule: true,
    default: AvatarEditor,
  };
});

vi.mock("../../../context/ThemeContext", () => ({
  __esModule: true,
  useTheme: () => mockUseTheme(),
}));

vi.mock("../../../assets/zoom-minus.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="zoom-minus-icon" />,
}));

vi.mock("../../../assets/zoom-plus.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="zoom-plus-icon" />,
}));

vi.mock("../../../assets/icons/16/refresh.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="refresh-icon" />,
}));

const mockT = vi.fn((key: string) => key);

const createFile = () => new File(["avatar"], "avatar.png", { type: "image/png" });

const createProps = (
  overrides: Partial<ImageCropperProps> & { uploadedFile?: File | string } = {},
): ImageCropperProps => {
  const uploadedFile = overrides.uploadedFile ?? createFile();
  const image: TImage =
    overrides.image ?? ({ uploadedFile, zoom: 1, x: 0, y: 0 } as TImage);

  return {
    t: mockT,
    image,
    onChangeImage: vi.fn(),
    uploadedFile,
    setUploadedFile: vi.fn(),
    setPreviewImage: vi.fn(),
    isDisabled: false,
    disableImageRescaling: false,
    onChangeFile: vi.fn(),
    editorBorderRadius: 8,
    ...overrides,
  };
};

describe("ImageCropper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    avatarEditorProps = undefined;
    mockUseTheme.mockReturnValue({ isBase: true });
    mockEditorInstance.getImageScaledToCanvas = mockGetImageScaledToCanvas;
  });

  it("renders avatar editor and change image button", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-editor-mock")).toBeInTheDocument();
    expect(screen.getByTestId("change_image_button")).toHaveAttribute(
      "title",
      "Common:ChooseAnother",
    );
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("updates zoom through slider changes", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    fireEvent.change(screen.getByTestId("slider"), { target: { value: "2" } });

    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 2 }),
    );
  });

  it("handles zoom in and zoom out button clicks", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    fireEvent.click(screen.getByTestId("zoom_in_icon_button"));
    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 1.5 }),
    );

    fireEvent.click(screen.getByTestId("zoom_out_icon_button"));
    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 1 }),
    );
  });

  it("adjusts position through avatar editor callbacks", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(avatarEditorProps).toBeDefined();

    avatarEditorProps.onPositionChange?.({ x: 0.2, y: -0.3 });

    expect(props.onChangeImage).toHaveBeenCalledWith(
      expect.objectContaining({ x: 0.2, y: -0.3 }),
    );
  });

  it("does not adjust position when component is disabled", () => {
    const props = createProps({ isDisabled: true });
    render(<ImageCropper {...props} />);

    avatarEditorProps.onPositionChange?.({ x: 0.5, y: 0.5 });

    expect(props.onChangeImage).not.toHaveBeenCalled();
  });

  it("does not adjust position when image rescaling is disabled", () => {
    const props = createProps({ disableImageRescaling: true });
    render(<ImageCropper {...props} />);

    avatarEditorProps.onPositionChange?.({ x: -0.1, y: 0.1 });

    expect(props.onChangeImage).not.toHaveBeenCalled();
  });

  it("triggers file input interactions", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    fireEvent.click(screen.getByTestId("change_image_button"));
    expect(clickSpy).toHaveBeenCalled();

    const fileInput = screen
      .getByTestId("image-cropper")
      .querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(fileInput, "value", {
      configurable: true,
      writable: true,
      value: "should-reset",
    });

    fireEvent.click(fileInput);
    expect(fileInput.value).toBe("");

    fireEvent.change(fileInput, {
      target: { files: [createFile()] },
    });

    expect(props.onChangeFile).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it("updates preview image when avatar editor is ready", async () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(avatarEditorProps).toBeDefined();
    avatarEditorProps.onImageReady?.();

    await waitFor(() =>
      expect(props.setPreviewImage).toHaveBeenCalledWith("mock-preview"),
    );
  });

  it("handles errors while generating preview without crashing", () => {
    const errorMock = vi.fn(() => {
      throw new Error("fail");
    });
    mockEditorInstance.getImageScaledToCanvas = errorMock;
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(() => avatarEditorProps.onImageReady?.()).not.toThrow();
    expect(props.setPreviewImage).not.toHaveBeenCalled();
  });

  it("disables controls when component is disabled", () => {
    const props = createProps({ isDisabled: true });
    render(<ImageCropper {...props} />);

    const slider = screen.getByTestId("slider") as HTMLInputElement;
    expect(slider).toBeDisabled();

    slider.disabled = false;
    fireEvent.change(slider, { target: { value: "2" } });

    fireEvent.click(screen.getByTestId("zoom_in_icon_button"));
    fireEvent.click(screen.getByTestId("zoom_out_icon_button"));

    expect(props.onChangeImage).not.toHaveBeenCalled();
  });

  it("does not trigger file change when component is disabled", () => {
    const props = createProps({ isDisabled: true });
    render(<ImageCropper {...props} />);

    const fileInput = screen
      .getByTestId("image-cropper")
      .querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [createFile()] },
    });

    expect(props.onChangeFile).not.toHaveBeenCalled();
  });

  it("hides zoom controls when rescaling is disabled", () => {
    const props = createProps({ disableImageRescaling: true });
    render(<ImageCropper {...props} />);

    expect(screen.queryByTestId("slider")).not.toBeInTheDocument();
    expect(screen.queryByTestId("zoom_in_icon_button")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("zoom_out_icon_button"),
    ).not.toBeInTheDocument();
  });

  it("passes base theme color to avatar editor", () => {
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(avatarEditorProps.color).toEqual([6, 22, 38, 0.2]);
  });

  it("passes dark theme color when theme is not base", () => {
    mockUseTheme.mockReturnValue({ isBase: false });
    const props = createProps();
    render(<ImageCropper {...props} />);

    expect(avatarEditorProps.color).toEqual([20, 20, 20, 0.8]);
  });
});
