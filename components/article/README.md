# Article

The sidebar (article) panel component used as the main navigation area of the application. Contains the header, menu items, profile section, apps block, and optional integrations like Zendesk live chat.

## Usage

```tsx
import { Article } from "@docspace/ui-kit/components/article";

<Article
  showText={true}
  currentDeviceType={DeviceType.desktop}
  articleOpen={true}
  toggleArticleOpen={toggleArticleOpen}
  setShowText={setShowText}
  setIsMobileArticle={setIsMobileArticle}
  setArticleOpen={setArticleOpen}
  burgerLogo="/logo.svg"
  // ...other required props
>
  {[<MainMenu />, <BodyContent />]}
</Article>
```

## Features

- **Responsive layout**: Adapts to desktop, tablet, and mobile device types
- **Collapsible sidebar**: Toggle between expanded (with text) and collapsed (icons only) states
- **Profile section**: Displays user avatar and context menu actions
- **Apps block**: Links to desktop and mobile applications
- **DevTools bar**: Optional developer tools panel for admins
- **Zendesk integration**: Built-in live chat widget support
- **Skeleton loading**: Shows skeleton placeholders while content is loading
- **Hide menu button**: Allows users to collapse/expand the sidebar

## Sub-components

- **Article.Header** — Logo and burger menu button
- **Article.Item** — Individual navigation menu item
- **Article.Profile** — User profile section at the bottom
- **Article.Apps** — Download links for desktop/mobile apps
- **Article.HideMenuButton** — Toggle button for collapsing the sidebar
- **Article.DevToolsBar** — Developer tools panel
- **Article.Zendesk** — Zendesk live chat integration

## Properties

| Prop                    | Type                          | Default | Description                                          |
|-------------------------|-------------------------------|---------|------------------------------------------------------|
| `children`              | `JSX.Element[]`               | —       | Child elements rendered inside the article body      |
| `showText`              | `boolean`                     | —       | Whether to show text labels alongside icons          |
| `setShowText`           | `(value: boolean) => void`    | —       | Callback to toggle text visibility                   |
| `articleOpen`           | `boolean`                     | —       | Whether the article panel is open                    |
| `setArticleOpen`        | `(value: boolean) => void`    | —       | Callback to toggle article open state                |
| `toggleArticleOpen`     | `() => void`                  | —       | Toggle function for article open/close               |
| `currentDeviceType`     | `DeviceType`                  | —       | Current device type (desktop, tablet, mobile)        |
| `showArticleLoader`     | `boolean`                     | —       | Shows skeleton loader instead of content             |
| `isBurgerLoading`       | `boolean`                     | —       | Shows loading state on the burger menu button        |
| `hideAppsBlock`         | `boolean`                     | —       | Hides the apps download section                      |
| `isAdmin`               | `boolean`                     | —       | Whether the current user is an admin                 |
| `withSendAgain`         | `boolean`                     | —       | Shows "send again" confirmation email option         |
| `mainBarVisible`        | `boolean`                     | —       | Controls main bar visibility                         |
