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
import type { CSSProperties } from "react";
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize } from "../text-input";

import { SearchInput } from ".";

const meta = {
  title: "UI/Interactive elements/SearchInput",
  component: SearchInput,
  parameters: {
    docs: {
      description: {
        component: `Search-optimized input field with built-in clear button, auto-refresh capability, and multiple size options.

### Features

- **Clear Button**: Show/hide clear button to reset the search value
- **Auto-Refresh**: Automatically trigger search after a configurable timeout
- **Three Sizes**: base, middle, and large
- **Disabled State**: Prevent user interaction
- **Full Width**: Scale to 100% width when needed

### Usage

\`\`\`tsx
import { SearchInput } from "@docspace/ui-kit/components/search-input";
import { InputSize } from "@docspace/ui-kit/components/text-input";

<SearchInput
  size={InputSize.base}
  value={searchValue}
  onChange={(value) => setSearchValue(value)}
  placeholder="Search..."
  showClearButton={!!searchValue}
/>

// With auto-refresh
<SearchInput
  value={value}
  onChange={handleSearch}
  autoRefresh
  refreshTimeout={1000}
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=58-2238&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Size variant of the input",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showClearButton: {
      control: "boolean",
      description: "Show the clear button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoRefresh: {
      control: "boolean",
      description: "Enable auto-refresh on value change",
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
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
} satisfies Meta<typeof SearchInput>;

type Story = StoryObj<ComponentProps<typeof SearchInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledSearch = (props: {
  initialValue?: string;
  size?: InputSize;
  isDisabled?: boolean;
  scale?: boolean;
  placeholder?: string;
  autoRefresh?: boolean;
  refreshTimeout?: number;
}) => {
  const {
    initialValue = "",
    size = InputSize.base,
    placeholder = "Search",
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <SearchInput
      size={size}
      value={value}
      onChange={(v) => setValue(v)}
      showClearButton={!!value}
      onClearSearch={() => setValue("")}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    return (
      <div style={{ width: "300px" }}>
        <SearchInput
          {...args}
          value={value}
          onChange={(v) => setValue(v)}
          showClearButton={!!value}
          onClearSearch={() => setValue("")}
        />
      </div>
    );
  },
  args: {
    id: "default-search",
    isDisabled: false,
    size: InputSize.base,
    scale: false,
    placeholder: "Search",
    value: "",
    autoRefresh: false,
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch size={InputSize.base} initialValue="Base size" />
      <ControlledSearch size={InputSize.middle} initialValue="Middle size" />
      <ControlledSearch size={InputSize.large} initialValue="Large size" />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "SearchInput supports three sizes: base, middle, and large. Each size is suited for different UI contexts.",
      },
      source: {
        code: `<SearchInput size={InputSize.base} value="Base size" />
<SearchInput size={InputSize.middle} value="Middle size" />
<SearchInput size={InputSize.large} value="Large size" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch initialValue="Normal" />
      <ControlledSearch initialValue="Disabled" isDisabled />
      <ControlledSearch initialValue="Scaled" scale />
      <ControlledSearch placeholder="Empty with placeholder" />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "SearchInput supports normal, disabled, and scaled states. The clear button appears when the input has a value.",
      },
      source: {
        code: `<SearchInput value="Normal" />
<SearchInput value="Disabled" isDisabled />
<SearchInput value="Scaled" scale />
<SearchInput placeholder="Empty with placeholder" value="" />`,
      },
    },
  },
};

const AutoRefreshTemplate = () => {
  return (
    <Wrapper>
      <ControlledSearch
        placeholder="Type to auto-refresh (1s)"
        autoRefresh
        refreshTimeout={1000}
      />
      <ControlledSearch placeholder="No auto-refresh" />
    </Wrapper>
  );
};

export const AutoRefreshMode: Story = {
  render: () => <AutoRefreshTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Auto-refresh mode triggers the onChange callback after a configurable timeout, useful for search-as-you-type with debouncing.",
      },
      source: {
        code: `// With auto-refresh (1s timeout)
<SearchInput
  autoRefresh
  refreshTimeout={1000}
  placeholder="Type to auto-refresh"
/>

// Without auto-refresh
<SearchInput placeholder="No auto-refresh" />`,
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
          "--text-input-radius": "8px",
          "--search-input-icon-fill": "#7c3aed",
          "--search-input-max-height": "40px",
          "--search-input-radius": "8px",
        } as CSSProperties
      }
    >
      <SearchInput size={InputSize.base} placeholder="Custom styled search" value="" onChange={() => {}} />
      <SearchInput size={InputSize.base} placeholder="With value" value="Search term" onChange={() => {}} />
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
| \`--text-input-radius\` | Input border radius | theme token |
| \`--search-input-icon-fill\` | Default icon color | theme token |
| \`--search-input-icon-filled-fill\` | Icon color when input has value | theme token |
| \`--search-input-max-height\` | Max height of the input | \`32px\` |
| \`--search-input-radius\` | Icon container border radius | \`3px\` |`,
      },
    },
  },
};
