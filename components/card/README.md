# Card

A generic layout container: a rounded, tinted block with an optional header row (a title at the start, an `extra` slot at the end), a body and a footer. It carries no business logic — every slot takes any React node — so reach for it when you need an info block, such as a feature teaser with a status and an action button, rather than building the same padded box by hand.

## Usage

```jsx
import { Card } from "@onlyoffice/apps-ui-kit/components/card";

const MyComponent = () => {
  return (
    <Card title="Card title" extra={<span>Connected</span>}>
      Description text goes here.
    </Card>
  );
};
```

## Properties

| Name       | Type                | Default | Description                                                                |
| ---------- | ------------------- | ------- | -------------------------------------------------------------------------- |
| title      | React.ReactNode     | -       | Start of the card header. Hidden if both `title` and `extra` are undefined |
| extra      | React.ReactNode     | -       | End of the card header (e.g. a status badge)                               |
| children   | React.ReactNode     | -       | Card body content                                                          |
| footer     | React.ReactNode     | -       | Content rendered in an unstyled `<footer>` after the body                  |
| className  | string              | -       | Additional CSS class name applied to the root element                      |
| style      | React.CSSProperties | -       | Inline styles applied to the root element                                  |
| dataTestId | string              | "card"  | Value of the root element's `data-testid`                                  |

## Layout

- The root is a flex column with a 12px gap between header, body and footer, 12px/16px padding and a 6px radius. It sets no outer margin and no width of its own.
- The header row is rendered only when `title` or `extra` is not `null`/`undefined`. Inside it, the title takes the remaining width (`min-width: 0`, so long content can shrink), while `extra` does not shrink and does not wrap.
- Title and body text are 12px; the title is semibold. Content you pass keeps its own styles — for example a `<p>` in the body keeps its browser margin.
- Each slot is rendered only when its value is truthy, so `title={0}` or `children={0}` renders nothing.
- `footer` gets no class and no styling beyond the root's gap.

## Theming

The background, title and body colours are set only under a `.light` or `.dark` class on an ancestor. The kit's `ThemeProvider` (`components/theme-provider`) adds that class to `<body>`; without it the card has no background and its text falls back to the inherited colour.

## Styling

The module defines these custom properties on the root, per theme class, and reads them back:

```css
--info-block-background /* root background */
--card-title-color      /* title text */
--card-body-color       /* body text */
```

Because they are assigned on the root itself under `.light` / `.dark`, a value set by a consumer on an ancestor is overridden while a theme class is present.

## Examples

### Body only

```jsx
<Card>Body content without a header row.</Card>
```

### Icon in the title

The card has no opinion about icon placement; lay the title out yourself.

```jsx
<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <PeopleIcon style={{ width: 16, height: 16 }} />
      Analyze responses with AI
    </span>
  }
  extra={<span>Connected</span>}
>
  <p style={{ margin: 0 }}>Ask AI to explore responses from this form.</p>
  <button type="button">Ask AI</button>
</Card>
```
