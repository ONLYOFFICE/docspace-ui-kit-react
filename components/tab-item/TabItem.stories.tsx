import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TabItem } from ".";

const meta = {
  title: "UI/Navigation/TabItem",
  component: TabItem,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0",
    },
  },
  argTypes: {
    label: {
      control: "text",
      description:
        "Text of the pill: a string or a React node, cut off with an ellipsis when it does not fit",
    },
    isActive: {
      control: "boolean",
      description:
        "Whether the pill starts selected. The pill then keeps its selected state itself after clicks; a change of this prop re-syncs it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Ignores clicks and dims the pill to half opacity; a pill that is also selected keeps its full selected look",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    allowNoSelection: {
      control: "boolean",
      description:
        "Keeps the selected look the pill had on mount: neither clicks nor later `isActive` changes alter it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withMultiSelect: {
      control: "boolean",
      description:
        "Lets a click on a selected pill deselect it. Without it a selected pill stays selected",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    lockLastSelection: {
      control: "boolean",
      description:
        "Drops a click on an already selected pill entirely, so `onSelect` does not fire for it either",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the click event on every click that neither `isDisabled` nor `lockLastSelection` blocks",
    },
    className: {
      control: "text",
      description: "Extra class name on the outer element",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outer element",
      table: {
        defaultValue: { summary: '"tab-item"' },
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
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An unselected pill: click it to see it fill in, and change any other prop live in the Controls panel below.",
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
          "The filled look of a selected pill, for a filter that is already applied when the screen opens (`isActive`).",
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
          "A dimmed pill that ignores clicks, for an option that does not apply right now (`isDisabled`).",
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
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ color: "#2DA7DB" }}>&#9679;</span>
          <span>Tab with Icon</span>
        </span>
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
          "Tab with a React node as label, allowing custom content like icons alongside text. The label renders inside a `<p>`, so the node has to be phrasing content -- a `<span>`, not a `<div>`.",
      },
      source: {
        code: `<TabItem
  label={
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#2DA7DB" }}>●</span>
      <span>Tab with Icon</span>
    </span>
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
  const [selected, setSelected] = useState<Set<string>>(new Set(["documents"]));

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
          "Three pills that toggle independently, for a filter where several values can apply at once: a click on a selected pill deselects it (`withMultiSelect`).",
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
          "--tab-item-active-bg": "#1f6f43",
          "--tab-item-active-text": "#ffffff",
          "--tab-item-border": "1px dashed #8a8a8a",
          "--tab-item-radius": "6px",
          "--tab-item-padding": "6px 20px",
          "--tab-item-disabled-opacity": "0.3",
        } as CSSProperties
      }
    >
      <TabItem label="Documents" isActive />
      <TabItem label="Images" />
      <TabItem label="Videos" isDisabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Documents** is selected, for the two active variables; **Images** is unselected, for the border; **Videos** is disabled, for the opacity. Radius and padding show on all three.`,
      },
      source: {
        code: `<div
  style={{
    "--tab-item-active-bg": "#1f6f43",
    "--tab-item-active-text": "#ffffff",
    "--tab-item-border": "1px dashed #8a8a8a",
    "--tab-item-radius": "6px",
    "--tab-item-padding": "6px 20px",
    "--tab-item-disabled-opacity": "0.3",
  }}
>
  <TabItem label="Documents" isActive />
  <TabItem label="Images" />
  <TabItem label="Videos" isDisabled />
</div>`,
      },
    },
  },
};
