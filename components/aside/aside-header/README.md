# AsideHeader

Header component for aside panels with optional back/close buttons, custom icons, and loading states.

## Usage

```tsx
import { AsideHeader } from "@docspace/ui-kit/components/aside";

<AsideHeader
  header="Settings"
  isCloseable
  onCloseClick={() => console.log("Close")}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `string \| ReactNode` | - | Header content |
| `headerIcons` | `HeaderIcon[]` | `[]` | Array of icons to display |
| `headerComponent` | `ReactNode` | - | Additional component to render |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `withoutBorder` | `boolean` | `false` | Hide bottom border |
| `headerHeight` | `string` | `"53px"` | Custom header height |
| `isCloseable` | `boolean` | `false` | Show close button |
| `onCloseClick` | `() => void` | - | Close button handler |
| `isBackButton` | `boolean` | `false` | Show back button |
| `onBackClick` | `() => void` | - | Back button handler |
| `className` | `string` | - | Additional CSS class |
| `id` | `string` | - | HTML id attribute |
| `style` | `CSSProperties` | - | Inline styles |

### HeaderIcon Type

```ts
type HeaderIcon = {
  key: string;
  url: string;
  onClick: () => void;
};
```

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--aside-header-text-color` | `#333333` | `#ffffff` | Header text color |
| `--aside-header-border-color` | `#eceef1` | `#474747` | Bottom border color |
| `--aside-header-custom-height` | `53px` | `53px` | Custom header height |

## Examples

### With Back Button

```tsx
<AsideHeader
  header="Details"
  isBackButton
  onBackClick={() => navigate(-1)}
  isCloseable
  onCloseClick={handleClose}
/>
```

### With Custom Icons

```tsx
<AsideHeader
  header="Document"
  headerIcons={[
    { key: "settings", url: "/icons/settings.svg", onClick: handleSettings },
    { key: "info", url: "/icons/info.svg", onClick: handleInfo },
  ]}
  isCloseable
  onCloseClick={handleClose}
/>
```

### Loading State

```tsx
<AsideHeader isLoading isCloseable onCloseClick={handleClose} />
```

### Custom Height

```tsx
<AsideHeader header="Tall Header" headerHeight="70px" isCloseable onCloseClick={handleClose} />
```
