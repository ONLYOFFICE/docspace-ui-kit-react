# RowContent

Layout helper for the `Row` component. It arranges nested elements into a main section (title + icons) and multiple side sections, adapting to tablet layouts by turning the side sections into a stacked summary.

## Import

```ts
import { RowContent } from "@docspace/ui-kit/components/rows";
```

## Usage

```tsx
<RowContent>
  <Link type="page" title="Acme Inc." isBold fontSize="15px">
    Acme Inc.
  </Link>
  <>
    <SendClockReactSvg data-size={IconSizeType.small} />
    <CatalogSpamReactSvg data-size={IconSizeType.small} />
  </>
  <Link containerWidth="140px" type="action" title="Owner">
    Owner
  </Link>
  <Link containerWidth="200px" type="page" title="owner@acme.com">
    owner@acme.com
  </Link>
</RowContent>
```

### Custom side layout

```tsx
<RowContent disableSideInfo sideColor="#A3A9AE" sectionWidth={420}>
  <Text containerWidth="200px" title="Marketing" truncate>
    Marketing
  </Text>
  <Badge type="warning">Pending</Badge>
  <Link containerWidth="180px" type="page" title="+1 202 555 0142">
    +1 202 555 0142
  </Link>
</RowContent>
```

## Layout rules

1. `children[0]` is treated as the **main title** block.
2. `children[1]` is rendered next to the title as the **icon slot** (optional).
3. Further children become **side sections**; each may define `containerWidth` / `containerMinWidth` props that RowContent forwards to the surrounding wrapper.
4. Unless `disableSideInfo` is set, a condensed side-info summary is generated for tablet view by calling `getSideInfo`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactElement[]` | – | Elements to arrange across the main and side containers. Side elements can pass `containerWidth` / `containerMinWidth` props. |
| `className` | `string` | – | Custom class for the root wrapper. |
| `disableSideInfo` | `boolean` | `false` | Hides the auto-generated tablet-side summary. |
| `id` | `string` | – | DOM id for the wrapper. |
| `onClick` | `() => void` | – | Click handler applied to the root container. |
| `sideColor` | `string` | – | Overrides the color of the tablet side-info summary. |
| `style` | `React.CSSProperties` | – | Inline styles for the root wrapper. |
| `sectionWidth` | `number` | – | Adds a fixed width modifier for the main section. |
| `convertSideInfo` | `boolean` | `true` | Controls whether `getSideInfo` should convert side elements into the tablet summary. |
