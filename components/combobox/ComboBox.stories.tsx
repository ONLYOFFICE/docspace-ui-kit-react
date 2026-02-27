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

import type React from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CopyReactSvgUrl from "../../assets/icons/16/copy.react.svg";
import DownloadReactSvgUrl from "../../assets/icons/16/download.react.svg";
import MoveReactSvgUrl from "../../assets/icons/16/move.react.svg";
import { globalColors } from "../../providers/theme";

import { ComboBox } from "./ComboBox";
import { ComboBoxDisplayType, ComboBoxSize } from "./ComboBox.enums";

const meta = {
  title: "UI/Interactive elements/ComboBox",
  component: ComboBox,
  parameters: {
    docs: {
      description: {
        component: `ComboBox combines a text input with a dropdown list for selecting from predefined options.

### Features

- **Display Types**: Default and toggle display modes
- **Multiple Sizes**: Configurable sizing via ComboBoxSize enum
- **Search**: Built-in search functionality with customizable placeholder
- **Icon Support**: Options can include icons for visual context
- **Custom Styling**: Options support custom colors, backgrounds, and borders
- **Keyboard Navigation**: Arrow keys, Enter/Space, Escape, and Tab support
- **Scaled Mode**: Can scale to fill parent container width
- **Disabled State**: Full disabled state for non-interactive display

### Accessibility

The ComboBox component includes the following ARIA attributes:

- \`aria-expanded\`: Indicates whether the dropdown list is expanded
- \`aria-haspopup\`: Indicates the component has a popup menu
- \`aria-label\`: Provides a text description of the combobox
- \`role="combobox"\`: Identifies the component as a combobox

### Usage

\`\`\`tsx
import { ComboBox, ComboBoxSize } from "@docspace/ui-kit/components/combobox";

<ComboBox
  options={[
    { key: 1, label: "Option 1" },
    { key: 2, label: "Option 2" },
  ]}
  selectedOption={{ key: 0, label: "Select..." }}
  onSelect={(option) => console.log(option)}
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=0%3A1&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    displayType: {
      control: "select",
      options: Object.values(ComboBoxDisplayType),
      description: "Display style of the combobox",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: Object.values(ComboBoxSize),
      description: "Size of the combobox",
    },
    scaled: {
      control: "boolean",
      description: "Enable scaling based on parent width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the combobox",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withSearch: {
      control: "boolean",
      description: "Enable search functionality",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noBorder: {
      control: "boolean",
      description: "Remove the border",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropDownMaxHeight: {
      control: "number",
      description: "Maximum height of the dropdown list",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description: "Vertical direction for the dropdown",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Horizontal direction for the dropdown",
    },
    fixedDirection: {
      control: "boolean",
      description: "Disable automatic direction adjustment",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description: "Use portal mode for the dropdown",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showDisabledItems: {
      control: "boolean",
      description: "Show disabled items in dropdown",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displaySelectedOption: {
      control: "boolean",
      description: "Show the selected option in the dropdown list",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    displayArrow: {
      control: "boolean",
      description: "Show the dropdown arrow icon",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    modernView: {
      control: "boolean",
      description: "Use modern compact view",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    manualWidth: {
      control: "text",
      description: "Custom width for the dropdown",
    },
    textOverflow: {
      control: "boolean",
      description: "Truncate long option labels with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description: "Fill option icons with text color",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof ComboBox>;

type Story = StoryObj<ComponentProps<typeof ComboBox>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "240px", padding: "20px" }}>{props.children}</div>;
};

const defaultOptions = [
  {
    key: 1,
    label: "Open",
    backgroundColor: globalColors.lightBlueMain,
    color: globalColors.white,
  },
  {
    key: 2,
    label: "Done",
    backgroundColor: globalColors.black,
    color: globalColors.white,
  },
  {
    key: 3,
    label: "In Progress",
    backgroundColor: globalColors.white,
    color: globalColors.grayText,
    border: globalColors.lightBlueMain,
  },
  {
    key: 4,
    label: "Pending Review",
    backgroundColor: globalColors.white,
    color: globalColors.grayText,
    border: globalColors.lightBlueMain,
  },
];

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <ComboBox {...args} />
    </Wrapper>
  ),
  args: {
    options: defaultOptions,
    selectedOption: { key: 0, label: "Select Status" },
    dropDownMaxHeight: 200,
    scaled: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Default ComboBox with basic configuration and status options.",
      },
      source: {
        code: `<ComboBox
  options={statusOptions}
  selectedOption={{ key: 0, label: "Select Status" }}
  dropDownMaxHeight={200}
/>`,
      },
    },
  },
};

const DifferentSizesTemplate = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {Object.values(ComboBoxSize).map((size) => (
        <ComboBox
          key={size}
          options={defaultOptions}
          selectedOption={{ key: 0, label: `Size: ${size}` }}
          size={size}
          directionY="bottom"
          scaled={false}
          fixedDirection
          isDefaultMode={false}
        />
      ))}
    </div>
  );
};

export const DifferentSizes: Story = {
  render: () => <DifferentSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "ComboBox in all available size variations.",
      },
      source: {
        code: `<ComboBox size={ComboBoxSize.base} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.middle} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.big} options={options} selectedOption={selected} />
<ComboBox size={ComboBoxSize.huge} options={options} selectedOption={selected} />`,
      },
    },
  },
};

const WithIconsTemplate = () => {
  return (
    <Wrapper>
      <ComboBox
        options={[
          { key: 1, label: "Move", icon: MoveReactSvgUrl },
          { key: 2, label: "Copy", icon: CopyReactSvgUrl },
          { key: 3, label: "Download", icon: DownloadReactSvgUrl },
        ]}
        selectedOption={{ key: 0, label: "Select Type" }}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      />
    </Wrapper>
  );
};

export const WithIcons: Story = {
  render: () => <WithIconsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ComboBox with icons in options for better visual representation of each action.",
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Move", icon: MoveIcon },
    { key: 2, label: "Copy", icon: CopyIcon },
    { key: 3, label: "Download", icon: DownloadIcon },
  ]}
  selectedOption={{ key: 0, label: "Select Type" }}
/>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <ComboBox
        options={defaultOptions}
        selectedOption={{ key: 0, label: "Select Status" }}
        dropDownMaxHeight={200}
        scaled={false}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
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
          "Disabled state of the ComboBox. The dropdown cannot be opened and the component appears dimmed.",
      },
      source: {
        code: `<ComboBox options={options} selectedOption={selected} isDisabled />`,
      },
    },
  },
};

const WithSelectedOptionTemplate = () => {
  return (
    <Wrapper>
      <ComboBox
        options={defaultOptions}
        selectedOption={defaultOptions[0]}
        dropDownMaxHeight={200}
        scaled={false}
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      />
    </Wrapper>
  );
};

export const WithSelectedOption: Story = {
  render: () => <WithSelectedOptionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ComboBox with a pre-selected option. The selected option is highlighted in the dropdown.",
      },
      source: {
        code: `<ComboBox options={options} selectedOption={options[0]} />`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <Wrapper>
      <ComboBox
        options={[
          { key: 1, label: "Critical", backgroundColor: "#FF4444", color: "#FFFFFF" },
          { key: 2, label: "High", backgroundColor: "#FF8C00", color: "#FFFFFF" },
          { key: 3, label: "Medium", backgroundColor: "#FFD700", color: "#000000" },
          { key: 4, label: "Low", backgroundColor: "#90EE90", color: "#000000" },
        ]}
        selectedOption={{ key: 0, label: "Select Priority" }}
        noBorder
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
        scaled={false}
      />
    </Wrapper>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ComboBox with custom-styled options demonstrating color-coded priority levels.",
      },
      source: {
        code: `<ComboBox
  options={[
    { key: 1, label: "Critical", backgroundColor: "#FF4444", color: "#FFFFFF" },
    { key: 2, label: "High", backgroundColor: "#FF8C00", color: "#FFFFFF" },
    { key: 3, label: "Medium", backgroundColor: "#FFD700", color: "#000000" },
    { key: 4, label: "Low", backgroundColor: "#90EE90", color: "#000000" },
  ]}
  selectedOption={{ key: 0, label: "Select Priority" }}
  noBorder
/>`,
      },
    },
  },
};
