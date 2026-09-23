# ColumnarInfoBar

A full-width bar that lays out read-only facts as labelled columns — a caption over each value — with an optional heading and an optional close button. Reach for it to show a handful of related details that need no action from the user, such as freshly created profile details or the metadata of a webhook event; for a message with its own call to action, use a snackbar or a notification bar instead.

## Usage

```jsx
import { ColumnarInfoBar } from "@onlyoffice/apps-ui-kit/components/columnar-info-bar";

const MyComponent = () => {
  return (
    <ColumnarInfoBar
      headerText="Your profile details"
      columns={[
        { label: "Name", value: "John Smith" },
        { label: "Email", value: "john@example.com" },
      ]}
      onAction={() => console.log("closed")}
    />
  );
};
```

The barrel also exports the `ColumnarInfoBarProps` and `ColumnarInfoBarColumn` types.

## Properties

| Name       | Type                             | Default   | Description                                                                       |
| ---------- | -------------------------------- | --------- | --------------------------------------------------------------------------------- |
| columns    | ColumnarInfoBarColumn[]          | -         | Label and value pairs, one column each, in order (required)                       |
| headerText | string                           | -         | Heading rendered above the columns; omitted when empty                            |
| onAction   | () => void                       | -         | Close button click handler; the close button renders only when this is set        |
| onLoad     | () => void                       | -         | Called once, after the component mounts                                           |
| style      | CSSProperties                    | -         | Inline styles on the root element; the way to set the `--cib-*` custom properties |
| variant    | "default" \| "neutral" \| "page" | "default" | Visual variant; see below                                                         |

`ColumnarInfoBarColumn` is `{ label: ReactNode; value: ReactNode }`.

There is no `className`, `ref` or test-id prop.

## Variants

- **default** — warning-style bar: a 4px accent border on the inline-start edge, columns wrapping in a row, the close button in the inline-end corner.
- **neutral** — no accent border; a rounded card with a 2px border, its own 4px outer margin (width `calc(100% - 8px)`), and a fade-and-expand reveal animation on mount.
- **page** — a rounded card with 20px padding; the heading and the close button share the top row, and the columns form a two-column grid.

## Styling

The colours come from custom properties set on the root. They are assigned under a `.light` or `.dark` ancestor class — the classes `ThemeProvider` puts on `<body>` — so without one the bar has no background, text or accent colour. Values passed through `style` take precedence over the themed ones.

| Variable             | Used for                                                                      |
| -------------------- | ----------------------------------------------------------------------------- |
| `--cib-bg`           | Background                                                                    |
| `--cib-color`        | Text and label colour (labels render at 60% opacity outside `page`)           |
| `--cib-accent`       | Inline-start accent border (`default`); heading colour when the next is unset |
| `--cib-header-color` | Heading colour; falls back to `var(--cib-accent)`                             |

The `neutral` and `page` variants set `--cib-accent` to transparent and define their own `--cib-header-color`. In `page` the labels and the close icon use a fixed gray from the Sass palette rather than a custom property.

## Layout notes

- Below the mobile breakpoint (600px) each column of the `default` and `neutral` variants takes the full width.
- The layout uses logical properties, so the accent border and the close button move to the other side under RTL.
- The close button is labelled "Close" in English; the label is not translated.

## Examples

### Without a close button

```jsx
<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event ID", value: "evt_01hx9z3k2m" },
    { label: "Event Type", value: "file.created" },
  ]}
/>
```

### Node values

```jsx
<ColumnarInfoBar
  variant="page"
  headerText="Event details"
  columns={[{ label: "Status", value: <Badge label="200 OK" /> }]}
/>
```
