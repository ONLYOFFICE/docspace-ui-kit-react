# Chat

A full-featured AI chat interface component for DocSpace. Provides real-time streaming conversations with AI agents, message history management, file attachments, and integrated AI tools.

## Features

- **Real-time AI Conversations**: Streaming chat responses with live updates
- **Message History**: Persistent chat history with support for multiple conversations
- **File Attachments**: Attach files to messages (multimodal support)
- **AI Tools Integration**: Web search, knowledge base search, document generation
- **Chat Management**: Create, rename, delete, and switch between chats
- **Rich Content**: Markdown rendering with code blocks and syntax highlighting
- **Draft Persistence**: Optional draft message persistence across sessions
- **Customizable Layout**: Adjustable width, height, and styling options

## Installation

```tsx
import Chat from "@docspace/ui-kit/ai-agent/chat";
```

## Requirements

### ApiProvider

The Chat component requires your application to be wrapped in a configured `ApiProvider` to handle API requests and authentication.

```tsx
import { ApiProvider } from "@docspace/ui-kit/providers/api";

function App() {
  return (
    <ApiProvider url="https://your-docspace-url.com" apiKey="your-api-key">
      <YourApp />
    </ApiProvider>
  );
}
```

**Required parameters:**
- `url` — Base URL of your DocSpace portal
- `apiKey` — API key for authentication

### AI Agent Configuration

A configured AI agent must be set up in your DocSpace portal before using the Chat component. The `agentId` prop should reference an existing agent that the user has access to.

## Usage

### Basic Example

```tsx
import Chat from "@docspace/ui-kit/ai-agent/chat";

const MyComponent = () => {
  return (
    <Chat agentId={123} />
  );
};
```

### With All Features Enabled

```tsx
<Chat
  agentId={123}
  width="100%"
  height="100vh"
  persistDraft={true}
  allowExternalNavigation={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  onSendMessage={(message, files) => console.log(message, files)}
  onStopStream={() => console.log("Stream stopped")}
  onStreamData={(chunk) => console.log(chunk)}
  onNewChat={() => console.log("New chat created")}
  onSelectChat={(chatId) => console.log("Chat selected:", chatId)}
/>
```

### With Custom Dimensions

```tsx
<Chat
  agentId={123}
  width="800px"
  height="600px"
/>
```

### External Initialization Mode

```tsx
import Chat from "@docspace/ui-kit/ai-agent/chat";

const MyComponent = ({
  agentId,
  selectedModel,
  aiReady,
  initChats,
  messagesSettings,
  toolsSettings,
  modelAliases,
}) => {
  return (
    <Chat
      internalInit={false}
      agentId={agentId}
      selectedModel={selectedModel}
      aiReady={aiReady}
      initChats={initChats}
      messagesSettings={messagesSettings}
      toolsSettings={toolsSettings}
      modelAliases={modelAliases}
    />
  );
};
```

## Properties

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `agentId` | `string \| number` | ✅ | - | ID of the AI agent to chat with |
| `userAvatar` | `string` | - | - | URL or path to the user's avatar image |
| `selectedModel` | `string` | When `internalInit=false` | - | ID of the selected AI model (auto-computed when `internalInit=true`) |
| `aiReady` | `boolean` | When `internalInit=false` | - | Whether AI is configured and ready (auto-computed when `internalInit=true`) |
| `attachmentFile` | `Partial<TFile> \| null` | - | - | Currently attached file |
| `clearAttachmentFile` | `() => void` | - | - | Callback to clear the attached file |
| `getIcon` | `TGetIcon` | - | - | Function to get file/folder icons |
| `getResultStorageId` | `() => number \| null` | - | - | Function to get storage ID for results |
| `isLoading` | `boolean` | - | `false` | Loading state indicator |
| `toolsSettings` | `ReturnType<typeof useToolsSettings>` | - | - | AI tools configuration (auto-initialized if `internalInit=true`) |
| `initChats` | `ReturnType<typeof useInitChats>` | - | - | Chat initialization data (auto-initialized if `internalInit=true`) |
| `messagesSettings` | `Omit<ReturnType<typeof useInitMessages>, "initMessages">` | - | - | Messages configuration (auto-initialized if `internalInit=true`) |
| `isAdmin` | `boolean` | - | `false` | Whether the current user is a portal admin |
| `standalone` | `boolean` | - | `false` | Whether running in standalone mode |
| `multimodal` | `TMultimodal` | - | - | Multimodal configuration for file attachments |
| `goToAISettings` | `() => void` | - | - | Callback to navigate to AI settings |
| `goToWebSearchSettings` | `() => void` | - | - | Callback to navigate to web search settings |
| `setAiPlaylistImages` | `(value: TChatPlaylistImage[]) => void` | - | - | Callback to set playlist images for media viewer |
| `setMediaViewerVisible` | `(value: boolean) => void` | - | - | Callback to show/hide media viewer |
| `useInternalScroll` | `boolean` | - | `true` | Whether to use internal scrolling |
| `width` | `string` | - | `"100%"` | Width of the chat container (CSS value) |
| `height` | `string` | - | `"100%"` | Height of the chat container (CSS value) |
| `style` | `React.CSSProperties` | - | - | Inline styles for the container |
| `persistDraft` | `boolean` | - | `false` | Persist draft messages across sessions |
| `internalInit` | `boolean` | - | `true` | Use internal initialization (auto-fetch data) |
| `allowExternalNavigation` | `boolean` | - | `false` | Allow navigation to external links and resources |
| `allowAttachFiles` | `boolean` | - | `false` | Enable file attachment functionality |
| `allowManageTools` | `boolean` | - | `false` | Allow users to manage AI tools and settings |
| `allowSelectChat` | `boolean` | - | `false` | Enable chat selection and switching |
| `onSendMessage` | `(message: string, files: Partial<TFile>[]) => void` | - | - | Called when a message is sent |
| `onStopStream` | `() => void` | - | - | Called when the user stops an AI response stream |
| `onStreamData` | `(chunk: string) => void` | - | - | Called with each chunk of streaming data |
| `onNewChat` | `() => void` | - | - | Called when a new chat is created |
| `onSelectChat` | `(chatId: string) => void` | - | - | Called when a different chat is selected |
| `modelAliases` | `TAIConfig["modelAliases"]` | - | - | Model name aliases for display |

## Initialization Modes

The Chat component supports two initialization modes:

### Internal Initialization (Default)

When `internalInit={true}` (default), the component automatically:
- Fetches chat list
- Loads messages
- Retrieves AI configuration and computes `aiReady` state
- Retrieves chat settings and computes `selectedModel`
- Initializes tool settings

```tsx
<Chat agentId={123} />
```

**Note:** When using internal initialization, you don't need to provide `aiReady` or `selectedModel` — they are computed automatically from the API.

### External Initialization

When `internalInit={false}`, you must provide:
- `selectedModel`: ID of the selected AI model
- `aiReady`: Whether AI is configured and ready
- `initChats`: Chat initialization data (use `useInitChats` hook)
- `messagesSettings`: Messages configuration (use `useInitMessages` hook)
- `toolsSettings`: Tools configuration (use `useToolsSettings` hook)

This mode is useful when you want to control data fetching externally. You can use the chat's built-in hooks:

```tsx
import useInitChats from "@docspace/ui-kit/ai-agent/chat/hooks/useInitChats";
import useInitMessages from "@docspace/ui-kit/ai-agent/chat/hooks/useInitMessages";
import useToolsSettings from "@docspace/ui-kit/ai-agent/chat/hooks/useToolsSettings";

const initChats = useInitChats({ agentId: 123 });
const { initMessages, ...messagesSettings } = useInitMessages(123);
const toolsSettings = useToolsSettings({ agentId: 123, aiConfig, chatSettings });

<Chat
  agentId={123}
  internalInit={false}
  selectedModel="gpt-4"
  aiReady={true}
  initChats={initChats}
  messagesSettings={messagesSettings}
  toolsSettings={toolsSettings}
/>
```

## Hooks

The Chat component exports several hooks that can be used for external initialization:

```tsx
import useInitChats from "@docspace/ui-kit/ai-agent/chat/hooks/useInitChats";
import useInitMessages from "@docspace/ui-kit/ai-agent/chat/hooks/useInitMessages";
import useToolsSettings from "@docspace/ui-kit/ai-agent/chat/hooks/useToolsSettings";
import useAiConfig from "@docspace/ui-kit/ai-agent/chat/hooks/useAiConfig";
import useChatSettings from "@docspace/ui-kit/ai-agent/chat/hooks/useChatSettings";
import useGetIcon from "@docspace/ui-kit/ai-agent/chat/hooks/useGetIcon";
```

### Hook Descriptions

- **`useInitChats`**: Manages chat list fetching and state
- **`useInitMessages`**: Handles message initialization and loading
- **`useToolsSettings`**: Configures AI tools (web search, knowledge base, etc.)
- **`useAiConfig`**: Fetches AI configuration and provides `aiReady` state
- **`useChatSettings`**: Retrieves chat-specific settings
- **`useGetIcon`**: Provides icon resolution functionality

## Supported File Formats

The component exports `CHAT_SUPPORTED_FORMATS` constant containing all supported file formats for attachments.

```tsx
import { CHAT_SUPPORTED_FORMATS } from "@docspace/ui-kit/ai-agent/chat";
```

## Examples

### Read-Only Chat (No File Attachments)

```tsx
<Chat
  agentId={123}
  allowAttachFiles={false}
  allowManageTools={false}
/>
```

### Full-Featured Chat with Callbacks

```tsx
const handleSendMessage = (message: string, files: Partial<TFile>[]) => {
  console.log("Message:", message);
  console.log("Attached files:", files);
};

const handleStreamData = (chunk: string) => {
  console.log("Streaming chunk:", chunk);
};

const handleNewChat = () => {
  console.log("New chat created");
};

<Chat
  agentId={123}
  persistDraft={true}
  allowExternalNavigation={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  onSendMessage={handleSendMessage}
  onStreamData={handleStreamData}
  onNewChat={handleNewChat}
  onSelectChat={(chatId) => console.log("Selected:", chatId)}
  onStopStream={() => console.log("Stream stopped")}
/>
```

### Responsive Container

```tsx
function ResponsiveChat() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Chat
        agentId={123}
        width="100%"
        height="100%"
      />
    </div>
  );
}
```

## Best Practices

1. **Agent ID**: Always provide a valid agent ID that the user has access to
2. **Initialization Mode**: Use internal initialization (default) unless you need custom data fetching control
3. **Auto-computed Props**: When using internal initialization, `selectedModel` and `aiReady` are computed automatically
4. **External Initialization**: When `internalInit=false`, you must provide `selectedModel` and `aiReady`
5. **File Attachments**: Set `allowAttachFiles={true}` only if multimodal is supported
6. **Draft Persistence**: Enable `persistDraft` for better user experience in long sessions
7. **Callbacks**: Implement `onSendMessage` and `onStreamData` for custom message handling
8. **External Navigation**: Enable `allowExternalNavigation` carefully based on security requirements
9. **Error Handling**: Monitor the loading states and handle errors appropriately

## Common Use Cases

### Embedded AI Assistant

```tsx
<Chat
  agentId={123}
  width="400px"
  height="600px"
  persistDraft={true}
  allowSelectChat={true}
/>
```

### Full-Screen Chat Interface

```tsx
<Chat
  agentId={123}
  width="100vw"
  height="100vh"
  allowExternalNavigation={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
/>
```

### Chat with Custom Tool Settings

```tsx
<Chat
  agentId={123}
  allowManageTools={true}
  goToWebSearchSettings={() => navigate("/settings/web-search")}
  goToAISettings={() => navigate("/settings/ai")}
/>
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with initialization logic and rendering |
| `Chat.types.ts` | TypeScript type definitions for all props and internal types |
| `Chat.constants.ts` | Constants including `CHAT_SUPPORTED_FORMATS` |
| `store/chatStore.tsx` | MobX store for chat management |
| `store/messageStore.tsx` | MobX store for message handling and streaming |
| `components/chat-header/` | Header with chat switching |
| `components/chat-message-body/` | Message list with scrolling and rendering |
| `components/chat-footer/` | Input area with file attachments and tools |
| `hooks/useInitChats.ts` | Hook for initializing chat list |
| `hooks/useInitMessages.ts` | Hook for initializing messages |
| `hooks/useToolsSettings.ts` | Hook for AI tools configuration |

## Troubleshooting

### Chat Not Loading

- Verify `agentId` is valid and accessible
- For external initialization, ensure init data is provided

### Messages Not Appearing

- Check that messages are being fetched correctly
- Ensure `internalInit={true}` or provide `messagesSettings` manually
- Monitor console for API errors

### File Attachments Not Working

- Set `allowAttachFiles={true}`
- Provide valid `multimodal` configuration
- Ensure `attachmentFile` and `clearAttachmentFile` are properly managed
- Check supported file formats in `CHAT_SUPPORTED_FORMATS`

### Streaming Issues

- Implement `onStreamData` callback to monitor stream chunks
- Check network connectivity and API endpoints
