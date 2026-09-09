import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchReactSvgUrl from "../../assets/search.react.svg?url";

import { InputSize, InputType } from "../text-input";

import { InputBlock } from ".";
import type { InputBlockProps } from "./InputBlock.types";

const meta = {
  title: "UI/Interactive elements/InputBlock",
  component: InputBlock,
  parameters: {
    docs: {
      description: {
        component: `Input field with integrated icon support, combining a text input with an action icon button.

### Features

- **Icon Integration**: Attach icons with customizable colors and click handlers
- **Multiple Types**: text, password, email, tel, search, and number
- **Three Sizes**: base, middle, and large
- **Validation States**: Error and warning visual indicators
- **Read-Only & Disabled**: Prevent editing or interaction
- **Full Width**: Scale to 100% width when needed

### Usage

\`\`\`tsx
import { InputBlock } from "@onlyoffice/apps-ui-kit/components/input-block";
import { InputSize, InputType } from "@onlyoffice/apps-ui-kit/components/text-input";

<InputBlock
  type={InputType.text}
  size={InputSize.base}
  iconName={SearchIconUrl}
  placeholder="Search..."
  value={value}
  onChange={handleChange}
  onIconClick={handleSearch}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Size of the input field",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    type: {
      control: "select",
      options: Object.values(InputType),
      description: "HTML input type",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Make the input read-only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Show warning state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Scale input to 100% width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    iconName: {
      control: "text",
      description: "Path to the icon SVG",
    },
    iconColor: {
      control: "color",
      description: "Icon color",
    },
    hoverColor: {
      control: "color",
      description: "Icon hover color",
    },
    isIconFill: {
      control: "boolean",
      description: "Fill the icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof InputBlock>;

type Story = StoryObj<ComponentProps<typeof InputBlock>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledInputBlock = (props: InputBlockProps) => {
  const [value, setValue] = useState(props.value || "");

  return (
    <InputBlock
      {...props}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
    />
  );
};

const defaultProps: InputBlockProps = {
  placeholder: "Enter text here",
  maxLength: 255,
  size: InputSize.base,
  type: InputType.text,
  isDisabled: false,
  isReadOnly: false,
  hasError: false,
  hasWarning: false,
  scale: false,
  iconName: SearchReactSvgUrl,
  isIconFill: false,
  value: "",
};

export const Default: Story = {
  render: (args) => <ControlledInputBlock {...args} />,
  args: defaultProps,
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.base}
        placeholder="Base size"
      />
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.middle}
        placeholder="Middle size"
      />
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.large}
        placeholder="Large size"
      />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "InputBlock supports three sizes: base, middle, and large for different UI contexts.",
      },
      source: {
        code: `<InputBlock size={InputSize.base} placeholder="Base size" iconName={SearchIcon} />
<InputBlock size={InputSize.middle} placeholder="Middle size" iconName={SearchIcon} />
<InputBlock size={InputSize.large} placeholder="Large size" iconName={SearchIcon} />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInputBlock
        {...defaultProps}
        placeholder="Normal"
      />
      <ControlledInputBlock
        {...defaultProps}
        hasError
        placeholder="Error state"
      />
      <ControlledInputBlock
        {...defaultProps}
        hasWarning
        placeholder="Warning state"
      />
      <ControlledInputBlock
        {...defaultProps}
        isDisabled
        placeholder="Disabled"
      />
      <ControlledInputBlock
        {...defaultProps}
        isReadOnly
        value="Read-only content"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "InputBlock supports normal, error, warning, disabled, and read-only states.",
      },
      source: {
        code: `<InputBlock placeholder="Normal" iconName={SearchIcon} />
<InputBlock placeholder="Error state" hasError iconName={SearchIcon} />
<InputBlock placeholder="Warning state" hasWarning iconName={SearchIcon} />
<InputBlock placeholder="Disabled" isDisabled iconName={SearchIcon} />
<InputBlock value="Read-only content" isReadOnly iconName={SearchIcon} />`,
      },
    },
  },
};

const PasswordTemplate = () => {
  return (
    <div style={{ width: "300px" }}>
      <ControlledInputBlock
        {...defaultProps}
        type={InputType.password}
        placeholder="Enter password"
      />
    </div>
  );
};

export const PasswordType: Story = {
  render: () => <PasswordTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "InputBlock with password type masks typed characters for security.",
      },
      source: {
        code: `<InputBlock
  type={InputType.password}
  placeholder="Enter password"
  iconName={SearchIcon}
/>`,
      },
    },
  },
};

const WithIconClickTemplate = () => {
  return (
    <div style={{ width: "300px" }}>
      <ControlledInputBlock
        {...defaultProps}
        placeholder="Click the icon"
        onIconClick={() => alert("Icon clicked!")}
      />
    </div>
  );
};

export const WithIconClick: Story = {
  render: () => <WithIconClickTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The icon can be made clickable with the onIconClick callback. Click the search icon to see the action.",
      },
      source: {
        code: `<InputBlock
  placeholder="Click the icon"
  iconName={SearchIcon}
  onIconClick={() => alert("Icon clicked!")}
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
          flexDirection: "column",
          gap: "12px",
          width: "300px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#7c3aed",
          "--text-input-color": "#4c1d95",
          "--text-input-font-size": "14px",
          "--text-input-radius": "8px",
          "--input-block-icon-padding": "0 12px",
        } as CSSProperties
      }
    >
      <InputBlock
        type={InputType.text}
        iconName={SearchReactSvgUrl}
        placeholder="Custom styled input"
        value=""
        onChange={() => {}}
      />
      <InputBlock
        type={InputType.text}
        iconName={SearchReactSvgUrl}
        placeholder="With value"
        value="Search term"
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Background color | theme token |
| \`--text-input-border-color\` | Border color | theme token |
| \`--text-input-color\` | Text color | theme token |
| \`--text-input-font-size\` | Font size | \`13px\` |
| \`--text-input-radius\` | Border radius | theme token |
| \`--input-block-icon-padding\` | Icon end padding (base/middle) | \`8px\` |
| \`--input-block-icon-padding-lg\` | Icon end padding (large) | \`12px\` |
| \`--input-block-icon-start\` | Icon start padding | \`1px\` |
| \`--input-block-children-padding\` | Children block padding | \`2px 0 2px 2px\` |`,
      },
    },
  },
};
