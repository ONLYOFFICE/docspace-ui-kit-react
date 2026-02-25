# MCPServers Selector

A selector component for choosing available MCP (Model Context Protocol) servers. Allows multi-select of servers to connect AI agents to external tools and services.

## What It Does

- Fetches and displays a list of available MCP servers from the DocSpace AI API
- Supports multi-select mode — users can select/deselect multiple servers
- Pre-selects servers that are already connected (`initedSelectedServers`)
- Handles paginated loading of servers in batches of 100
- Disables servers that need a reset (`needReset` flag)
- Shows server icons with fallback to portal logo for Portal-type servers
- Supports four server types: Custom, Portal, GitHub, Box

## Import

```tsx
import MCPServersSelector from "@docspace/ui-kit/selectors/MCPServers";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(servers: TSelectorItem[]) => void` | Yes | Callback with the selected servers when submitted |
| `onClose` | `VoidFunction` | Yes | Callback to fully close the selector |
| `onBackClick` | `VoidFunction` | Yes | Callback for the back button (navigates to previous view) |
| `initedSelectedServers` | `string[]` | No | IDs of servers that should be pre-selected |

## Usage

```tsx
import MCPServersSelector from "@docspace/ui-kit/selectors/MCPServers";

const AIAgentSettings = () => {
  const handleSubmit = (servers) => {
    const serverIds = servers.map((s) => s.id);
    saveConnectedServers(serverIds);
  };

  return (
    <MCPServersSelector
      onSubmit={handleSubmit}
      onClose={() => setIsOpen(false)}
      onBackClick={() => navigateBack()}
      initedSelectedServers={currentServerIds}
    />
  );
};
```

## Server Types

```tsx
enum ServerType {
  Custom,   // Custom MCP server
  Portal,   // DocSpace portal server (uses portal logo)
  GitHub,   // GitHub integration
  Box,      // Box integration
}
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with server fetching, multi-select logic, and rendering. Also exports `ServerType` enum and `TServer` type |
