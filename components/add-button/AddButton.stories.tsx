import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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

export const Default: Story = {
  render: (args) => <AddButton {...args} />,
  args: {
    title: "Add item",
    tabIndex: 0,
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

const WithLabelTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Add item" label="Add user" onClick={() => {}} />
      <AddButton
        title="Add item"
        label="Add group"
        isAction
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const WithLabel: Story = {
  render: () => <WithLabelTemplate />,
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

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Add item" isDisabled onClick={() => {}} />
      <AddButton
        title="Add item"
        label="Disabled with label"
        isDisabled
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
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
