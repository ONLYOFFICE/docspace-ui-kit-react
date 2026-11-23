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
      description: "Label of the link, usually the value the menu changes.",
    },
    data: {
      control: "object",
      description:
        "Entries of the menu. Each is a `DropDownItem`'s props; `key` is required, and `onClick` is called with the event.",
    },
    fontSize: {
      control: "text",
      description: "Font size of the text, as a CSS length.",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description:
        "Weight of the text, such as `600`; ignored while `isBold` is set.",
    },
    isBold: {
      control: "boolean",
      description: "Sets the weight to 700, over `fontWeight`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "CSS colour of the text.",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the link is inert: it greys out and clicking no longer opens the menu.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withExpander: {
      control: "boolean",
      description:
        "Whether a chevron is drawn after the text, which turns over while the menu is open.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description:
        'Whether the link is drawn at half opacity, the portal\'s "pending" look.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description:
        "Whether the text is truncated with an ellipsis at 200px instead of wrapping.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropdownType: {
      control: "select",
      options: ["alwaysDashed", "appearDashedAfterHover"],
      description:
        "Whether the dashed underline is always drawn or appears on hover.",
      table: {
        defaultValue: { summary: "alwaysDashed" },
      },
    },
    manualWidth: {
      control: "text",
      description:
        "Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry, up to 200px.",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        'Whether the menu opens above or below the link. Passed straight to `DropDown`, which defaults to `"bottom"`.',
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Whether the menu keeps `directionX` and `directionY` even when it does not fit there.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description:
        'Which side of the link the menu is aligned to. Passed straight to `DropDown`, which defaults to `"right"`.',
      table: {
        defaultValue: { summary: "right" },
      },
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the menu starts open. The component then keeps that state itself; changing this prop re-syncs it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description:
        "Text of the kit's shared tooltip on the label, for a truncated one. It shows only while `RootTooltip` is mounted.",
    },
    hasScroll: {
      control: "boolean",
      description:
        "Whether the menu is wrapped in a scrollbar of its own. It only takes effect on a phone.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withDynamicScrollbar: {
      control: "boolean",
      description:
        "Whether the menu measures the room around the link on every open and scrolls inside what is left.",
    },
    topSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave above the menu, in pixels.",
    },
    bottomSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave below the menu, in pixels.",
    },
    isAside: {
      control: "boolean",
      description:
        "Passed to the menu's backdrop, which then keeps an aside panel above itself.",
    },
    withoutBackground: {
      control: "boolean",
      description: "Passed to the menu's backdrop: makes it transparent.",
    },
    className: {
      control: "text",
      description:
        "Applied to the outermost element, and to the link inside it.",
    },
    dropDownClassName: {
      control: "text",
      description: "Applied to the menu.",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    style: {
      control: "object",
      description: "Applied to the outermost element as inline style.",
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

    // The trigger is in the tab order and works from the keyboard.
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard(" ");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
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
          "A link that opens a three-item menu. Picking an entry calls its `onClick` and closes the menu.",
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
  name: "With chevron",
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
          "A link with a chevron after its label, which turns over while the menu is open (`withExpander`).",
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
  name: "Custom font and colour",
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
          "A link with its own font size, weight and colour (`fontSize`, `fontWeight`, `color`).",
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
    // Out of the tab order, and the keys do nothing either.
    await expect(trigger).toHaveAttribute("tabindex", "-1");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled link (`isDisabled`): a click no longer opens the menu, and the cursor stays an arrow. In the light theme the text keeps its default grey.",
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
  name: "Semitransparent",
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
  name: "Menu of exact width",
  render: () => <WithCustomWidthTemplate />,
  play: async (context) => {
    await opens(context, "Custom Width Link");
    // The width reaches the menu as its --manual-width, and the 200px cap
    // of a self-sizing menu does not apply to it.
    const menu = screen.getByRole("listbox");
    await expect(menu.style.getPropertyValue("--manual-width")).toBe("300px");
    await expect(Math.round(menu.getBoundingClientRect().width)).toBe(300);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A menu of an exact width (`manualWidth`), wider than the 200px a self-sizing menu stops at.",
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
  name: "Truncated label",
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
          "A long label cut at 200px with an ellipsis, with the chevron beside it (`isTextOverflow`).",
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
    <div
      style={{
        height: "260px",
        overflow: "hidden",
        transform: "translateZ(0)",
      }}
    >
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
    </div>
  );
};

export const OpenMenu: Story = {
  name: "Open menu",
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
          "A menu open from the first render (`isOpen`). The link keeps its highlighted background, and the chevron points up.",
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
  name: "CSS variables",
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
        story: `Two links under a wrapper that sets the variables. The first shows the text, background, radius and padding; the second, disabled, shows \`--link-with-dropdown-disabled-color\`.`,
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
