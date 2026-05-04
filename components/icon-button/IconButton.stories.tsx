// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CrossReactSvgUrl from "../../assets/icons/12/cross.react.svg?url";
import EyeReactSvgUrl from "../../assets/eye.react.svg?url";
import InfoReactSvgUrl from "../../assets/info.react.svg?url";
import MailReactSvgUrl from "../../assets/mail.react.svg?url";
import PersonReactSvgUrl from "../../assets/person.react.svg?url";
import CatalogPinReactSvgUrl from "../../assets/pin.react.svg?url";
import QuestionReactSvgUrl from "../../assets/question.react.svg?url";
import SearchReactSvgUrl from "../../assets/search.react.svg?url";
import SettingsReactSvgUrl from "../../assets/settings.react.svg?url";

import { IconButton } from ".";

const iconOptions = [
  SearchReactSvgUrl,
  EyeReactSvgUrl,
  InfoReactSvgUrl,
  MailReactSvgUrl,
  CatalogPinReactSvgUrl,
  CrossReactSvgUrl,
  PersonReactSvgUrl,
  QuestionReactSvgUrl,
  SettingsReactSvgUrl,
];

const meta = {
  title: "UI/Interactive elements/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: `IconButton is a button component that displays an icon and handles various interaction states.

### Features

- **Icon Variants**: Supports separate icons for default, hover, and click states
- **Color Customization**: Configurable colors for default, hover, and click states
- **Adjustable Size**: Pixel-based size control
- **Fill and Stroke**: Toggle between filled and stroked icon rendering
- **Disabled State**: Visually indicates non-interactive state
- **Custom Node**: Accepts arbitrary React nodes instead of SVG icons

### Usage

\`\`\`tsx
import { IconButton } from "@docspace/ui-kit/components/icon-button";

// Basic icon button
<IconButton size={25} iconName={SearchIcon} onClick={handleClick} />

// With hover and click icons
<IconButton
  size={25}
  iconName={SearchIcon}
  iconHoverName={EyeIcon}
  hoverColor="#333"
  onClick={handleClick}
/>

// Disabled
<IconButton size={25} iconName={SearchIcon} isDisabled />
\`\`\``,
      },
    },
  },
  argTypes: {
    iconName: {
      control: "select",
      options: iconOptions,
      description: "The main icon to display",
    },
    iconHoverName: {
      control: "select",
      options: iconOptions,
      description: "The icon to display on hover",
    },
    iconClickName: {
      control: "select",
      options: iconOptions,
      description: "The icon to display when clicked",
    },
    size: {
      control: { type: "number", min: 12, max: 50 },
      description: "Size of the icon button in pixels",
      table: {
        defaultValue: { summary: "25" },
      },
    },
    color: {
      control: "color",
      description: "The default color of the icon",
    },
    hoverColor: {
      control: "color",
      description: "The color of the icon when hovered",
    },
    clickColor: {
      control: "color",
      description: "The color of the icon when clicked",
    },
    isFill: {
      control: "boolean",
      description: "Whether to fill the icon",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isStroke: {
      control: "boolean",
      description: "Whether to apply stroke to the icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "onClick",
      description: "Function called when the button is clicked",
    },
  },
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<ComponentProps<typeof IconButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <IconButton {...args} />,
  args: {
    size: 25,
    iconName: SearchReactSvgUrl,
    isFill: true,
    isDisabled: false,
  },
};

const WithHoverStateTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        iconHoverName={EyeReactSvgUrl}
        hoverColor="#333"
        isFill
      />
      <IconButton
        size={25}
        iconName={MailReactSvgUrl}
        iconHoverName={InfoReactSvgUrl}
        hoverColor="#2DA7DB"
        isFill
      />
    </Wrapper>
  );
};

export const WithHoverState: Story = {
  render: () => <WithHoverStateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon buttons with a different icon displayed on hover. Hover over the buttons to see the alternate icon.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} iconHoverName={EyeIcon} hoverColor="#333" isFill />
<IconButton size={25} iconName={MailIcon} iconHoverName={InfoIcon} hoverColor="#2DA7DB" isFill />`,
      },
    },
  },
};

const WithClickStateTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        iconClickName={InfoReactSvgUrl}
        clickColor="green"
        isFill
      />
    </Wrapper>
  );
};

export const WithClickState: Story = {
  render: () => <WithClickStateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon button with a different icon displayed when clicked. Click the button to see the alternate icon and color.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} iconClickName={InfoIcon} clickColor="green" isFill />`,
      },
    },
  },
};

const SizesTemplate = () => {
  const sizes = [16, 20, 25, 32, 40];
  return (
    <Wrapper>
      {sizes.map((size) => (
        <IconButton
          key={size}
          size={size}
          iconName={SearchReactSvgUrl}
          isFill
        />
      ))}
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon buttons at various sizes. The size prop controls both width and height in pixels.",
      },
      source: {
        code: `<IconButton size={16} iconName={SearchIcon} isFill />
<IconButton size={20} iconName={SearchIcon} isFill />
<IconButton size={25} iconName={SearchIcon} isFill />
<IconButton size={32} iconName={SearchIcon} isFill />
<IconButton size={40} iconName={SearchIcon} isFill />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        isFill
        isDisabled
      />
      <IconButton
        size={25}
        iconName={SettingsReactSvgUrl}
        isFill
        isDisabled
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled icon buttons. They cannot be interacted with and have reduced opacity.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} isFill isDisabled />
<IconButton size={25} iconName={SettingsIcon} isFill isDisabled />`,
      },
    },
  },
};

const WithStrokeTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        isStroke
        isFill={false}
      />
      <IconButton
        size={25}
        iconName={SettingsReactSvgUrl}
        isStroke
        isFill={false}
      />
    </Wrapper>
  );
};

export const WithStroke: Story = {
  render: () => <WithStrokeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon buttons rendered with stroke instead of fill. Uses outline-style icons.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} isStroke isFill={false} />
<IconButton size={25} iconName={SettingsIcon} isStroke isFill={false} />`,
      },
    },
  },
};

const WithCustomNodeTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        isFill
        iconNode={
          <div
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(135deg, rgba(106,17,203,1) 0%, rgba(37,117,252,1) 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}
            title="Custom node"
          >
            IC
          </div>
        }
      />
    </Wrapper>
  );
};

export const WithCustomNode: Story = {
  render: () => <WithCustomNodeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates using the `iconNode` prop to pass any custom React node (e.g., avatar/initials) instead of an SVG icon.",
      },
      source: {
        code: `<IconButton
  size={25}
  iconName={SearchIcon}
  isFill
  iconNode={<div style={{ ... }}>IC</div>}
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
          "--icon-button-color": "#9C27B0",
          "--icon-button-hover-color": "#6A1B9A",
          "--icon-button-size": "32px",
        } as CSSProperties
      }
    >
      <IconButton iconName={SearchReactSvgUrl} isFill />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

\`\`\`css
--icon-button-color        /* default icon color */
--icon-button-hover-color  /* icon color on hover */
--icon-button-size         /* icon button size */
\`\`\``,
      },
      source: {
        code: `<div
  style={{
    "--icon-button-color": "#9C27B0",
    "--icon-button-hover-color": "#6A1B9A",
    "--icon-button-size": "32px",
  }}
>
  <IconButton iconName={SearchReactSvgUrl} isFill />
</div>`,
      },
    },
  },
};
