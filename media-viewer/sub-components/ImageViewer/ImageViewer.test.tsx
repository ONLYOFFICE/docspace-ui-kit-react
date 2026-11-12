import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import type { TFile } from "../../MediaViewer.types";

import { ImageViewer } from ".";
import { getCustomToolbar } from "../../MediaViewer.helpers";
import ImageViewerProps from "./ImageViewer.props";

const file: TFile = {
  shortWebUrl: "",
  isFile: true,
  access: 0,
  canShare: true,
  comment: "",
  contentLength: "",
  created: "2024-01-01T00:00:00.0000000Z",
  createdBy: {
    avatarSmall: "",
    displayName: "",
    hasAvatar: false,
    id: "",
    profileUrl: "",
  },
  denyDownload: false,
  denySharing: false,
  fileExst: ".png",
  fileStatus: 0,
  fileType: 3,
  folderId: 17,
  fileEntryType: 2,
  id: 0,
  mute: false,
  pureContentLength: 5319693,
  rootFolderId: 2,
  rootFolderType: 14,
  security: {
    Convert: true,
    Copy: true,
    CustomFilter: true,
    Delete: true,
    Download: true,
    Duplicate: true,
    Edit: true,
    EditHistory: true,
    FillForms: true,
    Lock: true,
    Move: true,
    Read: true,
    ReadHistory: true,
    Rename: true,
    Review: true,
    SubmitToFormGallery: false,
    EditForm: false,
    Comment: false,
    CreateRoomFrom: false,
    CopyLink: false,
    Embed: false,
    Vectorization: false,
  },
  shared: false,
  thumbnailStatus: 1,
  title: "image_example_1.png",
  updated: "2024-02-01T09:20:29.0000000Z",
  updatedBy: {
    avatarSmall: "",
    displayName: "",
    hasAvatar: false,
    id: "",
    profileUrl: "",
  },
  version: 1,
  versionGroup: 1,
  viewAccessibility: {
    CanConvert: false,
    CoAuhtoring: false,
    ImageView: false,
    MediaView: true,
    MustConvert: false,
    WebComment: false,
    WebCustomFilterEditing: false,
    WebEdit: false,
    WebRestrictedEditing: false,
    WebReview: false,
    WebView: false,
  },
  viewUrl:
    "https://helpcenter.onlyoffice.com/ru/images/Help/Guides/big/guide139/hyperlink_settings.png",
  webUrl:
    "https://helpcenter.onlyoffice.com/ru/images/Help/Guides/big/guide139/hyperlink_settings.png",
};

const mockProps: ImageViewerProps = {
  src: "https://example.com/image.jpg",
  imageId: 2,
  version: 3,
  errorTitle: "Error loading image",
  isFistImage: true,
  isLastImage: false,
  panelVisible: true,
  backgroundBlack: false,
  isPublicFile: true,
  toolbar: getCustomToolbar(file, true),
  generateContextMenu: () => {
    return <div>Context menu</div>;
  },
  setIsOpenContextMenu: () => {},
  resetToolbarVisibleTimer: () => {},
  mobileDetails: <div>Mobile details</div>,
  thumbnailSrc: "",
  devices: {
    isMobile: false,
    isMobileOnly: false,
    isDesktop: true,
  },
  setBackgroundBlack: () => {},
  contextModel: () => [],
};

describe("ImageViewer", () => {
  it("renders image", () => {
    const { getByTestId } = render(<ImageViewer {...mockProps} />);
    expect(getByTestId("image-content")).toHaveAttribute("src", mockProps.src);
  });

  it("renders error message when image fails to load", () => {
    const errorTitle = "Error loading image";
    const { getByTestId } = render(
      <ImageViewer {...mockProps} errorTitle={errorTitle} />,
    );
    fireEvent.error(getByTestId("image-content"));
    expect(getByTestId("message-error-title")).toHaveTextContent(errorTitle);
  });

  it("calls onMask callback when image is clicked", () => {
    const onMask = vi.fn();
    const { getByTestId } = render(
      <ImageViewer {...mockProps} onMask={onMask} />,
    );
    fireEvent.click(getByTestId("image-wrapper"));
    expect(onMask).toHaveBeenCalledTimes(1);
  });
});
