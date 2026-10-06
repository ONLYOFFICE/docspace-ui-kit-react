import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor } from "storybook/test";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import Dropzone from ".";

const meta = {
  title: "UI/Interactive elements/Dropzone",
  component: Dropzone,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
  onDrop: fn(),
  onDropRejected: fn(),
  onSingleUploadError: fn(),
};

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const pdf = (name: string) =>
  new File(["%PDF"], name, { type: "application/pdf" });

// userEvent.upload drops a file the input's accept refuses before the
// component sees it, so files are set on the input directly instead.
// Defined rather than assigned: after an upload, userEvent leaves `files`
// as a getter-only property on the element.
const chooseUnchecked = (input: HTMLInputElement, files: File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  Object.defineProperty(input, "files", {
    value: dataTransfer.files,
    configurable: true,
  });
  fireEvent.change(input);
};

const getInput = ({ canvas }: PlayContext) =>
  canvas.getByTestId("dropzone-input") as HTMLInputElement;

export const Default: Story = {
  args: defaultArgs,
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // The area is a focusable button named for its purpose.
    const area = canvas.getByRole("button", { name: "File upload area" });
    await expect(area).toHaveAttribute("tabindex", "0");

    await userEvent.upload(getInput(context), pdf("report.pdf"));
    await waitFor(() => expect(args.onDrop).toHaveBeenCalledTimes(1));
    await expect(args.onDrop).toHaveBeenCalledWith([expect.any(File)]);

    // A file of another type is refused and reported.
    chooseUnchecked(getInput(context), [
      new File(["x"], "notes.txt", { type: "text/plain" }),
    ]);
    await waitFor(() => expect(args.onDropRejected).toHaveBeenCalledTimes(1));
    await expect(args.onDrop).toHaveBeenCalledTimes(1);
  },
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
  play: async ({ canvas }) => {
    // A loader replaces the whole area: nothing to click or drop on.
    await expect(canvas.getByTestId("dropzone")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.queryByTestId("dropzone-input-area")).toBeNull();
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
  play: async (context) => {
    const { canvas } = context;
    await expect(canvas.getByTestId("dropzone")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    // The input is disabled and the area leaves the tab order.
    await expect(getInput(context)).toBeDisabled();
    await expect(canvas.getByTestId("dropzone-input-area")).not.toHaveAttribute(
      "tabindex",
      "0",
    );
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
  play: async (context) => {
    const { args } = context;
    // Two files against maxFiles 1: the drop is refused whole.
    chooseUnchecked(getInput(context), [pdf("a.pdf"), pdf("b.pdf")]);
    await waitFor(() => expect(args.onDropRejected).toHaveBeenCalledTimes(1));
    await expect(args.onDrop).not.toHaveBeenCalled();
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
  play: async (context) => {
    const { args, userEvent } = context;
    await userEvent.upload(
      getInput(context),
      new File(["x"], "photo.png", { type: "image/png" }),
    );
    await waitFor(() => expect(args.onDrop).toHaveBeenCalledTimes(1));

    chooseUnchecked(getInput(context), [pdf("report.pdf")]);
    await waitFor(() => expect(args.onDropRejected).toHaveBeenCalledTimes(1));
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
  play: async (context) => {
    const { canvas } = context;
    // Folder mode: a directory picker, no format line.
    await expect(
      canvas.getByRole("button", { name: "Folder upload area" }),
    ).toBeVisible();
    await expect(getInput(context)).toHaveAttribute("webkitdirectory");
    await expect(canvas.queryByTestId("dropzone-file-types")).toBeNull();
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
  play: async (context) => {
    const { args, userEvent } = context;
    // Two files with isMultipleUpload off: onSingleUploadError, not onDrop.
    await userEvent.upload(getInput(context), [pdf("a.pdf"), pdf("b.pdf")]);
    await waitFor(() =>
      expect(args.onSingleUploadError).toHaveBeenCalledTimes(1),
    );
    await expect(args.onDrop).not.toHaveBeenCalled();

    await userEvent.upload(getInput(context), pdf("one.pdf"));
    await waitFor(() => expect(args.onDrop).toHaveBeenCalledTimes(1));
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
  play: async ({ canvas }) => {
    // uploadPercent swaps the spinner for a progress bar.
    await expect(canvas.getByText("45 %")).toBeVisible();
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
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("+4")).toBeVisible();

    // The format line opens the full list instead of the file dialog.
    await userEvent.click(canvas.getByTestId("dropzone-file-types"));
    const full = await screen.findByText("PDF, DOC, DOCX, ODT, RTF, TXT, EPUB");
    await waitFor(() => expect(full).toBeVisible());
    await expect(args.onDrop).not.toHaveBeenCalled();

    // Clicking the line again closes it. An outside click does not: the
    // drop-down has no backdrop and listens for no outside events.
    await userEvent.click(canvas.getByTestId("dropzone-file-types"));
    await waitFor(() => expect(full).not.toBeVisible());
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
  play: async ({ canvas }) => {
    const icon = canvas.getByTestId("dropzone-icon");
    await expect(icon.getBoundingClientRect().width).toBe(50);
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
        onDrop={fn()}
        onSingleUploadError={fn()}
        isLoading={false}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    // The border and radius belong to the outer wrapper.
    const style = getComputedStyle(canvas.getByTestId("dropzone"));
    await expect(style.borderTopStyle).toBe("dashed");
    await expect(style.borderTopColor).toBe("rgb(0, 130, 201)");
    await expect(style.borderTopLeftRadius).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one instance -- the variables are listed under CSS variables on this page. Hover the format line, press it, and click it to open the full list for the hover, pressed and open variables; drag a file over the page, then over the area, for the two drag backgrounds.`,
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
