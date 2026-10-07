import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { LinkWithDropdown } from ".";

const meta = {
  title: "UI/Interactive elements/LinkWithDropdown",
  component: LinkWithDropdown,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    children: {
      control: "text",
      description: "Text of the link",
    },
    data: {
      control: "object",
      description:
        "Entries of the menu, each with the props of a `DropDownItem`: a required `key`, a `label`, an `onClick` called with the click event, or `isSeparator` for a divider line",
    },
    fontSize: {
      control: "text",
      description: "Font size of the link text",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Font weight of the text, as a number",
    },
    isBold: {
      control: "boolean",
      description: "Quick way to make text bold",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "Text color of the link",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Makes the link inert: clicking no longer opens the menu and the cursor stays an arrow",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withExpander: {
      control: "boolean",
      description:
        "Draws a chevron after the text, which turns over while the menu is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description: "Draws the link at half opacity",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description:
        "Truncates the text with an ellipsis at 200px instead of wrapping it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropdownType: {
      control: "select",
      options: ["alwaysDashed", "appearDashedAfterHover"],
      description:
        "Whether the dashed underline is always drawn or appears on hover. Currently neither value draws an underline",
      table: {
        defaultValue: { summary: "alwaysDashed" },
      },
    },
    manualWidth: {
      control: "text",
      description:
        "Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        "Whether the menu opens above or below the link; `both` opens it below unless it would run off the bottom of the window",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps the menu on the chosen sides even when it does not fit there, instead of flipping it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Which side of the link the menu is aligned to",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the menu starts open. The link then keeps that state itself; changing this prop re-syncs it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description:
        "Tooltip text for the label. It opens the kit's shared tooltip, which appears only where the page mounts `RootTooltip`; no native `title` attribute is set",
    },
    hasScroll: {
      control: "boolean",
      description:
        "Wraps the menu in a scrollbar of its own, 250px tall (100px in landscape). It only takes effect on a phone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withDynamicScrollbar: {
      control: "boolean",
      description:
        "Measures the room around the link on every open and scrolls the menu inside what is left",
    },
    topSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave above the menu, in pixels",
    },
    bottomSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave below the menu, in pixels",
    },
    isAside: {
      control: "boolean",
      description:
        "Passed to the menu's backdrop, which then keeps an aside panel above itself",
    },
    withoutBackground: {
      control: "boolean",
      description: "Passed to the menu's backdrop: makes it transparent",
    },
    className: {
      control: "text",
      description:
        "Class added to the outermost element and to the link inside it",
    },
    dropDownClassName: {
      control: "text",
      description: "Class added to the menu",
    },
    id: {
      control: "text",
      description: "`id` of the outermost element",
    },
    style: {
      control: "object",
      description: "Inline style of the outermost element",
    },
    isHovered: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the hover look comes from CSS",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", marginBottom: "200px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkWithDropdown>;

type Story = StoryObj<ComponentProps<typeof LinkWithDropdown>>;

export default meta;

const dropdownItems = [
  {
    key: "key1",
    label: "Button 1",
    onClick: fn().mockName("Button 1"),
  },
  {
    key: "key2",
    label: "Button 2",
    onClick: fn().mockName("Button 2"),
  },
  {
    key: "key3",
    isSeparator: true,
  },
  {
    key: "key4",
    label: "Button 3",
    onClick: fn().mockName("Button 3"),
  },
];

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The styled root: padding, radius and colours sit on it.
const root = (trigger: HTMLElement) =>
  trigger.closest('[data-test-id="link-dropdown"]') as HTMLElement;

const opens = async ({ canvas, userEvent }: PlayContext, name: string) => {
  const trigger = canvas.getByRole("button", { name });
  await userEvent.click(trigger);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "Button 1" })).toBeVisible(),
  );
  return trigger;
};

export const Default: Story = {
  render: (args) => <LinkWithDropdown {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Default Link" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Picking an entry runs its own onClick and closes the menu.
    await userEvent.click(screen.getByRole("option", { name: "Button 2" }));
    await expect(dropdownItems[1].onClick).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
  args: {
    children: "Default Link",
    data: dropdownItems,
    fontSize: "13px",
    fontWeight: 400,
    isBold: false,
    isTextOverflow: false,
    isSemitransparent: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The link with a three-item menu; click it to open the menu, pick an entry to see its `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<LinkWithDropdown
  data={[
    { key: "key1", label: "Button 1", onClick: handleClick },
    { key: "key2", label: "Button 2", onClick: handleClick },
    { key: "key3", isSeparator: true },
    { key: "key4", label: "Button 3", onClick: handleClick },
  ]}
>
  Default Link
</LinkWithDropdown>`,
      },
    },
  },
};

const WithExpanderTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      withExpander
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Link with Expander
    </LinkWithDropdown>
  );
};

export const WithExpander: Story = {
  render: () => <WithExpanderTemplate />,
  play: async (context) => {
    const trigger = context.canvas.getByRole("button", {
      name: "Link with Expander",
    });
    await expect(trigger.querySelector("svg")).not.toBeNull();
    await opens(context, "Link with Expander");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Link with an expander arrow icon that indicates the presence of a dropdown menu.",
      },
      source: {
        code: `<LinkWithDropdown data={items} withExpander>Link with Expander</LinkWithDropdown>`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="16px"
      fontWeight={600}
      isBold
      color="#4781d1"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Styled Link
    </LinkWithDropdown>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  play: async ({ canvas }) => {
    const label = canvas.getByText("Custom Styled Link");
    await expect(label).toHaveStyle({
      color: "rgb(71, 129, 209)",
      fontSize: "16px",
    });
    await expect(
      Number(getComputedStyle(label).fontWeight),
    ).toBeGreaterThanOrEqual(600);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Link with custom font size, weight, and color for styled appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} fontSize="16px" fontWeight={600} isBold color="#4781d1">
  Custom Styled Link
</LinkWithDropdown>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
      Disabled Link
    </LinkWithDropdown>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button");
    await expect(trigger).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it while the options do not apply yet: clicking no longer opens the menu and the cursor stays an arrow (`isDisabled`). In the light theme the text keeps the default grey, so the state is not visible until the link is clicked.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isDisabled>Disabled Link</LinkWithDropdown>`,
      },
    },
  },
};

const SemiTransparentTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      isSemitransparent
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Semi-transparent Link
    </LinkWithDropdown>
  );
};

export const SemiTransparent: Story = {
  render: () => <SemiTransparentTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Semi-transparent Link" }),
    ).toHaveStyle({ opacity: "0.5" });
  },
  parameters: {
    docs: {
      description: {
        story: "Link with reduced opacity for a subtle, secondary appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isSemitransparent>Semi-transparent Link</LinkWithDropdown>`,
      },
    },
  },
};

const WithCustomWidthTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      manualWidth="300px"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Width Link
    </LinkWithDropdown>
  );
};

export const WithCustomWidth: Story = {
  render: () => <WithCustomWidthTemplate />,
  play: async (context) => {
    await opens(context, "Custom Width Link");
    // The width reaches the menu as its --manual-width.
    await expect(
      screen.getByRole("listbox").style.getPropertyValue("--manual-width"),
    ).toBe("300px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Link with a manually set dropdown width for controlling the menu size.",
      },
      source: {
        code: `<LinkWithDropdown data={items} manualWidth="300px">Custom Width Link</LinkWithDropdown>`,
      },
    },
  },
};

const TextOverflowTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      isTextOverflow
      withExpander
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      A long link label that does not fit in the available width
    </LinkWithDropdown>
  );
};

export const TextOverflow: Story = {
  render: () => <TextOverflowTemplate />,
  play: async ({ canvas }) => {
    const label = canvas.getByText(/^A long link label/);
    // Cut at 200px with an ellipsis, the chevron still beside it.
    await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(200);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(label).toHaveStyle({ textOverflow: "ellipsis" });
    await expect(canvas.getByRole("button").querySelector("svg")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it where a label can be longer than its place: the text stops at 200px with an ellipsis and the chevron stays beside it (`isTextOverflow`).",
      },
      source: {
        code: `<LinkWithDropdown
  data={items}
  isTextOverflow
  withExpander
>
  A long link label that does not fit in the available width
</LinkWithDropdown>`,
      },
    },
  },
};

const OpenMenuTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      withExpander
      isOpen
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Open Link
    </LinkWithDropdown>
  );
};

export const OpenMenu: Story = {
  render: () => <OpenMenuTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Open from the first render; a click outside, which lands on the
    // backdrop, closes it.
    const trigger = canvas.getByRole("button", { name: "Open Link" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Button 1" })).toBeVisible(),
    );
    const backdrop = screen
      .getAllByTestId("backdrop")
      .find((element) => element.checkVisibility());
    if (!backdrop) throw new Error("No visible backdrop");
    await userEvent.click(backdrop);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false"),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The menu shown on first render (`isOpen`): the link keeps its highlighted background and the chevron points up while the menu is open. Clicking outside or picking an entry closes it.",
      },
      source: {
        code: `<LinkWithDropdown data={items} withExpander isOpen>
  Open Link
</LinkWithDropdown>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  play: async ({ canvas }) => {
    const customized = root(
      canvas.getByRole("button", { name: "Customized Link" }),
    );
    await expect(customized).toHaveStyle({
      color: "rgb(124, 58, 237)",
      backgroundColor: "rgb(245, 243, 255)",
      borderRadius: "8px",
      padding: "6px 12px",
    });
    await expect(
      canvas.getByRole("button", { name: "Disabled Link" }),
    ).toHaveStyle({ color: "rgb(196, 181, 253)" });
  },
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "16px",
          "--link-with-dropdown-color": "#7c3aed",
          "--link-with-dropdown-bg": "#f5f3ff",
          "--link-with-dropdown-hover-color": "#5b21b6",
          "--link-with-dropdown-hover-bg": "#ddd6fe",
          "--link-with-dropdown-disabled-color": "#c4b5fd",
          "--link-with-dropdown-radius": "8px",
          "--link-with-dropdown-padding": "6px 12px",
        } as CSSProperties
      }
    >
      <LinkWithDropdown
        data={dropdownItems}
        fontSize="13px"
        withExpander
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      >
        Customized Link
      </LinkWithDropdown>
      <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
        Disabled Link
      </LinkWithDropdown>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. The first link shows the text, background, radius and padding variables; hover it or open its menu to see the hover pair. The second, with \`isDisabled\`, is there for \`--link-with-dropdown-disabled-color\`.`,
      },
      source: {
        code: `<div
  style={{
    "--link-with-dropdown-color": "#7c3aed",
    "--link-with-dropdown-bg": "#f5f3ff",
    "--link-with-dropdown-hover-color": "#5b21b6",
    "--link-with-dropdown-hover-bg": "#ddd6fe",
    "--link-with-dropdown-disabled-color": "#c4b5fd",
    "--link-with-dropdown-radius": "8px",
    "--link-with-dropdown-padding": "6px 12px",
  }}
>
  <LinkWithDropdown data={items} withExpander>
    Customized Link
  </LinkWithDropdown>
  <LinkWithDropdown data={items} isDisabled>
    Disabled Link
  </LinkWithDropdown>
</div>`,
      },
    },
  },
};
