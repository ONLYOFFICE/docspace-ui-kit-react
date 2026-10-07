import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";
import { RootTooltip } from "../tooltip";
import { SelectedItem } from ".";
import styles from "./SelectedItem.stories.module.scss";

const meta = {
  title: "UI/Data display/SelectedItem",
  component: SelectedItem,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text of the chip. An empty label renders nothing at all",
    },
    isInline: {
      control: "boolean",
      description:
        "Shrinks the chip to its content; turned off, the chip fills the width of its container",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys out the label and the cross and stops `onClose` and `onClick` from firing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    propKey: {
      control: "text",
      description:
        "Identifier handed back to `onClose` and `onClick`; it is not used for anything else",
    },
    group: {
      control: "text",
      description:
        "Second identifier handed back to both handlers (`onClose` receives an empty string when it is not set), for chips that belong to several filters",
    },
    hideCross: {
      control: "boolean",
      description:
        "Leaves the cross out, so nothing on the chip fires `onClose`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Draws the chip in its selected colours: a tinted background with the label and icon in the accent colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    icon: {
      control: false,
      description:
        "Glyph before the label: an SVG URL, or a component rendered with no props",
    },
    title: {
      control: "text",
      description:
        "Text of the shared tooltip that opens when the pointer rests on the chip, useful when a long label is cut off; it needs `RootTooltip` mounted",
    },
    onClose: {
      action: "onClose",
      description:
        "Called when the cross is clicked, with `propKey`, `label`, `group` and the event",
    },
    onClick: {
      action: "onClick",
      description:
        "Called when the chip is clicked, with `propKey`, `label`, `group` and the event",
    },
    className: {
      control: "text",
      description: "Class added to the outermost element",
    },
    id: {
      control: "text",
      description: "`id` of the outermost element",
    },
    classNameCloseButton: {
      control: "text",
      description: "Class added to the cross button",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element",
      table: {
        defaultValue: { summary: '"selected-item"' },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref to the outermost element",
    },
    style: {
      control: false,
      description:
        "Ignored: nothing reads it; style the chip through `className` or the CSS custom properties",
    },
    clickable: {
      control: false,
      description:
        "Ignored: nothing reads it; passing `onClick` is what makes the chip clickable",
    },
  },
} satisfies Meta<typeof SelectedItem>;

type Story = StoryObj<ComponentProps<typeof SelectedItem>>;

export default meta;

const noop = () => {};

export const Default: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Selected item",
    isInline: true,
    isDisabled: false,
    onClose: fn(),
    onClick: fn(),
    propKey: "item-1",
  },
  play: async ({ args, canvas, userEvent }) => {
    const chip = canvas.getByTestId("selected-item");

    await userEvent.click(canvas.getByText("Selected item"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(args.onClick).toHaveBeenCalledWith(
      "item-1",
      "Selected item",
      undefined,
      expect.anything(),
    );

    // The cross removes the value. Clicked on the icon drawn inside it, where
    // a pointer lands, the click stops at the cross: onClose fires and the
    // chip's onClick does not.
    const cross = within(chip).getByTestId("icon-button");
    await userEvent.click(cross.querySelector("svg") as SVGElement);
    await expect(args.onClose).toHaveBeenCalledWith(
      "item-1",
      "Selected item",
      "",
      expect.anything(),
    );
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The chip as a filter shows a picked value: click the cross to see `onClose` in the Actions panel, click the label for `onClick`, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<SelectedItem label="Selected item" propKey="item-1" isInline onClose={handleRemove} />`,
      },
    },
  },
};

const rect = (element: Element) => element.getBoundingClientRect();

// The chip around a label.
const chipOf = (
  canvas: { getByText: (text: string) => HTMLElement },
  label: string,
) =>
  canvas
    .getByText(label)
    .closest("[data-testid='selected-item']") as HTMLElement;

export const DisabledState: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Disabled item",
    isInline: true,
    isDisabled: true,
    onClose: fn(),
    onClick: fn(),
    propKey: "item-disabled",
  },
  play: async ({ args, canvas, userEvent }) => {
    const chip = canvas.getByTestId("selected-item");
    await userEvent.click(canvas.getByText("Disabled item"));
    const cross = within(chip).getByTestId("icon-button");
    await userEvent.click(cross.querySelector("svg") as SVGElement);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a value the user may see but not take back: the label and the cross grey out and neither handler fires (`isDisabled`).",
      },
      source: {
        code: `<SelectedItem label="Disabled item" propKey="item-disabled" isInline isDisabled onClose={handleRemove} />`,
      },
    },
  },
};

export const BlockDisplay: Story = {
  render: (args) => <SelectedItem {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    // The chip fills its container's content box and the cross sits at the
    // far end.
    const chip = canvas.getByTestId("selected-item");
    const container = chip.parentElement as HTMLElement;
    const { paddingLeft, paddingRight } = getComputedStyle(container);
    await expect(Math.round(rect(chip).width)).toBe(
      Math.round(
        container.clientWidth -
          parseFloat(paddingLeft) -
          parseFloat(paddingRight),
      ),
    );
    const cross = within(chip).getByTestId("icon-button");
    await expect(rect(cross).left).toBeGreaterThan(
      rect(canvas.getByText("Block display item")).right,
    );
    await expect(rect(chip).right - rect(cross).right).toBeLessThan(20);
    await userEvent.click(cross.querySelector("svg") as SVGElement);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
  args: {
    label: "Block display item",
    isInline: false,
    isDisabled: false,
    onClose: fn(),
    propKey: "item-block",
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a list of picked values stacked one per row: the chip fills the width of its container and pushes the cross to the far end (`isInline={false}`).",
      },
      source: {
        code: `<SelectedItem label="Block display item" propKey="item-block" isInline={false} onClose={handleRemove} />`,
      },
    },
  },
};

const AllVariantsTemplate = () => {
  return (
    <>
      <div className={styles.containerInline}>
        <SelectedItem
          label="Inline enabled"
          propKey="1"
          isInline
          onClose={noop}
        />
        <SelectedItem
          label="Inline disabled"
          propKey="2"
          isInline
          isDisabled
          onClose={noop}
        />
        <SelectedItem
          label="Another item"
          propKey="3"
          isInline
          onClose={noop}
        />
      </div>

      <div className={styles.container}>
        <SelectedItem
          label="Block display item"
          propKey="4"
          isInline={false}
          onClose={noop}
        />
      </div>
    </>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  play: async ({ canvas }) => {
    const enabled = chipOf(canvas, "Inline enabled");
    const block = chipOf(canvas, "Block display item");
    await expect(rect(block).width).toBeGreaterThan(rect(enabled).width * 2);
    // The disabled chip greys its label.
    await expect(
      getComputedStyle(canvas.getByText("Inline disabled")).color,
    ).not.toBe(getComputedStyle(canvas.getByText("Inline enabled")).color);
  },
  parameters: {
    docs: {
      description: {
        story:
          "How the modes sit together in a filter bar:\n\n- **Inline enabled** and **Another item** — inline chips wrapping in a row\n- **Inline disabled** — the same chip with its label and cross greyed out (`isDisabled`)\n- **Block display item** — a chip that fills the row (`isInline={false}`)",
      },
      source: {
        code: `<SelectedItem label="Inline enabled" propKey="1" isInline onClose={handleRemove} />
<SelectedItem label="Inline disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
<SelectedItem label="Another item" propKey="3" isInline onClose={handleRemove} />
<SelectedItem label="Block display item" propKey="4" isInline={false} onClose={handleRemove} />`,
      },
    },
  },
};

export const WithIcon: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Documents",
    isInline: true,
    icon: CatalogFolderIcon,
    onClose: fn(),
    propKey: "item-icon",
  },
  play: async ({ canvas }) => {
    const chip = canvas.getByTestId("selected-item");
    const glyph = chip.querySelector("svg, img") as Element;
    await expect(glyph).not.toBeNull();
    await expect(rect(glyph).right).toBeLessThanOrEqual(
      rect(canvas.getByText("Documents")).left,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a value that is easier to recognise by its kind: a glyph sits before the label (`icon`, here an SVG component; an SVG URL works too).",
      },
      source: {
        code: `import FolderIcon from "./folder.react.svg";

<SelectedItem label="Documents" propKey="item-icon" icon={FolderIcon} isInline onClose={handleRemove} />`,
      },
    },
  },
};

export const ActiveState: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Documents",
    isInline: true,
    isActive: true,
    icon: CatalogFolderIcon,
    onClose: fn(),
    propKey: "item-active",
  },
  play: async ({ canvas }) => {
    // A tinted background, and the label in the accent colour.
    const chip = canvas.getByTestId("selected-item");
    await expect(getComputedStyle(chip).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)",
    );
    await expect(chip.className).toMatch(/isActive|active/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "For the chip the user is working with right now: the background tints and the label and icon take the accent colour (`isActive`).",
      },
      source: {
        code: `<SelectedItem label="Documents" propKey="item-active" icon={FolderIcon} isInline isActive onClose={handleRemove} />`,
      },
    },
  },
};

export const WithoutCross: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Read only",
    isInline: true,
    hideCross: true,
    onClose: fn(),
    onClick: fn(),
    propKey: "item-no-cross",
  },
  play: async ({ args, canvas, userEvent }) => {
    const chip = canvas.getByTestId("selected-item");
    await expect(within(chip).queryByTestId("icon-button")).toBeNull();
    await userEvent.click(chip);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(args.onClose).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a value the user can pick but not remove from the chip itself: the cross is left out and only a click on the chip is reported (`hideCross`).",
      },
      source: {
        code: `<SelectedItem label="Read only" propKey="item-no-cross" isInline hideCross onClose={handleRemove} onClick={handleClick} />`,
      },
    },
  },
};

export const TruncatedLabel: Story = {
  render: (args) => (
    <>
      <SelectedItem {...args} />
      <RootTooltip />
    </>
  ),
  args: {
    label: "Quarterly report drafts and shared spreadsheets",
    title: "Quarterly report drafts and shared spreadsheets",
    isInline: true,
    onClose: fn(),
    propKey: "item-long",
  },
  play: async ({ canvas, userEvent }) => {
    const label = canvas.getByText(
      "Quarterly report drafts and shared spreadsheets",
    );
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await userEvent.hover(canvas.getByTestId("selected-item"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Quarterly report drafts and shared spreadsheets",
      ),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For values longer than a chip can hold: the label is cut off with an ellipsis; rest the pointer on the chip to read the full text in the tooltip (`title`). The tooltip is the kit's shared one, so the app must mount `RootTooltip` once, as this story does.",
      },
      source: {
        code: `<SelectedItem
  label="Quarterly report drafts and shared spreadsheets"
  title="Quarterly report drafts and shared spreadsheets"
  propKey="item-long"
  isInline
  onClose={handleRemove}
/>
<RootTooltip />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  play: async ({ canvas }) => {
    await expect(chipOf(canvas, "Custom item")).toHaveStyle({
      backgroundColor: "rgb(237, 233, 254)",
      borderRadius: "16px",
      height: "28px",
    });
    await expect(canvas.getByText("Disabled")).toHaveStyle({
      color: "rgb(167, 139, 250)",
    });
    await expect(chipOf(canvas, "Active")).toHaveStyle({
      backgroundColor: "rgb(76, 29, 149)",
    });
    await expect(canvas.getByText("Active")).toHaveStyle({
      color: "rgb(255, 255, 255)",
    });
  },
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          "--selected-item-bg": "#ede9fe",
          "--selected-item-bg-hover": "#ddd6fe",
          "--selected-item-disabled-text": "#a78bfa",
          "--selected-item-active-bg": "#4c1d95",
          "--selected-item-active-text": "#ffffff",
          "--selected-item-radius": "16px",
          "--selected-item-padding": "6px 12px",
          "--selected-item-height": "28px",
          "--selected-item-margin-inline": "12px",
          "--selected-item-margin-bottom": "8px",
          "--selected-item-label-margin": "16px",
        } as CSSProperties
      }
    >
      <SelectedItem
        label="Custom item"
        propKey="1"
        isInline
        onClose={() => {}}
      />
      <SelectedItem
        label="Disabled"
        propKey="2"
        isInline
        isDisabled
        onClose={() => {}}
      />
      <SelectedItem
        label="Active"
        propKey="3"
        isInline
        isActive
        onClose={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example has three chips: **Custom item** for the colours and sizes (hover it for the hover background), **Disabled** for \`--selected-item-disabled-text\` (\`isDisabled\`), and **Active** for the two active variables (\`isActive\`).`,
      },
      source: {
        code: `<div
  style={{
    "--selected-item-bg": "#ede9fe",
    "--selected-item-bg-hover": "#ddd6fe",
    "--selected-item-disabled-text": "#a78bfa",
    "--selected-item-active-bg": "#4c1d95",
    "--selected-item-active-text": "#ffffff",
    "--selected-item-radius": "16px",
    "--selected-item-padding": "6px 12px",
    "--selected-item-height": "28px",
    "--selected-item-margin-inline": "12px",
    "--selected-item-margin-bottom": "8px",
    "--selected-item-label-margin": "16px",
  }}
>
  <SelectedItem label="Custom item" propKey="1" isInline onClose={handleRemove} />
  <SelectedItem label="Disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
  <SelectedItem label="Active" propKey="3" isInline isActive onClose={handleRemove} />
</div>`,
      },
    },
  },
};
