import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import Dropzone from ".";

const meta = {
  title: "UI/Interactive elements/Dropzone",
  component: Dropzone,
  parameters: {
    docs: {
      description: {
        component: `An upload area that takes files or a whole folder by drag and drop or through the system file dialog.

### Features

- **File Upload**: Opens the file dialog on a click anywhere in the area and takes files dropped onto it
- **Folder Upload**: Picks a whole directory instead of files and gives each file its path inside it, so the folder structure survives the upload
- **Multiple / Single Upload**: Takes many files or root folders per drop, or only one, refusing a larger drop whole through a callback
- **Loading State**: Replaces the drop area with a spinner, or with a progress bar when a percentage is given
- **Accepted Formats**: Restricts file uploads to the listed MIME types or extensions and reports refused files through a callback
- **Max Files**: Caps the number of files one drop may carry and refuses a drop that holds more
- **Expandable Formats List**: Shows a short format line with an optional \`+N\` badge that opens the full list in a drop-down when clicked
- **Drag Highlight**: Tints the area while a file is dragged anywhere over the page, and more strongly once it is over the area

### Accessibility

The drop area is announced as a button and reports its busy and disabled states:

- **Role and name**: The area has \`role="button"\` and the name "File upload area" or "Folder upload area"; the hidden input is named "File input" or "Folder input"
- **Keyboard**: In file mode the area takes focus with Tab, and Enter or Space opens the file dialog
- **States**: \`aria-busy\` on the outer element marks the loading state, and \`aria-disabled\` the disabled one
- **Live text**: The two text lines sit in a polite live region, so a change to them is read out

### Usage

\`\`\`tsx
import Dropzone from "@onlyoffice/apps-ui-kit/components/dropzone";

// Basic file upload
<Dropzone
  isLoading={false}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
  onDrop={(files) => handleUpload(files)}
/>

// Folder upload
<Dropzone
  isLoading={false}
  isFolderUpload
  linkMainText="Click to upload folder"
  linkSecondaryText="or drag and drop folders here"
  exstsText=""
  accept={[]}
  onDrop={(files) => handleFolderUpload(files)}
/>

// Upload in progress
<Dropzone
  isLoading
  uploadPercent={45}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isLoading: {
      control: "boolean",
      description:
        "Replaces the whole drop area with a loader; while it is set there is nothing to click or drop on. Required",
    },
    uploadPercent: {
      control: "number",
      description:
        "Percentage for the progress bar shown instead of the spinner while `isLoading` is set. Leave it out for a spinner",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Blocks clicks, the keyboard and dropping. The area looks the same as when enabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFolderUpload: {
      control: "boolean",
      description:
        "Picks a whole directory instead of files: a click anywhere in the area opens a folder dialog, the format line is hidden and `accept` is ignored",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMultipleUpload: {
      control: "boolean",
      description:
        "Whether more than one file, or in folder mode more than one root folder, may be dropped at once. When false a larger drop is refused whole",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    linkMainText: {
      control: "text",
      description:
        "The first, bold line; clicking it opens the file or folder dialog. Required",
    },
    linkSecondaryText: {
      control: "text",
      description:
        "The line after it, in the body colour; hidden on mobile screens. Required",
    },
    exstsText: {
      control: "text",
      description:
        "The short list of supported formats under the two lines, not shown in folder mode. Required",
    },
    fullExstsText: {
      control: "text",
      description:
        "The full list of formats, shown in a drop-down when the short line is clicked. Without it that line is not clickable",
    },
    formatsPlusBadgeValue: {
      control: "number",
      description:
        "Drawn as a `+N` pill beside the short format list; 0 and no value both leave it out",
    },
    accept: {
      control: "object",
      description:
        "Accepted types: a MIME type, an extension such as `.docx`, a comma-separated list of either, or an array of them. Ignored in folder mode. Required",
    },
    maxFiles: {
      control: "number",
      description:
        "Largest number of files one drop may carry; a drop with more is refused whole. 0 means no limit",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    icon: {
      control: "text",
      description:
        "Picture above the text, 50 by 50 pixels: an image URL, or an SVG component the dropzone renders itself",
    },
    iconClassName: {
      control: "text",
      description: "Added after the component's own class on the icon",
    },
    className: {
      control: "text",
      description: "Added after the component's own class on the outer element",
    },
    loaderClassName: {
      control: "text",
      description:
        "Added after the component's own classes on the spinner or the progress bar",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: '"dropzone"' },
      },
    },
    onDrop: {
      action: "dropped",
      description:
        "Called with the accepted files after a drop or a pick in the dialog. An empty result and a drop refused by the single-upload rule never reach it",
    },
    onDropRejected: {
      action: "dropRejected",
      description:
        "Called with the files that were refused: a wrong type, or more than `maxFiles`",
    },
    onSingleUploadError: {
      action: "singleUploadError",
      description:
        "Called instead of `onDrop` when `isMultipleUpload` is false and the drop holds more than one file, or more than one root folder. The component shows the user nothing itself",
    },
    getFilesFromEvent: {
      control: false,
      description:
        "Replaces the component's own reader of a drop, which walks a dropped directory and gives each file its path",
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
};

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story:
          "The everyday setup: click the area to pick files or drop them onto it, and the accepted files appear in the Actions panel (`onDrop`). Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
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
          "Use while the picked files are being prepared or sent: a spinner replaces the text lines and the drop target, so nothing more can be clicked or dropped (`isLoading`).",
      },
      source: {
        code: `<Dropzone
  isLoading
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
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
          "Use when uploading is not allowed right now: the area looks the same as the default, but clicks, keys and drops do nothing (`isDisabled`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  isDisabled
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
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
          "Use when the next step takes one file: a drop of two or more is refused whole and reported as rejected files instead of uploaded (`maxFiles`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  maxFiles={1}
  linkMainText="Upload single file"
  linkSecondaryText="or drag it here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
  onDrop={(files) => console.log(files)}
  onDropRejected={(rejections) => console.log(rejections)}
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
          "Use when only some types make sense: the file dialog offers only these types, and a dropped file of any other type is refused and reported as rejected (`accept`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  accept={[".png", ".jpg", ".jpeg", ".gif"]}
  linkMainText="Upload images"
  linkSecondaryText="or drag them here"
  exstsText="Supported file types: PNG, JPG, JPEG, GIF"
  onDrop={(files) => console.log(files)}
  onDropRejected={(rejections) => console.log(rejections)}
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
          "Use to upload a directory tree: a click anywhere opens a folder dialog, each file arrives with its path inside the folder, and the format line is not shown (`isFolderUpload`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  isFolderUpload
  linkMainText="Click to upload folder"
  linkSecondaryText="or drag and drop folders here"
  exstsText=""
  accept={[]}
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
          "Use when one folder is expected: a drop holding two or more root folders is refused whole, and `onSingleUploadError` is called instead of `onDrop` (`isMultipleUpload` off in folder mode).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  isFolderUpload
  isMultipleUpload={false}
  linkMainText="Upload single folder"
  linkSecondaryText="or drag folder here"
  exstsText=""
  accept={[]}
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
          "Use when one file is expected and you explain a larger drop yourself: two or more files are refused whole, and `onSingleUploadError` is called instead of `onDrop` (`isMultipleUpload`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  isMultipleUpload={false}
  linkMainText="Upload single file"
  linkSecondaryText="or drag file here"
  exstsText="Only one file can be uploaded at a time"
  accept={[".pdf", ".doc", ".docx"]}
  onDrop={(files) => console.log(files)}
  onSingleUploadError={() => alert("Only one file allowed")}
/>`,
      },
    },
  },
};

export const UploadProgress: Story = {
  args: {
    ...defaultArgs,
    isLoading: true,
    uploadPercent: 45,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use when the upload can report how far it has got: a progress bar with the percentage replaces the spinner and fills to the given share (`uploadPercent`).",
      },
      source: {
        code: `<Dropzone
  isLoading
  uploadPercent={45}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="Supported file types: PDF, DOC, DOCX"
  accept={[".pdf", ".doc", ".docx"]}
/>`,
      },
    },
  },
};

export const WithFormatsList: Story = {
  args: {
    ...defaultArgs,
    exstsText: "PDF, DOC, DOCX",
    formatsPlusBadgeValue: 4,
    fullExstsText: "PDF, DOC, DOCX, ODT, RTF, TXT, EPUB",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use when the accepted formats do not fit on one line: the short line carries a `+4` pill for the rest (`formatsPlusBadgeValue`); click it to open the full list in a drop-down, and click outside to close it (`fullExstsText`).",
      },
      source: {
        code: `<Dropzone
  isLoading={false}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="PDF, DOC, DOCX"
  formatsPlusBadgeValue={4}
  fullExstsText="PDF, DOC, DOCX, ODT, RTF, TXT, EPUB"
  accept={[".pdf", ".doc", ".docx", ".odt", ".rtf", ".txt", ".epub"]}
  onDrop={(files) => console.log(files)}
/>`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    ...defaultArgs,
    icon: CatalogFolderIcon,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use to make the area recognisable at a glance: the picture sits above the two lines at 50 by 50 pixels, given as an SVG component or an image URL (`icon`).",
      },
      source: {
        code: `import FolderIcon from "./folder.react.svg";

<Dropzone
  isLoading={false}
  icon={FolderIcon}
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

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          "--dropzone-border-style": "2px dashed #0082c9",
          "--dropzone-radius": "12px",
          "--dropzone-min-height": "180px",
          "--dropzone-gap": "8px",
          "--dropzone-drag-bg": "#e6f3fb",
          "--dropzone-hover-bg-override": "#cce5f6",
          "--dropzone-text-size": "14px",
          "--dropzone-link-secondary-color": "#005a8c",
          "--dropzone-text-color": "#0082c9",
          "--dropzone-text-hover-bg": "rgba(0, 130, 201, 0.1)",
          "--dropzone-text-pressed-bg": "rgba(0, 130, 201, 0.3)",
          "--dropzone-text-focus-bg": "rgba(0, 130, 201, 0.15)",
          "--dropzone-text-focus-color": "#003e61",
          "--dropzone-badge-focus-color": "#0082c9",
          "--dropzone-arrow-focus-color": "#003e61",
          "--dropzone-exsts-radius": "6px",
          "--dropzone-formats-radius": "10px",
          "--dropzone-formats-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
        } as CSSProperties
      }
    >
      <Dropzone
        linkMainText="Click to upload"
        linkSecondaryText="or drag and drop files here"
        exstsText="PDF, DOC, DOCX"
        formatsPlusBadgeValue={5}
        fullExstsText="PDF, DOC, DOCX, ODT, RTF, TXT, EPUB, HTML"
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

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropzone-border-style\` | Border shorthand (width style color) | theme-based dashed |
| \`--dropzone-radius\` | Border radius | \`6px\` |
| \`--dropzone-min-height\` | Minimum height | \`150px\` |
| \`--dropzone-gap\` | Gap between the icon, the text lines and the format line, and between the items inside them | \`4px\` |
| \`--dropzone-drag-bg\` | Background while a file is dragged over the page but not yet over the area | theme-based |
| \`--dropzone-hover-bg-override\` | Background while a file is dragged over the area | theme-based |
| \`--dropzone-text-size\` | Font size of the two text lines and the format line | \`13px\` |
| \`--dropzone-link-secondary-color\` | Colour of the second text line | theme-based |
| \`--dropzone-text-color\` | Colour of the format line and its arrow | theme-based |
| \`--dropzone-text-hover-bg\` | Format line background on hover, when a full list is given | theme-based |
| \`--dropzone-text-pressed-bg\` | Format line background while pressed, when a full list is given | theme-based |
| \`--dropzone-text-focus-bg\` | Format line background while the full list is open | theme-based |
| \`--dropzone-text-focus-color\` | Format text colour while the full list is open | theme-based |
| \`--dropzone-badge-focus-color\` | \`+N\` pill background while the full list is open | theme-based |
| \`--dropzone-arrow-focus-color\` | Arrow colour while the full list is open | theme-based |
| \`--dropzone-exsts-radius\` | Format line corner radius, seen on its hover and open backgrounds | \`3px\` |
| \`--dropzone-formats-radius\` | Full list drop-down corner radius | \`6px\` |
| \`--dropzone-formats-shadow\` | Full list drop-down shadow | none |

One instance carries every variable. Hover the format line, press it, and click it to open the full list for the hover, pressed and open variables; drag a file over the page, then over the area, for the two drag backgrounds.`,
      },
      source: {
        code: `<div
  style={{
    "--dropzone-border-style": "2px dashed #0082c9",
    "--dropzone-radius": "12px",
    "--dropzone-min-height": "180px",
    "--dropzone-gap": "8px",
    "--dropzone-drag-bg": "#e6f3fb",
    "--dropzone-hover-bg-override": "#cce5f6",
    "--dropzone-text-size": "14px",
    "--dropzone-link-secondary-color": "#005a8c",
    "--dropzone-text-color": "#0082c9",
    "--dropzone-text-hover-bg": "rgba(0, 130, 201, 0.1)",
    "--dropzone-text-pressed-bg": "rgba(0, 130, 201, 0.3)",
    "--dropzone-text-focus-bg": "rgba(0, 130, 201, 0.15)",
    "--dropzone-text-focus-color": "#003e61",
    "--dropzone-badge-focus-color": "#0082c9",
    "--dropzone-arrow-focus-color": "#003e61",
    "--dropzone-exsts-radius": "6px",
    "--dropzone-formats-radius": "10px",
    "--dropzone-formats-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
  }}
>
  <Dropzone
    isLoading={false}
    linkMainText="Click to upload"
    linkSecondaryText="or drag and drop files here"
    exstsText="PDF, DOC, DOCX"
    formatsPlusBadgeValue={5}
    fullExstsText="PDF, DOC, DOCX, ODT, RTF, TXT, EPUB, HTML"
    accept={[".pdf", ".doc", ".docx"]}
  />
</div>`,
      },
    },
  },
};
