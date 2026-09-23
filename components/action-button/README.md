# ActionButton

A lightweight, low-emphasis button for secondary inline actions such as "Clear filter" — a short label with an optional small leading icon. It is polymorphic: it renders a `button` by default, but can render an `a` or any other element or component through `as`, so the same look works for navigation links. Reach for `Button` instead when you need sizes, a primary style or a loading state.

## Usage

```jsx
import { ActionButton } from "@onlyoffice/apps-ui-kit/components/action-button";

const MyComponent = () => {
  return <ActionButton label="Clear filter" onClick={handleClick} />;
};
```

## Properties

| Name      | Type          | Default  | Description                                                                         |
| --------- | ------------- | -------- | ----------------------------------------------------------------------------------- |
| as        | ElementType   | "button" | Element or component to render as                                                   |
| icon      | ReactNode     | -        | Icon node rendered before the label text                                            |
| label     | ReactNode     | -        | Content rendered after the icon, usually the button text                            |
| className | string        | -        | Additional class name merged with the component's own                               |
| ref       | Ref           | -        | Ref to the rendered element (React 19 `ref` as a prop)                              |
| ...rest   | props of `as` | -        | Any other prop accepted by the rendered element, e.g. `onClick`, `disabled`, `href` |

The props type is generic, `ActionButtonProps<C extends ElementType = "button">`: the rest props follow the element passed in `as`.

## Behaviour notes

- **No `type` default.** The rendered `button` gets no `type` attribute, so inside a `<form>` it acts as a submit button. Pass `type="button"` when that is not what you want.
- **Children are not rendered.** Content goes through `label`; `icon` is wrapped in a span and sized to 12 by 12 pixels, with its `path` fill set to the button's text colour.
- **Disabled state** comes from the native `disabled` attribute (reduced opacity, `not-allowed` cursor); it has no effect when rendering as an `a`.
- **Dark theme** is selected by a `.dark` class on an ancestor, which `ThemeProvider` puts on `<body>`. Without it the button always renders in its light colours.

## Styling

The colours are CSS custom properties defined on the button element itself (not with fallbacks), so to override them set them on the button through `className`, not on a parent:

```css
--ab-bg
--ab-bg-hover
--ab-bg-active
--ab-color
```

## Examples

### With Icon

```jsx
<ActionButton
  icon={<FilterIcon />}
  label="Clear filter"
  onClick={handleClick}
/>
```

### As a Link

```jsx
<ActionButton as="a" href="/about" label="Go to page" />
```
