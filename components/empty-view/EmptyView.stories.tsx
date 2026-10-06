import React from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";

import EmptyRoomsLightSvg from "../../assets/emptyview/empty.rooms.root.light.svg";
import CrossSvg from "../../assets/icons/12/cross.react.svg";
import FolderSvg from "../../assets/icons/16/catalog.folder.react.svg";
import { Text } from "../text";
import { EmptyView } from ".";
import type { EmptyViewProps } from "./EmptyView.types";
import type { LinkRouterProps, To } from "../../types";

const toHref = (to: To): string => {
  if (typeof to === "string") return to;
  const { pathname = "", search = "", hash = "" } = to;
  return `${pathname}${search}${hash}`;
};

const MockLinkRouter = ({ children, to, ...props }: LinkRouterProps) => (
  <a href={toHref(to)} {...props}>
    {children}
  </a>
);

const meta = {
  title: "UI/Layout components/EmptyView",
  component: EmptyView,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description: "Main title text displayed below the icon",
    },
    description: {
      control: "text",
      description: "Text or content shown in smaller grey type under the title",
    },
    icon: {
      description:
        "Illustration shown at the top, above the title, rendered as given",
      control: false,
    },
    options: {
      description:
        "What the user can do next, in the order given: an option with `to` is a link, `type` picks a button, separator or text action, and anything else is a suggestion card. `null` shows the header alone",
      control: false,
    },
    LinkRouter: {
      description:
        "Link component of the application's router, used to render link options. Without it a link option ignores its `to` and only runs its `onClick`",
      control: false,
    },
    extraContent: {
      description:
        "Custom content shown between the description and the options",
      control: false,
    },
    className: {
      control: "text",
      description: "CSS class added to the outer block",
    },
    bodyClassName: {
      control: "text",
      description: "CSS class added to the block that holds the options",
    },
  },
} satisfies Meta<typeof EmptyView>;

type Story = StoryObj<ComponentProps<typeof EmptyView>>;

export default meta;

const Template = ({ ...args }: EmptyViewProps) => {
  return <EmptyView {...args} LinkRouter={MockLinkRouter} />;
};

export const Default: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Empty Folder",
    description: "This folder is empty. Add files or folders to get started.",
    options: [
      {
        key: "clear-filter",
        icon: <CrossSvg />,
        to: "#",
        description: "Clear Filter",
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Empty Folder" }),
    ).toBeVisible();
    await expect(
      canvas.getByText(
        "This folder is empty. Add files or folders to get started.",
      ),
    ).toBeVisible();
    // With a LinkRouter the option is a real link to its `to`.
    await expect(
      canvas.getByRole("link", { name: "Clear Filter" }),
    ).toHaveAttribute("href", "#");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The common case: an illustration, a title and a description, with one link that takes the user somewhere they can act. Change the texts live in the Controls panel below.",
      },
      source: {
        code: `<EmptyView
  icon={<EmptyRoomsIcon />}
  title="Empty Folder"
  description="This folder is empty. Add files or folders to get started."
  options={[
    { key: "clear-filter", icon: <CrossIcon />, to: "/files", description: "Clear Filter" },
  ]}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};

export const NoOptions: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No Files Found",
    description: "There are no files matching your search criteria.",
    options: null,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "No Files Found" }),
    ).toBeVisible();
    // null options: the header alone, no options block.
    await expect(canvas.queryByTestId("empty-view-body")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For an empty state the user cannot act on, such as a search with no results: only the illustration, the title and the description (`options={null}`).",
      },
      source: {
        code: `<EmptyView
  icon={<SearchIcon />}
  title="No Files Found"
  description="There are no files matching your search criteria."
  options={null}
/>`,
      },
    },
  },
};

export const WithMultipleOptions: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Get Started",
    description: "Choose an action to begin working with your workspace.",
    options: [
      {
        key: "create",
        icon: <CrossSvg />,
        to: "/create",
        description: "Create a new document",
      },
      {
        key: "upload",
        icon: <CrossSvg />,
        to: "/upload",
        description: "Upload files from your computer",
      },
      {
        key: "import",
        icon: <CrossSvg />,
        to: "/import",
        description: "Import from external storage",
      },
    ],
  },
  play: async ({ canvas }) => {
    // The links stack in the order given.
    const hrefs = canvas
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    await expect(hrefs).toEqual(["/create", "/upload", "/import"]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "When several next steps are equally likely, offer each as a link; they stack under the description in the order given.",
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="Get Started"
  description="Choose an action to begin working with your workspace."
  options={[
    { key: "create", icon: <CreateIcon />, to: "/create", description: "Create a new document" },
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Upload files" },
    { key: "import", icon: <ImportIcon />, to: "/import", description: "Import from external storage" },
  ]}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};

const onCreateFolder = fn().mockName("Create a folder");

const cardOptions: EmptyViewProps["options"] = [
  {
    key: "create",
    icon: <FolderSvg />,
    title: "Create a folder",
    description: "Keep related files together in one place.",
    onClick: onCreateFolder,
  },
  {
    key: "upload",
    icon: <FolderSvg />,
    title: "Upload files",
    description: "Click to choose where the files come from.",
    model: [
      { key: "device", label: "From this device" },
      { key: "storage", label: "From a connected storage" },
    ],
  },
  {
    key: "templates",
    icon: <FolderSvg />,
    title: "Browse templates",
    description: "This card is disabled, so it is not shown.",
    disabled: true,
  },
];

export const SuggestionCards: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Nothing here yet",
    description: "Pick one of the suggestions below to get started.",
    options: cardOptions,
  },
  play: async ({ canvas, userEvent }) => {
    // A plain card runs its onClick; the card is named by its title.
    await userEvent.click(
      canvas.getByRole("button", { name: "Create a folder" }),
    );
    await expect(onCreateFolder).toHaveBeenCalledTimes(1);

    // A card with a model opens a menu of choices instead.
    await userEvent.click(canvas.getByRole("button", { name: "Upload files" }));
    await expect(await screen.findByText("From this device")).toBeVisible();

    // A disabled card is not rendered at all.
    await expect(canvas.queryByText("Browse templates")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story: `Cards give each next step a title and a line of explanation, for when a link alone would not say enough:

- **Create a folder** — a plain card; clicking it runs its \`onClick\`
- **Upload files** — click it to open a menu of choices instead (\`model\`)
- A third card, **Browse templates**, is \`disabled\` and therefore not rendered at all`,
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="Nothing here yet"
  description="Pick one of the suggestions below to get started."
  options={[
    { key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place.", onClick: handleCreate },
    {
      key: "upload",
      icon: <FolderIcon />,
      title: "Upload files",
      description: "Click to choose where the files come from.",
      model: [
        { key: "device", label: "From this device", onClick: handleDevice },
        { key: "storage", label: "From a connected storage", onClick: handleStorage },
      ],
    },
    { key: "templates", icon: <FolderIcon />, title: "Browse templates", description: "...", disabled: true },
  ]}
/>`,
      },
    },
  },
};

export const WithButtons: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No documents",
    description: "Create the first document or bring one in.",
    options: [
      {
        key: "create",
        type: "button",
        title: "Create document",
        onClick: fn().mockName("Create document"),
      },
      {
        key: "import",
        type: "button",
        title: "Import",
        primary: false,
        onClick: fn().mockName("Import"),
      },
      {
        key: "sync",
        type: "button",
        title: "Sync",
        primary: false,
        isLoading: true,
      },
    ],
  },
  play: async ({ args, canvas, userEvent }) => {
    const [create, importOption] = (args.options ?? []) as {
      onClick: () => void;
    }[];
    // Button options are native buttons: Enter works as well as a click.
    await userEvent.click(
      canvas.getByRole("button", { name: "Create document" }),
    );
    await expect(create.onClick).toHaveBeenCalledTimes(1);

    canvas.getByRole("button", { name: "Import" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(importOption.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story: `Buttons suit a step that starts work right here rather than going somewhere; they line up in a row and wrap when there is no room:

- **Create document** — primary, which is what a button option is unless told otherwise
- **Import** — secondary (\`primary: false\`)
- **Sync** — secondary, with a loader while its work runs (\`isLoading\`)`,
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="No documents"
  description="Create the first document or bring one in."
  options={[
    { key: "create", type: "button", title: "Create document", onClick: handleCreate },
    { key: "import", type: "button", title: "Import", primary: false, onClick: handleImport },
    { key: "sync", type: "button", title: "Sync", primary: false, isLoading: true },
  ]}
/>`,
      },
    },
  },
};

export const TextActionsWithSeparator: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "This folder is empty",
    description: "Add the first file to it.",
    options: [
      {
        key: "upload",
        type: "action",
        icon: <FolderSvg />,
        title: "Upload a file",
        onClick: fn().mockName("Upload a file"),
      },
      { key: "or", type: "separator", text: "or" },
      {
        key: "create",
        type: "action",
        icon: <FolderSvg />,
        title: "Create a document",
        className: "secondary",
        onClick: fn().mockName("Create a document"),
      },
    ],
  },
  play: async ({ args, canvas, userEvent }) => {
    const [upload, , create] = (args.options ?? []) as {
      onClick: () => void;
    }[];
    await userEvent.click(
      canvas.getByRole("button", { name: "Upload a file" }),
    );
    await expect(upload.onClick).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText("or")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Create a document" }),
    );
    await expect(create.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story: `Text actions are the lightest option, for two alternatives joined by a word:

- **Upload a file** — an accented icon-and-text action (\`type: "action"\`)
- **or** — a separator line of text between the two (\`type: "separator"\`)
- **Create a document** — the same action in grey, for the less likely choice (\`className: "secondary"\`)`,
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="This folder is empty"
  description="Add the first file to it."
  options={[
    { key: "upload", type: "action", icon: <FolderIcon />, title: "Upload a file", onClick: handleUpload },
    { key: "or", type: "separator", text: "or" },
    { key: "create", type: "action", icon: <FolderIcon />, title: "Create a document", className: "secondary", onClick: handleCreate },
  ]}
/>`,
      },
    },
  },
};

export const WithExtraContent: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No shared files",
    description: "Files other people share with you appear here.",
    extraContent: (
      <Text fontSize="12px" fontWeight="600">
        Ask a teammate to share a file with you.
      </Text>
    ),
    options: [
      {
        key: "refresh",
        icon: <CrossSvg />,
        to: "#",
        description: "Clear Filter",
      },
    ],
  },
  play: async ({ canvas }) => {
    // extraContent sits between the description and the options.
    const extra = canvas.getByText("Ask a teammate to share a file with you.");
    const body = canvas.getByTestId("empty-view-body");
    await expect(
      extra.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the empty state needs something the option types do not cover — a hint, a form, a picture — it goes between the description and the options (`extraContent`).",
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="No shared files"
  description="Files other people share with you appear here."
  extraContent={<Text fontSize="12px" fontWeight="600">Ask a teammate to share a file with you.</Text>}
  options={[{ key: "refresh", icon: <CrossIcon />, to: "/files", description: "Clear Filter" }]}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "This folder is empty",
    description: "Add the first file to it",
    options: [
      {
        key: "create",
        icon: <FolderSvg />,
        title: "Create a folder",
        description: "Keep related files together in one place",
      },
    ],
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, so its direction does not flip the whole Docs page.
      story: { inline: false, height: "375px" },
      description: {
        story:
          'The same empty state under a right-to-left interface: in the suggestion card the icon moves to the right edge, the text aligns right, and the arrow moves to the left edge and points left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <EmptyView
    icon={<EmptyIcon />}
    title="This folder is empty"
    description="Add the first file to it"
    options={[{ key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place" }]}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--empty-view-title-color": "#0082c9",
          "--empty-view-header-font-size": "18px",
          "--empty-view-desc-color": "#5b6b7a",
          "--empty-view-link-accent": "#0082c9",
          "--empty-view-link-background": "#e6f3fb",
          "--empty-view-link-hover-background": "#cce5f6",
          "--empty-view-link-radius": "50px",
          "--empty-view-link-padding": "8px 16px",
          "--empty-view-link-text-size": "14px",
          "--empty-view-link-text-weight": "700",
          "--empty-view-item-radius": "12px",
          "--empty-view-item-padding": "16px 20px",
          "--empty-view-item-gap": "16px",
          "--empty-view-icon-size": "24px",
          "--empty-view-item-hover-background": "#e6f3fb",
          "--empty-view-item-title-color": "#004f82",
          "--empty-view-item-desc-color": "#7a8a99",
          "--empty-view-divider-color": "#0082c9",
          "--empty-view-width": "400px",
          "--empty-view-gap": "12px",
          "--empty-view-padding-top": "24px",
        } as CSSProperties
      }
    >
      <EmptyView
        icon={<EmptyRoomsLightSvg />}
        title="No Files Found"
        description="Upload or create files to get started."
        options={[
          {
            key: "upload",
            icon: <CrossSvg />,
            to: "#",
            description: "Upload files",
          },
          {
            key: "create",
            icon: <CrossSvg />,
            to: "#",
            description: "Create new document",
          },
          { key: "or", type: "separator", text: "or" },
          {
            key: "folder",
            icon: <FolderSvg />,
            title: "Create a folder",
            description: "Keep related files together in one place.",
          },
        ]}
        LinkRouter={MockLinkRouter}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The instance holds two links, a separator and a suggestion card. Hover a link and the card to see the hover backgrounds.`,
      },
      source: {
        code: `<div
  style={{
    "--empty-view-title-color": "#0082c9",
    "--empty-view-link-background": "#e6f3fb",
    "--empty-view-link-radius": "50px",
    "--empty-view-item-radius": "12px",
    "--empty-view-divider-color": "#0082c9",
    "--empty-view-width": "400px",
  }}
>
  <EmptyView icon={<EmptyIcon />} title="No Files Found" description="..." options={options} LinkRouter={RouterLink} />
</div>`,
      },
    },
  },
};
