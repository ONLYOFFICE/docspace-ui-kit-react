# People Selector

A feature-rich selector component for choosing users and groups from the DocSpace system. Supports tabs for Members/Groups/Guests, multi-select, access rights, and room-scoped filtering.

## What It Does

- Displays a searchable, paginated list of people (users and/or groups)
- Supports three tabs: **Members**, **Groups**, and **Guests** (configurable)
- Supports both single-select and multi-select modes
- Shows user details: name, email, role, avatar, pending status
- Highlights the current user with a "(Me)" label
- Supports access rights selection with detailed or simple modes
- Filters users by room membership (`roomId`) with shared status
- Can scope to files, folders, or rooms via `targetEntityType`
- Disables already-invited users and terminated users
- Excludes specific users via `excludeItems`
- Optionally removes the current authorized user from the list
- Supports custom filter functions for employee status and area
- Handles request cancellation via AbortController

## Import

```tsx
import PeopleSelector from "@docspace/ui-kit/selectors/People";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(selectedItems, access?, fileName?, isFooterCheckboxChecked?) => void \| Promise<void>` | Yes | Callback with selected items |
| `id` | `string` | No | HTML id attribute |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |
| `isMultiSelect` | `boolean` | No | Enable multi-select mode |
| `currentUserId` | `string` | No | ID of the currently logged-in user (shown with "Me" label) |
| `filterUserId` | `string` | No | User ID to filter out from the list |
| `withOutCurrentAuthorizedUser` | `boolean` | No | Remove current user from the list entirely |
| `excludeItems` | `string[]` | No | User IDs to exclude from results |
| `disableInvitedUsers` | `string[]` | No | User IDs to show as disabled (already invited) |
| `disableDisabledUsers` | `boolean` | No | Disable terminated users in the list |
| `filter` | `PeopleFilter \| (() => PeopleFilter)` | No | Filter by employee status, area, includeShared |
| `roomId` | `string \| number` | No | Scope to users/groups with access to this room |
| `targetEntityType` | `"file" \| "folder" \| "room"` | No | Entity type for shared-access queries (default: `"room"`) |
| `withGroups` | `boolean` | No | Show the Groups tab |
| `isGroupsOnly` | `boolean` | No | Only show groups (no people tab) |
| `withGuests` | `boolean` | No | Show the Guests tab |
| `isGuestsOnly` | `boolean` | No | Only show guests |
| `withAccessRights` | `boolean` | No | Enable access rights dropdown |
| `accessRights` | `TAccessRight[]` | No | Available access right options |
| `selectedAccessRight` | `TAccessRight` | No | Currently selected access right |
| `onAccessRightsChange` | `(right: TAccessRight) => void` | No | Callback when access right changes |
| `accessRightsMode` | `SelectorAccessRightsMode` | No | Display mode for access rights (default: Detailed) |
| `withHeader` | `boolean` | No | Show header |
| `headerProps` | `TSelectorHeaderProps` | When `withHeader=true` | Header configuration |
| `withCancelButton` | `boolean` | No | Show cancel button |
| `cancelButtonLabel` | `string` | No | Label for cancel button |
| `onCancel` | `() => void` | No | Callback on cancel |
| `withInfo` | `boolean` | No | Show info text |
| `infoText` | `string` | No | Info message to display |
| `withFooterCheckbox` | `boolean` | No | Show checkbox in footer |
| `footerCheckboxLabel` | `string` | No | Label for footer checkbox |
| `isChecked` | `boolean` | No | Default checked state |
| `useAside` | `boolean` | No | Render in an Aside panel |
| `onClose` | `() => void` | No | Close callback for Aside |
| `submitButtonLabel` | `string` | No | Custom submit button text |
| `disableSubmitButton` | `boolean` | No | Force-disable the submit button |
| `emptyScreenHeader` | `string` | No | Custom empty state header |
| `emptyScreenDescription` | `string` | No | Custom empty state description |
| `checkIfUserInvited` | `(user: EmployeeFullDto) => boolean` | No | Custom function to check if a user is already invited |
| `onlyRoomMembers` | `boolean` | No | Only show room members |
| `isAgent` | `boolean` | No | Adjusts empty screen text for AI agent context |

## Usage

```tsx
import PeopleSelector from "@docspace/ui-kit/selectors/People";

const InviteUsersDialog = () => {
  const handleSubmit = (items, access) => {
    inviteUsers(items.map((i) => i.id), access);
  };

  return (
    <PeopleSelector
      isMultiSelect
      withHeader
      headerProps={{
        headerLabel: "Add Members",
        onCloseClick: handleClose,
      }}
      withGroups
      withGuests
      withAccessRights
      accessRights={availableRights}
      selectedAccessRight={defaultRight}
      onAccessRightsChange={setSelectedRight}
      roomId={roomId}
      currentUserId={currentUser.id}
      excludeItems={existingMemberIds}
      disableInvitedUsers={invitedUserIds}
      useAside
      onClose={handleClose}
      onSubmit={handleSubmit}
      withCancelButton
      onCancel={handleClose}
    />
  );
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with tabs, user/group fetching, search, custom item rendering |
| `PeopleSelector.types.ts` | TypeScript definitions for all props including `PeopleFilter`, `ContactsSelectorGroups`, `ContactsSelectorGuests` |
| `PeopleSelector.module.scss` | Styles for the "(Me)" label |
| `components/SendClockIcon.tsx` | Clock icon component shown for pending (invited) users |
