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
        "Height of the field, which also picks the icon and button sizes: base and middle take a 15px icon, large a 16px one.",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder of the read-only field, shown until a file is chosen.",
    },
    buttonLabel: {
      control: "text",
      description: "Renders a button with this label in place of the icon.",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the field is greyed and inert: a click, a drop, Enter and Space all do nothing, and the control leaves the tab order.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Whether a spinner replaces the icon. It also makes the control inert, as `isDisabled` does; the spinner is not shown when `buttonLabel` is set, since the button has no loading form.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Whether the field is drawn in its error colours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Whether the field is drawn in its warning colours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Whether the field stretches to fill its container.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMultiple: {
      control: "boolean",
      description: "Whether several files may be chosen at once.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDocumentIcon: {
      control: "boolean",
      description: "Whether the icon is a document rather than a folder.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accept: {
      control: "object",
      description:
        'Extensions and MIME types the dialog offers and a drop accepts, such as `[".pdf", "image/*"]`. Left out, empty, or `[""]`, any file is accepted.',
    },
    onReject: {
      description:
        "Called with the files `accept` turned away. While it is set the component shows no toast of its own for a refused pick or drop.",
    },
    onInput: {
      description:
        "Called with the chosen files: a single `File` when one was picked, an array when several were. Check for an array before reading `.name`.",
    },
    fromStorage: {
      control: "boolean",
      description:
        "Turns the control into a button that picks from somewhere else. The hidden file input is left out, `path` is shown, and clicks go to `onClick`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    path: {
      control: "text",
      description:
        "Text shown in the field instead of the chosen file names, with `fromStorage`.",
    },
    onClick: {
      description:
        "Called when the field or the icon is clicked — but only while `fromStorage` is set. Without it the click opens the file dialog and this never fires.",
    },
    id: {
      control: "text",
      description:
        'Applied to the hidden `<input type="file">`, not to the wrapper.',
    },
    idButton: {
      control: "text",
      description:
        "Id of the outer element, the one a `<label for>` should point at.",
    },
    name: {
      control: false,
      description: "Name of the hidden file field.",
    },
    className: {
      control: false,
      description: "Applied to the outermost element.",
    },
    style: {
      control: false,
      description: "Applied to the outermost element.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name of the control. There is none without it.",
    },
    "aria-description": {
      control: "text",
      description: "Accessible description of the control.",
    },
    "aria-disabled": {
      control: false,
      description:
        "Marks the control disabled to assistive technology while it still takes clicks and drops. `isDisabled` and `isLoading` set it to `true` over this value.",
    },
    "data-test-id": {
      control: "text",
      description:
        "Sets the outer element's `data-testid`, despite the hyphenated name.",
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
    // No accept: any file is admitted.
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
        story: "The field as a form shows it before anything is chosen.",
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

type Queries = {
  getByPlaceholderText: (text: string) => HTMLElement;
};

const rect = (element: Element) => element.getBoundingClientRect();

// The text field carries the border; the root is the whole control.
const field = (canvas: Queries, placeholder: string) =>
  canvas.getByPlaceholderText(placeholder) as HTMLInputElement;

const rootOf = (input: HTMLElement) =>
  input.closest("[data-testid='file-input']") as HTMLElement;

const borderOf = (input: HTMLElement) => getComputedStyle(input).borderTopColor;

const SizesTemplate = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
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
    </div>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    const [base, middle, large] = [
      "Base size",
      "Middle size",
      "Large size",
    ].map((placeholder) => field(canvas, placeholder));
    // Each size has its fixed width; base and middle share a height.
    const widths = [base, middle, large].map((input) =>
      Math.round(rect(rootOf(input)).width),
    );
    await expect(widths).toEqual([173, 300, 550]);
    await expect(rect(middle).height).toBe(rect(base).height);
    await expect(rect(large).height).toBeGreaterThan(rect(base).height);
    await expect(large).toHaveStyle({ fontSize: "16px" });
  },
  parameters: {
    docs: {
      description: {
        story:
          "The three sizes (`size`), each of which also sets the field's width and the size of its icon box.",
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
  play: async ({ canvas }) => {
    const normal = borderOf(field(canvas, "Normal"));
    const error = borderOf(field(canvas, "Error state"));
    const warning = borderOf(field(canvas, "Warning state"));
    await expect(new Set([normal, error, warning]).size).toBe(3);
    await expect(field(canvas, "Disabled")).toBeDisabled();
    // Disabled and loading fields are inert: out of the tab order.
    const disabledRoot = rootOf(field(canvas, "Disabled"));
    await expect(disabledRoot).not.toHaveAttribute("tabindex");
    await expect(disabledRoot).toHaveAttribute("aria-disabled", "true");
    await expect(rootOf(field(canvas, "Loading"))).not.toHaveAttribute(
      "tabindex",
    );
    // An enabled one is a single tab stop: the field inside is not.
    await expect(rootOf(field(canvas, "Normal"))).toHaveAttribute(
      "tabindex",
      "0",
    );
    await expect(field(canvas, "Normal")).toHaveAttribute("tabindex", "-1");
    // Loading swaps the folder icon for a loader.
    const loading = rootOf(field(canvas, "Loading"));
    await expect(loading.querySelector("[class*='loader' i]")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field in each state:\n\n- **Error state**, **Warning state** — the border recoloured (`hasError`, `hasWarning`)\n- **Disabled** — greyed, ignores clicks, drops and keys (`isDisabled`)\n- **Loading** — a spinner in place of the icon, just as inert (`isLoading`)",
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
  name: "Accepted types",
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
          "Fields limited to the types the host can handle (`accept`). The picker offers only these extensions, and a dropped file of another type is refused with a toast.",
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
  name: "Full width",
  render: () => <ScaledTemplate />,
  play: async ({ canvas }) => {
    const root = rootOf(field(canvas, "Scaled file input"));
    await expect(Math.round(rect(root).width)).toBe(
      Math.round(rect(root.parentElement as HTMLElement).width),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A field stretched to the width of its container, for a full-width form column (`scale`).",
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
  name: "With a button",
  render: () => <WithButtonTemplate />,
  play: async ({ canvas }) => {
    // A Browse button after the field, sized with it.
    for (const placeholder of ["Base size", "Middle size", "Large size"]) {
      const input = field(canvas, placeholder);
      const browse = within(rootOf(input)).getByRole("button", {
        name: "Browse",
      });
      await expect(rect(browse).left).toBeGreaterThanOrEqual(
        rect(input).right - 1,
      );
      // The wrapper is the focus stop, not the button inside it.
      await expect(browse).toHaveAttribute("tabindex", "-1");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "A labelled button in place of the icon, which grows with the field's size (`buttonLabel`). The fields are full width (`scale`): at a fixed size the button lands past the field's edge.",
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
  name: "Document icon",
  render: () => <DocumentIconTemplate />,
  play: async ({ canvas }) => {
    const icon = (placeholder: string) =>
      rootOf(field(canvas, placeholder)).querySelector("svg")?.innerHTML;
    await expect(icon("Folder icon")).toBeTruthy();
    await expect(icon("Document icon")).not.toBe(icon("Folder icon"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "The two icons: **Folder icon** by default, **Document icon** for a field that takes one document (`isDocumentIcon`).",
      },
      source: {
        code: `<FileInput size={InputSize.base} placeholder="Folder icon" />
<FileInput size={InputSize.base} placeholder="Document icon" isDocumentIcon />`,
      },
    },
  },
};

export const WithPath: Story = {
  name: "Path from storage",
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
          "A field showing a path from the host's own folder picker (`fromStorage`, `path`). A click on it or its icon calls `onClick` instead of opening the file dialog.",
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
          "--file-input-hover-border": "light-dark(#006ba6, #4fb0e6)",
          "--file-input-focus-border": "light-dark(#004f82, #7cc3ea)",
          "--file-input-radius": "8px",
          // === FileInput — validation states ===
          "--file-input-warning-border": "#e67e00",
          "--file-input-error-border": "#c0392b",
          "--file-input-disabled-border": "light-dark(#b0cce3, #2d5570)",
          "--file-input-placeholder-color": "#7aa8c7",
          // === TextInput (inner text field) ===
          "--text-input-bg": "light-dark(#f0f8ff, #132530)",
          "--text-input-color": "light-dark(#004f82, #7cc3ea)",
          "--text-input-radius": "8px",
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
  name: "CSS customization",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const choose = field(canvas, "Choose file");
    await expect(choose).toHaveStyle({
      borderTopColor: "rgb(0, 130, 201)",
      backgroundColor: "rgb(240, 248, 255)",
    });
    await expect(borderOf(field(canvas, "Warning state"))).toBe(
      "rgb(230, 126, 0)",
    );
    await expect(borderOf(field(canvas, "Error state"))).toBe(
      "rgb(192, 57, 43)",
    );
    await expect(borderOf(field(canvas, "Disabled"))).toBe(
      "rgb(176, 204, 227)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable, set on one wrapper.

- **Choose file** — the border, background, text and radius variables, and the hover and pressed borders
- **Warning state** — \`--file-input-warning-border\` (\`hasWarning\`)
- **Error state** — \`--file-input-error-border\` (\`hasError\`)
- **Disabled** — \`--file-input-disabled-border\` and \`--file-input-placeholder-color\` (\`isDisabled\`)`,
      },
      source: {
        code: `<div
  style={{
    "--file-input-border": "#0082c9",
    "--file-input-hover-border": "light-dark(#006ba6, #4fb0e6)",
    "--file-input-focus-border": "light-dark(#004f82, #7cc3ea)",
    "--file-input-radius": "8px",
    "--file-input-warning-border": "#e67e00",
    "--file-input-error-border": "#c0392b",
    "--file-input-disabled-border": "light-dark(#b0cce3, #2d5570)",
    "--file-input-placeholder-color": "#7aa8c7",
    "--text-input-bg": "light-dark(#f0f8ff, #132530)",
    "--text-input-color": "light-dark(#004f82, #7cc3ea)",
    "--text-input-radius": "8px",
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
