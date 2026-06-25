# Aside

Sliding panel component for displaying side content like settings, details, or forms.

## Usage

```tsx
import { Aside } from "@docspace/ui-kit/components/aside";

const [visible, setVisible] = useState(false);

<Aside visible={visible} onClose={() => setVisible(false)}>
  <div>Panel content</div>
</Aside>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Controls panel visibility |
| `onClose` | `() => void` | - | Callback when panel closes |
| `scale` | `boolean` | `false` | Full-width scaling mode |
| `zIndex` | `number` | `400` | CSS z-index value |
| `withoutHeader` | `boolean` | `false` | Hide the header section |
| `withoutBodyScroll` | `boolean` | `false` | Disable body scroll when open |
| `className` | `string` | - | Additional CSS class |
| `children` | `ReactNode` | - | Panel content |

Additionally accepts all [AsideHeader](./aside-header/README.md) props when `withoutHeader` is false.

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--aside-bg-color` | `#ffffff` | `#333333` | Panel background color |

## Examples

### Basic

```tsx
<Aside visible={true} onClose={() => setVisible(false)}>
  <div>Content here</div>
</Aside>
```

### With Custom Header

```tsx
<Aside
  visible={true}
  header="Settings"
  headerIcons={[
    { key: "help", url: "/icons/help.svg", onClick: showHelp },
  ]}
  onClose={() => setVisible(false)}
>
  <div>Settings content</div>
</Aside>
```

### Without Header

```tsx
<Aside visible={true} withoutHeader onClose={() => setVisible(false)}>
  <div>Custom content with no header</div>
</Aside>
```

### Full Width (Scaled)

```tsx
<Aside visible={true} scale onClose={() => setVisible(false)}>
  <div>Full-width panel content</div>
</Aside>
```

### With Back Navigation

```tsx
<Aside
  visible={true}
  header="Details"
  isBackButton
  onBackClick={() => goBack()}
  onClose={() => setVisible(false)}
>
  <div>Detail content</div>
</Aside>
```
