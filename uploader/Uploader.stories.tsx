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

import { useState, useCallback } from "react";
import type { StoryObj, Meta } from "@storybook/react-vite";
import { FolderType } from "@onlyoffice/docspace-api-sdk";

import { Uploader } from "./index";
import type { UploaderProps } from "./Uploader.types";
import { Toast } from "../components/toast";

import { useApi } from "../providers/api";
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

  const TARGET_ID_KEY = `uploader-target-id-${storyId}`;

  const [targetId, setTargetId] = useState(
    () => sessionStorage.getItem(TARGET_ID_KEY) || "",
  );
  const [folderPath, setFolderPath] = useState(
    () => sessionStorage.getItem(`${TARGET_ID_KEY}-path`) || "",
  );
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleSelectFolder = (
    selectedItemId: string | number | undefined,
    folderTitle: string,
    _isPublic: boolean,
    breadCrumbs: TBreadCrumb[],
  ) => {
    if (!selectedItemId) return;

    const idStr = String(selectedItemId);
    const path = breadCrumbs.map((crumb) => crumb.label).join(" / ");
    setTargetId(idStr);
    setFolderPath(path);
    sessionStorage.setItem(TARGET_ID_KEY, idStr);
    sessionStorage.setItem(`${TARGET_ID_KEY}-path`, path);
    setIsSelectorVisible(false);
  };

  const getFolderUrl = useCallback(
    (folderId: number) => getFolderUrlHelper(baseUrl, folderId),
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
          "A file uploader component that supports chunked uploads, folder uploads, and file size validation. Uses the DocSpace API SDK for upload operations.",
      },
    },
  },
};

type Story = StoryObj<StoryArgs>;

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
  args: {
    ...defaultArgs,
    storyId: "default",
  },
};

export const SingleFileUpload: Story = {
  args: {
    ...defaultArgs,
    storyId: "single-file",
    linkMainText: "Upload file",
    secondaryText: "or drag and drop a file here",
    isMultipleUpload: false,
  },
};

export const FolderUpload: Story = {
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
  args: {
    ...defaultArgs,
    storyId: "size-limit",
    linkMainText: "Upload files (max 10MB each)",
    maxPerUploadSize: "10MB",
  },
};

export const WithTotalSizeLimit: Story = {
  args: {
    ...defaultArgs,
    storyId: "total-size-limit",
    linkMainText: "Upload files (max 100MB total)",
    maxPerUploadSize: "10MB",
    maxTotalUploadSize: "100MB",
  },
};

export const AnyFiles: Story = {
  args: {
    ...defaultArgs,
    storyId: "any-files",
    accept: "*",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload any files",
    secondaryText: "All file types are accepted",
  },
};

export const CustomSettings: Story = {
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
