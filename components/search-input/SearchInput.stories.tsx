import type React from "react";
import type { CSSProperties } from "react";
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
      description:
        "Height and text size of the field, one of the kit's input sizes; required, with no default",
    },
    value: {
      control: "text",
      description:
        "The search term. The field keeps its own copy while the user types and takes this value again whenever it changes",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field, blocks typing and hides both the magnifier and the cross",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showClearButton: {
      control: "boolean",
      description:
        "Shows the cross on an empty field too; while the field holds text the cross is shown either way",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoRefresh: {
      control: "boolean",
      description:
        "Whether typing calls `onChange` at all. Off does not make the callback immediate: the component stops calling it",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    refreshTimeout: {
      control: "number",
      description:
        "Milliseconds the user has to stop typing before `onChange` is called",
      table: {
        defaultValue: { summary: "1000" },
      },
    },
    scale: {
      control: "boolean",
      description: "Stretches the field to the full width of its container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Text shown in the empty field",
    },
    onChange: {
      description:
        "Called with the typed string, not the change event, once typing pauses; never called for the clear button or when `autoRefresh` is off",
    },
    onClearSearch: {
      description:
        "Called when the cross is clicked; the only signal that the field is now empty",
    },
    onClick: {
      description: "Called when the text field is clicked",
    },
    onFocus: {
      description: "Called when the text field receives focus",
    },
    children: {
      control: false,
      description: "Content shown inside the field, before the text",
    },
    showMainButton: {
      control: "boolean",
      description:
        "Places the button described by `mainButtonProps` to the left of the field; nothing is shown without those props",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mainButtonProps: {
      control: false,
      description:
        "Props of the button to the left of the field: its text, its dropdown `model`, `isDisabled`; its arrow is always hidden",
    },
    mainButtonIcon: {
      control: false,
      description: "Icon shown in that button before its text, 12 by 12 pixels",
      table: {
        defaultValue: { summary: "plus icon" },
      },
    },
    mainButtonDataTestId: {
      control: "text",
      description: "Value of `data-testid` on the button's wrapper",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: '"search-input"' },
      },
    },
    id: {
      control: "text",
      description: "HTML `id` of the outer element and of the text field",
    },
    name: {
      control: "text",
      description: "HTML `name` of the text field",
    },
    tabIndex: {
      control: "number",
      description: "HTML `tabindex` of the text field",
      table: {
        defaultValue: { summary: "-1" },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref to the text field's `<input>` element",
    },
    className: {
      control: "text",
      description: "Class added to the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
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

export const Default: Story = {
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
          "A search field as it first appears above a list: type to see the magnifier turn into a cross, pause for a second to see `onChange` in the Actions panel, click the cross to see `onClearSearch`; change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Match the search field to the inputs around it: **Base size** and **Middle size** share the 13px text, **Large size** is taller with 16px text (`size`).",
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
  parameters: {
    docs: {
      description: {
        story:
          "The looks a search field takes on a page. **Normal** holds text, so it shows the cross that clears it. **Disabled** is greyed, cannot be typed into and shows neither magnifier nor cross (`isDisabled`). **Scaled** fills the width of its container (`scale`); in this grid every field already fills its cell, so the difference shows in a wider container. **Empty with placeholder** shows the magnifier and the placeholder text.",
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
  render: () => <AutoRefreshTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Decide how the parent hears about the search term. Type into **Type to auto-refresh (1s)**: the line under it catches up a second after you stop (`autoRefresh`, `refreshTimeout`). Type into **No auto-refresh**: the line under it never changes, because with `autoRefresh` off the component does not call `onChange` at all.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Put the create action next to the search it belongs with: the **Create** button with its plus icon sits to the left of the field (`showMainButton`, `mainButtonProps`), and the field takes the rest of the row.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Offer several things to create from one button: click **New** to open its menu of items, one of them with a submenu (`model` in `mainButtonProps`).",
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
  render: () => (
    <Wrapper>
      <ControlledSearch placeholder="Cross on an empty field" showClearButton />
      <ControlledSearch placeholder="Magnifier on an empty field" />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Keep a way out of a search the parent still applies after the field was emptied: **Cross on an empty field** shows the cross with no text in it (`showClearButton`), **Magnifier on an empty field** is the usual look. With text in the field both show the cross.",
      },
      source: {
        code: `<SearchInput size={InputSize.base} value="" showClearButton placeholder="Cross on an empty field" />
<SearchInput size={InputSize.base} value="" placeholder="Magnifier on an empty field" />`,
      },
    },
  },
};

export const ContentBeforeText: Story = {
  render: () => (
    <Wrapper>
      <ControlledSearch placeholder="Search in this folder">
        <img src={CatalogFolderReactSvgUrl} alt="" width={16} height={16} />
      </ControlledSearch>
    </Wrapper>
  ),
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
  render: (args) => (
    <div style={{ width: "500px" }}>
      <SearchInput
        {...args}
        mainButtonProps={{ text: "Create", model: [], isDisabled: true }}
      />
    </div>
  ),
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
          "Keep the create action in place while it is unavailable: the **Create** button is dimmed (`isDisabled` in `mainButtonProps`), the search field next to it still works.",
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
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "58px" },
      description: {
        story:
          'The same field under a right-to-left interface: the **Create** button moves to the right edge, the cross moves to the left end of the field and the text starts at the right. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Custom styled search** is empty and shows the magnifier color; **With value** holds text and shows the cross color; **With button** carries the main button, for the gap. Hover a field and click into it to see the two other border colors.`,
      },
    },
  },
};
