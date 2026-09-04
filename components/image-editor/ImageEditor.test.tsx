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
