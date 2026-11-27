import type React from "react";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentProps,
} from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { expect, fn, screen, waitFor } from "storybook/test";

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
        "`toggle` renders the button alone and no list at all, for a control that only looks like a combo box.",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: Object.values(ComboBoxSize),
      description:
        "One of the fixed widths — 173, 300, 350 or 500px, or the content's own. It only applies when `scaled` is false.",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    scaled: {
      control: "boolean",
      description:
        "Makes the button take the full width of its parent, which overrides `size`.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Greys the button out and stops it opening.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noBorder: {
      control: "boolean",
      description: "Removes the button's border.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropDownMaxHeight: {
      control: "number",
      description:
        "Height of the list in pixels. It is also what gives the list a scrollbar: without it a long list is rendered in full.",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        "Preferred vertical side of the list; it flips to fit the viewport.",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description:
        "Preferred horizontal side of the list; it flips to fit the viewport.",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps `directionX` and `directionY` as given instead of flipping them.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether the list is rendered in a portal on `document.body`.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    displaySelectedOption: {
      control: "boolean",
      description:
        "Keeps the option that is currently selected usable and highlights it. Without it that option is rendered disabled, so the value cannot be picked again.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayArrow: {
      control: "boolean",
      description: "Draws the arrow even when there are no options to open.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    modernView: {
      control: "boolean",
      description: "Compact button with no background until it is open.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the arrow with a spinner and stops the button opening.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    manualWidth: {
      control: "text",
      description:
        "Width of the list as a CSS length. It has nothing to do with the button's width — use `scaledOptions` for that.",
      table: {
        defaultValue: { summary: "200px" },
      },
    },
    textOverflow: {
      control: "boolean",
      description:
        "Truncates an option's label with an ellipsis instead of wrapping it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description: "Recolours the selected option's icon to the text colour.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    options: {
      control: "object",
      description:
        "The options. Each needs a unique `key`, and a `label` unless it is a separator; `disabled`, `icon`, `description`, `isBeta` and `tooltip` are passed to the row.",
    },
    selectedOption: {
      control: "object",
      description:
        "The option to show in the button. The component does not choose it: keep it in your own state and set it from `onSelect`.",
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the option that was clicked. Nothing changes on its own — `selectedOption` is yours to update.",
    },
    onToggle: {
      control: false,
      description:
        "Called with the open state asked for, by a click on the button or a key; the event is a mouse or a keyboard one. Without `onBackdropClick`, a click outside no longer closes the list.",
    },
    onBackdropClick: {
      control: false,
      description:
        "Called when a click outside closes the list, if `withBackdrop` is on.",
    },
    onClickSelectedItem: {
      control: false,
      description: "Called when the option already selected is clicked again.",
    },
    setIsOpenItemAccess: {
      control: false,
      description:
        "Called with the open state whenever it changes, alongside `onToggle`.",
    },
    type: {
      control: "select",
      options: [null, "badge", "onlyIcon", "descriptive"],
      description:
        "Shape of the button: `badge` draws the label as a coloured badge, `onlyIcon` drops the label, `descriptive` adds the option's `description` under it.",
    },
    plusBadgeValue: {
      control: "number",
      description:
        "Number shown as `+N` after the label, for a multi-select summary.",
    },
    opened: {
      control: "boolean",
      description:
        "Opens or closes the list from outside. It seeds the internal state rather than controlling it: the next click on the button wins until this changes.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutArrow: {
      control: "boolean",
      description:
        "Hides the arrow, whatever `displayArrow` and the options say.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    comboIcon: {
      control: false,
      description:
        "Icon to draw instead of the arrow: a component, an element, or a URL.",
    },
    children: {
      control: false,
      description:
        "Content rendered inside the button, before the label. A click on it is ignored unless `disableIconClick` is false.",
    },
    disableIconClick: {
      control: "boolean",
      description:
        "Whether a click on `children` is swallowed instead of opening the list.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    disableItemClick: {
      control: "boolean",
      description:
        "Stops the list opening at all, without the disabled styling.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableItemClickFirstLevel: {
      control: "boolean",
      description:
        "The same, but only for first-level items on a touch device.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    advancedOptions: {
      control: false,
      description:
        "Element whose children replace the list entirely, for a menu that is not a list of options. `options` is then used only for the button.",
    },
    advancedOptionsCount: {
      control: "number",
      description:
        "How many advanced options there are, for deciding the mobile layout.",
    },
    scaledOptions: {
      control: "boolean",
      description:
        "Matches the list's width to the button's instead of `manualWidth`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    manualX: {
      control: "text",
      description:
        "(Non-portal mode) Exact horizontal offset of the list from the button.",
    },
    manualY: {
      control: "text",
      description:
        "(Non-portal mode) Exact vertical offset of the list from the button.",
    },
    offsetX: {
      control: "number",
      description: "Horizontal offset of the list, in pixels.",
    },
    topSpace: {
      control: "number",
      description:
        "Space to leave above the list when it opens upwards, in pixels.",
    },
    optionStyle: {
      control: "object",
      description: "Inline style applied to every option.",
    },
    isMobileView: {
      control: "boolean",
      description:
        "Pins the list to the bottom of the screen, full width, in portrait.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideMobileView: {
      control: "boolean",
      description:
        "Keeps the list anchored to the button on a phone instead of turning it into a bottom sheet.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isNoFixedHeightOptions: {
      control: "boolean",
      description:
        "Renders the options in a plain scrollbar instead of the virtualised list.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description: "Marks the list's backdrop as belonging to a side panel.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Whether the list renders a backdrop to catch the next click.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withBackground: {
      control: "boolean",
      description: "Gives that backdrop its dimming background.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description: "Makes that backdrop transparent.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    usePortalBackdrop: {
      control: "boolean",
      description: "Moves the list's backdrop into the portal, above the page.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop even when another one is already on screen.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    forceCloseClickOutside: {
      control: "boolean",
      description: "Stops the outside-click listener being registered.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withLabel: {
      control: "boolean",
      description:
        "Whether the selected option is matched by label rather than by key.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withoutPadding: {
      control: "boolean",
      description: "Removes the vertical padding around the button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noSelect: {
      control: "boolean",
      description: "Whether the button's text cannot be selected.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    useImageIcon: {
      control: "boolean",
      description:
        "Draws the kit's placeholder image next to the selected option's icon.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description:
        "Position of the button in the tab order; `-1` takes it out. A disabled button is out of the tab order whatever this says.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    title: {
      control: "text",
      description:
        "Hover tooltip for the whole control. It needs `RootTooltip` mounted.",
    },
    id: {
      control: "text",
      description: "Applied to the element that wraps the button and the list.",
    },
    className: {
      control: "text",
      description: "Applied to the element that wraps the button and the list.",
    },
    style: {
      control: "object",
      description: "Applied to the wrapper and, again, to the list.",
    },
    dropDownId: {
      control: "text",
      description: "Applied to the list element.",
    },
    dropDownClassName: {
      control: "text",
      description: "Applied to the list element.",
    },
    dropDownTestId: {
      control: "text",
      description: "Value of `data-testid` on the list.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the wrapper.",
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

// The button is a div with the button role, named by the label it shows.
const comboButton = (canvas: { getByRole: typeof screen.getByRole }) =>
  canvas.getByRole("button", { expanded: false });

// The list may be portalled out of the story root, so look in the page.
const option = (name: string) => screen.getByRole("option", { name });

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

// Holds the pick as a host would, and also writes it back into the args so the
// Controls panel follows. The local state is what the button shows: an args
// update re-renders the story inside Storybook but not under Vitest.
const DefaultComboBox = ({
  updateArgs,
  ...args
}: TComboboxProps & {
  updateArgs: (update: Partial<TComboboxProps>) => void;
}) => {
  const [selected, setSelected] = useState<TOption>(args.selectedOption);

  // A change made in the Controls panel reaches the button too.
  useEffect(() => setSelected(args.selectedOption), [args.selectedOption]);

  return (
    <ComboBox
      {...args}
      selectedOption={selected}
      onSelect={(option) => {
        args.onSelect?.(option);
        setSelected(option);
        updateArgs({ selectedOption: option });
      }}
    />
  );
};

const renderDefault = (args: TComboboxProps) => {
  const [, updateArgs] = useArgs<TComboboxProps>();

  return (
    <Wrapper>
      <DefaultComboBox {...args} updateArgs={updateArgs} />
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
    onSelect: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The pick is written back into the args, and Storybook keeps changed
    // args in the URL, so a reload starts from the last pick rather than the
    // placeholder. Start from whatever is selected and pick something else:
    // the current value is disabled in the list.
    const current = args.selectedOption?.label;
    const target = defaultOptions.find((o) => o.label !== current);
    if (!target) return;

    const button = comboButton(canvas);
    await expect(button).toHaveTextContent(String(current));

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");

    // Checked by what the button shows, not by the onSelect spy: inside
    // Storybook the args update re-renders the story, which resets fn() spies,
    // so the spy reads no calls there while it does under Vitest.
    await userEvent.click(option(target.label));
    await waitFor(() =>
      expect(comboButton(canvas)).toHaveTextContent(target.label),
    );
    await expect(comboButton(canvas)).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fixed-width combo box with a placeholder in the button, as a form shows it before anything is chosen. A picked option replaces the placeholder.",
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
  name: "Sizes",
  render: () => <DifferentSizesTemplate />,
  play: async ({ canvas }) => {
    // Fixed widths per size; content fits the label.
    const widths = canvas
      .getAllByRole("button")
      .map((button) => Math.round(button.getBoundingClientRect().width));
    await expect(widths.slice(0, 4)).toEqual([173, 300, 350, 500]);
    await expect(widths[4]).toBeLessThan(173);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The fixed widths, one above the other (`size`, with `scaled` off). `base` is 173px, `middle` 300px, `big` 350px and `huge` 500px; `content` is as wide as the label.",
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
        fillIcon
      />
    </Wrapper>
  );
};

export const WithIcons: Story = {
  name: "With icons",
  render: () => <WithIconsTemplate />,
  play: async ({ canvas, userEvent }) => {
    const button = comboButton(canvas);
    const highlighted = () =>
      document.getElementById(
        button.getAttribute("aria-activedescendant") ?? "",
      );

    await userEvent.tab();
    await expect(button).toHaveFocus();

    // ArrowDown opens the list on its first option; focus stays on the button.
    await userEvent.keyboard("{ArrowDown}");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(highlighted()).toHaveTextContent("Move");

    await userEvent.keyboard("{ArrowDown}");
    await expect(highlighted()).toHaveTextContent("Copy");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(button).toHaveTextContent("Copy"));
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveFocus();

    await userEvent.keyboard(" ");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Options with an icon each (`icon` on each option). The picked option's icon moves into the button next to its label.",
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Move", icon: MoveIcon },
    { key: 2, label: "Copy", icon: CopyIcon },
    { key: 3, label: "Download", icon: DownloadIcon },
  ]}
  selectedOption={{ key: 0, label: "Select Type" }}
  fillIcon
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
        fillIcon
      />
    </Wrapper>
  );
};

export const WithOptionDescriptions: Story = {
  name: "With option descriptions",
  render: () => <WithOptionDescriptionsTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(comboButton(canvas));
    // displaySelectedOption keeps the current value clickable.
    const pdf = screen.getByRole("option", { name: /^PDF/ });
    await expect(pdf).toHaveAttribute("aria-selected", "true");
    await expect(pdf).not.toHaveAttribute("aria-disabled", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Options with a line of explanation under each label (`description` on each option). The selected row is highlighted and stays clickable (`displaySelectedOption`).",
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
  fillIcon
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
  play: async ({ canvas, userEvent }) => {
    const button = comboButton(canvas);
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).toHaveAttribute("tabindex", "-1");

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(screen.queryByRole("option")).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled combo box that still shows its value (`isDisabled`). The button is greyed out, and a click does not open the list.",
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
  name: "With a value chosen",
  render: () => <WithSelectedOptionTemplate />,
  play: async ({ canvas, userEvent }) => {
    const button = comboButton(canvas);
    await userEvent.click(button);

    // Without displaySelectedOption the current value cannot be picked again.
    await expect(option("Open")).toHaveAttribute("aria-disabled", "true");
    await expect(option("Open")).toHaveAttribute("aria-selected", "true");

    await userEvent.click(option("Done"));
    await waitFor(() => expect(button).toHaveTextContent("Done"));

    // The keyboard in a list with dropDownMaxHeight, which renders through
    // the virtual list: the row drawn as highlighted is the one the button
    // names and the one Enter picks.
    const drawn = () =>
      [
        ...document.querySelectorAll('[role="option"][data-focused="true"]'),
      ].map((node) => node.textContent);
    const named = () =>
      document.getElementById(
        button.getAttribute("aria-activedescendant") ?? "",
      )?.textContent;

    button.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(drawn()).toEqual(["Open"]);
    await expect(named()).toBe("Open");

    // Done is the current value and is skipped.
    await userEvent.keyboard("{ArrowDown}");
    await expect(drawn()).toEqual(["In Progress"]);
    await expect(named()).toBe("In Progress");

    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(button).toHaveTextContent("In Progress"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A combo box that opens with a value already chosen. In its list the chosen option is greyed out and cannot be picked again; `displaySelectedOption` keeps it clickable.",
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
  name: "Badge",
  render: () => <CustomStylingTemplate />,
  play: async ({ canvas, userEvent }) => {
    // The selection shows as a badge in the option's own colours.
    const badge = () => canvas.getByTestId("badge");
    await expect(badge()).toHaveAccessibleName(/Critical/);
    await expect(
      badge().style.getPropertyValue("--badge-background-color"),
    ).toBe("#FF4444");
    await userEvent.click(comboButton(canvas));
    await userEvent.click(await waitFor(() => option("Low")));
    await waitFor(() => expect(badge()).toHaveAccessibleName(/Low/));
    await expect(
      badge().style.getPropertyValue("--badge-background-color"),
    ).toBe("#90EE90");
  },
  parameters: {
    docs: {
      description: {
        story:
          'Priorities drawn as a coloured badge in the button (`type="badge"`). Each option brings its own `color` and `backgroundColor`, and the rows of the list stay plain.',
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
  name: "Loading",
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
  play: async ({ canvas, userEvent }) => {
    const button = comboButton(canvas);
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A combo box whose value is still loading (`isLoading`). A spinner takes the place of the label and the arrow, and a click does not open the list.",
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
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <SelectableComboBox
        options={rtlOptions}
        selectedOption={rtlOptions[0]}
        scaled={false}
        isDefaultMode={false}
        fixedDirection
        fillIcon
      />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas, userEvent }) => {
    const button = comboButton(canvas);
    // The arrow sits at the left end; picking an option still works.
    const arrow = button.querySelector(
      "[data-test-id='combo-button-arrow']",
    ) as Element;
    await expect(arrow.getBoundingClientRect().left).toBeLessThan(
      button.getBoundingClientRect().left +
        button.getBoundingClientRect().width / 2,
    );
    await userEvent.click(button);
    await userEvent.click(await waitFor(() => option("\u0646\u0633\u062e")));
    await waitFor(() =>
      expect(canvas.getByRole("button")).toHaveTextContent(
        "\u0646\u0633\u062e",
      ),
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "190px" },
      description: {
        story:
          "A right-to-left combo box. The icon and the label start at the right edge, the icon is mirrored, and the arrow sits at the left end.",
      },
      source: {
        code: `<div dir="rtl">
  <ComboBox
    options={options}
    selectedOption={selected}
    onSelect={setSelected}
    scaled={false}
    fillIcon
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
  name: "CSS variables",
  play: async ({ canvas }) => {
    await expect(comboButton(canvas)).toHaveStyle({
      borderTopColor: "rgb(0, 130, 201)",
      borderRadius: "12px",
    });
  },
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
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `A combo box under a wrapper that sets the border colours, the radius and the padding. The picture shows the resting blue border and the 12px radius.`,
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
