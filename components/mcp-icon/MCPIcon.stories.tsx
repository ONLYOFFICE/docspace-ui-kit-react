import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import CatalogFolderIcon from "../../.storybook/utils/ThemedFolderIcon";
import CatalogFolderIconUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MCPIcon, MCPIconSize } from ".";

const meta = {
  title: "UI/Data display/MCPIcon",
  component: MCPIcon,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Name of the server. It is the icon's accessible name, with or without an image; its first character is drawn while there is no image.",
    },
    size: {
      control: "select",
      options: Object.values(MCPIconSize),
      description:
        "One of the four square sizes: 16, 24, 32 or 48px, each with its own font size and corner radius.",
      table: {
        defaultValue: { summary: "large" },
      },
    },
    imgSrc: {
      control: "text",
      description:
        "Image to draw instead of the letter. A failure to load falls back to the letter on its own.",
    },
    imgNode: {
      control: false,
      description:
        "Image as a node, used instead of `imgSrc` when both are set. An `<img>` inside it that fails to load falls back to the letter too.",
    },
    className: {
      control: "text",
      description:
        "Added before the component's own classes, on the outer element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: "mcp-icon" },
      },
    },
  },
} satisfies Meta<typeof MCPIcon>;

type Story = StoryObj<ComponentProps<typeof MCPIcon>>;

export default meta;

const sizeOf = (el: Element) => Math.round(el.getBoundingClientRect().width);

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
  name: "Letter",
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
  },
  play: async ({ canvas }) => {
    // No image: the first letter, uppercased, on a 48px tile.
    const icon = canvas.getByTestId("mcp-icon");
    await expect(icon).toHaveTextContent(/^D$/);
    await expect(sizeOf(icon)).toBe(48);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A server with no image of its own: the first letter of its name, uppercased, on a 48px grey tile.",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Large} />`,
      },
    },
  },
};

export const WithImage: Story = {
  name: "With image",
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgSrc: CatalogFolderIconUrl,
  },
  play: async ({ canvas }) => {
    // The image replaces the letter; the tile is one image named after the
    // server, the picture inside it carries no name of its own.
    await expect(
      canvas.getByRole("img", { name: "Document search" }),
    ).toBeVisible();
    await expect(canvas.getAllByRole("img")).toHaveLength(1);
    await expect(canvas.getByTestId("mcp-icon")).not.toHaveTextContent("D");
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
  name: "All sizes",
  render: () => <AllSizesTemplate />,
  play: async ({ canvas }) => {
    const sizes = canvas.getAllByTestId("mcp-icon").map(sizeOf);
    await expect([...sizes].sort((a, b) => a - b)).toEqual([16, 24, 32, 48]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The four sizes side by side: 16px (Small), 24px (Medium), 32px (Big) and 48px (Large). The letter and the corner radius grow with the tile (`size`).",
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
  name: "All sizes with image",
  render: () => <AllSizesWithImageTemplate />,
  play: async ({ canvas }) => {
    // Each tile is one image named after the server; the <img> inside it
    // is hidden from assistive technology.
    await expect(
      canvas.getAllByRole("img", { name: "Document search" }),
    ).toHaveLength(4);
    const images = canvas
      .getAllByTestId("mcp-icon")
      .map((icon) => icon.querySelector("img") as HTMLElement);
    await expect(images).toHaveLength(4);
    // Each image fills its own square.
    for (const img of images) {
      await expect(sizeOf(img)).toBe(sizeOf(img.parentElement as Element));
    }
  },
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
  name: "Broken image",
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    // An unparsable data URL fails to load without a network request.
    imgSrc: "data:image/png;base64,invalid",
  },
  play: async ({ canvas }) => {
    // The failed image gives way to the letter.
    await waitFor(() =>
      expect(canvas.getByTestId("mcp-icon")).toHaveTextContent(/^D$/),
    );
    const icon = canvas.getByTestId("mcp-icon");
    await expect(icon.querySelector("img")).toBeNull();
    // The letter is hidden; the name is still the server's.
    await expect(icon).toHaveAccessibleName("Document search");
  },
  parameters: {
    docs: {
      description: {
        story:
          "An image URL that fails to load: the letter on its grey tile takes the image's place (`imgSrc`).",
      },
      source: {
        code: `<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/missing/icon.svg" />`,
      },
    },
  },
};

export const WithImageNode: Story = {
  name: "Image as a node",
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgNode: <CatalogFolderIcon />,
  },
  play: async ({ canvas }) => {
    const icon = canvas.getByTestId("mcp-icon");
    await expect(icon.querySelector("svg")).not.toBeNull();
    await expect(icon).not.toHaveTextContent("D");
  },
  parameters: {
    docs: {
      description: {
        story:
          "An inline SVG component drawn in place of the letter (`imgNode`). An `<img>` inside the node that fails to load falls back to the letter; an empty node is not replaced.",
      },
      source: {
        code: `import FolderIcon from "./folder.react.svg";

<MCPIcon title="Document search" size={MCPIconSize.Large} imgNode={<FolderIcon />} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
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
  play: async ({ canvas }) => {
    // The tile is painted by a ::before layer under the letter.
    const [first] = canvas.getAllByTestId("mcp-icon");
    const tile = getComputedStyle(first, "::before");
    await expect(tile.backgroundColor).toBe("rgb(0, 130, 201)");
    await expect(tile.opacity).toBe("0.6");
    await expect(getComputedStyle(first).borderRadius).toBe("50%");
  },
  parameters: {
    docs: {
      description: {
        story: `The four sizes as round, semi-transparent blue tiles with a regular-weight white letter. One wrapper around them sets all five variables.`,
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
