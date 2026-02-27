# AIAgent Selector

A selector component for choosing AI Agents from the DocSpace system. Provides a searchable, paginated list of available AI agents with real-time WebSocket updates.

## What It Does

- Displays a list of AI agents in a selector panel with search functionality
- Supports single-select mode — the user picks one agent at a time
- Filters out excluded items via `excludeItems` prop
- Enforces security: agents without `UseChat` permission are not selectable
- Shows an info bar prompting the user to choose an agent
- Supports SSR initialization with pre-fetched data (`withInit`)
- Subscribes to WebSocket events for real-time list updates (e.g., new agents created)

## Import

```tsx
import AIAgentSelector from "@docspace/ui-kit/selectors/AIAgent";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(items: TSelectorItem[]) => void \| Promise<void>` | Yes | Callback when an agent is selected and submitted |
| `onClose` | `() => void` | Yes | Callback to close the selector |
| `id` | `string` | No | HTML id attribute |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |
| `excludeItems` | `(number \| string \| undefined)[]` | No | IDs of agents to exclude from the list |
| `setIsDataReady` | `(value: boolean) => void` | No | Callback indicating when data has finished loading |
| `withPadding` | `boolean` | No | Whether to add padding to the selector |
| `disableBySecurity` | `string` | No | Security property key to check; disables items that lack the permission |
| `withInit` | `boolean` | No | Enable SSR mode with pre-fetched data |
| `initItems` | `FolderDtoInteger[]` | When `withInit=true` | Pre-fetched items for SSR |
| `initTotal` | `number` | When `withInit=true` | Total count for SSR |
| `initHasNextPage` | `boolean` | When `withInit=true` | Whether more pages exist for SSR |
| `initSearchValue` | `string` | No | Initial search value for SSR |

## Usage

```tsx
import AIAgentSelector from "@docspace/ui-kit/selectors/AIAgent";

const MyComponent = () => {
  const handleSubmit = (items) => {
    const selectedAgent = items[0];
    console.log("Selected agent:", selectedAgent);
  };

  return (
    <AIAgentSelector
      onSubmit={handleSubmit}
      onClose={() => setIsOpen(false)}
      excludeItems={[currentAgentId]}
    />
  );
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with selector logic and rendering |
| `AIAgent.types.ts` | TypeScript type definitions for props |
| `AIAgent.utils.ts` | `convertToItems` utility — transforms `FolderDtoInteger[]` into `TSelectorItem[]` |
