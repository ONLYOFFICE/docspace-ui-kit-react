# RoomType

A card describing one kind of DocSpace room — its logo, localized title and description, and a forward arrow. Reach for it when a user chooses what kind of room to create: as a row in a list of room types, as the button that shows the current choice and opens a dropdown, or as an entry inside that dropdown. The title and description come from the `Common` translation namespace, keyed by `roomType`.

## Usage

```jsx
import RoomType from "@onlyoffice/apps-ui-kit/components/room-type";
import { RoomsType } from "@onlyoffice/apps-ui-kit/enums";

const MyComponent = () => {
  return (
    <RoomType
      roomType={RoomsType.EditingRoom}
      isOpen={false}
      selectedId="room-1"
      onClick={handleClick}
    />
  );
};
```

The folder barrel has a **default** export only. The package root re-exports it by name as `RoomType`.

## Properties

| Name               | Type                                             | Default    | Description                                                                    |
| ------------------ | ------------------------------------------------ | ---------- | ------------------------------------------------------------------------------ |
| roomType           | RoomsType                                        | -          | Room type whose logo, title and description are shown                          |
| isOpen             | boolean                                          | -          | Open state; on `dropdownButton` it adds the open border and reverses the arrow |
| type               | "listItem" \| "dropdownButton" \| "dropdownItem" | "listItem" | Display variant                                                                |
| id                 | string                                           | -          | DOM `id` of the root element                                                   |
| selectedId         | string \| number                                 | -          | Written to the root element as `data-selected-id`; not used for rendering      |
| onClick            | MouseEventHandler\<HTMLElement\>                 | -          | Click handler on the root element; the arrow button calls it as well           |
| disabledFormRoom   | boolean                                          | -          | Styles a `FormRoom` item as disabled (`listItem` and `dropdownItem`)           |
| disabledPublicRoom | boolean                                          | -          | Styles a `PublicRoom` item as disabled (`listItem` and `dropdownItem`)         |
| isTemplate         | boolean                                          | -          | Shows the "from template" title and description; also passed to `RoomLogo`     |
| isTemplateRoom     | boolean                                          | -          | Passed to `RoomLogo` as `isTemplateRoom`                                       |
| isFormSection      | boolean                                          | -          | Shows the form-set title and description instead of the room type's            |

## Requirements

- **Translations.** The component calls `useTranslation(["Common"])` from `react-i18next`, so it needs an i18next instance with the `Common` namespace loaded — `TranslationProvider` or the portal's own. Keys used: `CollaborationRoomTitle`, `VirtualDataRoom`, `CustomRoomTitle`, `AIRoomTitle`, `PublicRoom`, `FormFilingRoomTitle`, `FromTemplate`, `FormSetTitle` and the matching descriptions (`CollaborationRoomDescription`, `VirtualDataRoomDescription`, `CustomRoomDescription`, `AIRoomDescription`, `PublicRoomInfo`, `FormFilingRoomInfo`, `FromTemplateRoomInfo`, `SetTemplateDescription`, `FormSetDescription`). A `roomType` outside that set gets an empty title and description.
- **Theme class.** The default colours are defined only under a `.light` or `.dark` ancestor class, which `ThemeProvider` puts on `<body>`. Without one, and without the overrides below, the item has no border, background or description colour.

## Behaviour

- **Title precedence.** `isFormSection` wins over `isTemplate`, which wins over `roomType`.
- **Disabled.** An item is disabled only when it is a `FormRoom` with `disabledFormRoom` or a `PublicRoom` with `disabledPublicRoom`, and only the `listItem` and `dropdownItem` variants show it. Disabling is visual: `onClick` still fires. A disabled item drops its title tooltip and carries `data-tooltip-id="create-room-tooltip"`, so the host can render a `Tooltip` with that id to explain why.
- **Arrow.** `listItem` shows a forward arrow; `dropdownButton` rotates it a quarter turn one way, and the other way while `isOpen`; `dropdownItem` hides it.
- **Test ids.** The root carries `room-type-list-item`, `room-type-dropdown-button` or `room-type-dropdown-item`, by variant.

## Layout

The root is `width: 100%` with `16px` padding and a `12px` gap between logo, text and arrow. It has no outer margin.

## RTL

The forward arrow is mirrored under an `.rtl` ancestor class, which `ThemeProvider` puts on `<body>`, not under `[data-dir="rtl"]`. The arrow is pushed to the inline end with a logical margin.

## Styling

Component-level CSS variables, set on the item or any ancestor:

| Variable                        | Fallback                                      | Description                      |
| ------------------------------- | --------------------------------------------- | -------------------------------- |
| `--room-type-item-bg`           | `var(--room-type-list-item-background)`       | Item background                  |
| `--room-type-item-border`       | `var(--room-type-list-item-border)`           | Item border colour               |
| `--room-type-item-hover-bg`     | `var(--room-type-list-item-hover-background)` | Item background on hover         |
| `--room-type-description-color` | `var(--room-type-list-item-description-text)` | Description text colour          |
| `--room-type-item-radius`       | `6px`                                         | Border radius                    |
| `--room-type-item-padding`      | `16px`                                        | Inner padding                    |
| `--room-type-gap`               | `12px`                                        | Gap between logo, text and arrow |

The `--room-type-list-item-*` fallbacks are theme values set under `.light` / `.dark`, and all three variants use them. The pressed and open border colour comes from the portal accent (`--current-color-scheme-main-accent` on `listItem`, `--accent-main` on `dropdownButton`) and has no component-level override; neither has the disabled background.

## Examples

### Dropdown button

```jsx
<RoomType
  roomType={RoomsType.PublicRoom}
  isOpen={true}
  type="dropdownButton"
  selectedId="room-2"
  onClick={handleClick}
/>
```

### Dropdown item

```jsx
<RoomType
  roomType={RoomsType.CustomRoom}
  isOpen={false}
  type="dropdownItem"
  selectedId="room-3"
  onClick={handleClick}
/>
```
