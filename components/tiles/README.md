<!-- ui-kit-doc {
  "schema": 1,
  "name": "Tiles",
  "folder": "components/tiles",
  "kind": "compound",
  "category": "Data display",
  "status": "public",
  "summary": "The card view of the ONLYOFFICE Apps listing: a sorting container, four kinds of tile and the slot their names go in.",
  "propsType": null,
  "import": { "subpath": "components/tiles", "barrel": true, "default": false },
  "exports": ["TileContainer", "TileContent", "BaseTile", "FileTile", "FolderTile", "RoomTile", "TemplateTile"],
  "providers": ["ThemeProvider", "TranslationProvider"],
  "state": { "visibility": null, "close": null, "loading": null, "disabled": null },
  "related": ["tiles/tile-container", "tiles/base-tile", "rows"],
  "subComponents": ["TileContainer", "TileContent", "BaseTile", "FileTile", "FolderTile", "RoomTile", "TemplateTile"],
  "testIds": [],
  "storiesAudit": "2026-09-28"
} -->

# Tiles

The card view of the ONLYOFFICE Apps listing: a sorting container, four kinds of tile and the slot their
names go in. It is the counterpart of [`Rows`](../rows/README.md), and like that family it is
shaped around the portal's data rather than around cards in general.

## Use this when / not when

- Use to reproduce the portal's tile listing, with its grouping into rooms, templates, folders and
  files.
- Not as a general card grid — the container **drops any child without an `item` prop**, so your
  own markup between the tiles never appears. Use a plain CSS grid.
- Not for the list view — [`Rows`](../rows/README.md) is the same listing as rows.
- Not for a single card — [`Card`](../card/README.md) takes children and asks nothing of them.
- **The skeletons are not re-exported here.** `TilesSkeleton` and `TileSkeleton` live in
  `components/tiles/sub-components/skeletons` and are reachable only by that subpath.
- **None of the tiles is keyboard-operable.** Each is a `div` with click handlers, and an
  unselected tile cannot be selected from the keyboard. See Accessibility.

## Import

```ts
import {
  TileContainer,
  TileContent,
  FileTile,
  FolderTile,
  RoomTile,
  TemplateTile,
} from "@onlyoffice/apps-ui-kit/components/tiles";
```

Also exported from the root barrel `@onlyoffice/apps-ui-kit`.

Each part is equally available at its own subpath — `components/tiles/file-tile` and so on — which
is what keeps a bundle to the tiles you use. `FolderTile` also has a default export at its own
subpath; the star re-export here carries only the name.

`ThemeProvider` switches the tiles to their dark colours. `TranslationProvider` supplies their
texts. Those are the three-dot button's tooltip, the room tile's `NoTags` line, and the template
tile's `Owner` and `Storage` captions.

## Minimal example

```tsx
import { Link } from "@onlyoffice/apps-ui-kit/components/link";
import {
  FileTile,
  FolderTile,
  TileContainer,
  TileContent,
} from "@onlyoffice/apps-ui-kit/components/tiles";

const folder = {
  id: "f1",
  title: "Contracts",
  isFolder: true,
  contextOptions: [],
};
const file = {
  id: "d1",
  title: "Report.docx",
  fileExst: ".docx",
  contextOptions: [],
};

export function Listing() {
  return (
    <TileContainer headingFolders="Folders" headingFiles="Documents">
      <FolderTile item={folder} contextOptions={[]}>
        <TileContent>
          <Link className="item-file-name">{folder.title}</Link>
        </TileContent>
      </FolderTile>
      <FileTile item={file} contextOptions={[]} temporaryIcon="/icons/docx.svg">
        <TileContent>
          <Link className="item-file-name">{file.title}</Link>
        </TileContent>
      </FileTile>
    </TileContainer>
  );
}
```

## Recipes

### Which tile to reach for

| The item is     | Use                                       | Because                                                      |
| --------------- | ----------------------------------------- | ------------------------------------------------------------ |
| a document      | [`FileTile`](file-tile/README.md)         | it is the only one with a thumbnail and its failure fallback |
| a folder        | [`FolderTile`](folder-tile/README.md)     | one name row, or a tall card with `isBigFolder`              |
| a room          | [`RoomTile`](room-tile/README.md)         | it builds the tag row, including the generated room-type tag |
| a room template | [`TemplateTile`](template-tile/README.md) | it shows the owner and the storage instead of tags           |
| anything else   | [`BaseTile`](base-tile/README.md)         | the shell, with both halves yours to fill                    |

### Keep the selection across a whole listing

Every tile reports through `onSelect` and none of them holds the state. Keep a set of ids and hand
each tile its own `checked`.

```tsx
import { useState } from "react";

import { Text } from "@onlyoffice/apps-ui-kit/components/text";
import {
  FolderTile,
  TileContainer,
  TileContent,
} from "@onlyoffice/apps-ui-kit/components/tiles";

const folders = [
  { id: "f1", title: "Contracts", isFolder: true, contextOptions: [] },
  { id: "f2", title: "Invoices", isFolder: true, contextOptions: [] },
];

export function SelectableListing() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string, checked: boolean) =>
    setSelected((ids) =>
      checked ? [...ids, id] : ids.filter((other) => other !== id),
    );

  return (
    <TileContainer headingFolders="Folders">
      {folders.map((folder) => (
        <FolderTile
          key={folder.id}
          item={folder}
          contextOptions={[]}
          checked={selected.includes(folder.id)}
          element={<span aria-hidden="true">📁</span>}
          onSelect={(checked) => toggle(folder.id, checked)}
        >
          <TileContent>
            <Text truncate>{folder.title}</Text>
          </TileContent>
        </FolderTile>
      ))}
    </TileContainer>
  );
}
```

### Show placeholders while the tiles load

The skeletons are in the folder but not in this index, so they come from their own subpath.

```tsx
import { TilesSkeleton } from "@onlyoffice/apps-ui-kit/components/tiles/sub-components/skeletons";

export function LoadingListing() {
  return <TilesSkeleton />;
}
```

## Behaviour the types don't state

- **The container decides the order, not you.** Rooms first, then templates, then folders under
  their heading, then files under theirs. The order you pass the children in only decides the order
  inside a group.
- **A child without `props.item` is dropped silently**, so nothing but a tile can go inside the
  container.
- **The three-dot button has a two-part gate on every tile.** The `contextOptions` prop must be
  non-empty **and** `item` must carry a `contextOptions` key of its own.
- The `TileItem` type does not declare that key. Both the button's menu and the right-click menu
  list `getContextModel`'s entries, so without it the button opens nothing.
- **Only the first child of a tile is rendered.** The file, folder, room and template tiles drop
  the rest of `children`. `BaseTile` takes `topContent` and `bottomContent` instead.
- **Selection differs between the tiles.** A plain click selects on the file and folder tiles, and
  not on the base, room and template tiles.
- A tap on the icon selects on every tile, but only in a window 600px wide or narrower.
- **The prop types are exported from each tile's own subpath**, not from this index — which
  re-exports the components only.
- **`TilesSkeleton` and `TileSkeleton` are not re-exported here** either, although the rows family
  does re-export its equivalents.

## Sub-components

| Part                                        | For                                                              |
| ------------------------------------------- | ---------------------------------------------------------------- |
| [`TileContainer`](tile-container/README.md) | sorting the tiles into four groups and laying each out as a grid |
| [`TileContent`](tile-content/README.md)     | the name slot inside a tile                                      |
| [`BaseTile`](base-tile/README.md)           | the shell: icon, checkbox, menu, two halves                      |
| [`FileTile`](file-tile/README.md)           | a document, with a thumbnail                                     |
| [`FolderTile`](folder-tile/README.md)       | a folder, short or tall                                          |
| [`RoomTile`](room-tile/README.md)           | a room, with its tag row                                         |
| [`TemplateTile`](template-tile/README.md)   | a room template, with owner and storage                          |

`TilesSkeleton` and `TileSkeleton` are in `sub-components/skeletons` and are imported from that
subpath.

`TilesSkeleton` is the placeholder for a whole listing while the tiles load. It draws
`foldersCount` folder placeholders (2 by default) above `filesCount` file placeholders (8 by
default). Each group sits under a bar standing for its heading.

A group of zero loses its bar too, and `withTitle={false}` drops the bar above the files alone. A
folder placeholder is a 64px bar and a file placeholder a 220px card. Both have 12px corners unless
`borderRadius` says otherwise.

On a tablet each group shows at most seven placeholders, on a phone at most two. `isRooms` widens
the columns to the room tiles' 275px floor.

`TileSkeleton` is one placeholder: a file card by default, a folder bar with `isFolder`. With
`isRoom` it is a room card with a logo, a title bar, a menu square and two tag bars. Both take the
`RectangleSkeleton` props, such as `speed` and the two colours, for the band that sweeps across
every shape.

Every shape is an SVG with `role="img"`, so a screen reader meets one image per placeholder and per
heading bar. `title` names them all through an SVG `<title>`; without it they have no name. Neither
component sets `aria-busy` — mark the loading region with it yourself.

## CSS variables

The container's own knob is below; each tile's variables are documented on its own page, and they
share the `--tile-*` prefix. They inherit, so a value set on the container reaches every tile.

| Variable               | Default | Effect                           |
| ---------------------- | ------- | -------------------------------- |
| `--tile-container-gap` | `16px`  | Gap between tiles in every group |

The group headings have no variable. The container's stylesheet reads
`--tile-container-sort-font-size` and `--tile-container-sort-font-weight` under a selector that
matches no element, so they have no effect.

## Accessibility

- **Nothing in this family is a list.** The container and the group wrappers are plain `<div>`s
  with no `role` and no count, so a screen reader hears a run of unrelated elements.
- **No tile is keyboard-operable.** Each is a `<div>` with click and context-menu handlers. The
  keyboard reaches the three-dot button and whatever you put in the content.
- **An unselected tile cannot be selected from the keyboard.** Its checkbox is `display: none`
  until the pointer is on the icon, so Tab reaches it only while the tile is `checked`.
- Make the item's name a real link, so that it can be opened without a mouse.
- The right-click menu is pointer-only. The three-dot button is the keyboard path to the same
  actions, so a listing that fails its two-part gate has no keyboard access to them.
- **A passed `aria-*` lands on each tile's outer `<div>` and is kept.** The tile has no role, so
  a name there is not read.
- Only the folders and files groups get a heading. A listing that is only rooms or only templates
  has none; supply one above the container.
- Ctrl-click and Shift-click, on the tiles that support them, have no keyboard equivalent.

## Test ids

The container and the content slot set none. All five tiles carry `tile` on their outer element,
overridable through `dataTestId` on every one except the template tile, which has no such prop.
The file and folder tiles also mark their picture with `file-thumbnail`.

## Related

- [`TileContainer`](tile-container/README.md) — the grid, and the piece that does the sorting.
- [`BaseTile`](base-tile/README.md) — the shell to build a tile of your own on.
- [`Rows`](../rows/README.md) — the same listing as rows instead of cards.
