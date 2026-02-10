# Row

Displays a single line of structured content with an optional checkbox, leading element, extra content area, context menu and badges.

## Import

```ts
import { Row } from "@docspace/ui-kit/components/rows";
```

## Usage

```tsx
const contextOptions = [
  { key: "rename", label: "Rename" },
  { key: "delete", label: "Delete" },
];

<Row
  checked={false}
  contextOptions={contextOptions}
  onSelect={(nextChecked) => console.log("checked", nextChecked)}
  onRowClick={() => console.log("row click")}
>
  <Text truncate>Document.docx</Text>
</Row>;
```

### Modern mode with element

```tsx
<Row
  mode="modern"
  checked
  element={<Avatar size={AvatarSize.min} role={AvatarRole.user} userName="Alex" />}
  contextOptions={contextOptions}
>
  <Text truncate>Workspace</Text>
</Row>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | – | When provided, renders the checkbox (default mode) or the styled checkbox container (modern mode). |
| `children` | `React.ReactElement<{ item: RowItemType }>` | – | Main content block. If the element exposes an `item` prop, its data is reused inside the context menu header. |
| `className` | `string` | – | Custom class name added to the root wrapper. |
| `contentElement` | `React.ReactNode` | – | Additional element rendered near the context area (e.g., actions, tags). |
| `contextButtonSpacerWidth` | `string` | `"26px"` | Controls the width reserved for the context menu button via a CSS custom property. |
| `contextOptions` | `ContextMenuModel[]` | – | Options shown in the contextual menu. When omitted, an empty placeholder replaces the button. |
| `data` | `{ contextOptions: ContextMenuModel[] }` | – | Alternative place to keep `contextOptions` together with other row metadata. |
| `element` | `React.ReactElement` | – | Leading element (avatar, icon, combobox, etc.). In modern mode it shares the container with the checkbox. |
| `id` | `string` | – | DOM id for the wrapper. |
| `indeterminate` | `boolean` | – | Shows the checkbox in an indeterminate state. |
| `onSelect` | `(checked: boolean, data?: unknown) => void` | – | Called when the checkbox (or leading element on mobile) toggles its state. Receives the next `checked` value and row `data`. |
| `onRowClick` | `(e: React.MouseEvent) => void` | – | Fired when any part of the row except the checkbox and context button is clicked. |
| `onContextClick` | `(openedViaRightClick?: boolean) => void` | – | Fired when the context button or right click triggers the context menu. |
| `style` | `React.CSSProperties` | – | Inline styles for the wrapper. |
| `inProgress` | `boolean` | – | Replaces the regular content with a loader when `true`. |
| `getContextModel` | `() => ContextMenuModel[]` | – | Lazily provides menu items for the floating ContextMenu component. |
| `mode` | `"default" \| "modern"` | `"default"` | Switches layout between the classic checkbox-first row and the modern combined element/checkbox container. |
| `withoutBorder` | `boolean` | `false` | Hides the default row borders. |
| `isIndexEditingMode` | `boolean` | – | Displays index control buttons instead of the context menu button. |
| `isRoom` | `boolean` | – | Marks the row context as a room (affects ContextMenu styling). |
| `contextTitle` | `string` | – | Optional title displayed inside the context menu button tooltip. |
| `badgesComponent` | `React.ReactNode` | – | Custom badges displayed near the context button. |
| `isArchive` | `boolean` | – | Marks the context menu as originating from an archived entity. |
| `rowContextClose` | `() => void` | – | Callback fired when the floating context menu hides. |
| `badgeUrl` | `string` | – | Optional badge image URL passed to the context menu. |
| `isDisabled` | `boolean` | – | Disables the checkbox interaction. |
| `onChangeIndex` | `(action: VDRIndexingAction) => void` | – | Handles clicks on index-increase/decrease buttons when `isIndexEditingMode` is enabled. |
| `item` | `RowItemType` | – | Data object forwarded to children to describe avatars/icons/titles. |
| `dataTestId` | `string` | – | Custom `data-testid` attribute (defaults to `row`). |
