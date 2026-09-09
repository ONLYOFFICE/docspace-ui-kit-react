import { useRef } from "react";

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tags } from ".";

const meta = {
  title: "UI/Data display/Tags",
  component: Tags,
  parameters: {
    docs: {
      description: {
        component: `Container component that renders a collection of Tag items with overflow handling.

### Features

- **Column Count**: Control how many tags are visible before overflow
- **Overflow Dropdown**: Automatically groups excess tags into a dropdown
- **String & Object Tags**: Accept simple string arrays or TagType objects with metadata
- **Create Tag Button**: Optionally show a button to create new tags
- **Remove Tag Icon**: Toggle visibility of tag removal icons
- **Custom Option Tag**: Support for custom overflow trigger via ref and callback

### Usage

\`\`\`tsx
import { Tags } from "@onlyoffice/apps-ui-kit/components/tags";

// Simple string tags
<Tags tags={["Design", "Development"]} columnCount={2} onSelectTag={handleSelect} />

// Object tags with metadata
<Tags
  tags={[{ label: "Design", roomType: 1 }, { label: "Dev", roomType: 2 }]}
  columnCount={3}
  onSelectTag={handleSelect}
/>

// With overflow dropdown
<Tags tags={tags} columnCount={3} style={{ width: "250px" }} onSelectTag={handleSelect} />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    tags: {
      description: "Array of tag strings or TagType objects",
    },
    columnCount: {
      control: "number",
      description:
        "Number of visible tag columns before overflow. Use -1 to show all",
    },
    showCreateTag: {
      control: "boolean",
      description: "Show create tag button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    removeTagIcon: {
      control: "boolean",
      description: "Show remove icon on tags",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSelectTag: {
      action: "tag selected",
      description: "Callback when a tag is selected",
    },
    onMouseEnter: {
      action: "mouse enter",
      description: "Mouse enter event handler",
    },
    onMouseLeave: {
      action: "mouse leave",
      description: "Mouse leave event handler",
    },
    onOptionTagClick: {
      action: "option tag clicked",
      description: "Callback when the overflow option tag is clicked",
    },
  },
} satisfies Meta<typeof Tags>;

type Story = StoryObj<ComponentProps<typeof Tags>>;

export default meta;

export const Default: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 2,
    onSelectTag: () => {},
  },
};

const MultipleTagsTemplate = () => {
  return (
    <Tags
      tags={["React", "TypeScript", "Node.js", "GraphQL", "Docker"]}
      columnCount={5}
      onSelectTag={() => {}}
    />
  );
};

const OverflowTemplate = () => {
  return (
    <div style={{ height: 150, paddingTop: 20 }}>
      <Tags
        tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]}
        style={{ width: "250px" }}
        columnCount={3}
        onSelectTag={() => {}}
      />
    </div>
  );
};

const ObjectTagsTemplate = () => {
  return (
    <Tags
      tags={[
        { label: "Design", roomType: 1 },
        { label: "Development", roomType: 2 },
        { label: "Marketing", roomType: 3 },
      ]}
      columnCount={3}
      onSelectTag={() => {}}
    />
  );
};

const ShowAllTemplate = () => {
  return (
    <Tags
      tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]}
      columnCount={-1}
      onSelectTag={() => {}}
    />
  );
};

const WithCreateTagTemplate = () => {
  return (
    <Tags
      tags={["Design", "Development"]}
      columnCount={3}
      showCreateTag
      onSelectTag={() => {}}
    />
  );
};

const CustomOptionTagTemplate = () => {
  const optionRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ height: 100, paddingTop: 20 }}>
      <Tags
        tags={["Tag1", "Tag2", "Tag3"]}
        columnCount={2}
        onSelectTag={() => {}}
        optionTagRef={optionRef}
        onOptionTagClick={() => alert("Option tag clicked")}
        style={{ width: "150px" }}
      />
    </div>
  );
};

export const MultipleTags: Story = {
  render: () => <MultipleTagsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Multiple tags displayed in a row with enough column space to show all.",
      },
      source: {
        code: `<Tags
  tags={["React", "TypeScript", "Node.js", "GraphQL", "Docker"]}
  columnCount={5}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const WithOverflow: Story = {
  render: () => <OverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags that exceed the visible column count are grouped into an overflow dropdown.",
      },
      source: {
        code: `<Tags
  tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]}
  style={{ width: "250px" }}
  columnCount={3}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const WithTagObjects: Story = {
  render: () => <ObjectTagsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags defined as objects with label and roomType metadata instead of plain strings.",
      },
      source: {
        code: `<Tags
  tags={[
    { label: "Design", roomType: 1 },
    { label: "Development", roomType: 2 },
    { label: "Marketing", roomType: 3 },
  ]}
  columnCount={3}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const ShowAll: Story = {
  render: () => <ShowAllTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Setting columnCount to -1 shows all tags without overflow grouping.",
      },
      source: {
        code: `<Tags tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]} columnCount={-1} onSelectTag={handleSelect} />`,
      },
    },
  },
};

export const WithCreateTag: Story = {
  render: () => <WithCreateTagTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags container with the create tag button enabled via showCreateTag prop.",
      },
      source: {
        code: `<Tags tags={["Design", "Development"]} columnCount={3} showCreateTag onSelectTag={handleSelect} />`,
      },
    },
  },
};

export const WithCustomOptionTag: Story = {
  render: () => <CustomOptionTagTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags with a custom overflow trigger using optionTagRef and onOptionTagClick instead of the default dropdown.",
      },
      source: {
        code: `const optionRef = useRef(null);
<Tags
  tags={["Tag1", "Tag2", "Tag3"]}
  columnCount={2}
  onSelectTag={handleSelect}
  optionTagRef={optionRef}
  onOptionTagClick={() => console.log("Option tag clicked")}
  style={{ width: "150px" }}
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
          "--tags-overflow-text-margin": "12px",
        } as CSSProperties
      }
    >
      <Tags
        tags={["React", "TypeScript", "Node.js", "GraphQL"]}
        columnCount={3}
        onSelectTag={() => {}}
        style={{ width: "200px" }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tags-overflow-text-margin\` | Margin before the overflow count text | \`8px\` |`,
      },
    },
  },
};
