# Groups Selector

A selector component for choosing user groups from the DocSpace system. Provides a searchable, paginated list of groups.

## What It Does

- Displays a list of user groups in a selector panel
- Supports single-select mode — the user picks one group
- Provides search with automatic list reset and re-fetch
- Loads groups in paginated batches of 100
- Supports rendering inside an Aside panel or inline
- Uses the DocSpace Groups API (`groupApi.getGroups`) to fetch data

## Import

```tsx
import GroupsSelector from "@docspace/ui-kit/selectors/Groups";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(selectedItems: TSelectorItem[], access?, fileName?, isFooterCheckboxChecked?) => void \| Promise<void>` | Yes | Callback when a group is selected and submitted |
| `id` | `string` | No | HTML id attribute |
| `className` | `string` | No | CSS class name |
| `withHeader` | `boolean` | No | Show the header |
| `headerProps` | `TSelectorHeaderProps` | No | Header configuration (label, close button, etc.) |
| `useAside` | `boolean` | No | Render inside an Aside panel with backdrop |
| `onClose` | `() => void` | No | Callback to close the selector (required when `useAside=true`) |
| `withoutBackground` | `boolean` | No | Aside without background overlay |
| `withBlur` | `boolean` | No | Apply blur effect to the backdrop |

## Usage

```tsx
import GroupsSelector from "@docspace/ui-kit/selectors/Groups";

const AssignGroupDialog = () => {
  const handleSubmit = (items) => {
    const selectedGroup = items[0];
    console.log("Selected group:", selectedGroup.id, selectedGroup.label);
  };

  return (
    <GroupsSelector
      useAside
      onClose={() => setIsOpen(false)}
      withHeader
      headerProps={{
        headerLabel: "Select Group",
        onCloseClick: () => setIsOpen(false),
      }}
      onSubmit={handleSubmit}
    />
  );
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with group fetching, search, and selector rendering |
| `GroupsSelector.types.ts` | TypeScript type definitions for props |
