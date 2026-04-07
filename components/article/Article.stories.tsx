// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import LightSmallLogoUrl from "../../assets/logo/lightsmall.svg?url";
import {
  DeviceType,
  EmployeeActivationStatus,
  EmployeeStatus,
} from "../../enums";
import type { ContextMenuModel } from "../context-menu";

import Article from ".";
import type { ArticleProps } from "./Article.types";

const meta = {
  title: "UI/Layout/Article",
  component: Article,
  parameters: {
    docs: {
      description: {
        component: `Article is a sidebar panel displaying navigation menus, user profile, and action buttons.

### Features

- **Compound Components**: Header, MainButton, and Body sub-components
- **User Profile**: Displays user avatar, name, and context menu actions
- **Responsive**: Adapts to desktop, tablet, and mobile device types
- **Collapsible**: Toggle text visibility to show icons only
- **Live Chat**: Optional Zendesk live chat integration
- **Apps Block**: Links to desktop and mobile applications

### Usage

\`\`\`tsx
import Article from "@docspace/ui-kit/components/article";

<Article showText articleOpen currentDeviceType={DeviceType.desktop}>
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
\`\`\``,
      },
    },
  },
  decorators: [
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
      description: "Shows text labels alongside icons",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    articleOpen: {
      control: "boolean",
      description: "Controls whether the article panel is open",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    hideProfileBlock: {
      control: "boolean",
      description: "Hides the user profile section",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideAppsBlock: {
      control: "boolean",
      description: "Hides the apps download section",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAdmin: {
      control: "boolean",
      description: "Whether the current user is an admin",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description: "Current device type for responsive layout",
      table: {
        defaultValue: { summary: "desktop" },
      },
    },
  },
} satisfies Meta<typeof Article>;

type Story = StoryObj<ComponentProps<typeof Article>>;

export default meta;

const noop = () => {};

const defaultProps: ArticleProps = {
  showText: true,
  setShowText: noop,
  articleOpen: true,
  toggleShowText: noop,
  toggleArticleOpen: noop,
  setIsMobileArticle: noop,
  setArticleOpen: noop,
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
  onLogoClickAction: noop,
  onProfileClick: noop,
  withCustomArticleHeader: false,
  isBurgerLoading: false,
  languageBaseName: "en",
  zendeskEmail: "support@example.com",
  chatDisplayName: "Support Chat",
  isMobileArticle: false,
  zendeskKey: "your-zendesk-key",
  showProgress: false,
  showBackButton: false,
  navigate: noop,
  downloaddesktopUrl: "https://example.com/desktop",
  officeforandroidUrl: "https://example.com/android",
  officeforiosUrl: "https://example.com/ios",
  limitedAccessDevToolsForUsers: false,
  children: [
    <Article.Header key="header">
      <h2>Article Header</h2>
    </Article.Header>,
    <Article.MainButton key="main-button">
      <button type="button">Main Action</button>
    </Article.MainButton>,
    <Article.Body key="body">
      <div>Article Content</div>
    </Article.Body>,
  ],
};

const mockUser = {
  id: "user-1",
  displayName: "John Smith",
  title: "Manager",
  avatarSmall: "https://via.placeholder.com/32",
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

const Template = (args: ArticleProps) => (
  <div style={{ height: "600px", position: "relative" }}>
    <Article {...args} />
  </div>
);

const CssCustomizationTemplate = () => (
  <div
    style={
      {
        height: "600px",
        position: "relative",
        // === Article — sidebar background and borders ===
        "--article-bg": "#e6f3fb",
        "--article-border": "1px solid #0082c9",
        "--article-header-border": "1px solid #0082c9",
        "--article-logo-color": "#0082c9",
        // === Article — profile section ===
        "--article-profile-bg": "#cce5f6",
        "--article-profile-border": "1px solid #0082c9",
        // === Article — back button ===
        "--article-back-color": "#0082c9",
        // === Article — sidebar width ===
        "--article-width": "260px",
      } as CSSProperties
    }
  >
    <Article
      {...defaultProps}
      user={mockUser}
      getActions={() =>
        [
          { key: "profile", label: "Profile", onClick: () => {} },
          { key: "logout", label: "Logout", onClick: () => {} },
        ] as ContextMenuModel[]
      }
    >
      <Article.Header key="header">
        <h2>Sidebar</h2>
      </Article.Header>
      <Article.Body key="body">
        <div>Navigation items</div>
      </Article.Body>
    </Article>
  </div>
);

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**Article — sidebar**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-bg\` | Sidebar background color | theme-based |
| \`--article-border\` | Sidebar right border | theme-based |
| \`--article-header-border\` | Header bottom border (mobile) | theme-based |
| \`--article-logo-color\` | Logo path fill color | theme-based |
| \`--article-width\` | Sidebar width (desktop) | \`252px\` |
| \`--article-sidebar-width\` | Sidebar width (tablet) | \`243px\` |
| \`--article-sidebar-collapsed-width\` | Collapsed sidebar width (tablet) | \`60px\` |

**Article — profile section**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-profile-bg\` | Profile block background | theme-based |
| \`--article-profile-border\` | Profile block top border | theme-based |

**Article — back button**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-back-color\` | Back button text/icon color | theme-based |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions: () =>
      [
        { key: "profile", label: "Profile", onClick: noop },
        { key: "help", label: "Help", onClick: noop },
        { key: "logout", label: "Logout", onClick: noop },
      ] as ContextMenuModel[],
    children: [
      <Article.Header key="header">
        <h2>Article with Context Menu</h2>
      </Article.Header>,
      <Article.Body key="body">
        <div>Content with available user context menu</div>
      </Article.Body>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default Article sidebar with user profile, header, and body content. The profile section includes a context menu with actions.",
      },
      source: {
        code: `<Article showText articleOpen currentDeviceType={DeviceType.desktop} user={user} getActions={getActions}>
  <Article.Header>
    <h2>Article Header</h2>
  </Article.Header>
  <Article.Body>
    <div>Content</div>
  </Article.Body>
</Article>`,
      },
    },
  },
};
