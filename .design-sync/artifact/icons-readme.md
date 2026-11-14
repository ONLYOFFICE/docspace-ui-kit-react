# Icons

The kit's own icon files, from `assets/icons/` of `@onlyoffice/apps-ui-kit`,
uploaded one for one. The product draws the same files, so use these instead
of drawing an icon yourself. The name of each tile is its path below this
group: the folder is the size in pixels.

| Folder              | What is in it                                                                           | Where the product uses it                                      |
| ------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `16/catalog.*`      | left navigation: rooms, documents, favorites, archive, trash, private, developer tools  | `Article` items, 16px beside the label                         |
| `16/`, `24/` others | actions (copy, move, download, upload, delete, refresh, dots) and small file types      | context menus, toolbars, group menus                           |
| `24/`, `32/`        | file types: `word`, `cell`, `slide`, `pdf`, `form`, `folder`, `image`, `video` and more | table rows (32px) and compact lists (24px)                     |
| `64/`, `96/`        | the same file types, large                                                              | tiles and empty states                                         |
| `32/room/`          | room types: collaboration editing, custom, public, form, virtual data, AI, private      | room logos without an uploaded picture, the create-room dialog |
| `32/template/`      | room templates                                                                          | the templates list                                             |
| `10/`, `12/`, `17/` | badges and small controls                                                               | inside components                                              |

`*Common.svg` (`wordCommon`, `cellCommon`, `slideCommon`) is the generic
variant of a format; `word`, `cell`, `slide` are the format icons proper
(DOCX, XLSX, PPTX).

## Using one

- An icon here is an uploaded picture, kept by id. On a canvas or in another
  artifact, read it by its id and upload it to your own artifact, then put
  the url your upload returned in an `<img>`.
- Format, room and template icons are multi-coloured: use them as they are.
- Navigation and action icons are drawn in fixed greys (`#657077`,
  `#555F65`), so an `<img>` cannot follow the theme or turn accent blue on
  the active navigation item. To colour one, use it as a mask on an element
  that takes the text colour:
  `mask: url(<your url>) center / contain no-repeat; background-color: currentColor;`
  (with `-webkit-mask` too).
- An icon you need that is not here is not in the kit either. Draw a
  placeholder at the real size and say so in your hand-over.
