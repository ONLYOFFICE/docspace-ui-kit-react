import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MainButton } from ".";

const onNewDocument = fn().mockName("New document");

const itemsModel = [
  {
    key: 0,
    label: "New document",
    icon: CatalogFolderReactSvgUrl,
    onClick: onNewDocument,
  },
  {
    key: 1,
    label: "New spreadsheet",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 2,
    label: "New presentation",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 3,
    label: "Master form",
    icon: CatalogFolderReactSvgUrl,
    items: [
      {
        key: 4,
        label: "From blank",
      },
      {
        key: 5,
        label: "From an existing text file",
      },
    ],
  },
  {
    key: 6,
    label: "New folder",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 7,
    isSeparator: true,
  },
  {
    key: 8,
    label: "Upload",
    icon: CatalogFolderReactSvgUrl,
  },
];

const meta = {
  title: "UI/Interactive elements/MainButton",
  component: MainButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    text: {
      control: "text",
      description:
        "Text drawn in the button. It is the whole label: the component takes no children.",
      table: {
        defaultValue: { summary: '"Button"' },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the button is inert: it dims to 60% opacity, the click and the keys are dropped, and `aria-disabled` is set. It stays focusable.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDropdown: {
      control: "boolean",
      description:
        "Whether clicking opens the menu built from `model`. When `false`, the click calls `onAction` instead.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    onAction: {
      action: "onAction",
      description:
        "Called with the event when the button is clicked or activated with Enter or Space. Only reached while `isDropdown` is `false`.",
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Items of the menu. Only read while `isDropdown` is `true`; may be left out otherwise.",
    },
    hideArrow: {
      control: "boolean",
      description:
        "Whether the arrow beside the text is left out. The menu still opens.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Applied to the button, after the component's own classes.",
    },
    id: {
      control: "text",
      description: "Applied to the button, not to the wrapper around it.",
    },
    style: {
      control: "object",
      description: "Applied to the button as inline style.",
    },
    setRefMap: {
      control: false,
      description:
        "Registers the button's element (a `<button>`) in the portal's guidance map, for the onboarding tour.",
    },
    anchorRef: {
      control: false,
      description:
        "Element the menu is anchored to and sized from. Without it the button's own box is used; pass an outer wrapper when the button sits inside a larger clickable area.",
    },
  },
} satisfies Meta<typeof MainButton>;

type Story = StoryObj<ComponentProps<typeof MainButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ maxWidth: "210px" }}>{props.children}</div>;
};

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const clickButton = async (
  { canvas, userEvent }: PlayContext,
  text: string,
) => {
  const button = canvas.getByRole("button", { name: text });
  await userEvent.click(button);
  return button;
};

// The menu fades in, so an item is found first and seen a moment later.
const findVisibleItem = async (name: string | RegExp) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const isMenuOpen = () =>
  screen.queryAllByRole("menuitem").some((item) => item.checkVisibility());

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Main Button",
    model: itemsModel,
  },
  play: async (context) => {
    const button = await clickButton(context, "Main Button");
    const item = await findVisibleItem("New document");
    // A tap draws no grey flash over the button.
    await expect(
      getComputedStyle(button).getPropertyValue("-webkit-tap-highlight-color"),
    ).toBe("rgba(0, 0, 0, 0)");
    await expect(button).toHaveAttribute("aria-haspopup", "menu");
    await expect(button).toHaveAttribute("aria-expanded", "true");

    // Without descriptions the menu takes the button's width.
    const menu = item.closest(".p-contextmenu") as HTMLElement;
    await expect(menu.getBoundingClientRect().width).toBeCloseTo(
      button.getBoundingClientRect().width,
      0,
    );

    await context.userEvent.click(item);
    await expect(onNewDocument).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(isMenuOpen()).toBe(false));
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button with its menu, which opens on click with the list of things to create.",
      },
      source: {
        code: `<MainButton text="Main Button" model={itemsModel} />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <MainButton
        text="Disabled Button"
        isDisabled
        isDropdown={false}
        model={[]}
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  play: async (context) => {
    // A disabled button drops the click: no menu opens. It stays focusable
    // and says it is disabled.
    const button = await clickButton(context, "Disabled Button");
    await expect(isMenuOpen()).toBe(false);
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).not.toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled button at reduced opacity; a click or a key does nothing (`isDisabled`). It stays in the tab order and is announced as disabled.",
      },
      source: {
        code: `<MainButton text="Disabled Button" isDisabled isDropdown={false} model={[]} />`,
      },
    },
  },
};

const DisabledWithDropdownTemplate = () => {
  return (
    <div style={{ maxWidth: "310px" }}>
      <MainButton
        text="Disabled with Dropdown"
        isDropdown
        isDisabled
        model={itemsModel}
      />
    </div>
  );
};

export const DisabledWithDropdown: Story = {
  name: "Disabled with a menu",
  render: () => <DisabledWithDropdownTemplate />,
  play: async (context) => {
    const button = await clickButton(context, "Disabled with Dropdown");
    // Nor does the keyboard open it.
    button.focus();
    await context.userEvent.keyboard("{Enter}");
    await context.userEvent.keyboard(" ");
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(isMenuOpen()).toBe(false);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story: "A disabled button with a menu: the menu does not open either.",
      },
      source: {
        code: `<MainButton text="Disabled with Dropdown" isDropdown isDisabled model={itemsModel} />`,
      },
    },
  },
};

export const WithAction: Story = {
  name: "Single action",
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Click Me",
    isDropdown: false,
    model: [],
    onAction: fn(),
  },
  play: async (context) => {
    // isDropdown off: no arrow, and the click calls onAction.
    const button = await clickButton(context, "Click Me");
    await expect(context.args.onAction).toHaveBeenCalledTimes(1);
    await expect(button.querySelector("svg")).toBeNull();
    await expect(button).not.toHaveAttribute("aria-haspopup");
    // Enter and Space call it too.
    await context.userEvent.keyboard("{Enter}");
    await context.userEvent.keyboard(" ");
    await expect(context.args.onAction).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A button for a single action, with no arrow (`isDropdown={false}`). A click calls `onAction` instead of opening a list.",
      },
      source: {
        code: `<MainButton text="Click Me" isDropdown={false} model={[]} onAction={handleClick} />`,
      },
    },
  },
};

const describedItemsModel = [
  {
    key: 0,
    label: "Blank document",
    icon: CatalogFolderReactSvgUrl,
    description: "Start from an empty page and add the content yourself.",
  },
  {
    key: 1,
    label: "From template",
    icon: CatalogFolderReactSvgUrl,
    description:
      "Pick a ready-made layout from the gallery and fill in its fields.",
  },
  {
    key: 2,
    label: "Upload file",
    icon: CatalogFolderReactSvgUrl,
    description: "Add a file from your device to the current folder.",
  },
];

const WithItemDescriptionsTemplate = () => {
  return (
    <Wrapper>
      <MainButton text="Create" model={describedItemsModel} />
    </Wrapper>
  );
};

export const WithItemDescriptions: Story = {
  name: "Items with descriptions",
  render: () => <WithItemDescriptionsTemplate />,
  play: async (context) => {
    const button = await clickButton(context, "Create");
    const item = await findVisibleItem(/Blank document/);
    await expect(item).toHaveTextContent(
      "Start from an empty page and add the content yourself.",
    );
    // With descriptions the menu grows past the button's width.
    const menu = item.closest(".p-contextmenu") as HTMLElement;
    await expect(menu.getBoundingClientRect().width).toBeGreaterThan(
      button.getBoundingClientRect().width,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A menu whose items each show a description under the label (`description` on the items of `model`). The menu grows wider than the button to fit the text.",
      },
      source: {
        code: `<MainButton
  text="Create"
  model={[
    {
      key: 0,
      label: "Blank document",
      icon: FolderIcon,
      description: "Start from an empty page and add the content yourself.",
    },
    {
      key: 1,
      label: "From template",
      icon: FolderIcon,
      description: "Pick a ready-made layout from the gallery and fill in its fields.",
    },
  ]}
/>`,
      },
    },
  },
};

const WithDropdownTemplate = () => {
  return (
    <Wrapper>
      <MainButton text="Create new" model={itemsModel} />
    </Wrapper>
  );
};

export const WithDropdown: Story = {
  name: "Full menu",
  render: () => <WithDropdownTemplate />,
  play: async (context) => {
    await clickButton(context, "Create new");
    // A nested list opens from its parent item.
    // On a desktop width a nested list opens when its parent is hovered.
    await context.userEvent.hover(await findVisibleItem("Master form"));
    await findVisibleItem("From blank");
    await expect(screen.getAllByRole("separator").length).toBeGreaterThan(0);

    // The keyboard reaches the same menu: Escape closes it, Tab focuses the
    // button, Enter opens it without picking an item, Enter again picks the
    // highlighted one.
    const button = context.canvas.getByRole("button", { name: "Create new" });
    await context.userEvent.keyboard("{Escape}");
    await waitFor(() => expect(isMenuOpen()).toBe(false));
    await expect(button).toHaveAttribute("aria-expanded", "false");
    button.blur();
    await context.userEvent.tab();
    await expect(button).toHaveFocus();
    onNewDocument.mockClear();
    await context.userEvent.keyboard("{Enter}");
    await findVisibleItem("New document");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(onNewDocument).not.toHaveBeenCalled();
    await context.userEvent.keyboard("{Enter}");
    await expect(onNewDocument).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(isMenuOpen()).toBe(false));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A full menu with icons, nested sub-menus and separators. A click or Enter opens it; the arrow keys move through it and Escape closes it.",
      },
      source: {
        code: `<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New spreadsheet", icon: FolderIcon },
    { key: 2, label: "New presentation", icon: FolderIcon },
    { key: 3, label: "Master form", icon: FolderIcon, items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ]},
    { key: 6, label: "New folder", icon: FolderIcon },
    { key: 7, isSeparator: true },
    { key: 8, label: "Upload", icon: FolderIcon },
  ]}
/>`,
      },
    },
  },
};

export const WithoutArrow: Story = {
  name: "Without the arrow",
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Create new",
    model: itemsModel,
    hideArrow: true,
  },
  play: async (context) => {
    // No arrow, yet a click still opens the menu.
    const button = await clickButton(context, "Create new");
    await expect(button.querySelector("svg")).toBeNull();
    await findVisibleItem("New document");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A button with no arrow beside the text, for a label that alone says it opens a list (`hideArrow`). A click still opens the menu.",
      },
      source: {
        code: `<MainButton text="Create new" model={itemsModel} hideArrow />`,
      },
    },
  },
};

// Framed on Docs, tall enough for the open menu: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <Wrapper>
        <MainButton {...args} />
      </Wrapper>
    </div>
  ),
  args: {
    text: "\u062c\u062f\u064a\u062f",
    model: itemsModel,
  },
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The arrow moves to the left of the label.
    const button = canvas.getByTestId("main-button");
    const label = canvas.getByText("\u062c\u062f\u064a\u062f");
    const arrow = button.querySelector("svg") as SVGElement;
    await expect(arrow.getBoundingClientRect().right).toBeLessThanOrEqual(
      label.getBoundingClientRect().left + 1,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "304px" },
      description: {
        story:
          'The button in a right-to-left layout, with the text at the right edge and the arrow at the left. Its menu has the icons on the right and the sub-menu chevron on the left. The wrapper carries `dir="rtl"`; the direction can also come from the theme\'s `interfaceDirection`.',
      },
      source: {
        code: `<div dir="rtl">
  <MainButton text="\u062c\u062f\u064a\u062f" model={itemsModel} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  play: async ({ canvas }) => {
    // The styled button sits inside the group element.
    await expect(
      canvas.getByTestId("main-button").firstElementChild as HTMLElement,
    ).toHaveStyle({
      backgroundColor: "rgb(0, 130, 201)",
      borderRadius: "50px",
    });
    await expect(canvas.getByText("New")).toHaveStyle({
      color: "rgb(255, 255, 255)",
      fontSize: "14px",
      fontWeight: "600",
    });
  },
  render: () => (
    <div
      style={
        {
          "--main-button-bg": "#0082c9",
          "--main-button-color": "#ffffff",
          "--main-button-icon-color": "#ffffff",
          "--main-button-radius": "50px",
          "--main-button-text-size": "14px",
          "--main-button-text-weight": "600",
          "--main-button-text-line-height": "24px",
          "--main-button-inner-padding": "6px 20px",
        } as CSSProperties
      }
    >
      <Wrapper>
        <MainButton text="New" model={itemsModel} />
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable, set on a wrapper around one button. The menu it opens keeps the button's new width.`,
      },
      source: {
        code: `<div
  style={{
    "--main-button-bg": "#0082c9",
    "--main-button-color": "#ffffff",
    "--main-button-icon-color": "#ffffff",
    "--main-button-radius": "50px",
    "--main-button-text-size": "14px",
    "--main-button-text-weight": "600",
    "--main-button-text-line-height": "24px",
    "--main-button-inner-padding": "6px 20px",
  }}
>
  <MainButton text="New" model={itemsModel} />
</div>`,
      },
    },
  },
};
