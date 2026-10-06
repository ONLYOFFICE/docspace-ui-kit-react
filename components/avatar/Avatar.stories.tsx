import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import AtReactSvgUrl from "../../assets/@.react.svg?url";
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
        "Diameter of the avatar, from 24px (`extraSmall`) to 124px (`max`); the initials and the role badge are sized to match, and `extraSmall` is meant for a picture only",
    },
    role: {
      control: "select",
      options: Object.values(AvatarRole),
      description:
        "Which role badge is drawn at the bottom corner: only `owner` and `admin` draw one, every other value draws none",
    },
    source: {
      control: "text",
      description:
        "The picture: a URL shown as an image, a path to a `.svg` file drawn as an icon, or a React element rendered as given",
    },
    userName: {
      control: "text",
      description:
        "Name the initials are built from when there is no `source`: the first letter of each of the first two words",
    },
    editing: {
      control: "boolean",
      description:
        "Shows the edit button at the bottom corner, in place of the role badge — a pencil when `hasAvatar`, a plus otherwise; drawn only at `size` `max`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasAvatar: {
      control: "boolean",
      description:
        "Whether there already is a picture: it picks the pencil over the plus, and makes a click open the `model` menu instead of the file dialog",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Actions of the edit menu, in order; the first one runs directly when there is no picture yet, and the one keyed `AvatarActionKeys.PROFILE_AVATAR_UPLOAD` receives the file input's ref",
    },
    roleIcon: {
      control: false,
      description: "Badge to draw instead of the one `role` would choose",
    },
    isNotIcon: {
      control: "boolean",
      description:
        "Shows a `.svg` `source` as a picture instead of drawing it as an icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    imgClassName: {
      control: "text",
      description: "Class added to the `<img>` of a picture `source`",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    className: {
      control: "text",
      description:
        "Class added to the avatar and, again, to the picture area inside it",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the avatar",
      table: {
        defaultValue: { summary: "avatar" },
      },
    },
    id: {
      control: false,
      description: "Ignored: nothing reads it and no `id` reaches the page",
    },
    style: {
      control: false,
      description:
        "Ignored: nothing reads it and no inline style reaches the page",
    },
    hideRoleIcon: {
      control: "boolean",
      description: "Hide the role indicator badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withTooltip: {
      control: "boolean",
      description:
        "Shows `tooltipContent` while the role badge is hovered; without a badge (`role` other than `owner` or `admin`) nothing appears",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tooltipContent: {
      control: "text",
      description: "Text of the role badge tooltip",
    },
    isGroup: {
      control: "boolean",
      description:
        "Draws the initials in upper case and bold, on the group background",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultSource: {
      control: "boolean",
      description:
        "Shows the kit's placeholder illustration when there is neither `source` nor `userName`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noClick: {
      control: "boolean",
      description:
        "Keeps a click on the avatar from opening the edit menu or the file dialog; `onClick` still fires",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editAction: {
      control: false,
      description:
        "Ignored: nothing reads it; the edit button runs the first `model` entry",
    },
    onClick: {
      action: "onClick",
      description:
        "Called on a click and on a middle-button press; passing it replaces the edit behaviour, so the menu and the file dialog no longer open from the avatar",
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called when a file is picked in the hidden file input, which is rendered only when this is given; without it the avatar is not editable",
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
          "An avatar with nothing to show yet: with no picture and no name it falls back to a camera icon on the neutral background. Change any prop live in the Controls panel below.",
      },
      source: {
        code: `<Avatar size={AvatarSize.max} role={AvatarRole.user} />`,
      },
    },
  },
};

export const WithImage: Story = {
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
    await expect(canvas.getByRole("img", { name: "avatar" })).toBeVisible();
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
          "A picture with the admin badge at its bottom corner; hover the badge to read its tooltip (`withTooltip`, `tooltipContent`).",
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
          "Avatar showing initials generated from the user name. Uses first letter of first two words (JD).",
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
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    // The avatar treats a source as an icon when the string contains
    // ".svg"; Vite inlines this small file as a data URL, which does not, so
    // the fragment gives it one without changing the image.
    source: `${AtReactSvgUrl}#icon.svg`,
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
        story: "Avatar displaying an SVG icon instead of an image or initials.",
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
          "All seven sizes side by side: max (124px), big (80px), medium (48px), base (40px), small (36px), min (32px) and extraSmall (24px); the initials and the admin badge shrink with the avatar.",
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
  render: () => <AllRolesTemplate />,
  play: async ({ canvas }) => {
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
          "Every `role` value on the same avatar: only Owner and Admin draw a badge at the bottom corner, User, Guest, Manager, Collaborator and None draw none.",
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
          "Group avatar with uppercase initials and specialized background color. Role icons are typically hidden for groups.",
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
          "A person with no picture yet: the plus button at the corner, or a click anywhere on the avatar, opens the file dialog straight away through the first `model` action, and the chosen file reaches `onChangeFile`. The button is drawn only at `size` `max`.",
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
    // With a picture, the pencil opens the menu of model actions.
    await userEvent.click(canvas.getByTestId("edit_avatar_icon_button"));
    await waitFor(() =>
      expect(screen.getByText("Upload picture")).toBeVisible(),
    );
    await userEvent.click(screen.getByText("Delete picture"));
    await expect(editModel[1].onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A person who already has a picture: the pencil at the corner, or a click on the avatar, opens a menu of the `model` actions — **Upload picture** opens the file dialog, **Delete picture** runs its own handler.",
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
          "Avatar with a custom role icon element instead of the default role badges.",
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
          "Avatar showing the default placeholder image when no source or userName is provided.",
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
          'The same avatars under a right-to-left interface: the admin badge and the pencil move from the bottom-right corner to the bottom-left one, and the badge tooltip opens to the left of it. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
  },
  parameters: {
    docs: {
      description: {
        story: `Four variables set on one wrapper -- the variables are listed under CSS variables on this page. The first avatar, with initials, shows the radius, the initials background and the weight; the second, with neither picture nor name, is there for \`--avatar-bg\`.`,
      },
      source: {
        code: `<div
  style={{
    "--avatar-radius": "8px",
    "--avatar-initials-weight": "400",
    "--avatar-initials-bg": "#7c3aed",
    "--avatar-bg": "#c4b5fd",
  }}
>
  <Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
  <Avatar size={AvatarSize.big} role={AvatarRole.user} />
</div>`,
      },
    },
  },
};
