import type React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, waitFor, within } from "storybook/test";

import { InputSize } from "../text-input";

import { FileInput } from ".";

const meta = {
  title: "UI/Form controls/FileInput",
  component: FileInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description:
        "Height and width of the field, which also pick the icon box and button sizes",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    placeholder: {
      control: "text",
      description: "Text shown in the field until a file is chosen",
    },
    buttonLabel: {
      control: "text",
      description: "Renders a button with this label in place of the icon",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field out and stops a click from opening the file picker",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the icon with a spinner, greys the field and stops a click from opening the file picker; with a button label the button stays and only the click is stopped",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Draws the field and its icon box with an error border",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Draws the field and its icon box with a warning border",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Stretches the field to the full width of its container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMultiple: {
      control: "boolean",
      description: "Whether several files may be chosen or dropped at once",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDocumentIcon: {
      control: "boolean",
      description: "Shows a document icon instead of the folder icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accept: {
      control: "object",
      description:
        'File extensions or MIME types the picker offers and a drop accepts, such as `[".pdf", "image/*"]`; a file of any other type is refused with an error toast',
      table: {
        defaultValue: { summary: '[""]' },
      },
    },
    onInput: {
      description:
        "Called with the chosen files: a single `File` when one was chosen, an array when several were",
    },
    fromStorage: {
      control: "boolean",
      description:
        "Stops the field from opening the file picker: it shows `path` instead and passes clicks to `onClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    path: {
      control: "text",
      description: "Text shown in the field while `fromStorage` is set",
    },
    onClick: {
      description:
        "Called when the field or its icon is clicked, only while `fromStorage` is set",
    },
    id: {
      control: "text",
      description: "Id of the hidden file input, not of the visible field",
    },
    idButton: {
      control: "text",
      description: "Id of the outermost element",
    },
    name: {
      control: false,
      description: "Accepted but not used",
    },
    className: {
      control: false,
      description: "Class added to the outermost element",
    },
    style: {
      control: false,
      description: "Inline style of the outermost element",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name of the control, which has none without it",
    },
    "aria-description": {
      control: "text",
      description: "Accessible description of the control",
    },
    "data-test-id": {
      control: "text",
      description: "Test id of the outermost element",
      table: {
        defaultValue: { summary: "file-input" },
      },
    },
  },
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<ComponentProps<typeof FileInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <FileInput {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByTestId("upload-click-input");
    await userEvent.upload(
      input,
      new File(["hello"], "notes.txt", { type: "text/plain" }),
    );
    await waitFor(() => expect(args.onInput).toHaveBeenCalledTimes(1));
    await expect(args.onInput).toHaveBeenCalledWith(expect.any(File));
    await expect(canvas.getByRole("textbox")).toHaveValue("notes.txt");

    // Several files reach onInput as an array, their names joined.
    await userEvent.upload(input, [
      new File(["a"], "a.pdf", { type: "application/pdf" }),
      new File(["b"], "b.txt", { type: "text/plain" }),
    ]);
    await waitFor(() => expect(args.onInput).toHaveBeenCalledTimes(2));
    await expect(args.onInput).toHaveBeenLastCalledWith([
      expect.any(File),
      expect.any(File),
    ]);
    await expect(canvas.getByRole("textbox")).toHaveValue("a.pdf, b.txt");
  },
  args: {
    placeholder: "Choose file",
    // Without accept the default [""] admits only files with no MIME type,
    // so the field would refuse every ordinary file.
    accept: [".pdf", ".docx", ".xlsx", ".txt"],
    size: InputSize.base,
    scale: false,
    isDisabled: false,
    isLoading: false,
    hasError: false,
    hasWarning: false,
    "aria-label": "Choose file",
    onInput: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field as a form shows it before anything is chosen; change any prop live in the Controls panel below.",
      },
      source: {
        code: `<FileInput
  placeholder="Choose file"
  size={InputSize.base}
  accept={[".pdf", ".docx", ".xlsx", ".txt"]}
  aria-label="Choose file"
  onInput={(file) => console.log(file)}
/>`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <FileInput
        size={InputSize.base}
        placeholder="Base size"
        aria-label="Base size file input"
      />
      <FileInput
        size={InputSize.middle}
        placeholder="Middle size"
        aria-label="Middle size file input"
      />
      <FileInput
        size={InputSize.large}
        placeholder="Large size"
        aria-label="Large size file input"
      />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Pick the size that matches the other fields of the form: each one also sets the field's width and the size of its icon box (`size`).",
      },
      source: {
        code: `<FileInput size={InputSize.base} placeholder="Base size" />
<FileInput size={InputSize.middle} placeholder="Middle size" />
<FileInput size={InputSize.large} placeholder="Large size" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <FileInput
        size={InputSize.base}
        placeholder="Normal"
        aria-label="Normal file input"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Error state"
        hasError
        aria-label="Error file input"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Warning state"
        hasWarning
        aria-label="Warning file input"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Disabled"
        isDisabled
        aria-label="Disabled file input"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Loading"
        isLoading
        aria-label="Loading file input"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use these to tell the user about the chosen file: **Error state** and **Warning state** recolour the border (`hasError`, `hasWarning`), **Disabled** greys the field and ignores clicks (`isDisabled`), and **Loading** shows a spinner in place of the icon (`isLoading`).",
      },
      source: {
        code: `<FileInput placeholder="Normal" />
<FileInput placeholder="Error state" hasError />
<FileInput placeholder="Warning state" hasWarning />
<FileInput placeholder="Disabled" isDisabled />
<FileInput placeholder="Loading" isLoading />`,
      },
    },
  },
};

const WithAcceptFilterTemplate = () => {
  return (
    <Wrapper>
      <FileInput
        size={InputSize.base}
        placeholder="Images only"
        accept={[".png", ".jpg", ".jpeg", ".gif"]}
        aria-label="Image file input"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Documents only"
        accept={[".pdf", ".docx", ".xlsx"]}
        aria-label="Document file input"
      />
    </Wrapper>
  );
};

// userEvent.upload drops a file the input's accept refuses before the
// component sees it, so the refused file is set on the input directly.
const chooseUnchecked = (input: HTMLInputElement, file: File) => {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
  fireEvent.change(input);
};

export const WithAcceptFilter: Story = {
  render: () => <WithAcceptFilterTemplate />,
  play: async ({ canvas, userEvent }) => {
    const images = canvas.getByLabelText("Image file input");
    const field = within(images).getByRole("textbox");
    const input = within(images).getByTestId(
      "upload-click-input",
    ) as HTMLInputElement;

    // A file of another type is refused and leaves the field empty.
    chooseUnchecked(
      input,
      new File(["x"], "notes.txt", { type: "text/plain" }),
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(field).toHaveValue("");

    await userEvent.upload(
      input,
      new File(["x"], "photo.png", { type: "image/png" }),
    );
    await waitFor(() => expect(field).toHaveValue("photo.png"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Limit the field to the types the host can handle: the picker offers only these extensions, and a dropped file of another type is refused with an error toast (`accept`).",
      },
      source: {
        code: `<FileInput placeholder="Images only" accept={[".png", ".jpg", ".jpeg", ".gif"]} />
<FileInput placeholder="Documents only" accept={[".pdf", ".docx", ".xlsx"]} />`,
      },
    },
  },
};

const ScaledTemplate = () => {
  return (
    <div style={{ display: "grid", gridGap: "16px" }}>
      <FileInput
        size={InputSize.base}
        placeholder="Scaled file input"
        scale
        aria-label="Scaled file input"
      />
    </div>
  );
};

export const ScaledInput: Story = {
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it when the field should line up with a full-width form column: it stretches to the width of its container (`scale`).",
      },
      source: {
        code: `<FileInput placeholder="Scaled file input" scale />`,
      },
    },
  },
};

const WithButtonTemplate = () => {
  return (
    <div style={{ display: "grid", gridGap: "16px", width: "400px" }}>
      <FileInput
        size={InputSize.base}
        placeholder="Base size"
        buttonLabel="Browse"
        scale
        aria-label="Base size file input with a button"
      />
      <FileInput
        size={InputSize.middle}
        placeholder="Middle size"
        buttonLabel="Browse"
        scale
        aria-label="Middle size file input with a button"
      />
      <FileInput
        size={InputSize.large}
        placeholder="Large size"
        buttonLabel="Browse"
        scale
        aria-label="Large size file input with a button"
      />
    </div>
  );
};

export const WithButton: Story = {
  render: () => <WithButtonTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use a labelled button when an icon alone would not tell the user what the field does: the button takes the place of the icon and grows with the field's size (`buttonLabel`). The field is given the full width of its container here (`scale`), because at a fixed size the button is laid out past the field's own width.",
      },
      source: {
        code: `<FileInput size={InputSize.base} placeholder="Base size" buttonLabel="Browse" scale />
<FileInput size={InputSize.middle} placeholder="Middle size" buttonLabel="Browse" scale />
<FileInput size={InputSize.large} placeholder="Large size" buttonLabel="Browse" scale />`,
      },
    },
  },
};

const DocumentIconTemplate = () => {
  return (
    <Wrapper>
      <FileInput
        size={InputSize.base}
        placeholder="Folder icon"
        aria-label="File input with a folder icon"
      />
      <FileInput
        size={InputSize.base}
        placeholder="Document icon"
        isDocumentIcon
        aria-label="File input with a document icon"
      />
    </Wrapper>
  );
};

export const DocumentIcon: Story = {
  render: () => <DocumentIconTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use the document icon when the field takes a single document rather than any file: **Folder icon** is the default, **Document icon** the alternative (`isDocumentIcon`).",
      },
      source: {
        code: `<FileInput size={InputSize.base} placeholder="Folder icon" />
<FileInput size={InputSize.base} placeholder="Document icon" isDocumentIcon />`,
      },
    },
  },
};

export const WithPath: Story = {
  render: (args) => <FileInput {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    // fromStorage shows the path and has no file input to open.
    const field = canvas.getByRole("textbox");
    await expect(field).toHaveValue("Documents/Reports");
    await expect(canvas.queryByTestId("upload-click-input")).toBeNull();

    await userEvent.click(field);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByTestId("icon-button"));
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
  args: {
    size: InputSize.middle,
    placeholder: "Choose a folder",
    fromStorage: true,
    path: "Documents/Reports",
    "aria-label": "Choose a folder",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use this when the file comes from somewhere other than the device, such as a folder picker of the host's own: the field shows the path it is given (`fromStorage`, `path`), and a click on it or its icon calls the host instead of opening the file picker (`onClick`) — click it and watch the Actions panel.",
      },
      source: {
        code: `<FileInput
  size={InputSize.middle}
  placeholder="Choose a folder"
  fromStorage
  path="Documents/Reports"
  onClick={openFolderDialog}
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
          display: "grid",
          gridGap: "16px",
          width: "320px",
          // === FileInput — border and radius ===
          "--file-input-border": "#0082c9",
          "--file-input-hover-border": "#006ba6",
          "--file-input-focus-border": "#004f82",
          "--file-input-radius": "8px",
          // === FileInput — validation states ===
          "--file-input-warning-border": "#e67e00",
          "--file-input-error-border": "#c0392b",
          "--file-input-disabled-border": "#b0cce3",
          "--file-input-placeholder-color": "#7aa8c7",
          // === TextInput (inner text field) ===
          "--text-input-bg": "#f0f8ff",
          "--text-input-color": "#004f82",
          "--text-input-radius": "8px 0 0 8px",
        } as CSSProperties
      }
    >
      <FileInput
        placeholder="Choose file"
        size={InputSize.base}
        scale
        aria-label="Custom styled file input"
      />
      <FileInput
        placeholder="Warning state"
        size={InputSize.base}
        scale
        hasWarning
        aria-label="Warning file input"
      />
      <FileInput
        placeholder="Error state"
        size={InputSize.base}
        scale
        hasError
        aria-label="Error file input"
      />
      <FileInput
        placeholder="Disabled"
        size={InputSize.base}
        scale
        isDisabled
        aria-label="Disabled file input"
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Choose file** — the border, background, text and radius variables; hover it for \`--file-input-hover-border\` and press it for \`--file-input-focus-border\`
- **Warning state** — \`--file-input-warning-border\` (\`hasWarning\`)
- **Error state** — \`--file-input-error-border\` (\`hasError\`)
- **Disabled** — \`--file-input-disabled-border\` and \`--file-input-placeholder-color\` (\`isDisabled\`)`,
      },
      source: {
        code: `<div
  style={{
    "--file-input-border": "#0082c9",
    "--file-input-hover-border": "#006ba6",
    "--file-input-focus-border": "#004f82",
    "--file-input-radius": "8px",
    "--file-input-warning-border": "#e67e00",
    "--file-input-error-border": "#c0392b",
    "--file-input-disabled-border": "#b0cce3",
    "--file-input-placeholder-color": "#7aa8c7",
    "--text-input-bg": "#f0f8ff",
    "--text-input-color": "#004f82",
    "--text-input-radius": "8px 0 0 8px",
  }}
>
  <FileInput placeholder="Choose file" size={InputSize.base} scale />
  <FileInput placeholder="Warning state" size={InputSize.base} scale hasWarning />
  <FileInput placeholder="Error state" size={InputSize.base} scale hasError />
  <FileInput placeholder="Disabled" size={InputSize.base} scale isDisabled />
</div>`,
      },
    },
  },
};
