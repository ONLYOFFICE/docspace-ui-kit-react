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
        "Height of the button: 24px for `extraSmall`, 32px for `small`, 40px for `normal`, 44px for `medium`",
      table: {
        defaultValue: { summary: "normal" },
      },
    },
    primary: {
      control: "boolean",
      description:
        "Draws the button in the accent colour, for the main action of a view",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accent: {
      control: "boolean",
      description:
        "Draws the button on a light tint of the accent colour, with the text and icon in the accent colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Stretches the button to the full width of its container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filled: {
      control: "boolean",
      description:
        "Draws the button on a neutral grey surface with no border and paints its icon in the text colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filledStroke: {
      control: "boolean",
      description:
        "Used together with `filled`: outlines the icon's shapes instead of filling them, for outline-style icons; does nothing on its own",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the button out, takes it out of the tab order and blocks clicks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Hides the content behind a spinner, keeping the button's width, and disables it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description:
        "Draws the hover look while the pointer is not over the button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isClicked: {
      control: "boolean",
      description: "Draws the pressed look while nothing presses the button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text of the button, which is also its accessible name; when empty, the children are shown instead",
    },
    children: {
      control: false,
      description: "Content shown in place of `label` when `label` is empty",
    },
    icon: {
      control: false,
      description: "Icon node shown before the label",
    },
    minWidth: {
      control: "text",
      description:
        "Smallest width of the button as a CSS length, such as `120px`",
    },
    tooltipText: {
      control: "text",
      description: "Text of a tooltip shown below the button on hover",
    },
    title: {
      control: "text",
      description:
        "Text of a tooltip shown on hover; it never becomes a native `title` attribute",
    },
    type: {
      control: "select",
      options: ["button", "submit"],
      description:
        "Native button type: `submit` submits the surrounding form, any other value renders `button`",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    onClick: {
      action: "onClick",
      description: "Called with the mouse event when the button is clicked",
    },
    tabIndex: {
      control: "number",
      description: "Position of the button in the keyboard tab order",
    },
    id: {
      control: "text",
      description:
        "HTML id of the button; also names its `tooltipText` tooltip",
    },
    className: {
      control: "text",
      description: "Class applied to the button after the component's own",
    },
    style: {
      control: "object",
      description: "Inline styles of the button",
    },
    testId: {
      control: "text",
      description: "Value of the button's `data-testid` attribute",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    ref: {
      control: false,
      description: "Ref to the rendered `<button>` element",
    },
    "aria-label": {
      control: false,
      description:
        "Replaced by `label` on every render, so a value passed here never reaches the button",
    },
    "aria-disabled": {
      control: false,
      description:
        "Replaced on every render: set to `true` while `isDisabled`, removed otherwise",
    },
    "aria-busy": {
      control: false,
      description:
        "Replaced on every render: set to `true` while `isLoading`, removed otherwise",
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
          "The secondary button, for any action that is not the main one of a view; click it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
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
  render: () => <PrimaryTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Primary buttons are used for main actions. They have a solid background color.",
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
  render: () => <SecondaryTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Secondary buttons are used for secondary actions. They sit on the page background with a grey border that changes colour on hover.",
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
  render: () => <WithIconTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Buttons can include icons alongside text. Icons are displayed before the label.",
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
  name: "Loading Buttons",
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
          "Loading state displays a spinner and disables interaction. Use for async operations.",
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
  render: () => <ScaleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Scale prop makes buttons expand to 100% of their container width. Useful for mobile layouts.",
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
  render: () => <ClickedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The pressed look drawn while nothing presses the button (`isClicked`), for a button whose action is already under way, such as the one that opened the menu now on screen.",
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
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The hover look drawn while the pointer is elsewhere (`isHovered`), for a button that should light up together with the element it belongs to, such as a hovered row.",
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
  render: () => <FilledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A quiet grey button with no border, for toolbar actions that should not compete with the content (`filled`). The first row shows that an icon is repainted in the text colour, whatever colour it was drawn in.",
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
  render: () => <FilledStrokeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "An outline-style icon on a filled button: in the first row the filled button paints the icon's shapes solid, in the second it keeps the outline (`filled` with `filledStroke`). `filledStroke` changes nothing without `filled`.",
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
          "Buttons can display tooltips on hover. Hover over the buttons to see the tooltip text.",
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
  render: () => <AccentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "An emphasised action that should stand out without taking the place of the primary one: a light accent tint with accent text, and an icon repainted in the same colour (`accent`).",
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
  render: () => <CustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover and press the buttons to see the hover and pressed values.

- **Secondary** — the \`--button-root-*\` colours, the radius, the weight and the \`normal\` size's height and font size
- **Primary** — the \`--button-primary-*\` colours
- **Disabled** — the \`--button-root-*-disabled\` values (\`isDisabled\`)
- **Disabled primary** — the \`--button-primary-*-disabled\` values, faded to 60% opacity by the component (\`primary\` with \`isDisabled\`)`,
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
