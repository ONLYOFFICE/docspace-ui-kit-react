<!-- ui-kit-doc {
  "schema": 1,
  "name": "Rows",
  "folder": "components/rows",
  "kind": "compound",
  "category": "Data display",
  "status": "public",
  "summary": "The file list of the DocSpace portal, in three parts: the container, the row and the row's content.",
  "propsType": null,
  "import": { "subpath": "components/rows", "barrel": true, "default": false },
  "exports": ["Row", "RowContent", "RowContainer", "IndexIconButtons", "RowSkeleton", "RowsSkeleton"],
  "providers": ["ThemeProvider", "TranslationProvider"],
  "state": { "visibility": null, "close": null, "loading": null, "disabled": null },
  "related": ["rows/row", "rows/row-container", "rows/row-content"],
  "subComponents": ["Row", "RowContent", "RowContainer", "RowSkeleton", "RowsSkeleton", "IndexIconButtons"],
  "testIds": []
} -->

# Rows

The file list of the DocSpace portal, in three parts: the container, the row and the row's
content. It is shaped around that list, not around lists in general — read the three pages
below before choosing it.

## Use this when / not when

- Use when you are rebuilding something that has to look and behave like the portal's file
  list: a selectable row with an icon, a title, badges and a context menu, virtualised over
  thousands of items.
- Not for a generic list of your own. The parts read each other's children by position and by
  prop name, and the virtual list measures itself through a literal element id — see
  [`RowContainer`](./row-container/README.md).
- Not for tabular data with columns the user sorts or resizes: that is
  [`Table`](../table/README.md).
- Not for a handful of items. Three names and an avatar are a flex column of your own, and cost
  nothing to keep.

## Import

```ts
import {
  Row,
  RowContainer,
  RowContent,
} from "@onlyoffice/apps-ui-kit/components/rows";
```

Also exported from the root barrel `@onlyoffice/apps-ui-kit`.

Needs `ThemeProvider` from `@onlyoffice/apps-ui-kit/providers/theme`, and
`TranslationProvider` from `@onlyoffice/apps-ui-kit/providers/translation` for the context
menu's own labels.

## Minimal example

The three nest in one order only: container, then rows, then one content per row.

```tsx
import {
  Row,
  RowContainer,
  RowContent,
} from "@onlyoffice/apps-ui-kit/components/rows";
import { Text } from "@onlyoffice/apps-ui-kit/components/text";

export function MemberList({ names }: { names: string[] }) {
  return (
    <RowContainer useReactWindow={false} manualHeight="320px">
      {names.map((name) => (
        <Row key={name} contextOptions={[]}>
          <RowContent>
            <Text fontWeight={600}>{name}</Text>
            <span />
            <Text fontSize="12px">Member</Text>
          </RowContent>
        </Row>
      ))}
    </RowContainer>
  );
}
```

## Recipes

### Selection

`checked` renders the checkbox by being present at all, and `onSelect` hands back whatever you
put in `data`.

```tsx
import { useState } from "react";
import {
  Row,
  RowContainer,
  RowContent,
} from "@onlyoffice/apps-ui-kit/components/rows";
import { Text } from "@onlyoffice/apps-ui-kit/components/text";

export function SelectableList({ names }: { names: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <RowContainer useReactWindow={false} manualHeight="320px">
      {names.map((name) => (
        <Row
          key={name}
          checked={selected.includes(name)}
          data={{ contextOptions: [] }}
          onSelect={(checked) =>
            setSelected((current) =>
              checked
                ? [...current, name]
                : current.filter((item) => item !== name),
            )
          }
        >
          <RowContent>
            <Text fontWeight={600}>{name}</Text>
            <span />
          </RowContent>
        </Row>
      ))}
    </RowContainer>
  );
}
```

## Behaviour the types don't state

- **The parts are coupled by position and by name, not by types.**
  [`RowContent`](./row-content/README.md) addresses its children by index,
  [`Row`](./row/README.md) reads `item` off its child's props, and
  [`RowContainer`](./row-container/README.md) is found by the virtual list through the literal
  id `rowContainer`. None of that is visible in the props.
- **Only one row list can work on a page**, because of that literal id, and the container has
  to be under the portal's scroll element for virtualisation to measure anything. Pass
  `useReactWindow={false}` outside the portal.
- The folder also exports `RowSkeleton` and `RowsSkeleton` for the loading state, and
  `IndexIconButtons` for the arrows the row shows while indexes are being edited.
- Each part has its own page; the traps are listed there rather than here.

## Sub-components

| Export                                      | What it is                                               |
| ------------------------------------------- | -------------------------------------------------------- |
| [`RowContainer`](./row-container/README.md) | The scrolling, virtualised list the rows go in           |
| [`Row`](./row/README.md)                    | One row: checkbox, start element, content, context menu  |
| [`RowContent`](./row-content/README.md)     | The row's text, laid out by the position of its children |
| `RowSkeleton`, `RowsSkeleton`               | Placeholders in the shape of a row and of a list of them |
| `IndexIconButtons`                          | The up and down arrows of the row's index-editing mode   |

## Accessibility

- Nothing here is a list, a grid or an option as far as assistive technology is concerned: the
  parts are `<div>`s. There is no `role="list"`, no `aria-selected` on a row, and the context
  menu opens on right-click or from a `<div>` that is not focusable.
- Selection is a [`Checkbox`](../checkbox/README.md) inside the row, which is a real input and
  is reachable — it is the only part of a row that is.
- A list a keyboard user must be able to work through needs [`Table`](../table/README.md) or
  markup of your own.

## Test ids

| Element         | `data-testid`                        |
| --------------- | ------------------------------------ |
| The container   | `row-container`                      |
| A row           | `row`, overridable with `dataTestId` |
| A row's content | `row-content`                        |

## Related

- [`Row`](./row/README.md) — one row, and everything it renders.
- [`RowContainer`](./row-container/README.md) — the list around them.
- [`RowContent`](./row-content/README.md) — how a row's text is laid out.
