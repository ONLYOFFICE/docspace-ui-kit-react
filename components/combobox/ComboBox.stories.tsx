import type React from "react";

import { useState, type CSSProperties, type ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";

import CopyReactSvgUrl from "../../assets/icons/16/copy.react.svg?url";
import DownloadReactSvgUrl from "../../assets/icons/16/download.react.svg?url";
import MoveReactSvgUrl from "../../assets/icons/16/move.react.svg?url";
import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import { globalColors } from "../../providers/theme";

import { ComboBox } from "./ComboBox";
import { ComboBoxDisplayType, ComboBoxSize } from "./ComboBox.enums";
import type { TComboboxProps, TOption } from "./ComboBox.types";

const meta = {
  title: "UI/Form controls/ComboBox",
  component: ComboBox,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=0%3A1&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    displayType: {
      control: "select",
      options: Object.values(ComboBoxDisplayType),
      description:
        "`toggle` renders the button alone and no list at all, for a control that only looks like a combo box",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: Object.values(ComboBoxSize),
      description:
        "Width of the button: 173px for `base`, 300px for `middle`, 350px for `big`, 500px for `huge`, or the width of its content for `content`. Applies only when `scaled` is off",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    scaled: {
      control: "boolean",
      description:
        "Stretches the button to the full width of its parent, in place of the width `size` gives it",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Greys the button out and stops the list opening",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withSearch: {
      control: false,
      description:
        "Ignored: nothing reads this prop and there is no search field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noBorder: {
      control: "boolean",
      description:
        "Removes the button's border and background and lowers it to 18px, for a combo box set inside a line of text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropDownMaxHeight: {
      control: "number",
      description:
        "Height of the list in pixels; a longer list scrolls inside it. Without it the list shows every option in full and the arrow keys do not move through it",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        "Side of the button the list opens on: `bottom`, `top`, or `both` to open it below and move it above when it does not fit there",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description:
        "Edge of the button the list aligns to. The list moves to the other edge when it does not fit, unless `fixedDirection` is on",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps the list on the sides `directionX` and `directionY` give, even when it does not fit there",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Renders the list in a portal at the end of the page instead of inside the combo box",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showDisabledItems: {
      control: false,
      description: "Ignored: disabled options are always listed, greyed out",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displaySelectedOption: {
      control: "boolean",
      description:
        "Keeps the selected option clickable in the list and highlights it. Without it that option is greyed out and cannot be picked again",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayArrow: {
      control: "boolean",
      description:
        "Draws the arrow even when there are no options to open. With options the arrow is always drawn",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    modernView: {
      control: "boolean",
      description:
        "Draws the button 28px high with no border and no background, and gives it a grey background on hover and while the list is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Hides the button's label, icon and arrow behind a spinner and stops the list opening",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    searchPlaceholder: {
      control: false,
      description:
        "Ignored: nothing reads this prop and there is no search field",
    },
    manualWidth: {
      control: "text",
      description:
        "Width of the list as a CSS length. It does not change the button's width",
      table: {
        defaultValue: { summary: "200px" },
      },
    },
    textOverflow: {
      control: "boolean",
      description:
        "Cuts a long option label short with an ellipsis instead of wrapping it onto a second line",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Paints the option icons, in the list and in the button, in the text colour. An option's own `fillIcon` wins over it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    options: {
      control: "object",
      description:
        "The options of the list. Each needs a unique `key` and, unless it is a separator, a `label`; it may also carry an `icon`, a `description` shown under the label, `disabled` and a `tooltip`",
    },
    selectedOption: {
      control: "object",
      description:
        "The option shown in the button. The combo box does not change it on its own: keep it in your own state and set it from `onSelect`",
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the option that was clicked, before the list closes",
    },
    onToggle: {
      control: false,
      description:
        "Called when the button is clicked, with the open state being asked for. Passing it without `onBackdropClick` also stops a click outside closing the list",
    },
    onBackdropClick: {
      control: false,
      description:
        "Called when a click outside closes the list, while `withBackdrop` is on",
    },
    onClickSelectedItem: {
      control: false,
      description: "Called when the option already selected is clicked again",
    },
    setIsOpenItemAccess: {
      control: false,
      description:
        "Called with the open state whenever the list opens or closes",
    },
    type: {
      control: "select",
      options: [null, "badge", "onlyIcon", "descriptive"],
      description:
        "Shape of the button: `badge` draws the label as a badge in the option's own colours, `onlyIcon` shows the option's icon without the label, `descriptive` adds the option's `description` under the label",
    },
    plusBadgeValue: {
      control: "number",
      description:
        "Number shown as `+N` after the label, for a summary of several chosen values",
    },
    opened: {
      control: "boolean",
      description:
        "Opens or closes the list from outside whenever it changes; a click on the button still toggles it in between",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutArrow: {
      control: "boolean",
      description: "Hides the arrow, even when there are options to open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    comboIcon: {
      control: false,
      description:
        "Icon drawn in place of the arrow: a component, an element or an SVG URL",
    },
    children: {
      control: false,
      description:
        "Content drawn inside the button before the label. A click on it does not open the list unless `disableIconClick` is off",
    },
    disableIconClick: {
      control: "boolean",
      description: "Ignores a click on `children` instead of opening the list",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    disableItemClick: {
      control: "boolean",
      description:
        "Stops the list opening at all, while the button keeps its normal look",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableItemClickFirstLevel: {
      control: "boolean",
      description:
        "Stops the list opening from a first-level item, on phones and tablets only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    advancedOptions: {
      control: false,
      description:
        "Element whose children replace the list of options, for a menu that is not a list; `options` then only decide whether the button shows an arrow",
    },
    advancedOptionsCount: {
      control: "number",
      description:
        "How many items `advancedOptions` holds, for deciding whether the list becomes a bottom sheet on a phone",
    },
    scaledOptions: {
      control: "boolean",
      description:
        "Makes the list as wide as the button, in place of `manualWidth`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    manualX: {
      control: "text",
      description:
        "Exact horizontal offset of the list from the button, as a CSS length, when the list is not in a portal",
    },
    manualY: {
      control: "text",
      description:
        "Exact vertical offset of the list from the button, when the list is not in a portal",
    },
    offsetX: {
      control: "number",
      description: "Moves the list sideways by this many pixels",
    },
    topSpace: {
      control: "number",
      description:
        "Space in pixels to keep free above the list when it opens upwards",
    },
    optionStyle: {
      control: "object",
      description: "Inline style applied to every option of the list",
    },
    isMobileView: {
      control: "boolean",
      description:
        "Pins the list to the bottom of the screen, full width, while the window is in portrait",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideMobileView: {
      control: "boolean",
      description:
        "Keeps the list under the button on a phone instead of turning it into a bottom sheet. A list of fewer than four options never becomes one",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isNoFixedHeightOptions: {
      control: "boolean",
      description:
        "Lets options of different heights scroll in a plain scrollbar instead of the list that renders only the visible rows",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description: "Marks the list's backdrop as belonging to a side panel",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Lays a backdrop over the page while the list is open, so the next click outside only closes the list",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withBackground: {
      control: "boolean",
      description: "Dims the page behind that backdrop",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description: "Keeps that backdrop fully transparent",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    usePortalBackdrop: {
      control: "boolean",
      description: "Renders that backdrop in the portal, above the page",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop even when another one is already on screen",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    forceCloseClickOutside: {
      control: "boolean",
      description: "Stops the combo box listening for a click outside the list",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBlur: {
      control: false,
      description: "Ignored: the list does not read it",
    },
    withLabel: {
      control: "boolean",
      description:
        "Finds the selected option in the list by its label; off, by its `key`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withoutPadding: {
      control: "boolean",
      description: "Removes the 4px of space above and below the button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noSelect: {
      control: "boolean",
      description:
        "Stops the button's text from being selected with the pointer",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    useImageIcon: {
      control: "boolean",
      description:
        "Draws the kit's placeholder image over the selected option's icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description:
        "Position of the button in the tab order; `-1` takes it out of the tab order",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    title: {
      control: "text",
      description:
        "Tooltip for the whole control, shown on hover when a `RootTooltip` is mounted",
    },
    role: {
      control: false,
      description: "Ignored: nothing reads this prop",
    },
    id: {
      control: "text",
      description: "`id` of the element that wraps the button and the list",
    },
    className: {
      control: "text",
      description: "Class of the element that wraps the button and the list",
    },
    style: {
      control: "object",
      description:
        "Inline style of the element that wraps the button and the list, applied to the list as well",
    },
    dropDownId: {
      control: "text",
      description: "`id` of the list",
    },
    dropDownClassName: {
      control: "text",
      description: "Class of the list",
    },
    dropDownTestId: {
      control: "text",
      description: "`data-testid` of the list",
    },
    dataTestId: {
      control: "text",
      description:
        "`data-testid` of the element that wraps the button and the list",
      table: {
        defaultValue: { summary: "combobox" },
      },
    },
  },
} satisfies Meta<typeof ComboBox>;

type Story = StoryObj<ComponentProps<typeof ComboBox>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div style={{ height: "240px", padding: "20px" }}>{props.children}</div>
  );
};

// The combo box never changes its own selection, so the stories keep it here.
const SelectableComboBox = (props: TComboboxProps) => {
  const [selected, setSelected] = useState<TOption>(props.selectedOption);

  return (
    <ComboBox {...props} selectedOption={selected} onSelect={setSelected} />
  );
};

const defaultOptions = [
  {
    key: 1,
    label: "Open",
    backgroundColor: globalColors.lightBlueMain,
    color: globalColors.white,
  },
  {
    key: 2,
    label: "Done",
    backgroundColor: globalColors.black,
    color: globalColors.white,
  },
  {
    key: 3,
    label: "In Progress",
    backgroundColor: globalColors.white,
    color: globalColors.grayText,
    border: globalColors.lightBlueMain,
  },
  {
    key: 4,
    label: "Pending Review",
    backgroundColor: globalColors.white,
    color: globalColors.grayText,
    border: globalColors.lightBlueMain,
  },
];

// Picking an option writes it back into the args, as a host would.
const renderDefault = (args: TComboboxProps) => {
  const [, updateArgs] = useArgs<TComboboxProps>();

  return (
    <Wrapper>
      <ComboBox
        {...args}
        onSelect={(option) => {
          args.onSelect?.(option);
          updateArgs({ selectedOption: option });
        }}
      />
    </Wrapper>
  );
};

export const Default: Story = {
  render: renderDefault,
  args: {
    options: defaultOptions,
    selectedOption: { key: 0, label: "Select Status" },
    dropDownMaxHeight: 200,
    scaled: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fixed-width combo box with a placeholder in the button, as a form shows it before anything is chosen. Pick an option to see it replace the placeholder, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `const [status, setStatus] = useState<TOption>({ key: 0, label: "Select Status" });

<ComboBox
  options={statusOptions}
  selectedOption={status}
  onSelect={setStatus}
  scaled={false}
  dropDownMaxHeight={200}
/>`,
      },
    },
  },
};

const DifferentSizesTemplate = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {Object.values(ComboBoxSize).map((size) => (
        <ComboBox
          key={size}
          options={defaultOptions}
          selectedOption={{ key: 0, label: `Size: ${size}` }}
          size={size}
          directionY="bottom"
          scaled={false}
          fixedDirection
          isDefaultMode={false}
        />
      ))}
    </div>
  );
};

export const DifferentSizes: Story = {
  render: () => <DifferentSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The fixed widths side by side, to pick the one that fits the longest label a form expects: `base` 173px, `middle` 300px, `big` 350px, `huge` 500px, and `content`, as wide as the label (`size`, with `scaled` off).",
      },
      source: {
        code: `<ComboBox size={ComboBoxSize.base} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.middle} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.big} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.huge} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.content} options={options} selectedOption={selected} />`,
      },
    },
  },
};

const WithIconsTemplate = () => {
  return (
    <Wrapper>
      <SelectableComboBox
        options={[
          { key: 1, label: "Move", icon: MoveReactSvgUrl },
          { key: 2, label: "Copy", icon: CopyReactSvgUrl },
          { key: 3, label: "Download", icon: DownloadReactSvgUrl },
        ]}
        selectedOption={{ key: 0, label: "Select Type" }}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      />
    </Wrapper>
  );
};

export const WithIcons: Story = {
  render: () => <WithIconsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Options with an icon each, so an action is recognised before its label is read; pick one and its icon moves into the button next to the label (`icon` on each option).",
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Move", icon: MoveIcon },
    { key: 2, label: "Copy", icon: CopyIcon },
    { key: 3, label: "Download", icon: DownloadIcon },
  ]}
  selectedOption={{ key: 0, label: "Select Type" }}
/>`,
      },
    },
  },
};

const descriptionOptions = [
  {
    key: 1,
    label: "Original format",
    icon: CatalogFolderReactSvgUrl,
    description: "Keeps each file in the format it was uploaded in",
  },
  {
    key: 2,
    label: "PDF",
    icon: CatalogFolderReactSvgUrl,
    description: "A fixed layout that looks the same on every device",
  },
  {
    key: 3,
    label: "Plain text",
    icon: CatalogFolderReactSvgUrl,
    description: "Only the words, without images or formatting",
  },
];

const WithOptionDescriptionsTemplate = () => {
  return (
    <Wrapper>
      <SelectableComboBox
        options={descriptionOptions}
        selectedOption={descriptionOptions[1]}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
        size={ComboBoxSize.content}
        manualWidth="354px"
        displaySelectedOption
        modernView
        scaled={false}
      />
    </Wrapper>
  );
};

export const WithOptionDescriptions: Story = {
  render: () => <WithOptionDescriptionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Options whose label alone does not explain the choice: open the list and each row shows the label with a line of explanation under it (`description` on each option). The selected row is highlighted and stays clickable (`displaySelectedOption`).",
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Original format", icon: FolderIcon, description: "Keeps each file in the format it was uploaded in" },
    { key: 2, label: "PDF", icon: FolderIcon, description: "A fixed layout that looks the same on every device" },
    { key: 3, label: "Plain text", icon: FolderIcon, description: "Only the words, without images or formatting" },
  ]}
  selectedOption={selected}
  onSelect={setSelected}
  size={ComboBoxSize.content}
  manualWidth="354px"
  displaySelectedOption
  modernView
  scaled={false}
/>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <ComboBox
        options={defaultOptions}
        selectedOption={{ key: 0, label: "Select Status" }}
        dropDownMaxHeight={200}
        scaled={false}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
        isDisabled
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A choice that cannot be changed right now, kept on screen so the reader still sees the value: the button is greyed out and a click does not open the list (`isDisabled`).",
      },
      source: {
        code: `<ComboBox options={options} selectedOption={selected} isDisabled />`,
      },
    },
  },
};

const WithSelectedOptionTemplate = () => {
  return (
    <Wrapper>
      <SelectableComboBox
        options={defaultOptions}
        selectedOption={defaultOptions[0]}
        dropDownMaxHeight={200}
        scaled={false}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      />
    </Wrapper>
  );
};

export const WithSelectedOption: Story = {
  render: () => <WithSelectedOptionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A form that opens with a value already chosen. Open the list: the chosen option is greyed out and cannot be picked again, because `displaySelectedOption` is off; turn it on to keep it clickable and highlighted instead.",
      },
      source: {
        code: `<ComboBox options={options} selectedOption={options[0]} />`,
      },
    },
  },
};

const priorityOptions = [
  {
    key: 1,
    label: "Critical",
    backgroundColor: "#FF4444",
    color: "#FFFFFF",
  },
  {
    key: 2,
    label: "High",
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
  },
  {
    key: 3,
    label: "Medium",
    backgroundColor: "#FFD700",
    color: "#000000",
  },
  {
    key: 4,
    label: "Low",
    backgroundColor: "#90EE90",
    color: "#000000",
  },
];

const CustomStylingTemplate = () => {
  return (
    <Wrapper>
      <SelectableComboBox
        options={priorityOptions}
        selectedOption={priorityOptions[0]}
        type="badge"
        noBorder
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
        scaled={false}
      />
    </Wrapper>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'Colour-coded values, such as priorities, where the colour says more than the word: the button draws the chosen option as a badge in its own text and background colours (`type="badge"`, with `color` and `backgroundColor` on each option). Pick another priority to see the badge change; the rows of the list stay plain.',
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Critical", backgroundColor: "#FF4444", color: "#FFFFFF" },
    { key: 2, label: "High", backgroundColor: "#FF8C00", color: "#FFFFFF" },
    { key: 3, label: "Medium", backgroundColor: "#FFD700", color: "#000000" },
    { key: 4, label: "Low", backgroundColor: "#90EE90", color: "#000000" },
  ]}
  selectedOption={priority}
  onSelect={setPriority}
  type="badge"
  noBorder
/>`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <Wrapper>
      <ComboBox
        options={defaultOptions}
        selectedOption={defaultOptions[0]}
        scaled={false}
        isLoading
      />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A value that is still being fetched or saved: the label and the arrow give way to a spinner and a click does not open the list until loading ends (`isLoading`).",
      },
      source: {
        code: `<ComboBox options={options} selectedOption={selected} scaled={false} isLoading />`,
      },
    },
  },
};

// Arabic for "Move", "Copy" and "Download", escaped to keep the source ASCII.
const rtlOptions = [
  { key: 1, label: "\u0646\u0642\u0644", icon: MoveReactSvgUrl },
  { key: 2, label: "\u0646\u0633\u062e", icon: CopyReactSvgUrl },
  {
    key: 3,
    label: "\u062a\u0646\u0632\u064a\u0644",
    icon: DownloadReactSvgUrl,
  },
];

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <SelectableComboBox
        options={rtlOptions}
        selectedOption={rtlOptions[0]}
        scaled={false}
        isDefaultMode={false}
        fixedDirection
      />
    </div>
  ),
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "190px" },
      description: {
        story:
          'The combo box under a right-to-left interface: the icon and the label start at the right edge, the icon is mirrored, and the arrow sits at the left end. Open the list to see its rows aligned to the right as well. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <ComboBox
    options={options}
    selectedOption={selected}
    onSelect={setSelected}
    scaled={false}
  />
</div>`,
      },
    },
  },
};

const baseOptions = [
  { key: 1, label: "Option 1" },
  { key: 2, label: "Option 2" },
  { key: 3, label: "Option 3" },
];

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--combobox-border-color": "#0082c9",
          "--combobox-hover-border-color": "#004f7a",
          "--combobox-focus-border-color": "#7fc4ea",
          "--combobox-radius": "12px",
          "--combobox-inner-padding": "8px 0",
        } as CSSProperties
      }
    >
      <ComboBox
        options={baseOptions}
        selectedOption={{ key: 0, label: "Select option" }}
        size={ComboBoxSize.base}
        onSelect={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The border colours, the radius and the padding set on one wrapper -- the variables are listed under CSS variables on this page. Hover the button to see the hover colour and click it to see the open one.`,
      },
      source: {
        code: `<div style={{
  "--combobox-border-color": "#0082c9",
  "--combobox-hover-border-color": "#004f7a",
  "--combobox-focus-border-color": "#7fc4ea",
  "--combobox-radius": "12px",
  "--combobox-inner-padding": "8px 0",
}}>
  <ComboBox options={options} selectedOption={selected} onSelect={handleSelect} />
</div>`,
      },
    },
  },
};
