# ONLYOFFICE Apps screens: layout guide

How the real ONLYOFFICE Apps screens are put together from this kit, measured
from 82 screenshots of the product (1440x900, light theme, fake data). The
pictures themselves are in the project under `screenshots/` - open the one
closest to what you are building (index at the end). Sizes are read off the
images and are approximate; component defaults win over these numbers, and
colours below are for orientation - use the components and theme tokens, not
hex values.

## App shell

```
+--------------+------------------------------------------------------+
| Article      | Section header (70px): title, actions, info toggle   |
| 252px        +------------------------------------------------------+
| nav          | toolbar (32px): + New | FilterInput search | filter  |
|              |                 sort | view                          |
|              | table / tiles / settings column                      |
|              |                                                      |
| Dev Tools    |                                    [Info panel 400px]|
| user footer  |                                                      |
+--------------+------------------------------------------------------+
```

- **Left navigation (`Article`)**: 252px wide, light grey surface, 1px right
  border, 20px side padding. Top row: `PortalLogo` + collapse `IconButton`.
  Items 36px tall: 16px icon + 13-14px semi-bold label; the active item is a
  grey pill (radius 3px) with accent-blue icon and label; sub-items indent 24px.
  Group captions ("Apps") 12px grey; `Badge` "BETA" as a violet pill. Footer:
  a 40px light-blue "Developer Tools" bar, then a 72px user block - `Avatar`
  40px, name, `ContextMenuButton` (its menu opens upward).
- People and Settings swap the tree for a "Back" item plus a flat list of
  their sections, same item styles.
- **Content** starts 20px right of the nav (x=272) with a 20px right gutter.

## Section header (70px)

- Title: `Heading`, ~20px bold. Inside a folder or room, `Navigation`: back
  arrow, title, caret, `ContextMenuButton`.
- Right side: a light-blue "AI Chat" button and the info-panel `IconButton`
  toggle at the far right edge.

## Lists: toolbar + table

- Toolbar 32px: primary `MainButton` / `Button` "+ New", "+ New room",
  "+ Invite" (32px, accent blue), then `FilterInput` (search fills the width),
  then three 32px square `IconButton`s - filter, sort, view switch - 8px gaps.
- `TableContainer` / `TableHeader` / `TableRow`: header labels 12-13px
  semi-bold grey with column resize ticks and a settings gear at the end; rows
  48px with a 1px light divider. First cell: 32px file icon / `RoomLogo` /
  `Avatar` + 14px semi-bold name; other cells 12-13px semi-bold grey. Row end:
  quick action (link, star) + `ContextMenuButton`. Hover and selection paint
  the full row light grey; selecting rows replaces the header with
  `TableGroupMenu`.
- The tile view uses `FileTile` / `FolderTile` / `RoomTile` in a
  `TileContainer`; `Tag`s on rooms are outlined grey.
- Files, Rooms and Forms show a strip of create tiles (~184x146, light grey,
  radius 6-12px) above the toolbar - **not a kit component**; build it from
  plain boxes if needed. Read-only roles do not see it.

## Menus

- `ContextMenu` ~160px wide, white, radius 6px, soft shadow; items 36px with a
  16px icon + 13px semi-bold label; submenus open to the right with a chevron;
  separators between groups in this order: select/open/edit -> share / move /
  download / rename -> favourite / more -> delete (last).
- `DropDown` lists with descriptions (user types): ~354px wide, 66px items -
  13px semi-bold title + 12px grey description; the current item is grey.
  User type and access pickers are `AccessRightSelect`.

## Panels and dialogs

- **Info panel**: docked on the right, 400px, full height, left border, no
  backdrop. Header "Info" 20px bold + close; `Tabs` (accent underline) for
  Contacts / History / Details; 20px padding. Member rows 48px: `Avatar` 32px,
  14px name, 12px grey "role | email", `AccessRightSelect` on the right.
- **Side dialog** (create room, invite, share, profile edit): `Aside` 480px
  from the right over a `Backdrop`; `AsideHeader` 52px (title ~21px bold,
  close, optional back arrow); body 16px padding; sticky 72px footer with two
  equal 40px `Button`s - primary + secondary (disabled primary is pale blue).
- **Centred dialog**: `ModalDialog` ~520px, radius 6px, 52px header with
  divider.
- Notifications: `Toast` top-right.

## Settings pages

- Page title at the top, `Tabs` under it (13-14px, active = accent blue with a
  3px underline, full-width divider below).
- Content column capped at ~660-700px. Each tab: 13px grey description + an
  underlined `Link` "Learn more", then sections with 16px bold headings,
  1px dividers, ~30-35px vertical rhythm.
- Fields: `FieldContainer` with the label above (13px semi-bold, red asterisk
  when required), `TextInput` / `PasswordInput` / `ComboBox` 350x32, 11-12px
  grey hint below, ~20px between groups. Switch rows: `ToggleButton` + bold
  label + 12px grey description, often in a light grey card (radius 6px,
  12-16px padding). `RadioButtonGroup` 26-32px per option, `Checkbox` 24px.
- Every section ends with Save (primary) + Cancel 32px `Button`s, 8px apart;
  Save stays disabled until something changes.
- Option cards (integrations, data import, embed modes): bordered boxes,
  radius 6px, 16-20px padding, two columns of ~340px with 20px gaps.

## Empty states

- `EmptyView` / `EmptyScreenContainer` centred in the content area ~130-150px
  below the header: illustration ~100-180px, 16px bold title, 12-13px grey
  description (max ~460px), optional primary `Button` or icon `Link`. The
  toolbar is hidden when there is nothing to filter.
- Developer tools and AI models use a text-only variant: description, guide
  link, one primary `Button`.

## Sign-in and first-run wizard

- No app shell. A centred white card ~384px wide, radius 12px, 32px padding
  over a wavy background; 44px inputs, full-width 44px primary `Button`,
  16px vertical gaps.

## Typography and colour at a glance

- Open Sans; sizes 11 / 12 / 13 / 14 / 16 / 20px; labels and names are
  semi-bold (600), headings bold (700).
- Accent blue for primary buttons, active nav, tabs, links and toggles (from
  `currentColorScheme`); text near-black, secondary text grey, muted grey for
  table headers; light grey surfaces for the nav and cards; room logos are
  saturated letter tiles.

## Screen index

| Picture                                                        | What it shows                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `screenshots/01-wizard-empty.png`                              | First-run wizard, empty                                                                |
| `screenshots/02-wizard-filled.png`                             | Wizard filled: owner e-mail, password, language, time zone, licence accepted           |
| `screenshots/03-after-wizard.png`                              | Home right after the wizard; owner e-mail not activated yet                            |
| `screenshots/05-email-activated.png`                           | Home after the e-mail activation link was opened                                       |
| `screenshots/06-login-page.png`                                | Sign-in page                                                                           |
| `screenshots/10-home-dashboard.png`                            | Home (Dashboard) of the owner                                                          |
| `screenshots/11-files-my-documents.png`                        | Files (My documents) with folders, documents, uploads, a favourite and a shared file   |
| `screenshots/12-rooms-list.png`                                | Rooms list: Collaboration, Custom, VDR and Public rooms with tags                      |
| `screenshots/13-room-collaboration-contents.png`               | Collaboration room "Q4 Marketing Campaign" contents                                    |
| `screenshots/14-room-custom-vendor-contracts.png`              | Custom room "Vendor Contracts"                                                         |
| `screenshots/15-room-vdr-investor.png`                         | Virtual Data Room "Investor Data Room" with indexed folders                            |
| `screenshots/16-room-public-press-kit.png`                     | Public room "Press Kit 2026"                                                           |
| `screenshots/17-forms-section.png`                             | Forms section with the Form filling room                                               |
| `screenshots/18-form-filling-room.png`                         | Form filling room: Complete / In process folders and a PDF form                        |
| `screenshots/19-rooms-archive.png`                             | Rooms archive with an archived room                                                    |
| `screenshots/20-files-trash.png`                               | Trash with a deleted document                                                          |
| `screenshots/21-files-favorites.png`                           | Favorite files                                                                         |
| `screenshots/22-files-recent.png`                              | Recent files (empty)                                                                   |
| `screenshots/23-shared-with-me.png`                            | Shared with me (owner: empty)                                                          |
| `screenshots/24-rooms-templates.png`                           | Room templates (empty)                                                                 |
| `screenshots/25-private-rooms.png`                             | Private rooms (Beta), empty                                                            |
| `screenshots/26-ai-rooms.png`                                  | AI rooms: no AI provider configured                                                    |
| `screenshots/27-rooms-trash.png`                               | Rooms trash                                                                            |
| `screenshots/30-people-members.png`                            | Members: owner, Full admin, Room admins, Users, pending invitations                    |
| `screenshots/31-people-groups.png`                             | Groups with heads of group                                                             |
| `screenshots/32-people-guests.png`                             | Guests invited to rooms by e-mail (pending)                                            |
| `screenshots/33-profile.png`                                   | My profile: login settings and active sessions                                         |
| `screenshots/34-profile-notifications.png`                     | My profile: notification switches                                                      |
| `screenshots/35-profile-menu.png`                              | Profile menu                                                                           |
| `screenshots/40-settings-customization-general.png`            | Customization: language, time zone, welcome page, DNS                                  |
| `screenshots/41-settings-customization-document-templates.png` | Customization: document templates                                                      |
| `screenshots/42-settings-customization-appearance.png`         | Customization: appearance (colour theme)                                               |
| `screenshots/43-settings-security-access.png`                  | Security: external sharing links, password strength, 2FA, trusted domains, IP rules... |
| `screenshots/44-settings-customization-metadata-templates.png` | Customization: metadata templates                                                      |
| `screenshots/48-settings-security-login-history.png`           | Security: login history                                                                |
| `screenshots/49-settings-security-audit-trail.png`             | Security: audit trail with the actions done while seeding                              |
| `screenshots/50-settings-backup.png`                           | Backup: manual data backup                                                             |
| `screenshots/51-settings-auto-backup.png`                      | Backup: automatic backup                                                               |
| `screenshots/52-settings-restore.png`                          | Restore                                                                                |
| `screenshots/53-settings-integration-ldap.png`                 | Integration: LDAP                                                                      |
| `screenshots/54-settings-integration-sso.png`                  | Integration: Single Sign-On                                                            |
| `screenshots/55-settings-integration-third-party.png`          | Integration: third-party services                                                      |
| `screenshots/56-settings-integration-smtp.png`                 | Integration: SMTP settings                                                             |
| `screenshots/57-settings-integration-plugins.png`              | Integration: plugins (upload + installed plugin)                                       |
| `screenshots/58-settings-integration-document-service.png`     | Integration: Document Service                                                          |
| `screenshots/59-settings-data-import.png`                      | Data import sources                                                                    |
| `screenshots/60-settings-storage-management.png`               | Storage management: disk space, quotas, statistics                                     |
| `screenshots/61-settings-ai-models.png`                        | AI settings: AI models                                                                 |
| `screenshots/62-settings-apps.png`                             | Apps: Files, Rooms, Forms, Private switches                                            |
| `screenshots/63-settings-upgrade-bonus.png`                    | Upgrade (Community edition)                                                            |
| `screenshots/65-about-this-program.png`                        | About this program                                                                     |
| `screenshots/70-devtools-js-sdk.png`                           | Developer Tools: Embed SDK                                                             |
| `screenshots/71-devtools-plugin-sdk.png`                       | Developer Tools: Plugin SDK                                                            |
| `screenshots/72-devtools-webhooks.png`                         | Developer Tools: webhooks (none: example.com hosts are refused by DNS check)           |
| `screenshots/73-devtools-oauth.png`                            | Developer Tools: OAuth 2.0 applications                                                |
| `screenshots/74-devtools-api-keys.png`                         | Developer Tools: API keys with the "Reporting integration" key                         |
| `screenshots/91-create-room-choose-type.png`                   | Create room: choose room type                                                          |
| `screenshots/92-create-room-collaboration-form.png`            | Create room: Collaboration room form                                                   |
| `screenshots/93-room-info-members.png`                         | Room info panel: members and their roles, incl. a group                                |
| `screenshots/94-room-info-history.png`                         | Room info panel: history                                                               |
| `screenshots/95-room-info-details.png`                         | Room info panel: details                                                               |
| `screenshots/96-room-context-menu.png`                         | Room actions menu (owner)                                                              |
| `screenshots/97-room-invite-dialog.png`                        | Invite to room: by link or by e-mail with a role                                       |
| `screenshots/98-public-room-links.png`                         | Public room info: shared links                                                         |
| `screenshots/99-vdr-room-info-members.png`                     | VDR members: Room manager, Content creator, Editor, guest Viewer                       |
| `screenshots/100-file-context-menu-share.png`                  | File context menu, Share submenu                                                       |
| `screenshots/101-file-share-panel.png`                         | File sharing settings: shared link and accounts with rights                            |
| `screenshots/102-file-info-panel.png`                          | File info panel                                                                        |
| `screenshots/103-people-invite-menu.png`                       | Invite to the portal: choose user type                                                 |
| `screenshots/104-people-invite-dialog.png`                     | Invite User dialog                                                                     |
| `screenshots/105-people-change-type.png`                       | Change user type menu                                                                  |
| `screenshots/106-people-profile-info.png`                      | Profile info panel of a Room admin                                                     |
| `screenshots/107-group-members.png`                            | Group "Marketing" members                                                              |
| `screenshots/108-create-group-dialog.png`                      | Add group dialog                                                                       |
| `screenshots/109-form-context-menu.png`                        | PDF form context menu in a Form filling room                                           |
| `screenshots/110-document-editor.png`                          | Document editor opened from a room                                                     |
| `screenshots/120-viewer-home.png`                              | User Grace Lee (Viewer in a room) after sign-in, e-mail not activated                  |
| `screenshots/121-viewer-rooms-list.png`                        | Rooms list as User: only rooms she was invited to                                      |
| `screenshots/122-viewer-room-q4-read-only.png`                 | Room as Viewer: no "New" button                                                        |
| `screenshots/123-viewer-forms-room-filler.png`                 | Form filling room as Form filler: sees no forms of others                              |
| `screenshots/124-viewer-files-before-email-activation.png`     | Files of a user whose e-mail is not activated: no access                               |
| `screenshots/125-viewer-file-context-menu.png`                 | File context menu as Viewer                                                            |
