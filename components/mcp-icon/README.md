# MCPIcon

An icon component for MCP (Model Context Protocol) with configurable size options. Displays either a custom image or the first letter of the title as a fallback.

## Usage

```tsx
import { MCPIcon, MCPIconSize } from "@docspace/ui-kit/components/mcp-icon";

// Icon with text fallback
<MCPIcon
  title="DocSpace MCP"
  size={MCPIconSize.Large}
/>

// Icon with custom image
<MCPIcon
  title="Hugging Face"
  size={MCPIconSize.Medium}
  imgSrc="https://example.com/icon.svg"
/>
```

## Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Title text for the icon (required). First character is displayed when no image |
| `size` | `MCPIconSize` | `MCPIconSize.Large` | Size of the icon |
| `imgSrc` | `string` | - | Image source URL for the icon |
| `className` | `string` | - | Additional CSS class name |
| `dataTestId` | `string` | `"mcp-icon"` | Test ID for automated testing |

## MCPIconSize

| Value | Dimensions |
|-------|------------|
| `Small` | 16x16px |
| `Medium` | 24x24px |
| `Big` | 32x32px |
| `Large` | 48x48px |
