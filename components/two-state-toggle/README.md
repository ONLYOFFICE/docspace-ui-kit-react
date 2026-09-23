# TwoStateToggle

A pill-shaped switch that moves the user between the new Dashboard and the classic DocSpace view. It is not a general-purpose on/off control: it reads and writes the `useDocSpace` key in `localStorage`, asks for confirmation before leaving the new view, and navigates to a fixed URL after every switch. Reach for it only where that design switch is offered; for an ordinary two-state setting use `ToggleButton`.

## Usage

```jsx
import { TwoStateToggle } from "@onlyoffice/apps-ui-kit/components/two-state-toggle";

const MyComponent = () => {
  const navigate = useNavigate();

  return <TwoStateToggle onNavigate={(url) => navigate(url)} />;
};
```

## Properties

| Name          | Type                  | Default                                                                             | Description                                                      |
| ------------- | --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| title         | string                | "DocSpace design"                                                                   | Text label shown to the left of the toggle                       |
| labelOld      | string                | "OLD"                                                                               | Label for the classic DocSpace view (left side of pill)          |
| labelNew      | string                | "NEW"                                                                               | Label for the new Dashboard view (right side of pill)            |
| confirmTitle  | string                | "Switch to Old Design"                                                              | Confirmation modal title (shown when switching NEW to OLD)       |
| confirmBody   | string                | "You are about to leave the new Dashboard and return to the classic DocSpace view." | Confirmation modal main body text                                |
| confirmHint   | string                | "You can return to the new Dashboard at any time by navigating to /dashboard."      | Hint shown below the body — e.g. how to return to new view       |
| confirmOk     | string                | "Switch"                                                                            | Confirmation modal "proceed" button label                        |
| confirmCancel | string                | "Cancel"                                                                            | Confirmation modal "cancel" button label                         |
| onNavigate    | (url: string) => void | -                                                                                   | Called with the target URL; falls back to `window.location.href` |
| className     | string                | -                                                                                   | Additional CSS class applied to the wrapper                      |

## Behaviour

- **State lives in `localStorage`, not in props.** The initial position is read once, on mount, from `localStorage.useDocSpace`: `"old"` means the classic view, anything else (including no value) means the new one. There is no `value` / `onChange` pair, and the component touches `localStorage` during render, so it cannot be rendered on the server.
- **NEW to OLD** opens a confirmation modal. Confirming writes `"old"` and navigates to `/`; cancelling or closing the modal changes nothing.
- **OLD to NEW** switches immediately: writes `"new"` and navigates to `/dashboard`.
- **Navigation targets are fixed.** `/dashboard` and `/` are hardcoded; `onNavigate` only decides how the navigation happens. Without it the page does a full load through `window.location.href`.
- **Hiding parts.** An empty `title` renders only the pill; an empty `confirmHint` drops the hint from the modal.
- **Accessibility.** The pill is a `<button role="switch">` with `aria-checked` set when the new view is active. Its accessible name is the fixed English string "Switch DocSpace design"; `title`, `labelOld` and `labelNew` do not change it.
- **All strings are English defaults.** Pass translated strings for every text prop in a localised UI.

## Size

The pill has a fixed size of 152 by 36 pixels and does not shrink; each label gets half of it. Long labels do not widen it; the pill hides whatever overflows. The wrapper is `inline-flex` with no outer margin.

## RTL

`labelOld` sits at the inline start and `labelNew` at the inline end, so in a right-to-left interface the old view is on the right and the title sits to the right of the pill. The thumb slides in the mirrored direction when the `rtl` class is on `<body>`, which `ThemeProvider` sets.

## Styling

| Variable                      | Fallback                                   | Used for                                         |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `--color-scheme-main-accent`  | the kit's `$light-second-main` Sass colour | Pill background, focus ring, label on the thumb  |
| `--button-root-border-radius` | `6px`                                      | Corner radius of the pill (thumb is 2px smaller) |
| `--text-color`                | none                                       | Colour of the `title` label                      |

`--color-scheme-main-accent` and `--text-color` are set by `ThemeProvider`; the hint colour in the confirmation modal also depends on the `.light` / `.dark` class it puts on `<body>`.

## Examples

### Without a title

```jsx
<TwoStateToggle title="" onNavigate={(url) => navigate(url)} />
```

### Custom labels

```jsx
<TwoStateToggle
  title="Interface"
  labelOld="v1"
  labelNew="v2"
  confirmTitle="Switch to v1?"
  confirmBody="You will be taken back to the classic interface."
  confirmHint="Return to v2 anytime via /dashboard."
  confirmOk="Yes, switch"
  confirmCancel="Stay on v2"
/>
```
