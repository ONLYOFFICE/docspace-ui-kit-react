import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor } from "storybook/test";

import CatalogFolderIcon from "../../.storybook/utils/ThemedFolderIcon";

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
        "Replaces the whole drop area with a loader. While it is set there is nothing to drop on and no file input in the DOM.",
    },
    uploadPercent: {
      control: "number",
      description:
        "Percentage for the progress bar shown in place of the plain loader while `isLoading`. Leave it out and the loader is an indeterminate spinner.",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Blocks clicking, the keyboard and dropping on the area and its format line, and sets `aria-disabled`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFolderUpload: {
      control: "boolean",
      description:
        "Switches to picking a directory, through a `webkitdirectory` input that any click in the area opens. `accept` is then ignored.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMultipleUpload: {
      control: "boolean",
      description:
        "Whether more than one file, or in folder mode more than one root folder, may be dropped at once. When it is `false` an over-large drop is refused whole.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    linkMainText: {
      control: "text",
      description:
        "The first line, a bold accent link that opens the file or folder dialog. Not translated for you.",
    },
    linkSecondaryText: {
      control: "text",
      description:
        "The line after it, in the body colour, hidden at 600px wide or narrower. Not translated for you.",
    },
    exstsText: {
      control: "text",
      description:
        "The short list of supported formats under the two lines. Not translated for you.",
    },
    fullExstsText: {
      control: "text",
      description:
        "The full list, shown in a drop-down when the short line is clicked. Without it that line is not clickable.",
    },
    formatsPlusBadgeValue: {
      control: "number",
      description:
        "Drawn as a `+N` pill beside the short format list. `0` and no value both leave it out.",
    },
    accept: {
      control: "object",
      description:
        "Accepted types, in react-dropzone 11's form: MIME types or extensions such as `.docx`, comma-separated or in an array. Ignored in folder mode.",
    },
    maxFiles: {
      control: "number",
      description:
        "Largest number of files the drop library accepts; `0` means no limit.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    icon: {
      control: "text",
      description:
        "Picture above the text, 50 by 50 pixels: a URL, or an SVG component the dropzone renders itself.",
    },
    iconClassName: {
      control: "text",
      description: "Added after the component's own class on the icon.",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own class on the outer element.",
    },
    loaderClassName: {
      control: "text",
      description:
        "Added after the component's own classes on the loader or the progress bar.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: '"dropzone"' },
      },
    },
    onDrop: {
      action: "dropped",
      description:
        "Called with the accepted files. An empty result never reaches it, and neither does a drop refused by the single-upload rule.",
    },
    onDropRejected: {
      action: "dropRejected",
      description:
        "Called with the files the drop library refused — wrong type, or more than `maxFiles`.",
    },
    onSingleUploadError: {
      action: "singleUploadError",
      description:
        "Called instead of `onDrop` when a single-upload rule refuses the drop. Nothing is uploaded and nothing is said to the user by the component.",
    },
    getFilesFromEvent: {
      control: false,
      description:
        "Replaces the reader that walks a dropped directory and attaches each file's path. The directory and single-upload checks still run before it.",
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

// What a click or a drop at the middle of the element would land on.
const hitAtCentre = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return document.elementFromPoint(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
  );
};

export const Default: Story = {
  name: "Files",
  args: defaultArgs,
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // The area is a focusable button named for its purpose.
    const area = canvas.getByRole("button", { name: "File upload area" });
    await expect(area).toHaveAttribute("tabindex", "0");

    // The plain format line sits beside the area, over its hit box, and lets
    // clicks and drops through to it.
    await expect(hitAtCentre(canvas.getByTestId("dropzone-file-types"))).toBe(
      area,
    );

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
          "The everyday setup: a dashed area with a prompt and the accepted formats. A click opens the file dialog, a drop works too, and the accepted files reach `onDrop`.",
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
  name: "Loading",
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
          "A spinner in place of the text lines and the drop target, while the picked files are prepared or sent (`isLoading`). Nothing more can be clicked or dropped.",
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
  name: "Disabled",
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
          "An area that looks like the default, but where clicks, keys and drops do nothing (`isDisabled`). It suits a moment when uploading is not allowed.",
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
  name: "At most one file",
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
          "An area for one file at a time (`maxFiles={1}`). A drop of two or more is refused whole and reported as rejected files.",
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
  name: "Images only",
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
          "An area for images only (`accept`). The file dialog offers only these types, and a dropped file of another type is reported as rejected.",
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
  name: "Folder",
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
    const area = canvas.getByRole("button", { name: "Folder upload area" });
    await expect(area).toBeVisible();
    await expect(getInput(context)).toHaveAttribute("webkitdirectory");
    // The area stays in the tab order, so the picker opens from the keyboard.
    await expect(area).toHaveAttribute("tabindex", "0");
    await expect(canvas.queryByTestId("dropzone-file-types")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An area for a directory tree, with no format line (`isFolderUpload`). A click, or Enter or Space, opens a folder dialog, and each file arrives with its path.",
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
  name: "One folder at a time",
  args: {
    ...defaultArgs,
    isFolderUpload: true,
    isMultipleUpload: false,
    linkMainText: "Upload single folder",
    linkSecondaryText: "or drag folder here",
    exstsText: "Only one folder can be uploaded at a time",
  },
  play: async (context) => {
    const { args } = context;
    const input = getInput(context);
    await expect(input).toHaveAttribute("webkitdirectory");
    // Files from two root folders: the drop is refused whole.
    const inFolder = (folder: string, name: string) => {
      const file = pdf(name);
      Object.defineProperty(file, "webkitRelativePath", {
        value: `${folder}/${name}`,
      });
      return file;
    };
    Object.defineProperty(input, "files", {
      value: [inFolder("Reports", "a.pdf"), inFolder("Invoices", "b.pdf")],
      configurable: true,
    });
    fireEvent.change(input);
    await waitFor(() =>
      expect(args.onSingleUploadError).toHaveBeenCalledTimes(1),
    );
    await expect(args.onDrop).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder area that takes one folder at a time (`isMultipleUpload={false}`). Two or more root folders are refused whole, and `onSingleUploadError` is called instead of `onDrop`.",
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
  name: "One file at a time",
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
          "An area that takes one file at a time (`isMultipleUpload={false}`). Two or more files are refused whole, and `onSingleUploadError` lets the host explain why.",
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
  name: "Upload progress",
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
          "A progress bar at 45% in place of the spinner, for an upload that reports how far it has got (`uploadPercent`).",
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
  name: "Full format list",
  args: {
    ...defaultArgs,
    exstsText: "PDF, DOC, DOCX",
    formatsPlusBadgeValue: 4,
    fullExstsText: "PDF, DOC, DOCX, ODT, RTF, TXT, EPUB",
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("+4")).toBeVisible();

    // The format line is a button that opens the full list instead of the
    // file dialog.
    const line = canvas.getByRole("button", { name: /PDF, DOC, DOCX/ });
    await expect(line).toHaveAttribute("aria-expanded", "false");
    await expect(line.contains(hitAtCentre(line))).toBe(true);

    // While anything is dragged over the page, the line lets the drag
    // through to the area, so a drop on it is taken.
    const area = canvas.getByRole("button", { name: "File upload area" });
    fireEvent.dragEnter(document.body);
    await waitFor(() => expect(hitAtCentre(line)).toBe(area));
    fireEvent.drop(document.body);
    await waitFor(() => expect(line.contains(hitAtCentre(line))).toBe(true));

    await userEvent.click(line);
    const full = await screen.findByText("PDF, DOC, DOCX, ODT, RTF, TXT, EPUB");
    await waitFor(() => expect(full).toBeVisible());
    await expect(line).toHaveAttribute("aria-expanded", "true");
    await expect(args.onDrop).not.toHaveBeenCalled();

    // Clicking the line again closes it.
    await userEvent.click(line);
    await waitFor(() => expect(full).not.toBeVisible());

    // So does a click outside the dropzone.
    await userEvent.click(line);
    await waitFor(() => expect(full).toBeVisible());
    await userEvent.click(document.body);
    await waitFor(() => expect(full).not.toBeVisible());
    await expect(line).toHaveAttribute("aria-expanded", "false");

    // From the keyboard: Enter opens it, Escape closes it.
    line.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(full).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(full).not.toBeVisible());
    await expect(line).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A short format line with a `+4` pill and a chevron, for formats that do not fit on one line (`formatsPlusBadgeValue`, `fullExstsText`). A click or Enter opens the full list; Escape closes it.",
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
  name: "With icon",
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
          "A 50-pixel folder picture above the two lines, to make the area recognisable at a glance (`icon`). It takes an SVG component or an image URL.",
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
  name: "CSS variables",
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
        story: `A blue dashed area with rounder corners, under a wrapper that sets every variable. The format line's hover, pressed and open colours, and both drag backgrounds, are set too.`,
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
