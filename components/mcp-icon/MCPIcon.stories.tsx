import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";
import CatalogFolderIconUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MCPIcon, MCPIconSize } from ".";

const meta = {
  title: "UI/Data display/MCPIcon",
  component: MCPIcon,
  parameters: {
    docs: {
      description: {
        component: `A square mark for an MCP (Model Context Protocol) server: its image, or the first letter of its name on a tile.

### Features

- **Letter Fallback**: Draws the uppercased first character of \`title\` on a grey tile when there is no image to show
- **Four Fixed Sizes**: Renders a 16, 24, 32 or 48px square, each with its own font size and corner radius
- **Image From a URL**: Shows the image at \`imgSrc\` in place of the letter, stretched to fill the square
- **Error Handling**: Falls back to the letter when the image fails to load, and tries the image again when \`imgSrc\` changes
- **Image As a Node**: Takes an inline SVG or any other element through \`imgNode\`, which wins over \`imgSrc\` and never falls back to the letter
- **Dark Theme Tile**: Lowers the tile behind the letter to 10% opacity under the dark theme
- **CSS Customization**: Takes the tile colour, its opacity, the letter colour and weight and the corner radius from CSS variables

### Usage

\`\`\`tsx
import { MCPIcon, MCPIconSize } from "@onlyoffice/apps-ui-kit/components/mcp-icon";

// With title initial
<MCPIcon title="Document search" size={MCPIconSize.Large} />

// With image
<MCPIcon title="Document search" size={MCPIconSize.Medium} imgSrc="/path/to/icon.svg" />

// With an inline SVG
<MCPIcon title="Document search" imgNode={<FolderIcon />} />
\`\`\``,
      },
    },
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Name of the server. Only its first character is drawn, uppercased, and only while there is no image",
    },
    size: {
      control: "select",
      options: Object.values(MCPIconSize),
      description:
        "One of four squares: 16, 24, 32 or 48px, each with its own font size and corner radius",
      table: {
        defaultValue: { summary: "large" },
      },
    },
    imgSrc: {
      control: "text",
      description:
        "URL of an image drawn instead of the letter; if it fails to load, the letter is shown",
    },
    imgNode: {
      control: false,
      description:
        "Image as a node, drawn instead of `imgSrc` when both are set; it never falls back to the letter",
    },
    className: {
      control: "text",
      description: "Class added to the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: "mcp-icon" },
      },
    },
  },
} satisfies Meta<typeof MCPIcon>;

type Story = StoryObj<ComponentProps<typeof MCPIcon>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

const LabeledItem = (props: { label: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {props.children}
      <span style={{ fontSize: "12px", color: "#666" }}>{props.label}</span>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A server with no image of its own: the first letter of its name on a grey tile. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Large} />`,
      },
    },
  },
};

export const WithImage: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgSrc: CatalogFolderIconUrl,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use when the server has a logo: the image replaces the letter and fills the whole square (`imgSrc`).",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/path/to/icon.svg" />`,
      },
    },
  },
};

const AllSizesTemplate = () => {
  return (
    <Wrapper>
      {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(
        (key) => (
          <LabeledItem key={key} label={key}>
            <MCPIcon title="Document search" size={MCPIconSize[key]} />
          </LabeledItem>
        ),
      )}
    </Wrapper>
  );
};

export const AllSizes: Story = {
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Pick the size that matches the row it sits in: 16px (Small), 24px (Medium), 32px (Big) and 48px (Large), the letter and the corner radius growing with it (`size`).",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Small} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} />
<MCPIcon title="Document search" size={MCPIconSize.Big} />
<MCPIcon title="Document search" size={MCPIconSize.Large} />`,
      },
    },
  },
};

const AllSizesWithImageTemplate = () => {
  return (
    <Wrapper>
      {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(
        (key) => (
          <LabeledItem key={key} label={key}>
            <MCPIcon
              title="Document search"
              size={MCPIconSize[key]}
              imgSrc={CatalogFolderIconUrl}
            />
          </LabeledItem>
        ),
      )}
    </Wrapper>
  );
};

export const AllSizesWithImage: Story = {
  render: () => <AllSizesWithImageTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The same four sizes with an image: it is scaled to the square, and no tile is drawn behind it (`imgSrc`).",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Small} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Big} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc={iconUrl} />`,
      },
    },
  },
};

export const BrokenImageFallback: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    // An unparsable data URL fails to load without a network request.
    imgSrc: "data:image/png;base64,invalid",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass a server's image URL without checking it first: when it fails to load, the letter on its tile takes its place (`imgSrc`).",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/missing/icon.svg" />`,
      },
    },
  },
};

export const WithImageNode: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgNode: <CatalogFolderIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use for an icon your bundler has already inlined as a component: the element is drawn in place of the letter, and nothing replaces it if it is empty (`imgNode`).",
      },
      source: {
        code: `import FolderIcon from "./folder.react.svg";

<MCPIcon title="Document search" size={MCPIconSize.Large} imgNode={<FolderIcon />} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--mcp-icon-bg": "#0082c9",
          "--mcp-icon-color": "#ffffff",
          "--mcp-icon-opacity": "0.6",
          "--mcp-icon-weight": "400",
          "--mcp-icon-radius": "50%",
        } as CSSProperties
      }
    >
      <Wrapper>
        {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(
          (key) => (
            <LabeledItem key={key} label={key}>
              <MCPIcon title="D" size={MCPIconSize[key]} />
            </LabeledItem>
          ),
        )}
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--mcp-icon-bg\` | Colour of the tile behind the letter; an icon with an image has no tile | \`#a3a9ae\` |
| \`--mcp-icon-color\` | Colour of the letter | \`#ffffff\` |
| \`--mcp-icon-opacity\` | Opacity of the tile behind the letter, replacing the theme's own value | \`1\`, \`0.1\` in the dark theme |
| \`--mcp-icon-weight\` | Font weight of the letter | \`700\` |
| \`--mcp-icon-radius\` | Corner radius of the tile, the same for every size; an image is not clipped to it | \`3px\` / \`4px\` / \`6px\` / \`6px\` by size |

The four sizes share one wrapper that sets all five variables: a round, semi-transparent blue tile with a regular-weight white letter.`,
      },
      source: {
        code: `<div
  style={{
    "--mcp-icon-bg": "#0082c9",
    "--mcp-icon-color": "#ffffff",
    "--mcp-icon-opacity": "0.6",
    "--mcp-icon-weight": "400",
    "--mcp-icon-radius": "50%",
  }}
>
  <MCPIcon title="D" size={MCPIconSize.Large} />
</div>`,
      },
    },
  },
};
