// Stub for `@google/genai`, an optional peer of `@onlyoffice/ai-chat`.
// See missing-peer.mjs.
//
// `ThinkingLevel` is a plain object rather than a throwing proxy: the widget
// reads LOW/MEDIUM/HIGH off it at module scope, to build its reasoning-level
// map, so a stub that threw on property access would fail on import rather
// than on use. The values only ever travel to the Gemini API, which nothing in
// Storybook calls.
import { missingPeer } from "./missing-peer.mjs";

export const GoogleGenAI = missingPeer("@google/genai", "GoogleGenAI");

export const ThinkingLevel = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});
