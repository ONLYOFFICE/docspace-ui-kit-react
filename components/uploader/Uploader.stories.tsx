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

import type { StoryObj, Meta } from "@storybook/react-vite";

import { Uploader } from ".";
import type { UploaderProps } from "./Uploader.types";

type StoryArgs = UploaderProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Interactive elements/Uploader",
  component: Uploader,
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
      control: "text",
      description: "Target folder ID for uploads",
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

const defaultArgs: StoryArgs = {
  width: "100%",
  height: "600px",
  accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  shortText: "PDF, DOC, DOCX, XLS, XLSX",
  fullText: "PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX",
  badgeValue: 2,
  targetId: "61822",
  linkMainText: "Upload files",
  secondaryText: "or drag and drop files here",
  isFolderUpload: false,
  isMultipleUpload: true,
};

export const Default: Story = {
  args: defaultArgs,
};

export const SingleFileUpload: Story = {
  args: {
    ...defaultArgs,
    linkMainText: "Upload file",
    secondaryText: "or drag and drop a file here",
    isMultipleUpload: false,
  },
};

export const FolderUpload: Story = {
  args: {
    ...defaultArgs,
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
    linkMainText: "Upload files (max 10MB each)",
    maxPerUploadSize: "10MB",
  },
};

export const WithTotalSizeLimit: Story = {
  args: {
    ...defaultArgs,
    linkMainText: "Upload files (max 100MB total)",
    maxPerUploadSize: "10MB",
    maxTotalUploadSize: "100MB",
  },
};

export const AnyFiles: Story = {
  args: {
    ...defaultArgs,
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
    filesSettings: {
      chunkUploadSize: 10 * 1024 * 1024,
      maxUploadThreadCount: 5,
      maxUploadFilesCount: 3,
    },
    linkMainText: "Upload with custom settings",
    secondaryText: "10MB chunks, 5 threads, 3 files at once",
  },
};
