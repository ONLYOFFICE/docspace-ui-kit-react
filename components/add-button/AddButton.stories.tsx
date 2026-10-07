import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import { AddButton } from ".";

const meta = {
  title: "UI/Interactive elements/AddButton",
  component: AddButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Tooltip shown on hover, drawn by the kit's own tooltip rather than the browser's",
    },
    label: {
      control: "text",
      description:
        "Text drawn after the square; clicking it adds too. Without it the button is the square alone",
    },
    onClick: {
      control: false,
      description:
        "Called with the event when the square or the label is clicked, and on Enter while the button has focus",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Makes the button inert: the icon greys out, the label dims and clicks are ignored",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAction: {
      control: "boolean",
      description:
        "Tints the square with the theme's accent colour instead of grey",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Shows a spinner in place of the icon and ignores clicks while it is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    iconNode: {
      control: false,
      description: "Icon element drawn in the square instead of the plus",
    },
    iconName: {
      control: "text",
      description:
        "URL of an icon fetched at runtime; ignored when `iconNode` is set",
    },
    iconSize: {
      control: "number",
      description:
        "Size of the icon inside the square, in pixels; the square keeps its size",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    size: {
      control: "text",
      description:
        "Side of the square, as a CSS length; applied only when the theme supplies a colour scheme",
    },
    fontSize: {
      control: "text",
      description: "Font size of the label, as a CSS length",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    lineHeight: {
      control: "text",
      description: "Line height of the label, as a CSS length",
      table: {
        defaultValue: { summary: "20px" },
      },
    },
    truncate: {
      control: "boolean",
      description:
        "Cuts the label with an ellipsis instead of wrapping it, once the parent limits the width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    titleText: {
      control: "text",
      description:
        "Browser tooltip of the label, shown on hovering the text, unlike `title`",
    },
    noSelect: {
      control: "boolean",
      description: "Stops the label from being selected with the pointer",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl", "auto"],
      description: "Writing direction of the label text",
    },
    tabIndex: {
      control: "number",
      description:
        "Tab order of the button; without it the button cannot be focused and Enter does nothing",
    },
    className: {
      control: "text",
      description:
        "Class added to the wrapper that holds the square and the label",
    },
    id: {
      control: "text",
      description: "Id of the square, not of the wrapper",
    },
    style: {
      control: "object",
      description: "Inline style of the square, not of the wrapper",
    },
    testId: {
      control: "text",
      description: "`data-testid` of the square",
      table: {
        defaultValue: { summary: "selector-add-button" },
      },
    },
  },
} satisfies Meta<typeof AddButton>;

type Story = StoryObj<ComponentProps<typeof AddButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const rect = (element: Element) => element.getBoundingClientRect();

const squares = (canvas: { getAllByTestId: (id: string) => HTMLElement[] }) =>
  canvas.getAllByTestId("selector-add-button");

const iconOf = (square: HTMLElement) =>
  square.querySelector("svg") as SVGElement;

export const Default: Story = {
  render: (args) => <AddButton {...args} />,
  args: {
    title: "Add item",
    tabIndex: 0,
  },
  play: async ({ args, canvas, userEvent }) => {
    // With tabIndex the wrapper is a tab stop, and Enter adds.
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByTestId("selector-add-button"));
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bare square with a plus, for a list that needs one more item and has room for no label. Click it, or press Tab and then Enter, and the Actions panel logs the call (`onClick`, `tabIndex`); change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<AddButton title="Add item" tabIndex={0} onClick={handleAdd} />`,
      },
    },
  },
};

type ClickProps = Pick<ComponentProps<typeof AddButton>, "onClick">;

const WithLabelTemplate = ({ onClick }: ClickProps) => {
  return (
    <Wrapper>
      <AddButton title="Add item" label="Add user" onClick={onClick} />
      <AddButton
        title="Add item"
        label="Add group"
        isAction
        onClick={onClick}
      />
    </Wrapper>
  );
};

export const WithLabel: Story = {
  render: (args) => <WithLabelTemplate onClick={args.onClick} />,
  play: async ({ args, canvas, userEvent }) => {
    // The words add too, not only the square.
    await userEvent.click(canvas.getByText("Add user"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A label says what gets added when a bare plus would leave the reader guessing, and clicking the words adds too. **Add user** is the grey square; **Add group** is the accent tint (`isAction`).",
      },
      source: {
        code: `<AddButton title="Add item" label="Add user" onClick={handleClick} />
<AddButton title="Add item" label="Add group" isAction onClick={handleClick} />`,
      },
    },
  },
};

const DisabledTemplate = ({ onClick }: ClickProps) => {
  return (
    <Wrapper>
      <AddButton title="Add item" isDisabled tabIndex={0} onClick={onClick} />
      <AddButton
        title="Add item"
        label="Disabled with label"
        isDisabled
        onClick={onClick}
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: (args) => <DisabledTemplate onClick={args.onClick} />,
  play: async ({ args, canvas, userEvent }) => {
    const [square] = canvas.getAllByTestId("selector-add-button");
    await userEvent.click(square);
    await userEvent.click(canvas.getByText("Disabled with label"));

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled button stays in place so the reader sees the action exists but is not available now: the square turns a lighter grey, the icon greys out and the label dims, and clicks and Enter are ignored (`isDisabled`).",
      },
      source: {
        code: `<AddButton title="Add item" isDisabled />
<AddButton title="Add item" label="Disabled with label" isDisabled />`,
      },
    },
  },
};

const AccentTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Default" onClick={() => {}} />
      <AddButton title="Accent" isAction onClick={() => {}} />
    </Wrapper>
  );
};

export const AccentStyle: Story = {
  render: () => <AccentTemplate />,
  play: async ({ canvas }) => {
    const [plain, accent] = squares(canvas);
    await expect(getComputedStyle(accent).backgroundColor).not.toBe(
      getComputedStyle(plain).backgroundColor,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The accent tint marks the add button that matters most on a screen. **Default** is the grey square; **Accent** is tinted with the theme's accent colour (`isAction`).",
      },
      source: {
        code: `<AddButton title="Default" onClick={handleClick} />
<AddButton title="Accent" isAction onClick={handleClick} />`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <AddButton {...args} />,
  args: {
    title: "Adding...",
    isLoading: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const [square] = squares(canvas);
    // A spinner in place of the plus, in a square of the same size.
    await expect(Math.round(rect(square).width)).toBe(32);
    await expect(
      square.querySelector("[class*='loader' i], [data-testid*='loader' i]"),
    ).not.toBeNull();
    await userEvent.click(square);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "While the item is being added, a spinner stands in for the icon so a second click does not add it twice; clicks are ignored until loading ends, and the square keeps its size (`isLoading`).",
      },
      source: {
        code: `<AddButton title="Adding..." isLoading />`,
      },
    },
  },
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: "150px" }}>
      <AddButton
        title="Add item"
        label="This is a very long label that should be truncated"
        truncate
        onClick={() => {}}
      />
    </div>
  );
};

export const TruncatedLabel: Story = {
  render: () => <TruncatedTemplate />,
  play: async ({ canvas }) => {
    const label = canvas.getByText(
      "This is a very long label that should be truncated",
    );
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(rect(label).right).toBeLessThanOrEqual(
      rect(label.closest("div[style]") as Element).right,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "In a narrow column a long label is cut with an ellipsis instead of wrapping under the square; the parent here is 150px wide (`truncate`).",
      },
      source: {
        code: `<AddButton title="Add item" label="Very long label text..." truncate onClick={handleClick} />`,
      },
    },
  },
};

const CustomSizeTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Default" onClick={() => {}} />
      <AddButton
        title="Large icon"
        iconSize={16}
        size="36px"
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const CustomIconSize: Story = {
  render: () => <CustomSizeTemplate />,
  play: async ({ canvas }) => {
    const [plain, large] = squares(canvas);
    await expect(Math.round(rect(plain).width)).toBe(32);
    await expect(Math.round(rect(large).width)).toBe(36);
    await expect(Math.round(rect(iconOf(plain)).width)).toBe(12);
    await expect(Math.round(rect(iconOf(large)).width)).toBe(16);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A bigger square and icon suit a roomier layout. **Default** is the 32px square with a 12px icon; **Large icon** is a 36px square (`size`) with a 16px icon (`iconSize`).",
      },
      source: {
        code: `<AddButton title="Default" onClick={handleClick} />
<AddButton title="Large icon" iconSize={16} size="36px" onClick={handleClick} />`,
      },
    },
  },
};

const CustomIconTemplate = () => {
  return (
    <Wrapper>
      <AddButton
        title="Add folder"
        label="Add folder"
        iconSize={16}
        iconNode={<CatalogFolderIcon />}
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const WithCustomIcon: Story = {
  render: () => <CustomIconTemplate />,
  play: async ({ canvas }) => {
    const [square] = squares(canvas);
    await expect(Math.round(rect(iconOf(square)).width)).toBe(16);
  },
  parameters: {
    docs: {
      description: {
        story:
          "When a plus does not say enough about what gets added, the square can carry any icon; here a folder icon at 16px (`iconNode`, `iconSize`). An icon given by URL is fetched at runtime instead (`iconName`).",
      },
      source: {
        code: `<AddButton
  title="Add folder"
  label="Add folder"
  iconSize={16}
  iconNode={<FolderIcon />}
  onClick={handleAdd}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  play: async ({ canvas }) => {
    const [square] = squares(canvas);
    await expect(square).toHaveStyle({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "rgb(124, 58, 237)",
    });
    // The gap is the label's own leading padding.
    await expect(canvas.getByText("Add item")).toHaveStyle({
      paddingInlineStart: "16px",
    });
    await expect(canvas.getByText("Disabled")).toHaveStyle({
      color: "rgb(196, 181, 253)",
    });
  },
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "12px",
          alignItems: "center",
          "--add-button-radius": "50%",
          "--add-button-dimension": "40px",
          "--add-button-bg": "#7c3aed",
          "--add-button-bg-hover": "#a78bfa",
          "--add-button-bg-active": "#4c1d95",
          "--add-button-icon-color": "#ffffff",
          "--add-button-icon-color-hover": "#ffffff",
          "--add-button-icon-color-active": "#ddd6fe",
          "--add-button-text-gap": "16px",
          "--add-button-text-disabled": "#c4b5fd",
        } as CSSProperties
      }
    >
      <AddButton
        title="With label"
        label="Add item"
        iconSize={20}
        onClick={() => {}}
      />
      <AddButton
        title="Disabled"
        label="Disabled"
        iconSize={20}
        isDisabled
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Add item** shows the square, icon and gap variables; hover and press it near its edge to see the hover and active colours. **Disabled** is there for \`--add-button-text-disabled\`, the only variable that survives the disabled state: the theme draws its square and icon in its own greys.`,
      },
      source: {
        code: `<div
  style={{
    "--add-button-radius": "50%",
    "--add-button-dimension": "40px",
    "--add-button-bg": "#7c3aed",
    "--add-button-bg-hover": "#a78bfa",
    "--add-button-bg-active": "#4c1d95",
    "--add-button-icon-color": "#ffffff",
    "--add-button-icon-color-hover": "#ffffff",
    "--add-button-icon-color-active": "#ddd6fe",
    "--add-button-text-gap": "16px",
    "--add-button-text-disabled": "#c4b5fd",
  }}
>
  <AddButton label="Add item" iconSize={20} onClick={handleAdd} />
  <AddButton label="Disabled" iconSize={20} isDisabled />
</div>`,
      },
    },
  },
};
