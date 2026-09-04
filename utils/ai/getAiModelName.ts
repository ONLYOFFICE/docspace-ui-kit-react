const MODEL_NAME_MAP: Record<string, string> = {
  // xAI
  "x-ai/grok-4": "Grok 4",
  "x-ai/grok-4.1-fast": "Grok 4.1 Fast",
  "grok-4-1-fast-reasoning": "Grok 4.1 Fast Reasoning",
  "grok-4-1-fast-non-reasoning": "Grok 4.1 Fast",

  // DeepSeek
  "deepseek-chat": "DeepSeek Chat",
  "deepseek-reasoner": "DeepSeek Reasoner",
  "deepseek-ai/DeepSeek-V3.1": "DeepSeek V3.1",
  "deepseek/deepseek-v3.1-terminus": "DeepSeek V3.1",

  // Qwen
  "Qwen/Qwen3-235B-A22B-fp8-tput": "Qwen 3",
  "qwen/qwen3-max": "Qwen 3 Max",
};

const PARTIAL_MATCHES: [string, string][] = [
  ["gpt-5.2", "GPT-5.2"],
  ["claude-haiku", "Claude Haiku 4.5"],
  ["claude-sonnet", "Claude Sonnet 4.5"],
  ["claude-opus", "Claude Opus 4.5"],
  ["gemini-3-pro-preview", "Gemini 3 Pro"],
  ["gemini-3-flash-preview", "Gemini 3 Flash"],
];

export const getAiModelName = (id: string): string =>
  MODEL_NAME_MAP[id] ??
  PARTIAL_MATCHES.find(([p]) => id.includes(p))?.[1] ??
  id;
