import type { ComponentProps, CSSProperties } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import withBundledLogos from "../../.storybook/decorators/withBundledLogos";
import { useWindowDevice } from "../../.storybook/utils/useWindowDevice";
import CatalogAiAgentsReactSvgUrl from "../../assets/icons/16/catalog.ai-agents.react.svg?url";
import CatalogFavoritesReactSvgUrl from "../../assets/icons/16/catalog.favorites.react.svg?url";
import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import CatalogRecentReactSvgUrl from "../../assets/icons/16/catalog-settings-restore.svg?url";
import CatalogRoomsReactSvgUrl from "../../assets/icons/16/catalog.rooms.react.svg?url";
import CatalogSharedReactSvgUrl from "../../assets/icons/16/catalog.shared.outline.svg?url";
import CatalogTrashReactSvgUrl from "../../assets/icons/16/catalog.trash.react.svg?url";
import ArticleHideMenuIcon from "../../assets/article-hide-menu-icon.react.svg";
import { useTheme } from "../../context/ThemeContext";
import {
  DeviceType,
  EmployeeActivationStatus,
  EmployeeStatus,
  WhiteLabelLogoType,
} from "../../enums";
import { getLogoUrl } from "../../utils/getLogoUrl";
import { Button, ButtonSize } from "../button";
import type { ContextMenuModel } from "../context-menu";
import { IconButton } from "../icon-button";

import Article from ".";
import type { ArticleProps } from "./Article.types";
import { ArticleItem } from "./item";

const meta = {
  title: "UI/Layout/Article",
  component: Article,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  decorators: [withBundledLogos],
  argTypes: {
    showText: {
      control: "boolean",
      description:
        "Whether the panel is expanded. It is the width switch — 243px when set, 60px when not — and it is written back through `setShowText` on mount and on every device change.",
      table: { type: { summary: "boolean" } },
    },
    setShowText: {
      control: false,
      description:
        "Called on mount and on every device change: `true` on a desktop or a phone. On a tablet it gets `false`, and only while `showArticle` in local storage is falsy.",
    },
    toggleShowText: {
      control: false,
      description:
        "Called by the collapse handle at the foot of the panel. It is expected to flip `showText`; the panel does not collapse on its own.",
    },
    articleOpen: {
      control: "boolean",
      description:
        "Whether the panel is open over the page. It only matters on a phone, where the panel is a portal with a backdrop.",
      table: { type: { summary: "boolean" } },
    },
    toggleArticleOpen: {
      control: false,
      description:
        "Called on a phone by the header's close button, the backdrop, the back button and the developer tools entry. It is expected to flip `articleOpen`.",
    },
    setArticleOpen: {
      control: false,
      description:
        "Called with `false` when the browser goes back on a phone, to close the panel.",
    },
    isMobileArticle: {
      control: "boolean",
      description:
        "Removes the padding and margin around the main button, and moves the live chat launcher clear of it. The component writes it back through `setIsMobileArticle`.",
      table: { type: { summary: "boolean" } },
    },
    setIsMobileArticle: {
      control: false,
      description:
        "Called on mount and on every device change: `true` on a tablet or a phone, `false` on a desktop. Wire it to the state behind `isMobileArticle`.",
    },
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description:
        "Which layout to render. The panel is a portal into `#root` on `mobile`, a collapsible sidebar on `tablet` and a fixed column on `desktop`; nothing here measures the viewport.",
      table: { type: { summary: "DeviceType" } },
    },
    children: {
      control: false,
      description:
        "The three slots, as an array. Each is `Article.Header`, `Article.MainButton` or `Article.Body`; anything else is dropped, and the slots are matched by display name, so a wrapper around one hides it.",
    },
    withCustomArticleHeader: {
      control: "boolean",
      description:
        "Shows the `Article.Header` slot in the header row in place of the logo. Without it the slot is not rendered; a phone never shows it.",
      table: { type: { summary: "boolean" } },
    },
    withMainButton: {
      control: "boolean",
      description:
        "Whether a main button belongs above the body. Without it the `Article.MainButton` slot is not rendered on anything but a phone.",
      table: { defaultValue: { summary: "false" } },
    },
    onLogoClickAction: {
      control: false,
      description:
        "Called when the logo, or the back button above the body, is clicked, before the panel navigates.",
    },
    showBackButton: {
      control: "boolean",
      description:
        "Shows the back button in the header, and a second one above the body on anything wider than a phone.",
      table: { type: { summary: "boolean" } },
    },
    onBack: {
      control: false,
      description: "Called by the back button instead of navigating.",
    },
    navigate: {
      control: false,
      description:
        "Router push used by the logo, the back button and the developer tools entry. Without it they set `window.location`, which reloads the page.",
    },
    isBurgerLoading: {
      control: "boolean",
      description:
        "Renders the logo and the back button as skeletons. A custom header outranks it.",
      table: { type: { summary: "boolean" } },
    },
    showArticleLoader: {
      control: "boolean",
      description:
        "Replaces the profile block with a skeleton. It also removes the custom slot, the developer tools entry, the apps block, the live chat and the collapse handle.",
      table: { defaultValue: { summary: "false" } },
    },
    user: {
      control: false,
      description:
        "The signed-in person, shown in the block at the foot of the panel. Its `isVisitor` also hides the developer tools entry.",
    },
    getActions: {
      control: false,
      description:
        "Returns the model of the profile block's context menu. It is handed a translate function, which this package does not supply.",
    },
    onProfileClick: {
      control: false,
      description:
        "Called when the profile block is clicked, with the original event wrapped in an object.",
    },
    hideProfileBlock: {
      control: "boolean",
      description:
        "Removes the profile block at the foot of the panel, and moves the collapse handle down to take its place.",
      table: { type: { summary: "boolean" } },
    },
    hideAppsBlock: {
      control: "boolean",
      description:
        'Removes the "download the apps" block at the foot of the panel.',
      table: { type: { summary: "boolean" } },
    },
    logoText: {
      control: "text",
      description:
        'Organization name in the tooltips of the "download the apps" links.',
      table: { type: { summary: "string" } },
    },
    downloaddesktopUrl: {
      control: "text",
      description:
        "Address behind the Windows, macOS and Linux links. Empty, those three links are not drawn.",
      table: { type: { summary: "string" } },
    },
    officeforandroidUrl: {
      control: "text",
      description:
        "Address behind the Android link. Empty, the link is not drawn.",
      table: { type: { summary: "string" } },
    },
    officeforiosUrl: {
      control: "text",
      description: "Address behind the iOS link. Empty, the link is not drawn.",
      table: { type: { summary: "string" } },
    },
    isAdmin: {
      control: "boolean",
      description:
        "Whether the person is an administrator. With `limitedAccessDevToolsForUsers` it decides whether the developer tools entry is shown.",
      table: { type: { summary: "boolean" } },
    },
    limitedAccessDevToolsForUsers: {
      control: "boolean",
      description:
        "Hides the developer tools entry from anyone who is not an administrator.",
      table: { type: { summary: "boolean" } },
    },
    customSlot: {
      control: false,
      description:
        "Extra content under the body, above the developer tools entry. Its presence also shifts the collapse handle and the developer tools entry.",
    },
    isLiveChatAvailable: {
      control: false,
      description:
        "Whether the live chat is mounted at all. It is also suppressed on a mobile user agent.",
      table: { type: { summary: "boolean" } },
    },
    isShowLiveChat: {
      control: false,
      description:
        'Whether the Zendesk widget is on the page. The script loads the first time this is true; from then on the "Live chat" switch shows and hides the widget through its API.',
      table: { type: { summary: "boolean" } },
    },
    zendeskKey: {
      control: false,
      description:
        "Key of the Zendesk account. The live chat block loads a third-party script with it.",
      table: { type: { summary: "string" } },
    },
    languageBaseName: {
      control: false,
      description: "Locale handed to the Zendesk widget.",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Article>;

type Story = StoryObj<ComponentProps<typeof Article>>;

export default meta;

const catalog = [
  { id: "files", text: "Files", icon: CatalogFolderReactSvgUrl },
  { id: "shared", text: "Shared with me", icon: CatalogSharedReactSvgUrl },
  { id: "recent", text: "Recent files", icon: CatalogRecentReactSvgUrl },
  {
    id: "favorites",
    text: "Favorite files",
    icon: CatalogFavoritesReactSvgUrl,
  },
  { id: "trash", text: "Trash", icon: CatalogTrashReactSvgUrl },
  { id: "rooms", text: "Rooms", icon: CatalogRoomsReactSvgUrl },
  { id: "agents", text: "AI agents", icon: CatalogAiAgentsReactSvgUrl },
];

// The catalog the portal draws in the body, Files open.
const ArticleCatalog = ({
  showText = true,
  labels,
}: {
  showText?: boolean;
  labels?: string[];
}) => (
  <>
    {catalog.map((item, index) => (
      <ArticleItem
        key={item.id}
        id={item.id}
        icon={item.icon}
        text={labels?.[index] ?? item.text}
        showText={showText}
        isActive={item.id === "files"}
        isEndOfBlock={item.id === "trash"}
        linkData={{ path: "", state: {} }}
      />
    ))}
  </>
);

const defaultProps: ArticleProps = {
  showText: true,
  setShowText: fn(),
  articleOpen: true,
  toggleShowText: fn(),
  toggleArticleOpen: fn(),
  setIsMobileArticle: fn(),
  setArticleOpen: fn(),
  hideProfileBlock: false,
  logoText: "",
  isShowLiveChat: false,
  hideAppsBlock: false,
  isLiveChatAvailable: false,
  isAdmin: false,
  currentDeviceType: DeviceType.desktop,
  onLogoClickAction: fn(),
  onProfileClick: fn(),
  withCustomArticleHeader: false,
  isBurgerLoading: false,
  languageBaseName: "en",
  isMobileArticle: false,
  zendeskKey: "your-zendesk-key",
  showBackButton: false,
  navigate: fn(),
  onBack: fn(),
  downloaddesktopUrl: "https://example.com/desktop",
  officeforandroidUrl: "https://example.com/android",
  officeforiosUrl: "https://example.com/ios",
  limitedAccessDevToolsForUsers: false,
  children: [
    <Article.Body key="body">
      <ArticleCatalog />
    </Article.Body>,
  ],
};

// TUser has no optional fields, so the unused ones are filled with blanks.
const mockUser = {
  id: "user-1",
  displayName: "Team member",
  title: "Team member",
  avatarSmall: "",
  access: 0,
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  status: EmployeeStatus.Active,
  activationStatus: EmployeeActivationStatus.NotActivated,
  department: "",
  workFrom: "",
  avatarMax: "",
  avatarMedium: "",
  avatarOriginal: "",
  avatar: "",
  isAdmin: false,
  isRoomAdmin: false,
  isLDAP: false,
  listAdminModules: [],
  isOwner: false,
  isVisitor: false,
  isCollaborator: false,
  mobilePhoneActivationStatus: 0,
  isSSO: false,
  profileUrl: "",
  hasAvatar: false,
  isAnonim: false,
};

const onProfileAction = fn();
const onHelpAction = fn();
const onLogoutAction = fn();

const getActions = () =>
  [
    { key: "profile", label: "Profile", onClick: onProfileAction },
    { key: "help", label: "Help", onClick: onHelpAction },
    { key: "logout", label: "Logout", onClick: onLogoutAction },
  ] as ContextMenuModel[];

const article = (root: HTMLElement) =>
  within(root).getByTestId("article") as HTMLElement;

const bodySlot = (
  <Article.Body key="body">
    <ArticleCatalog />
  </Article.Body>
);

const mainButtonSlot = (
  <Article.MainButton key="main-button">
    <Button primary scale size={ButtonSize.normal} label="New document" />
  </Article.MainButton>
);

const Template = (args: ArticleProps) => (
  <div style={{ height: "600px", position: "relative" }}>
    <Article {...args} />
  </div>
);

// The collapse handle and the close button flip the prop they belong to.
const renderInteractive = (args: ArticleProps) => {
  const [, updateArgs] = useArgs<ArticleProps>();

  return (
    <Template
      {...args}
      toggleShowText={() => updateArgs({ showText: !args.showText })}
      toggleArticleOpen={() => updateArgs({ articleOpen: !args.articleOpen })}
    />
  );
};

const SidebarHeader = ({
  showText,
  toggleShowText,
}: Pick<ArticleProps, "showText" | "toggleShowText">) => {
  const { isBase } = useTheme();
  const logo = getLogoUrl(
    WhiteLabelLogoType.LightSmall,
    !isBase,
    false,
    "",
    true,
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: showText ? "space-between" : "center",
        gap: "8px",
        width: "100%",
      }}
    >
      {showText ? (
        <img
          className="logo-icon_svg"
          src={logo}
          alt="ONLYOFFICE"
          style={{ height: "24px", maxWidth: "130px", minWidth: 0 }}
        />
      ) : null}
      <IconButton
        iconNode={<ArticleHideMenuIcon />}
        size={20}
        isFill={false}
        isStroke
        hoverColor="accent"
        onClick={toggleShowText}
        title={showText ? "Hide menu" : "Show menu"}
        aria-label={showText ? "Hide menu" : "Show menu"}
      />
    </div>
  );
};

// Docs ignores the viewport preset; give the story a window of its own there.
const withFrame =
  (width: number, height: number): Decorator =>
  (Story, context) => {
    if (context.viewMode !== "docs") return <Story />;

    return (
      <iframe
        title={context.name}
        src={`iframe.html?viewMode=story&id=${context.id}`}
        style={{ width, height, border: 0 }}
      />
    );
  };

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    children: [bodySlot],
  },
  beforeEach: () => {
    onHelpAction.mockClear();
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const panel = article(canvasElement);
    await expect(panel).toHaveAttribute("data-show-text", "true");
    await expect(
      within(panel).getByText("Rooms", { selector: ".articleItemText" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("profile_username")).toHaveTextContent(
      "Team member",
    );

    // The developer tools entry navigates to its page.
    await userEvent.click(canvas.getByTestId("dev-tools-bar"));
    await expect(args.navigate).toHaveBeenCalledWith("/developer-tools");

    // The dots open the profile actions.
    await userEvent.click(canvas.getByTestId("profile_user_icon_button"));
    const help = await screen.findByRole("menuitem", { name: "Help" });
    await waitFor(() => expect(help).toBeVisible());
    await userEvent.click(help);
    await expect(onHelpAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The panel as a desktop page shows it: the logo, the body, the developer tools entry, the download links and the profile block. The dots beside the name open the actions menu (`getActions`).",
      },
      source: {
        code: `<Article
  {...panelProps}
  showText
  currentDeviceType={DeviceType.desktop}
  user={user}
  getActions={getActions}
>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithMainButton: Story = {
  name: "With main button",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    withMainButton: true,
    children: [mainButtonSlot, bodySlot],
  },
  play: async ({ canvas }) => {
    // Above the navigation.
    const button = canvas.getByRole("button", { name: "New document" });
    await expect(button.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      canvas
        .getByText("Files", { selector: ".articleItemText" })
        .getBoundingClientRect().top,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**New document** — the page's primary command, kept above the navigation where it is always in reach (`withMainButton`, `Article.MainButton`).",
      },
      source: {
        code: `<Article {...panelProps} withMainButton>
  <Article.MainButton>
    <Button primary scale size={ButtonSize.normal} label="New document" />
  </Article.MainButton>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const CustomHeader: Story = {
  name: "Custom header",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    withCustomArticleHeader: true,
    children: [
      <Article.Header key="header">
        <h3 style={{ margin: 0 }}>Documents</h3>
      </Article.Header>,
      bodySlot,
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Documents" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Documents** — the application's own title in the header row in place of the logo, for a layout that names the panel itself (`withCustomArticleHeader`, `Article.Header`).",
      },
      source: {
        code: `<Article {...panelProps} withCustomArticleHeader>
  <Article.Header>
    <h3>Documents</h3>
  </Article.Header>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithBackButton: Story = {
  name: "With back button",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [bodySlot],
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Back"));
    await expect(args.onBack).toHaveBeenCalledTimes(1);
    await expect(args.navigate).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Back** — a way out of a nested section at the top of the body. It calls `onBack`, or navigates home when there is none (`showBackButton`).",
      },
      source: {
        code: `<Article {...panelProps} showBackButton onBack={goBack}>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const LoadingState: Story = {
  name: "Loading",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    isBurgerLoading: true,
    showArticleLoader: true,
    children: [bodySlot],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("article-header-loader")).toBeVisible();
    await expect(canvas.getByTestId("article-profile-loader")).toBeVisible();
    await expect(canvas.queryByTestId("profile_username")).toBeNull();
    await expect(canvas.queryByTestId("dev-tools-bar")).toBeNull();
    // The body is still rendered.
    await expect(
      canvas.getByText("Files", { selector: ".articleItemText" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Skeletons in place of the logo and the profile block while the page's data arrives, so the panel keeps its shape (`isBurgerLoading`, `showArticleLoader`). The body slot is still rendered.",
      },
      source: {
        code: `<Article {...panelProps} isBurgerLoading showArticleLoader>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithCustomSlot: Story = {
  name: "With custom slot",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    customSlot: <div>Storage: 2 GB of 10 GB</div>,
    children: [bodySlot],
  },
  play: async ({ canvas }) => {
    // Between the body and the developer tools entry.
    const slot = canvas
      .getByText("Storage: 2 GB of 10 GB")
      .getBoundingClientRect();
    await expect(slot.top).toBeGreaterThanOrEqual(
      canvas
        .getByText("Files", { selector: ".articleItemText" })
        .getBoundingClientRect().bottom,
    );
    await expect(slot.bottom).toBeLessThanOrEqual(
      canvas.getByTestId("dev-tools-bar").getBoundingClientRect().top,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Storage: 2 GB of 10 GB** — a notice that belongs to the panel rather than to the navigation (`customSlot`). It sits between the body and the developer tools entry.",
      },
      source: {
        code: `<Article {...panelProps} customSlot={<div>Storage: 2 GB of 10 GB</div>}>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithoutFooterBlocks: Story = {
  name: "Without footer blocks",
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    hideProfileBlock: true,
    hideAppsBlock: true,
    limitedAccessDevToolsForUsers: true,
    children: [bodySlot],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Files", { selector: ".articleItemText" }),
    ).toBeVisible();
    await expect(canvas.queryByTestId("profile_username")).toBeNull();
    await expect(canvas.queryByTestId("dev-tools-bar")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The body with nothing below it, for a page that shows the person and the download links elsewhere. It drops the profile block (`hideProfileBlock`), the download links (`hideAppsBlock`) and, for a non-administrator, the developer tools entry (`limitedAccessDevToolsForUsers`).",
      },
      source: {
        code: `<Article
  {...panelProps}
  hideProfileBlock
  hideAppsBlock
  limitedAccessDevToolsForUsers
  isAdmin={false}
>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const CollapsedOnTablet: Story = {
  name: "Collapsed on a tablet",
  // The catalog follows the column: icons only while it is collapsed.
  render: function Render(args) {
    const [, updateArgs] = useArgs<ArticleProps>();
    const toggleShowText = () => updateArgs({ showText: !args.showText });

    return (
      <Template
        {...args}
        toggleShowText={toggleShowText}
        toggleArticleOpen={() => updateArgs({ articleOpen: !args.articleOpen })}
      >
        {[
          <Article.Header key="header">
            <SidebarHeader
              showText={args.showText}
              toggleShowText={toggleShowText}
            />
          </Article.Header>,
          <Article.Body key="body">
            <ArticleCatalog showText={args.showText} />
          </Article.Body>,
        ]}
      </Template>
    );
  },
  decorators: [withFrame(834, 640)],
  globals: { viewport: { value: "tablet", isRotated: false } },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showText: false,
    currentDeviceType: DeviceType.tablet,
    isMobileArticle: true,
    withCustomArticleHeader: true,
    children: [bodySlot],
  },
  play: async ({ canvas, canvasElement }) => {
    // Collapsed: no text, the developer tools entry as an icon only.
    await expect(article(canvasElement)).toHaveAttribute(
      "data-show-text",
      "false",
    );
    await expect(
      canvas.queryByText("Rooms", { selector: ".articleItemText" }),
    ).toBeNull();
    await expect(canvas.getByTestId("dev-tools-bar")).toHaveAttribute(
      "data-icon-only",
      "true",
    );
    // The header holds only the toggle, no logo.
    await expect(
      within(article(canvasElement)).getAllByTestId("icon-button")[0],
    ).toBeVisible();
    await expect(canvas.queryByAltText("ONLYOFFICE Apps")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 60px column of icons in a tablet-width window, which leaves the page most of the screen (`showText` off). The header is the page's own, as in the ONLYOFFICE Apps client (`withCustomArticleHeader`). Its toggle expands the column and shows the logo beside it (`toggleShowText`).",
      },
      source: {
        code: `const [showText, setShowText] = useState(false);
const toggleShowText = () => setShowText((value) => !value);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.tablet}
  showText={showText}
  toggleShowText={toggleShowText}
  withCustomArticleHeader
>
  <Article.Header>
    {showText ? <img src={logoUrl} alt="ONLYOFFICE" /> : null}
    <IconButton
      iconNode={<ArticleHideMenuIcon />}
      size={20}
      isFill={false}
      isStroke
      onClick={toggleShowText}
    />
  </Article.Header>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const OnPhone: Story = {
  name: "On a phone",
  render: renderInteractive,
  decorators: [withFrame(414, 640)],
  globals: { viewport: { value: "mobile2", isRotated: false } },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    currentDeviceType: DeviceType.mobile,
    isMobileArticle: true,
    children: [bodySlot],
  },
  play: async ({ canvas, canvasElement }) => {
    // Portalled over a backdrop, without the profile block.
    await expect(
      canvasElement.querySelector('[data-testid="article"]'),
    ).toBeNull();
    await expect(screen.getByTestId("article")).toHaveAttribute(
      "data-open",
      "true",
    );
    await expect(
      screen.getAllByTestId("backdrop").some((b) => b.checkVisibility()),
    ).toBe(true);
    await expect(canvas.queryByTestId("profile_username")).toBeNull();
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The panel on a phone: it covers the page below a 64px top strip, over a backdrop, and drops the profile block. The cross in its header and a tap on the backdrop both call `toggleArticleOpen`.",
      },
      source: {
        code: `const [articleOpen, setArticleOpen] = useState(true);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.mobile}
  articleOpen={articleOpen}
  toggleArticleOpen={() => setArticleOpen((value) => !value)}
  setArticleOpen={setArticleOpen}
>
  <Article.Body>
    {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
  </Article.Body>
</Article>`,
      },
    },
  },
};

const rtlLabels = [
  "الملفات",
  "تمت مشاركتها معي",
  "الملفات الأخيرة",
  "الملفات المفضلة",
  "سلة المهملات",
  "الغرف",
  "وكلاء الذكاء الاصطناعي",
];

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas, canvasElement }) => {
    // The border is on the left edge; the dots left of the name.
    const panel = getComputedStyle(article(canvasElement));
    await expect(panel.borderLeftWidth).toBe("1px");
    await expect(panel.borderRightWidth).toBe("0px");
    const name = canvas.getByTestId("profile_username").getBoundingClientRect();
    const dots = canvas
      .getByTestId("profile_user_icon_button")
      .getBoundingClientRect();
    await expect(dots.right).toBeLessThanOrEqual(name.left + 1);
  },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [
      <Article.Body key="body">
        <ArticleCatalog labels={rtlLabels} />
      </Article.Body>,
    ],
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "626px" },
      description: {
        story:
          "The panel in a right-to-left interface. Its border moves to the left edge, the back arrow points right, and the dots button sits on the left of the profile block.",
      },
      source: {
        code: `<div dir="rtl">
  <Article {...panelProps} showBackButton>
    <Article.Body>
      {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
    </Article.Body>
  </Article>
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const isPhone = useWindowDevice() === DeviceType.mobile;

  return (
    <div
      id={isPhone ? "root" : undefined}
      style={
        {
          display: "flex",
          gap: "32px",
          // === Article — sidebar background and borders ===
          "--article-bg": "light-dark(#e6f3fb, #16303e)",
          "--article-border": "1px solid #0082c9",
          // === Article — profile section ===
          "--article-profile-bg": "light-dark(#cce5f6, #1f4a61)",
          "--article-profile-border": "1px solid #0082c9",
          // === Article — back button ===
          "--article-back-color": "#0082c9",
        } as CSSProperties
      }
    >
      {isPhone ? (
        <Article
          {...defaultProps}
          user={mockUser}
          getActions={getActions}
          currentDeviceType={DeviceType.mobile}
          isMobileArticle
          showBackButton
          articleOpen
        />
      ) : (
        <>
          <div style={{ height: "600px", position: "relative" }}>
            <Article
              {...defaultProps}
              user={mockUser}
              getActions={getActions}
            />
          </div>
          <div style={{ height: "600px", position: "relative" }}>
            <Article
              {...defaultProps}
              user={mockUser}
              getActions={getActions}
              showBackButton
            />
          </div>
        </>
      )}
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvasElement }) => {
    const [first] = within(canvasElement).getAllByTestId("article");
    const panel = getComputedStyle(first);
    await expect(panel.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(panel.borderRightColor).toBe("rgb(0, 130, 201)");
  },
  parameters: {
    layout: "fullscreen",
    noPadding: true,
    docs: {
      description: {
        story:
          "Five of the panel's variables set on one wrapper. The first panel shows the background, the borders and the profile block; the second adds the back button for `--article-back-color`. A phone-width window shows one panel as the mobile sheet, which has no profile block.",
      },
      source: {
        code: `<div style={{ "--article-bg": "light-dark(#e6f3fb, #16303e)", "--article-border": "1px solid #0082c9", "--article-back-color": "#0082c9" }}>
  <Article {...panelProps} showBackButton>
    <Article.Body>
      {catalog.map((item) => <ArticleItem key={item.id} {...item} showText linkData={item.linkData} />)}
    </Article.Body>
  </Article>
</div>`,
      },
    },
  },
};
