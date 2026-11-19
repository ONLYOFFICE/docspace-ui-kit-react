import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import {
  AvatarActionKeys,
  AvatarPure,
  AvatarRole,
  AvatarSize,
  type TAvatarModel,
} from ".";

// An inline picture: no network request and no photo of a real person.
const samplePicture = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#8fb3d9"/><circle cx="100" cy="82" r="36" fill="#f3f6fa"/><path d="M36 200a64 64 0 0 1 128 0z" fill="#f3f6fa"/></svg>',
)}`;

const editModel: TAvatarModel[] = [
  {
    key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
    label: "Upload picture",
    icon: CatalogFolderReactSvgUrl,
    onClick: (ref) => ref?.current?.click(),
  },
  {
    key: AvatarActionKeys.PROFILE_AVATAR_DELETE,
    label: "Delete picture",
    icon: CatalogFolderReactSvgUrl,
    onClick: fn(),
  },
];

const meta = {
  title: "UI/Data display/Avatar",
  component: AvatarPure,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=878-37278&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(AvatarSize),
      description:
        "Diameter of the avatar, from `extraSmall` (24px) to `max` (124px). The initials and the role badge are sized to match; `extraSmall` has rules for neither, so it fits a picture only.",
    },
    role: {
      control: "select",
      options: Object.values(AvatarRole),
      description:
        "Which role badge is drawn over the bottom corner. Only `owner` and `admin` draw one; every other member, `none` included, draws none.",
    },
    source: {
      control: "text",
      description:
        "The picture: a React element is rendered as given, a URL as an `<img>`. A URL whose path ends in `.svg` is drawn as an icon, and one containing `default_user_photo` becomes the kit's illustration.",
    },
    userName: {
      control: "text",
      description:
        "Name the initials are built from when there is no `source`. It is also the picture's `alt` text and, on a clickable avatar, its accessible name.",
    },
    editing: {
      control: "boolean",
      description:
        "Shows the edit button over the avatar: a pencil when `hasAvatar`, a plus otherwise. Only `size` `max` draws it; at other sizes it has no effect.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasAvatar: {
      control: "boolean",
      description:
        "Whether the user already has a picture. With it, a click opens the menu of `model` under a pencil; without it, a click runs the first entry, under a plus.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Actions of the edit menu, in order. The first entry runs directly when there is no picture. The entry keyed `PROFILE_AVATAR_UPLOAD` is handed the file input's ref.",
    },
    roleIcon: {
      control: false,
      description: "Badge to draw instead of the one `role` would choose.",
    },
    isNotIcon: {
      control: "boolean",
      description:
        "Renders a `.svg` source as a picture rather than fetching it as an icon.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    imgClassName: {
      control: "text",
      description: "Added to the `<img>`, for a source shown as a picture.",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    className: {
      control: "text",
      description:
        "Applied to the avatar element and, again, to the picture inside it.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the avatar.",
      table: {
        defaultValue: { summary: "avatar" },
      },
    },
    id: {
      control: false,
      description:
        "Ignored. Nothing reads this prop and no `id` reaches the DOM.",
    },
    style: {
      control: false,
      description:
        "Ignored. Nothing reads this prop and no inline style reaches the DOM.",
    },
    hideRoleIcon: {
      control: "boolean",
      description: "Hides the role badge that `role` would otherwise draw.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withTooltip: {
      control: "boolean",
      description:
        "Renders a tooltip anchored to the role badge. Without a badge it shows nothing.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tooltipContent: {
      control: "text",
      description:
        "Text shown in the badge's tooltip when `withTooltip` is set.",
    },
    isGroup: {
      control: "boolean",
      description:
        "Uppercases the initials and gives them the group background and colour.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultSource: {
      control: "boolean",
      description:
        "Shows the kit's own illustration when there is no `source` and no `userName`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noClick: {
      control: "boolean",
      description:
        "Stops a click on the avatar from opening the menu or the file dialog, and drops its button role. `onClick` and the edit button still work.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editAction: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the edit button runs the first `model` entry.",
    },
    onClick: {
      action: "onClick",
      description:
        "Called on a click, on Enter or Space while the avatar has focus, and on a middle-button press. A click on the avatar then opens neither the menu nor the file dialog; the edit button still does.",
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called with the change event of the hidden file input, which is rendered only when this prop is given. Without it the avatar is not editable at all.",
    },
  },
} satisfies Meta<typeof AvatarPure>;

type Story = StoryObj<ComponentProps<typeof AvatarPure>>;

export default meta;

const widthOf = (el: Element) => Math.round(el.getBoundingClientRect().width);

const badgeOf = (avatar: HTMLElement) =>
  avatar.querySelector<HTMLElement>(".avatar_role-wrapper");

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
  name: "Empty",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "",
    withTooltip: false,
  },
  play: async ({ canvas }) => {
    // Neither picture nor name: the camera icon, at the 124px max size.
    const avatar = canvas.getByTestId("avatar");
    await expect(widthOf(avatar)).toBe(124);
    await expect(avatar.querySelector("img")).toBeNull();
    await expect(avatar.querySelector("svg")).not.toBeNull();
    await expect(badgeOf(avatar)).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An avatar with nothing to show: with no picture and no name, a camera icon on the neutral background.",
      },
      source: {
        code: `<Avatar size={AvatarSize.max} role={AvatarRole.user} />`,
      },
    },
  },
};

export const WithImage: Story = {
  name: "With picture",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source: samplePicture,
    userName: "John Smith",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "John Smith - Administrator",
    withTooltip: true,
  },
  play: async ({ canvas, userEvent }) => {
    const avatar = canvas.getByTestId("avatar");
    // The picture is named after the person, not the word "avatar", and
    // so is the clickable avatar around it.
    await expect(avatar.querySelector("img")).toHaveAttribute(
      "alt",
      "John Smith",
    );
    await expect(
      canvas.getByRole("button", { name: "John Smith" }),
    ).toBeVisible();
    // The admin badge opens its tooltip on hover.
    const badge = badgeOf(avatar) as HTMLElement;
    await userEvent.hover(badge);
    await waitFor(() =>
      expect(screen.getByText("John Smith - Administrator")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picture with the admin badge at its bottom corner. The badge shows `tooltipContent` on hover.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
  tooltipContent="John Smith - Administrator"
  withTooltip
/>`,
      },
    },
  },
};

export const WithInitials: Story = {
  name: "With initials",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.guest,
    source: "",
    userName: "John Doe",
    editing: false,
    hideRoleIcon: false,
  },
  play: async ({ canvas }) => {
    // The first letters of the first two words; a guest has no badge.
    const avatar = canvas.getByTestId("avatar");
    await expect(avatar).toHaveTextContent(/^JD$/);
    await expect(badgeOf(avatar)).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The initials of `userName`, JD for John Doe, on the initials background. A guest draws no badge.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.guest}
  userName="John Doe"
/>`,
      },
    },
  },
};

export const WithIcon: Story = {
  name: "With SVG icon",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    // A URL whose path ends in ".svg" is drawn as an icon. Storybook serves
    // assets/ under /static; an imported URL would not do, since Vite may
    // inline a small file as a data: URL, which is always a picture.
    source: "/static/@.react.svg",
    userName: "",
    editing: false,
    hideRoleIcon: false,
  },
  play: async ({ canvas }) => {
    // A .svg source is drawn as an icon, not as an <img>.
    const avatar = canvas.getByTestId("avatar");
    await expect(avatar.querySelector(".icon")).not.toBeNull();
    await expect(avatar.querySelector("img")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A `source` whose path ends in `.svg`, drawn as a grey icon rather than a picture.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  source={iconUrl}
/>`,
      },
    },
  },
};

const AllSizesTemplate = () => {
  const sizes = Object.values(AvatarSize);

  return (
    <Wrapper>
      {sizes.map((size) => (
        <LabeledItem key={size} label={size}>
          <AvatarPure
            size={size}
            role={AvatarRole.admin}
            userName="John Doe"
            hideRoleIcon={size === AvatarSize.min}
          />
        </LabeledItem>
      ))}
    </Wrapper>
  );
};

export const AllSizes: Story = {
  name: "All sizes",
  render: () => <AllSizesTemplate />,
  play: async ({ canvas }) => {
    const widths = canvas.getAllByTestId("avatar").map(widthOf);
    await expect([...widths].sort((a, b) => a - b)).toEqual([
      24, 32, 36, 40, 48, 80, 124,
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "All seven sizes side by side, from 124px down to 24px. The initials and the admin badge shrink with the avatar.",
      },
      source: {
        code: `<Avatar size={AvatarSize.min} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.small} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.base} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.medium} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.max} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.extraSmall} role={AvatarRole.admin} userName="John Doe" />`,
      },
    },
  },
};

const AllRolesTemplate = () => {
  const roles = [
    { role: AvatarRole.owner, label: "Owner" },
    { role: AvatarRole.admin, label: "Admin" },
    { role: AvatarRole.user, label: "User" },
    { role: AvatarRole.guest, label: "Guest" },
    { role: AvatarRole.manager, label: "Manager" },
    { role: AvatarRole.collaborator, label: "Collaborator" },
    { role: AvatarRole.none, label: "None" },
  ];

  return (
    <Wrapper>
      {roles.map(({ role, label }) => (
        <LabeledItem key={label} label={label}>
          <AvatarPure size={AvatarSize.big} role={role} userName={label} />
        </LabeledItem>
      ))}
    </Wrapper>
  );
};

export const AllRoles: Story = {
  name: "All roles",
  render: () => <AllRolesTemplate />,
  play: async ({ canvas }) => {
    // Nothing here is clickable, so no avatar claims to be a button.
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
    // Only Owner and Admin draw a badge.
    const withBadge = canvas
      .getAllByTestId("avatar")
      .map((avatar) => badgeOf(avatar) !== null);
    await expect(withBadge).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Every `role` value on the same avatar. Only Owner and Admin draw a badge at the bottom corner.",
      },
      source: {
        code: `<Avatar size={AvatarSize.big} role={AvatarRole.owner} userName="Owner" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="Admin" />
<Avatar size={AvatarSize.big} role={AvatarRole.user} userName="User" />
<Avatar size={AvatarSize.big} role={AvatarRole.guest} userName="Guest" />
<Avatar size={AvatarSize.big} role={AvatarRole.manager} userName="Manager" />
<Avatar size={AvatarSize.big} role={AvatarRole.collaborator} userName="Collaborator" />
<Avatar size={AvatarSize.big} role={AvatarRole.none} userName="None" />`,
      },
    },
  },
};

export const GroupAvatar: Story = {
  name: "Group",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.none,
    source: "",
    userName: "Project Team",
    isGroup: true,
    hideRoleIcon: true,
  },
  play: async ({ canvas }) => {
    const avatar = canvas.getByTestId("avatar");
    await expect(avatar).toHaveTextContent(/^PT$/);
    await expect(avatar.querySelector("[data-is-group='true']")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A group: upper-case bold initials on the group background, with the role badge hidden.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.none}
  userName="Project Team"
  isGroup
  hideRoleIcon
/>`,
      },
    },
  },
};

export const EditingMode: Story = {
  name: "Editing without a picture",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source: "",
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: false,
    model: editModel,
    // Set so no onClick action is injected: one would replace the edit behaviour.
    onClick: undefined,
    onChangeFile: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // No picture yet: a plus button, and a picked file reaches onChangeFile.
    await expect(
      canvas.getByTestId("edit_avatar_icon_button"),
    ).toBeInTheDocument();
    await userEvent.upload(
      canvas.getByTestId("file-input"),
      new File(["x"], "me.png", { type: "image/png" }),
    );
    await expect(args.onChangeFile).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A person with no picture: a plus button at the corner. A click on it or on the avatar runs the first `model` entry, which opens the file dialog.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar={false}
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
  ]}
  onChangeFile={handleFile}
/>`,
      },
    },
  },
};

export const EditingWithAvatar: Story = {
  name: "Editing with a picture",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source: samplePicture,
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: true,
    model: editModel,
    // Set so no onClick action is injected: one would replace the edit behaviour.
    onClick: undefined,
    onChangeFile: fn(),
  },
  play: async ({ canvas, userEvent }) => {
    const isMenuOpen = () =>
      screen
        .queryAllByText("Upload picture")
        .some((item) => item.checkVisibility());

    // With a picture, the pencil toggles the menu of model actions: one
    // click opens it, the next closes it.
    const pencil = canvas.getByTestId("edit_avatar_icon_button");
    await userEvent.click(pencil);
    await waitFor(() => expect(isMenuOpen()).toBe(true));
    await userEvent.click(pencil);
    await waitFor(() => expect(isMenuOpen()).toBe(false));

    // The avatar itself is a named button: Enter opens the same menu.
    const avatar = canvas.getByRole("button", { name: "Jane Smith" });
    avatar.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(isMenuOpen()).toBe(true));

    // Picking an entry runs it and closes the menu, which stays closed.
    await userEvent.click(screen.getByText("Delete picture"));
    await expect(editModel[1].onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(isMenuOpen()).toBe(false));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A person with a picture: a pencil at the corner. A click on it or on the avatar opens a menu of the `model` entries.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  source="https://example.com/photo.jpg"
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
    {
      key: AvatarActionKeys.PROFILE_AVATAR_DELETE,
      label: "Delete picture",
      icon: iconUrl,
      onClick: handleDelete,
    },
  ]}
  onChangeFile={handleFile}
/>`,
      },
    },
  },
};

export const WithCustomRoleIcon: Story = {
  name: "Custom role badge",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source: "",
    userName: "Custom Role",
    roleIcon: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        VIP
      </div>
    ),
    hideRoleIcon: false,
  },
  play: async ({ canvas }) => {
    const badge = badgeOf(canvas.getByTestId("avatar"));
    await expect(badge).toHaveTextContent("VIP");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A VIP badge passed in `roleIcon`, drawn in place of the admin badge `role` would choose.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  userName="Custom Role"
  roleIcon={<CustomRoleIcon />}
/>`,
      },
    },
  },
};

export const DefaultSource: Story = {
  name: "Default illustration",
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    isDefaultSource: true,
    hideRoleIcon: false,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByTestId("avatar").querySelector("[data-is-default='true']"),
    ).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The kit's illustration, shown by `isDefaultSource` when there is neither `source` nor `userName`.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  isDefaultSource
/>`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl">
      <Wrapper>
        <AvatarPure
          size={AvatarSize.big}
          role={AvatarRole.admin}
          userName="John Doe"
          withTooltip
          tooltipContent="Admin"
        />
        <AvatarPure
          size={AvatarSize.max}
          role={AvatarRole.none}
          source={samplePicture}
          editing
          hasAvatar
          model={editModel}
          onChangeFile={fn()}
        />
      </Wrapper>
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // Under RTL the badge sits in the bottom-left corner.
    const [admin] = canvas.getAllByTestId("avatar");
    const badge = (badgeOf(admin) as HTMLElement).getBoundingClientRect();
    const box = admin.getBoundingClientRect();
    await expect(badge.left - box.left).toBeLessThan(box.right - badge.right);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "150px" },
      description: {
        story:
          "Avatars under a right-to-left interface: the admin badge and the pencil sit in the bottom-left corner. The badge tooltip opens to the left.",
      },
      source: {
        code: `<div dir="rtl">
  <Avatar
    size={AvatarSize.big}
    role={AvatarRole.admin}
    userName="John Doe"
    withTooltip
    tooltipContent="Admin"
  />
  <Avatar
    size={AvatarSize.max}
    role={AvatarRole.none}
    source={pictureUrl}
    editing
    hasAvatar
    model={model}
    onChangeFile={handleFile}
  />
</div>`,
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
          display: "flex",
          gap: "16px",
          alignItems: "center",
          "--avatar-radius": "8px",
          "--avatar-initials-weight": "400",
          "--avatar-initials-bg": "#7c3aed",
          "--avatar-bg": "#c4b5fd",
          "--avatar-administrator-fill": "#16a34a",
        } as CSSProperties
      }
    >
      <AvatarPure
        size={AvatarSize.big}
        userName="John Doe"
        role={AvatarRole.admin}
      />
      <AvatarPure size={AvatarSize.big} role={AvatarRole.user} />
    </div>
  ),
  play: async ({ canvas }) => {
    const [initials] = canvas.getAllByTestId("avatar");
    const painted = [initials, ...initials.querySelectorAll("*")].find(
      (el) => getComputedStyle(el).backgroundColor === "rgb(124, 58, 237)",
    ) as HTMLElement | undefined;
    await expect(painted).toBeDefined();
    await expect(getComputedStyle(painted as HTMLElement).borderRadius).toBe(
      "8px",
    );
    // The badge colours are read from an ancestor like the rest.
    const badge = initials.querySelector(".admin_icon rect") as Element;
    await expect(getComputedStyle(badge).fill).toBe("rgb(22, 163, 74)");
  },
  parameters: {
    docs: {
      description: {
        story: `Five variables set on one wrapper. The avatar with initials shows the radius, the initials background, the weight and a green admin badge; the empty one shows \`--avatar-bg\`.`,
      },
      source: {
        code: `<div
  style={{
    "--avatar-radius": "8px",
    "--avatar-initials-weight": "400",
    "--avatar-initials-bg": "#7c3aed",
    "--avatar-bg": "#c4b5fd",
    "--avatar-administrator-fill": "#16a34a",
  }}
>
  <Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
  <Avatar size={AvatarSize.big} role={AvatarRole.user} />
</div>`,
      },
    },
  },
};
