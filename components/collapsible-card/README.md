# CollapsibleCard

A full-width card whose whole header — a title, an optional description line and a chevron — is a button that shows or hides the body. Use it for FAQ-style blocks and optional sections of a page that should stay out of the way until the user asks for them. It works uncontrolled (`defaultOpen`) or controlled (`isOpen` + `onToggle`).

## Usage

```jsx
import { CollapsibleCard } from "@onlyoffice/apps-ui-kit/components/collapsible-card";

const MyComponent = () => {
  return (
    <CollapsibleCard
      title="Already using another platform?"
      description="Plug ONLYOFFICE into any ecosystem."
      defaultOpen
    >
      Any content
    </CollapsibleCard>
  );
};
```

## Properties

| Name        | Type                        | Default            | Description                                                                                       |
| ----------- | --------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| title       | React.ReactNode             | - (required)       | Header title shown next to the chevron                                                            |
| description | React.ReactNode             | -                  | Optional secondary line under the title                                                           |
| children    | React.ReactNode             | -                  | Body content rendered when expanded                                                               |
| isOpen      | boolean                     | -                  | Controlled open state. When provided, the parent owns the state and must update it via `onToggle` |
| defaultOpen | boolean                     | false              | Initial open state in uncontrolled mode                                                           |
| onToggle    | (nextOpen: boolean) => void | -                  | Called with the next open value when the header is activated                                      |
| className   | string                      | -                  | Additional CSS class name applied to the root element                                             |
| style       | React.CSSProperties         | -                  | Inline styles applied to the root element                                                         |
| dataTestId  | string                      | "collapsible-card" | Value of the root element's `data-testid`                                                         |

## Behaviour

- Controlled mode is chosen by `isOpen !== undefined`. In controlled mode a click only calls `onToggle(next)`; nothing changes until the parent passes the new `isOpen`. In uncontrolled mode the card updates its own state and still calls `onToggle`.
- The body is not rendered at all while collapsed (it is unmounted, not hidden), so body state is lost on collapse. It is also not rendered when `children` is falsy. There is no open/close animation; only the chevron rotates.
- The root carries `data-open="true"` or `data-open="false"`, usable as a styling hook.

## Accessibility

The header is a native `<button type="button">` with `aria-expanded` and `aria-controls` pointing at the body's generated id, so it is keyboard-operable with Enter and Space. The chevron is `aria-hidden`. The focus ring is shown only on `:focus-visible` (a 2px outline in the current text colour).

## Layout

- The root is `width: 100%` with a 12px radius and no outer margin.
- The header has 24px padding; the body has 24px side padding and 20px bottom padding, so content you pass sits inside that inset.
- Title is 18px bold, description 16px. The header uses `text-align: start` and the chevron sits at the inline end, so it follows RTL.

## Theming

Background, title, description and chevron colours are set only under a `.light` or `.dark` class on an ancestor. The kit's `ThemeProvider` (`components/theme-provider`) adds that class to `<body>`; without it the card is transparent and the text inherits its colour. The module exposes no custom properties for these colours.

## Examples

### Controlled

```jsx
const [open, setOpen] = React.useState(false);

<CollapsibleCard title="Details" isOpen={open} onToggle={setOpen}>
  Body content
</CollapsibleCard>;
```
