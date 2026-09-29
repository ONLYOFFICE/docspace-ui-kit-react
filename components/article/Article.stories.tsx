import React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import LightSmallLogoUrl from "../../assets/logo/lightsmall.svg?url";
import {
  DeviceType,
  EmployeeActivationStatus,
  EmployeeStatus,
} from "../../enums";
import { Button, ButtonSize } from "../button";
import type { ContextMenuModel } from "../context-menu";

import Article from ".";
import type { ArticleProps } from "./Article.types";

const meta = {
  title: "UI/Layout/Article",
  component: Article,
  parameters: {
    docs: {
      description: {
        component: `Article is the left side panel of an application layout: a header, an optional main action, a scrolling navigation body and the signed-in person's profile block at its foot.

### Features

- **Compound Components**: Takes its header, main action and body as \`Article.Header\`, \`Article.MainButton\` and \`Article.Body\` slots and places their contents in fixed spots of the panel
- **User Profile**: Shows the person's avatar and name at the foot of the panel, with a menu of actions behind the dots button
- **Responsive**: Renders a fixed column on desktop, a sidebar on tablet and a full-width overlay with a backdrop on a phone, as \`currentDeviceType\` says; nothing measures the window
- **Collapsible**: Narrows to a column of icons while \`showText\` is off; on tablet the handle at the foot calls \`toggleShowText\`, and the host flips the prop
- **Live Chat**: Loads a Zendesk chat bubble when \`isLiveChatAvailable\` is set, except in mobile browsers
- **Apps Block**: Lists download links for the desktop and mobile applications above the profile block, removable with \`hideAppsBlock\`
- **Developer Tools Entry**: Links to the developer tools page, hidden from guests and, with \`limitedAccessDevToolsForUsers\`, from anyone who is not an administrator
- **Loading State**: Swaps the logo, the body extras and the profile block for skeletons while \`isBurgerLoading\` and \`showArticleLoader\` are set

### Usage

\`\`\`tsx
import Article from "@onlyoffice/apps-ui-kit/components/article";

// panelProps: the remaining required props — callbacks, the person, the app links
<Article
  {...panelProps}
  currentDeviceType={DeviceType.desktop}
  withCustomArticleHeader
  withMainButton
>
  <Article.Header>
    <h2>My App</h2>
  </Article.Header>
  <Article.MainButton>
    <button>Create</button>
  </Article.MainButton>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>
\`\`\`

\`\`\`tsx
const [showText, setShowText] = useState(true);

<Article
  {...panelProps}
  showText={showText}
  setShowText={setShowText}
  toggleShowText={() => setShowText((value) => !value)}
  currentDeviceType={DeviceType.tablet}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>
\`\`\`

\`\`\`tsx
<Article {...panelProps} isBurgerLoading showArticleLoader>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>
\`\`\``,
      },
    },
  },
  decorators: [
    // No portal serves logo.ashx here; swap every logo for a bundled one.
    (Story) => {
      React.useEffect(() => {
        const replaceLogos = () => {
          const images = document.querySelectorAll('img[src*="logo.ashx"]');
          images.forEach((img) => {
            (img as HTMLImageElement).src = LightSmallLogoUrl;
          });
        };

        replaceLogos();
        const observer = new MutationObserver(replaceLogos);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
      }, []);

      return <Story />;
    },
  ],
  argTypes: {
    showText: {
      control: "boolean",
      description:
        "Shows text labels alongside icons; off, the panel narrows to a 60px column of icons on tablet. The component also writes its own choice back through `setShowText` on mount and on every device change",
      table: { type: { summary: "boolean" } },
    },
    setShowText: {
      control: false,
      description:
        "Called on mount and on every device change with the width the component has decided on: `true` on desktop and on a phone; on tablet `false`, and only when the `showArticle` entry in local storage holds `false`",
    },
    toggleShowText: {
      control: false,
      description:
        "Called by the collapse handle at the foot of the panel on tablet; the host is expected to flip `showText`",
    },
    articleOpen: {
      control: "boolean",
      description:
        "Whether the panel is shown on a phone, where it covers the page over a backdrop. On desktop and tablet the panel is always shown",
      table: { type: { summary: "boolean" } },
    },
    toggleArticleOpen: {
      control: false,
      description:
        "Called on a phone by the close button of the header, the backdrop, the back button and the developer tools entry; the host is expected to flip `articleOpen`",
    },
    setArticleOpen: {
      control: false,
      description:
        "Called with `false` when the browser goes back on a phone, to close the panel",
    },
    isMobileArticle: {
      control: "boolean",
      description:
        "Removes the padding around the main action. The component writes its own value back through `setIsMobileArticle` on mount and on every device change",
      table: { type: { summary: "boolean" } },
    },
    setIsMobileArticle: {
      control: false,
      description:
        "Called on mount and on every device change: `true` on tablet and phone, `false` on desktop",
    },
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description:
        "Which layout to render: a fixed column on `desktop`, a collapsible sidebar on `tablet`, a full-width overlay on `mobile`. The breakpoints of the stylesheet still follow the window width",
      table: { type: { summary: "DeviceType" } },
    },
    children: {
      control: false,
      description:
        "The slots, as an array of `Article.Header`, `Article.MainButton` and `Article.Body`; any other element is dropped",
    },
    withCustomArticleHeader: {
      control: "boolean",
      description:
        "Shows the contents of `Article.Header` in the header row instead of the logo",
      table: { type: { summary: "boolean" } },
    },
    withMainButton: {
      control: "boolean",
      description:
        "Shows the contents of `Article.MainButton` above the body on desktop and tablet; on a phone the slot is shown below the panel without it",
      table: { defaultValue: { summary: "false" } },
    },
    onLogoClickAction: {
      control: false,
      description:
        "Called when the logo or the back button is clicked, before the panel navigates home",
    },
    showBackButton: {
      control: "boolean",
      description:
        "Shows a back button at the top of the body on desktop and tablet, and in the header on a phone",
      table: { type: { summary: "boolean" } },
    },
    onBack: {
      control: false,
      description: "Called by the back button instead of navigating home",
    },
    navigate: {
      control: false,
      description:
        "Router push used by the logo, the back button and the developer tools entry; without it they reload the page at the new address",
    },
    isBurgerLoading: {
      control: "boolean",
      description: "Shows skeletons in place of the logo and the back button",
      table: { type: { summary: "boolean" } },
    },
    showArticleLoader: {
      control: "boolean",
      description:
        "Replaces the profile block with a skeleton and removes the custom slot, the developer tools entry, the apps block, the live chat and the collapse handle; the header and the slots stay",
      table: { defaultValue: { summary: "false" } },
    },
    user: {
      control: false,
      description:
        "The signed-in person, whose avatar and name the profile block shows; a guest (`isVisitor`) never sees the developer tools entry",
    },
    getActions: {
      control: false,
      description:
        "Returns the items of the menu opened by the profile block's dots button, and by its avatar on a collapsed tablet panel",
    },
    onProfileClick: {
      control: false,
      description:
        "Called when the person's name or avatar in the profile block is clicked, with the original event wrapped in an object",
    },
    hideProfileBlock: {
      control: "boolean",
      description:
        "Removes the profile block at the foot of the panel, and moves the collapse handle down in its place",
      table: { type: { summary: "boolean" } },
    },
    hideAppsBlock: {
      control: "boolean",
      description: "Removes the block of application download links",
      table: { type: { summary: "boolean" } },
    },
    logoText: {
      control: "text",
      description:
        "Organization name used in the tooltips of the application download links",
      table: { type: { summary: "string" } },
    },
    downloaddesktopUrl: {
      control: "text",
      description: "Address behind the Windows, macOS and Linux download links",
      table: { type: { summary: "string" } },
    },
    officeforandroidUrl: {
      control: "text",
      description: "Address behind the Android download link",
      table: { type: { summary: "string" } },
    },
    officeforiosUrl: {
      control: "text",
      description: "Address behind the iOS download link",
      table: { type: { summary: "string" } },
    },
    isAdmin: {
      control: "boolean",
      description:
        "Whether the person is an administrator; together with `limitedAccessDevToolsForUsers` it decides whether the developer tools entry is shown",
      table: { type: { summary: "boolean" } },
    },
    limitedAccessDevToolsForUsers: {
      control: "boolean",
      description:
        "Hides the developer tools entry from anyone who is not an administrator",
      table: { type: { summary: "boolean" } },
    },
    customSlot: {
      control: false,
      description:
        "Extra content between the body and the developer tools entry",
    },
    mainBarVisible: {
      control: "boolean",
      description:
        "Whether a top bar with the id `main-bar` is on screen. The component measures it on every resize and then does not use the result, so nothing on screen changes",
      table: { type: { summary: "boolean" } },
    },
    isLiveChatAvailable: {
      control: false,
      description:
        "Allows the live chat bubble, which loads a third-party Zendesk script; it is never shown in a mobile browser",
      table: { type: { summary: "boolean" } },
    },
    isShowLiveChat: {
      control: false,
      description: "Whether the live chat bubble is expanded",
      table: { type: { summary: "boolean" } },
    },
    zendeskKey: {
      control: false,
      description: "Key of the Zendesk account the live chat connects to",
      table: { type: { summary: "string" } },
    },
    zendeskEmail: {
      control: false,
      description: "Address the live chat pre-fills",
      table: { type: { summary: "string" } },
    },
    chatDisplayName: {
      control: false,
      description: "Name the live chat shows for the visitor",
      table: { type: { summary: "string" } },
    },
    languageBaseName: {
      control: false,
      description: "Locale handed to the live chat",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Article>;

type Story = StoryObj<ComponentProps<typeof Article>>;

export default meta;

const defaultProps: ArticleProps = {
  showText: true,
  setShowText: fn(),
  articleOpen: true,
  toggleShowText: fn(),
  toggleArticleOpen: fn(),
  setIsMobileArticle: fn(),
  setArticleOpen: fn(),
  withSendAgain: false,
  mainBarVisible: true,
  hideProfileBlock: false,
  logoText: "",
  isShowLiveChat: false,
  hideAppsBlock: false,
  withCustomSlot: false,
  isLiveChatAvailable: false,
  isAdmin: false,
  currentDeviceType: DeviceType.desktop,
  onLogoClickAction: fn(),
  onProfileClick: fn(),
  withCustomArticleHeader: false,
  isBurgerLoading: false,
  languageBaseName: "en",
  zendeskEmail: "support@example.com",
  chatDisplayName: "Support Chat",
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
      <div>Navigation items</div>
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

const getActions = () =>
  [
    { key: "profile", label: "Profile", onClick: fn() },
    { key: "help", label: "Help", onClick: fn() },
    { key: "logout", label: "Logout", onClick: fn() },
  ] as ContextMenuModel[];

const bodySlot = (
  <Article.Body key="body">
    <div>Navigation items</div>
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
  parameters: {
    docs: {
      description: {
        story:
          "The panel as a desktop page shows it: the logo, the body, the developer tools entry, the download links and the profile block. Click the dots beside the name to open the actions menu (`getActions`), and change any other prop live in the Controls panel below.",
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithMainButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    withMainButton: true,
    children: [mainButtonSlot, bodySlot],
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const CustomHeader: Story = {
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithBackButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [bodySlot],
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    isBurgerLoading: true,
    showArticleLoader: true,
    children: [bodySlot],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Skeletons in place of the logo and the profile block while the page's data is still arriving, so the panel keeps its shape; the body slot is still rendered (`isBurgerLoading`, `showArticleLoader`).",
      },
      source: {
        code: `<Article {...panelProps} isBurgerLoading showArticleLoader>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithCustomSlot: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    customSlot: <div>Storage: 2 GB of 10 GB</div>,
    children: [bodySlot],
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Storage: 2 GB of 10 GB** — a notice that belongs to the panel rather than to the navigation, placed between the body and the developer tools entry (`customSlot`).",
      },
      source: {
        code: `<Article {...panelProps} customSlot={<div>Storage: 2 GB of 10 GB</div>}>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const WithoutFooterBlocks: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    hideProfileBlock: true,
    hideAppsBlock: true,
    limitedAccessDevToolsForUsers: true,
    children: [bodySlot],
  },
  parameters: {
    docs: {
      description: {
        story:
          "The body with nothing below it, for a page that shows the person and the download links elsewhere: no profile block (`hideProfileBlock`), no download links (`hideAppsBlock`) and no developer tools entry for a person who is not an administrator (`limitedAccessDevToolsForUsers`).",
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const CollapsedOnTablet: Story = {
  // Plain text has no icon form, so the body keeps it for the expanded column.
  render: (args) =>
    renderInteractive({
      ...args,
      children: [
        <Article.Body key="body">
          <div>{args.showText ? "Navigation items" : null}</div>
        </Article.Body>,
      ],
    }),
  decorators: [withFrame(834, 640)],
  globals: { viewport: { value: "tablet", isRotated: false } },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showText: false,
    currentDeviceType: DeviceType.tablet,
    isMobileArticle: true,
    children: [bodySlot],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 60px column of icons in a tablet-width window, which leaves the page most of the screen (`showText` off). Click the handle at the foot to expand it and again to collapse it (`toggleShowText`).",
      },
      source: {
        code: `const [showText, setShowText] = useState(false);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.tablet}
  showText={showText}
  toggleShowText={() => setShowText((value) => !value)}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
      },
    },
  },
};

export const OnPhone: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "The panel on a phone: it covers the page below a 64px top strip, over a backdrop, and drops the profile block. Close it with the cross in its header or a tap on the backdrop (`toggleArticleOpen`); switch `articleOpen` in the Controls panel of the story canvas to open it again.",
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
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`,
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
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [
      <Article.Body key="body">
        <div>عناصر التنقل</div>
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
          "The panel in a right-to-left interface: its border moves to the left edge, the back arrow points right and the dots button sits on the left of the profile block.",
      },
      source: {
        code: `<div dir="rtl">
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>عناصر التنقل</nav>
    </Article.Body>
  </Article>
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => (
  <div
    style={
      {
        display: "flex",
        gap: "32px",
        // === Article — sidebar background and borders ===
        "--article-bg": "#e6f3fb",
        "--article-border": "1px solid #0082c9",
        // === Article — profile section ===
        "--article-profile-bg": "#cce5f6",
        "--article-profile-border": "1px solid #0082c9",
        // === Article — back button ===
        "--article-back-color": "#0082c9",
      } as CSSProperties
    }
  >
    <div style={{ height: "600px", position: "relative" }}>
      <Article {...defaultProps} user={mockUser} getActions={getActions} />
    </div>
    <div style={{ height: "600px", position: "relative" }}>
      <Article
        {...defaultProps}
        user={mockUser}
        getActions={getActions}
        showBackButton
      />
    </div>
  </div>
);

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

The first panel shows the background, the borders and the profile block; the second adds the back button (\`showBackButton\`) for \`--article-back-color\`.

**Article — sidebar**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-bg\` | Sidebar background color, also behind the collapse handle | theme-based |
| \`--article-border\` | Sidebar trailing border, repeated on the profile block | theme-based |
| \`--article-header-border\` | Header bottom border — only in a phone-width window while \`currentDeviceType\` is not \`mobile\`, because the phone layout renders a header of its own | theme-based |
| \`--article-width\` | Sidebar width on desktop; the profile block keeps its own 251px, so a wider value leaves a gap beside it | \`252px\` |
| \`--article-sidebar-width\` | Sidebar width in a tablet-width window (600–1024px) while \`showText\` is on | \`243px\` |
| \`--article-sidebar-collapsed-width\` | Sidebar width in a tablet-width window while \`showText\` is off | \`60px\` |

**Article — profile section**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-profile-bg\` | Profile block background | theme-based |
| \`--article-profile-border\` | Profile block top border | theme-based |

**Article — back button**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-back-color\` | Back button label color | theme-based |`,
      },
      source: {
        code: `<div style={{ "--article-bg": "#e6f3fb", "--article-border": "1px solid #0082c9", "--article-back-color": "#0082c9" }}>
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>Navigation items</nav>
    </Article.Body>
  </Article>
</div>`,
      },
    },
  },
};
