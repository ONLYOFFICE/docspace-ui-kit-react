import type React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import Icon from "../../assets/button.alert.react.svg";
import OutlineIcon from "../../assets/article-hide-menu-icon.react.svg";
import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import { Button, ButtonSize } from ".";

const meta = {
  title: "UI/Interactive elements/Button",
  component: Button,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-3582&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(ButtonSize),
      description:
        "Height of the button: 24px for `extraSmall`, 32px for `small`, 40px for `normal`, 44px for `medium`.",
      table: {
        defaultValue: { summary: "normal" },
      },
    },
    primary: {
      control: "boolean",
      description:
        "Draws the button in the accent colour, for the main action of a view.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accent: {
      control: "boolean",
      description:
        "Draws the button on a light tint of the accent colour, with the text and icon in the accent colour.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Stretches the button to the full width of its container.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filled: {
      control: "boolean",
      description:
        "Draws the button on a neutral grey surface with no border and paints its icon in one colour, the label's hover colour, for toolbar actions.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filledStroke: {
      control: "boolean",
      description:
        "With `filled`, outlines the icon's shapes instead of filling them, for outline-style icons. Does nothing on its own.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the button out, takes it out of the tab order and blocks clicks.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Covers the content with a spinner, keeping the button's width, and disables the button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description: "Draws the hover look without a pointer over the button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isClicked: {
      control: "boolean",
      description:
        "Draws the pressed look without anything pressing the button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text of the button and its accessible name. When empty, the children are shown instead.",
    },
    children: {
      control: false,
      description:
        "Rendered in place of `label` when `label` is empty or unset. A non-empty `label` wins and the children are dropped.",
    },
    icon: {
      control: false,
      description:
        "Shown before the label. Any node, such as an SVG component from your own bundler.",
    },
    minWidth: {
      control: "text",
      description:
        "Smallest width of the button as a CSS length, such as `120px`.",
    },
    tooltipText: {
      control: "text",
      description:
        "Text of a tooltip shown below the button on hover. The button renders it itself, apart from the `title` tooltip.",
    },
    title: {
      control: "text",
      description:
        "Tooltip text shown on hover by the `withTooltip` wrapper. It becomes a native `title` attribute only under `NODE_ENV=test`.",
    },
    type: {
      control: "select",
      options: ["button", "submit"],
      description:
        "`submit` submits the surrounding form. Any other value, `reset` included, renders a plain `button`.",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    onClick: {
      action: "onClick",
      description:
        "Called with the mouse event on a click, Enter or Space. Never called while the button is disabled or loading.",
    },
    tabIndex: {
      control: "number",
      description: "Position of the button in the keyboard tab order.",
    },
    id: {
      control: "text",
      description:
        "HTML id of the button. It also names the `tooltipText` tooltip.",
    },
    className: {
      control: "text",
      description: "Class applied to the button after the component's own.",
    },
    style: {
      control: "object",
      description:
        "Inline styles of the button. `minWidth` is applied over them.",
    },
    testId: {
      control: "text",
      description: "Value of the button's `data-testid` attribute.",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    ref: {
      control: false,
      description: "Ref to the rendered `<button>` element.",
    },
    "aria-label": {
      control: false,
      description:
        "Accessible name of the button, in place of `label`. Names an icon-only button.",
    },
    "aria-disabled": {
      control: false,
      description:
        "Marks the button disabled to assistive technology while it stays focusable and clickable. `isDisabled` sets it to `true` over this value.",
    },
    "aria-busy": {
      control: false,
      description:
        "Marks the button busy to assistive technology. `isLoading` sets it to `true` over this value.",
    },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<ComponentProps<typeof Button>>;

export default meta;

const Wrapper = (props: { isScale: boolean; children: React.ReactNode }) => {
  const { isScale, children } = props;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isScale
          ? "1fr"
          : "repeat( auto-fill, minmax(180px, 1fr) )",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const SIZES = ["ExtraSmall", "Small", "Normal", "Medium"];

const heightOf = (element: Element) => element.getBoundingClientRect().height;

const style = (element: Element) => getComputedStyle(element);

// The buttons of a template, one per size and in size order.
const row = ({ canvas }: PlayContext, prefix: string) =>
  SIZES.map(
    (size) => canvas.getAllByRole("button", { name: `${prefix} ${size}` })[0],
  );

const growsWithSize = async (buttons: HTMLElement[]) => {
  for (let index = 1; index < buttons.length; index += 1) {
    await expect(heightOf(buttons[index])).toBeGreaterThan(
      heightOf(buttons[index - 1]),
    );
  }
};

export const Default: Story = {
  render: (args) => <Button {...args} />,
  args: { size: ButtonSize.small, label: "Button", onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Button" });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    // A native <button>: Enter and Space press it like a click.
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The secondary button, for any action that is not the main one of a view.",
      },
      source: {
        code: `<Button size={ButtonSize.small} label="Button" onClick={handleClick} />`,
      },
    },
  },
};

const PrimaryTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-primary-${size}`}
          primary
          scale={false}
          size={size}
          label={`Primary ${size[0].toUpperCase()}${size.slice(1)}`}
          onClick={() => {}}
        />
      ))}
    </Wrapper>
  );
};

const SecondaryTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-secondary-${size}`}
          scale={false}
          size={size}
          label={`Secondary ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const WithIconTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-icon-prim-${size}`}
          primary
          size={size}
          icon={<Icon />}
          label={`With Icon ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-icon-sec-${size}`}
          size={size}
          icon={<Icon />}
          label={`With Icon ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const IsLoadingTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-load-prim-${size}`}
          primary
          size={size}
          isLoading
          label={`Loading ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-load-sec-${size}`}
          size={size}
          isLoading
          label={`Loading ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const ScaleTemplate = () => {
  return (
    <Wrapper isScale>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-scale-prim-${size}`}
          primary
          size={size}
          label={`Scale ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-scale-sec-${size}`}
          size={size}
          label={`Scale ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const DisabledTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-disabled-prim-${size}`}
          primary
          size={size}
          isDisabled
          label={`Disabled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-disabled-sec-${size}`}
          size={size}
          isDisabled
          label={`Disabled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const ClickedTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-clicked-prim-${size}`}
          primary
          size={size}
          isClicked
          label={`Clicked ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-clicked-sec-${size}`}
          size={size}
          isClicked
          label={`Clicked ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const HoveredTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-hovered-prim-${size}`}
          primary
          size={size}
          isHovered
          label={`Hovered ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-hovered-sec-${size}`}
          size={size}
          isHovered
          label={`Hovered ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const FilledTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-icon-${size}`}
          size={size}
          filled
          icon={<CatalogFolderIcon />}
          label={`Filled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-sec-${size}`}
          size={size}
          filled
          label={`Filled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const FilledStrokeTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-outline-${size}`}
          size={size}
          filled
          icon={<OutlineIcon />}
          label={`Filled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-stroke-sec-${size}`}
          size={size}
          filled
          filledStroke
          icon={<OutlineIcon />}
          label={`FilledStroke ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const TooltipTemplate = () => {
  return (
    <Wrapper isScale={false}>
      <Button
        primary
        size={ButtonSize.small}
        label="Hover me"
        tooltipText="This is a primary button with a tooltip"
      />
      <Button
        size={ButtonSize.normal}
        label="Hover me too"
        tooltipText="This is a secondary button with a tooltip"
      />
      <Button
        primary
        size={ButtonSize.medium}
        icon={<Icon />}
        label="With icon"
        tooltipText="Button with icon and tooltip"
      />
    </Wrapper>
  );
};

export const PrimaryButtons: Story = {
  name: "Primary",
  render: () => <PrimaryTemplate />,
  play: async (context) => {
    const buttons = row(context, "Primary");
    await growsWithSize(buttons);
    // One solid accent background with white text, whatever the size.
    const background = style(buttons[0]).backgroundColor;
    await expect(background).not.toBe("rgba(0, 0, 0, 0)");
    for (const button of buttons) {
      await expect(style(button).backgroundColor).toBe(background);
      await expect(style(button).color).toBe("rgb(255, 255, 255)");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "The main action of a view, on a solid accent background (`primary`), at each of the four sizes.",
      },
      source: {
        code: `<Button primary size={ButtonSize.extraSmall} label="Primary ExtraSmall" />
<Button primary size={ButtonSize.small} label="Primary Small" />
<Button primary size={ButtonSize.normal} label="Primary Normal" />
<Button primary size={ButtonSize.medium} label="Primary Medium" />`,
      },
    },
  },
};

export const SecondaryButtons: Story = {
  name: "Secondary",
  render: () => <SecondaryTemplate />,
  play: async (context) => {
    const buttons = row(context, "Secondary");
    await growsWithSize(buttons);
    // On the page background, with a border.
    for (const button of buttons) {
      await expect(style(button).color).not.toBe("rgb(255, 255, 255)");
      await expect(style(button).borderTopWidth).toBe("1px");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Any action that is not the main one, with no variant prop set. It sits on the page background with a grey border that changes colour on hover.",
      },
      source: {
        code: `<Button size={ButtonSize.extraSmall} label="Secondary ExtraSmall" />
<Button size={ButtonSize.small} label="Secondary Small" />
<Button size={ButtonSize.normal} label="Secondary Normal" />
<Button size={ButtonSize.medium} label="Secondary Medium" />`,
      },
    },
  },
};

export const WithIconButtons: Story = {
  name: "With icon",
  render: () => <WithIconTemplate />,
  play: async ({ canvas }) => {
    // The icon comes before the label.
    for (const button of canvas.getAllByRole("button")) {
      const icon = button.querySelector("svg") as SVGElement;
      const label = button.querySelector("[class*='text']") ?? button;
      await expect(icon).not.toBeNull();
      await expect(icon.getBoundingClientRect().left).toBeLessThan(
        (label as Element).getBoundingClientRect().right,
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "An icon before the label, on primary and secondary buttons (`icon`).",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button primary size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />
<Button size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />`,
      },
    },
  },
};

export const IsLoadingButtons: Story = {
  name: "Loading",
  render: () => <IsLoadingTemplate />,
  play: async ({ canvas }) => {
    for (const button of canvas.getAllByRole("button")) {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute("aria-busy", "true");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "A spinner over the label while an action runs (`isLoading`). The button keeps its width and ignores clicks until the flag is cleared.",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} isLoading label="Loading Small" />
<Button primary size={ButtonSize.normal} isLoading label="Loading Normal" />
<Button size={ButtonSize.small} isLoading label="Loading Small" />
<Button size={ButtonSize.normal} isLoading label="Loading Normal" />`,
      },
    },
  },
};

export const ScaleButtons: Story = {
  name: "Full width",
  render: () => <ScaleTemplate />,
  play: async ({ canvas }) => {
    // As wide as the column the grid gives them.
    const width = (
      canvas.getAllByRole("button")[0].parentElement as HTMLElement
    ).getBoundingClientRect().width;
    for (const button of canvas.getAllByRole("button")) {
      await expect(Math.round(button.getBoundingClientRect().width)).toBe(
        Math.round(width),
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Buttons as wide as their container (`scale`), for narrow screens and dialog footers that share the width.",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} scale label="Scale Small" />
<Button primary size={ButtonSize.normal} scale label="Scale Normal" />
<Button size={ButtonSize.small} scale label="Scale Small" />
<Button size={ButtonSize.normal} scale label="Scale Normal" />`,
      },
    },
  },
};

export const DisabledButtons: Story = {
  name: "Disabled",
  render: () => <DisabledTemplate />,
  play: async ({ canvas }) => {
    for (const button of canvas.getAllByRole("button")) {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute("aria-disabled", "true");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled buttons cannot be clicked or focused: the secondary one turns grey, the primary one fades to 60% opacity (`isDisabled`).",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button primary size={ButtonSize.normal} isDisabled label="Disabled Normal" />
<Button size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button size={ButtonSize.normal} isDisabled label="Disabled Normal" />`,
      },
    },
  },
};

export const ClickedButtons: Story = {
  name: "Pressed look",
  render: () => <ClickedTemplate />,
  play: async (context) => {
    // Drawn pressed with nothing pressing them.
    for (const button of context.canvas.getAllByRole("button")) {
      await expect(button.className).toMatch(/isClicked/);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "The pressed look with nothing pressing the button (`isClicked`). Use it for a button whose action is under way, such as the one that opened a menu.",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} isClicked label="Clicked Small" />
<Button primary size={ButtonSize.normal} isClicked label="Clicked Normal" />
<Button size={ButtonSize.small} isClicked label="Clicked Small" />
<Button size={ButtonSize.normal} isClicked label="Clicked Normal" />`,
      },
    },
  },
};

export const HoveredButtons: Story = {
  name: "Hover look",
  render: () => <HoveredTemplate />,
  play: async (context) => {
    // Drawn hovered with the pointer elsewhere.
    for (const button of context.canvas.getAllByRole("button")) {
      await expect(button.className).toMatch(/isHovered/);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "The hover look with the pointer elsewhere (`isHovered`). Use it for a button that lights up with the element it belongs to, such as a hovered row.",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} isHovered label="Hovered Small" />
<Button primary size={ButtonSize.normal} isHovered label="Hovered Normal" />
<Button size={ButtonSize.small} isHovered label="Hovered Small" />
<Button size={ButtonSize.normal} isHovered label="Hovered Normal" />`,
      },
    },
  },
};

export const FilledButtons: Story = {
  name: "Filled",
  render: () => <FilledTemplate />,
  play: async ({ canvas }) => {
    // No border, and the icon repainted in the text colour.
    for (const button of canvas.getAllByRole("button")) {
      await expect(style(button).borderTopStyle).toMatch(/none|hidden/);
      const path = button.querySelector("svg path");
      if (path) {
        await expect(style(path).fill).toBe(style(button).color);
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "A quiet grey button with no border, for toolbar actions that should not compete with the content (`filled`). The first row shows that an icon is repainted in one colour, whatever colour it was drawn in.",
      },
      source: {
        code: `<Button size={ButtonSize.small} filled label="Filled Small" />
<Button size={ButtonSize.normal} filled label="Filled Normal" />
<Button size={ButtonSize.small} filled icon={<CatalogFolderIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<CatalogFolderIcon />} label="Filled Normal" />`,
      },
    },
  },
};

export const FilledStrokeButtons: Story = {
  name: "Filled with an outline icon",
  render: () => <FilledStrokeTemplate />,
  play: async ({ canvas }) => {
    // The plain filled button paints the outline icon solid; filledStroke
    // keeps it an outline.
    const fillOf = (name: string) =>
      style(
        canvas
          .getAllByRole("button", { name })[0]
          .querySelector("svg path") as Element,
      ).fill;
    await expect(fillOf("Filled Normal")).not.toBe("none");
    await expect(fillOf("FilledStroke Normal")).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "An outline-style icon on a filled button. The first row paints the icon's shapes solid; the second keeps the outline (`filled` with `filledStroke`). `filledStroke` changes nothing without `filled`.",
      },
      source: {
        code: `<Button size={ButtonSize.small} filled icon={<OutlineIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<OutlineIcon />} label="Filled Normal" />
<Button size={ButtonSize.small} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Small" />
<Button size={ButtonSize.normal} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Normal" />`,
      },
    },
  },
};

export const WithTooltip: Story = {
  name: "With tooltip",
  render: () => <TooltipTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Hover me" }));
    // The tooltip is portalled out of the story root, so look in the page;
    // it mounts hidden and fades in, hence the wait.
    await waitFor(() =>
      expect(
        screen.getByText("This is a primary button with a tooltip"),
      ).toBeVisible(),
    );
    // One tooltip, not one per button: each has an id of its own.
    await expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A hint below the button on hover, for an action its label cannot fully explain (`tooltipText`).",
      },
      source: {
        code: `<Button primary size={ButtonSize.small} label="Hover me" tooltipText="This is a primary button with a tooltip" />
<Button size={ButtonSize.normal} label="Hover me too" tooltipText="This is a secondary button with a tooltip" />
<Button primary size={ButtonSize.medium} icon={<Icon />} label="With icon" tooltipText="Button with icon and tooltip" />`,
      },
    },
  },
};

const AccentTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-accent-${size}`}
          size={size}
          accent
          label={`Accent ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-accent-icon-${size}`}
          size={size}
          accent
          icon={<CatalogFolderIcon />}
          label={`Accent ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

export const AccentButtons: Story = {
  name: "Accent",
  render: () => <AccentTemplate />,
  play: async ({ canvas }) => {
    // Accent text on a tint, with the icon repainted to match.
    for (const button of canvas.getAllByRole("button")) {
      const { color, backgroundColor } = style(button);
      await expect(backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      const path = button.querySelector("svg path");
      if (path) await expect(style(path).fill).toBe(color);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "An action that stands out without taking the primary one's place (`accent`). It sits on a light accent tint, with the text and icon in the accent colour.",
      },
      source: {
        code: `<Button size={ButtonSize.small} accent label="Accent Small" />
<Button size={ButtonSize.normal} accent label="Accent Normal" />
<Button size={ButtonSize.small} accent icon={<CatalogFolderIcon />} label="Accent Small" />
<Button size={ButtonSize.normal} accent icon={<CatalogFolderIcon />} label="Accent Normal" />`,
      },
    },
  },
};

const CustomizationTemplate = () => {
  return (
    <div
      style={
        {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          "--button-root-bg": "#fdf2f8",
          "--button-root-color": "#9d174d",
          "--button-root-border": "1px solid #f9a8d4",
          "--button-root-bg-hover": "#fbcfe8",
          "--button-root-color-hover": "#831843",
          "--button-root-border-hover": "1px solid #db2777",
          "--button-root-bg-active": "#f472b6",
          "--button-root-color-active": "#500724",
          "--button-root-border-active": "1px solid #9d174d",
          "--button-root-bg-disabled": "#f5f5f5",
          "--button-root-color-disabled": "#a3a3a3",
          "--button-root-border-disabled": "1px dashed #d4d4d4",
          "--button-primary-bg": "#7c3aed",
          "--button-primary-color": "#fff",
          "--button-primary-border": "1px solid #7c3aed",
          "--button-primary-bg-hover": "#a78bfa",
          "--button-primary-color-hover": "#fff",
          "--button-primary-bg-active": "#4c1d95",
          "--button-primary-color-active": "#ede9fe",
          "--button-primary-border-active": "#2e1065",
          "--button-primary-bg-disabled": "#ddd6fe",
          "--button-primary-color-disabled": "#7c3aed",
          "--button-primary-border-disabled": "1px solid #ddd6fe",
          "--button-root-border-radius": "16px",
          "--button-text-weight": "700",
          "--button-height-md": "48px",
          "--button-font-size-md": "15px",
        } as React.CSSProperties
      }
    >
      <Button size={ButtonSize.normal} label="Secondary" />
      <Button size={ButtonSize.normal} label="Primary" primary />
      <Button size={ButtonSize.normal} label="Disabled" isDisabled />
      <Button size={ButtonSize.normal} label="Disabled" primary isDisabled />
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS customization",
  render: () => <CustomizationTemplate />,
  play: async ({ canvas }) => {
    const [secondary, disabled] = [
      canvas.getByRole("button", { name: "Secondary" }),
      canvas.getAllByRole("button", { name: "Disabled" })[0],
    ];
    await expect(secondary).toHaveStyle({
      backgroundColor: "rgb(253, 242, 248)",
      color: "rgb(157, 23, 77)",
      borderRadius: "16px",
      height: "48px",
      fontSize: "15px",
      fontWeight: "700",
    });
    await expect(canvas.getByRole("button", { name: "Primary" })).toHaveStyle({
      backgroundColor: "rgb(124, 58, 237)",
    });
    await expect(disabled).toHaveStyle({
      borderTopStyle: "dashed",
      color: "rgb(163, 163, 163)",
    });
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable on one wrapper, the hover and pressed colours included; the CSS variables section lists them.

- **Secondary** — the \`--button-root-*\` colours, radius, weight, height and font size.
- **Primary** — the \`--button-primary-*\` colours.
- **Disabled** — the \`--button-root-*-disabled\` values (\`isDisabled\`).
- **Disabled primary** — the \`--button-primary-*-disabled\` values, faded to 60% (\`primary\` with \`isDisabled\`).`,
      },
      source: {
        code: `<div style={{
  "--button-root-bg": "#fdf2f8",
  "--button-root-color": "#9d174d",
  "--button-root-border": "1px solid #f9a8d4",
  "--button-root-bg-hover": "#fbcfe8",
  "--button-root-color-hover": "#831843",
  "--button-root-border-hover": "1px solid #db2777",
  "--button-root-bg-active": "#f472b6",
  "--button-root-color-active": "#500724",
  "--button-root-border-active": "1px solid #9d174d",
  "--button-root-bg-disabled": "#f5f5f5",
  "--button-root-color-disabled": "#a3a3a3",
  "--button-root-border-disabled": "1px dashed #d4d4d4",
  "--button-primary-bg": "#7c3aed",
  "--button-primary-color": "#fff",
  "--button-primary-border": "1px solid #7c3aed",
  "--button-primary-bg-hover": "#a78bfa",
  "--button-primary-color-hover": "#fff",
  "--button-primary-bg-active": "#4c1d95",
  "--button-primary-color-active": "#ede9fe",
  "--button-primary-border-active": "#2e1065",
  "--button-primary-bg-disabled": "#ddd6fe",
  "--button-primary-color-disabled": "#7c3aed",
  "--button-primary-border-disabled": "1px solid #ddd6fe",
  "--button-root-border-radius": "16px",
  "--button-text-weight": "700",
  "--button-height-md": "48px",
  "--button-font-size-md": "15px",
}}>
  <Button label="Secondary" />
  <Button label="Primary" primary />
  <Button label="Disabled" isDisabled />
  <Button label="Disabled" primary isDisabled />
</div>`,
      },
    },
  },
};
