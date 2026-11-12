# Building with ONLYOFFICE Apps UI kit (`window.AppsUiKit`)

This is the React component library behind ONLYOFFICE Apps (file manager,
rooms, settings). Compose screens from these components; write only layout
glue yourself.

## 1. Always wrap the tree in both providers

```jsx
const {
  TranslationProvider,
  ThemeProviderComponent,
  previewTranslations,
  previewTheme,
  previewColorScheme,
} = window.AppsUiKit;

<TranslationProvider locale="en" translations={previewTranslations}>
  <ThemeProviderComponent
    theme={previewTheme}
    currentColorScheme={previewColorScheme}
  >
    <App />
  </ThemeProviderComponent>
</TranslationProvider>;
```

- Without `ThemeProviderComponent` nothing sets `data-theme` on `<html>`, so
  `--background-color` / `--text-color` and the accent colours never resolve
  and components render half-styled.
- Without `TranslationProvider` built-in labels render as raw keys
  (`SaveButton`, `CancelButton`).
- Dark theme: `theme={{ ...previewTheme, isBase: false }}`. Right-to-left:
  `interfaceDirection: "rtl"` in the theme - it flips the whole page, not one
  subtree. Use one provider pair per page.
- Accent colour: `currentColorScheme.main.accent` / `.main.buttons` (hex).

## 2. Styling idiom: props first, no utility classes

There is no class vocabulary to use - component CSS is hashed CSS modules.
Style components through their props; enums live on the same global:

- `Button` - `label`, `primary`, `size={ButtonSize.normal}` (`extraSmall`,
  `small`, `normal`, `medium`), `scale` (full width), `isDisabled`, `onClick`.
- `Text` - `fontSize="13px"`, `fontWeight={600}`, `isBold`, `as="span"`.
- `Heading` - `level={HeadingLevel.h2}`, `size={HeadingSize.medium}`.
- `TextInput` - `type={InputType.text}`, `value`, `onChange`,
  `size={InputSize.base}` (`base`, `middle`, `large`), `scale`.
- `FieldContainer` - `labelText`, `labelVisible` (defaults to **false** - set
  it), `isVertical`, `isRequired`.

For your own layout glue use flex/grid inline styles and only the theme tokens
that ship: `var(--background-color)`, `var(--text-color)`,
`var(--color-scheme-main-accent)`. Each component also exposes `--<component>-*`
custom properties (`--button-*`, `--toast-*`, ... - grep `_ds_bundle.css` for
the component's prefix) as override knobs. Do not invent `var(--...)` names: tokens that the full
ONLYOFFICE Apps portal defines are not shipped here, and an unknown name fails
silently. Prefer logical properties (`margin-inline-start`, `padding-block`)
so RTL works. The font is Open Sans (shipped in `fonts/`).

## 3. Known traps

- `SearchInput.onChange` receives the string, not the event.
- `Textarea` has a `max-width` but no width - give its container a width.
- `ToggleButton`'s label is absolutely positioned and has no intrinsic size -
  put it in a sized container.
- `ComboBox` matches the selected option by label, not key.
- Overlays render `position: fixed` and are closed by default: `ModalDialog`
  and `Aside` open with `visible`, `DropDown` with `open`.

## 4. Where the truth lives

Before styling, read `styles.css` (it imports `_ds_bundle.css`, where every
token and component rule lives) and, per component,
`components/<group>/<Name>/<Name>.prompt.md` (usage, import, examples, props)
and `<Name>.d.ts` (the exact props). `guidelines/` holds the kit's own docs.

## 5. Example

```jsx
const {
  FieldContainer,
  TextInput,
  InputType,
  Button,
  ButtonSize,
  Heading,
  HeadingLevel,
  HeadingSize,
} = window.AppsUiKit;

function InviteForm() {
  const [email, setEmail] = React.useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 360,
        padding: 24,
        background: "var(--background-color)",
        color: "var(--text-color)",
      }}
    >
      <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
        Invite people
      </Heading>
      <FieldContainer labelText="Email" labelVisible isVertical>
        <TextInput
          type={InputType.email}
          value={email}
          scale
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FieldContainer>
      <Button label="Send invitation" primary size={ButtonSize.normal} scale />
    </div>
  );
}
```
