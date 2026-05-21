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

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Dropzone from ".";

const meta = {
  title: "UI/Interactive elements/Dropzone",
  component: Dropzone,
  parameters: {
    docs: {
      description: {
        component: `A component for handling file uploads through drag and drop or file selection.

### Features

- **File Upload**: Click to select or drag and drop files
- **Folder Upload**: Upload entire folders with directory structure preserved
- **Multiple / Single Upload**: Toggle between single and multiple file or folder uploads
- **Loading State**: Display a loader or progress bar during upload
- **Accepted Formats**: Restrict uploads to specific file types
- **Max Files**: Set a maximum number of files allowed per upload
- **Expandable Formats List**: Show supported formats with an expandable dropdown

### Usage

\`\`\`tsx
import { Dropzone } from "@docspace/ui-kit/components/dropzone";

// Basic file upload
<Dropzone
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
  onDrop={(files) => handleUpload(files)}
/>

// Folder upload
<Dropzone
  isFolderUpload
  linkMainText="Click to upload folder"
  linkSecondaryText="or drag and drop folders here"
  onDrop={(files) => handleFolderUpload(files)}
/>

// Single file with loading state
<Dropzone
  isLoading
  uploadPercent={45}
  linkMainText="Uploading..."
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Shows loading state of the dropzone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    uploadPercent: {
      control: "number",
      description:
        "Upload progress percentage. When provided during loading, shows a progress bar instead of a spinner",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the dropzone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFolderUpload: {
      control: "boolean",
      description: "Enables folder upload mode instead of file upload",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMultipleUpload: {
      control: "boolean",
      description:
        "Allows multiple files/folders upload. When false, only one item is accepted",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    linkMainText: {
      control: "text",
      description: "Main text displayed in the dropzone",
    },
    linkSecondaryText: {
      control: "text",
      description: "Secondary text displayed in the dropzone",
    },
    exstsText: {
      control: "text",
      description: "Text displaying supported file types",
    },
    fullExstsText: {
      control: "text",
      description:
        "Full list of supported formats shown in an expandable dropdown",
    },
    formatsPlusBadgeValue: {
      control: "number",
      description:
        "Number shown in a badge next to the formats text, indicating additional formats",
    },
    accept: {
      control: "object",
      description:
        "Accepted file types (string or array of strings). Not applied in folder upload mode.",
    },
    maxFiles: {
      control: "number",
      description: "Maximum number of files allowed (0 for unlimited)",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    icon: {
      control: "text",
      description: "Custom icon URL displayed above the upload text",
    },
    iconClassName: {
      control: "text",
      description: "CSS class name applied to the icon element",
    },
    className: {
      control: "text",
      description: "CSS class name applied to the wrapper element",
    },
    loaderClassName: {
      control: "text",
      description: "CSS class name applied to the loader element",
    },
    dataTestId: {
      control: "text",
      description: "Custom data-testid attribute for testing",
    },
    onDrop: {
      action: "dropped",
      description: "Callback fired when files are dropped or selected",
    },
    onSingleUploadError: {
      action: "singleUploadError",
      description:
        "Callback fired when multiple items are provided in single upload mode",
    },
  },
} satisfies Meta<typeof Dropzone>;

type Story = StoryObj<ComponentProps<typeof Dropzone>>;

export default meta;

const defaultArgs: ComponentProps<typeof Dropzone> = {
  isLoading: false,
  isDisabled: false,
  isFolderUpload: false,
  isMultipleUpload: true,
  linkMainText: "Click to upload",
  linkSecondaryText: "or drag and drop files here",
  exstsText: "Supported file types: PDF, DOC, DOCX",
  accept: [".pdf", ".doc", ".docx"],
  maxFiles: 0,
  onDrop: () => {},
  onSingleUploadError: () => {},
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === Dropzone — border, background, shape ===
          "--dropzone-border-style": "2px dashed #0082c9",
          "--dropzone-radius": "12px",
          "--dropzone-min-height": "180px",
          "--dropzone-drag-bg": "#e6f3fb",
          "--dropzone-hover-bg-override": "#cce5f6",
          "--dropzone-text-size": "14px",
          // === Dropzone — exsts / formats area ===
          "--dropzone-text-color": "#0082c9",
          "--dropzone-text-hover-bg": "rgba(0, 130, 201, 0.1)",
          "--dropzone-text-focus-bg": "rgba(0, 130, 201, 0.15)",
          "--dropzone-text-focus-color": "#0082c9",
          "--dropzone-exsts-radius": "6px",
          "--dropzone-formats-radius": "10px",
          "--dropzone-formats-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          // === Link (main/secondary upload link text) ===
          "--link-color": "#0082c9",
          // === Badge (format count badge) ===
          "--badge-bg": "#0082c9",
          "--badge-radius": "8px",
        } as CSSProperties
      }
    >
      <Dropzone
        linkMainText="Click to upload"
        linkSecondaryText="or drag and drop files here"
        exstsText="PDF, DOC, DOCX"
        formatsPlusBadgeValue={5}
        accept={[".pdf", ".doc", ".docx"]}
        onDrop={() => {}}
        onSingleUploadError={() => {}}
        isLoading={false}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**Dropzone — border and background**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropzone-border-style\` | Border shorthand (width style color) | theme-based dashed |
| \`--dropzone-radius\` | Border radius | \`6px\` |
| \`--dropzone-min-height\` | Minimum height | \`150px\` |
| \`--dropzone-drag-bg\` | Background when item is dragged onto the page | theme-based |
| \`--dropzone-hover-bg-override\` | Background on drag-over (hover) | theme-based |
| \`--dropzone-gap\` | Gap between child elements | \`4px\` |

**Dropzone — exsts / formats area**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropzone-text-size\` | Font size for link and exsts text | \`13px\` |
| \`--dropzone-text-color\` | Exsts text and arrow icon color | theme-based |
| \`--dropzone-link-secondary-color\` | Secondary link text color | theme-based |
| \`--dropzone-text-hover-bg\` | Exsts container hover background | theme-based |
| \`--dropzone-text-pressed-bg\` | Exsts container pressed background | theme-based |
| \`--dropzone-text-focus-bg\` | Exsts container open/focus background | theme-based |
| \`--dropzone-text-focus-color\` | Exsts text color when open | theme-based |
| \`--dropzone-badge-focus-color\` | Badge background when open | theme-based |
| \`--dropzone-arrow-focus-color\` | Arrow icon color when open | theme-based |
| \`--dropzone-exsts-radius\` | Exsts text container border radius | \`3px\` |
| \`--dropzone-formats-radius\` | Formats dropdown border radius | \`6px\` |
| \`--dropzone-formats-shadow\` | Formats dropdown box shadow | theme-based |

**Link (main/secondary upload text)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--link-color\` | Link text color | theme-based |

**Badge (format count badge)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--badge-bg\` | Badge background color | theme accent |
| \`--badge-radius\` | Badge border radius | \`6px\` |`,
      },
    },
  },
};

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story:
          "Default dropzone allowing multiple file uploads via click or drag and drop.",
      },
      source: {
        code: `<Dropzone
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
  onDrop={(files) => console.log(files)}
/>`,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropzone in a loading state, displaying a spinner to indicate an upload in progress.",
      },
      source: {
        code: `<Dropzone
  isLoading
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    isDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled dropzone that prevents all user interaction including click and drag.",
      },
      source: {
        code: `<Dropzone
  isDisabled
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
/>`,
      },
    },
  },
};

export const SingleFileUpload: Story = {
  args: {
    ...defaultArgs,
    maxFiles: 1,
    linkMainText: "Upload single file",
    linkSecondaryText: "or drag it here",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropzone configured to accept only a single file at a time via the maxFiles prop.",
      },
      source: {
        code: `<Dropzone
  maxFiles={1}
  linkMainText="Upload single file"
  linkSecondaryText="or drag it here"
  onDrop={(files) => console.log(files)}
/>`,
      },
    },
  },
};

export const ImageUpload: Story = {
  args: {
    ...defaultArgs,
    accept: [".png", ".jpg", ".jpeg", ".gif"],
    linkMainText: "Upload images",
    linkSecondaryText: "or drag them here",
    exstsText: "Supported file types: PNG, JPG, JPEG, GIF",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropzone restricted to image file types only using the accept prop.",
      },
      source: {
        code: `<Dropzone
  accept={[".png", ".jpg", ".jpeg", ".gif"]}
  linkMainText="Upload images"
  linkSecondaryText="or drag them here"
  exstsText="Supported file types: PNG, JPG, JPEG, GIF"
  onDrop={(files) => console.log(files)}
/>`,
      },
    },
  },
};

export const FolderUpload: Story = {
  args: {
    ...defaultArgs,
    isFolderUpload: true,
    linkMainText: "Click to upload folder",
    linkSecondaryText: "or drag and drop folders here",
    exstsText: "Upload entire folders with their structure",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropzone in folder upload mode, allowing users to upload entire directories while preserving folder structure.",
      },
      source: {
        code: `<Dropzone
  isFolderUpload
  linkMainText="Click to upload folder"
  linkSecondaryText="or drag and drop folders here"
  exstsText="Upload entire folders with their structure"
  onDrop={(files) => console.log(files)}
/>`,
      },
    },
  },
};

export const SingleFolderUpload: Story = {
  args: {
    ...defaultArgs,
    isFolderUpload: true,
    isMultipleUpload: false,
    linkMainText: "Upload single folder",
    linkSecondaryText: "or drag folder here",
    exstsText: "Only one folder can be uploaded at a time",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Folder upload mode restricted to a single folder. Triggers onSingleUploadError if multiple folders are provided.",
      },
      source: {
        code: `<Dropzone
  isFolderUpload
  isMultipleUpload={false}
  linkMainText="Upload single folder"
  linkSecondaryText="or drag folder here"
  exstsText="Only one folder can be uploaded at a time"
  onDrop={(files) => console.log(files)}
  onSingleUploadError={() => alert("Only one folder allowed")}
/>`,
      },
    },
  },
};

export const SingleFileOnly: Story = {
  args: {
    ...defaultArgs,
    isMultipleUpload: false,
    linkMainText: "Upload single file",
    linkSecondaryText: "or drag file here",
    exstsText: "Only one file can be uploaded at a time",
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload mode restricted to a single file. Triggers onSingleUploadError if multiple files are provided.",
      },
      source: {
        code: `<Dropzone
  isMultipleUpload={false}
  linkMainText="Upload single file"
  linkSecondaryText="or drag file here"
  exstsText="Only one file can be uploaded at a time"
  onDrop={(files) => console.log(files)}
  onSingleUploadError={() => alert("Only one file allowed")}
/>`,
      },
    },
  },
};
