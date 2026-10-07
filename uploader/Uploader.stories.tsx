import { useState, useCallback } from "react";
import type { StoryObj, Meta } from "@storybook/react-vite";
import { expect, fireEvent, screen, userEvent, waitFor } from "storybook/test";
import { FolderType } from "@onlyoffice/docspace-api-sdk";

import { Uploader } from "./index";
import type { UploaderProps } from "./Uploader.types";
import { Toast } from "../components/toast";

import { useApi } from "../providers/api";
import { withPortalGate } from "../.storybook/decorators/PortalGate";
import FilesSelector from "../selectors/Files";
import type { TBreadCrumb } from "../components/selector/Selector.types";
import { DeviceType } from "../enums";
import { InputSize } from "../components/text-input";
import { FileInput } from "../components/file-input";
import {
  getFolderUrl as getFolderUrlHelper,
  getIsDisabled as getIsDisabledHelper,
} from "./Uploader.story.helper";

type StoryArgs = UploaderProps & {
  storyId?: string;
};

const UploaderWithFolderUrl = (args: StoryArgs) => {
  const { baseUrl } = useApi();
  const { storyId = "default", ...uploaderProps } = args;

  // Kept as the selector hands it over: a portal folder's id is a number,
  // and the Uploader picks its route by that type -- a string would send a
  // portal folder down the third-party storage route.
  const [targetId, setTargetId] = useState<string | number>("");
  const [folderPath, setFolderPath] = useState("");
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleSelectFolder = (
    selectedItemId: string | number | undefined,
    folderTitle: string,
    _isPublic: boolean,
    breadCrumbs: TBreadCrumb[],
  ) => {
    if (!selectedItemId) return;

    const path = breadCrumbs.map((crumb) => crumb.label).join(" / ");
    setTargetId(selectedItemId);
    setFolderPath(path);
    setIsSelectorVisible(false);
  };

  const getFolderUrl = useCallback(
    (folderId: string | number) => getFolderUrlHelper(baseUrl, folderId),
    [baseUrl],
  );

  const getIsDisabled = useCallback(getIsDisabledHelper, []);

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
          Target Folder:
        </label>
        <div style={{ width: "300px" }}>
          <FileInput
            fromStorage
            placeholder={folderPath || "Choose folder"}
            size={InputSize.base}
            scale
            onClick={() => setIsSelectorVisible(true)}
          />
        </div>
        {!targetId && (
          <span
            style={{
              color: "red",
              fontSize: 12,
              marginTop: 4,
              display: "block",
            }}
          >
            Required — please select a target folder
          </span>
        )}
      </div>

      {/* @ts-expect-error need pass all props */}
      <FilesSelector
        isPanelVisible={isSelectorVisible}
        embedded={false}
        currentDeviceType={DeviceType.desktop}
        currentFolderId={0}
        rootFolderType={FolderType.VirtualRooms}
        isRoomsOnly={false}
        isThirdParty={false}
        withSearch
        withBreadCrumbs
        withoutBackButton={false}
        withCancelButton
        cancelButtonLabel="Cancel"
        submitButtonLabel="Select"
        disabledItems={[]}
        getIsDisabled={getIsDisabled}
        onSubmit={handleSelectFolder}
        onCancel={() => setIsSelectorVisible(false)}
      />

      <Uploader
        {...uploaderProps}
        targetId={targetId}
        getFolderUrl={getFolderUrl}
      />
    </>
  );
};

const meta: Meta<StoryArgs> = {
  title: "Components/Uploader",
  component: Uploader,
  render: (args) => <UploaderWithFolderUrl {...args} />,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toast />
      </>
    ),
    withPortalGate("Uploader"),
  ],
  argTypes: {
    width: {
      control: "text",
      description: "Width of the uploader container",
      table: { defaultValue: { summary: "100%" } },
    },
    height: {
      control: "text",
      description: "Height of the uploader container",
      table: { defaultValue: { summary: "100%" } },
    },
    accept: {
      control: "text",
      description:
        "Accepted file types as a comma-separated string (e.g., '.pdf,.doc,.docx')",
    },
    shortText: {
      control: "text",
      description: "Short text displaying supported file extensions",
    },
    fullText: {
      control: "text",
      description:
        "Full text with all supported file extensions (shown in tooltip)",
    },
    badgeValue: {
      control: "number",
      description:
        "Number displayed in the badge showing additional formats count",
    },
    filesSettings: {
      control: "object",
      description:
        "File settings from the server (chunkUploadSize, maxUploadThreadCount, etc.)",
    },
    targetId: {
      control: false,
      description:
        "Target folder ID for uploads (managed via folder selector above the component)",
    },
    storyId: {
      control: false,
      description:
        "Unique identifier for the story to isolate targetId in sessionStorage",
    },
    linkMainText: {
      control: "text",
      description: "Main text displayed in the dropzone",
    },
    secondaryText: {
      control: "text",
      description: "Secondary text displayed in the dropzone",
    },
    isFolderUpload: {
      control: "boolean",
      description: "Enables folder upload mode",
    },
    isMultipleUpload: {
      control: "boolean",
      description: "Allows multiple files/folders upload",
    },
    maxPerUploadSize: {
      control: "text",
      description: "Maximum size per single upload (e.g. '10MB')",
    },
    maxTotalUploadSize: {
      control: "text",
      description: "Maximum total upload size (e.g. '100MB')",
    },
    getFolderUrl: {
      control: false,
      description:
        "Callback to generate folder URL for success toast link. If not provided, no link is shown.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A file uploader component that supports chunked uploads, folder uploads, and file size validation. Uses the ONLYOFFICE Apps API SDK for upload operations.",
      },
    },
  },
};

type Story = StoryObj<StoryArgs>;

const REQUIRED = "Required — please select a target folder";

const row = (label: string) => {
  const found = Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid^="selector-item-"]'),
  ).find((item) => item.textContent?.includes(label));
  if (!found) throw new Error(`No row labelled ${label}`);
  return found;
};

const toast = (text: string | RegExp) =>
  waitFor(() => expect(screen.getByText(text)).toBeVisible(), {
    timeout: 5000,
  });

// The target comes from the Files selector behind the field; the demo
// portal answers it and takes the upload.
const choosesFolder = async () => {
  await expect(screen.getByText(REQUIRED)).toBeVisible();
  await userEvent.click(screen.getByPlaceholderText("Choose folder"));
  await userEvent.click(
    await waitFor(() => row("Contracts 2026"), { timeout: 3000 }),
  );
  await waitFor(() => expect(row("Signed")).toBeVisible());
  await userEvent.click(screen.getByTestId("selector_submit_button"));
  await waitFor(() => expect(screen.queryByText(REQUIRED)).toBeNull());
  await expect(
    screen.getByPlaceholderText(/Contracts 2026$/),
  ).toBeInTheDocument();
};

const file = (name: string, type: string, size?: number) => {
  const made = new File(["demo"], name, { type });
  // A real 11 MB buffer is not needed to trip a size limit.
  if (size) Object.defineProperty(made, "size", { value: size });
  return made;
};

const MB = 1024 * 1024;

// Set on the input directly: userEvent.upload drops a file the input's
// accept refuses before the component sees it.
const drops = (files: File[]) => {
  const input = document.querySelector<HTMLInputElement>(
    '[data-testid="sdk-uploader"] input[type="file"]',
  );
  if (!input) throw new Error("No file input");
  const dataTransfer = new DataTransfer();
  for (const item of files) dataTransfer.items.add(item);
  Object.defineProperty(input, "files", {
    value: dataTransfer.files,
    configurable: true,
  });
  fireEvent.change(input);
};

const input = () =>
  document.querySelector(
    '[data-testid="sdk-uploader"] input[type="file"]',
  ) as HTMLInputElement;

const uploads = async () => {
  await choosesFolder();
  drops([file("Notes.pdf", "application/pdf")]);
  await toast("Uploaded elements: 1");
};

export default meta;

const defaultArgs: Omit<StoryArgs, "getFolderUrl"> = {
  width: "800px",
  height: "300px",
  accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  shortText: "PDF, DOC, DOCX, XLS, XLSX",
  fullText: "PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX",
  badgeValue: 2,
  linkMainText: "Upload files",
  secondaryText: "or drag and drop files here",
  isFolderUpload: false,
  isMultipleUpload: true,
};

export const Default: Story = {
  play: async () => {
    await expect(screen.getByText("Upload files")).toBeVisible();
    await uploads();
  },
  args: {
    ...defaultArgs,
    storyId: "default",
  },
};

export const SingleFileUpload: Story = {
  play: async () => {
    await uploads();
  },
  args: {
    ...defaultArgs,
    storyId: "single-file",
    linkMainText: "Upload file",
    secondaryText: "or drag and drop a file here",
    isMultipleUpload: false,
  },
};

export const FolderUpload: Story = {
  play: async () => {
    // The picker asks for a directory.
    await expect(input()).toHaveAttribute("webkitdirectory");
  },
  args: {
    ...defaultArgs,
    storyId: "folder",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload folder",
    secondaryText: "or drag and drop a folder here",
    isFolderUpload: true,
    isMultipleUpload: true,
  },
};

export const SingleFolderUpload: Story = {
  play: async () => {
    await expect(input()).toHaveAttribute("webkitdirectory");
  },
  args: {
    ...defaultArgs,
    storyId: "single-folder",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload folder",
    secondaryText: "or drag and drop a folder here",
    isFolderUpload: true,
    isMultipleUpload: false,
  },
};

export const ImageUpload: Story = {
  play: async () => {
    // A format outside accept is refused with a toast.
    drops([file("Notes.pdf", "application/pdf")]);
    await toast("1 files were rejected due to unsupported format.");
  },
  args: {
    ...defaultArgs,
    storyId: "image",
    accept: ".png,.jpg,.jpeg,.gif,.webp,.svg",
    shortText: "PNG, JPG, JPEG, GIF",
    fullText: "PNG, JPG, JPEG, GIF, WEBP, SVG",
    badgeValue: 2,
    linkMainText: "Upload images",
    secondaryText: "or drag and drop images here",
  },
};

export const WithSizeLimit: Story = {
  play: async () => {
    drops([file("Big.pdf", "application/pdf", 11 * MB)]);
    await toast("The file is too large. The maximum size is 10MB.");
  },
  args: {
    ...defaultArgs,
    storyId: "size-limit",
    linkMainText: "Upload files (max 10MB each)",
    maxPerUploadSize: "10MB",
  },
};

export const WithTotalSizeLimit: Story = {
  play: async () => {
    await choosesFolder();
    // Eleven files under the per-file limit, over the total one.
    drops(
      Array.from({ length: 11 }, (_, index) =>
        file(`Part ${index}.pdf`, "application/pdf", 9.5 * MB),
      ),
    );
    await toast("The files are too large. The maximum size is 100MB.");
  },
  args: {
    ...defaultArgs,
    storyId: "total-size-limit",
    linkMainText: "Upload files (max 100MB total)",
    maxPerUploadSize: "10MB",
    maxTotalUploadSize: "100MB",
  },
};

export const AnyFiles: Story = {
  play: async () => {
    await choosesFolder();
    drops([file("Archive.xyz", "application/octet-stream")]);
    await toast("Uploaded elements: 1");
  },
  args: {
    ...defaultArgs,
    storyId: "any-files",
    // react-dropzone 11 has no wildcard: "*" (or "*/*") refuses every file.
    // Only an empty accept lets any type through.
    accept: "",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload any files",
    secondaryText: "All file types are accepted",
  },
};

export const CustomSettings: Story = {
  play: async () => {
    await choosesFolder();
    drops([
      file("One.pdf", "application/pdf"),
      file("Two.pdf", "application/pdf"),
    ]);
    await toast("Uploaded elements: 2");
  },
  args: {
    ...defaultArgs,
    storyId: "custom-settings",

    filesSettings: {
      chunkUploadSize: 10 * 1024 * 1024,
      maxUploadThreadCount: 5,
      maxUploadFilesCount: 3,
    },

    linkMainText: "Upload with custom settings",
    secondaryText: "10MB chunks, 5 threads, 3 files at once",
  },
};
