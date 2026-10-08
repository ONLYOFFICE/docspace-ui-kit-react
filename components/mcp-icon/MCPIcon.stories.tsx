import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";
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
  render: () => <AllSizesTemplate />,
  play: async ({ canvas }) => {
    const sizes = canvas.getAllByTestId("mcp-icon").map(sizeOf);
    await expect([...sizes].sort((a, b) => a - b)).toEqual([16, 24, 32, 48]);
  },
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
  play: async ({ canvas }) => {
    const icon = canvas.getByTestId("mcp-icon");
    await expect(icon.querySelector("svg")).not.toBeNull();
    await expect(icon).not.toHaveTextContent("D");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use for an icon your bundler has already inlined as a component: the element is drawn in place of the letter (`imgNode`). An `<img>` inside it that fails to load falls back to the letter; an empty node is not replaced.",
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
        story: `The variables are listed under CSS variables on this page. The four sizes share one wrapper that sets all five variables: a round, semi-transparent blue tile with a regular-weight white letter.`,
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
