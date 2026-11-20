import type React from "react";
import type { CSSProperties } from "react";
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { InputSize } from "../text-input";

import { SearchInput } from ".";

const itemsModel = [
  { key: 0, label: "New document", icon: CatalogFolderReactSvgUrl },
  { key: 1, label: "New spreadsheet", icon: CatalogFolderReactSvgUrl },
  { key: 2, label: "New presentation", icon: CatalogFolderReactSvgUrl },
  {
    key: 3,
    label: "Master form",
    icon: CatalogFolderReactSvgUrl,
    items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ],
  },
  { key: 6, label: "New folder", icon: CatalogFolderReactSvgUrl },
  { key: 7, isSeparator: true },
  { key: 8, label: "Upload", icon: CatalogFolderReactSvgUrl },
];

const meta = {
  title: "UI/Form controls/SearchInput",
  component: SearchInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=58-2238&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Height and type size of the field.",
    },
    value: {
      control: "text",
      description:
        "The search term. The field keeps its own copy while the user types and re-seeds it from this prop whenever the prop changes.",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the field and greys it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showClearButton: {
      control: "boolean",
      description:
        "Shows the cross that clears the field. Without it the user has to select and delete the text.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoRefresh: {
      control: "boolean",
      description:
        "Whether typing triggers the debounced `onChange` at all. Setting it to false does not make the callback immediate — it stops the component calling it entirely.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    refreshTimeout: {
      control: "number",
      description: "Milliseconds of quiet typing before `onChange` fires.",
      table: {
        defaultValue: { summary: "1000" },
      },
    },
    scale: {
      control: "boolean",
      description: "Makes the field fill the width of its container.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Text shown while the field is empty.",
    },
    onChange: {
      description:
        "Called with the **string** typed, not the change event, unlike every other input in this kit. It waits for `refreshTimeout` of quiet typing. It is not called when `autoRefresh` is false, or when the clear button empties the field.",
    },
    onClearSearch: {
      description:
        "Called when the clear button is used. `onChange` is deliberately skipped for that transition, so this is the only signal that the search term is now empty.",
    },
    onClick: {
      description: "Called when the field is clicked.",
    },
    onFocus: {
      description: "Called when the field receives focus.",
    },
    children: {
      control: false,
      description:
        "Rendered before the input, inside the same border: `InputBlock`'s prefix.",
    },
    showMainButton: {
      control: "boolean",
      description:
        'Renders a `MainButton` to the left of the field, for the "create new" action a search bar often sits beside.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mainButtonProps: {
      control: false,
      description:
        "Props of the `MainButton` drawn before the field. `showMainButton` is needed too.",
    },
    mainButtonIcon: {
      control: false,
      description: "Icon inside the main button, 12×12; a plus when left out.",
      table: {
        defaultValue: { summary: "plus icon" },
      },
    },
    mainButtonDataTestId: {
      control: "text",
      description: "Value of `data-testid` on the main button's wrapper.",
    },
    hideField: {
      control: "boolean",
      description:
        "Leaves the field out, so only the main button is drawn. The block still takes its width, so whatever follows it stays where it was.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: '"search-input"' },
      },
    },
    id: {
      control: "text",
      description:
        "Id of the `<input>`, for a `<label>` or a `FieldContainer`'s `labelFor` to point at.",
    },
    name: {
      control: "text",
      description: "Name under which the term is submitted with a form.",
    },
    tabIndex: {
      control: "number",
      description:
        "Place of the field in the tab order; left out, the natural one.",
    },
    forwardedRef: {
      control: false,
      description: "Ref to the `<input>`.",
    },
    className: {
      control: "text",
      description: "Class added to the outer element.",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element.",
    },
  },
  args: {
    onChange: fn(),
    onClearSearch: fn(),
    onClick: fn(),
    onFocus: fn(),
  },
} satisfies Meta<typeof SearchInput>;

type Story = StoryObj<ComponentProps<typeof SearchInput>>;

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

const ControlledSearch = (props: {
  initialValue?: string;
  size?: InputSize;
  isDisabled?: boolean;
  scale?: boolean;
  placeholder?: string;
  autoRefresh?: boolean;
  refreshTimeout?: number;
  showClearButton?: boolean;
  showReported?: boolean;
  children?: React.ReactNode;
}) => {
  const {
    initialValue = "",
    size = InputSize.base,
    placeholder = "Search",
    showReported = false,
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue);

  const field = (
    <SearchInput
      size={size}
      value={value}
      onChange={(v) => setValue(v)}
      showClearButton={!!value}
      onClearSearch={() => setValue("")}
      placeholder={placeholder}
      {...rest}
    />
  );

  if (!showReported) return field;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {field}
      <span>Reported to the parent: "{value}"</span>
    </div>
  );
};

// The icon block names the icon it shows: a cross that clears the field, or
// the magnifier.
const iconBlock = (field: HTMLElement) =>
  field
    .closest("[data-testid='input-block']")
    ?.querySelector(".search-cross, .search-loupe") as HTMLElement;

const box = (element: Element) => element.getBoundingClientRect();

// The main button (MainButton) is wrapped with the plus icon in the element
// that takes the click; found by the text it shows.
const mainButton = (
  canvas: { getByText: (text: string) => HTMLElement },
  text: string,
) =>
  (canvas.getByText(text).closest("[data-testid='main-button']") as HTMLElement)
    .parentElement as HTMLElement;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("Search");
    await expect(iconBlock(field)).toHaveClass("search-loupe");

    // onChange gets the string, once typing has paused for refreshTimeout.
    await userEvent.type(field, "report");
    await expect(args.onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith("report"), {
      timeout: 3000,
    });
    await expect(args.onChange).toHaveBeenCalledTimes(1);

    // The cross clears the field and reports through onClearSearch only.
    await expect(iconBlock(field)).toHaveClass("search-cross");
    await userEvent.click(within(iconBlock(field)).getByTestId("icon-button"));
    await expect(field).toHaveValue("");
    await expect(args.onClearSearch).toHaveBeenCalledTimes(1);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    return (
      <div style={{ width: "300px" }}>
        <SearchInput
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
          onClearSearch={() => {
            setValue("");
            args.onClearSearch?.();
          }}
        />
      </div>
    );
  },
  args: {
    id: "default-search",
    isDisabled: false,
    size: InputSize.base,
    scale: false,
    placeholder: "Search",
    value: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A search field as it first appears above a list. Typing turns the magnifier into a cross and calls `onChange` a second later; the cross calls `onClearSearch`.",
      },
      source: {
        code: `const [term, setTerm] = useState("");

<SearchInput
  size={InputSize.base}
  value={term}
  placeholder="Search"
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch size={InputSize.base} initialValue="Base size" />
      <ControlledSearch size={InputSize.middle} initialValue="Middle size" />
      <ControlledSearch size={InputSize.large} initialValue="Large size" />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    const base = canvas.getByDisplayValue("Base size");
    const middle = canvas.getByDisplayValue("Middle size");
    const large = canvas.getByDisplayValue("Large size");
    await expect(base).toHaveStyle({ fontSize: "13px" });
    await expect(middle).toHaveStyle({ fontSize: "13px" });
    await expect(large).toHaveStyle({ fontSize: "16px" });
    await expect(box(large).height).toBeGreaterThan(box(base).height);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The three sizes (`size`): **Base size** and **Middle size** share the 13px text, **Large size** is taller with 16px text.",
      },
      source: {
        code: `<SearchInput size={InputSize.base} value="Base size" />
<SearchInput size={InputSize.middle} value="Middle size" />
<SearchInput size={InputSize.large} value="Large size" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch initialValue="Normal" />
      <ControlledSearch initialValue="Disabled" isDisabled />
      <ControlledSearch initialValue="Scaled" scale />
      <ControlledSearch placeholder="Empty with placeholder" />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("Disabled")).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The looks a search field takes on a page:\n\n- **Normal** — holds text, so it shows the cross that clears it\n- **Disabled** — greyed, no typing, no icon (`isDisabled`)\n- **Scaled** — fills its container (`scale`); here every field already fills its cell\n- **Empty with placeholder** — the magnifier and the placeholder",
      },
      source: {
        code: `<SearchInput value="Normal" />
<SearchInput value="Disabled" isDisabled />
<SearchInput value="Scaled" scale />
<SearchInput placeholder="Empty with placeholder" value="" />`,
      },
    },
  },
};

const AutoRefreshTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch
        placeholder="Type to auto-refresh (1s)"
        autoRefresh
        refreshTimeout={1000}
        showReported
      />
      <ControlledSearch
        placeholder="No auto-refresh"
        autoRefresh={false}
        showReported
      />
    </Wrapper>
  );
};

export const AutoRefreshMode: Story = {
  name: "Auto-refresh",
  render: () => <AutoRefreshTemplate />,
  play: async ({ canvas, userEvent }) => {
    const [auto, manual] = canvas.getAllByText(/Reported to the parent/);

    await userEvent.type(
      canvas.getByPlaceholderText("Type to auto-refresh (1s)"),
      "abc",
    );
    await waitFor(
      () => expect(auto).toHaveTextContent('Reported to the parent: "abc"'),
      { timeout: 3000 },
    );

    // With autoRefresh off nothing reaches the parent, however long it waits.
    await userEvent.type(canvas.getByPlaceholderText("No auto-refresh"), "xyz");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await expect(manual).toHaveTextContent('Reported to the parent: ""');
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two fields, each with a line under it showing what `onChange` reported.\n\n- **Type to auto-refresh (1s)** — the line catches up a second after typing stops (`autoRefresh`, `refreshTimeout`)\n- **No auto-refresh** — the line never changes: `onChange` is not called at all",
      },
      source: {
        code: `// With auto-refresh (1s timeout)
<SearchInput
  autoRefresh
  refreshTimeout={1000}
  placeholder="Type to auto-refresh"
/>

// Without auto-refresh: onChange is never called
<SearchInput autoRefresh={false} placeholder="No auto-refresh" />`,
      },
    },
  },
};

export const WithButton: Story = {
  name: "With create button",
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    const mainButtonProps = {
      text: "Create",
      model: [],
    };

    return (
      <div style={{ width: "500px" }}>
        <SearchInput
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
          onClearSearch={() => {
            setValue("");
            args.onClearSearch?.();
          }}
          mainButtonProps={mainButtonProps}
        />
      </div>
    );
  },
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true,
  },
  play: async ({ canvas }) => {
    // The button on the left, the field taking the rest of the row.
    const create = mainButton(canvas, "Create");
    const field = canvas.getByPlaceholderText("Search");
    await expect(box(create).right).toBeLessThanOrEqual(box(field).left);
    await expect(create.querySelector("svg")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A **Create** button with a plus icon before the field (`showMainButton`, `mainButtonProps`). The field takes the rest of the row.",
      },
      source: {
        code: `<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [] }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`,
      },
    },
  },
};

export const WithButtonAndMenu: Story = {
  name: "With create menu",
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    const mainButtonProps = {
      text: "New",
      model: itemsModel,
    };

    return (
      <div style={{ width: "500px" }}>
        <SearchInput
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
          onClearSearch={() => {
            setValue("");
            args.onClearSearch?.();
          }}
          mainButtonProps={mainButtonProps}
        />
      </div>
    );
  },
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(mainButton(canvas, "New"));
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: /New document/ }),
      ).toBeVisible(),
    );
    await expect(
      screen.getByRole("menuitem", { name: /Upload/ }),
    ).toBeVisible();
    // Master form leads to a submenu.
    await userEvent.hover(
      screen.getByRole("menuitem", { name: /Master form/ }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: /From blank/ }),
      ).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A **New** button whose menu offers several things to create, one with a submenu (`model` in `mainButtonProps`).",
      },
      source: {
        code: `<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{
    text: "New",
    model: [
      { key: 0, label: "New document", icon: FolderIconUrl },
      { key: 1, label: "New spreadsheet", icon: FolderIconUrl },
      { key: 7, isSeparator: true },
      { key: 8, label: "Upload", icon: FolderIconUrl },
    ],
  }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`,
      },
    },
  },
};

export const PersistentClearButton: Story = {
  name: "Cross on an empty field",
  render: () => (
    <Wrapper>
      <ControlledSearch placeholder="Cross on an empty field" showClearButton />
      <ControlledSearch placeholder="Magnifier on an empty field" />
    </Wrapper>
  ),
  play: async ({ canvas }) => {
    await expect(
      iconBlock(canvas.getByPlaceholderText("Cross on an empty field")),
    ).toHaveClass("search-cross");
    await expect(
      iconBlock(canvas.getByPlaceholderText("Magnifier on an empty field")),
    ).toHaveClass("search-loupe");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two empty fields. **Cross on an empty field** keeps a way out of a search still applied (`showClearButton`). **Magnifier on an empty field** is the usual look.",
      },
      source: {
        code: `<SearchInput size={InputSize.base} value="" showClearButton placeholder="Cross on an empty field" />
<SearchInput size={InputSize.base} value="" placeholder="Magnifier on an empty field" />`,
      },
    },
  },
};

export const ContentBeforeText: Story = {
  name: "Prefix before the text",
  render: () => (
    <Wrapper>
      <ControlledSearch placeholder="Search in this folder">
        <img src={CatalogFolderReactSvgUrl} alt="" width={16} height={16} />
      </ControlledSearch>
    </Wrapper>
  ),
  play: async ({ canvas, canvasElement }) => {
    // The icon inside the field, before the text.
    const field = canvas.getByPlaceholderText("Search in this folder");
    const icon = canvasElement.querySelector("img") as HTMLImageElement;
    const block = field.closest("[data-testid='input-block']") as HTMLElement;
    await expect(block).toContainElement(icon);
    await expect(box(icon).right).toBeLessThanOrEqual(box(field).left + 1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Show what the search is limited to without a separate label: the folder icon sits inside the field, before the text (`children`).",
      },
      source: {
        code: `<SearchInput size={InputSize.base} value={term} placeholder="Search in this folder" onChange={setTerm}>
  <img src={folderIconUrl} alt="" width={16} height={16} />
</SearchInput>`,
      },
    },
  },
};

export const DisabledMainButton: Story = {
  name: "Disabled create button",
  render: (args) => (
    <div style={{ width: "500px" }}>
      <SearchInput
        {...args}
        mainButtonProps={{ text: "Create", model: [], isDisabled: true }}
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    // Dimmed, and a click opens nothing.
    const create = mainButton(canvas, "Create");
    await expect(create.className).toMatch(/Disabled/);
    await userEvent.click(create);
    await expect(screen.queryByRole("menuitem")).toBeNull();
    // The field next to it still takes text.
    const field = canvas.getByPlaceholderText("Search");
    await userEvent.type(field, "plan");
    await expect(field).toHaveValue("plan");
  },
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A dimmed **Create** button that keeps its place while unavailable (`isDisabled` in `mainButtonProps`). The search field next to it still works.",
      },
      source: {
        code: `<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [], isDisabled: true }}
  onChange={(value) => setTerm(value)}
/>`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl" style={{ width: "500px" }}>
      <SearchInput
        size={InputSize.base}
        value="بحث"
        scale
        placeholder="بحث"
        showMainButton
        mainButtonProps={{ text: "Create", model: [] }}
        onChange={() => {}}
      />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvasElement, canvas }) => {
    // The button at the right edge, the cross at the left end of the field.
    const create = mainButton(canvas, "Create");
    const field = canvasElement.querySelector("input") as HTMLInputElement;
    await expect(box(create).left).toBeGreaterThanOrEqual(box(field).right);
    const cross = canvasElement.querySelector(".search-cross") as HTMLElement;
    await expect(box(cross).right).toBeLessThanOrEqual(box(field).left + 1);
    await expect(field).toHaveStyle({ direction: "rtl" });
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "58px" },
      description: {
        story:
          "The field in a right-to-left interface: **Create** at the right edge, the cross at the left end, the text from the right. The direction comes from the theme's `interfaceDirection` and the wrapper's `dir=\"rtl\"`.",
      },
      source: {
        code: `<div dir="rtl">
  <SearchInput
    size={InputSize.base}
    value={term}
    scale
    placeholder="بحث"
    showMainButton
    mainButtonProps={{ text: "Create", model: [] }}
    onChange={(value) => setTerm(value)}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  play: async ({ canvas }) => {
    const block = canvas
      .getByPlaceholderText("Custom styled search")
      .closest("[data-testid='input-block']") as HTMLElement;
    await expect(block).toHaveStyle({
      backgroundColor: "rgb(245, 243, 255)",
      borderColor: "rgb(124, 58, 237)",
      borderRadius: "8px",
    });
    await expect(canvas.getByDisplayValue("Search term")).toHaveStyle({
      color: "rgb(76, 29, 149)",
    });
    // The gap between the button and the field.
    const create = mainButton(canvas, "Create");
    const withButton = canvas.getByPlaceholderText("With button");
    const withButtonBlock = withButton.closest(
      "[data-testid='input-block']",
    ) as HTMLElement;
    await expect(
      Math.round(box(withButtonBlock).left - box(create).right),
    ).toBe(24);
  },
  render: () => (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "300px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#7c3aed",
          "--text-input-border-hover": "#4c1d95",
          "--text-input-border-focus": "#c4b5fd",
          "--text-input-color": "#4c1d95",
          "--text-input-radius": "8px",
          "--search-input-icon-fill": "#7c3aed",
          "--search-input-icon-filled-fill": "#db2777",
          "--search-input-gap": "24px",
        } as CSSProperties
      }
    >
      <SearchInput
        size={InputSize.base}
        placeholder="Custom styled search"
        value=""
        onChange={() => {}}
      />
      <SearchInput
        size={InputSize.base}
        placeholder="With value"
        value="Search term"
        onChange={() => {}}
      />
      <SearchInput
        size={InputSize.base}
        placeholder="With button"
        value=""
        scale
        showMainButton
        mainButtonProps={{ text: "Create", model: [] }}
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable, set on one wrapper.

- **Custom styled search** — empty, for the magnifier colour
- **With value** — holds text, for the cross colour
- **With button** — carries the main button, for the gap`,
      },
    },
  },
};
