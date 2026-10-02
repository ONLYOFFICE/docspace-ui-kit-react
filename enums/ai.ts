export enum ServerType {
  Custom,
  Portal,
  GitHub,
  Box,
}

// Canonical AI provider type. Re-exported from @docspace/shared/api/ai/enums
// for shared consumers; lives here because ui-kit must not depend on shared.
export enum ProviderType {
  PortalAi = 0,
  OpenAi = 1,
  TogetherAi = 2,
  OpenAiCompatible = 3,
  Anthropic = 4,
  OpenRouter = 5,
  DeepSeek = 6,
  XAi = 7,
  Google = 8,
}

export enum ContentType {
  Text = 0,
  Tool = 1,
  Files = 2,
  Images = 3,
}

export enum RoleType {
  UserMessage = 0,
  AssistantMessage = 1,
  Error = 10,
}

export enum EventType {
  MessageStart = "message_start",
  MessageStop = "message_stop",
  NewToken = "new_token",
  Reasoning = "reasoning",
  ToolCall = "tool_call",
  ToolResult = "tool_result",
  Error = "error",
}

export enum ChatReasoningEffort {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  XHigh = 4,
}
