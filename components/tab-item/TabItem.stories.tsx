import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { TabItem } from ".";

const meta = {
  title: "UI/Navigation/TabItem",
  component: TabItem,
  parameters: {
    docs: {
      description: {
        component: `TabItem is a single tab element for building tabbed navigation interfaces.

### Features

- **Active State**: Visual indicator for the currently selected tab
- **Disabled State**: Prevents interaction when disabled
- **Custom Labels**: Supports text strings or React nodes as labels
- **Multi-Select**: Optional multi-selection mode for filter-like behavior
- **Allow No Selection**: Enables deselecting all tabs
- **Lock Last Selection**: Prevents deselecting when it's the only selected tab

### Accessibility

- \`aria-selected\`: Indicates the current selection state
- \`data-testid\`: Provides test identifiers for automation

### Usage

\`\`\`tsx
import { TabItem } from "@onlyoffice/apps-ui-kit/components/tab-item";

<TabItem label="Documents" isActive onSelect={handleSelect} />

// Tab group
<div style={{ display: "flex", gap: "16px" }}>
  <TabItem label="All" isActive={activeTab === "all"} onSelect={() => setActive("all")} />
  <TabItem label="Shared" isActive={activeTab === "shared"} onSelect={() => setActive("shared")} />
</div>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0",
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Tab text or React node to display",
    },
    isActive: {
      control: "boolean",
      description: "Whether the tab is currently active",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the tab from being interacted with",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    allowNoSelection: {
      control: "boolean",
      description: "Allows deselecting the tab so no tab is active",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withMultiSelect: {
      control: "boolean",
      description: "Enables multi-select mode for filter-like behavior",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    lockLastSelection: {
      control: "boolean",
      description: "Prevents deselecting when it's the last selected tab",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof TabItem>;

type Story = StoryObj<ComponentProps<typeof TabItem>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        padding: "16px",
        borderRadius: "6px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TabItem {...args} />,
  args: {
    label: "Tab Item",
    isActive: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Default inactive tab item. Click to select.",
      },
      source: {
        code: `<TabItem label="Tab Item" onSelect={handleSelect} />`,
      },
    },
  },
};

export const ActiveState: Story = {
  render: (args) => <TabItem {...args} />,
  args: {
    label: "Active Tab",
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tab in its active/selected state with a visual indicator.",
      },
      source: {
        code: `<TabItem label="Active Tab" isActive />`,
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => <TabItem {...args} />,
  args: {
    label: "Disabled Tab",
    isActive: false,
    isDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled tab that cannot be interacted with. Appears visually muted.",
      },
      source: {
        code: `<TabItem label="Disabled Tab" isDisabled />`,
      },
    },
  },
};

const WithReactNodeTemplate = () => {
  return (
    <TabItem
      label={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#2DA7DB" }}>&#9679;</span>
          <span>Tab with Icon</span>
        </div>
      }
    />
  );
};

export const WithReactNodeLabel: Story = {
  render: () => <WithReactNodeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tab with a React node as label, allowing custom content like icons alongside text.",
      },
      source: {
        code: `<TabItem
  label={
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#2DA7DB" }}>●</span>
      <span>Tab with Icon</span>
    </div>
  }
/>`,
      },
    },
  },
};

const TabGroupTemplate = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Wrapper>
      <TabItem
        label="First Tab"
        isActive={activeTab === "tab1"}
        onSelect={() => setActiveTab("tab1")}
      />
      <TabItem
        label="Second Tab"
        isActive={activeTab === "tab2"}
        onSelect={() => setActiveTab("tab2")}
      />
      <TabItem
        label="Third Tab"
        isActive={activeTab === "tab3"}
        onSelect={() => setActiveTab("tab3")}
      />
    </Wrapper>
  );
};

export const TabGroup: Story = {
  render: () => <TabGroupTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive tab group demonstrating single-selection behavior. Clicking a tab selects it and deselects others.",
      },
      source: {
        code: `<TabItem label="First Tab" isActive={activeTab === "tab1"} onSelect={() => setActiveTab("tab1")} />
<TabItem label="Second Tab" isActive={activeTab === "tab2"} onSelect={() => setActiveTab("tab2")} />
<TabItem label="Third Tab" isActive={activeTab === "tab3"} onSelect={() => setActiveTab("tab3")} />`,
      },
    },
  },
};

const MultiSelectTemplate = () => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["documents"]),
  );

  const toggleSelection = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Wrapper>
      <TabItem
        label="Documents"
        isActive={selected.has("documents")}
        onSelect={() => toggleSelection("documents")}
        withMultiSelect
      />
      <TabItem
        label="Images"
        isActive={selected.has("images")}
        onSelect={() => toggleSelection("images")}
        withMultiSelect
      />
      <TabItem
        label="Videos"
        isActive={selected.has("videos")}
        onSelect={() => toggleSelection("videos")}
        withMultiSelect
      />
    </Wrapper>
  );
};

export const MultiSelect: Story = {
  render: () => <MultiSelectTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tab group with multi-select enabled, allowing multiple tabs to be active simultaneously. Useful for filter interfaces.",
      },
      source: {
        code: `<TabItem label="Documents" isActive withMultiSelect onSelect={handleToggle} />
<TabItem label="Images" withMultiSelect onSelect={handleToggle} />
<TabItem label="Videos" withMultiSelect onSelect={handleToggle} />`,
      },
    },
  },
};

export const CssCustomization = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "8px",
          "--tab-item-active-bg": "#0082c9",
          "--tab-item-active-text": "#ffffff",
          "--tab-item-border": "1px solid #0082c9",
          "--tab-item-radius": "6px",
          "--tab-item-padding": "6px 20px",
        } as CSSProperties
      }
    >
      <TabItem label="Files" isActive onSelect={() => {}} />
      <TabItem label="Photos" isActive={false} onSelect={() => {}} />
      <TabItem label="Talk" isActive={false} onSelect={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tab-item-active-bg\` | Active tab background | accent color |
| \`--tab-item-active-text\` | Active tab text color | white |
| \`--tab-item-border\` | Tab border style | theme gray border |
| \`--tab-item-radius\` | Border radius | \`16px\` |
| \`--tab-item-padding\` | Inner padding | \`4px 16px\` |
| \`--tab-item-disabled-opacity\` | Disabled state opacity | \`0.5\` |`,
      },
    },
  },
};
